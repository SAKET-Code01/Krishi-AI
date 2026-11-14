# Krishi-AI

Krishi-AI is a team-built smart-farming prototype that brings agriculture guidance, crop-image analysis, voice-assisted interaction, weather and mandi information, and scheme discovery into a web application.

## Implemented application areas

- Agriculture-focused chat workflow using Groq API integration
- Image upload and Hugging Face inference integration for crop-image analysis
- Voice interaction using browser speech recognition/synthesis, with server-side Google Speech services scaffolded in the backend
- Weather, mandi-price and scheme-related frontend workflows with external API integration and fallback data
- React-based multilingual interface (Hindi, Odia, English)

**Data note:** Mandi prices may fall back to mock/sample values when the Data.gov.in API key is unavailable or the external API returns no usable records. A fallback price is not a live market quotation.

## Technology

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js, Express, Multer
- **AI / external services:** Groq, Hugging Face, Gemini, Google Cloud Speech-to-Text / Text-to-Speech, Data.gov.in
- **Tooling:** Git, GitHub, npm

## Repository structure

```text
Krishi-AI/
├── src/                  # React frontend
├── public/               # Static assets
├── backend/
│   ├── server.js         # Express API
│   ├── .env.example      # Backend environment template
│   └── uploads/          # Runtime temporary uploads (git-ignored)
├── .env.example
├── package.json
└── README.md
```

## Local setup (PowerShell)

**Requirements:** Node.js 20+ and npm.

### Frontend

```powershell
npm ci
npm run dev
```

### Backend

```powershell
cd backend
npm ci
Copy-Item .env.example .env
# Edit backend/.env and configure the required server-side API keys.
npm run dev
```

The backend listens on port 3001 by default. Set `CORS_ORIGINS` in `backend/.env` to a comma-separated allowlist containing the exact frontend origins (for example `http://localhost:5173` and your deployed Vercel origin). Do not use `VITE_*` variables for private provider credentials.

## Environment variables

Configure only the integrations you are using in `backend/.env`:

- `GROQ_API_KEY` — agriculture chat
- `HF_API_KEY` — image inference
- `GEMINI_API_KEY` — Gemini-backed workflow
- `DATA_GOV_IN_API_KEY` — market data
- `GOOGLE_APPLICATION_CREDENTIALS` or supported workload identity — Google Cloud speech client authentication
- `CORS_ORIGINS` and `PORT` — backend runtime configuration

Never commit real API keys or Google service-account JSON files. The frontend's `VITE_BACKEND_URL` is a public API URL, not a credential.

## Deployment

The repository includes a deployed demo URL:

https://krishi-ai-demo-omega.vercel.app

A live demo URL alone does not confirm that every external integration is configured or operational. Validate backend health, API credentials, CORS, speech, image inference, and market-data responses after deployment.

## Contribution context

This is a team project. Saket's public project description identifies his team responsibilities as backend/system-flow work, coordination, and deployment support. This does not imply sole authorship of every frontend screen, AI model, or external integration.

## Current limitations

- External API availability and key configuration affect feature availability.
- Mandi fallback data may be mock data and must be labelled as such.
- Speech recognition in the primary browser flow uses the browser Web Speech API; browser and language support vary.
- Validate upload limits, file contents, privacy, rate limiting, and provider costs before production use.

## Contributors

- Saket Kumar Seth
- Debojeet
- Subhadeep Sharma
- Subhra Padhy
- Aditya Kumar Dutta
- Kritika Sahoo
