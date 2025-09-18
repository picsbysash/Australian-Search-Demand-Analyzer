
import React, { useState, useCallback } from 'react';
// FIX: Changed HistoricalDataPoint to ApiHistoricalDataPoint to match the expected prop type for HistoricalTrendChart.
import type { AnalysisResult, ApiHistoricalDataPoint, ContentIdeasResult } from '../types';
import { fetchContentIdeas } from '../services/geminiService';

import LocationAnalysis from './LocationAnalysis';
import RelatedKeywords from './RelatedKeywords';
import TrendingTopics from './TrendingTopics';
import CustomerQuestions from './CustomerQuestions';
import HistoricalTrendChart from './HistoricalTrendChart';
import ContentIdeasDisplay from './ContentIdeasDisplay';

interface ResultsDisplayProps {
    result: AnalysisResult;
    product: string;
    // FIX: The historicalData prop should be of type ApiHistoricalDataPoint to match the data structure from the API and expected by the chart component.
    historicalData: ApiHistoricalDataPoint[] | null;
    isHistoricalLoading: boolean;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, product, historicalData, isHistoricalLoading }) => {
    const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
    const [contentIdeas, setContentIdeas] = useState<ContentIdeasResult | null>(null);
    const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);
    const [ideasError, setIdeasError] = useState<string | null>(null);

    const handleQuestionSelectionChange = (newSelection: string[]) => {
        setSelectedQuestions(newSelection);
    };

    const handleGenerateIdeas = useCallback(async () => {
        if (selectedQuestions.length === 0) {
            setIdeasError("Please select at least one question to generate ideas.");
            return;
        }
        setIsGeneratingIdeas(true);
        setIdeasError(null);
        setContentIdeas(null);
        try {
            const ideas = await fetchContentIdeas(product, selectedQuestions);
            setContentIdeas(ideas);
        } catch (error) {
            console.error("Failed to generate content ideas:", error);
            setIdeasError("Sorry, we couldn't generate content ideas at the moment. Please try again.");
        } finally {
            setIsGeneratingIdeas(false);
        }
    }, [product, selectedQuestions]);

    return (
        <div className="space-y-12 animate-fade-in">
             <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-lg shadow-lg">
                <LocationAnalysis product={product} demandByState={result.demandByState} />
            </div>
            
            <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-lg shadow-lg">
                <HistoricalTrendChart 
                    product={product} 
                    relatedKeywords={result.relatedKeywords} 
                    historicalData={historicalData} 
                    isLoading={isHistoricalLoading} 
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <RelatedKeywords keywords={result.relatedKeywords} />
                 <TrendingTopics topics={result.trendingTopics} />
            </div>

            <div>
                <CustomerQuestions 
                    questions={result.topCustomerQuestions} 
                    onSelectionChange={handleQuestionSelectionChange}
                />
                <div className="mt-4 text-center">
                    <button
                        onClick={handleGenerateIdeas}
                        disabled={selectedQuestions.length === 0 || isGeneratingIdeas}
                        className="px-8 py-3 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-semibold rounded-md transition duration-200 disabled:bg-slate-700 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                    >
                         {isGeneratingIdeas ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating Ideas...
                            </>
                        ) : (
                            'Generate Content Ideas'
                        )}
                    </button>
                    { !isGeneratingIdeas && <p className="text-sm text-slate-500 mt-2">Select questions above to generate ideas</p>}
                </div>

                {ideasError && <p className="text-red-400 text-center mt-4">{ideasError}</p>}
                {contentIdeas && <ContentIdeasDisplay ideas={contentIdeas} />}
            </div>
        </div>
    );
};

export default ResultsDisplay;
