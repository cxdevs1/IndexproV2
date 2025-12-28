import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CheckCircle2, XCircle, AlertCircle, TrendingUp } from 'lucide-react';

const scoreData = [
  { date: 'Jan 15', score: 72 },
  { date: 'Jan 22', score: 74 },
  { date: 'Jan 29', score: 76 },
  { date: 'Feb 5', score: 78 },
  { date: 'Feb 12', score: 81 },
  { date: 'Feb 19', score: 79 },
  { date: 'Feb 26', score: 82 },
  { date: 'Mar 4', score: 85 },
  { date: 'Mar 11', score: 86 },
  { date: 'Mar 18', score: 88 },
  { date: 'Mar 25', score: 91 },
  { date: 'Apr 1', score: 94 },
];

interface ChecklistItem {
  label: string;
  status: 'pass' | 'fail' | 'warning';
  detail: string;
}

const committeeChecklist: ChecklistItem[] = [
  { label: 'GAAP Profitability', status: 'pass', detail: '4 consecutive quarters profitable' },
  { label: 'US Domicile', status: 'pass', detail: 'Delaware incorporation confirmed' },
  { label: 'Liquidity', status: 'pass', detail: '$42M avg daily volume' },
  { label: 'Market Cap', status: 'pass', detail: '$8.2B (above $6.7B threshold)' },
  { label: 'Public Float', status: 'warning', detail: '48% (monitoring threshold)' },
  { label: 'Financial Viability', status: 'pass', detail: 'Strong balance sheet' },
];

export function StockIntelligence() {
  const currentStock = 'AXON';
  const currentCompany = 'Axon Enterprise';

  return (
    <div className="space-y-6">
      {/* Stock Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-slate-900">{currentStock}</h2>
              <span className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm">
                Score: 94
              </span>
            </div>
            <p className="text-slate-600">{currentCompany}</p>
            <p className="text-sm text-slate-500 mt-1">S&P 600 SmallCap</p>
          </div>
          <div className="text-right">
            <div className="text-2xl text-slate-900">$342.18</div>
            <div className="flex items-center gap-1 text-green-600 mt-1">
              <TrendingUp className="w-4 h-4" />
              <span>+3.2%</span>
              <span className="text-xs text-slate-500">Today</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
          <div>
            <div className="text-xs text-slate-500 mb-1">Market Cap</div>
            <div className="text-slate-900">$8.2B</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Avg Volume</div>
            <div className="text-slate-900">42M</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Float</div>
            <div className="text-slate-900">48%</div>
          </div>
        </div>
      </div>

      {/* Score Persistence Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="mb-6">
          <h3 className="text-slate-900 mb-1">Score Persistence</h3>
          <p className="text-sm text-slate-500">90-day inclusion score trend</p>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={scoreData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
              tickLine={false}
            />
            <YAxis
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
              tickLine={false}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ fill: '#6366f1', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-100">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <div>
              <div className="text-sm text-green-900">Strong upward trend</div>
              <div className="text-xs text-green-700 mt-0.5">
                Score increased 22 points over 90 days
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Committee Fit Checklist */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="mb-6">
          <h3 className="text-slate-900 mb-1">Committee Fit Analysis</h3>
          <p className="text-sm text-slate-500">Index inclusion criteria evaluation</p>
        </div>

        <div className="space-y-3">
          {committeeChecklist.map((item) => (
            <div
              key={item.label}
              className="p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {item.status === 'pass' && (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  )}
                  {item.status === 'fail' && (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  {item.status === 'warning' && (
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-slate-900">{item.label}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        item.status === 'pass'
                          ? 'bg-green-100 text-green-700'
                          : item.status === 'warning'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {item.status === 'pass' ? 'Pass' : item.status === 'warning' ? 'Monitor' : 'Fail'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{item.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
          <div className="text-sm text-indigo-900">
            Overall Assessment: <span>Strong candidate for index inclusion</span>
          </div>
          <div className="text-xs text-indigo-700 mt-1">
            5 of 6 criteria met, 1 monitoring
          </div>
        </div>
      </div>
    </div>
  );
}
