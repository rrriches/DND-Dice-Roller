import { GoogleGenAI } from "@google/genai";
import { CriticalState } from "../types";

export const getFlavorText = async (apiKey: string, criticalState: CriticalState, context: string): Promise<string> => {
  if (criticalState === CriticalState.None) {
    return "";
  }
  
  if (!apiKey) {
      return "API key not provided. Please set your Gemini API key to generate flavor text.";
  }

  const ai = new GoogleGenAI({ apiKey });

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
    if (error instanceof Error && error.message.includes('API key not valid')) {
        return "Your Gemini API key is not valid. Please check and save it again.";
    }
    return "The weave of magic sputters, and the outcome remains clouded...";
  }
};