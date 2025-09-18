import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import SearchInput from './components/SearchInput';
import ResultsDisplay from './components/ResultsDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import { fetchAnalysisAndHistory } from './services/geminiService';
import type { AnalysisResult, ApiHistoricalDataPoint } from './types';

const App: React.FC = () => {
    const [product, setProduct] = useState<string>('');
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [historicalData, setHistoricalData] = useState<ApiHistoricalDataPoint[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = useCallback(async (searchTerm: string) => {
        if (!searchTerm) {
            setError('Please enter a product name.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);
        setHistoricalData(null);
        setProduct(searchTerm);

        try {
            // Call our single, efficient backend function that gets both sets of data
            const { analysisResult, historicalData } = await fetchAnalysisAndHistory(searchTerm);
            setAnalysisResult(analysisResult);
            setHistoricalData(historicalData);
        } catch (err) {
            console.error(err);
            const errorMessage = (err as Error).message || 'An unknown error occurred.';
            setError(`Failed to analyze demand. ${errorMessage} Please try a different product.`);
            setAnalysisResult(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-2xl md:text-3xl font-light text-slate-300 mb-6">
                        Discover what's trending across Australia.
                    </h2>
                    <SearchInput onSearch={handleSearch} isLoading={isLoading} />
                </div>

                <div className="mt-12">
                    {isLoading && <LoadingSpinner />}
                    {error && (
                         <div className="max-w-3xl mx-auto mt-8 p-4 bg-red-900/50 border border-red-700 rounded-lg text-center">
                            <p className="text-red-300">{error}</p>
                        </div>
                    )}
                    {analysisResult && !isLoading && (
                        <ResultsDisplay
                            result={analysisResult}
                            product={product}
                            historicalData={historicalData}
                            isHistoricalLoading={false} // Loading is now handled by the main isLoading state
                        />
                    )}
                     {!analysisResult && !isLoading && !error && (
                        <div className="text-center text-slate-500 mt-20">
                            <p>Enter a product above to see search demand data.</p>
                            <p className="text-sm mt-2">Examples: "air fryer", "wedding photographer", "matcha powder"</p>
                        </div>
                    )}
                </div>
            </main>
             <footer className="text-center py-6 text-slate-600 text-sm">
                <p>Powered by Google Gemini</p>
            </footer>
        </div>
    );
};

export default App;
