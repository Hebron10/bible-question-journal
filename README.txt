Bible Question Journal — v20.7 Auth Gate Visibility Fix

Baseline: v20.4 Cloud + Google Auth, with the v20.6 OAuth callback handling.

This build fixes the authentication screen remaining visible after successful Google sign-in. The CSS now explicitly hides the auth gate when JavaScript sets the HTML hidden property.

The service-worker cache version is also updated to v20.7 so GitHub Pages does not keep serving the previous cached CSS.

Deployment:
1. Replace the contents of the GitHub Pages repository with this build.
2. Open the HTTPS GitHub Pages URL.
3. Hard refresh with Ctrl+Shift+R after deployment.
4. Test Continue with Google.

Do not open index.html using file:// for OAuth/PWA testing.
