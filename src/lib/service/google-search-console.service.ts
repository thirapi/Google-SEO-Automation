import { IGoogleSearchConsoleService } from "@/lib/application/services/google-search-console.service.interface";
import { google } from "googleapis";

export class GoogleSearchConsoleService implements IGoogleSearchConsoleService {
  private oauth2Client: any;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    this.oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });
  }

  private async getAccessToken(): Promise<string> {
    const { token } = await this.oauth2Client.getAccessToken();
    if (!token) throw new Error("Failed to get access token for Site Verification");
    return token;
  }

  async registerDomain(siteUrl: string): Promise<void> {
    const accessToken = await this.getAccessToken();

    const res = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to register domain: ${res.status} ${text}`);
    }

    console.log(`Domain registered: ${siteUrl}`);
  }

  async submitSitemap(siteUrl: string, sitemapPath?: string): Promise<void> {
    const accessToken = await this.getAccessToken();
    const feedUrl = sitemapPath || `${siteUrl}/sitemap.xml`;

    const res = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(feedUrl)}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to submit sitemap: ${res.status} ${text}`);
    }

    console.log(`Sitemap submitted: ${feedUrl}`);
  }

  // async getSeoData(siteUrl: string, startDate: string, endDate: string): Promise<any> {
  //   const accessToken = await this.getAccessToken();

  //   const res = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`, {
  //     method: "POST",
  //     headers: {
  //       Authorization: `Bearer ${accessToken}`,
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       startDate,
  //       endDate,
  //       dimensions: ["query"],
  //       searchType: "web",
  //     }),
  //   });

  //   if (!res.ok) {
  //     const text = await res.text();
  //     throw new Error(`Failed to get SEO data: ${res.status} ${text}`);
  //   }

  //   return res.json();
  // }
}