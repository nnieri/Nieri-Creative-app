# Nieri Creative Client App MVP

This repository contains a simple client-facing MVP for Nieri Creative:

- `mobile/` - Expo iPhone app for booking, media access, prep checklists, how-to videos, and AI marketing helpers.
- `backend/` - Node/Express API that keeps Aryeo and AI credentials off the mobile app.

The app is intentionally light. Aryeo remains the source of truth for ordering, payment, scheduling, customers, and deliverables.

## Run the Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

The API runs on `http://localhost:4000` by default.

Important environment variables live in `backend/.env`:

- `ARYEO_API_TOKEN` - your Aryeo bearer token. Never put this in the mobile app.
- `ARYEO_API_BASE_URL` - the Aryeo API base URL when you are ready for live calls.
- `USE_MOCK_ARYEO` - keep as `true` for mock listings/orders/appointments/media. Set to `false` after adding real Aryeo credentials and confirming endpoint paths.
- `AI_PROVIDER` - keep as `mock` for placeholder copy, or set to `openai` for live generation.
- `OPENAI_API_KEY` - your OpenAI API key. Keep this on the backend only.
- `OPENAI_MODEL` - defaults to `gpt-5.4-mini`, which is a good starting point for low-latency marketing copy.

## Run the Mobile App

```bash
cd mobile
cp .env.example .env
npm install
npm start
```

In another terminal, keep the backend running. For the iOS simulator, `EXPO_PUBLIC_API_BASE_URL=http://localhost:4000` should work. For a physical iPhone, replace `localhost` with your computer's local network IP address.

The Aryeo booking URL is configured in `mobile/.env`:

```bash
EXPO_PUBLIC_ARYEO_ORDER_FORM_URL=https://niericreative-re-photo-booking.aryeo.com/order
```

The app opens Aryeo in a browser flow so Aryeo can handle login, customer association, ordering, payment, and scheduling.

## Replace Mock Aryeo Data

The live integration boundary is in `backend/src/services/aryeoClient.js`.

1. Add your Aryeo token to `backend/.env`.
2. Confirm the real Aryeo API base URL and endpoint paths.
3. Set `USE_MOCK_ARYEO=false`.
4. Update the endpoint paths in `aryeoClient.js` if Aryeo's API routes differ from the placeholders.

The mobile app already reads from these backend endpoints:

- `GET /api/aryeo/listings`
- `GET /api/aryeo/orders`
- `GET /api/aryeo/appointments`
- `GET /api/aryeo/media/:listingId`

## Connect OpenAI

The AI endpoint code lives in `backend/src/services/aiService.js`.

Current endpoints:

- `POST /api/ai/listing-description`
- `POST /api/ai/social-script`

The app uses deterministic placeholder generation while `AI_PROVIDER=mock`.

To use OpenAI:

```bash
cd backend
cp .env.example .env
```

Then edit `backend/.env`:

```bash
AI_PROVIDER=openai
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-5.4-mini
```

Do not put the OpenAI key in `mobile/.env`, app config, or any React Native file. All AI calls should continue going through the backend.

## Brand Reference

The Nieri Creative brand board is stored at `docs/brand/Branding Board_NC.png`, with a reusable summary at `docs/brand/nieri-creative-brand-guide.md`.

App color tokens live in `mobile/src/styles/theme.js` and currently follow the board palette: charcoal `#2c2c2c`, white `#FFFFFF`, Nieri yellow `#FFCF00`, and warm gray `#a09b88`.

## TestFlight Draft

The working launch path is captured in `docs/testflight-draft-plan.md`.

## Web App / PWA Draft

The non-Apple path is captured in `docs/web-pwa-deploy.md`.

Build the web/PWA draft:

```bash
cd mobile
npm run build:web
```

Deploy `mobile/dist-web` as a static site after pointing `EXPO_PUBLIC_API_BASE_URL` at a hosted backend.
