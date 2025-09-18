
import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ApiHistoricalDataPoint, HistoricalDataPoint } from '../types';

interface HistoricalTrendChartProps {
    product: string;
    relatedKeywords: string[];
    historicalData: ApiHistoricalDataPoint[] | null;
    isLoading: boolean;
}

const COLORS = ["#38bdf8", "#fbbf24", "#34d399", "#f472b6", "#818cf8", "#a78bfa"];

const transformDataForChart = (data: ApiHistoricalDataPoint[]): HistoricalDataPoint[] => {
    if (!data) return [];
    return data.map(monthlyData => {
        const dataPoint: HistoricalDataPoint = { month: monthlyData.month };
        monthlyData.trends.forEach(trend => {
            dataPoint[trend.keyword] = trend.score;
        });
        return dataPoint;
    });
};

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-3 bg-slate-700 border border-slate-600 rounded-md shadow-lg text-sm">
                <p className="font-bold text-white mb-2">{label}</p>
                {payload.map((pld: any, index: number) => (
                    <div key={index} style={{ color: pld.color }}>
                        {`${pld.name}: ${pld.value}`}
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const HistoricalTrendChart: React.FC<HistoricalTrendChartProps> = ({ product, relatedKeywords, historicalData, isLoading }) => {
    const allKeywords = useMemo(() => [product, ...relatedKeywords], [product, relatedKeywords]);
    const [visibleKeywords, setVisibleKeywords] = useState<Set<string>>(() => new Set([product]));

    const chartData = useMemo(() => {
        return historicalData ? transformDataForChart(historicalData) : [];
    }, [historicalData]);

    const toggleKeyword = (keyword: string) => {
        setVisibleKeywords(prev => {
            const next = new Set(prev);
            if (next.has(keyword)) {
                next.delete(keyword);
            } else {
                next.add(keyword);
            }
            return next;
        });
    };
    
    if (isLoading) {
        return (
             <div className="flex items-center justify-center h-80">
                <div className="w-8 h-8 border-2 border-dashed rounded-full animate-spin border-sky-400"></div>
                <p className="ml-3 text-slate-400">Loading Historical Data...</p>
            </div>
        );
    }

    if (!historicalData || chartData.length === 0) {
        return <div className="text-center text-slate-500 h-80 flex items-center justify-center">Historical trend data is not available.</div>;
    }

    return (
        <div>
            <h4 className="text-xl font-semibold mb-4 text-slate-200">12-Month Search Trend</h4>
            <div className="flex flex-wrap gap-2 mb-4">
                {allKeywords.map((keyword, index) => (
                    <button
                        key={keyword}
                        onClick={() => toggleKeyword(keyword)}
                        className={`px-3 py-1 text-sm rounded-full transition-all duration-200 border ${
                            visibleKeywords.has(keyword)
                                ? 'text-white'
                                : 'text-slate-400 bg-slate-700/50 border-slate-600 hover:bg-slate-700'
                        }`}
                        style={{
                           borderColor: visibleKeywords.has(keyword) ? COLORS[index % COLORS.length] : undefined,
                           backgroundColor: visibleKeywords.has(keyword) ? `${COLORS[index % COLORS.length]}20` : undefined
                        }}
                    >
                        {keyword}
                    </button>
                ))}
            </div>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                        <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                        <YAxis stroke="#94a3b8" domain={[0, 100]} fontSize={12} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        {allKeywords.map((keyword, index) => (
                            visibleKeywords.has(keyword) &&
                            <Line
                                key={keyword}
                                type="monotone"
                                dataKey={keyword}
                                stroke={COLORS[index % COLORS.length]}
                                strokeWidth={2}
                                dot={false}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default HistoricalTrendChart;
