
import { GoogleGenAI, Type } from "@google/genai";

export const generateSchemaFromPrompt = async (prompt: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `You are an expert database architect. Design a canonical JSON schema for the following requirement: "${prompt}".
    
    The schema must follow this structure:
    {
      "tables": [
        {
          "id": "string",
          "name": "string",
          "description": "string",
          "columns": [
            { "id": "string", "name": "string", "type": "uuid|text|varchar|int|timestamp|jsonb", "isPrimaryKey": boolean, "isNullable": boolean }
          ],
          "position": { "x": number, "y": number }
        }
      ],
      "relationships": [
        { "id": "string", "fromTable": "string", "fromColumn": "string", "toTable": "string", "toColumn": "string", "type": "one-to-many|one-to-one|many-to-many" }
      ]
    }
    
    Ensure best practices: use UUIDs for primary keys, follow standard naming conventions, and provide logical spatial positions (X 0-800, Y 0-600).
    Output ONLY the JSON.`,
    config: {
      responseMimeType: "application/json",
    }
  });

  return JSON.parse(response.text || '{}');
};

export const getAISuggestions = async (schemaJson: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this database schema and provide 3-4 specific optimizations (indexes, missing relations, better data types).
    Schema: ${schemaJson}
    
    Return the response in this JSON format:
    [{ "id": "uuid", "type": "index|relation|column|optimization", "title": "string", "description": "string", "rationale": "string", "impact": "low|medium|high" }]`,
    config: {
      responseMimeType: "application/json"
    }
  });
  
  return JSON.parse(response.text || '[]');
};
