import { NextApiRequest, NextApiResponse } from 'next';

const baseUrl = 'https://www.tudominio.com';
const PAGE_SIZE = 10000;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { region, page } = req.query;
  const pageNumber = parseInt(page as string);

  if (!region || isNaN(pageNumber) || pageNumber < 1) {
    return res.status(400).send('Parámetros inválidos');
  }

  const offset = (pageNumber - 1) * PAGE_SIZE;

  const properties = await fetch(`${process.env.API_URL}/api/properties/seo-eligible?region=${region}&offset=${offset}&limit=${PAGE_SIZE}`)
    .then(res => res.json())
    .catch(() => null);

  if (!properties) return res.status(500).send('Error interno');

  const urls = properties.map((p: any) => {
    const slug = `${p.slug || 'propiedad'}-${p.id}`;
    const loc = `${baseUrl}/propiedades/${p.comunidad_slug}/${p.provincia_slug}/${p.ciudad_slug}/${slug}`;
    const imageUrl = p.image_url || (p.photos?.[0] || '');

    return `
    <url>
      <loc>${loc}</loc>
      <lastmod>${new Date(p.updated_at).toISOString()}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.8</priority>
      ${imageUrl ? `<image:image><image:loc>${imageUrl}</image:loc></image:image>` : ''}
    </url>`;
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
          xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
    ${urls.join('\n')}
  </urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
  res.status(200).send(sitemap.trim());
}
