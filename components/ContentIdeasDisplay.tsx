
import React from 'react';
import type { ContentIdeasResult, ContentIdea } from '../types';

const BlogIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
);

const InstagramIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-fuchsia-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const TikTokIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.55 5.55a5 5 0 017.07 7.07l-1.41-1.41a3 3 0 00-4.24-4.24l-1.42 1.42zM4.04 18.45a5 5 0 01-7.07-7.07l1.41 1.41a3 3 0 004.24 4.24l1.42-1.42z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8m-4-4h8" transform="rotate(45 12 12)"/>
    </svg>
);


interface IdeaCardProps {
    idea: ContentIdea;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea }) => (
    <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-700">
        <h5 className="font-semibold text-slate-200">{idea.title}</h5>
        <p className="text-sm text-slate-400 mt-1">{idea.description}</p>
    </div>
);

interface ContentIdeasDisplayProps {
    ideas: ContentIdeasResult;
}

const ContentIdeasDisplay: React.FC<ContentIdeasDisplayProps> = ({ ideas }) => {
    return (
        <div className="mt-8 pt-8 border-t border-slate-700 animate-fade-in">
             <h3 className="text-2xl font-bold text-center text-slate-200 mb-6">
                Content Creation Ideas
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Blog Ideas */}
                <div className="space-y-4">
                    <h4 className="text-xl font-semibold text-slate-200 flex items-center">
                        <BlogIcon /> Blog Posts
                    </h4>
                    {ideas.blogIdeas.map((idea, index) => <IdeaCard key={index} idea={idea} />)}
                </div>

                {/* Instagram Ideas */}
                <div className="space-y-4">
                    <h4 className="text-xl font-semibold text-slate-200 flex items-center">
                       <InstagramIcon /> Instagram Posts
                    </h4>
                    {ideas.instagramIdeas.map((idea, index) => <IdeaCard key={index} idea={idea} />)}
                </div>
                
                {/* TikTok Ideas */}
                <div className="space-y-4">
                     <h4 className="text-xl font-semibold text-slate-200 flex items-center">
                        <TikTokIcon /> TikTok Videos
                    </h4>
                    {ideas.tiktokIdeas.map((idea, index) => <IdeaCard key={index} idea={idea} />)}
                </div>
            </div>
        </div>
    );
};

export default ContentIdeasDisplay;
