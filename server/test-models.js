import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';

async function test() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: "hello",
    });
    console.log("SUCCESS:", response.text);
  } catch (e) {
    console.log("ERROR:", e.message);
  }
}
test();
