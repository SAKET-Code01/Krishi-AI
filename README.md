# Krishi AI

Krishi AI is a smart farming project with a React frontend and an Express backend. The app includes crop diagnosis, market prices, weather information, farmer profile storage, reports, and voice-assistant experiments.

## Tech Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui
- Express
- Gemini API
- Google Cloud Speech-to-Text / Text-to-Speech

## Project Structure

```text
.
|- src/          Frontend source
|- public/       Static assets
|- backend/      Express backend
|- index.html    Frontend entry HTML
```

## Prerequisites

- Node.js 18+
- npm
- A Gemini API key
- Google Cloud credentials if you want to use the backend audio endpoint

## Environment Setup

Copy the example file and add your local values:

```sh
cp .env.example .env
```

Required variables:

- `VITE_GEMINI_API_KEY` for frontend Gemini requests
- `GEMINI_API_KEY` for backend Gemini requests
- `PORT` for the backend server

Do not commit your real `.env` file.

## Install

Frontend:

```sh
npm install
```

Backend:

```sh
cd backend
npm install
```

## Run Locally

Frontend:

```sh
npm run dev
```

Backend:

```sh
cd backend
npm run dev
```

## Quality Checks

Frontend checks:

```sh
npm run lint
npm run test
npm run build
```

Backend currently has no automated tests.

## Notes

- The frontend currently uses Gemini directly from the browser.
- The backend exposes an audio-processing endpoint at `/api/process-audio`.
- Uploaded backend audio files are treated as runtime artifacts and should not be committed.

## Contributors

-Saket Kumar Seth
-Debojeet 
-Subhadeep Sharma
-Subhra Padhy
-Kritika Sahoo
-Aditya Kumar Dutta