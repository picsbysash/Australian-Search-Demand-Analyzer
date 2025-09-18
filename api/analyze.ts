import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult, ApiHistoricalDataPoint } from '../types';

// This is a Vercel-style serverless function handler.
// We are defining basic types for the request and response.
interface VercelRequest {
  method: string;
  body: { productName: string };
}
interface VercelResponse {
  status: (code: number) => { json: (data: any) => void };
}

// Schemas are moved from the frontend service to the backend function
const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        demandByState: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { state: { type: Type.STRING }, stateFullName: { type: Type.STRING }, demandScore: { type: Type.INTEGER } }, required: ["state", "stateFullName", "demandScore"] } },
        relatedKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
        trendingTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
        topCustomerQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    required: ["demandByState", "relatedKeywords", "trendingTopics", "topCustomerQuestions"],
};
const historicalDataSchema = {
    type: Type.ARRAY,
    items: { type: Type.OBJECT, properties: { month: { type: Type.STRING }, trends: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { keyword: { type: Type.STRING }, score: { type: Type.INTEGER } }, required: ["keyword", "score"] } } }, required: ["month", "trends"] }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }
    const { productName } = req.body;
    if (!productName) {
        return res.status(400).json({ message: 'Product name is required' });
    }
    if (!process.env.API_KEY) {
        return res.status(500).json({ message: 'API key not configured on the server.' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        // --- 1. Fetch Initial Analysis ---
        const analysisPrompt = `Act as a market research analyst for Australia. For "${productName}", provide: demand score per state (NSW, VIC, QLD, WA, SA, TAS, ACT, NT), 5 related keywords, 3 trending topics, and top 50 customer questions.`;
        const analysisPromise = ai.models.generateContent({
            model: "gemini-2.5-flash", contents: analysisPrompt,
            config: { responseMimeType: "application/json", responseSchema: analysisSchema, temperature: 0.2 },
        });

        // --- 2. Fetch Historical Data in Parallel (after getting keywords from analysis) ---
        const analysisResponse = await analysisPromise;
        const analysisResult: AnalysisResult = JSON.parse(analysisResponse.text);

        const allKeywords = [productName, ...analysisResult.relatedKeywords];
        const historyPrompt = `Analyze 12-month Australian search trend for: ${allKeywords.join(', ')}. Provide scores (1-100) for each keyword per month ("Mmm YYYY").`;
        const historyResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash", contents: historyPrompt,
            config: { responseMimeType: "application/json", responseSchema: historicalDataSchema, temperature: 0.1 },
        });
        const historicalData: ApiHistoricalDataPoint[] = JSON.parse(historyResponse.text);

        // --- 3. Send Both Results Back to the Frontend ---
        res.status(200).json({ analysisResult, historicalData });
    } catch (error) {
        console.error('Error in serverless function:', error);
        res.status(500).json({ message: 'Failed to get data from Gemini API.' });
    }
}
