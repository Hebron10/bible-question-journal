Bible Question Journal — v20.3 PWA Installability Fix

This build keeps the v20.2 branding and functionality unchanged and strengthens the PWA installation metadata.

IMPORTANT: A PWA must be served from HTTPS (such as GitHub Pages). Opening index.html directly from a ZIP/file:// will NOT allow service workers or PWA installation.

Deployment:
1. Upload/extract the contents of this folder to the root of the GitHub Pages site (do not upload the ZIP as the site itself).
2. Open the HTTPS GitHub Pages URL.
3. In Chrome/Edge, use the browser Install App button/menu when it appears.

PWA metadata now explicitly declares:
- id
- start_url
- scope
- standalone display
- display_override
- 192x192 and 512x512 any + maskable icons
- service-worker scope registration


v20.5 OAuth fix:
- Google OAuth redirects to the production GitHub Pages URL.
- OAuth authorization-code callbacks are explicitly exchanged for a Supabase session.
- The callback URL is cleaned after successful sign-in.
- v20.4 UI, cloud schema, Bible sources, and journal functionality are otherwise unchanged.
