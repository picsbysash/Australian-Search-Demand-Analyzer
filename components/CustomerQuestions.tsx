
import React, { useState, useCallback } from 'react';

interface CustomerQuestionsProps {
    questions: string[];
    onSelectionChange: (selectedQuestions: string[]) => void;
}

const QuestionIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-fuchsia-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const CustomerQuestions: React.FC<CustomerQuestionsProps> = ({ questions, onSelectionChange }) => {
    const [selected, setSelected] = useState<Set<string>>(new Set());

    const handleToggle = (question: string) => {
        const newSelection = new Set(selected);
        if (newSelection.has(question)) {
            newSelection.delete(question);
        } else {
            newSelection.add(question);
        }
        setSelected(newSelection);
        onSelectionChange(Array.from(newSelection));
    };

    return (
        <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-lg shadow-lg">
            <h4 className="text-xl font-semibold mb-4 text-slate-200 flex items-center">
                <QuestionIcon />
                Top Customer Questions
            </h4>
            <div className="space-y-2 text-slate-300 columns-1 md:columns-2">
                {questions.map((question, index) => (
                    <label key={index} className="flex items-center space-x-3 p-2 rounded-md hover:bg-slate-700/50 cursor-pointer break-inside-avoid">
                        <input
                            type="checkbox"
                            checked={selected.has(question)}
                            onChange={() => handleToggle(question)}
                            className="h-4 w-4 rounded bg-slate-700 border-slate-600 text-fuchsia-500 focus:ring-fuchsia-500"
                        />
                        <span>{question}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default CustomerQuestions;
