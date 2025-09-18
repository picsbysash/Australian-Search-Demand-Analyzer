
import React, { useState, useCallback } from 'react';
import { fetchSuburbDemand } from '../services/geminiService';
import type { DemandData, SuburbDemandData } from '../types';
import DemandChart from './DemandChart';

interface LocationAnalysisProps {
    product: string;
    demandByState: DemandData[];
}

const LocationAnalysis: React.FC<LocationAnalysisProps> = ({ product, demandByState }) => {
    const [view, setView] = useState<'states' | 'suburbs'>('states');
    const [selectedState, setSelectedState] = useState<DemandData | null>(null);
    const [suburbData, setSuburbData] = useState<SuburbDemandData[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleStateSelect = useCallback(async (stateData: DemandData) => {
        setSelectedState(stateData);
        setView('suburbs');
        setIsLoading(true);
        setError(null);
        setSuburbData(null);
        try {
            const result = await fetchSuburbDemand(product, stateData.stateFullName);
            setSuburbData(result);
        } catch (err) {
            console.error("Failed to fetch suburb data:", err);
            setError("Could not load suburb data. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [product]);

    const handleBackToStates = () => {
        setView('states');
        setSelectedState(null);
        setSuburbData(null);
        setError(null);
    };
    
    const transformedSuburbData = suburbData?.map(d => ({
        state: d.suburb, // Use 'suburb' for the Y-axis label
        demandScore: d.demandScore,
        stateFullName: d.suburb // Tooltip will show suburb name
    })) || [];


    return (
        <div>
            {view === 'states' && (
                 <div>
                    <h3 className="text-xl font-semibold text-slate-200 text-center">
                       State-level Search Demand for <span className="text-sky-400 capitalize">{product}</span>
                    </h3>
                    <p className="text-center text-slate-400 mb-4 text-sm">Click a bar to drill down into top suburbs</p>
                    <div className="h-[400px]">
                        <DemandChart data={demandByState} onBarClick={handleStateSelect} />
                    </div>
                </div>
            )}

            {view === 'suburbs' && selectedState && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                         <button
                            onClick={handleBackToStates}
                            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-md transition duration-200 text-sm"
                        >
                            &larr; Back to States
                        </button>
                         <h3 className="text-xl font-semibold text-slate-200 text-center">
                            Top Suburbs in <span className="text-sky-400">{selectedState.stateFullName}</span>
                        </h3>
                        <div className="w-28"></div> {/* Spacer */}
                    </div>
                    {isLoading && (
                         <div className="flex items-center justify-center h-96">
                            <div className="w-8 h-8 border-2 border-dashed rounded-full animate-spin border-sky-400"></div>
                            <p className="ml-3 text-slate-400">Fetching Suburb Data...</p>
                        </div>
                    )}
                    {error && (
                        <div className="text-center text-red-400 h-96 flex items-center justify-center">{error}</div>
                    )}
                    {suburbData && (
                        <div className="h-[400px]">
                           <DemandChart data={transformedSuburbData} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default LocationAnalysis;
