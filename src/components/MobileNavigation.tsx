import { BarChart3, Target, Sparkles } from 'lucide-react';

interface MobileNavigationProps {
  activeTab: 'universe' | 'intelligence' | 'alerts';
  onTabChange: (tab: 'universe' | 'intelligence' | 'alerts') => void;
}

export function MobileNavigation({ activeTab, onTabChange }: MobileNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-200/50 shadow-lg z-50">
      <div className="grid grid-cols-3 h-16">
        <button
          onClick={() => onTabChange('universe')}
          className={`relative flex flex-col items-center justify-center gap-1 min-h-[44px] transition-all ${
            activeTab === 'universe'
              ? 'text-indigo-600'
              : 'text-slate-500 active:bg-slate-50'
          }`}
        >
          {activeTab === 'universe' && (
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-b-full"></div>
          )}
          <BarChart3 className="w-5 h-5" />
          <span className="text-[10px] font-medium">Universe</span>
        </button>

        <button
          onClick={() => onTabChange('intelligence')}
          className={`relative flex flex-col items-center justify-center gap-1 min-h-[44px] transition-all ${
            activeTab === 'intelligence'
              ? 'text-indigo-600'
              : 'text-slate-500 active:bg-slate-50'
          }`}
        >
          {activeTab === 'intelligence' && (
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-b-full"></div>
          )}
          <Target className="w-5 h-5" />
          <span className="text-[10px] font-medium">Intelligence</span>
        </button>

        <button
          onClick={() => onTabChange('alerts')}
          className={`relative flex flex-col items-center justify-center gap-1 min-h-[44px] transition-all ${
            activeTab === 'alerts'
              ? 'text-indigo-600'
              : 'text-slate-500 active:bg-slate-50'
          }`}
        >
          {activeTab === 'alerts' && (
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-b-full"></div>
          )}
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] font-medium">Simulator</span>
        </button>
      </div>
    </div>
  );
}
