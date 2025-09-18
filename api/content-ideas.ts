import { GoogleGenAI, Type } from "@google/genai";
import type { ContentIdeasResult } from '../types';

interface VercelRequest {
  method: string;
  body: { productName: string, questions: string[] };
}
interface VercelResponse {
  status: (code: number) => { json: (data: any) => void };
}

const contentIdeasSchema = {
    type: Type.OBJECT,
    properties: {
        blogIdeas: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING } }, required: ["title", "description"] } },
        instagramIdeas: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING } }, required: ["title", "description"] } },
        tiktokIdeas: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING } }, required: ["title", "description"] } }
    },
    required: ["blogIdeas", "instagramIdeas", "tiktokIdeas"]
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }
    const { productName, questions } = req.body;
    if (!productName || !questions || questions.length === 0) {
        return res.status(400).json({ message: 'Product name and questions are required' });
    }
    if (!process.env.API_KEY) {
        return res.status(500).json({ message: 'API key not configured on the server.' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `You are a creative content strategist. For "${productName}", generate 3 blog post ideas, 3 Instagram post ideas, and 3 TikTok video ideas based on these customer questions:\n${questions.map(q => `- "${q}"`).join('\n')}`;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", contents: prompt,
            config: { responseMimeType: "application/json", responseSchema: contentIdeasSchema, temperature: 0.8 }
        });
        const result: ContentIdeasResult = JSON.parse(response.text.trim());
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching content ideas:', error);
        res.status(500).json({ message: 'Failed to get content ideas from Gemini API.' });
    }
}
