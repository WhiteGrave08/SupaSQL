/// <reference types="vite/client" />
import { GoogleGenAI } from "@google/genai";

const getApiKey = () => {
  const key = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;
  if (!key || key === "undefined" || key === "null") {
    throw new Error("VITE_GEMINI_API_KEY is missing or invalid. Please check your .env file and restart the dev server.");
  }
  return key;
};

export const generateSchemaFromPrompt = async (prompt: string) => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });

  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `You are an expert database architect. Design a canonical JSON schema for the following requirement: "${prompt}".
    
    The schema must follow this structure EXACTLY:
    {
      "version": "1.0.0",
      "tables": [
        {
          "id": "string",
          "name": "string",
          "columns": [
            { "id": "string", "name": "string", "type": "uuid|text|varchar|int|timestamp|jsonb", "isPrimaryKey": boolean, "isNullable": boolean }
          ],
          "position": { "x": number, "y": number }
        }
      ],
      "relationships": [
        { "id": "string", "fromTable": "string", "fromColumn": "string", "toTable": "string", "toColumn": "string", "type": "one-to-many|one-to-one" }
      ]
    }
    
    Ensure best practices: use UUIDs for primary keys, follow standard naming conventions, and provide logical spatial positions (X 0-800, Y 0-600).
    Output ONLY the JSON. No markdown blocks.`,
          },
        ],
      },
    ],
  });

  // @ts-ignore
  const text = result.text;
  try {
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch (e) {
    console.error("Failed to parse AI response:", text);
    throw e;
  }
};

export const getAISuggestions = async (schemaJson: string) => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });

  const result = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Analyze this database schema and provide 3-4 specific optimizations (indexes, missing relations, better data types).
    Schema: ${schemaJson}
    
    Return the response in this JSON format:
    [{ "id": "uuid", "type": "index|relation|column|optimization", "title": "string", "description": "string", "rationale": "string", "impact": "low|medium|high" }]
    Output ONLY the JSON. No markdown blocks.`,
          },
        ],
      },
    ],
  });

  // @ts-ignore
  const text = result.text;
  try {
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch (e) {
    console.error("Failed to parse AI suggestions:", text);
    return [];
  }
};
