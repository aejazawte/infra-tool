import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  // Ensure the API Key is available in your environment variables
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY not found in environment variables. AI features will not work.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateWelcomeEmail = async (fullName: string, username: string, serverName: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "AI Service Unavailable: Please set API_KEY.";

  try {
    const prompt = `
      Write a professional and concise welcome email for a new user on a Linux server.
      
      Details:
      - Name: ${fullName}
      - Username: ${username}
      - Server: ${serverName}
      - Context: This is an internal company server.
      
      The email should include placeholders for their temporary password and instructions to change it upon first login via SSH.
      Keep the tone helpful and technical.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Could not generate email.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating email template. Please try again.";
  }
};

export const suggestUsername = async (fullName: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return fullName.toLowerCase().replace(/\s/g, '.');

  try {
    const prompt = `
      Suggest a standard linux system username for "${fullName}". 
      Return ONLY the username string (lowercase, alphanumeric). 
      Prefer the format: firstinitial.lastname or firstname.lastname.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text?.trim() || fullName.toLowerCase().replace(/\s/g, '');
  } catch (error) {
    return fullName.toLowerCase().replace(/\s/g, '');
  }
};