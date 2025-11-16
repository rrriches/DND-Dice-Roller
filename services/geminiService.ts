import { GoogleGenAI } from "@google/genai";
import { CriticalState } from "../types";

const getGeminiApiKey = (): string => {
    const key = process.env.API_KEY;
    if (!key) {
        throw new Error("API_KEY environment variable not set.");
    }
    return key;
};

const ai = new GoogleGenAI({ apiKey: getGeminiApiKey() });

export const getFlavorText = async (criticalState: CriticalState, context: string): Promise<string> => {
  if (criticalState === CriticalState.None) {
    return "";
  }

  const action = criticalState === CriticalState.Success
    ? "a spectacular and heroic critical success"
    : "a clumsy or disastrous critical failure";

  const prompt = `You are a creative Dungeon Master for Dungeons & Dragons.
A player has rolled a critical roll and provided context for their action.
Describe the outcome in a single, punchy, and vivid sentence.

Context: "${context}"

Roll Type: ${criticalState === CriticalState.Success ? 'Natural 20 (Critical Success)' : 'Natural 1 (Critical Failure)'}

Description:`;


  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Error fetching flavor text from Gemini:", error);
    return "The weave of magic sputters, and the outcome remains clouded...";
  }
};