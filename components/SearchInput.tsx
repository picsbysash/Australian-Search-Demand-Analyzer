
import React, { useState } from 'react';

interface SearchInputProps {
    onSearch: (searchTerm: string) => void;
    isLoading: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch, isLoading }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchTerm);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter a product, e.g., 'wedding photographer'"
                className="flex-grow w-full px-5 py-3 bg-slate-800 border border-slate-700 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none transition duration-200 placeholder-slate-500"
                disabled={isLoading}
            />
            <button
                type="submit"
                className="px-8 py-3 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-md transition duration-200 disabled:bg-slate-700 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={isLoading}
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing...
                    </>
                ) : (
                    'Analyze Demand'
                )}
            </button>
        </form>
    );
};

export default SearchInput;