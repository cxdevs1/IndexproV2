import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Target, Sparkles, Info, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useState } from 'react';

interface HistoricalComp {
  ticker: string;
  company: string;
  matchScore: number;
  year: number;
  gain: string;
  pattern: string;
}

const historicalComps: HistoricalComp[] = [
  { ticker: 'PANW', company: 'Palo Alto Networks', matchScore: 85, year: 2018, gain: '+32%', pattern: 'Tech Growth + Strong Score Persistence' },
  { ticker: 'CDNS', company: 'Cadence Design', matchScore: 78, year: 2019, gain: '+28%', pattern: 'Mid-Cap with Institutional Accumulation' },
  { ticker: 'FTNT', company: 'Fortinet', matchScore: 72, year: 2020, gain: '+24%', pattern: 'Cybersecurity + High Liquidity' },
];

export function TradeImpactSimulator() {
  const [portfolioAllocation, setPortfolioAllocation] = useState(5); // percentage
  const [indexBuyPressure, setIndexBuyPressure] = useState(250); // millions in AUM
  const [showHistoricalComp, setShowHistoricalComp] = useState(false);
  const [selectedComp, setSelectedComp] = useState(historicalComps[0]);

  // Calculations
  const portfolioValue = 250000;
  const positionSize = portfolioValue * (portfolioAllocation / 100);
  const currentPrice = 342.18;
  const shares = Math.floor(positionSize / currentPrice);

  // Expected alpha based on index buy pressure and allocation
  const baselineReturn = 8.5; // S&P baseline
  const buyPressureMultiplier = indexBuyPressure / 100; // Scale factor
  const allocationBonus = portfolioAllocation * 0.4; // Higher allocation = more upside
  const expectedAlpha = baselineReturn + buyPressureMultiplier + allocationBonus;

  const chartData = [
    {
      name: 'S&P 500 Baseline',
      value: baselineReturn,
      color: '#94a3b8',
    },
    {
      name: 'Expected Return',
      value: expectedAlpha,
      color: '#6366f1',
    },
  ];

  // P&L Scenarios
  const scenarios = [
    {
      scenario: '-5% Stop Loss',
      price: currentPrice * 0.95,
      pl: positionSize * -0.05,
      plPercent: -5,
      trigger: 'Moderate Risk',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
    },
    {
      scenario: '-10% Stop Loss',
      price: currentPrice * 0.90,
      pl: positionSize * -0.10,
      plPercent: -10,
      trigger: 'High Risk',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    },
    {
      scenario: '-15% Stop Loss',
      price: currentPrice * 0.85,
      pl: positionSize * -0.15,
      plPercent: -15,
      trigger: 'Critical Risk',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
  ];

  // Upside scenarios
  const upsideScenarios = [
    {
      scenario: '+15% Target',
      price: currentPrice * 1.15,
      pl: positionSize * 0.15,
      plPercent: 15,
    },
    {
      scenario: '+25% Target',
      price: currentPrice * 1.25,
      pl: positionSize * 0.25,
      plPercent: 25,
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
          <div className="text-sm text-slate-900 mb-1">{data.payload.name}</div>
          <div className="text-lg font-semibold text-indigo-600">+{data.value.toFixed(1)}%</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Simulator Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl shadow-lg border border-indigo-500 overflow-hidden">
        <div className="p-5 sm:p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="text-white text-base sm:text-lg">Trade Impact Simulator</h3>
              <p className="text-indigo-100 text-xs sm:text-sm">Model your position with precision</p>
            </div>
          </div>
        </div>
      </div>

      {/* Input Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h4 className="text-slate-900 mb-5 flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-600" />
          Position Parameters
        </h4>

        {/* Portfolio Allocation Slider */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm text-slate-700">Portfolio Allocation</label>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl text-slate-900">{portfolioAllocation}%</span>
              <span className="text-xs text-slate-500">(${positionSize.toLocaleString(undefined, { maximumFractionDigits: 0 })})</span>
            </div>
          </div>
          <input
            type="range"
            min="1"
            max="15"
            step="0.5"
            value={portfolioAllocation}
            onChange={(e) => setPortfolioAllocation(Number(e.target.value))}
            className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, rgb(99 102 241) 0%, rgb(99 102 241) ${(portfolioAllocation / 15) * 100}%, rgb(226 232 240) ${(portfolioAllocation / 15) * 100}%, rgb(226 232 240) 100%)`,
            }}
          />
          <div className="flex justify-between text-xs text-slate-400 mt-2">
            <span>1% Conservative</span>
            <span>15% Aggressive</span>
          </div>
        </div>

        {/* Index Buy Pressure Slider */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm text-slate-700 flex items-center gap-2">
              Expected Index Buy-Pressure
              <div className="group relative">
                <Info className="w-4 h-4 text-slate-400 cursor-help" />
                <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-900 text-white text-xs rounded-lg shadow-lg z-10">
                  Estimated passive fund inflows when stock is added to index
                </div>
              </div>
            </label>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl text-slate-900">${indexBuyPressure}M</span>
              <span className="text-xs text-slate-500">AUM</span>
            </div>
          </div>
          <input
            type="range"
            min="50"
            max="500"
            step="10"
            value={indexBuyPressure}
            onChange={(e) => setIndexBuyPressure(Number(e.target.value))}
            className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, rgb(139 92 246) 0%, rgb(139 92 246) ${((indexBuyPressure - 50) / 450) * 100}%, rgb(226 232 240) ${((indexBuyPressure - 50) / 450) * 100}%, rgb(226 232 240) 100%)`,
            }}
          />
          <div className="flex justify-between text-xs text-slate-400 mt-2">
            <span>$50M Low</span>
            <span>$500M High</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-5 border-t border-slate-200">
          <div className="text-center">
            <div className="text-xs text-slate-500 mb-1">Position Size</div>
            <div className="text-base sm:text-lg text-slate-900">${positionSize.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-500 mb-1">Shares</div>
            <div className="text-base sm:text-lg text-slate-900">{shares}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-500 mb-1">Entry Price</div>
            <div className="text-base sm:text-lg text-slate-900">${currentPrice}</div>
          </div>
        </div>
      </div>

      {/* Expected Alpha Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h4 className="text-slate-900 mb-5 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          Expected Performance
        </h4>

        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
              tickLine={false}
            />
            <YAxis
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
              tickLine={false}
              label={{ value: 'Return %', angle: -90, position: 'insideLeft', style: { fontSize: '12px', fill: '#94a3b8' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-5 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
          <div className="flex items-start gap-3">
            <ArrowUpRight className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <div className="text-sm text-green-900 font-medium">
                Expected Alpha: +{(expectedAlpha - baselineReturn).toFixed(1)}%
              </div>
              <div className="text-xs text-green-700 mt-1">
                Outperformance over S&P 500 baseline based on {indexBuyPressure}M index buy pressure
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What-If Risk Engine */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h4 className="text-slate-900 mb-5 flex items-center gap-2">
          <ArrowDownRight className="w-5 h-5 text-red-600" />
          Risk Scenarios (Stop-Loss)
        </h4>

        <div className="space-y-3">
          {scenarios.map((scenario, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${scenario.borderColor} ${scenario.bgColor} transition-all hover:shadow-md`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-sm font-medium text-slate-900 mb-1">{scenario.scenario}</div>
                  <div className={`text-xs ${scenario.color}`}>{scenario.trigger}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-600">Exit Price</div>
                  <div className="text-lg text-slate-900">${scenario.price.toFixed(2)}</div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <div className="text-sm text-slate-600">Projected Loss</div>
                <div className={`text-lg font-semibold ${scenario.color}`}>
                  ${Math.abs(scenario.pl).toLocaleString(undefined, { maximumFractionDigits: 0 })} ({scenario.plPercent}%)
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Upside Targets */}
        <div className="mt-6 pt-6 border-t border-slate-200">
          <h5 className="text-sm text-slate-700 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            Upside Targets
          </h5>
          <div className="space-y-3">
            {upsideScenarios.map((scenario, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-green-200 bg-green-50 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-slate-900">{scenario.scenario}</div>
                    <div className="text-xs text-green-700">Target: ${scenario.price.toFixed(2)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-green-600">
                      +${scenario.pl.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                    <div className="text-xs text-green-600">+{scenario.plPercent}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Historical Comparison */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-gradient-to-br from-purple-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-slate-900 mb-1 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Historical Pattern Match
              </h4>
              <p className="text-sm text-slate-600">Compare against successful inclusions</p>
            </div>
            <button
              onClick={() => setShowHistoricalComp(!showHistoricalComp)}
              className={`px-4 py-2 rounded-lg transition-all ${
                showHistoricalComp
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
              }`}
            >
              {showHistoricalComp ? 'Hide' : 'Show'} Comps
            </button>
          </div>
        </div>

        {showHistoricalComp && (
          <div className="p-5">
            {/* Best Match Highlight */}
            <div className="mb-5 p-5 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl border-2 border-purple-300">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-xs text-purple-700 mb-1">BEST MATCH</div>
                  <div className="text-xl text-slate-900 font-semibold">{selectedComp.ticker}</div>
                  <div className="text-sm text-slate-700">{selectedComp.company}</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-purple-600">{selectedComp.matchScore}%</div>
                  <div className="text-xs text-purple-700">Match Score</div>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Inclusion Year</span>
                  <span className="text-slate-900">{selectedComp.year}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">30-Day Post-Inclusion</span>
                  <span className="text-green-600 font-semibold">{selectedComp.gain}</span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-purple-200">
                <div className="text-xs text-purple-700 mb-1">Pattern Similarity</div>
                <div className="text-sm text-slate-900">{selectedComp.pattern}</div>
              </div>
            </div>

            {/* Other Comparables */}
            <div className="space-y-3">
              <div className="text-sm text-slate-700 mb-3">Other Similar Inclusions</div>
              {historicalComps.slice(1).map((comp) => (
                <button
                  key={comp.ticker}
                  onClick={() => setSelectedComp(comp)}
                  className="w-full p-4 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-left"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-sm font-medium text-slate-900">{comp.ticker}</div>
                      <div className="text-xs text-slate-600">{comp.company}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-indigo-600">{comp.matchScore}%</div>
                      <div className="text-xs text-green-600">{comp.gain}</div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500">{comp.pattern}</div>
                </button>
              ))}
            </div>

            {/* Pattern Insights */}
            <div className="mt-5 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-indigo-600 mt-0.5" />
                <div className="text-xs text-indigo-900">
                  <span className="font-semibold">Pattern Analysis:</span> Current AXON setup mirrors {selectedComp.ticker}'s 
                  pre-inclusion characteristics with {selectedComp.matchScore}% confidence. Key similarities include score 
                  persistence trajectory, market cap range, and sector rotation timing.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}