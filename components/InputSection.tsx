import React, { useState } from 'react';
import { DashboardConfig, EXAMPLE_CONTEXT } from '../types';
import { Youtube, FileText, Sparkles, PlayCircle, Search, Globe } from 'lucide-react';

interface Props {
  onGenerate: (config: DashboardConfig) => void;
  isLoading: boolean;
}

const InputSection: React.FC<Props> = ({ onGenerate, isLoading }) => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [context, setContext] = useState('');
  const [language, setLanguage] = useState<'en' | 'ko'>('en');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({ youtubeUrl, context, language });
  };

  const loadExample = () => {
    setYoutubeUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    setContext(EXAMPLE_CONTEXT);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 tracking-tight">
          DashGen AI
        </h1>
        <p className="text-slate-400">
          Turn any YouTube video into a sophisticated HTML strategy dashboard.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl space-y-6">
        
        {/* YouTube URL */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-slate-300">
            <Youtube className="w-4 h-4 mr-2 text-red-400" />
            YouTube URL
          </label>
          <input
            type="url"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
            required
          />
        </div>

        {/* Context/Transcript */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="flex items-center text-sm font-medium text-slate-300">
              <FileText className="w-4 h-4 mr-2 text-emerald-400" />
              Video Context / Transcript <span className="text-slate-500 ml-1 font-normal">(Optional)</span>
            </label>
            <button 
              type="button" 
              onClick={loadExample}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center"
            >
              <PlayCircle className="w-3 h-3 mr-1" /> Load Example
            </button>
          </div>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Leave empty to let AI search for the video details automatically. Or paste a transcript for higher accuracy."
            className="w-full h-40 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none custom-scrollbar placeholder:text-slate-600"
          />
          <div className="flex items-start gap-2 text-xs text-slate-500 mt-2">
             <Search className="w-3 h-3 mt-0.5 shrink-0" />
             <p>
               If you leave this empty, we will use <strong>Google Search Grounding</strong> to find the video summary and key insights automatically.
             </p>
          </div>
        </div>

        {/* Language Selection */}
        <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-slate-300">
                <Globe className="w-4 h-4 mr-2 text-blue-400" />
                Dashboard Output Language
            </label>
            <div className="grid grid-cols-2 gap-4">
                <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`py-3 rounded-xl border transition-all font-medium ${
                        language === 'en'
                        ? 'bg-blue-600/20 border-blue-500 text-blue-100 shadow-[0_0_15px_rgba(37,99,235,0.3)]'
                        : 'bg-slate-950 border-slate-700 text-slate-400 hover:border-slate-600 hover:bg-slate-900'
                    }`}
                >
                    English
                </button>
                <button
                    type="button"
                    onClick={() => setLanguage('ko')}
                    className={`py-3 rounded-xl border transition-all font-medium ${
                        language === 'ko'
                        ? 'bg-blue-600/20 border-blue-500 text-blue-100 shadow-[0_0_15px_rgba(37,99,235,0.3)]'
                        : 'bg-slate-950 border-slate-700 text-slate-400 hover:border-slate-600 hover:bg-slate-900'
                    }`}
                >
                    한국어 (Korean)
                </button>
            </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !youtubeUrl}
          className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center transition-all shadow-lg mt-4 ${
            isLoading || !youtubeUrl
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-indigo-500/20 hover:shadow-indigo-500/40 transform hover:-translate-y-0.5'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing Video Content...
            </span>
          ) : (
            <span className="flex items-center">
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Dashboard
            </span>
          )}
        </button>
      </form>
    </div>
  );
};

export default InputSection;
