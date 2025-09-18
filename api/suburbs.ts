import { GoogleGenAI, Type } from "@google/genai";
import type { SuburbDemandData } from '../types';

interface VercelRequest {
  method: string;
  body: { productName: string, stateFullName: string };
}
interface VercelResponse {
  status: (code: number) => { json: (data: any) => void };
}

const suburbDemandSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            suburb: { type: Type.STRING },
            demandScore: { type: Type.INTEGER }
        },
        required: ["suburb", "demandScore"]
    }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }
    const { productName, stateFullName } = req.body;
    if (!productName || !stateFullName) {
        return res.status(400).json({ message: 'Product name and state are required' });
    }
    if (!process.env.API_KEY) {
        return res.status(500).json({ message: 'API key not configured on the server.' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `As a market analyst, find the top 10 suburbs/cities with the highest search demand for "${productName}" within ${stateFullName}, Australia. Provide a demand score from 1 to 100 for each.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", contents: prompt,
            config: { responseMimeType: "application/json", responseSchema: suburbDemandSchema, temperature: 0.3 }
        });
        const result: SuburbDemandData[] = JSON.parse(response.text.trim());
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching suburb data:', error);
        res.status(500).json({ message: 'Failed to get suburb data from Gemini API.' });
    }
}
