import { BarChart3, Target, Sparkles, Map } from 'lucide-react';

interface MobileNavigationProps {
  activeTab: 'board' | 'intelligence' | 'playbook' | 'scenario';
  onTabChange: (tab: 'board' | 'intelligence' | 'playbook' | 'scenario') => void;
}

export function MobileNavigation({ activeTab, onTabChange }: MobileNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-200/50 shadow-lg z-50">
      <div className="grid grid-cols-4 h-16">
        <button
          onClick={() => onTabChange('board')}
          className={`relative flex flex-col items-center justify-center gap-1 min-h-[44px] transition-all ${
            activeTab === 'board'
              ? 'text-indigo-600'
              : 'text-slate-500 active:bg-slate-50'
          }`}
        >
          {activeTab === 'board' && (
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-b-full"></div>
          )}
          <BarChart3 className="w-5 h-5" />
          <span className="text-[10px] font-medium">The Board</span>
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
          <span className="text-[10px] font-medium">Core Analysis</span>
        </button>

        <button
          onClick={() => onTabChange('playbook')}
          className={`relative flex flex-col items-center justify-center gap-1 min-h-[44px] transition-all ${
            activeTab === 'playbook'
              ? 'text-indigo-600'
              : 'text-slate-500 active:bg-slate-50'
          }`}
        >
          {activeTab === 'playbook' && (
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-b-full"></div>
          )}
          <Map className="w-5 h-5" />
          <span className="text-[10px] font-medium">Playbook</span>
        </button>

        <button
          onClick={() => onTabChange('scenario')}
          className={`relative flex flex-col items-center justify-center gap-1 min-h-[44px] transition-all ${
            activeTab === 'scenario'
              ? 'text-indigo-600'
              : 'text-slate-500 active:bg-slate-50'
          }`}
        >
          {activeTab === 'scenario' && (
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-b-full"></div>
          )}
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] font-medium">Scenario Lab</span>
        </button>
      </div>
    </div>
  );
}