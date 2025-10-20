import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class VerificationController {
  @Get('tiktok-verification.txt')
  async getTikTokVerification(@Res() res: Response) {
    // TikTok Shop verification content - thay thế bằng code thực tế từ TikTok Shop
    const verificationContent = `tiktok-shop-verification: ${process.env.TIKTOK_VERIFICATION_CODE || 'your-verification-code-here'}`;
    
    res.setHeader('Content-Type', 'text/plain');
    res.send(verificationContent);
  }

  @Get('tiktok-shop-verification.txt')
  async getTikTokShopVerification(@Res() res: Response) {
    // Alternative verification file name
    const verificationContent = `tiktok-shop-verification: ${process.env.TIKTOK_VERIFICATION_CODE || 'your-verification-code-here'}`;
    
    res.setHeader('Content-Type', 'text/plain');
    res.send(verificationContent);
  }

  @Get('robots.txt')
  async getRobotsTxt(@Res() res: Response) {
    const baseUrl = process.env.BASE_URL || 'https://290015d80f21121db93ed89814c0bea7.serveo.net';
    const robotsContent = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml`;

    res.setHeader('Content-Type', 'text/plain');
    res.send(robotsContent);
  }

  @Get('sitemap.xml')
  async getSitemap(@Res() res: Response) {
    const baseUrl = process.env.BASE_URL || 'https://290015d80f21121db93ed89814c0bea7.serveo.net';
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/terms</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/privacy</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.send(sitemapContent);
  }
}
