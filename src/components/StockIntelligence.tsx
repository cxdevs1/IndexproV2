import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { CheckCircle2, XCircle, AlertCircle, TrendingUp, ShieldAlert, ShieldCheck, Info, CircleDot, Circle, DollarSign, BarChart3, Droplets, Building2, Wallet, Activity, Zap, Target as TargetIcon } from 'lucide-react';
import { useState } from 'react';
import { useIsMobile } from './ui/use-mobile';
import { ThePlaybook } from './ThePlaybook';

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
  icon?: any;
}

const committeeChecklist: ChecklistItem[] = [
  { label: 'GAAP Profitability', status: 'pass', detail: '4 consecutive quarters profitable', icon: DollarSign },
  { label: 'US Domicile', status: 'pass', detail: 'Delaware incorporation confirmed', icon: Building2 },
  { label: 'Liquidity', status: 'pass', detail: '$42M avg daily volume', icon: Droplets },
  { label: 'Market Cap', status: 'pass', detail: '$8.2B (above $6.7B threshold)', icon: BarChart3 },
  { label: 'Public Float', status: 'warning', detail: '48% (monitoring threshold)', icon: Activity },
  { label: 'Financial Viability', status: 'pass', detail: 'Strong balance sheet', icon: Wallet },
];

export function StockIntelligence() {
  const isMobile = useIsMobile();
  const currentStock = 'AXON';
  const currentCompany = 'Axon Enterprise';
  const currentPrice = 342.18;
  const priceChange = 3.2;
  const currentScore = 94;
  const thirtyDayMove = 18.5;
  const marketCap = '$8.2B';
  const avgVolume = '42M';
  const publicFloat = '48%';
  const scoreChange = 22; // points increased over 90 days

  const passCount = committeeChecklist.filter(item => item.status === 'pass').length;
  const totalCount = committeeChecklist.length;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl border border-slate-700">
          <div className="text-xs text-slate-300 mb-1">{data.date}</div>
          <div className="text-xl font-bold text-indigo-300">Score: {data.score}</div>
          {data.score >= 70 && (
            <div className="text-xs text-green-400 mt-2 pt-2 border-t border-slate-700">
              ✓ Above threshold
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6" data-tour="intelligence" id="core-analysis">
      {/* Unified Intelligence Card */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        {/* Header Section - Compact & Elegant */}
        <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 p-6 overflow-hidden">
          {/* Decorative Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl transform -translate-x-24 translate-y-24"></div>
          </div>

          <div className="relative z-10">
            {/* Top Row - Stock Identity & Price */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-bold text-white">{currentStock}</h2>
                  <div className="px-4 py-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg">
                    <span className="text-xs text-indigo-100">S&P 600 SmallCap</span>
                  </div>
                </div>
                <p className="text-lg text-indigo-100">{currentCompany}</p>
              </div>
              
              <div className="text-right">
                <div className="text-3xl font-bold text-white mb-1">${currentPrice.toFixed(2)}</div>
                <div className="flex items-center justify-end gap-1.5 text-green-300">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-semibold">+{priceChange}%</span>
                  <span className="text-xs text-indigo-200">Today</span>
                </div>
              </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <BarChart3 className="w-3.5 h-3.5 text-indigo-200" />
                  <div className="text-xs text-indigo-200">Market Cap</div>
                </div>
                <div className="text-lg font-semibold text-white">{marketCap}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Droplets className="w-3.5 h-3.5 text-indigo-200" />
                  <div className="text-xs text-indigo-200">Avg Volume</div>
                </div>
                <div className="text-lg font-semibold text-white">{avgVolume}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="w-3.5 h-3.5 text-indigo-200" />
                  <div className="text-xs text-indigo-200">Float</div>
                </div>
                <div className="text-lg font-semibold text-white">{publicFloat}</div>
              </div>
              <div className={`backdrop-blur-sm rounded-lg p-3 transition-all ${
                thirtyDayMove > 15 
                  ? 'bg-gradient-to-br from-amber-400/30 to-orange-400/30 border-2 border-amber-300/60 shadow-lg ring-2 ring-amber-200/50' 
                  : 'bg-green-500/20 border-2 border-green-300/30'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  {thirtyDayMove > 15 ? (
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-100" />
                  ) : (
                    <ShieldCheck className="w-3.5 h-3.5 text-green-200" />
                  )}
                  <div className={`text-xs font-medium ${thirtyDayMove > 15 ? 'text-amber-50' : 'text-white/90'}`}>30D Move</div>
                </div>
                <div className={`text-lg font-semibold ${
                  thirtyDayMove > 15 ? 'text-white' : 'text-green-100'
                }`}>
                  +{thirtyDayMove}%
                </div>
              </div>
            </div>

            {/* Risk Warning Banner */}
            {thirtyDayMove > 15 && (
              <div className="mt-4 p-4 bg-gradient-to-r from-amber-500/25 to-orange-500/25 backdrop-blur-md border-2 border-amber-400/50 rounded-lg shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-400/30 backdrop-blur-sm border border-amber-300/50 flex items-center justify-center flex-shrink-0">
                    <ShieldAlert className="w-4 h-4 text-amber-100" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-amber-50 mb-0.5">
                      Elevated Volatility Alert
                    </div>
                    <div className="text-xs text-amber-100/90">
                      30-day price movement (+{thirtyDayMove}%) exceeds standard threshold • Monitor position sizing
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Score Section with Integrated Chart */}
        <div className="p-6 bg-gradient-to-br from-slate-50 to-white">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-slate-900 mb-1 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                Score Persistence
              </h3>
              <p className="text-sm text-slate-500">90-day inclusion score trend</p>
            </div>
            
            {/* Current Score Badge - Prominent */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl blur-lg opacity-30 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl px-6 py-4 shadow-lg border-2 border-green-400">
                <div className="text-xs text-green-100 mb-1 text-center">Current Score</div>
                <div className="text-4xl font-bold text-white text-center">{currentScore}</div>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-200" />
                  <span className="text-xs text-green-100">+{scoreChange} pts</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chart with Gradient Fill */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={scoreData}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  stroke="#94a3b8"
                  style={{ fontSize: '11px' }}
                  tickLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  style={{ fontSize: '11px' }}
                  tickLine={false}
                  domain={[60, 100]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fill="url(#scoreGradient)"
                  dot={{ fill: '#6366f1', r: 3 }}
                  activeDot={{ r: 6, fill: '#4f46e5' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Trend Insight */}
          <div className="mt-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-green-900 mb-1">
                  Strong Upward Momentum
                </div>
                <div className="text-xs text-green-700">
                  Score increased {scoreChange} points over 90 days • Consistently above 70-point threshold since Feb 5
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Committee Fit Section - Compact Pills */}
        <div className="px-6 pb-6">
          <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-50 rounded-xl p-5 border border-indigo-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-slate-900 mb-1 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                  Committee Fit Analysis
                </h3>
                <p className="text-sm text-slate-600">Index inclusion criteria</p>
              </div>
              
              {/* Overall Score */}
              <div className="text-right">
                <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {passCount}/{totalCount}
                </div>
                <div className="text-xs text-slate-600">Criteria Met</div>
              </div>
            </div>

            {/* Compact Grid Layout */}
            <div className="grid grid-cols-2 gap-3">
              {committeeChecklist.map((item) => {
                const Icon = item.icon || CheckCircle2;
                return (
                  <div
                    key={item.label}
                    className={`group relative p-4 rounded-lg border-2 transition-all hover:shadow-md cursor-default ${
                      item.status === 'pass'
                        ? 'bg-white border-green-200 hover:border-green-300'
                        : item.status === 'warning'
                        ? 'bg-white border-amber-200 hover:border-amber-300'
                        : 'bg-white border-red-200 hover:border-red-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        item.status === 'pass'
                          ? 'bg-green-100'
                          : item.status === 'warning'
                          ? 'bg-amber-100'
                          : 'bg-red-100'
                      }`}>
                        <Icon className={`w-4 h-4 ${
                          item.status === 'pass'
                            ? 'text-green-600'
                            : item.status === 'warning'
                            ? 'text-amber-600'
                            : 'text-red-600'
                        }`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="text-sm font-medium text-slate-900">{item.label}</div>
                          {item.status === 'pass' ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                          ) : item.status === 'warning' ? (
                            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2">{item.detail}</p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className={`absolute top-2 right-2 px-2 py-0.5 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity ${
                      item.status === 'pass'
                        ? 'bg-green-100 text-green-700'
                        : item.status === 'warning'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {item.status === 'pass' ? 'Pass' : item.status === 'warning' ? 'Monitor' : 'Fail'}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Overall Assessment */}
            <div className="mt-4 p-4 bg-white rounded-lg border-2 border-indigo-300 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-md">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-900 mb-1">
                    Strong Inclusion Candidate
                  </div>
                  <div className="text-xs text-slate-600">
                    {passCount} of {totalCount} criteria met • 1 monitoring • All critical requirements satisfied
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-green-700">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Divider with Gradient */}
        <div className="px-6 py-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
            </div>
            <div className="relative flex justify-center">
              <div className="bg-white px-6 py-2 rounded-full border-2 border-slate-200 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Strategy Timeline</span>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Strategy Timeline Section - Integrated */}
        <div className="px-6 pb-6">
          <div className="mb-6">
            <h3 className="text-slate-900 mb-1 flex items-center gap-2">
              <CircleDot className="w-5 h-5 text-indigo-600" />
              Navigate Alpha Milestones
            </h3>
            <p className="text-sm text-slate-500">Plan your entry and exit strategy with precision timing</p>
          </div>

          {/* Timeline Container */}
          <div className="relative bg-gradient-to-br from-slate-50 to-white rounded-xl p-6 border border-slate-200">
            {/* Progress Line */}
            <div className="absolute top-20 left-6 right-6 h-1.5 bg-slate-200 rounded-full">
              <div className="h-full bg-gradient-to-r from-green-500 via-green-500 to-green-300 rounded-full transition-all duration-1000 shadow-sm" style={{ width: '60%' }}></div>
            </div>

            {/* Milestones */}
            <div className="relative grid grid-cols-4 gap-3 sm:gap-4">
              {/* Milestone 1: Incubation */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-green-500 border-4 border-white shadow-lg flex items-center justify-center mb-3 relative z-10 animate-pulse">
                  <Circle className="w-6 h-6 text-white fill-white" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-slate-900 mb-1">Incubation</div>
                  <div className="text-xs text-slate-500 mb-3">Weeks 1-4</div>
                  <div className="group relative inline-block">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 hover:bg-indigo-200 transition-all cursor-help flex items-center justify-center shadow-sm hover:shadow-md">
                      <Info className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-4 bg-slate-900 text-white text-xs rounded-lg shadow-2xl z-[60]">
                      <div className="font-semibold mb-2 text-indigo-300">📊 Discovery Phase</div>
                      <div className="mb-2 text-slate-200">Initial score buildup. Stock begins appearing on institutional radar screens.</div>
                      <div className="text-slate-300 pt-2 border-t border-slate-700">
                        <span className="font-semibold">Strategy:</span> Early research. Build watchlist. No position yet.
                      </div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Milestone 2: Persistence */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-green-500 border-4 border-white shadow-xl flex items-center justify-center mb-3 relative z-10 ring-4 ring-green-200 animate-pulse">
                  <CircleDot className="w-6 h-6 text-white" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-slate-900 mb-1">Persistence</div>
                  <div className="flex items-center justify-center gap-1 text-xs text-green-600 mb-3">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></div>
                    <span className="font-semibold">IN THE ZONE</span>
                  </div>
                  <div className="group relative inline-block">
                    <div className="w-8 h-8 rounded-full bg-green-500 hover:bg-green-600 transition-all cursor-help flex items-center justify-center shadow-md hover:shadow-lg">
                      <Info className="w-4 h-4 text-white" />
                    </div>
                    <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-72 p-4 bg-gradient-to-br from-green-900 to-emerald-900 text-white text-xs rounded-lg shadow-2xl z-[60]">
                      <div className="font-semibold mb-2 text-green-300">🎯 Optimal Entry Window</div>
                      <div className="mb-3 text-green-100">Score consistently above 70. Passive funds are tracking this ticker for liquidity shocks.</div>
                      <div className="p-3 bg-white/10 rounded-lg border border-green-400">
                        <span className="font-semibold text-green-300">BUY Strategy:</span> <span className="text-green-100">Enter position here. Risk/reward is optimal. Institutional accumulation beginning.</span>
                      </div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-green-900"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Milestone 3: Announcement */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-slate-300 border-4 border-white shadow-lg flex items-center justify-center mb-3 relative z-10">
                  <Circle className="w-6 h-6 text-white" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-slate-900 mb-1">Announcement</div>
                  <div className="text-xs text-slate-500 mb-3">T-30 days</div>
                  <div className="group relative inline-block">
                    <div className="w-8 h-8 rounded-full bg-amber-100 hover:bg-amber-200 transition-all cursor-help flex items-center justify-center shadow-sm hover:shadow-md">
                      <Info className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-72 p-4 bg-gradient-to-br from-amber-900 to-orange-900 text-white text-xs rounded-lg shadow-2xl z-[60]">
                      <div className="font-semibold mb-2 text-amber-300">📢 Peak Alpha Window</div>
                      <div className="mb-3 text-amber-100">Official inclusion announcement. Media coverage drives retail interest. Price typically peaks here.</div>
                      <div className="p-3 bg-white/10 rounded-lg border border-amber-400">
                        <span className="font-semibold text-amber-300">SELL Strategy:</span> <span className="text-amber-100">Exit 75% of position. Alpha typically peaks at headline to avoid \"buy the rumor, sell the news\" reversal.</span>
                      </div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-amber-900"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Milestone 4: Effective Date */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-slate-300 border-4 border-white shadow-lg flex items-center justify-center mb-3 relative z-10">
                  <Circle className="w-6 h-6 text-white" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-slate-900 mb-1">Effective Date</div>
                  <div className="text-xs text-slate-500 mb-3">T+0</div>
                  <div className="group relative inline-block">
                    <div className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 transition-all cursor-help flex items-center justify-center shadow-sm hover:shadow-md">
                      <Info className="w-4 h-4 text-red-600" />
                    </div>
                    <div className="hidden group-hover:block absolute bottom-full right-0 mb-3 w-72 p-4 bg-gradient-to-br from-red-900 to-rose-900 text-white text-xs rounded-lg shadow-2xl z-[60]">
                      <div className="font-semibold mb-2 text-red-300">🚪 Final Exit Window</div>
                      <div className="mb-3 text-red-100">Stock officially added to index. Passive rebalancing complete. Buy pressure dissipates.</div>
                      <div className="p-3 bg-white/10 rounded-lg border border-red-400">
                        <span className="font-semibold text-red-300">EXIT Strategy:</span> <span className="text-red-100">Close remaining 25% position. Price pressure gone. Alpha opportunity exhausted.</span>
                      </div>
                      <div className="absolute top-full right-8 -mt-1 border-4 border-transparent border-t-red-900"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Position Indicator */}
            <div className="mt-8 p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-300 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-md">
                  <CircleDot className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-green-900 mb-1.5">
                    Current Stage: Persistence Phase
                  </div>
                  <div className="text-xs text-green-800 mb-3">
                    AXON is in the optimal entry window. Score persistence confirmed above 70 threshold.
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <div className="px-3 py-1.5 bg-white rounded-lg border border-green-300 text-green-900 shadow-sm font-medium">
                      ✓ Entry Zone Active
                    </div>
                    <div className="px-3 py-1.5 bg-white rounded-lg border border-green-300 text-green-900 shadow-sm font-medium">
                      📊 Institutional Tracking
                    </div>
                    <div className="px-3 py-1.5 bg-white rounded-lg border border-green-300 text-green-900 shadow-sm font-medium">
                      ⏱ Est. 4-8 weeks to announcement
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Strategy Coach Summary */}
            <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                <div className="text-xs text-indigo-900 leading-relaxed">
                  <span className="font-semibold">Strategy Coach:</span> Hover over each milestone's info icon to view detailed entry/exit strategies. 
                  Green glowing dots indicate active opportunity windows. Plan your position sizing across multiple milestones.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}