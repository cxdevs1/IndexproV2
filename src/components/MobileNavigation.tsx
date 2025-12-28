import { BarChart3, Target, Bell } from 'lucide-react';

interface MobileNavigationProps {
  activeTab: 'universe' | 'intelligence' | 'alerts';
  onTabChange: (tab: 'universe' | 'intelligence' | 'alerts') => void;
}

export function MobileNavigation({ activeTab, onTabChange }: MobileNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-50">
      <div className="grid grid-cols-3 h-16">
        <button
          onClick={() => onTabChange('universe')}
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            activeTab === 'universe'
              ? 'text-indigo-600 bg-indigo-50'
              : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-xs">Universe</span>
        </button>

        <button
          onClick={() => onTabChange('intelligence')}
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            activeTab === 'intelligence'
              ? 'text-indigo-600 bg-indigo-50'
              : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Target className="w-5 h-5" />
          <span className="text-xs">Intelligence</span>
        </button>

        <button
          onClick={() => onTabChange('alerts')}
          className={`flex flex-col items-center justify-center gap-1 transition-colors relative ${
            activeTab === 'alerts'
              ? 'text-indigo-600 bg-indigo-50'
              : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <div className="relative">
            <Bell className="w-5 h-5" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
          </div>
          <span className="text-xs">Alerts</span>
        </button>
      </div>
    </div>
  );
}
