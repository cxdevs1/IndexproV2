import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CheckCircle2, XCircle, AlertCircle, TrendingUp, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

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

// Helper to find when score first crossed 70
const firstCross70Date = (() => {
  for (let i = 1; i < scoreData.length; i++) {
    if (scoreData[i].score >= 70 && scoreData[i - 1].score < 70) {
      return scoreData[i].date;
    }
  }
  // If first point is already above 70, mark it
  return scoreData[0].score >= 70 ? scoreData[0].date : null;
})();

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
  const thirtyDayMove = 18.5; // Percentage move in last 30 days
  const [hoveredPoint, setHoveredPoint] = useState<{ date: string; score: number } | null>(null);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const firstCrossDate = data.score >= 70 && scoreData[scoreData.indexOf(data) - 1]?.score < 70 
        ? data.date 
        : null;

      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
          <div className="text-sm text-slate-900 mb-1">{data.date}</div>
          <div className="text-lg text-indigo-600">Score: {data.score}</div>
          {firstCrossDate && (
            <div className="text-xs text-green-600 mt-2 pt-2 border-t border-slate-200">
              ✓ First crossed 70-point threshold
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Stock Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h2 className="text-slate-900">{currentStock}</h2>
              <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded-lg text-xs sm:text-sm">
                Score: 94
              </span>
              {/* Pre-Run Warning Badge */}
              {thirtyDayMove > 15 ? (
                <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-lg text-xs sm:text-sm flex items-center gap-1.5 border border-red-200">
                  <ShieldAlert className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Pre-Run</span>
                  <span className="sm:hidden">Risk</span>
                </span>
              ) : (
                <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-xs sm:text-sm flex items-center gap-1.5 border border-green-200">
                  <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                  Clear
                </span>
              )}
            </div>
            <p className="text-sm sm:text-base text-slate-600">{currentCompany}</p>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">S&P 600 SmallCap</p>
          </div>
          <div className="text-right ml-4">
            <div className="text-xl sm:text-2xl text-slate-900">$342.18</div>
            <div className="flex items-center gap-1 text-green-600 mt-1">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-sm">+3.2%</span>
              <span className="text-xs text-slate-500 hidden sm:inline">Today</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-slate-100">
          <div>
            <div className="text-xs text-slate-500 mb-1">Market Cap</div>
            <div className="text-slate-900 text-sm sm:text-base">$8.2B</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Avg Volume</div>
            <div className="text-slate-900 text-sm sm:text-base">42M</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Float</div>
            <div className="text-slate-900 text-sm sm:text-base">48%</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">30D Move</div>
            <div className={`text-sm sm:text-base ${thirtyDayMove > 15 ? 'text-red-600' : 'text-green-600'}`}>
              +{thirtyDayMove}%
            </div>
          </div>
        </div>

        {/* Risk Warning */}
        {thirtyDayMove > 15 && (
          <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <div className="text-sm text-red-900">
                High volatility detected: 30-day move exceeds 15% threshold
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Score Persistence Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
        <div className="mb-4 sm:mb-6">
          <h3 className="text-slate-900 mb-1">Score Persistence</h3>
          <p className="text-xs sm:text-sm text-slate-500">90-day inclusion score trend • Hover for threshold dates</p>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={scoreData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              stroke="#94a3b8"
              style={{ fontSize: '10px' }}
              tickLine={false}
            />
            <YAxis
              stroke="#94a3b8"
              style={{ fontSize: '10px' }}
              tickLine={false}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
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