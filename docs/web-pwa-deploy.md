# Nieri Creative Web App / PWA Deploy Plan

This path lets Nieri Creative share a web-app draft before Apple Developer/TestFlight is ready.

## What This Gives You

- A branded web app agents can open in Safari/Chrome.
- Installable PWA metadata for supported browsers.
- Aryeo booking stays external, so Aryeo still owns login, scheduling, payment, and order tracking.
- OpenAI and Aryeo API keys stay on the backend, not in the web app.

## Recommended Hosting Shape

- Backend: Render, Railway, Fly.io, or similar Node host.
- Frontend: Netlify, Vercel, Cloudflare Pages, or static hosting.

The backend must be hosted first, because the web app build bakes in `EXPO_PUBLIC_API_BASE_URL`.

## Backend Host Environment Variables

Set these on the backend host:

```bash
PORT=4000
CORS_ORIGIN=https://your-web-app-domain.com
USE_MOCK_ARYEO=true
ARYEO_API_BASE_URL=https://api.aryeo.com/v1
ARYEO_API_TOKEN=your_aryeo_token
AI_PROVIDER=openai
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-5.4-mini
```

Keep `USE_MOCK_ARYEO=true` until live Aryeo API endpoints are confirmed.

This repo also includes `render.yaml`. Render requires that file to be named `render.yaml` and located at the root of the Git repository. Secret values are marked with `sync: false`, so Render prompts for them instead of storing secrets in source control.

## Frontend Build

Create a production env file:

```bash
cd mobile
cp .env.production.example .env
```

Set:

```bash
EXPO_PUBLIC_API_BASE_URL=https://your-backend-host.example.com
EXPO_PUBLIC_ARYEO_ORDER_FORM_URL=https://niericreative-re-photo-booking.aryeo.com/order
```

Build:

```bash
npm run build:web
```

Deploy the `mobile/dist-web` folder as the static web app.

## Netlify Settings

- Base directory: `mobile`
- Build command: `npm run build:web`
- Publish directory: `mobile/dist-web`

If Netlify asks for the publish directory relative to the base directory, use `dist-web`.

This repo also includes a root `netlify.toml` with those build settings, plus SPA routing and service-worker headers.

## Vercel Settings

- Framework preset: Other
- Root directory: `mobile`
- Build command: `npm run build:web`
- Output directory: `dist-web`

## PWA Files

The build process injects and copies:

- `manifest.webmanifest`
- `service-worker.js`
- `offline.html`
- `icon-192.png`
- `icon-512.png`
- `maskable-icon-512.png`
- `apple-touch-icon.png`

These are generated or copied during `npm run build:web`.

## Current Limitations

- PWA install behavior varies by browser and device.
- Push notifications are not implemented yet.
- Live Aryeo API data is not enabled until endpoint behavior is confirmed.
- For a public production web app, add a privacy policy and support page.

## Step-By-Step Account Flow

1. Push this project to a private GitHub repository.
2. In Render, create a Blueprint from the GitHub repo. Render will read `render.yaml`.
3. Enter the prompted secret values:
   - `ARYEO_API_TOKEN`
   - `OPENAI_API_KEY`
4. Wait for the backend to deploy and copy its `https://...onrender.com` URL.
5. In Netlify, create a new site from the same GitHub repo.
6. Set `EXPO_PUBLIC_API_BASE_URL` to the Render backend URL.
7. Deploy the Netlify site.
8. After Netlify provides a live URL, update Render's `CORS_ORIGIN` from `*` to the Netlify URL for a tighter production setting.
