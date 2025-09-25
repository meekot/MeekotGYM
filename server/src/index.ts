import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const PORT = Number(process.env.PORT ?? 3333);
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',').map((origin) => origin.trim()).filter(Boolean);

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: allowedOrigins && allowedOrigins.length > 0 ? allowedOrigins : undefined,
  })
);

const apiKey = process.env.GEMINI_API_KEY;
const model = apiKey
  ? new GoogleGenAI({ apiKey }).getGenerativeModel({ model: 'gemini-2.5-flash' })
  : null;

if (!apiKey) {
  console.warn('GEMINI_API_KEY is not set. Exercise suggestions will be disabled.');
}

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/suggest-exercise', async (req, res) => {
  const muscleGroup = (req.body?.muscleGroup as string | undefined)?.trim();

  if (!muscleGroup) {
    return res.status(400).json({ message: 'Muscle group is required.' });
  }

  if (!model) {
    return res.status(500).json({ message: 'Suggestion service is not configured.' });
  }

  try {
    const prompt = `You are a fitness expert. Suggest a single, effective gym exercise for the following muscle group: "${muscleGroup}". Provide only the name of the exercise.`;

    const response = await model.generateContent(prompt);
    const suggestion = response.response?.text()?.trim();

    if (!suggestion) {
      return res.status(500).json({ message: "Couldn't generate a suggestion. Please try again." });
    }

    const cleanedSuggestion = suggestion.replace(/["*`]/g, '');
    res.json({ suggestion: cleanedSuggestion });
  } catch (error) {
    console.error('Error fetching exercise suggestion:', error);
    res.status(500).json({ message: "Couldn't get a suggestion. Please try again later." });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
