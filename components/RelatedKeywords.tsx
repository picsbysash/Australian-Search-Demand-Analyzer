
import React from 'react';

interface RelatedKeywordsProps {
    keywords: string[];
}

const TagIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2zm0 0v.01" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3l9 9-7 7-9-9 7-7z" />
    </svg>
);

const RelatedKeywords: React.FC<RelatedKeywordsProps> = ({ keywords }) => {
    return (
        <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-lg shadow-lg">
            <h4 className="text-xl font-semibold mb-4 text-slate-200 flex items-center">
                <TagIcon />
                Related Keywords
            </h4>
            <div className="flex flex-wrap gap-2">
                {keywords.map((keyword, index) => (
                    <span key={index} className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm">
                        {keyword}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default RelatedKeywords;
