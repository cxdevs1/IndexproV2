import { AlertTriangle, Building2, TrendingDown } from 'lucide-react';

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
  const getReasonColor = (reason: Vacancy['reason']) => {
    switch (reason) {
      case 'Pending Acquisition':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Bankruptcy':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Delisting':
        return 'bg-orange-100 text-orange-700 border-orange-200';
    }
  };

  const getReasonIcon = (reason: Vacancy['reason']) => {
    switch (reason) {
      case 'Pending Acquisition':
        return <Building2 className="w-4 h-4" />;
      case 'Bankruptcy':
        return <AlertTriangle className="w-4 h-4" />;
      case 'Delisting':
        return <TrendingDown className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl shadow-sm border-2 border-purple-200 overflow-hidden mb-6">
      {/* Header */}
      <div className="p-4 border-b border-purple-200 bg-white/50">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 bg-purple-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-slate-900">Index Vacancies</h3>
        </div>
        <p className="text-sm text-slate-600">Potential inclusion opportunities</p>
      </div>

      {/* Vacancy List */}
      <div className="p-3 space-y-2">
        {vacancies.map((vacancy) => (
          <div
            key={vacancy.ticker}
            className="p-3 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-slate-900">{vacancy.ticker}</span>
                  <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded">
                    {vacancy.index}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{vacancy.company}</p>
              </div>
            </div>

            <div
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border ${getReasonColor(vacancy.reason)}`}
            >
              {getReasonIcon(vacancy.reason)}
              <span className="text-xs">{vacancy.reason}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
              <div>
                <span className="text-slate-500">Announced:</span>
                <span className="text-slate-900 ml-1">{vacancy.announcedDate}</span>
              </div>
              <div>
                <span className="text-slate-500">Expected:</span>
                <span className="text-slate-900 ml-1">{vacancy.expectedDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-3 bg-purple-100 border-t border-purple-200">
        <div className="text-xs text-purple-900 text-center">
          {vacancies.length} open slot{vacancies.length !== 1 ? 's' : ''} across indices
        </div>
      </div>
    </div>
  );
}
