import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;
const getAI = () => {
  if (!ai) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set. AI features will be unavailable.");
      return null;
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};


export const getDifferentialDiagnosis = async (symptoms: string, history: string) => {
  try {
    const client = getAI();
    if (!client) {
      return {
        differentialDiagnosis: ["API Key not configured"],
        suggestedTests: [],
        integratedApproach: "Please set GEMINI_API_KEY in .env.local"
      };
    }
    const model = 'gemini-2.5-flash';
    const prompt = `
      Act as an advanced medical AI assistant for a doctor.
      Patient Symptoms: ${symptoms}
      Patient History: ${history}
      
      Provide a response in JSON format with the following structure:
      {
        "differentialDiagnosis": ["Condition A", "Condition B", "Condition C"],
        "suggestedTests": ["Test 1", "Test 2"],
        "integratedApproach": "Brief suggestion combining modern and traditional (Ayurveda/Yoga) advice."
      }
      Do not include markdown formatting like \`\`\`json. Just the raw JSON string.
    `;

    const response = await client.models.generateContent({
      model,
      contents: prompt,
    });

    const text = response.text || "{}";
    // Clean up potential markdown code blocks if the model ignores the instruction
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      differentialDiagnosis: ["API Error - Check Logs"],
      suggestedTests: [],
      integratedApproach: "System unavailable."
    };
  }
};

export const getTrendAnalysis = async (topic: string) => {
  try {
    const client = getAI();
    if (!client) {
      return "API Key not configured. Please set GEMINI_API_KEY in .env.local";
    }
    const model = 'gemini-2.5-flash';
    const prompt = `
      Analyze current global health trends regarding: ${topic}.
      Provide a brief summary (max 50 words) and a list of 3 emerging research areas.
      Return plain text.
    `;

    const response = await client.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to fetch trends at this moment.";
  }
};