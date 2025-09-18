
import React from 'react';

const LoadingSpinner: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center space-y-4 py-10">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-sky-500"></div>
            <p className="text-slate-400 text-lg">Analyzing search trends...</p>
        </div>
    );
};

export default LoadingSpinner;
