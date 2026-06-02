# Nieri Creative TestFlight Draft Plan

Goal: get a private beta build into TestFlight before preparing for a public App Store launch.

## Current App Status

- Expo React Native MVP is built.
- Backend API exists with Aryeo mock data and live Aryeo-ready service boundaries.
- Aryeo booking URL is configured as `https://niericreative-re-photo-booking.aryeo.com/order`.
- AI endpoints can run in mock mode or OpenAI mode.
- Brand board and app-ready logo are stored in `docs/brand/` and `mobile/assets/brand/`.

## What Nieri Creative Needs To Provide

- Apple Developer Program membership.
- App Store Connect access for whoever uploads the beta build.
- Final app display name, likely `Nieri Creative`.
- Final app icon and splash assets, or approval to generate polished draft assets from the brand board.
- Privacy policy URL and support URL.
- OpenAI API key, stored only in `backend/.env` or the production host secret manager.
- Aryeo API token, stored only in `backend/.env` or the production host secret manager.
- Production backend URL once hosted.
- Internal tester emails for the first TestFlight group.

## Secure Key Handling

Do not paste API keys into chat.

Local development:

1. Copy `backend/.env.example` to `backend/.env`.
2. Paste the Aryeo and OpenAI keys into `backend/.env`.
3. Keep `backend/.env` private. It is ignored by `.gitignore`.

Production:

1. Add `ARYEO_API_TOKEN`, `AI_PROVIDER=openai`, `OPENAI_API_KEY`, and `OPENAI_MODEL` as environment variables on the backend host.
2. Never ship those values in the iPhone app.

## TestFlight Build Steps

1. Confirm the backend runs with production-like env vars.
2. Point `mobile/.env` at the production backend URL.
3. Add final iOS assets: app icon, splash screen, and display name.
4. Generate the iOS project or use Expo EAS Build.
5. Upload a beta build to App Store Connect.
6. Add internal testers.
7. Run a small smoke test:
   - Open app
   - Book a Shoot opens Aryeo
   - Media tab loads listings/orders
   - Copy Link works
   - AI Listing Description generates copy
   - AI Social Script generates copy
   - Prep checklist persists for the session
8. Add external testers only after the internal build is stable.

## Pre-Launch Decisions

- Whether agents need an app login before TestFlight.
- Whether real Aryeo listings should be visible during beta or if the beta uses mock/demo data.
- Whether push notifications are included in TestFlight v1 or deferred.
- Whether the first beta is internal-only or includes a small external agent group.

