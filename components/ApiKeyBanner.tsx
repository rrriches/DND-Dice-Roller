import React, { useState } from 'react';

interface ApiKeyBannerProps {
  onSaveApiKey: (key: string) => void;
  onDismiss: () => void;
}

export const ApiKeyBanner: React.FC<ApiKeyBannerProps> = ({ onSaveApiKey, onDismiss }) => {
  const [key, setKey] = useState('');

  const handleSave = () => {
    if (key.trim()) {
      onSaveApiKey(key.trim());
    }
  };

  return (
    <div className="bg-amber-900/50 border-b border-amber-500/30 p-3 text-sm text-amber-100 sticky top-0 z-50 animate-fade-in-down">
      <div className="container mx-auto max-w-4xl flex flex-col sm:flex-row items-center justify-center gap-x-4 gap-y-2">
        <div className="flex-shrink-0 text-center sm:text-left">
            <span className="font-bold">✨ AI Features Disabled:</span> To generate flavor text, please enter your Gemini API key.
        </div>
        <div className="flex gap-2 w-full sm:w-auto flex-grow">
            <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Paste your API key here"
                className="flex-grow bg-slate-800 border border-slate-600 rounded-md px-2 py-1 text-slate-200 focus:ring-amber-500 focus:border-amber-500"
                aria-label="Gemini API Key"
            />
            <button
                onClick={handleSave}
                className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-slate-900 font-bold rounded disabled:opacity-50 transition-colors"
                disabled={!key.trim()}
            >
                Save
            </button>
        </div>
        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-xs text-amber-300 hover:text-amber-200 underline whitespace-nowrap">
            Get an API Key
        </a>
        <button 
            onClick={onDismiss}
            className="absolute top-2 right-2 sm:relative sm:top-auto sm:right-auto text-amber-200/70 hover:text-amber-100 transition-colors"
            aria-label="Dismiss banner"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
        </button>
      </div>
    </div>
  );
};