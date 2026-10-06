import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const continents = [
  { id: "americas", name: "América", icon: "🌎", regions: ["Norteamérica", "Centroamérica", "Caribe", "Sudamérica"] },
  { id: "europe", name: "Europa", icon: "🌍", regions: ["Occidental", "Septentrional", "Meridional", "Oriental"] },
  { id: "asia", name: "Asia", icon: "🌏", regions: ["Oriental", "Sudoriental", "Meridional", "Central", "Occidental"] },
  { id: "africa", name: "África", icon: "🌍", regions: ["Septentrional", "Occidental", "Central", "Oriental", "Austral"] },
  { id: "oceania", name: "Oceanía", icon: "🌊", regions: ["Australasia", "Melanesia", "Micronesia", "Polinesia"] }
];

const fallbackCategories = [
  "Geopolítica", "Medios independientes", "Investigación", "Política",
  "Internacional", "Economía", "Derechos humanos", "Fact-checking"
];

const fallbackCountries = [
  { id: "COL", name: "Colombia", continent: "América", region: "Sudamérica", language: "es" },
  { id: "BRA", name: "Brasil", continent: "América", region: "Sudamérica", language: "pt" },
  { id: "ARG", name: "Argentina", continent: "América", region: "Sudamérica", language: "es" },
  { id: "CHL", name: "Chile", continent: "América", region: "Sudamérica", language: "es" },
  { id: "PER", name: "Perú", continent: "América", region: "Sudamérica", language: "es" },
  { id: "ECU", name: "Ecuador", continent: "América", region: "Sudamérica", language: "es" },
  { id: "BOL", name: "Bolivia", continent: "América", region: "Sudamérica", language: "es" },
  { id: "PRY", name: "Paraguay", continent: "América", region: "Sudamérica", language: "es" },
  { id: "URY", name: "Uruguay", continent: "América", region: "Sudamérica", language: "es" },
  { id: "VEN", name: "Venezuela", continent: "América", region: "Sudamérica", language: "es" },
  { id: "GUY", name: "Guyana", continent: "América", region: "Sudamérica", language: "en" },
  { id: "SUR", name: "Surinam", continent: "América", region: "Sudamérica", language: "nl" }
];

const fallbackMedia = [
  { id: "MED-CO-001", name: "La Silla Vacía", country: "COL", language: "es", categories: ["independent-media", "investigative", "geopolitics"], official_url: "https://www.lasillavacia.com/", status: "pending_verification" },
  { id: "MED-CO-002", name: "Vorágine", country: "COL", language: "es", categories: ["independent-media", "investigative", "human-rights"], official_url: "https://voragine.co/", status: "pending_verification" },
  { id: "MED-CO-003", name: "Cuestión Pública", country: "COL", language: "es", categories: ["independent-media", "investigative", "politics"], official_url: "https://cuestionpublica.com/", status: "pending_verification" },
  { id: "MED-CL-001", name: "CIPER", country: "CHL", language: "es", categories: ["investigative", "politics", "economy"], official_url: "https://www.ciperchile.cl/", status: "pending_verification" },
  { id: "MED-PE-001", name: "OjoPúblico", country: "PER", language: "es", categories: ["investigative", "human-rights", "geopolitics"], official_url: "https://ojo-publico.com/", status: "pending_verification" },
  { id: "MED-BR-001", name: "Agência Pública", country: "BRA", language: "pt", categories: ["investigative", "human-rights", "geopolitics"], official_url: "https://apublica.org/", status: "pending_verification" }
];

const categoryLabels = {
  geopolitics: "Geopolítica",
  "independent-media": "Medios independientes",
  investigative: "Investigación",
  politics: "Política",
  international: "Internacional",
  economy: "Economía",
  "human-rights": "Derechos humanos",
  "fact-checking": "Fact-checking"
};

const languageLabels = { es: "Español", pt: "Português", en: "English", nl: "Nederlands", fr: "Français", zh: "中文", ru: "Русский" };

function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");
  const [countries, setCountries] = useState(fallbackCountries);
  const [media, setMedia] = useState(fallbackMedia);
  const [categories, setCategories] = useState(fallbackCategories);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const base = import.meta.env.BASE_URL;
    Promise.all([
      fetch(`${base}data/countries.json`).then((r) => r.ok ? r.json() : fallbackCountries),
      fetch(`${base}data/media.json`).then((r) => r.ok ? r.json() : fallbackMedia),
      fetch(`${base}data/categories.json`).then((r) => r.ok ? r.json() : fallbackCategories)
    ]).then(([countryData, mediaData, categoryData]) => {
      setCountries(Array.isArray(countryData) ? countryData : fallbackCountries);
      setMedia(Array.isArray(mediaData) ? mediaData : fallbackMedia);
      setCategories(Array.isArray(categoryData) ? categoryData.map((c) => c.name || c).filter(Boolean) : fallbackCategories);
    }).catch(() => {
      setCountries(fallbackCountries);
      setMedia(fallbackMedia);
      setCategories(fallbackCategories);
    }).finally(() => setLoading(false));
  }, []);

  const countryMap = useMemo(() => Object.fromEntries(countries.map((c) => [c.id, c])), [countries]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const selectedCategoryId = Object.entries(categoryLabels).find(([, label]) => label === category)?.[0];

    return media.filter((m) => {
      const country = countryMap[m.country];
      const tags = (m.categories || []).map((id) => categoryLabels[id] || id);
      const text = [m.name, country?.name, country?.region, country?.continent, languageLabels[m.language] || m.language, ...tags]
        .filter(Boolean).join(" ").toLowerCase();
      const matchesQuery = !q || text.includes(q);
      const matchesCategory = category === "Todas" || (m.categories || []).includes(selectedCategoryId);
      return matchesQuery && matchesCategory;
    });
  }, [query, category, media, countryMap]);

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">🌎 <span>Directorio</span> Mundial</div>
        <nav>
          <a href="#inicio">Inicio</a>
          <a href="#continentes">Continentes</a>
          <a href="#paises">Países</a>
          <a href="#medios">Medios</a>
          <a href="#categorias">Categorías</a>
        </nav>
      </header>

      <main>
        <section id="inicio" className="hero">
          <div className="eyebrow">FASE 1 · GEOPOLÍTICA + MEDIOS INDEPENDIENTES</div>
          <h1>Un directorio mundial, organizado por país.</h1>
          <p>Los registros se cargan desde archivos JSON del proyecto, separados de la interfaz. Esto permite ampliar el inventario sin reescribir la aplicación.</p>
          <div className="searchRow">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar medio, país, idioma o temática..." />
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option>Todas</option>
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="countBar">{loading ? "Cargando inventario..." : `${countries.length} países/áreas · ${media.length} medios cargados`}</div>
        </section>

        <section id="continentes" className="section">
          <div className="sectionHead">
            <div><span className="eyebrow">EXPLORAR</span><h2>Continentes y regiones</h2></div>
            <span className="count">5 continentes principales</span>
          </div>
          <div className="grid">
            {continents.map((c) => <article className="card" key={c.id}><div className="icon">{c.icon}</div><h3>{c.name}</h3><p>{c.regions.join(" · ")}</p></article>)}
          </div>
        </section>

        <section id="paises" className="section">
          <div className="sectionHead">
            <div><span className="eyebrow">NAVEGACIÓN</span><h2>Países cargados</h2></div>
            <span className="count">{countries.length} registros</span>
          </div>
          <div className="grid">
            {countries.slice(0, 24).map((c) => <article className="card" key={c.id}><div className="flag">🌐</div><h3>{c.name}</h3><p>{c.continent} · {c.region} · {languageLabels[c.language] || c.language}</p><div className="chips"><span>🌎 Geopolítica</span><span>🟢 Independientes</span></div></article>)}
          </div>
        </section>

        <section id="medios" className="section">
          <div className="sectionHead">
            <div><span className="eyebrow">CATÁLOGO</span><h2>Medios y fuentes</h2></div>
            <span className="count">{results.length} resultados</span>
          </div>
          <div className="grid">
            {results.map((m) => {
              const country = countryMap[m.country];
              return <article className="card media" key={m.id || m.name}>
                <div className="mediaTop"><span className="sourceIcon">📰</span><span className="countryTag">{country?.name || m.country}</span></div>
                <h3>{m.name}</h3>
                <p>{languageLabels[m.language] || m.language}</p>
                <div className="chips">{(m.categories || []).map((id) => <span key={id}>{categoryLabels[id] || id}</span>)}</div>
                <span className="muted">Estado: {m.status === "pending_verification" ? "pendiente de verificación" : m.status || "sin estado"}</span>
                <a href={m.official_url} target="_blank" rel="noreferrer">Visitar sitio oficial ↗</a>
              </article>;
            })}
          </div>
          {!results.length && <div className="card empty">No hay coincidencias con los filtros actuales.</div>}
        </section>

        <section id="categorias" className="section">
          <div className="sectionHead"><div><span className="eyebrow">CLASIFICACIÓN</span><h2>Categorías prioritarias</h2></div></div>
          <div className="chips large">{categories.map((c) => <span key={c}>#{c}</span>)}</div>
        </section>
      </main>

      <footer><strong>Directorio Mundial</strong> · País → Medio → Categoría → Idioma → URL oficial</footer>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<React.StrictMode><App /></React.StrictMode>);
