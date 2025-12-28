import { TrendingUp, TrendingDown, Search } from 'lucide-react';
import { useState } from 'react';
import { VacancyMonitor } from './VacancyMonitor';

interface Stock {
  ticker: string;
  company: string;
  score: number;
  change: number;
  index: 'S&P 600' | 'S&P 400';
}

const mockStocks: Stock[] = [
  { ticker: 'AXON', company: 'Axon Enterprise', score: 94, change: 3.2, index: 'S&P 600' },
  { ticker: 'CROX', company: 'Crocs Inc.', score: 91, change: 2.1, index: 'S&P 600' },
  { ticker: 'CHWY', company: 'Chewy Inc.', score: 88, change: 1.8, index: 'S&P 400' },
  { ticker: 'ENPH', company: 'Enphase Energy', score: 86, change: -0.5, index: 'S&P 400' },
  { ticker: 'HALO', company: 'Halozyme Therapeutics', score: 84, change: 1.2, index: 'S&P 600' },
  { ticker: 'TECH', company: 'Bio-Techne Corp', score: 82, change: 0.9, index: 'S&P 400' },
  { ticker: 'GLOB', company: 'Globant SA', score: 79, change: -1.1, index: 'S&P 600' },
  { ticker: 'AVNT', company: 'Avient Corp', score: 76, change: 0.4, index: 'S&P 400' },
  { ticker: 'NTRA', company: 'Natera Inc.', score: 73, change: 2.5, index: 'S&P 600' },
  { ticker: 'FTNT', company: 'Fortinet Inc.', score: 71, change: 1.6, index: 'S&P 400' },
  { ticker: 'PRVA', company: 'Privia Health', score: 68, change: -0.8, index: 'S&P 600' },
  { ticker: 'ZS', company: 'Zscaler Inc.', score: 65, change: 0.3, index: 'S&P 400' },
];

export function UniverseMonitor() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStocks = mockStocks.filter(
    (stock) =>
      stock.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    return 'text-slate-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 85) return 'bg-green-50';
    if (score >= 70) return 'bg-blue-50';
    return 'bg-slate-50';
  };

  return (
    <>
      {/* Vacancy Monitor */}
      <VacancyMonitor />

      {/* Universe Monitor */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-gradient-to-br from-slate-50 to-white">
          <h2 className="text-slate-900 mb-1">Universe Monitor</h2>
          <p className="text-sm text-slate-500">S&P 600/400 Rankings</p>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search ticker or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Stock List */}
        <div className="overflow-y-auto md:max-h-[calc(100vh-280px)] max-h-[400px]">
          {filteredStocks.map((stock, index) => (
            <div
              key={stock.ticker}
              className="p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-slate-900">{stock.ticker}</span>
                    <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                      #{index + 1}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">{stock.company}</p>
                  <p className="text-xs text-slate-400 mt-1">{stock.index}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div
                    className={`px-3 py-1.5 rounded-lg ${getScoreBgColor(stock.score)} ${getScoreColor(stock.score)} text-sm sm:text-base`}
                  >
                    {stock.score}
                  </div>
                  <div className={`flex items-center gap-1 text-xs ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stock.change >= 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {Math.abs(stock.change)}%
                  </div>
                </div>
              </div>
              
              {/* Score Bar */}
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    stock.score >= 85
                      ? 'bg-gradient-to-r from-green-500 to-green-600'
                      : stock.score >= 70
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                      : 'bg-gradient-to-r from-slate-400 to-slate-500'
                  }`}
                  style={{ width: `${stock.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}