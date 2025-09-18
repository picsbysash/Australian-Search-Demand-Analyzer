
import React from 'react';

interface TrendingTopicsProps {
    topics: string[];
}

const FireIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7.014A8.003 8.003 0 0112 3c1.398 0 2.743.57 3.714 1.543C18.5 7 19 10 19 12c-2 0-2-2-2-2s-.657.343-2.343 2.343z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 14.121A4 4 0 0014.12 9.88m-4.242 4.242L6 18" />
    </svg>
);


const TrendingTopics: React.FC<TrendingTopicsProps> = ({ topics }) => {
    return (
        <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-lg shadow-lg">
            <h4 className="text-xl font-semibold mb-4 text-slate-200 flex items-center">
                <FireIcon />
                Trending Topics
            </h4>
            <ul className="space-y-2">
                {topics.map((topic, index) => (
                    <li key={index} className="flex items-start">
                        <span className="text-amber-400 mr-2 mt-1">&#10148;</span>
                        <span className="text-slate-300">{topic}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TrendingTopics;
