import { generateContent } from '../config/gemini.config.js';

export const askGemini = async (prompt) => {
  try {
    const response = await generateContent(prompt);

    if (!response) {
      throw new Error('Gemini returned empty response');
    }
    return response;
  } catch (error) {
    console.error('Gemini Error Details:', {
      message: error.message,
      status: error.status,
      statusText: error.statusText
    });
    if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('API key not valid')) {
      throw new Error('Invalid Gemini API key. Check your .env file.');
    }
    if (error.message?.includes('quota') || error.status === 429) {
      throw new Error('Gemini API quota exceeded. Try again later.');
    }
    if (error.message?.includes('model is not found') || error.message?.includes('models/')) {
      throw new Error('Gemini model not available. Ensure you have access to gemini-2.5-flash.');
    }
    throw new Error('AI service error: ' + error.message);
  }
};