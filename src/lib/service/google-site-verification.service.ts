import { IGoogleSiteVerificationService } from "@/lib/application/services/google-site-verification.service.interface";
import { google } from "googleapis";

export class GoogleSiteVerificationService
  implements IGoogleSiteVerificationService {
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

  async requestVerificationToken(
    siteUrl: string
  ): Promise<{ fileName: string; fileContent: string }> {
    const accessToken = await this.getAccessToken();

    const res = await fetch(
      "https://www.googleapis.com/siteVerification/v1/token",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          site: { type: "SITE", identifier: siteUrl },
          verificationMethod: "FILE",
        }),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(
        `Failed to request verification token: ${res.status} ${text}`
      );
    }

    const data = await res.json();
    return {
      fileName: data.fileName, // contoh: "google5f84cf98cef09ae3.html"
      fileContent: data.token, // contoh: "google-site-verification: google5f84cf98cef09ae3.html"
    };
  }

  async confirmVerification(siteUrl: string): Promise<boolean> {
    const accessToken = await this.getAccessToken();

    const res = await fetch(
      "https://www.googleapis.com/siteVerification/v1/webResource?verificationMethod=FILE",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          site: { type: "SITE", identifier: siteUrl },
        }),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to confirm verification: ${res.status} ${text}`);
    }

    console.log(`Domain verified: ${siteUrl}`);
    return true;
  }
}
