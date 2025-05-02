import { NextApiRequest, NextApiResponse } from 'next';

const baseUrl = 'https://www.tudominio.com';
const PAGE_SIZE = 10000;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const regionesConteo = {
    andalucia: 102000,
    cataluna: 86000,
    madrid: 130000,
    valencia: 95000,
    aragon: 45000
  };

  const sitemapUrls: string[] = [];
  const today = new Date().toISOString();

  Object.entries(regionesConteo).forEach(([region, total]) => {
    const pages = Math.ceil(total / PAGE_SIZE);

    for (let i = 1; i <= pages; i++) {
      sitemapUrls.push(`
        <sitemap>
          <loc>${baseUrl}/api/sitemap/${region}/${i}</loc>
          <lastmod>${today}</lastmod>
        </sitemap>`);
    }
  });

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
  <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${sitemapUrls.join('\n')}
  </sitemapindex>`;

  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
  res.status(200).send(sitemapIndex.trim());
}
