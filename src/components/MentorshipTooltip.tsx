import { HelpCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface MentorshipTooltipProps {
  term: string;
  definition: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function MentorshipTooltip({ term, definition, position = 'top' }: MentorshipTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const tooltipWidth = 288; // 72 * 4 = 288px (w-72)
      const tooltipHeight = 150; // Approximate height
      const gap = 8; // Gap between button and tooltip

      let top = 0;
      let left = 0;

      switch (position) {
        case 'top':
          top = buttonRect.top - tooltipHeight - gap;
          left = buttonRect.left + buttonRect.width / 2 - tooltipWidth / 2;
          break;
        case 'bottom':
          top = buttonRect.bottom + gap;
          left = buttonRect.left + buttonRect.width / 2 - tooltipWidth / 2;
          break;
        case 'left':
          top = buttonRect.top + buttonRect.height / 2 - tooltipHeight / 2;
          left = buttonRect.left - tooltipWidth - gap;
          break;
        case 'right':
          top = buttonRect.top + buttonRect.height / 2 - tooltipHeight / 2;
          left = buttonRect.right + gap;
          break;
      }

      // Keep tooltip within viewport bounds
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      if (left < 8) left = 8;
      if (left + tooltipWidth > viewportWidth - 8) left = viewportWidth - tooltipWidth - 8;
      if (top < 8) top = 8;
      if (top + tooltipHeight > viewportHeight - 8) top = viewportHeight - tooltipHeight - 8;

      setTooltipPosition({ top, left });
    }
  }, [isOpen, position]);

  const arrowStyles = (() => {
    if (!buttonRef.current || !isOpen) return {};
    
    const buttonRect = buttonRef.current.getBoundingClientRect();
    
    switch (position) {
      case 'top':
        return {
          top: '100%',
          left: `${buttonRect.left + buttonRect.width / 2 - tooltipPosition.left}px`,
          transform: 'translateX(-50%)',
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          borderTop: '8px solid #4f46e5',
        };
      case 'bottom':
        return {
          bottom: '100%',
          left: `${buttonRect.left + buttonRect.width / 2 - tooltipPosition.left}px`,
          transform: 'translateX(-50%)',
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          borderBottom: '8px solid #4f46e5',
        };
      case 'left':
        return {
          left: '100%',
          top: `${buttonRect.top + buttonRect.height / 2 - tooltipPosition.top}px`,
          transform: 'translateY(-50%)',
          borderTop: '8px solid transparent',
          borderBottom: '8px solid transparent',
          borderLeft: '8px solid #4f46e5',
        };
      case 'right':
        return {
          right: '100%',
          top: `${buttonRect.top + buttonRect.height / 2 - tooltipPosition.top}px`,
          transform: 'translateY(-50%)',
          borderTop: '8px solid transparent',
          borderBottom: '8px solid transparent',
          borderRight: '8px solid #4f46e5',
        };
      default:
        return {};
    }
  })();

  return (
    <>
      <button
        ref={buttonRef}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="w-3.5 h-3.5 inline-flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md cursor-help ml-1.5"
        aria-label={`Learn about ${term}`}
      >
        <HelpCircle className="w-2.5 h-2.5" />
      </button>

      {isOpen && createPortal(
        <div
          className="fixed z-[9999] pointer-events-none"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          {/* Arrow */}
          <div className="absolute w-0 h-0" style={arrowStyles} />
          
          {/* Card */}
          <div className="w-72 bg-gradient-to-br from-indigo-600 to-purple-700 backdrop-blur-xl rounded-xl shadow-2xl border border-indigo-400/30 overflow-hidden">
            <div className="p-4">
              <div className="flex items-start gap-3 mb-2">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 border border-white/30">
                  <HelpCircle className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold mb-1">{term}</h4>
                  <p className="text-sm text-indigo-100 leading-relaxed">{definition}</p>
                </div>
              </div>
            </div>
            
            {/* Subtle bottom glow */}
            <div className="h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
        </div>,
        document.body
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
