# **App Name**: SEO Dynamic King

## Core Features:

- Sitemap Route: Handles requests to /seo?sitemap=1 and generates a dynamic sitemap.xml response with the correct Content-Type.
- Robots.txt Route: Handles requests to /seo?robots=1 and generates a dynamic robots.txt response with the correct Content-Type.
- Google Verification Route: Handles requests to /seo?google=filename and generates a dynamic Google Site Verification HTML file with the correct Content-Type.
- Sitemap Handler: Loads an array of static URLs to be included in the sitemap.xml.
- Robots.txt Handler: Generates a minimal robots.txt file with basic directives.
- Google Verification Handler: Returns an HTML string containing the Google Site Verification code.
- Middleware Rewrite: Rewrites requests to /sitemap.xml, /robots.txt, and /google*.html to the corresponding /seo routes using NextResponse.rewrite().

## Style Guidelines:

- Primary color: Deep Indigo (#3F51B5) to convey trustworthiness and stability in SEO practices.
- Background color: Light Gray (#ECEFF1), a subtle and clean backdrop for clear content presentation (desaturated version of Indigo).
- Accent color: Teal (#009688) to draw attention to important elements, offset against the Indigo and Gray.
- Body and headline font: 'Inter', a sans-serif with a modern, machined, objective, neutral look.
- Simple, geometric icons to represent different SEO functions (sitemap, robots.txt, etc.).
- Clean, minimal layout to ensure easy readability and navigation.
- Subtle transitions and animations on route changes.