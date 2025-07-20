// LangGraph + Gemini Flash 2.0 chat flow setup
// You must install: npm install langgraph @google/generative-ai

import { createGraph, runGraph } from 'langgraph';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function geminiChat(prompt) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

const chatGraph = createGraph({
  nodes: [
    {
      id: 'llm',
      run: async ({ input }) => {
        return await geminiChat(input);
      },
    },
  ],
  edges: [
    { from: 'input', to: 'llm' },
    { from: 'llm', to: 'output' },
  ],
});

export async function chatWithGemini(message) {
  const response = await runGraph(chatGraph, { input: message });
  return response;
}
