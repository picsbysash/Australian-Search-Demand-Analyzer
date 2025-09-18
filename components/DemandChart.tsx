
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { DemandData } from '../types';

interface DemandChartProps {
    data: (DemandData | { state: string, demandScore: number, stateFullName: string })[];
    onBarClick?: (data: DemandData | any) => void;
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-2 bg-slate-700 border border-slate-600 rounded-md shadow-lg">
                <p className="font-bold text-white">{`${payload[0].payload.stateFullName || label}`}</p>
                <p className="text-sky-300">{`Demand Score: ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};


const DemandChart: React.FC<DemandChartProps> = ({ data, onBarClick }) => {
    const sortedData = [...data].sort((a, b) => b.demandScore - a.demandScore);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={sortedData}
                margin={{
                    top: 5,
                    right: 20,
                    left: -10,
                    bottom: 5,
                }}
                layout="vertical"
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" />
                <YAxis dataKey="state" type="category" stroke="#94a3b8" width={80} interval={0} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#334155' }}/>
                <Legend wrapperStyle={{ color: '#e2e8f0' }} />
                <Bar 
                    dataKey="demandScore" 
                    name="Demand Score" 
                    fill="#38bdf8" 
                    onClick={(data) => onBarClick && onBarClick(data)}
                    cursor={onBarClick ? 'pointer' : 'default'}
                />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default DemandChart;
