const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const speech = require('@google-cloud/speech');
const textToSpeech = require('@google-cloud/text-to-speech');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const app = express();
const uploadsDir = path.join(__dirname, 'uploads');

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

const PORT = Number(process.env.PORT) || 3001;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
