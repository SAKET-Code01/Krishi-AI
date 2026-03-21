# Krishi AI - Smart Agriculture Platform 🌾

Krishi AI is a comprehensive digital ecosystem designed to empower farmers with AI-driven insights, real-time data, and traditional wisdom.

## 🚀 Key Features

- **Intelligent Crop Doctor**: Upload leaf images to diagnose diseases using advanced Hugging Face vision models. Rejects non-crop images and provides structured treatment advice.
- **AI Agriculture Chat**: Multi-lingual (Hindi, Odia, English) chat assistant for practical farming guidance, powered by Groq and Llama 3.
- **Live Mandi Prices**: Real-time market data from `Data.gov.in` with state and district filtering.
- **Weather & Forecast**: Hyper-local weather updates to plan harvesting and irrigation.
- **Voice Assistant**: Specialized support for regional Odia-speaking farmers using Google Cloud STT/TTS.
- **Government Schemes**: Curated list of agricultural schemes with direct links to official applications.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express, Multer (file handling).
- **AI/ML**: Groq (Llama 3), Hugging Face (Vision), Gemini API.
- **Services**: Google Cloud (Speech-to-Text & Text-to-Speech), Data.gov.in API.

## 📦 Project Structure

```text
.
├── src/            # Frontend Source (React Components, Pages, Contexts)
├── public/         # Static assets
├── backend/        # Express Server
│   ├── server.js   # Main API logic
│   └── uploads/    # Temporary image storage (Git ignored)
└── README.md
```

## ⚙️ Setup & Installation

### 1. Prerequisites
- Node.js 18+
- API Keys for: Groq, Hugging Face, Gemini, and Data.gov.in.

### 2. Environment Variables

Create a `.env` file in the **backend** directory:
```env
GROQ_API_KEY=your_key
HF_API_KEY=your_key
GEMINI_API_KEY=your_key
DATA_GOV_IN_API_KEY=your_key
PORT=3001
```

Create a `.env` file in the **root** directory:
```env
VITE_GEMINI_API_KEY=your_key
```

### 3. Installation

**Frontend:**
```sh
npm install
```

**Backend:**
```sh
cd backend
npm install
```

### 4. Running Locally

**Start Backend (Port 3001):**
```sh
cd backend
npm run dev
```

**Start Frontend (Vite):**
```sh
npm run dev
```

## 📜 Development Notes
- The **Crop Doctor** uses `FormData` for binary image transmission to ensure high accuracy.
- **Local Fallback**: If `Data.gov.in` keys aren't provided, the app serves high-fidelity mock data for demonstration.

## 👥 Contributors
- Saket Kumar Seth
- Debojeet
- Subhadeep Sharma
- Subhra Padhy
- Aditya Kumar Dutta
- Kritika Sahoo