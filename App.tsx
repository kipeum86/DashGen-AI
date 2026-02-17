import React, { useState } from 'react';
import InputSection from './components/InputSection';
import DashboardPreview from './components/DashboardPreview';
import { generateDashboard } from './services/geminiService';
import { DashboardConfig, GeneratorStatus } from './types';

function App() {
  const [status, setStatus] = useState<GeneratorStatus>(GeneratorStatus.IDLE);
  const [generatedHtml, setGeneratedHtml] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleGenerate = async (config: DashboardConfig) => {
    setStatus(GeneratorStatus.GENERATING);
    setErrorMsg('');
    
    try {
      const html = await generateDashboard(config);
      setGeneratedHtml(html);
      setStatus(GeneratorStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'An unexpected error occurred.');
      setStatus(GeneratorStatus.ERROR);
    }
  };

  const handleReset = () => {
    setStatus(GeneratorStatus.IDLE);
    setGeneratedHtml('');
    setErrorMsg('');
  };

  // Render Logic
  if (status === GeneratorStatus.SUCCESS) {
    return <DashboardPreview html={generatedHtml} onReset={handleReset} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col relative overflow-hidden font-sans">
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-[40%] right-[10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]"></div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        
        {status === GeneratorStatus.IDLE && (
          <InputSection onGenerate={handleGenerate} isLoading={false} />
        )}

        {status === GeneratorStatus.GENERATING && (
           <InputSection onGenerate={() => {}} isLoading={true} />
        )}

        {status === GeneratorStatus.ERROR && (
          <div className="w-full max-w-lg bg-red-950/50 border border-red-800 p-6 rounded-xl text-center space-y-4">
             <div className="text-red-400 font-bold text-xl">Generation Failed</div>
             <p className="text-red-200 text-sm">{errorMsg}</p>
             <button 
                onClick={handleReset}
                className="px-6 py-2 bg-red-800 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
             >
                Try Again
             </button>
          </div>
        )}

      </main>

      <footer className="w-full p-8 text-center z-10 relative space-y-2">
        <div className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} <a href="https://www.linkedin.com/in/kipeumlee/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-400 transition-colors font-medium border-b border-transparent hover:border-blue-400/50">Kipeum Lee</a>. All Rights Reserved.
        </div>
        <div className="text-slate-600 text-xs font-medium">
            Powered by Google Gemini 3.0 Pro
        </div>
      </footer>
    </div>
  );
}

export default App;