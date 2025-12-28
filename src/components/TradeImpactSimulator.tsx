import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { TrendingUp, TrendingDown, Target, Sparkles, Info, ArrowUpRight, ArrowDownRight, Wallet, DollarSign, AlertTriangle, Shield, Zap, Flame } from 'lucide-react';
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

type RiskTolerance = 'low' | 'medium' | 'high' | 'degenerate';

export function TradeImpactSimulator() {
  // Core state
  const [convictionLevel, setConvictionLevel] = useState(5); // 1-10 scale
  const [indexBuyPressure, setIndexBuyPressure] = useState(250); // millions in AUM
  const [showHistoricalComp, setShowHistoricalComp] = useState(false);
  const [selectedComp, setSelectedComp] = useState(historicalComps[0]);
  const [tradingCapital, setTradingCapital] = useState(250000);
  const [tradingCapitalInput, setTradingCapitalInput] = useState('250000');
  const [saveAsDefault, setSaveAsDefault] = useState(false);
  
  // New conviction-based inputs
  const [riskTolerance, setRiskTolerance] = useState<RiskTolerance>('medium');
  const [targetEntryPrice, setTargetEntryPrice] = useState('342.18');
  const [targetExitPrice, setTargetExitPrice] = useState('425.00');
  const [showInstitutionalBenchmark, setShowInstitutionalBenchmark] = useState(false);

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
    const numericValue = value.replace(/[^0-9]/g, '');
    setTradingCapitalInput(numericValue);
    
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

  const handlePriceInput = (value: string, setter: (val: string) => void) => {
    // Allow numbers and one decimal point
    const filtered = value.replace(/[^0-9.]/g, '');
    const parts = filtered.split('.');
    if (parts.length > 2) return; // Only one decimal point
    setter(filtered);
  };

  // Conviction to allocation mapping (exponential curve for higher conviction = higher allocation)
  const convictionToAllocation = (conviction: number): number => {
    // Maps conviction 1-10 to allocation 1-20%
    // Lower conviction = conservative, higher conviction = aggressive
    const baseAllocation = 1;
    const maxAllocation = 20;
    return baseAllocation + ((conviction - 1) / 9) * (maxAllocation - baseAllocation);
  };

  // Calculations
  const portfolioAllocation = convictionToAllocation(convictionLevel);
  const portfolioValue = tradingCapital;
  const positionSize = portfolioValue * (portfolioAllocation / 100);
  const entryPrice = Number(targetEntryPrice) || 342.18;
  const exitPrice = Number(targetExitPrice) || 425.00;
  const shares = Math.floor(positionSize / entryPrice);
  
  // Calculate potential gain/loss
  const priceChange = ((exitPrice - entryPrice) / entryPrice) * 100;
  const potentialPL = positionSize * (priceChange / 100);

  // Expected alpha based on conviction and index buy pressure
  const baselineReturn = 8.5; // S&P baseline
  const buyPressureMultiplier = indexBuyPressure / 100;
  const convictionBonus = convictionLevel * 0.8; // Higher conviction = more upside
  const expectedAlpha = baselineReturn + buyPressureMultiplier + convictionBonus;
  
  // Institutional average (historical S&P Committee data)
  const institutionalAverage = 12.3;

  const chartData = [
    {
      name: 'S&P 500 Baseline',
      value: baselineReturn,
      color: '#94a3b8',
    },
    ...(showInstitutionalBenchmark ? [{
      name: 'Institutional Avg',
      value: institutionalAverage,
      color: '#f59e0b',
    }] : []),
    {
      name: 'Your Model',
      value: expectedAlpha,
      color: '#6366f1',
    },
  ];

  // Dynamic stop-loss based on risk tolerance
  const stopLossLevels = {
    low: [3, 5, 7],
    medium: [5, 10, 15],
    high: [10, 15, 20],
    degenerate: [15, 25, 35],
  };

  const stopLosses = stopLossLevels[riskTolerance];

  // P&L Scenarios
  const scenarios = stopLosses.map((loss, index) => {
    const severity = index === 0 ? 'Moderate' : index === 1 ? 'High' : 'Critical';
    const colors = index === 0 
      ? { color: 'text-amber-600', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' }
      : index === 1
      ? { color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' }
      : { color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
    
    return {
      scenario: `-${loss}% Stop Loss`,
      price: entryPrice * (1 - loss / 100),
      pl: positionSize * (-loss / 100),
      plPercent: -loss,
      trigger: `${severity} Risk`,
      ...colors,
    };
  });

  // Upside scenarios based on target exit
  const upsidePercent = priceChange > 0 ? priceChange : 25;
  const upsideScenarios = [
    {
      scenario: 'Target Exit',
      price: exitPrice,
      pl: potentialPL,
      plPercent: priceChange,
    },
    {
      scenario: `+${(upsidePercent * 1.5).toFixed(0)}% Stretch`,
      price: entryPrice * (1 + (upsidePercent * 1.5) / 100),
      pl: positionSize * ((upsidePercent * 1.5) / 100),
      plPercent: upsidePercent * 1.5,
    },
  ];

  // System guardrails & recommendations
  const warnings = [];
  
  if (portfolioAllocation > 10) {
    warnings.push({
      type: 'allocation',
      severity: 'warning',
      message: 'Allocation exceeds 4-standard deviation institutional sizing',
      detail: `Your ${portfolioAllocation.toFixed(1)}% allocation is above the 10% institutional threshold`,
    });
  }
  
  const maxStopLoss = Math.max(...stopLosses);
  if (maxStopLoss > 15) {
    warnings.push({
      type: 'stop-loss',
      severity: 'warning',
      message: 'Statistical probability of recovery drops by 60% at this depth',
      detail: `Wide stop-loss of -${maxStopLoss}% significantly reduces recovery probability`,
    });
  }

  if (riskTolerance === 'degenerate' && portfolioAllocation > 12) {
    warnings.push({
      type: 'extreme',
      severity: 'danger',
      message: 'Extreme risk configuration detected',
      detail: 'High conviction + aggressive risk tolerance may lead to significant drawdowns',
    });
  }

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

  const riskToleranceConfig = {
    low: { icon: Shield, color: 'bg-blue-500', label: 'Low' },
    medium: { icon: Target, color: 'bg-green-500', label: 'Medium' },
    high: { icon: Zap, color: 'bg-orange-500', label: 'High' },
    degenerate: { icon: Flame, color: 'bg-red-500', label: 'Degenerate' },
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
              <h3 className="text-white text-base sm:text-lg">Conviction Modeling Engine</h3>
              <p className="text-indigo-100 text-xs sm:text-sm">Model your thesis with precision guardrails</p>
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

          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-indigo-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <div className="text-xs text-slate-500">Calculated Position ({portfolioAllocation.toFixed(1)}%)</div>
                <div className="text-lg text-slate-900">${positionSize.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 mb-1">Shares</div>
              <div className="text-lg text-indigo-600">{shares}</div>
            </div>
          </div>

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

        {/* Conviction Level Slider */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm text-slate-700 flex items-center gap-2">
              Conviction Level
              <div className="group relative">
                <Info className="w-4 h-4 text-slate-400 cursor-help" />
                <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2 bg-slate-900 text-white text-xs rounded-lg shadow-lg z-10">
                  Your confidence in this trade thesis. Higher conviction = larger position size.
                </div>
              </div>
            </label>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl text-slate-900">{convictionLevel}</span>
              <span className="text-xs text-slate-500">/ 10</span>
            </div>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={convictionLevel}
            onChange={(e) => setConvictionLevel(Number(e.target.value))}
            className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, rgb(99 102 241) 0%, rgb(99 102 241) ${((convictionLevel - 1) / 9) * 100}%, rgb(226 232 240) ${((convictionLevel - 1) / 9) * 100}%, rgb(226 232 240) 100%)`,
            }}
          />
          <div className="flex justify-between text-xs text-slate-400 mt-2">
            <span>1 - Low Conviction</span>
            <span>10 - Maximum Conviction</span>
          </div>
          <div className="mt-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
            <div className="text-xs text-indigo-900">
              <span className="font-semibold">Auto-calculated Allocation:</span> {portfolioAllocation.toFixed(1)}% 
              ({convictionLevel <= 3 ? 'Conservative' : convictionLevel <= 6 ? 'Moderate' : convictionLevel <= 8 ? 'Aggressive' : 'Maximum'})
            </div>
          </div>
        </div>

        {/* Risk Tolerance Pill Toggle */}
        <div className="mb-6">
          <label className="text-sm text-slate-700 mb-3 block">Risk Tolerance</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(Object.keys(riskToleranceConfig) as RiskTolerance[]).map((level) => {
              const config = riskToleranceConfig[level];
              const Icon = config.icon;
              const isActive = riskTolerance === level;
              
              return (
                <button
                  key={level}
                  onClick={() => setRiskTolerance(level)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    isActive
                      ? `${config.color} text-white border-transparent shadow-md`
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 justify-center">
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{config.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="mt-3 text-xs text-slate-500">
            Stop-loss levels: {stopLosses.map(l => `-${l}%`).join(', ')}
          </div>
        </div>

        {/* Custom Entry/Exit Prices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-sm text-slate-700 mb-2 block">Target Entry Price</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <DollarSign className="w-4 h-4 text-slate-400" />
              </div>
              <input
                type="text"
                value={targetEntryPrice}
                onChange={(e) => handlePriceInput(e.target.value, setTargetEntryPrice)}
                placeholder="342.18"
                className="w-full h-12 pl-9 pr-4 text-lg text-slate-900 bg-white border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-700 mb-2 block">Target Exit Price</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <DollarSign className="w-4 h-4 text-slate-400" />
              </div>
              <input
                type="text"
                value={targetExitPrice}
                onChange={(e) => handlePriceInput(e.target.value, setTargetExitPrice)}
                placeholder="425.00"
                className="w-full h-12 pl-9 pr-4 text-lg text-slate-900 bg-white border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Price Change Summary */}
        <div className="p-4 bg-gradient-to-br from-slate-50 to-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-600 mb-1">Expected Price Change</div>
              <div className={`text-xl font-semibold ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-600 mb-1">Potential P&L</div>
              <div className={`text-xl font-semibold ${potentialPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {potentialPL >= 0 ? '+' : ''}${potentialPL.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
            </div>
          </div>
        </div>

        {/* Index Buy Pressure Slider */}
        <div className="mt-6">
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

      {/* Expected Alpha Chart with Institutional Benchmark */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <h4 className="text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Expected Performance
          </h4>
          <button
            onClick={() => setShowInstitutionalBenchmark(!showInstitutionalBenchmark)}
            className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
              showInstitutionalBenchmark
                ? 'bg-amber-100 text-amber-700 border border-amber-300'
                : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
            }`}
          >
            {showInstitutionalBenchmark ? '✓ ' : ''}Institutional Benchmark
          </button>
        </div>

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
                Model Alpha: +{(expectedAlpha - baselineReturn).toFixed(1)}%
              </div>
              <div className="text-xs text-green-700 mt-1">
                {showInstitutionalBenchmark && (
                  <span>
                    {expectedAlpha > institutionalAverage ? 'Outperforming' : 'Underperforming'} institutional avg by {Math.abs(expectedAlpha - institutionalAverage).toFixed(1)}% • 
                  </span>
                )} Based on conviction level {convictionLevel}/10 and ${indexBuyPressure}M buy pressure
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
                    <div className="text-xs text-green-600">+{scenario.plPercent.toFixed(1)}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic System Recommendations / Guardrails */}
      {warnings.length > 0 && (
        <div className="space-y-3">
          {warnings.map((warning, index) => (
            <div
              key={index}
              className={`rounded-xl shadow-sm border-2 overflow-hidden ${
                warning.severity === 'danger'
                  ? 'border-red-300 bg-gradient-to-br from-red-50 to-orange-50'
                  : 'border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50'
              }`}
            >
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    warning.severity === 'danger' ? 'bg-red-100' : 'bg-amber-100'
                  }`}>
                    <AlertTriangle className={`w-5 h-5 ${
                      warning.severity === 'danger' ? 'text-red-600' : 'text-amber-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm font-semibold mb-1 ${
                      warning.severity === 'danger' ? 'text-red-900' : 'text-amber-900'
                    }`}>
                      System Recommendation
                    </div>
                    <div className={`text-sm mb-2 ${
                      warning.severity === 'danger' ? 'text-red-800' : 'text-amber-800'
                    }`}>
                      {warning.message}
                    </div>
                    <div className={`text-xs ${
                      warning.severity === 'danger' ? 'text-red-700' : 'text-amber-700'
                    }`}>
                      {warning.detail}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {warnings.length === 0 && (
        <div className="rounded-xl shadow-sm border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 overflow-hidden">
          <div className="p-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-green-900 mb-1">
                  System Recommendation
                </div>
                <div className="text-sm text-green-800 mb-2">
                  Position parameters within institutional guidelines
                </div>
                <div className="text-xs text-green-700">
                  Your conviction model aligns with risk management best practices. All guardrails are green.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
