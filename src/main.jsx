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
  "fact-checking": "Fact-checking",
  "general-news": "Noticias generales", "national": "Nacional", "business": "Negocios",
  "government": "Gobierno", "local-news": "Noticias locales", "public-media": "Medios públicos",
  "radio": "Radio", "television": "Televisión", "radio-digital": "Radio y digital", "newspaper": "Periódico", "news-agency": "Agencia de noticias",
  "digital_native": "Medio digital", "digital-native": "Medio digital", "media-directory": "Directorio de medios", "accountability": "Rendición de cuentas",
  "criminal-justice": "Justicia penal", "national-security": "Seguridad nacional", "technology": "Tecnología",
  "privacy": "Privacidad", "gender": "Género", "culture": "Cultura", "immigration": "Inmigración",
  "spanish-language": "En español", "housing": "Vivienda",
  "sports": "Deportes", "magazine": "Revistas y semanarios", "financial-news": "Información financiera", "sports-media": "Medios deportivos",
  "community-media": "Medios comunitarios", "ethnic-media": "Medios de comunidades étnicas",
  "multilingual": "Multilingües", "public-radio": "Radio pública", "media-directory": "Directorio de medios", "discovery-source": "Fuente de descubrimiento", "latin-america": "América Latina e Iberoamérica", "science": "Ciencia", "media": "Medios y periodismo", "conflict": "Conflictos", "humanitarian": "Asuntos humanitarios", "environment": "Medioambiente", "data-journalism": "Periodismo de datos", "citizen-journalism": "Periodismo ciudadano", "regional-news": "Noticias regionales", "diaspora": "Diáspora", "education": "Educación", "disinformation": "Desinformación", "society": "Sociedad", "analysis": "Análisis"
};

const languageLabels = { multi: "Multilingüe", es: "Español", pt: "Português", en: "English", nl: "Nederlands", fr: "Français", de: "Deutsch", sv: "Svenska", no: "Norsk", da: "Dansk", fi: "Suomi", it: "Italiano", el: "Ελληνικά", pl: "Polski", cs: "Čeština", ro: "Română", uk: "Українська", zh: "中文", ru: "Русский", ar: "العربية", hi: "हिन्दी", ur: "اردو", ko: "한국어", ja: "日本語", vi: "Tiếng Việt", tl: "Tagalog", bn: "বাংলা", et: "Eesti", is: "Íslenska", lv: "Latviešu", lt: "Lietuvių", sq: "Shqip", bs: "Bosanski", hr: "Hrvatski", sr: "Српски", sl: "Slovenščina", mt: "Malti", mk: "Македонски", be: "Беларуская", bg: "Български", hu: "Magyar", sk: "Slovenčina", lb: "Lëtzebuergesch", ca: "Català", eu: "Euskara", gl: "Galego", fy: "Frysk", ga: "Gaeilge", mixteco: "Mixteco", triqui: "Triqui" };

function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");
  const [countries, setCountries] = useState(fallbackCountries);
  const [media, setMedia] = useState(fallbackMedia);
  const [categories, setCategories] = useState(fallbackCategories);
  const [loading, setLoading] = useState(true);
  const [selectedContinent, setSelectedContinent] = useState("Todos");
  const [selectedRegion, setSelectedRegion] = useState("Todas");
  const [selectedCountry, setSelectedCountry] = useState("Todas");
  const [selectedLanguage, setSelectedLanguage] = useState("Todas");
  const [states, setStates] = useState([]);
  const [geography, setGeography] = useState([]);
  const [selectedState, setSelectedState] = useState("Todas");
  const [selectedCounty, setSelectedCounty] = useState("Todas");
  const [cityQuery, setCityQuery] = useState("");
  const [showOnlyResults, setShowOnlyResults] = useState(false);
  const [africaDiscoverySources, setAfricaDiscoverySources] = useState([]);

  useEffect(() => {
    const base = import.meta.env.BASE_URL;
    Promise.all([
      fetch(`${base}data/countries.json`).then((r) => r.ok ? r.json() : fallbackCountries),
      fetch(`${base}data/media.json`).then((r) => r.ok ? r.json() : fallbackMedia),
      fetch(`${base}data/media-europe.json`).then((r) => r.ok ? r.json() : []),
      fetch(`${base}data/media-europe-2.json`).then((r) => r.ok ? r.json() : []),
      fetch(`${base}data/media-europe-3.json`).then((r) => r.ok ? r.json() : []),
      fetch(`${base}data/media-europe-4.json`).then((r) => r.ok ? r.json() : []),
      fetch(`${base}data/media-global-1.json`).then((r) => r.ok ? r.json() : []),
      fetch(`${base}data/media-global-2.json`).then((r) => r.ok ? r.json() : []),
      fetch(`${base}data/media-global-3.json`).then((r) => r.ok ? r.json() : []),
      fetch(`${base}data/media-global-4.json`).then((r) => r.ok ? r.json() : []),
      fetch(`${base}data/media-asia-africa-oceania-1.json`).then((r) => r.ok ? r.json() : []),
      fetch(`${base}data/media-africa-1.json`).then((r) => r.ok ? r.json() : []),
      fetch(`${base}data/media-africa-2.json`).then((r) => r.ok ? r.json() : []),
      fetch(`${base}data/media-africa-3.json`).then((r) => r.ok ? r.json() : []),
      fetch(`${base}data/media-india-1.json`).then((r) => r.ok ? r.json() : []),
      fetch(`${base}data/media-china-1.json`).then((r) => r.ok ? r.json() : []),
      fetch(`${base}data/media-china-2.json`).then((r) => r.ok ? r.json() : []),
      fetch(`${base}data/media-japan-koreas-russia-1.json`).then((r) => r.ok ? r.json() : []),
      fetch(`${base}data/media-asia-central-2.json`).then((r) => r.ok ? r.json() : []),
      fetch(`${base}data/media-south-asia-2.json`).then((r) => r.ok ? r.json() : []),
      fetch(`${base}data/media-southeast-asia-2.json`).then((r) => r.ok ? r.json() : []),
      fetch(`${base}data/media-west-asia-2.json`).then((r) => r.ok ? r.json() : []),
      fetch(`${base}data/media-west-asia-local-3.json`).then((r) => r.ok ? r.json() : []),
      fetch(`${base}data/media-oceania-local-2.json`).then((r) => r.ok ? r.json() : []),
      fetch(`${base}data/media-oceania-local-3.json`).then((r) => r.ok ? r.json() : []),
      fetch(`${base}data/categories.json`).then((r) => r.ok ? r.json() : fallbackCategories),
      fetch(`${base}data/us-states.json`).then((r) => r.ok ? r.json() : []),
      fetch(`${base}data/us-geography.json`).then((r) => r.ok ? r.json() : []),
      fetch(`${base}data/discovery-sources-africa.json`).then((r) => r.ok ? r.json() : [])
     ]).then(([countryData, mediaData, europeMediaData, europe2MediaData, europe3MediaData, europe4MediaData, global1MediaData, global2MediaData, global3MediaData, global4MediaData, asiaAfricaOceaniaData, africa1MediaData, africa2MediaData, africa3MediaData, indiaMediaData, chinaMediaData, china2MediaData, northeastAsiaRussiaData, asiaCentral2Data, southAsia2Data, southeastAsia2Data, westAsia2Data, westAsiaLocal3Data, oceaniaLocal2Data, oceaniaLocal3Data, categoryData, stateData, geographyData, africaSourcesData]) => {
      setAfricaDiscoverySources(Array.isArray(africaSourcesData) ? africaSourcesData : []);
      setCountries(Array.isArray(countryData) ? countryData : fallbackCountries);
      setMedia([...(Array.isArray(mediaData) ? mediaData : fallbackMedia), ...(Array.isArray(europeMediaData) ? europeMediaData : []), ...(Array.isArray(europe2MediaData) ? europe2MediaData : []), ...(Array.isArray(europe3MediaData) ? europe3MediaData : []), ...(Array.isArray(europe4MediaData) ? europe4MediaData : []), ...(Array.isArray(global1MediaData) ? global1MediaData : []), ...(Array.isArray(global2MediaData) ? global2MediaData : []), ...(Array.isArray(global3MediaData) ? global3MediaData : []), ...(Array.isArray(global4MediaData) ? global4MediaData : []), ...(Array.isArray(asiaAfricaOceaniaData) ? asiaAfricaOceaniaData : []), ...(Array.isArray(africa1MediaData) ? africa1MediaData : []),
        ...(Array.isArray(africa2MediaData) ? africa2MediaData : []), ...(Array.isArray(africa3MediaData) ? africa3MediaData : []), ...(Array.isArray(indiaMediaData) ? indiaMediaData : []), ...(Array.isArray(chinaMediaData) ? chinaMediaData : []), ...(Array.isArray(china2MediaData) ? china2MediaData : []), ...(Array.isArray(northeastAsiaRussiaData) ? northeastAsiaRussiaData : []), ...(Array.isArray(asiaCentral2Data) ? asiaCentral2Data : []), ...(Array.isArray(southAsia2Data) ? southAsia2Data : []), ...(Array.isArray(southeastAsia2Data) ? southeastAsia2Data : []), ...(Array.isArray(westAsia2Data) ? westAsia2Data : []), ...(Array.isArray(westAsiaLocal3Data) ? westAsiaLocal3Data : []), ...(Array.isArray(oceaniaLocal2Data) ? oceaniaLocal2Data : []), ...(Array.isArray(oceaniaLocal3Data) ? oceaniaLocal3Data : [])]);
      setCategories(Array.isArray(categoryData) ? categoryData.filter((c) => c && (c.id || c.name)) : fallbackCategories);
      setStates(Array.isArray(stateData) ? stateData : []);
      setGeography(Array.isArray(geographyData) ? geographyData : []);
    }).catch(() => {
      setCountries(fallbackCountries);
      setMedia(fallbackMedia);
      setCategories(fallbackCategories);
      setStates([]);
      setGeography([]);
      setAfricaDiscoverySources([]);
    }).finally(() => setLoading(false));
  }, []);

  const countryMap = useMemo(() => Object.fromEntries(countries.map((c) => [c.id, c])), [countries]);
  const stateMap = useMemo(() => Object.fromEntries(states.map((st) => [st.code, st])), [states]);
  const countryOptions = useMemo(() => countries.filter((c) => selectedContinent === "Todos" || c.continent === selectedContinent), [countries, selectedContinent]);
  const regionOptions = useMemo(() => [...new Set(countryOptions.map((c) => c.region).filter(Boolean))].sort((a,b)=>a.localeCompare(b)), [countryOptions]);
  const stateOptions = useMemo(() => [...new Set(media.filter((m) => selectedCountry !== "Todas" && m.country === selectedCountry && (m.admin1_name || (m.state && m.state !== "US"))).map((m) => m.admin1_name || m.state))].sort((a,b)=>a.localeCompare(b)), [media, selectedCountry]);
  const languageOptions = useMemo(() => [...new Set(media.flatMap((m) => m.languages?.length ? m.languages : [m.language]).filter(Boolean))].sort((a,b)=>a.localeCompare(b)), [media]);
  const countyOptions = useMemo(() => selectedCountry === "USA" ? geography.filter((county) => selectedState === "Todas" || county.state === selectedState) : [], [geography, selectedState, selectedCountry]);
  const selectedCountyRecord = useMemo(
    () => geography.find((county) => county.id === selectedCounty),
    [geography, selectedCounty]
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const selectedCategoryId = categories.find((item) => (item.name || item) === category)?.id || Object.entries(categoryLabels).find(([, label]) => label === category)?.[0];

    return media.filter((m) => {
      const country = countryMap[m.country];
      const tags = (m.categories || []).map((id) => categoryLabels[id] || id);
      const stateName = stateMap[m.state]?.name || m.admin1_name || m.state;
      const countyName = m.county || m.county_name || "";
      const text = [m.name, m.city, countyName, stateName, country?.name, country?.region, country?.continent, languageLabels[m.language] || m.language, ...(m.languages || []).map((lang) => languageLabels[lang] || lang), ...tags]
        .filter(Boolean).join(" ").toLowerCase();
      const matchesQuery = !q || text.includes(q);
      const matchesCategory = category === "Todas" || (m.categories || []).includes(selectedCategoryId);
      const matchesContinent = selectedContinent === "Todos" || country?.continent === selectedContinent;
      const matchesCountry = selectedCountry === "Todas" || m.country === selectedCountry;
      const matchesRegion = selectedRegion === "Todas" || country?.region === selectedRegion;
      const matchesState = selectedState === "Todas" || (selectedCountry === "USA" ? m.state === selectedState : (m.admin1_name || m.state) === selectedState);
      const mediaLanguages = m.languages?.length ? m.languages : [m.language].filter(Boolean);
      const matchesLanguage = selectedLanguage === "Todas" || mediaLanguages.includes(selectedLanguage);
      const matchesCounty = selectedCounty === "Todas" || m.county_id === selectedCounty || countyName === selectedCountyRecord?.name;
      const city = String(m.city || "").toLowerCase();
      const matchesCity = !cityQuery.trim() || city.includes(cityQuery.trim().toLowerCase());
      return matchesQuery && matchesCategory && matchesContinent && matchesCountry && matchesRegion && matchesState && matchesCounty && matchesCity && matchesLanguage;
    });
  }, [query, category, selectedContinent, selectedCountry, selectedRegion, selectedState, selectedCounty, cityQuery, selectedLanguage, selectedCountyRecord, media, countryMap, stateMap]);

  return (
    <div className={showOnlyResults ? "app filteredView" : "app"}>
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
          <div className="eyebrow">CATÁLOGO GLOBAL · MEDIOS Y FUENTES DE INFORMACIÓN</div>
          <h1>Un directorio mundial, organizado por país.</h1>
          <p>Los registros se cargan desde archivos JSON del proyecto, separados de la interfaz. Esto permite ampliar el inventario sin reescribir la aplicación.</p>
          <div className="filterPanel" aria-label="Filtros geográficos y temáticos">
            <div className="filterGroup"><label htmlFor="continentFilter">1. Continente</label><select id="continentFilter" value={selectedContinent} onChange={(e) => {setSelectedContinent(e.target.value);setSelectedRegion("Todas");setSelectedCountry("Todas");setSelectedState("Todas");setSelectedCounty("Todas");}}><option value="Todos">Todos los continentes</option>{[...new Set(countries.map(c=>c.continent).filter(Boolean))].sort().map(v=><option key={v}>{v}</option>)}</select></div>
            <div className="filterGroup"><label htmlFor="regionFilter">2. Región del continente</label><select id="regionFilter" value={selectedRegion} onChange={(e) => {setSelectedRegion(e.target.value);setSelectedCountry("Todas");setSelectedState("Todas");setSelectedCounty("Todas");}}><option value="Todas">Todas las regiones</option>{regionOptions.map(v=><option key={v}>{v}</option>)}</select></div>
            <div className="filterGroup"><label htmlFor="countryFilter">3. País</label><select id="countryFilter" value={selectedCountry} onChange={(e) => {setSelectedCountry(e.target.value);setSelectedState("Todas");setSelectedCounty("Todas");}}><option value="Todas">Todos los países</option>{countryOptions.filter(c=>selectedRegion==="Todas"||c.region===selectedRegion).map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
            <div className="filterGroup"><label htmlFor="stateFilter">4. Estado / provincia</label><select id="stateFilter" value={selectedState} onChange={(e)=>{setSelectedState(e.target.value);setSelectedCounty("Todas");}} disabled={selectedCountry==="Todas"||stateOptions.length===0}><option value="Todas">{selectedCountry==="USA"?"Todos los estados":"Todos los estados / provincias"}</option>{selectedCountry==="USA"?states.map(st=><option key={st.code} value={st.code}>{st.name}</option>):stateOptions.map(st=><option key={st}>{st}</option>)}</select></div>
            <div className="filterGroup"><label htmlFor="cityFilter">5. Ciudad / municipio</label><input id="cityFilter" value={cityQuery} onChange={e=>setCityQuery(e.target.value)} placeholder="Escribe una ciudad o municipio..." /></div>
            <div className="filterGroup"><label htmlFor="countyFilter">6. Condado (EE. UU.)</label><select id="countyFilter" value={selectedCounty} onChange={e=>setSelectedCounty(e.target.value)} disabled={selectedCountry!=="USA"||selectedState==="Todas"}><option value="Todas">Todos los condados</option>{countyOptions.map(county=><option key={county.id} value={county.id}>{county.name}</option>)}</select></div>
            <div className="filterGroup"><label htmlFor="languageFilter">7. Idioma</label><select id="languageFilter" value={selectedLanguage} onChange={e=>setSelectedLanguage(e.target.value)}><option value="Todas">Todos los idiomas</option>{languageOptions.map(lang=><option key={lang} value={lang}>{languageLabels[lang]||lang}</option>)}</select></div>
            <div className="filterGroup"><label htmlFor="topicFilter">8. Tema / especialidad</label><select id="topicFilter" value={category} onChange={e=>setCategory(e.target.value)}><option value="Todas">Todos los temas</option>{categories.map(c=><option key={c.id || c}>{c.name || c}</option>)}</select></div>
            <div className="filterGroup searchGroup"><label htmlFor="textSearch">Búsqueda libre</label><input id="textSearch" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Medio, ciudad, país, idioma o palabra clave..." /></div>
          </div>
          <div className="countBar">{loading ? "Cargando inventario..." : `${countries.length} países/áreas · ${media.length} medios en catálogo · ${media.filter((m) => m.country === "USA").length} registros de EE. UU. · ${geography.length.toLocaleString("es-CO")} condados/equivalentes · ${geography.reduce((sum, county) => sum + county.cities.length, 0).toLocaleString("es-CO")} ciudades y localidades de referencia`}</div>
          <div className="filterActions">
            <button type="button" className="applyFilters" onClick={() => {
              setShowOnlyResults(true);
              window.setTimeout(() => document.getElementById("medios")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
            }}>Aplicar filtros · mostrar {results.length} resultados</button>
            <button type="button" className="resetFilters" onClick={() => {
              setQuery("");
              setCategory("Todas");
              setSelectedContinent("Todos");
              setSelectedCountry("Todas");
              setSelectedRegion("Todas");
              setSelectedLanguage("Todas");
              setSelectedState("Todas");
              setSelectedCounty("Todas");
              setCityQuery("");
              setShowOnlyResults(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}>Limpiar filtros y ver todo</button>
          </div>
          {showOnlyResults && <div className="filterNotice" role="status">Vista filtrada: se muestran únicamente los medios que coinciden con tu selección. Puedes modificar los filtros y volver a aplicar.</div>}
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
            {countries.map((c) => <article className="card" key={c.id}><div className="flag">🌐</div><h3>{c.name}</h3><p>{c.continent} · {c.region} · {languageLabels[c.language] || c.language}</p><div className="chips"><span>🌎 Geopolítica</span><span>🟢 Independientes</span></div></article>)}
          </div>
        </section>

        <section id="geografia-eeuu" className="section">
          <div className="sectionHead">
            <div><span className="eyebrow">GEOGRAFÍA DE ESTADOS UNIDOS</span><h2>Condados y localidades</h2></div>
            <span className="count">{geography.length.toLocaleString("es-CO")} condados/equivalentes · {geography.reduce((sum, county) => sum + county.cities.length, 0).toLocaleString("es-CO")} localidades</span>
          </div>
          <p className="geoNote">La base geográfica permite navegar por estado, condado y ciudad. Las localidades son referencias territoriales; no implican que ya exista un medio registrado en cada una.</p>
          {selectedCountyRecord && <article className="card"><h3>{selectedCountyRecord.name}</h3><p>{selectedCountyRecord.state_name} · {selectedCountyRecord.region}</p><div className="chips">{selectedCountyRecord.cities.slice(0, 30).map((city) => <span key={city}>{city}</span>)}</div></article>}
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
                <p>{[m.city, stateMap[m.state]?.name || m.admin1_name || (m.state === "US" ? "Cobertura nacional" : m.state), languageLabels[m.language] || m.language].filter(Boolean).join(" · ")}</p>
                <div className="chips">{(m.categories || []).map((id) => <span key={id}>{categoryLabels[id] || id}</span>)}</div>
                <span className="muted">Estado: {m.status === "pending_verification" ? "pendiente de verificación" : m.status || "sin estado"}</span>
                <a href={m.official_url} target="_blank" rel="noreferrer">Visitar sitio oficial ↗</a>
              </article>;
            })}
          </div>
          {!results.length && <div className="card empty">No hay coincidencias con los filtros actuales.</div>}
        </section>

        <section id="fuentes-africa" className="section">
          <div className="sectionHead">
            <div><span className="eyebrow">FUENTES DE DESCUBRIMIENTO</span><h2>Directorios y mapas de medios africanos</h2></div>
            <span className="count">{africaDiscoverySources.length} fuentes</span>
          </div>
          <p className="geoNote">Estos recursos sirven para localizar y ampliar el catálogo de medios. No se muestran como periódicos ni como medios individuales.</p>
          <div className="grid">
            {africaDiscoverySources.map((source) => <article className="card" key={source.id}>
              <h3>{source.name}</h3>
              <p>{source.description}</p>
              <div className="chips">{(source.focus || []).map((tag) => <span key={tag}>{tag}</span>)}</div>
              <a href={source.url} target="_blank" rel="noreferrer">Abrir directorio ↗</a>
            </article>)}
          </div>
        </section>

        <section id="categorias" className="section">
          <div className="sectionHead"><div><span className="eyebrow">CLASIFICACIÓN</span><h2>Categorías prioritarias</h2></div></div>
          <div className="chips large">{categories.map((c) => <span key={c.id || c}>#{c.name || c}</span>)}</div>
        </section>
      </main>

      <footer><strong>Directorio Mundial</strong> · País → Medio → Categoría → Idioma → URL oficial</footer>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<React.StrictMode><App /></React.StrictMode>);
