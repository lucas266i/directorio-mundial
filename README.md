# Directorio Mundial

Directorio mundial de medios y fuentes informativas, organizado por continente, región, país, estado/provincia, ciudad, idioma, tipo y especialidad.

## Proyecto
- Frontend: React + Vite.
- Datos: JSON versionados en GitHub.
- Publicación: GitHub Pages mediante GitHub Actions.
- Sin Supabase ni base de datos externa.
- URL oficial obligatoria por medio; RSS opcional.
- Idioma original separado del idioma de lectura.
- Categorías múltiples por fuente.
- Estado de verificación por URL y metadatos.

## Estados Unidos — primera expansión
- `data/us-states.json`: 50 estados + Distrito de Columbia, capitales, regiones y ciudades principales.
- `data/us-media-directory.json`: inventario separado de medios nacionales, estatales y metropolitanos.
- `data/media.json`: catálogo consumido por la interfaz; contiene los registros iniciales de Estados Unidos y otros países.

## Estado de verificación
Los registros recién incorporados usan `pending_verification`. No se debe interpretar su presencia como certificación de independencia, imparcialidad, calidad, actividad reciente o propiedad. Verificar la web oficial, actividad, sede, cobertura, idioma, propiedad y financiación antes de cambiar su estado.

## Ampliación
1. Completar medios nacionales y agencias.
2. Ampliar estado por estado y ciudad por ciudad.
3. Incorporar radios, televisión, prensa étnica, medios en español, medios indígenas, universidades y comunitarios.
4. Añadir RSS y proceso de verificación de enlaces.
5. Replicar el esquema en Canadá, México, Centroamérica, Caribe y Sudamérica; después Europa, Asia, África y Oceanía.

## Desarrollo local
```bash
npm install
npm run dev
```

## Construcción
```bash
npm run build
```
