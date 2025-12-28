import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Target, Sparkles, Info, ArrowUpRight, ArrowDownRight, Wallet, DollarSign } from 'lucide-react';
import { useState, useEffect } from 'react';

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
  const [tradingCapital, setTradingCapital] = useState(250000);
  const [tradingCapitalInput, setTradingCapitalInput] = useState('250000');
  const [saveAsDefault, setSaveAsDefault] = useState(false);

  // Load saved trading capital from localStorage on mount
  useEffect(() => {
    const savedCapital = localStorage.getItem('indexPro_tradingCapital');
    const savedDefault = localStorage.getItem('indexPro_saveAsDefault');
    
    if (savedCapital && savedDefault === 'true') {
      const capital = Number(savedCapital);
      setTradingCapital(capital);
      setTradingCapitalInput(capital.toString());
      setSaveAsDefault(true);
    }
  }, []);

  // Save to localStorage when toggle changes
  useEffect(() => {
    if (saveAsDefault) {
      localStorage.setItem('indexPro_tradingCapital', tradingCapital.toString());
      localStorage.setItem('indexPro_saveAsDefault', 'true');
    } else {
      localStorage.removeItem('indexPro_tradingCapital');
      localStorage.removeItem('indexPro_saveAsDefault');
    }
  }, [saveAsDefault, tradingCapital]);

  const handleTradingCapitalChange = (value: string) => {
    // Remove non-numeric characters except for empty string
    const numericValue = value.replace(/[^0-9]/g, '');
    setTradingCapitalInput(numericValue);
    
    // Update trading capital if it's a valid number
    const capital = Number(numericValue);
    if (capital > 0 || numericValue === '') {
      setTradingCapital(capital || 0);
    }
  };

  const formatCurrency = (value: string) => {
    if (!value) return '';
    const num = Number(value);
    return num.toLocaleString();
  };

  // Calculations
  const portfolioValue = tradingCapital;
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

        {/* Total Trading Capital Input - Prominent at Top */}
        <div className="mb-8 p-6 bg-gradient-to-br from-slate-50 to-indigo-50 rounded-xl border-2 border-indigo-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <label className="text-sm text-slate-600">Total Trading Capital</label>
              <div className="text-xs text-slate-500">Your available capital for trading</div>
            </div>
          </div>

          {/* High-contrast Input Box */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
              <DollarSign className="w-6 h-6 text-slate-400" />
            </div>
            <input
              type="text"
              value={formatCurrency(tradingCapitalInput)}
              onChange={(e) => handleTradingCapitalChange(e.target.value)}
              placeholder="Enter trading capital"
              className="w-full h-16 pl-14 pr-6 text-3xl text-slate-900 bg-white border-2 border-slate-300 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
            />
          </div>

          {/* Calculated Position Badge */}
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-indigo-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <div className="text-xs text-slate-500">Calculated Position ({portfolioAllocation}%)</div>
                <div className="text-lg text-slate-900">${positionSize.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 mb-1">Shares</div>
              <div className="text-lg text-indigo-600">{shares}</div>
            </div>
          </div>

          {/* Set as Default Toggle */}
          <div className="flex items-center justify-between mt-4 p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-slate-200">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={saveAsDefault}
                onChange={(e) => setSaveAsDefault(e.target.checked)}
                id="save-default"
                className="w-4 h-4 text-indigo-600 bg-white border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              />
              <label htmlFor="save-default" className="text-sm text-slate-700 cursor-pointer select-none">
                Remember for next session
              </label>
            </div>
            {saveAsDefault && (
              <div className="flex items-center gap-1 text-xs text-green-600">
                <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                Saved
              </div>
            )}
          </div>
        </div>

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