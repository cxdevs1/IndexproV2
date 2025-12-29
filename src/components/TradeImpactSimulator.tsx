import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { TrendingUp, TrendingDown, Target, Sparkles, Info, ArrowUpRight, ArrowDownRight, Wallet, DollarSign, AlertTriangle, Shield, Zap, Flame, Activity, Award } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useIsMobile } from './ui/use-mobile';
import { PropulsionGauge } from './PropulsionGauge';
import { MentorshipTooltip } from './MentorshipTooltip';

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

type RiskTolerance = 'defensive' | 'balanced' | 'aggressive' | 'speculative';
type MarketCondition = 'bullish' | 'sideways' | 'stress';

export function TradeImpactSimulator() {
  // Core state
  const [convictionLevel, setConvictionLevel] = useState(5);
  const [institutionalGravity, setInstitutionalGravity] = useState(65); // 0-100 from AUM calculation
  const [exitFriction, setExitFriction] = useState(45); // 0-100 from Short Interest % + Days to Cover
  const [showHistoricalComp, setShowHistoricalComp] = useState(false);
  const [selectedComp, setSelectedComp] = useState(historicalComps[0]);
  const [activeBankroll, setActiveBankroll] = useState(250000);
  const [activeBankrollInput, setActiveBankrollInput] = useState('250000');
  const [saveAsDefault, setSaveAsDefault] = useState(false);
  const [riskTolerance, setRiskTolerance] = useState<RiskTolerance>('balanced');
  const [targetEntryPrice, setTargetEntryPrice] = useState('342.18');
  const [targetExitPrice, setTargetExitPrice] = useState('425.00');
  const [showInstitutionalBenchmark, setShowInstitutionalBenchmark] = useState(false);
  const [marketCondition, setMarketCondition] = useState<MarketCondition>('bullish');
  const [aiAutoPilot, setAiAutoPilot] = useState(false);
  const [isCalculatingAI, setIsCalculatingAI] = useState(false);

  // Load saved active bankroll
  useEffect(() => {
    const savedCapital = localStorage.getItem('indexPro_activeBankroll');
    const savedDefault = localStorage.getItem('indexPro_saveAsDefault');
    
    if (savedCapital && savedDefault === 'true') {
      const capital = Number(savedCapital);
      setActiveBankroll(capital);
      setActiveBankrollInput(capital.toString());
      setSaveAsDefault(true);
    }
  }, []);

  useEffect(() => {
    if (saveAsDefault) {
      localStorage.setItem('indexPro_activeBankroll', activeBankroll.toString());
      localStorage.setItem('indexPro_saveAsDefault', 'true');
    } else {
      localStorage.removeItem('indexPro_activeBankroll');
      localStorage.removeItem('indexPro_saveAsDefault');
    }
  }, [saveAsDefault, activeBankroll]);

  const handleActiveBankrollChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setActiveBankrollInput(numericValue);
    const capital = Number(numericValue);
    if (capital > 0 || numericValue === '') {
      setActiveBankroll(capital || 0);
    }
  };

  const handleCalculateNeural = async () => {
    setIsCalculatingAI(true);
    setAiAutoPilot(false); // Reset state
    
    // Simulate 2-second AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Auto-set market condition based on VIX simulation
    const simulatedVIX = Math.random() * 40; // Random VIX between 0-40
    if (simulatedVIX > 30) {
      setMarketCondition('stress');
    } else if (simulatedVIX > 20) {
      setMarketCondition('sideways');
    } else {
      setMarketCondition('bullish');
    }
    
    setAiAutoPilot(true);
    setIsCalculatingAI(false);
  };

  const formatCurrency = (value: string) => {
    if (!value) return '';
    return Number(value).toLocaleString();
  };

  const handlePriceInput = (value: string, setter: (val: string) => void) => {
    const filtered = value.replace(/[^0-9.]/g, '');
    const parts = filtered.split('.');
    if (parts.length > 2) return;
    setter(filtered);
  };

  const convictionToAllocation = (conviction: number): number => {
    const baseAllocation = 1;
    const maxAllocation = 20;
    return baseAllocation + ((conviction - 1) / 9) * (maxAllocation - baseAllocation);
  };

  // Calculations
  const portfolioAllocation = convictionToAllocation(convictionLevel);
  const portfolioValue = activeBankroll;
  const positionSize = portfolioValue * (portfolioAllocation / 100);
  const entryPrice = Number(targetEntryPrice) || 342.18;
  const exitPrice = Number(targetExitPrice) || 425.00;
  const shares = Math.floor(positionSize / entryPrice);
  const priceChange = ((exitPrice - entryPrice) / entryPrice) * 100;
  const potentialPL = positionSize * (priceChange / 100);

  // Expected alpha
  const baselineReturn = 8.5;
  // Calculate squeeze score from passive flow and short squeeze
  const squeezeScore = Math.round(institutionalGravity * 0.6 + exitFriction * 0.4);
  const buyPressureMultiplier = squeezeScore / 20; // Scale squeeze score to reasonable multiplier
  const convictionBonus = convictionLevel * 0.8;
  const expectedAlpha = baselineReturn + buyPressureMultiplier + convictionBonus;
  const institutionalAverage = 12.3;

  const chartData = [
    { name: 'S&P 500 Baseline', value: baselineReturn, color: '#94a3b8' },
    ...(showInstitutionalBenchmark ? [{ name: 'Institutional Avg', value: institutionalAverage, color: '#f59e0b' }] : []),
    { name: 'Your Model', value: expectedAlpha, color: '#6366f1' },
  ];

  // Stop-loss levels
  const stopLossLevels = {
    defensive: [3, 5, 7],
    balanced: [5, 10, 15],
    aggressive: [10, 15, 20],
    speculative: [15, 25, 35],
  };

  const stopLosses = stopLossLevels[riskTolerance];

  // Scenarios
  const scenarios = stopLosses.map((loss, index) => {
    const severity = index === 0 ? 'Moderate' : index === 1 ? 'High' : 'Critical';
    const colors = index === 0 
      ? { color: 'text-amber-600', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' }
      : index === 1
      ? { color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' }
      : { color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
    
    return {
      scenario: `-${loss}%`,
      price: entryPrice * (1 - loss / 100),
      pl: positionSize * (-loss / 100),
      trigger: severity,
      ...colors,
    };
  });

  const upsidePercent = priceChange > 0 ? priceChange : 25;
  const upsideScenarios = [
    {
      scenario: 'Target',
      price: exitPrice,
      pl: potentialPL,
      percent: priceChange,
    },
    {
      scenario: 'Stretch',
      price: entryPrice * (1 + (upsidePercent * 1.5) / 100),
      pl: positionSize * ((upsidePercent * 1.5) / 100),
      percent: upsidePercent * 1.5,
    },
  ];

  // Warnings
  const warnings = [];
  
  if (portfolioAllocation > 10) {
    warnings.push({
      severity: 'warning',
      message: 'Allocation exceeds institutional threshold',
      detail: `${portfolioAllocation.toFixed(1)}% allocation above 10% recommended maximum`,
    });
  }
  
  const maxStopLoss = Math.max(...stopLosses);
  if (maxStopLoss > 15) {
    warnings.push({
      severity: 'warning',
      message: 'Wide stop-loss reduces recovery probability',
      detail: `Recovery probability drops 60% at -${maxStopLoss}% depth`,
    });
  }

  if (riskTolerance === 'speculative' && portfolioAllocation > 12) {
    warnings.push({
      severity: 'danger',
      message: 'Extreme risk configuration detected',
      detail: 'High conviction + aggressive tolerance may cause significant drawdowns',
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
    defensive: { icon: Shield, color: 'bg-blue-500', label: 'Defensive' },
    balanced: { icon: Target, color: 'bg-green-500', label: 'Balanced' },
    aggressive: { icon: Zap, color: 'bg-orange-500', label: 'Aggressive' },
    speculative: { icon: Flame, color: 'bg-red-500', label: 'Speculative' },
  };

  return (
    <div className="space-y-6" data-tour="scenario">
      {/* Main Scenario Lab Card */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-visible">
        {/* Header - Unified Brand Identity */}
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 p-5 relative overflow-visible rounded-t-xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-11 h-11 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white font-semibold">Scenario Lab</h3>
                <MentorshipTooltip 
                  term="Scenario Lab"
                  definition="Model your trade before risking a dollar. Test different position sizes, risk levels, and market conditions to see your potential profit or loss."
                  position="bottom"
                />
              </div>
              <p className="text-slate-300 text-xs">Model your trade before risking a dollar</p>
            </div>
          </div>
        </div>

        {/* Section 1: Active Bankroll - INPUT ZONE */}
        <div className="p-6 bg-gradient-to-br from-white to-indigo-50" id="active-bankroll">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-indigo-600" />
            </div>
            <h4 className="text-slate-900 font-semibold">Position Configuration</h4>
          </div>

          {/* Trading Capital - Prominent */}
          <div className="mb-6 p-5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <label className="text-sm font-medium text-slate-700">Active Bankroll</label>
                  <MentorshipTooltip 
                    term="Active Bankroll"
                    definition="Your Active Bankroll is the cash you're putting into this specific trade. We calculate your projected gains based on this number, so you can see your potential profit before you commit."
                    position="right"
                  />
                </div>
                <div className="text-xs text-slate-500">Available for position sizing</div>
              </div>
            </div>

            <div className="relative mb-3">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <DollarSign className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={formatCurrency(activeBankrollInput)}
                onChange={(e) => handleActiveBankrollChange(e.target.value)}
                placeholder="Enter capital"
                className="w-full h-14 pl-12 pr-4 text-2xl font-semibold text-slate-900 bg-white border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white/80 backdrop-blur-sm rounded-lg border border-indigo-200">
                <div className="text-xs text-slate-500 mb-1">Position Size ({portfolioAllocation.toFixed(1)}%)</div>
                <div className="text-lg font-semibold text-slate-900">${positionSize.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              </div>
              <div className="p-3 bg-white/80 backdrop-blur-sm rounded-lg border border-indigo-200">
                <div className="text-xs text-slate-500 mb-1">Shares @ ${entryPrice}</div>
                <div className="text-lg font-semibold text-indigo-600">{shares}</div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 p-2 bg-white/60 rounded-lg">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={saveAsDefault}
                  onChange={(e) => setSaveAsDefault(e.target.checked)}
                  id="save-default"
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="save-default" className="text-xs text-slate-600 cursor-pointer">Remember for next session</label>
              </div>
              {saveAsDefault && (
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></div>
                  Saved
                </div>
              )}
            </div>
          </div>

          {/* Market Condition Toggle - NEW */}
          <div className="mb-6 p-5 bg-gradient-to-br from-slate-50 to-indigo-50 rounded-xl border-2 border-slate-200 shadow-sm">
            {/* AI Auto-Pilot Button - On Demand */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-300">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-slate-900">AI Auto-Pilot</span>
                    <MentorshipTooltip 
                      term="AI Auto-Pilot"
                      definition="Automatically adjusts your P&L projections based on real-time market volatility (VIX) and systemic correlation."
                      position="right"
                    />
                  </div>
                  <div className="text-xs text-slate-600">On-demand neural market analysis</div>
                </div>
              </div>
              <button
                onClick={handleCalculateNeural}
                disabled={isCalculatingAI}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  isCalculatingAI
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : aiAutoPilot
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md hover:shadow-lg'
                }`}
              >
                {isCalculatingAI ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Analyzing...</span>
                  </div>
                ) : aiAutoPilot ? (
                  '✓ Applied'
                ) : (
                  'Calculate Neural'
                )}
              </button>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <label className={`text-sm font-medium ${aiAutoPilot ? 'text-slate-500' : 'text-slate-900'}`}>Market Condition</label>
                  <MentorshipTooltip 
                    term="Market Stress Test"
                    definition="Institutional desks never model in a vacuum. This shows if your inclusion trade can survive a broader market slide."
                    position="right"
                  />
                </div>
                <div className={`text-xs ${aiAutoPilot ? 'text-slate-500' : 'text-slate-600'}`}>
                  {aiAutoPilot ? 'AI is controlling market analysis' : 'Adjust alpha expectations for market headwinds'}
                </div>
              </div>
            </div>

            <div className={`grid grid-cols-3 gap-2 ${aiAutoPilot ? 'opacity-50 pointer-events-none' : ''}`}>
              <button
                onClick={() => setMarketCondition('bullish')}
                className={`p-3 rounded-xl border-2 transition-all ${
                  marketCondition === 'bullish'
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-400 text-white shadow-md'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-semibold">Bullish</span>
                </div>
                <div className={`text-[10px] ${marketCondition === 'bullish' ? 'text-green-100' : 'text-slate-500'}`}>
                  Standard
                </div>
              </button>

              <button
                onClick={() => setMarketCondition('sideways')}
                className={`p-3 rounded-xl border-2 transition-all ${
                  marketCondition === 'sideways'
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600 border-blue-400 text-white shadow-md'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Activity className="w-4 h-4" />
                  <span className="text-xs font-semibold">Sideways</span>
                </div>
                <div className={`text-[10px] ${marketCondition === 'sideways' ? 'text-blue-100' : 'text-slate-500'}`}>
                  -10% Alpha
                </div>
              </button>

              <button
                onClick={() => setMarketCondition('stress')}
                className={`p-3 rounded-xl border-2 transition-all ${
                  marketCondition === 'stress'
                    ? 'bg-gradient-to-br from-amber-500 to-orange-600 border-amber-400 text-white shadow-md'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs font-semibold">Stress Test</span>
                </div>
                <div className={`text-[10px] ${marketCondition === 'stress' ? 'text-amber-100' : 'text-slate-500'}`}>
                  -20% Beta Drag
                </div>
              </button>
            </div>
          </div>

          {/* Conviction & Risk in Compact Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6" id="risk-toggles">
            {/* Conviction Level */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                  Conviction Level
                  <div className="group relative">
                    <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                    <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-900 text-white text-xs rounded-lg shadow-lg z-[60]">
                      Your confidence in this trade thesis
                    </div>
                  </div>
                </label>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-slate-900">{convictionLevel}</span>
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
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, rgb(99 102 241) 0%, rgb(99 102 241) ${((convictionLevel - 1) / 9) * 100}%, rgb(226 232 240) ${((convictionLevel - 1) / 9) * 100}%, rgb(226 232 240) 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2">
                <span>Low</span>
                <span>High</span>
              </div>
              <div className="mt-2 px-2 py-1 bg-indigo-50 rounded text-xs text-indigo-900">
                <span className="font-semibold">{convictionLevel <= 3 ? 'Conservative' : convictionLevel <= 6 ? 'Moderate' : convictionLevel <= 8 ? 'Aggressive' : 'Maximum'}</span> allocation
              </div>
            </div>

            {/* Risk Tolerance */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <label className="text-sm font-medium text-slate-700 mb-3 block">Risk Tolerance</label>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {(Object.keys(riskToleranceConfig) as RiskTolerance[]).map((level) => {
                  const config = riskToleranceConfig[level];
                  const Icon = config.icon;
                  const isActive = riskTolerance === level;
                  
                  return (
                    <button
                      key={level}
                      onClick={() => setRiskTolerance(level)}
                      className={`p-2 rounded-lg border transition-all ${
                        isActive
                          ? `${config.color} text-white border-transparent shadow-md`
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 justify-center">
                        <Icon className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">{config.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="text-xs text-slate-500">
                Stop-loss: {stopLosses.map(l => `-${l}%`).join(', ')}
              </div>
            </div>
          </div>

          {/* Entry/Exit Prices */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <label className="text-xs font-medium text-slate-700 mb-2 block">Entry Price</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <DollarSign className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={targetEntryPrice}
                  onChange={(e) => handlePriceInput(e.target.value, setTargetEntryPrice)}
                  className="w-full h-10 pl-8 pr-3 text-base font-semibold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <label className="text-xs font-medium text-slate-700 mb-2 block">Exit Price</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <DollarSign className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={targetExitPrice}
                  onChange={(e) => handlePriceInput(e.target.value, setTargetExitPrice)}
                  className="w-full h-10 pl-8 pr-3 text-base font-semibold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>
          </div>

          {/* Force Multiplier Advisor */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm overflow-visible" id="propulsion-gauge">
            <PropulsionGauge
              institutionalGravity={institutionalGravity}
              exitFriction={exitFriction}
              onInstitutionalGravityChange={setInstitutionalGravity}
              onExitFrictionChange={setExitFriction}
            />
          </div>
        </div>

        {/* Glassmorphic Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

        {/* Section 2: Performance Projection - ANALYSIS ZONE */}
        <div className="p-6 bg-gradient-to-br from-slate-50 to-green-50">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <h4 className="text-slate-900 font-semibold">Expected Performance</h4>
            </div>
            <button
              onClick={() => setShowInstitutionalBenchmark(!showInstitutionalBenchmark)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                showInstitutionalBenchmark
                  ? 'bg-amber-100 text-amber-700 border border-amber-300'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {showInstitutionalBenchmark ? '✓ ' : ''}Benchmark
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4 shadow-sm">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: '11px' }} tickLine={false} />
                <YAxis stroke="#94a3b8" style={{ fontSize: '11px' }} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-2 mb-1">
                <ArrowUpRight className="w-4 h-4 text-green-600" />
                <div className="text-xs text-green-700">Model Alpha</div>
              </div>
              <div className="text-xl font-bold text-green-600">+{(expectedAlpha - baselineReturn).toFixed(1)}%</div>
              <div className="text-xs text-green-700 mt-1">vs. S&P baseline</div>
            </div>
            <div className={`p-4 rounded-xl border ${
              priceChange >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}>
              <div className="text-xs text-slate-600 mb-1">Target P&L</div>
              <div className={`text-xl font-bold ${potentialPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {potentialPL >= 0 ? '+' : ''}${potentialPL.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <div className={`text-xs mt-1 ${priceChange >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(1)}% price change
              </div>
            </div>
          </div>
        </div>

        {/* Glassmorphic Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

        {/* Section 3: Risk/Reward Matrix - PLANNING ZONE */}
        <div className="p-6 bg-gradient-to-br from-white to-orange-50">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-orange-600" />
            </div>
            <h4 className="text-slate-900 font-semibold">Risk & Reward Scenarios</h4>
          </div>

          {/* Unified Risk/Reward Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Downside Risk */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <ArrowDownRight className="w-4 h-4 text-red-600" />
                <h5 className="text-sm font-semibold text-slate-900">Stop-Loss Levels</h5>
              </div>
              <div className="space-y-2">
                {scenarios.map((scenario, index) => (
                  <div key={index} className={`p-3 rounded-lg border ${scenario.borderColor} ${scenario.bgColor}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-900">{scenario.scenario}</span>
                      <span className={`text-xs font-medium ${scenario.color}`}>{scenario.trigger}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">${scenario.price.toFixed(2)}</span>
                      <span className={`font-semibold ${scenario.color}`}>
                        -${Math.abs(scenario.pl).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upside Targets */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <h5 className="text-sm font-semibold text-slate-900">Upside Targets</h5>
              </div>
              <div className="space-y-2">
                {upsideScenarios.map((scenario, index) => (
                  <div key={index} className="p-3 rounded-lg border border-green-200 bg-green-50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-900">{scenario.scenario}</span>
                      <span className="text-xs font-medium text-green-700">+{scenario.percent.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">${scenario.price.toFixed(2)}</span>
                      <span className="font-semibold text-green-600">
                        +${scenario.pl.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  </div>
                ))}
                {/* Empty state for visual balance */}
                <div className="p-3 rounded-lg border-2 border-dashed border-green-200 bg-green-50/50">
                  <div className="text-xs text-center text-green-700">
                    Adjust exit price for custom targets
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Glassmorphic Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

        {/* Section 4: Validation Layer - CONFIDENCE ZONE */}
        <div className="p-6 bg-gradient-to-br from-slate-50 to-purple-50">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Award className="w-4 h-4 text-purple-600" />
            </div>
            <h4 className="text-slate-900 font-semibold">Validation & Insights</h4>
          </div>

          {/* System Guardrails */}
          <div className="mb-4">
            {warnings.length > 0 ? (
              <div className="space-y-2">
                {warnings.map((warning, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border-2 ${
                      warning.severity === 'danger'
                        ? 'border-red-300 bg-gradient-to-br from-red-50 to-orange-50'
                        : 'border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        warning.severity === 'danger' ? 'bg-red-100' : 'bg-amber-100'
                      }`}>
                        <AlertTriangle className={`w-4 h-4 ${
                          warning.severity === 'danger' ? 'text-red-600' : 'text-amber-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className={`text-sm font-semibold mb-0.5 ${
                          warning.severity === 'danger' ? 'text-red-900' : 'text-amber-900'
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
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-green-900 mb-0.5">
                      All Systems Green
                    </div>
                    <div className="text-xs text-green-700">
                      Position parameters within institutional guidelines. Guardrails satisfied.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Historical Pattern Match - Collapsible */}
          <div className="bg-white rounded-xl border border-purple-200 overflow-hidden shadow-sm">
            <button
              onClick={() => setShowHistoricalComp(!showHistoricalComp)}
              className="w-full p-4 flex items-center justify-between hover:bg-purple-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-semibold text-slate-900">Historical Pattern Match</span>
              </div>
              <div className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                showHistoricalComp
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-100 text-purple-700'
              }`}>
                {showHistoricalComp ? 'Hide' : 'Show'}
              </div>
            </button>

            {showHistoricalComp && (
              <div className="p-4 border-t border-purple-100 bg-gradient-to-br from-purple-50/50 to-transparent">
                {/* Best Match Highlight */}
                <div className="p-4 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl border-2 border-purple-300 mb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-xs text-purple-700 font-semibold mb-1">BEST MATCH</div>
                      <div className="text-lg font-bold text-slate-900">{selectedComp.ticker}</div>
                      <div className="text-sm text-slate-700">{selectedComp.company}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">{selectedComp.matchScore}%</div>
                      <div className="text-xs text-purple-700">Match</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="p-2 bg-white/80 rounded-lg">
                      <div className="text-xs text-slate-600">Inclusion Year</div>
                      <div className="text-sm font-semibold text-slate-900">{selectedComp.year}</div>
                    </div>
                    <div className="p-2 bg-white/80 rounded-lg">
                      <div className="text-xs text-slate-600">30-Day Gain</div>
                      <div className="text-sm font-semibold text-green-600">{selectedComp.gain}</div>
                    </div>
                  </div>

                  <div className="p-2 bg-white rounded-lg border border-purple-200">
                    <div className="text-xs text-purple-700 mb-0.5">Pattern</div>
                    <div className="text-xs text-slate-900">{selectedComp.pattern}</div>
                  </div>
                </div>

                {/* Other Comps */}
                <div className="space-y-2">
                  <div className="text-xs text-slate-600 mb-2">Other Similar Patterns</div>
                  {historicalComps.slice(1).map((comp) => (
                    <button
                      key={comp.ticker}
                      onClick={() => setSelectedComp(comp)}
                      className="w-full p-3 rounded-lg border border-slate-200 hover:border-purple-300 hover:bg-purple-50 transition-all text-left"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <div className="text-sm font-medium text-slate-900">{comp.ticker}</div>
                          <div className="text-xs text-slate-600">{comp.company}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-base font-semibold text-purple-600">{comp.matchScore}%</div>
                          <div className="text-xs text-green-600">{comp.gain}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                  <div className="flex items-start gap-2">
                    <Info className="w-3.5 h-3.5 text-indigo-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-indigo-900">
                      Current AXON setup mirrors {selectedComp.ticker}'s pre-inclusion characteristics with {selectedComp.matchScore}% confidence.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}