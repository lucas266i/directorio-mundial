# DIRECTORIO MUNDIAL DE MEDIOS

Plataforma pública, multilingüe y ampliable para descubrir medios de comunicación por geografía, idioma, tipo, especialidad, propiedad y financiación.

## Sitio web
https://lucas266i.github.io/directorio-mundial/

## Arquitectura
- React + Vite.
- Datos abiertos y versionados en `data/*.json`.
- GitHub Pages.
- GitHub Actions construye y publica automáticamente cada cambio enviado a `main`.
- Sin servidor ni base de datos de pago para la primera etapa.
- El catálogo de medios está separado de la interfaz.

## Jerarquía global
Continente → región → país → subdivisión administrativa → condado/distrito → ciudad/localidad → medio.

La profundidad administrativa cambia por país. En Estados Unidos se utiliza estado → county o equivalente → ciudad/place. En otros países se usarán sus divisiones administrativas oficiales (provincia, departamento, región, municipio, distrito, etc.).

## Estados Unidos: base territorial inicial
- `data/us-states.json`: 50 estados y District of Columbia.
- `data/us-geography.json`: 3.142 condados/equivalentes y 33.034 ciudades/localidades de referencia.
- `data/us-media-directory.json`: catálogo de medios estadounidenses.
- `data/media.json`: catálogo principal consumido por la interfaz.

La base de localidades se incorporó desde el proyecto público [List of US States, Counties and Cities in JSON format](https://github.com/gfrancomontero/List-of-US-States-Counties-and-Cities-in-JSON-format), distribuido bajo licencia MIT. Es una referencia geográfica comunitaria: para análisis oficiales y cambios de límites se debe contrastar con Census Bureau TIGER/Line y Gazetteer.

## Catálogo de medios
Cada medio debe tener, como mínimo:
- identificador único y nombre;
- país y ubicación administrativa;
- ciudad/condado cuando estén documentados;
- idioma original y otros idiomas de publicación;
- tipo de medio y categorías temáticas;
- URL oficial y RSS cuando exista;
- estado de actividad y verificación;
- fuente de descubrimiento y fecha de última comprobación.

Campos recomendados adicionales:
- propietario/controlador y estructura societaria;
- financiación, subvenciones, publicidad y donaciones;
- organización jurídica y condición sin ánimo de lucro;
- cobertura geográfica y audiencia;
- línea editorial declarada, correcciones y transparencia;
- perfiles sociales y contacto editorial público.

No se presume independencia, neutralidad ni calidad por la autodescripción del medio. Esos atributos requieren evidencia separada y notas de metodología.

## Estados de verificación
- `pending_verification`: identificado, todavía no auditado.
- `verified_active`: URL oficial y actividad comprobadas.
- `inactive`: publicación inactiva o cerrada.
- `broken_url`: enlace roto.
- `needs_review`: datos contradictorios o insuficientes.

## Cómo agregar un medio
1. Editar `data/media.json` y/o `data/us-media-directory.json`.
2. Asignar un ID único.
3. Documentar URL oficial, idioma, país, estado, condado y ciudad cuando corresponda.
4. Agregar categorías existentes en `data/categories.json`; crear nuevas cuando sean necesarias.
5. Mantener `pending_verification` hasta comprobar la fuente.
6. Enviar los cambios a `main`. GitHub Actions reconstruye y publica el sitio.

## Expansión por etapas
1. Completar Estados Unidos, estado por estado, condado por condado y ciudad por ciudad.
2. Incorporar medios en español, indígenas, asiáticos, árabes, europeos y otras comunidades lingüísticas dentro de EE. UU.
3. Incorporar Canadá, México, Centroamérica, Caribe y Sudamérica.
4. Incorporar Europa, África, Asia y Oceanía.
5. Añadir verificación automática de enlaces, RSS, filtros avanzados y páginas individuales de medios.

## Desarrollo local
```bash
npm install
npm run dev
```

## Construcción de producción
```bash
npm run build
```
