import { Activity, TrendingUp, Zap, Rocket, Flame } from 'lucide-react';
import { useState } from 'react';
import { MentorshipTooltip } from './MentorshipTooltip';

interface PropulsionGaugeProps {
  institutionalGravity: number; // 0-100 from AUM calculation
  exitFriction: number; // 0-100 from Short Interest % + Days to Cover
  onInstitutionalGravityChange: (value: number) => void;
  onExitFrictionChange: (value: number) => void;
}

export function PropulsionGauge({ 
  institutionalGravity, 
  exitFriction,
  onInstitutionalGravityChange,
  onExitFrictionChange
}: PropulsionGaugeProps) {
  const [hoveredSide, setHoveredSide] = useState<'gravity' | 'friction' | null>(null);

  // Calculate Propulsion Score (1-100)
  // Weighted: 60% institutional gravity + 40% exit friction
  const propulsionScore = Math.round(institutionalGravity * 0.6 + exitFriction * 0.4);

  // Determine intensity level - Opportunity-based (not risk-based!)
  const getIntensityConfig = (score: number) => {
    if (score >= 80) {
      return {
        label: 'Ignition',
        color: '#fbbf24', // vibrant gold
        glowColor: 'rgba(251, 191, 36, 0.4)',
        bgGradient: 'from-yellow-50 via-amber-50 to-purple-50',
        description: 'Exceptional launch potential—maximum upward pressure expected',
        icon: Rocket,
      };
    } else if (score >= 50) {
      return {
        label: 'Charging',
        color: '#6366f1', // indigo
        glowColor: 'rgba(99, 102, 241, 0.3)',
        bgGradient: 'from-indigo-50 to-purple-50',
        description: 'Building momentum—elevated buying pressure forming',
        icon: Flame,
      };
    } else {
      return {
        label: 'Idle',
        color: '#64748b', // slate
        glowColor: 'rgba(100, 116, 139, 0.2)',
        bgGradient: 'from-slate-50 to-slate-100',
        description: 'Standard market dynamics—baseline opportunity',
        icon: Activity,
      };
    }
  };

  const intensityConfig = getIntensityConfig(propulsionScore);
  const IntensityIcon = intensityConfig.icon;

  // SVG dimensions for dual gauge
  const width = 400;
  const height = 240;
  const centerX = width / 2;
  const centerY = height - 30;
  const radius = 140;
  const strokeWidth = 28;

  // Arc calculations
  const polarToCartesian = (angle: number) => {
    const radians = (angle * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(radians),
      y: centerY - radius * Math.sin(radians),
    };
  };

  // Left arc (Institutional Gravity) - 180 to 90 degrees
  const leftStart = polarToCartesian(180);
  const leftEnd = polarToCartesian(90);
  const leftArcPath = `M ${leftStart.x} ${leftStart.y} A ${radius} ${radius} 0 0 1 ${leftEnd.x} ${leftEnd.y}`;

  // Right arc (Exit Friction) - 90 to 0 degrees  
  const rightStart = polarToCartesian(90);
  const rightEnd = polarToCartesian(0);
  const rightArcPath = `M ${rightStart.x} ${rightStart.y} A ${radius} ${radius} 0 0 1 ${rightEnd.x} ${rightEnd.y}`;

  // Calculate needle positions
  const gravityNeedleAngle = 180 - (institutionalGravity / 100) * 90;
  const frictionNeedleAngle = 90 - (exitFriction / 100) * 90;
  
  const gravityNeedleTip = polarToCartesian(gravityNeedleAngle);
  const frictionNeedleTip = polarToCartesian(frictionNeedleAngle);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center">
              <h4 className="font-semibold text-slate-900">The Propulsion Gauge</h4>
              <MentorshipTooltip
                term="Propulsion Score"
                definition="A combined metric showing how much buying pressure we expect. Higher scores = stronger potential for price gains when the stock is officially added to the index. A score of 80+ means both passive funds AND short sellers will need to buy shares, creating exceptional upward pressure."
                position="right"
              />
            </div>
            <p className="text-xs text-slate-500">Dual-axis squeeze intensity predictor</p>
          </div>
        </div>
        <div className={`px-4 py-2 bg-gradient-to-br ${intensityConfig.bgGradient} rounded-xl border-2`}
          style={{ borderColor: intensityConfig.color }}>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: intensityConfig.color }}>
              {propulsionScore}
            </div>
            <div className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide">
              Propulsion Score
            </div>
          </div>
        </div>
      </div>

      {/* Dual Gauge Visualization */}
      <div className="relative bg-gradient-to-br from-slate-50 to-purple-50/30 rounded-2xl border-2 border-slate-200/50 p-6 shadow-sm overflow-visible">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-20 rounded-2xl overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-200 rounded-full blur-3xl"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-200 rounded-full blur-3xl"></div>
        </div>

        <div className="relative">
          <div className="pt-0 pb-2">
            <svg
              width={width}
              height={height}
              viewBox={`0 0 ${width} ${height}`}
              className="mx-auto"
              style={{ overflow: 'visible' }}
            >
              <defs>
                {/* Institutional Gravity Gradient (Cyan/Blue) */}
                <linearGradient id="gravityGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
                </linearGradient>

                {/* Exit Friction Gradient (Pink/Red) */}
                <linearGradient id="frictionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#ef4444', stopOpacity: 1 }} />
                </linearGradient>

                {/* Needle shadow */}
                <filter id="needleShadow">
                  <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3"/>
                </filter>
              </defs>

              {/* Background arcs */}
              <path d={leftArcPath} fill="none" stroke="#e2e8f0" strokeWidth={strokeWidth} strokeLinecap="round" opacity="0.3" />
              <path d={rightArcPath} fill="none" stroke="#e2e8f0" strokeWidth={strokeWidth} strokeLinecap="round" opacity="0.3" />

              {/* Active arcs */}
              <path 
                d={leftArcPath} 
                fill="none" 
                stroke="url(#gravityGradient)" 
                strokeWidth={strokeWidth} 
                strokeLinecap="round"
                opacity={hoveredSide === 'friction' ? 0.4 : 1}
              />
              <path 
                d={rightArcPath} 
                fill="none" 
                stroke="url(#frictionGradient)" 
                strokeWidth={strokeWidth} 
                strokeLinecap="round"
                opacity={hoveredSide === 'gravity' ? 0.4 : 1}
              />

              {/* Center divider line */}
              <line
                x1={centerX}
                y1={centerY - radius - 20}
                x2={centerX}
                y2={centerY}
                stroke="#94a3b8"
                strokeWidth="3"
                strokeDasharray="5,5"
                opacity="0.4"
              />

              {/* Institutional Gravity Needle */}
              <g style={{ filter: 'url(#needleShadow)', transition: 'all 0.5s ease' }}>
                <line
                  x1={centerX}
                  y1={centerY}
                  x2={gravityNeedleTip.x}
                  y2={gravityNeedleTip.y}
                  stroke="#06b6d4"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <circle cx={gravityNeedleTip.x} cy={gravityNeedleTip.y} r="8" fill="#06b6d4" />
              </g>

              {/* Exit Friction Needle */}
              <g style={{ filter: 'url(#needleShadow)', transition: 'all 0.5s ease' }}>
                <line
                  x1={centerX}
                  y1={centerY}
                  x2={frictionNeedleTip.x}
                  y2={frictionNeedleTip.y}
                  stroke="#ec4899"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <circle cx={frictionNeedleTip.x} cy={frictionNeedleTip.y} r="8" fill="#ec4899" />
              </g>

              {/* Center hub */}
              <circle cx={centerX} cy={centerY} r="20" fill="url(#gravityGradient)" opacity="0.2" />
              <circle cx={centerX} cy={centerY} r="14" fill="white" stroke="#6366f1" strokeWidth="3" />
              <circle cx={centerX} cy={centerY} r="6" fill="#6366f1" />
            </svg>

            {/* Labels */}
            <div className="flex justify-between items-start px-4 mt-4">
              <div 
                className="flex-1 text-center cursor-pointer transition-all"
                onMouseEnter={() => setHoveredSide('gravity')}
                onMouseLeave={() => setHoveredSide(null)}
              >
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  hoveredSide === 'gravity' ? 'bg-cyan-100 scale-105' : 'bg-cyan-50'
                }`}>
                  <Activity className="w-5 h-5 text-cyan-600" />
                  <div className="text-left">
                    <div className="text-xs font-semibold text-cyan-700">Institutional Gravity</div>
                    <div className="text-lg font-bold text-cyan-900">{institutionalGravity}%</div>
                  </div>
                </div>
              </div>

              <div 
                className="flex-1 text-center cursor-pointer transition-all"
                onMouseEnter={() => setHoveredSide('friction')}
                onMouseLeave={() => setHoveredSide(null)}
              >
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  hoveredSide === 'friction' ? 'bg-pink-100 scale-105' : 'bg-pink-50'
                }`}>
                  <TrendingUp className="w-5 h-5 text-pink-600" />
                  <div className="text-left">
                    <div className="text-xs font-semibold text-pink-700">Exit Friction</div>
                    <div className="text-lg font-bold text-pink-900">{exitFriction}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Control Sliders */}
        <div className="space-y-4 mt-6">
          {/* Institutional Gravity Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700 flex items-center">
                <Activity className="w-4 h-4 text-cyan-600 mr-2" />
                Institutional Gravity (AUM)
                <MentorshipTooltip
                  term="Institutional Gravity"
                  definition="How much passive index funds will need to buy. When a stock joins an index, trillions in 'robot money' automatically buy shares to match the index. If AXON joins the S&P 600, every S&P 600 index fund must buy it. Higher AUM = more buying pressure."
                  position="right"
                />
              </label>
              <span className="text-sm font-bold text-cyan-700">{institutionalGravity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={institutionalGravity}
              onChange={(e) => onInstitutionalGravityChange(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${institutionalGravity}%, #e2e8f0 ${institutionalGravity}%, #e2e8f0 100%)`
              }}
            />
          </div>

          {/* Exit Friction Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700 flex items-center">
                <TrendingUp className="w-4 h-4 text-pink-600 mr-2" />
                Exit Friction (SI% + DTC)
                <MentorshipTooltip
                  term="Exit Friction"
                  definition="How many short sellers will be forced to buy back shares. Short sellers bet against stocks. When the stock joins an index, they often panic and buy back their shares (covering), creating extra upward pressure. If 20% of shares are sold short, those shorts must buy back when inclusion is announced, adding fuel to the rally."
                  position="right"
                />
              </label>
              <span className="text-sm font-bold text-pink-700">{exitFriction}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={exitFriction}
              onChange={(e) => onExitFrictionChange(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${exitFriction}%, #e2e8f0 ${exitFriction}%, #e2e8f0 100%)`
              }}
            />
          </div>
        </div>
      </div>

      {/* Launch Potential Analysis Card */}
      <div className={`relative bg-gradient-to-br ${intensityConfig.bgGradient} rounded-2xl p-5 border-2 overflow-hidden shadow-sm`}
        style={{ borderColor: intensityConfig.color }}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl"
            style={{ backgroundColor: intensityConfig.color }}></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
              style={{ backgroundColor: intensityConfig.color }}>
              <IntensityIcon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h5 className="font-semibold text-slate-900">Launch Potential: {intensityConfig.label}</h5>
              <p className="text-xs text-slate-600">{intensityConfig.description}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold" style={{ color: intensityConfig.color }}>
                {propulsionScore}
              </div>
              <div className="text-[10px] font-semibold text-slate-600 uppercase">Score</div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-slate-200">
              <div className="text-xs text-slate-600 mb-1">Gravity Component</div>
              <div className="text-xl font-bold text-cyan-700">{Math.round(institutionalGravity * 0.6)}</div>
              <div className="text-[10px] text-slate-500">60% weight</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-slate-200">
              <div className="text-xs text-slate-600 mb-1">Friction Component</div>
              <div className="text-xl font-bold text-pink-700">{Math.round(exitFriction * 0.4)}</div>
              <div className="text-[10px] text-slate-500">40% weight</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pro Insight Footer */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-xs font-semibold text-indigo-900 mb-1">Pro Insight</div>
            <p className="text-xs text-indigo-700 leading-relaxed">
              Low volume often precedes a 'Liquidity Gap.' Watch for the Propulsion Score to spike as institutional buying begins.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}