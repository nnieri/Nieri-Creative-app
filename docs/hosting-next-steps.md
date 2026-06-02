# Hosting Next Steps

Use this checklist to get the Nieri Creative web/PWA draft online without Apple Developer/TestFlight.

## 1. Create A Private GitHub Repo

Render and Netlify work best when connected to a GitHub repository.

Local setup:

```bash
cd "/Users/nceditmachine2/Documents/NC App"
git init
git config user.name "Your Name"
git config user.email "you@example.com"
git add .
git commit -m "Initial Nieri Creative app draft"
```

Then create a private GitHub repo and push this folder to it.

Important: `backend/.env`, `mobile/.env`, and other secret files are ignored by `.gitignore`.

## 2. Deploy Backend On Render

1. Go to Render.
2. Create a Blueprint from the GitHub repo.
3. Render reads `render.yaml`.
4. Enter the prompted secret value:
   - `OPENAI_API_KEY`
5. Wait for deploy to finish.
6. Copy the Render backend URL, which will look like `https://...onrender.com`.
7. Visit `/health` on that URL to confirm the backend is live.

The draft uses mock Aryeo data for listings/orders, so an Aryeo token is not required for this first hosted version.

## 3. Deploy Web App On Netlify

1. Go to Netlify.
2. Create a new site from the same GitHub repo.
3. Netlify reads `netlify.toml`.
4. Add this environment variable in Netlify:

```bash
EXPO_PUBLIC_API_BASE_URL=https://your-render-backend-url.onrender.com
```

5. Deploy.
6. Open the Netlify URL and test:
   - Booking opens Aryeo in a separate tab/window.
   - Media shows listings/orders.
   - AI tools generate copy.
   - Prep checklist works.

## 4. Tighten Backend CORS

After Netlify deploys, update Render:

```bash
CORS_ORIGIN=https://your-netlify-site.netlify.app
```

Then redeploy/restart the backend.

## 5. Later

- Replace mock Aryeo API data with live Aryeo endpoints after endpoint behavior is confirmed.
- Add privacy policy and support page before sharing broadly.
- Return to Apple Developer/TestFlight once the account issue is resolved.
