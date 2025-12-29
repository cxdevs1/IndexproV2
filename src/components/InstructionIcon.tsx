import { HelpCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface InstructionIconProps {
  term: string;
  explanation: string;
  example?: string;
}

export function InstructionIcon({ term, explanation, example }: InstructionIconProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative inline-block" ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center w-[12px] h-[12px] rounded-full bg-indigo-100 hover:bg-indigo-200 transition-all cursor-help ml-1.5"
        aria-label={`Learn about ${term}`}
      >
        <HelpCircle className="w-[8px] h-[8px] text-indigo-600" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div className="fixed inset-0 bg-black/20 z-[100] sm:hidden" onClick={() => setIsOpen(false)} />
          
          {/* Popover */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 sm:w-80 bg-white rounded-xl shadow-2xl border-2 border-indigo-200 z-[101] animate-in fade-in slide-in-from-bottom-2 duration-200">
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[2px]">
              <div className="border-8 border-transparent border-t-indigo-200"></div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full">
                <div className="border-[7px] border-transparent border-t-white"></div>
              </div>
            </div>

            <div className="p-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-semibold text-slate-900">{term}</h4>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Plain English Explanation */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-3 mb-3">
                <div className="text-xs font-semibold text-indigo-700 uppercase tracking-wide mb-1.5">
                  Plain English
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {explanation}
                </p>
              </div>

              {/* Example (if provided) */}
              {example && (
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                  <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                    Example
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {example}
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}