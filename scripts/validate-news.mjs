import { readFile, writeFile } from "node:fs/promises";

const NEWS_FILE = "data/news.json";
const REPORT_FILE = "data/news-validation.json";
const CONCURRENCY = 12;
const TIMEOUT_MS = 12000;
const USER_AGENT = "Mozilla/5.0 (compatible; DirectorioMundialNewsBot/1.0; +https://lucas266i.github.io/directorio-mundial/)";

function isArticleUrl(raw) {
  try {
    const u = new URL(raw);
    if (!["http:","https:"].includes(u.protocol)) return false;
    if (!u.hostname.includes(".")) return false;
    if (/^(feeds?|rss)\./i.test(u.hostname)) return false;
    const path = u.pathname.toLowerCase();
    if (path === "/" || /(?:^|\/)(?:rss|feed|feeds)(?:\/|\.|$)/i.test(path)) return false;
    if (/\.(?:xml|rss|atom)$/i.test(path)) return false;
    return true;
  } catch {
    return false;
  }
}

function looksSpanish(title = "") {
  if (/[áéíóúñ¿¡]/i.test(title)) return true;
  const words = title.match(/\b(?:el|la|los|las|de|del|que|para|por|con|una|uno|un|en|y|según|tras|desde|sobre|ante|entre|más|como|sus|su|al|es|son|se|ha|han|no|pero|fue|será|está|están|dice|según)\b/gi) || [];
  return words.length >= 2;
}

async function verify(item) {
  if (!isArticleUrl(item.url)) return { ok:false, reason:"not_an_article_url" };
  if (!looksSpanish(item.title_es)) return { ok:false, reason:"headline_not_detectably_spanish" };

  try {
    const response = await fetch(item.url, {
      method:"GET",
      redirect:"follow",
      headers:{
        "User-Agent":USER_AGENT,
        "Accept":"text/html,application/xhtml+xml,application/pdf;q=0.9,*/*;q=0.8",
        "Accept-Language":"es,en;q=0.8"
      },
      signal:AbortSignal.timeout(TIMEOUT_MS)
    });
    const status = response.status;
    const finalUrl = response.url || item.url;
    const contentType = (response.headers.get("content-type") || "").toLowerCase();
    try { await response.body?.cancel(); } catch {}
    if (status < 200 || status >= 300) return { ok:false, reason:"http_"+status, status };
    if (!isArticleUrl(finalUrl)) return { ok:false, reason:"redirected_to_feed_or_non_article", status };
    if (/rss|atom|xml|rdf/.test(contentType)) return { ok:false, reason:"feed_content_type", status };
    if (!/(text\/html|application\/xhtml\+xml|application\/pdf|text\/plain)/.test(contentType)) {
      return { ok:false, reason:"unexpected_content_type", status, contentType };
    }
    return { ok:true, status, url:finalUrl };
  } catch (error) {
    return { ok:false, reason:error?.name === "TimeoutError" ? "timeout" : "request_failed", detail:String(error?.message || error).slice(0,120) };
  }
}

const items = JSON.parse(await readFile(NEWS_FILE,"utf8"));
let next = 0;
const results = new Array(items.length);
await Promise.all(Array.from({length:CONCURRENCY}, async () => {
  while (true) {
    const index = next++;
    if (index >= items.length) return;
    results[index] = await verify(items[index]);
  }
}));

const seen = new Set();
const verified = [];
const reasons = {};
const byContinent = {};
for (let i=0;i<items.length;i++) {
  const item = items[i];
  const result = results[i] || {ok:false,reason:"no_result"};
  if (!result.ok) {
    reasons[result.reason] = (reasons[result.reason] || 0) + 1;
    continue;
  }
  const canonical = result.url.replace(/[?#].*$/,"").replace(/\/$/,"").toLowerCase();
  if (seen.has(canonical)) {
    reasons.duplicate_article_url = (reasons.duplicate_article_url || 0) + 1;
    continue;
  }
  seen.add(canonical);
  verified.push({
    ...item,
    url:result.url,
    link_status:"verified",
    link_http_status:result.status,
    link_checked_at:new Date().toISOString()
  });
  byContinent[item.continent] = (byContinent[item.continent] || 0) + 1;
}
verified.sort((a,b) => {
  const order = ["América","Europa","Asia","África","Oceanía"];
  return order.indexOf(a.continent)-order.indexOf(b.continent) || (a.rank||999)-(b.rank||999);
});
const report = {
  checked_at:new Date().toISOString(),
  total_candidates:items.length,
  total_verified:verified.length,
  removed:items.length-verified.length,
  verified_by_continent:Object.fromEntries(["América","Europa","Asia","África","Oceanía"].map(c=>[c,byContinent[c]||0])),
  removed_reasons:reasons
};
if (verified.length === 0) throw new Error("No individual article links passed validation.");
await writeFile(NEWS_FILE,JSON.stringify(verified,null,2)+"\n","utf8");
await writeFile(REPORT_FILE,JSON.stringify(report,null,2)+"\n","utf8");
console.log(JSON.stringify(report,null,2));
