import { AlertTriangle, Building2, TrendingDown, Sparkles } from 'lucide-react';

interface Vacancy {
  ticker: string;
  company: string;
  index: 'S&P 500' | 'S&P 400' | 'S&P 600';
  reason: 'Pending Acquisition' | 'Bankruptcy' | 'Delisting';
  announcedDate: string;
  expectedDate: string;
}

const vacancies: Vacancy[] = [
  {
    ticker: 'ZION',
    company: 'Zions Bancorporation',
    index: 'S&P 500',
    reason: 'Pending Acquisition',
    announcedDate: 'Mar 15',
    expectedDate: 'Q2 2024',
  },
  {
    ticker: 'BBBY',
    company: 'Bed Bath & Beyond',
    index: 'S&P 400',
    reason: 'Bankruptcy',
    announcedDate: 'Apr 2',
    expectedDate: 'Immediate',
  },
  {
    ticker: 'SVB',
    company: 'Silicon Valley Bank',
    index: 'S&P 500',
    reason: 'Delisting',
    announcedDate: 'Mar 10',
    expectedDate: 'Q2 2024',
  },
];

export function VacancyMonitor() {
  const getIndexColors = (index: 'S&P 500' | 'S&P 400' | 'S&P 600') => {
    switch (index) {
      case 'S&P 600':
        return {
          active: 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-sm',
          inactive: 'bg-white text-teal-700 hover:bg-teal-50 border border-teal-300 hover:border-teal-400'
        };
      case 'S&P 400':
        return {
          active: 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-sm',
          inactive: 'bg-white text-blue-700 hover:bg-blue-50 border border-blue-300 hover:border-blue-400'
        };
      case 'S&P 500':
        return {
          active: 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-sm',
          inactive: 'bg-white text-purple-700 hover:bg-purple-50 border border-purple-300 hover:border-purple-400'
        };
    }
  };

  const getReasonColor = (reason: Vacancy['reason']) => {
    switch (reason) {
      case 'Pending Acquisition':
        return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: 'text-blue-600' };
      case 'Bankruptcy':
        return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: 'text-red-600' };
      case 'Delisting':
        return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', icon: 'text-orange-600' };
    }
  };

  const getReasonIcon = (reason: Vacancy['reason']) => {
    switch (reason) {
      case 'Pending Acquisition':
        return Building2;
      case 'Bankruptcy':
        return AlertTriangle;
      case 'Delisting':
        return TrendingDown;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden mb-6">
      {/* Unified Header - Brand Identity */}
      <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-indigo-700 p-5 relative overflow-hidden">
        {/* Decorative gradient orbs */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Index Vacancies</h3>
              <p className="text-indigo-100 text-xs">Potential inclusion opportunities</p>
            </div>
          </div>
          
          {/* Stats Banner */}
          <div className="mt-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span className="text-white text-sm font-medium">{vacancies.length} Open Slots</span>
              </div>
              <span className="text-indigo-100 text-xs">Across all indices</span>
            </div>
          </div>
        </div>
      </div>

      {/* Vacancy List */}
      <div className="p-4 bg-gradient-to-br from-white to-slate-50">
        <div className="space-y-3">
          {vacancies.map((vacancy, idx) => {
            const colors = getReasonColor(vacancy.reason);
            const Icon = getReasonIcon(vacancy.reason);
            const indexColors = getIndexColors(vacancy.index);
            
            return (
              <div
                key={vacancy.ticker}
                className="p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-all hover:border-indigo-300 group"
              >
                {/* Header Row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-900">{vacancy.ticker}</span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${indexColors.inactive}`}>
                        {vacancy.index}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">{vacancy.company}</p>
                  </div>
                  
                  {/* Vacancy Number Badge */}
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg flex items-center justify-center border border-purple-200">
                    <span className="text-sm font-bold text-purple-700">#{idx + 1}</span>
                  </div>
                </div>

                {/* Reason Badge */}
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${colors.border} ${colors.bg} mb-3`}>
                  <Icon className={`w-4 h-4 ${colors.icon}`} />
                  <span className={`text-sm font-medium ${colors.text}`}>{vacancy.reason}</span>
                </div>

                {/* Timeline Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-xs text-slate-500 mb-0.5">Announced</div>
                    <div className="text-sm font-semibold text-slate-900">{vacancy.announcedDate}</div>
                  </div>
                  <div className="p-2 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                    <div className="text-xs text-purple-700 mb-0.5">Expected</div>
                    <div className="text-sm font-semibold text-purple-900">{vacancy.expectedDate}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border-t border-purple-200">
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
          <div className="text-sm text-purple-900">
            <span className="font-semibold">{vacancies.length}</span> active opportunities • Updated live
          </div>
        </div>
      </div>
    </div>
  );
}