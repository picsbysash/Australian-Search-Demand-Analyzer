import type { AnalysisResult, ApiHistoricalDataPoint, ContentIdeasResult, SuburbDemandData } from '../types';

// This function now calls YOUR backend, not Gemini directly.
// It's designed to get both the initial analysis and historical data in one go for efficiency.
export const fetchAnalysisAndHistory = async (productName: string): Promise<{ analysisResult: AnalysisResult, historicalData: ApiHistoricalDataPoint[] }> => {
    // It calls the new serverless function located at /api/analyze
    const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch analysis data.');
    }
    return response.json();
};

// This calls the backend function for suburb data
export const fetchSuburbDemand = async (productName: string, stateFullName: string): Promise<SuburbDemandData[]> => {
    const response = await fetch('/api/suburbs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName, stateFullName }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch suburb data.');
    }
    return response.json();
};

// This calls the backend function for content ideas
export const fetchContentIdeas = async (productName: string, questions: string[]): Promise<ContentIdeasResult> => {
     const response = await fetch('/api/content-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName, questions }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch content ideas.');
    }
    return response.json();
};
