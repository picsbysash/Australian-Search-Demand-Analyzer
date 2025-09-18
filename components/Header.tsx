
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="py-6 border-b border-slate-700/50">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl md:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-500">
                    Australian Search Demand Analyzer
                </h1>
            </div>
        </header>
    );
};

export default Header;
