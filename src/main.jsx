import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const continents = [
  { id: "americas", name: "América", icon: "🌎", regions: ["Norteamérica", "Centroamérica", "Caribe", "Sudamérica"] },
  { id: "europe", name: "Europa", icon: "🌍", regions: ["Occidental", "Septentrional", "Meridional", "Oriental"] },
  { id: "asia", name: "Asia", icon: "🌏", regions: ["Oriental", "Sudoriental", "Meridional", "Central", "Occidental"] },
  { id: "africa", name: "África", icon: "🌍", regions: ["Septentrional", "Occidental", "Central", "Oriental", "Austral"] },
  { id: "oceania", name: "Oceanía", icon: "🌊", regions: ["Australasia", "Melanesia", "Micronesia", "Polinesia"] }
];

const categories = [
  "Geopolítica",
  "Medios independientes",
  "Investigación",
  "Política",
  "Internacional",
  "Economía",
  "Derechos humanos",
  "Fact-checking"
];

const featuredCountries = [
  ["🇨🇴", "Colombia", "Sudamérica", "Español"],
  ["🇧🇷", "Brasil", "Sudamérica", "Português"],
  ["🇲🇽", "México", "Centroamérica", "Español"],
  ["🇺🇸", "Estados Unidos", "Norteamérica", "English"],
  ["🇨🇳", "China", "Asia Oriental", "中文"],
  ["🇷🇺", "Rusia", "Europa Oriental", "Русский"],
  ["🇪🇸", "España", "Europa Meridional", "Español"],
  ["🇫🇷", "Francia", "Europa Occidental", "Français"]
];

const demoMedia = [
  { name: "La Silla Vacía", country: "Colombia", language: "Español", tags: ["Medios independientes", "Investigación", "Geopolítica"], url: "https://www.lasillavacia.com/" },
  { name: "Vorágine", country: "Colombia", language: "Español", tags: ["Medios independientes", "Investigación", "Derechos humanos"], url: "https://voragine.co/" },
  { name: "Cuestión Pública", country: "Colombia", language: "Español", tags: ["Medios independientes", "Investigación", "Política"], url: "https://cuestionpublica.com/" },
  { name: "CIPER", country: "Chile", language: "Español", tags: ["Investigación", "Política", "Economía"], url: "https://www.ciperchile.cl/" },
  { name: "OjoPúblico", country: "Perú", language: "Español", tags: ["Investigación", "Derechos humanos", "Geopolítica"], url: "https://ojo-publico.com/" },
  { name: "Agência Pública", country: "Brasil", language: "Português", tags: ["Investigación", "Derechos humanos", "Geopolítica"], url: "https://apublica.org/" }
];

function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return demoMedia.filter((m) => {
      const text = [m.name, m.country, m.language, ...m.tags].join(" ").toLowerCase();
      const matchesQuery = !q || text.includes(q);
      const matchesCategory = category === "Todas" || m.tags.includes(category);
      return matchesQuery && matchesCategory;
    });
  }, [query, category]);

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
          <p>Primero construimos el núcleo: fuentes geopolíticas y medios independientes dentro de cada país. Después ampliaremos el catálogo a nuevas categorías y 20.000+ fuentes.</p>
          <div className="searchRow">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar medio, país, idioma o temática..." />
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option>Todas</option>
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </section>

        <section id="continentes" className="section">
          <div className="sectionHead">
            <div>
              <span className="eyebrow">EXPLORAR</span>
              <h2>Continentes y regiones</h2>
            </div>
            <span className="count">5 continentes principales</span>
          </div>
          <div className="grid">
            {continents.map((c) => (
              <article className="card" key={c.id}>
                <div className="icon">{c.icon}</div>
                <h3>{c.name}</h3>
                <p>{c.regions.join(" · ")}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="paises" className="section">
          <div className="sectionHead">
            <div>
              <span className="eyebrow">NAVEGACIÓN</span>
              <h2>Países prioritarios</h2>
            </div>
            <span className="count">Sin límite artificial en países grandes</span>
          </div>
          <div className="grid">
            {featuredCountries.map(([flag, name, region, language]) => (
              <article className="card" key={name}>
                <div className="flag">{flag}</div>
                <h3>{name}</h3>
                <p>{region} · {language}</p>
                <div className="chips">
                  <span>🌎 Geopolítica</span>
                  <span>🟢 Independientes</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="medios" className="section">
          <div className="sectionHead">
            <div>
              <span className="eyebrow">CATÁLOGO</span>
              <h2>Medios de referencia</h2>
            </div>
            <span className="count">{results.length} resultados</span>
          </div>
          <div className="grid">
            {results.map((m) => (
              <article className="card media" key={m.name}>
                <div className="mediaTop">
                  <span className="sourceIcon">📰</span>
                  <span className="countryTag">{m.country}</span>
                </div>
                <h3>{m.name}</h3>
                <p>{m.language}</p>
                <div className="chips">{m.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                <a href={m.url} target="_blank" rel="noreferrer">Visitar sitio oficial ↗</a>
              </article>
            ))}
          </div>
        </section>

        <section id="categorias" className="section">
          <div className="sectionHead">
            <div>
              <span className="eyebrow">CLASIFICACIÓN</span>
              <h2>Categorías prioritarias</h2>
            </div>
          </div>
          <div className="chips large">
            {categories.map((c) => <span key={c}>#{c}</span>)}
          </div>
        </section>
      </main>

      <footer>
        <strong>Directorio Mundial</strong> · País → Medio → Categoría → Idioma → URL oficial
      </footer>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode><App /></React.StrictMode>
);
