# Krishi-AI

AI-assisted smart farming platform focused on practical tools for farmers.

## Features

- Crop disease diagnosis from leaf images
- Multilingual agriculture assistant (Hindi, Odia, English)
- Live mandi price information
- Weather and forecast information
- Voice assistance for regional-language users
- Agricultural government-scheme information

## Tech Stack

**Frontend**
- React
- Vite
- TypeScript
- Tailwind CSS

**Backend**
- Node.js
- Express
- Multer

**AI / APIs**
- Groq / Llama
- Hugging Face vision models
- Gemini API
- Google Cloud Speech-to-Text / Text-to-Speech
- Data.gov.in API

## Project Structure

```text
.
├── src/                 # Frontend application
├── public/              # Static assets
├── backend/             # Express backend
│   ├── server.js
│   └── uploads/         # Temporary uploaded files
├── .env.example
└── README.md
```

## Local Setup

### Requirements

- Node.js 18+
- API keys for the services used by the application

### Frontend

```bash
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

Configure the required environment variables using the provided `.env.example` files. Do not commit real API keys.

## Deployment

A deployed demo is available at:

https://krishi-ai-demo-omega.vercel.app

## Contributors

- Saket Kumar Seth
- Debojeet
- Subhadeep Sharma
- Subhra Padhy
- Aditya Kumar Dutta
- Kritika Sahoo
