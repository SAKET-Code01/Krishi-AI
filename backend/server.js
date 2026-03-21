const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const speech = require('@google-cloud/speech');
const textToSpeech = require('@google-cloud/text-to-speech');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const rateLimit = require('express-rate-limit');

dotenv.config(); // Loads backend/.env
dotenv.config({ path: path.resolve(__dirname, '..', '.env') }); // Fallback to root .env if needed

const app = express();
const uploadsDir = path.join(__dirname, 'uploads');

const limiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 5, // Limit each IP to 5 requests per second
  message: { error: 'Too many requests, please try again later.', text: 'Krishi AI is busy right now. Please wait a moment.' },
  standardHeaders: true, 
  legacyHeaders: false, 
});

app.use(cors());
app.use(express.json());

fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, _file, cb) => cb(null, `${Date.now()}.wav`),
});

const upload = multer({ storage });

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return null;
  }

  return new GoogleGenerativeAI(apiKey);
};

const safeUnlink = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

app.post('/api/process-audio', upload.single('audio'), async (req, res) => {
  const audioFilePath = req.file?.path;

  if (!audioFilePath) {
    return res.status(400).json({ error: 'Audio file is required' });
  }

  const genAI = getGeminiClient();

  if (!genAI) {
    safeUnlink(audioFilePath);
    return res.status(500).json({ error: 'Server is missing Gemini configuration' });
  }

  try {
    const sttClient = new speech.SpeechClient();
    const ttsClient = new textToSpeech.TextToSpeechClient();
    const audioContent = fs.readFileSync(audioFilePath).toString('base64');

    const sttRequest = {
      audio: { content: audioContent },
      config: {
        encoding: 'LINEAR16',
        sampleRateHertz: 48000,
        languageCode: 'or-IN',
      },
    };

    const [sttResponse] = await sttClient.recognize(sttRequest);
    const transcript = sttResponse.results
      .map((result) => result.alternatives[0].transcript)
      .join('\n');

    if (!transcript) {
      return res.status(400).json({ error: 'Could not understand audio' });
    }

    console.log(`Farmer said: ${transcript}`);

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    const systemPrompt = "You are 'Krushi Sahayaka', a wise agricultural expert from Odisha. Provide advice on rice, pulses, soil health, and weather in native Odia script. ALWAYS prioritize Odia-first thinking and rural traditional wisdom. Keep answers simple, traditional, and helpful.";
    const aiResult = await model.generateContent(`${systemPrompt}\n\nQuestion: ${transcript}`);
    const aiText = aiResult.response.text();

    console.log(`Assistant says: ${aiText}`);

    const ttsRequest = {
      input: { text: aiText },
      voice: { languageCode: 'or-IN', name: 'or-IN-Standard-A', ssmlGender: 'FEMALE' },
      audioConfig: { audioEncoding: 'MP3' },
    };

    const [ttsResponse] = await ttsClient.synthesizeSpeech(ttsRequest);
    const audioBuffer = ttsResponse.audioContent;

    res.json({
      text: aiText,
      audioBase64: audioBuffer.toString('base64'),
      success: true,
    });
  } catch (error) {
    console.error('Process error:', error);
    res.status(500).json({ error: 'Failed to process farming request' });
  } finally {
    safeUnlink(audioFilePath);
  }
});

app.post('/api/chat', limiter, async (req, res) => {
  const { message, systemPrompt } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || apiKey === 'YOUR_GROQ_API_KEY_HERE') {
    return res.json({ text: "Due to network issue, basic advice: check soil moisture and pests.", success: false });
  }

  const defaultSystemPrompt = "You are Krishi AI, an expert agriculture assistant helping farmers with simple, practical, India-focused advice. Keep answers short, clear, and actionable.";

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "llama-3.3-70b-versatile",
        "messages": [
          {
            "role": "system",
            "content": systemPrompt || defaultSystemPrompt
          },
          {
            "role": "user",
            "content": message
          }
        ]
      })
    });

    if (!response.ok) {
        throw new Error('Groq API failure');
    }

    const data = await response.json();
    const aiText = data.choices?.[0]?.message?.content;
    
    if (!aiText) throw new Error("Empty response from Groq");

    res.json({ text: aiText, success: true });
  } catch (error) {
    console.error('Groq Chat error:', error);
    res.json({ text: "Due to network issue, basic advice: check soil moisture and pests.", success: false });
  }
});

app.post('/api/vision', async (req, res) => {
  const { prompt, imageBase64, mimeType } = req.body;

  if (!prompt || !imageBase64) {
    return res.status(400).json({ error: 'Prompt and image are required' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
    return res.status(500).json({ error: 'OpenRouter API key is missing' });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "google/gemini-1.5-flash",
        "messages": [
          {
            "role": "user",
            "content": [
              {
                "type": "text",
                "text": prompt
              },
              {
                "type": "image_url",
                "image_url": {
                  "url": `data:${mimeType || 'image/jpeg'};base64,${imageBase64}`
                }
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('OpenRouter Vision Error:', errorData);
        throw new Error('OpenRouter Vision API failure');
    }

    const data = await response.json();
    const aiText = data.choices[0]?.message?.content || "{}";

    res.json({ text: aiText, success: true });
  } catch (error) {
    console.error('Vision error:', error);
    res.status(500).json({ error: 'Failed to analyze image' });
  }
});

app.post('/api/analyze-image', limiter, upload.single('image'), async (req, res) => {
  const imageFilePath = req.file?.path;

  if (!imageFilePath) {
    return res.status(400).json({ error: 'Image file is required' });
  }

  const apiKey = process.env.HF_API_KEY;

  if (!apiKey || apiKey === 'YOUR_HF_API_KEY_HERE') {
    safeUnlink(imageFilePath);
    return res.json({ text: "This looks like a possible plant disease. Recommended: use neem oil spray and monitor leaves.", success: false });
  }

  try {
    const imageBuffer = fs.readFileSync(imageFilePath);
    
    // We send the buffer directly to HF Vision model
    const response = await fetch("https://api-inference.huggingface.co/models/google/vit-base-patch16-224", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/octet-stream"
      },
      body: imageBuffer,
    });

    if (!response.ok) {
        throw new Error('Hugging Face Vision API failure');
    }

    const data = await response.json();
    
    // Hugging face returns an array of predictions [{ label, score }, ...]
    const topPrediction = data?.[0]?.label || "Unknown Plant";
    const aiText = `Image Analysis Result: Detected primarily as **${topPrediction}**. Wait for further contextual analysis or monitor continuously for specific diseases.`;

    res.json({ text: aiText, success: true, predictions: data });
  } catch (error) {
    console.error('Vision error:', error);
    res.json({ text: "This looks like a possible plant disease. Recommended: use neem oil spray and monitor leaves.", success: false });
  } finally {
    safeUnlink(imageFilePath);
  }
});

const PORT = Number(process.env.PORT) || 3001;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
