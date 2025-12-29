import { Activity, TrendingUp, Zap, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface ForceMultiplierGaugeProps {
  passiveFlowImpact: number; // 0-100 from AUM calculation
  shortSqueezePotential: number; // 0-100 from Short Interest % + Days to Cover
  onPassiveFlowChange: (value: number) => void;
  onShortSqueezeChange: (value: number) => void;
}

export function ForceMultiplierGauge({ 
  passiveFlowImpact, 
  shortSqueezePotential,
  onPassiveFlowChange,
  onShortSqueezeChange
}: ForceMultiplierGaugeProps) {
  const [hoveredSide, setHoveredSide] = useState<'passive' | 'squeeze' | null>(null);

  // Calculate Squeeze Score (1-100)
  // Weighted: 60% passive flow + 40% short squeeze
  const squeezeScore = Math.round(passiveFlowImpact * 0.6 + shortSqueezePotential * 0.4);

  // Determine intensity level
  const getIntensityConfig = (score: number) => {
    if (score >= 75) {
      return {
        label: 'Extreme Squeeze',
        color: '#ef4444',
        glowColor: 'rgba(239, 68, 68, 0.3)',
        bgGradient: 'from-red-50 to-pink-50',
        description: 'Very high probability of significant price movement',
        icon: Zap,
      };
    } else if (score >= 50) {
      return {
        label: 'Moderate Squeeze',
        color: '#f59e0b',
        glowColor: 'rgba(245, 158, 11, 0.3)',
        bgGradient: 'from-amber-50 to-orange-50',
        description: 'Elevated buying pressure expected',
        icon: AlertTriangle,
      };
    } else {
      return {
        label: 'Normal Flow',
        color: '#10b981',
        glowColor: 'rgba(16, 185, 129, 0.3)',
        bgGradient: 'from-green-50 to-emerald-50',
        description: 'Standard market dynamics',
        icon: Activity,
      };
    }
  };

  const intensityConfig = getIntensityConfig(squeezeScore);
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

  // Left arc (Passive Flow) - 180 to 90 degrees
  const leftStart = polarToCartesian(180);
  const leftEnd = polarToCartesian(90);
  const leftArcPath = `M ${leftStart.x} ${leftStart.y} A ${radius} ${radius} 0 0 1 ${leftEnd.x} ${leftEnd.y}`;

  // Right arc (Short Squeeze) - 90 to 0 degrees  
  const rightStart = polarToCartesian(90);
  const rightEnd = polarToCartesian(0);
  const rightArcPath = `M ${rightStart.x} ${rightStart.y} A ${radius} ${radius} 0 0 1 ${rightEnd.x} ${rightEnd.y}`;

  // Calculate needle positions
  const passiveNeedleAngle = 180 - (passiveFlowImpact / 100) * 90;
  const squeezeNeedleAngle = 90 - (shortSqueezePotential / 100) * 90;
  
  const passiveNeedleTip = polarToCartesian(passiveNeedleAngle);
  const squeezeNeedleTip = polarToCartesian(squeezeNeedleAngle);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">Force Multiplier Gauge</h4>
            <p className="text-xs text-slate-500">Dual-axis squeeze intensity predictor</p>
          </div>
        </div>
        <div className={`px-4 py-2 bg-gradient-to-br ${intensityConfig.bgGradient} rounded-xl border-2`}
          style={{ borderColor: intensityConfig.color }}>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: intensityConfig.color }}>
              {squeezeScore}
            </div>
            <div className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide">
              Squeeze Score
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

        <div className="relative pb-2">
          <div className="pt-0 pb-2">
            <svg
              width={width}
              height={height}
              viewBox={`0 0 ${width} ${height}`}
              className="mx-auto"
              style={{ overflow: 'visible' }}
            >
              <defs>
                {/* Passive Flow Gradient (Cyan/Blue) */}
                <linearGradient id="passiveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
                </linearGradient>

                {/* Short Squeeze Gradient (Pink/Red) */}
                <linearGradient id="squeezeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
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
                stroke="url(#passiveGradient)" 
                strokeWidth={strokeWidth} 
                strokeLinecap="round"
                opacity={hoveredSide === 'squeeze' ? 0.4 : 1}
              />
              <path 
                d={rightArcPath} 
                fill="none" 
                stroke="url(#squeezeGradient)" 
                strokeWidth={strokeWidth} 
                strokeLinecap="round"
                opacity={hoveredSide === 'passive' ? 0.4 : 1}
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

              {/* Passive Flow Needle */}
              <g style={{ filter: 'url(#needleShadow)', transition: 'all 0.5s ease' }}>
                <line
                  x1={centerX}
                  y1={centerY}
                  x2={passiveNeedleTip.x}
                  y2={passiveNeedleTip.y}
                  stroke="#06b6d4"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <circle cx={passiveNeedleTip.x} cy={passiveNeedleTip.y} r="8" fill="#06b6d4" />
              </g>

              {/* Short Squeeze Needle */}
              <g style={{ filter: 'url(#needleShadow)', transition: 'all 0.5s ease' }}>
                <line
                  x1={centerX}
                  y1={centerY}
                  x2={squeezeNeedleTip.x}
                  y2={squeezeNeedleTip.y}
                  stroke="#ec4899"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <circle cx={squeezeNeedleTip.x} cy={squeezeNeedleTip.y} r="8" fill="#ec4899" />
              </g>

              {/* Center hub */}
              <circle cx={centerX} cy={centerY} r="20" fill="url(#passiveGradient)" opacity="0.2" />
              <circle cx={centerX} cy={centerY} r="14" fill="white" stroke="#6366f1" strokeWidth="3" />
              <circle cx={centerX} cy={centerY} r="6" fill="#6366f1" />
            </svg>

            {/* Labels */}
            <div className="flex justify-between items-start px-4 mt-4">
              <div 
                className="flex-1 text-center cursor-pointer transition-all"
                onMouseEnter={() => setHoveredSide('passive')}
                onMouseLeave={() => setHoveredSide(null)}
              >
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  hoveredSide === 'passive' ? 'bg-cyan-100 scale-105' : 'bg-cyan-50'
                }`}>
                  <Activity className="w-5 h-5 text-cyan-600" />
                  <div className="text-left">
                    <div className="text-xs font-semibold text-cyan-700">Passive Flow</div>
                    <div className="text-lg font-bold text-cyan-900">{passiveFlowImpact}%</div>
                  </div>
                </div>
              </div>

              <div 
                className="flex-1 text-center cursor-pointer transition-all"
                onMouseEnter={() => setHoveredSide('squeeze')}
                onMouseLeave={() => setHoveredSide(null)}
              >
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  hoveredSide === 'squeeze' ? 'bg-pink-100 scale-105' : 'bg-pink-50'
                }`}>
                  <TrendingUp className="w-5 h-5 text-pink-600" />
                  <div className="text-left">
                    <div className="text-xs font-semibold text-pink-700">Short Squeeze</div>
                    <div className="text-lg font-bold text-pink-900">{shortSqueezePotential}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Control Sliders */}
        <div className="space-y-4 mt-6">
          {/* Passive Flow Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-600" />
                Passive Flow Impact (AUM)
              </label>
              <span className="text-sm font-bold text-cyan-700">{passiveFlowImpact}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={passiveFlowImpact}
              onChange={(e) => onPassiveFlowChange(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${passiveFlowImpact}%, #e2e8f0 ${passiveFlowImpact}%, #e2e8f0 100%)`
              }}
            />
          </div>

          {/* Short Squeeze Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-pink-600" />
                Short Squeeze Potential (SI% + DTC)
              </label>
              <span className="text-sm font-bold text-pink-700">{shortSqueezePotential}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={shortSqueezePotential}
              onChange={(e) => onShortSqueezeChange(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${shortSqueezePotential}%, #e2e8f0 ${shortSqueezePotential}%, #e2e8f0 100%)`
              }}
            />
          </div>
        </div>
      </div>

      {/* Intensity Analysis Card */}
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
              <h5 className="font-semibold text-slate-900">{intensityConfig.label}</h5>
              <p className="text-xs text-slate-600">{intensityConfig.description}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold" style={{ color: intensityConfig.color }}>
                {squeezeScore}
              </div>
              <div className="text-[10px] font-semibold text-slate-600 uppercase">Score</div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-slate-200">
              <div className="text-xs text-slate-600 mb-1">Passive Component</div>
              <div className="text-xl font-bold text-cyan-700">{Math.round(passiveFlowImpact * 0.6)}</div>
              <div className="text-[10px] text-slate-500">60% weight</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-slate-200">
              <div className="text-xs text-slate-600 mb-1">Squeeze Component</div>
              <div className="text-xl font-bold text-pink-700">{Math.round(shortSqueezePotential * 0.4)}</div>
              <div className="text-[10px] text-slate-500">40% weight</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}