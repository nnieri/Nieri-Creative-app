# Launch Pickup Notes

Use this as the quick restart point for launching the Nieri Creative app.

## Current Status

- Repository is connected to GitHub: `https://github.com/nnieri/Nieri-Creative-app.git`
- Current branch: `main`
- Backend is configured for Render with `render.yaml`.
- Frontend/PWA is configured for Netlify with `netlify.toml`.
- Web export was checked locally and completed successfully.
- The app currently supports:
  - Aryeo booking link handoff
  - Media/orders/listings from backend or fallback preview data
  - Prep checklist
  - AI listing description tool
  - AI social script tool

## Next Step To Resume

Start with the web/PWA launch path:

1. Log into Render with GitHub.
2. Create a Blueprint/service from the GitHub repo.
3. Add the `OPENAI_API_KEY` secret in Render.
4. Wait for the backend to deploy.
5. Confirm the backend health URL works: `https://your-render-url.onrender.com/health`
6. Log into Netlify with GitHub.
7. Create a new site from the same repo.
8. Set `EXPO_PUBLIC_API_BASE_URL` to the Render backend URL.
9. Deploy the Netlify site.
10. Smoke test booking, media, AI tools, copy buttons, checklist, and mobile browser install behavior.

## Important Launch Notes

- Keep `USE_MOCK_ARYEO=true` for the first hosted draft unless live Aryeo endpoints are confirmed.
- Do not put Aryeo or OpenAI API keys in the mobile app.
- After Netlify provides the live app URL, update Render `CORS_ORIGIN` from `*` to the Netlify URL.
- Add privacy policy and support page before sharing the app broadly.
- Replace placeholder how-to video links before public/customer-facing launch.

## Helpful Docs

- `docs/hosting-next-steps.md`
- `docs/web-pwa-deploy.md`
- `docs/testflight-draft-plan.md`
