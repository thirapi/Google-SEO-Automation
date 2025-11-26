import { type NextRequest } from 'next/server'

// Function to get the base URL from the request
function getBaseUrl(req: NextRequest): string {
    const host = req.headers.get('host');
    if (!host) {
        // Fallback for local development or cases where host is not set
        return 'http://localhost:9002';
    }
    // Use https in production, http otherwise
    const protocol = host.startsWith('localhost') ? 'http' : 'https';
    return `${protocol}://${host}`;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sitemap = searchParams.get('sitemap');
  const robots = searchParams.get('robots');
  const google = searchParams.get('google');
  const baseUrl = getBaseUrl(request);

  if (sitemap === '1') {
    // Example static URLs. In a real app, you'd fetch these from a CMS or generate them.
    const staticUrls = [
      '',
      '/about',
      '/services',
      '/contact',
    ];

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticUrls.map((path) => `
  <url>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`;

    return new Response(sitemapContent.trim(), {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  }

  if (robots === '1') {
    const robotsContent = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;

    return new Response(robotsContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }

  if (google) {
    const htmlContent = `<html><head><title></title></head><body>google-site-verification: ${google}</body></html>`;

    return new Response(htmlContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    });
  }

  return new Response('Not Found', { status: 404 });
}
