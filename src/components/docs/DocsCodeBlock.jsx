import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const DocsCodeBlock = ({ code, language = 'javascript', title = '' }) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl text-slate-200">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-indigo-400" />
          <span className="font-mono text-slate-400 font-semibold text-[11px] truncate max-w-[280px]">
            {title || language}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 font-mono text-[10px] uppercase font-bold">
            {language}
          </span>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 active:scale-95 transition-all flex items-center gap-1 text-[11px] font-medium"
            title="Copy snippet"
          >
            {copied ? (
              <>
                <Check size={13} className="text-emerald-400" />
                <span className="text-emerald-400 font-bold">Copied</span>
              </>
            ) : (
              <>
                <Copy size={13} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Text Container */}
      <div className="p-4 overflow-x-auto font-mono text-xs leading-relaxed scrollbar-thin text-slate-300">
        <pre>
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};
