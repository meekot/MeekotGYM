
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY is not set. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const getExerciseSuggestion = async (muscleGroup: string): Promise<string> => {
  if (!API_KEY) {
    return "API Key not configured.";
  }
  if (!muscleGroup.trim()) {
    return "Please specify a muscle group.";
  }

  try {
    const prompt = `You are a fitness expert. Suggest a single, effective gym exercise for the following muscle group: "${muscleGroup}". Provide only the name of the exercise. For example, if the muscle group is "chest", a good response would be "Bench Press".`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        // Disable thinking for faster, more direct responses
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    const text = response.text.trim();
    
    // Basic cleanup to remove potential markdown or extra quotes
    return text.replace(/["*`]/g, '');

  } catch (error) {
    console.error("Error fetching exercise suggestion:", error);
    return "Couldn't get a suggestion. Please try again.";
  }
};
