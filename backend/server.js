/ Express server for chatbot API
// Install: npm install express cors dotenv langgraph @google/generative-ai

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { chatWithGemini } from './chat_flow.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chatbot/send', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'No message provided' });
  try {
    const response = await chatWithGemini(message);
    res.json({ response });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get response from Gemini' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Chatbot backend running on port ${PORT}`);
});
