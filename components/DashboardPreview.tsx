import React, { useState } from 'react';
import { Download, Code, Eye, RefreshCw } from 'lucide-react';

interface Props {
  html: string;
  onReset: () => void;
}

const DashboardPreview: React.FC<Props> = ({ html, onReset }) => {
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');

  const handleDownload = () => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dashboard-analysis.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-screen flex flex-col bg-slate-900">
      {/* Toolbar */}
      <div className="h-16 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-bold text-white flex items-center">
            <span className="w-3 h-3 rounded-full bg-emerald-500 mr-3 animate-pulse"></span>
            Dashboard Ready
          </h2>
          <div className="h-6 w-px bg-slate-700"></div>
          <div className="flex bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center ${
                viewMode === 'preview' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-4 h-4 mr-2" /> Preview
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center ${
                viewMode === 'code' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code className="w-4 h-4 mr-2" /> Code
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-3">
            <button
                onClick={onReset}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center"
            >
                <RefreshCw className="w-4 h-4 mr-2" /> New
            </button>
            <button
                onClick={handleDownload}
                className="px-4 py-2 text-sm font-bold bg-white text-slate-900 hover:bg-slate-200 rounded-lg transition-colors flex items-center shadow-lg shadow-white/10"
            >
                <Download className="w-4 h-4 mr-2" /> Download HTML
            </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {viewMode === 'preview' ? (
          <iframe
            srcDoc={html}
            title="Dashboard Preview"
            className="w-full h-full bg-white border-none"
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
          />
        ) : (
          <div className="w-full h-full overflow-auto bg-[#0d1117] p-6">
            <pre className="font-mono text-sm text-slate-300 whitespace-pre-wrap break-all">
              {html}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPreview;
