import { writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const OUT = resolve("data/news.json");
const MAX_PER_CONTINENT = 100;
const WINDOW_HOURS = 48;
const USER_AGENT = "DirectorioMundialNewsBot/1.0 (+https://lucas266i.github.io/directorio-mundial/)";

const feeds = [
  // América
  { continent:"América", country:"Estados Unidos", source:"NPR", url:"https://feeds.npr.org/1004/rss.xml", topic:"Internacional" },
  { continent:"América", country:"Estados Unidos", source:"AP News", url:"https://apnews.com/hub/world-news?output=rss", topic:"Internacional" },
  { continent:"América", country:"Canadá", source:"CBC News", url:"https://www.cbc.ca/webfeed/rss/rss-world", topic:"Internacional" },
  { continent:"América", country:"Estados Unidos", source:"The Guardian", url:"https://www.theguardian.com/world/rss", topic:"Internacional" },
  { continent:"América", country:"México", source:"Animal Político", url:"https://animalpolitico.com/feed", topic:"Política" },
  { continent:"América", country:"Brasil", source:"Agência Brasil", url:"https://agenciabrasil.ebc.com.br/rss/ultimasnoticias/feed.xml", topic:"Actualidad" },
  { continent:"América", country:"Argentina", source:"Télam / Agencia Noticias", url:"https://www.argentina.gob.ar/noticias/feed", topic:"Actualidad" },
  { continent:"América", country:"Colombia", source:"El Espectador", url:"https://www.elespectador.com/rss/", topic:"Actualidad" },
  { continent:"América", country:"Colombia", source:"La Silla Vacía", url:"https://www.lasillavacia.com/feed/", topic:"Política" },
  { continent:"América", country:"Chile", source:"BioBioChile", url:"https://www.biobiochile.cl/lista/categorias/rss.xml", topic:"Actualidad" },
  { continent:"América", country:"Perú", source:"OjoPúblico", url:"https://ojo-publico.com/rss.xml", topic:"Investigación" },
  { continent:"América", country:"Estados Unidos", source:"Americas Quarterly", url:"https://www.americasquarterly.org/feed/", topic:"América Latina" },
  // Europa
  { continent:"Europa", country:"Reino Unido", source:"BBC News", url:"https://feeds.bbci.co.uk/news/world/rss.xml", topic:"Internacional" },
  { continent:"Europa", country:"Reino Unido", source:"BBC Europe", url:"https://feeds.bbci.co.uk/news/world/europe/rss.xml", topic:"Europa" },
  { continent:"Europa", country:"Alemania", source:"DW", url:"https://rss.dw.com/rdf/rss-en-all", topic:"Internacional" },
  { continent:"Europa", country:"Francia", source:"France 24", url:"https://www.france24.com/en/rss", topic:"Internacional" },
  { continent:"Europa", country:"Reino Unido", source:"The Guardian Europe", url:"https://www.theguardian.com/world/europe-news/rss", topic:"Europa" },
  { continent:"Europa", country:"España", source:" elDiario.es", url:"https://www.eldiario.es/rss/", topic:"Actualidad" },
  { continent:"Europa", country:"Francia", source:"RFI", url:"https://www.rfi.fr/en/rss", topic:"Internacional" },
  { continent:"Europa", country:"Italia", source:"ANSA", url:"https://www.ansa.it/english/news/english_rss.xml", topic:"Actualidad" },
  // Asia
  { continent:"Asia", country:"Catar", source:"Al Jazeera", url:"https://www.aljazeera.com/xml/rss/all.xml", topic:"Internacional" },
  { continent:"Asia", country:"Reino Unido", source:"BBC Asia", url:"https://feeds.bbci.co.uk/news/world/asia/rss.xml", topic:"Asia" },
  { continent:"Asia", country:"India", source:"The Hindu", url:"https://www.thehindu.com/news/international/feeder/default.rss", topic:"Asia" },
  { continent:"Asia", country:"India", source:"Scroll.in", url:"https://scroll.in/latest/rss", topic:"Actualidad" },
  { continent:"Asia", country:"Japón", source:"The Japan Times", url:"https://www.japantimes.co.jp/feed/", topic:"Asia" },
  { continent:"Asia", country:"Corea del Sur", source:"Korea Herald", url:"https://www.koreaherald.com/rss/020.xml", topic:"Asia" },
  { continent:"Asia", country:"Singapur", source:"CNA", url:"https://www.channelnewsasia.com/api/v1/rss-outbound-feed?_format=xml", topic:"Asia" },
  { continent:"Asia", country:"Hong Kong", source:"South China Morning Post", url:"https://www.scmp.com/rss/91/feed", topic:"Asia" },
  // África
  { continent:"África", country:"Reino Unido", source:"BBC Africa", url:"https://feeds.bbci.co.uk/news/world/africa/rss.xml", topic:"África" },
  { continent:"África", country:"Sudáfrica", source:"News24", url:"https://www.news24.com/rss", topic:"Actualidad" },
  { continent:"África", country:"Kenia", source:"The EastAfrican", url:"https://www.theeastafrican.co.ke/tea/rss", topic:"África oriental" },
  { continent:"África", country:"Nigeria", source:"Premium Times", url:"https://www.premiumtimesng.com/feed", topic:"África occidental" },
  { continent:"África", country:"Ghana", source:"Graphic Online", url:"https://www.graphic.com.gh/feed.html", topic:"África occidental" },
  { continent:"África", country:"Marruecos", source:"Hespress English", url:"https://en.hespress.com/feed", topic:"África septentrional" },
  // Oceanía
  { continent:"Oceanía", country:"Australia", source:"ABC News Australia", url:"https://www.abc.net.au/news/feed/51120/rss.xml", topic:"Oceanía" },
  { continent:"Oceanía", country:"Australia", source:"The Guardian Australia", url:"https://www.theguardian.com/australia-news/rss", topic:"Oceanía" },
  { continent:"Oceanía", country:"Nueva Zelanda", source:"RNZ", url:"https://www.rnz.co.nz/rss/national.xml", topic:"Oceanía" },
  { continent:"Oceanía", country:"Australia", source:"SBS News", url:"https://www.sbs.com.au/news/feed", topic:"Oceanía" }
];

function decodeXml(value="") {
  return value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">")
    .replace(/&quot;/g,'"').replace(/&apos;/g,"'")
    .replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi,(_,n)=>String.fromCodePoint(parseInt(n,16)))
    .replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();
}
function tag(item, name) {
  const re = new RegExp("<(?:[a-z0-9_-]+:)?"+name+"(?:\\s[^>]*)?>([\\s\\S]*?)</(?:[a-z0-9_-]+:)?"+name+"\\s*>","i");
  return decodeXml(item.match(re)?.[1] || "");
}
function parseItems(xml) {
  const chunks = [...xml.matchAll(/<(?:item|entry)\b[\s\S]*?<\/(?:item|entry)\s*>/gi)].map(m=>m[0]);
  return chunks.map((item) => {
    const title = tag(item,"title");
    const linkTag = item.match(/<link\b[^>]*href=["']([^"']+)["'][^>]*\/?>/i);
    const linkText = tag(item,"link");
    const url = linkTag?.[1] || linkText || tag(item,"guid");
    const date = tag(item,"pubDate") || tag(item,"published") || tag(item,"updated") || tag(item,"date");
    const description = tag(item,"description") || tag(item,"summary") || tag(item,"content");
    return { title, url, date, description };
  }).filter(x=>x.title && /^https?:\/\//i.test(x.url));
}
function validDate(value) {
  const d = new Date(value);
  return Number.isFinite(d.getTime()) ? d : null;
}
function cleanTitle(value) {
  return value.replace(/\s+/g," ").replace(/\s*[|–-]\s*(BBC|Reuters|AP News|DW|France 24)$/i,"").trim();
}
function keyOf(value) {
  return value.toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^\p{L}\p{N}]+/gu," ").trim().slice(0,180);
}
async function translateToSpanish(text) {
  if (!text || /[áéíóúñ¿¡]/i.test(text) && !/[a-z]{4,}/i.test(text)) return text;
  const endpoint = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=es&dt=t&q="+encodeURIComponent(text.slice(0,450));
  const response = await fetch(endpoint,{headers:{"User-Agent":USER_AGENT},signal:AbortSignal.timeout(12000)});
  if (!response.ok) throw new Error("Translation HTTP "+response.status);
  const payload = await response.json();
  const translated = Array.isArray(payload?.[0]) ? payload[0].map(part=>part?.[0]||"").join("") : "";
  return translated.trim() || text;
}
async function mapLimit(items, limit, fn) {
  const out = new Array(items.length); let next=0;
  await Promise.all(Array.from({length:limit},async()=>{while(true){const i=next++;if(i>=items.length)return;try{out[i]=await fn(items[i],i);}catch{out[i]=null;}}}));
  return out;
}

const cutoff = Date.now() - WINDOW_HOURS*60*60*1000;
const collected = [];
const feedStatus = [];
for (const feed of feeds) {
  try {
    const response = await fetch(feed.url,{headers:{"User-Agent":USER_AGENT,"Accept":"application/rss+xml, application/xml, text/xml, */*"},signal:AbortSignal.timeout(15000)});
    if (!response.ok) throw new Error("HTTP "+response.status);
    const xml = await response.text();
    const items = parseItems(xml);
    let accepted=0;
    for (const item of items) {
      const date=validDate(item.date);
      if (!date || date.getTime()<cutoff || date.getTime()>Date.now()+60*60*1000) continue;
      collected.push({...item,...feed,published_at:date.toISOString(),title:cleanTitle(item.title)});
      accepted++;
    }
    feedStatus.push({source:feed.source,status:"ok",items:accepted});
  } catch(error) {
    feedStatus.push({source:feed.source,status:"error",error:String(error.message).slice(0,120)});
    console.warn("Feed failed:",feed.source,error.message);
  }
}
const unique = new Map();
for (const item of collected) {
  const key=keyOf(item.title);
  if (!key) continue;
  const previous=unique.get(key);
  if (!previous || new Date(item.published_at)>new Date(previous.published_at)) unique.set(key,item);
}
const byContinent = ["América","Europa","Asia","África","Oceanía"];
const final=[];
for (const continent of byContinent) {
  const candidates=[...unique.values()].filter(x=>x.continent===continent)
    .sort((a,b)=>new Date(b.published_at)-new Date(a.published_at));
  const selected=candidates.slice(0,MAX_PER_CONTINENT);
  const translated=await mapLimit(selected,4,async(item,index)=>({
    id:continent.slice(0,3).toUpperCase()+"-"+new Date(item.published_at).toISOString().slice(0,10)+"-"+String(index+1).padStart(3,"0"),
    continent:item.continent,country:item.country,source:item.source,
    title_es:await translateToSpanish(item.title).catch(()=>item.title),
    original_title:item.title,url:item.url,
    summary_es:item.description ? (await translateToSpanish(item.description.slice(0,350)).catch(()=>item.description.slice(0,350))).slice(0,500) : "",
    published_at:item.published_at,original_language:"Detección automática",
    topic:item.topic,rank:index+1,translation_status:"translated_or_original_fallback"
  }));
  final.push(...translated.filter(Boolean));
}
final.sort((a,b)=>byContinent.indexOf(a.continent)-byContinent.indexOf(b.continent)||a.rank-b.rank);
await mkdir(dirname(OUT),{recursive:true});
await writeFile(OUT,JSON.stringify(final,null,2)+"\n","utf8");
console.log(JSON.stringify({generated_at:new Date().toISOString(),total:final.length,by_continent:Object.fromEntries(byContinent.map(c=>[c,final.filter(x=>x.continent===c).length])),feeds:feedStatus},null,2));
