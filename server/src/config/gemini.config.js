// server/src/config/gemini.config.js
import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is missing from .env file');
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL_NAME = "gemini-2.5-flash";

console.log('Gemini API Key loaded:', process.env.GEMINI_API_KEY ? 'YES' : 'NO - CHECK .env');
console.log('Gemini Model:', MODEL_NAME);

export const generateContent = async (prompt) => {
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
  });
  return response.text;
};