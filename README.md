# Real-estate Sitemap Generator

Sistema dinámico de generación de sitemaps XML para portales inmobiliarios con millones de propiedades.

## Funcionalidades clave
- Sitemaps regionales paginados con hasta 10.000 URLs.
- Índice central con referencia a todos los sitemaps (`sitemap-index.xml`).
- Optimización SEO: frecuencia de cambio, prioridad, etiquetas de imagen, canonical.
- Preparado para integración con Google Search Console.
- Cache mediante headers y posibilidad de usar Redis o similar.

## Rutas
- `/api/sitemap/[region]/[page]` → Sitemap por región y página.
- `/api/sitemap-index` → Índice de todos los sitemaps generados.
