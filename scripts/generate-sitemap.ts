const fs = require('fs');
const path = require('path');

const tools = [
  { path: '/base64-tool', priority: '0.9', changefreq: 'weekly' },
  { path: '/json-tool', priority: '0.9', changefreq: 'weekly' },
  { path: '/epoch-tool', priority: '0.8', changefreq: 'monthly' },
  { path: '/cron-tool', priority: '0.8', changefreq: 'monthly' },
  { path: '/url-tool', priority: '0.9', changefreq: 'weekly' },
  { path: '/jwt-tool', priority: '0.9', changefreq: 'weekly' },
  { path: '/hash-tool', priority: '0.9', changefreq: 'weekly' },
  { path: '/uuid-tool', priority: '0.8', changefreq: 'monthly' },
  { path: '/regex-tool', priority: '0.9', changefreq: 'weekly' },
  { path: '/color-tool', priority: '0.8', changefreq: 'monthly' },
  { path: '/query-tool', priority: '0.9', changefreq: 'weekly' },
  { path: '/password-tool', priority: '0.9', changefreq: 'weekly' },
  { path: '/sql-tool', priority: '0.9', changefreq: 'weekly' },
  { path: '/postgres-tool', priority: '0.9', changefreq: 'weekly' },
  { path: '/markdown-tool', priority: '0.9', changefreq: 'weekly' },
  { path: '/diff-tool', priority: '0.9', changefreq: 'weekly' },
  { path: '/svg-tool', priority: '0.8', changefreq: 'monthly' },
  { path: '/image-tool', priority: '0.8', changefreq: 'monthly' },
  { path: '/lorem-tool', priority: '0.7', changefreq: 'monthly' },
  { path: '/qr-tool', priority: '0.8', changefreq: 'monthly' },
  { path: '/contrast-tool', priority: '0.8', changefreq: 'monthly' }
];

function generateSitemap() {
  const baseUrl = 'https://devtoolbox.com';
  const currentDate = new Date().toISOString().split('T')[0];
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">`;

  // Add homepage
  sitemap += `
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}" />
  </url>`;

  // Add tool pages
  tools.forEach(tool => {
    sitemap += `
  <url>
    <loc>${baseUrl}${tool.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${tool.changefreq}</changefreq>
    <priority>${tool.priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}${tool.path}" />
    <image:image>
      <image:loc>${baseUrl}/screenshots${tool.path}.png</image:loc>
      <image:title>${tool.path.replace('/tool', '').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Tool</image:title>
      <image:caption>${tool.path.replace('/tool', '').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} developer tool screenshot</image:caption>
    </image:image>
  </url>`;
  });

  sitemap += `
</urlset>`;

  // Write sitemap to public directory
  const publicDir = path.join(__dirname, '../public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
  console.log('Sitemap generated successfully!');
}

generateSitemap();
