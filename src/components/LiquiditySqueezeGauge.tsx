import { Droplets, TrendingUp, AlertCircle, Zap } from 'lucide-react';
import { useState } from 'react';

interface LiquiditySqueezeGaugeProps {
  tier: 1 | 2 | 3;
  onTierChange: (tier: 1 | 2 | 3) => void;
}

const tierConfig = {
  1: {
    label: 'Fluid Market',
    shortLabel: 'Fluid',
    description: 'Standard passive flow with minimal price impact.',
    detailedDescription: 'Low institutional pressure. Index funds buying represents <10% of daily volume.',
    color: '#10b981', // green-500
    glowColor: 'rgba(16, 185, 129, 0.4)',
    bgGradient: 'from-green-50 to-emerald-50',
    borderColor: 'border-green-300',
    textColor: 'text-green-700',
    iconBg: 'bg-green-500',
    percentage: 20,
    strategyNote: 'Optimal entry window. Standard inclusion scenario with gradual price discovery over 3-5 days. Best timing: Pre-announcement positioning for early alpha capture.',
    strategyIcon: TrendingUp,
    buyPressure: 150,
    riskLevel: 'Low',
  },
  2: {
    label: 'Moderate Squeeze',
    shortLabel: 'Moderate',
    description: 'Elevated flow creating noticeable buying pressure.',
    detailedDescription: 'Passive funds must buy 20% of daily volume. Expect increased volatility.',
    color: '#f59e0b', // amber-500
    glowColor: 'rgba(245, 158, 11, 0.4)',
    bgGradient: 'from-amber-50 to-orange-50',
    borderColor: 'border-amber-300',
    textColor: 'text-amber-700',
    iconBg: 'bg-amber-500',
    percentage: 50,
    strategyNote: 'Moderate squeeze scenario. Anticipate 2-3 day buying window with elevated volatility. Consider scaling entries across multiple sessions to average pricing.',
    strategyIcon: AlertCircle,
    buyPressure: 250,
    riskLevel: 'Medium',
  },
  3: {
    label: 'High Squeeze',
    shortLabel: 'Squeezed',
    description: 'Intense forced buying with significant price impact.',
    detailedDescription: 'Passive funds must buy 2x the daily liquid float. High gap-up probability.',
    color: '#ef4444', // red-500
    glowColor: 'rgba(239, 68, 68, 0.4)',
    bgGradient: 'from-red-50 to-pink-50',
    borderColor: 'border-red-300',
    textColor: 'text-red-700',
    iconBg: 'bg-red-500',
    percentage: 85,
    strategyNote: 'High squeeze scenario. Institutional "forced buying" often creates gap-ups at market open. Model your exit closer to the Announcement milestone for maximum profit capture.',
    strategyIcon: Zap,
    buyPressure: 400,
    riskLevel: 'High',
  },
};

export function LiquiditySqueezeGauge({ tier, onTierChange }: LiquiditySqueezeGaugeProps) {
  const [hoveredTier, setHoveredTier] = useState<1 | 2 | 3 | null>(null);
  const currentConfig = tierConfig[tier];
  const displayConfig = hoveredTier ? tierConfig[hoveredTier] : currentConfig;

  // SVG dimensions - calculated to show full semi-circle with proper clearance
  const width = 320;
  const height = 200;
  const centerX = width / 2;
  const centerY = height - 20; // Position center with clearance at bottom
  const radius = 120;
  const strokeWidth = 24;

  // Calculate the arc path for semi-circle (180 degrees)
  const startAngle = 180; // Left side
  const endAngle = 0; // Right side
  
  const polarToCartesian = (angle: number) => {
    const radians = (angle * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(radians),
      y: centerY - radius * Math.sin(radians),
    };
  };

  // Create full semi-circle path
  const startPoint = polarToCartesian(startAngle);
  const endPoint = polarToCartesian(endAngle);
  const arcPath = `M ${startPoint.x} ${startPoint.y} A ${radius} ${radius} 0 0 1 ${endPoint.x} ${endPoint.y}`;

  // Calculate needle rotation based on percentage (0-100 maps to 180-0 degrees)
  const needleAngle = 180 - (displayConfig.percentage / 100) * 180;
  const needleLength = radius - 10;
  const needleTip = polarToCartesian(needleAngle);
  
  // Needle base points (small triangle at center)
  const needleBaseWidth = 8;
  const perpAngle1 = needleAngle + 90;
  const perpAngle2 = needleAngle - 90;
  const base1 = {
    x: centerX + needleBaseWidth * Math.cos((perpAngle1 * Math.PI) / 180),
    y: centerY - needleBaseWidth * Math.sin((perpAngle1 * Math.PI) / 180),
  };
  const base2 = {
    x: centerX + needleBaseWidth * Math.cos((perpAngle2 * Math.PI) / 180),
    y: centerY - needleBaseWidth * Math.sin((perpAngle2 * Math.PI) / 180),
  };

  // Zone markers
  const zones = [
    { tier: 1 as const, angle: 150, percentage: 20 },
    { tier: 2 as const, angle: 90, percentage: 50 },
    { tier: 3 as const, angle: 30, percentage: 85 },
  ];

  const StrategyIcon = displayConfig.strategyIcon;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Droplets className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">Liquidity Squeeze Advisor</h4>
            <p className="text-xs text-slate-500">Select market flow scenario</p>
          </div>
        </div>
        <div className="px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
          <span className="text-xs font-medium text-indigo-700">{displayConfig.riskLevel} Risk</span>
        </div>
      </div>

      {/* Interactive Gauge Card */}
      <div className="relative bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-2xl border-2 border-slate-200/50 p-6 shadow-sm overflow-visible">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-30 rounded-2xl overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-200 rounded-full blur-3xl"></div>
        </div>

        {/* Gauge Visualization */}
        <div className="relative py-4">
          <div className="py-6">
            <svg 
              width={width} 
              height={height}
              viewBox={`0 0 ${width} ${height}`}
              className="mx-auto"
              style={{ overflow: 'visible' }}
            >
              <defs>
                {/* Gradient for gauge */}
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
                  <stop offset="33%" style={{ stopColor: '#34d399', stopOpacity: 1 }} />
                  <stop offset="50%" style={{ stopColor: '#fbbf24', stopOpacity: 1 }} />
                  <stop offset="66%" style={{ stopColor: '#f59e0b', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#ef4444', stopOpacity: 1 }} />
                </linearGradient>

                {/* Glow filter */}
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>

                {/* Needle shadow */}
                <filter id="needleShadow">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
                </filter>

                {/* Hub gradient */}
                <radialGradient id="hubGradient">
                  <stop offset="0%" style={{ stopColor: '#818cf8' }} />
                  <stop offset="100%" style={{ stopColor: '#4f46e5' }} />
                </radialGradient>

                {/* Needle gradient */}
                <linearGradient id="needleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
                </linearGradient>
              </defs>

              {/* Background arc - subtle */}
              <path
                d={arcPath}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                opacity="0.3"
              />

              {/* Main gauge arc with gradient */}
              <path
                d={arcPath}
                fill="none"
                stroke="url(#gaugeGradient)"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                style={{ filter: 'url(#glow)' }}
              />

              {/* Active zone glow effect */}
              <circle
                cx={centerX}
                cy={centerY}
                r={radius}
                fill="none"
                stroke={currentConfig.color}
                strokeWidth={strokeWidth + 8}
                strokeDasharray={`${(displayConfig.percentage / 100) * Math.PI * radius} ${Math.PI * radius * 2}`}
                strokeDashoffset={Math.PI * radius}
                strokeLinecap="round"
                opacity="0.3"
                style={{ 
                  filter: 'blur(10px)',
                  transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              />

              {/* Zone markers */}
              {zones.map((zone) => {
                const markerPos = polarToCartesian(zone.angle);
                const config = tierConfig[zone.tier];
                const isActive = tier === zone.tier;
                const isHovered = hoveredTier === zone.tier;
                
                return (
                  <g key={zone.tier}>
                    {/* Glow when active */}
                    {isActive && (
                      <circle
                        cx={markerPos.x}
                        cy={markerPos.y}
                        r="16"
                        fill={config.color}
                        opacity="0.15"
                        className="animate-ping"
                        style={{ animationDuration: '2s' }}
                      />
                    )}
                    
                    {/* Marker dot */}
                    <circle
                      cx={markerPos.x}
                      cy={markerPos.y}
                      r={isActive ? 10 : isHovered ? 8 : 7}
                      fill="white"
                      stroke={config.color}
                      strokeWidth={isActive ? 3.5 : 2.5}
                      style={{ 
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
                      }}
                      onClick={() => onTierChange(zone.tier)}
                      onMouseEnter={() => setHoveredTier(zone.tier)}
                      onMouseLeave={() => setHoveredTier(null)}
                    />
                    
                    {/* Inner dot when active */}
                    {isActive && (
                      <circle
                        cx={markerPos.x}
                        cy={markerPos.y}
                        r="4"
                        fill={config.color}
                      />
                    )}
                  </g>
                );
              })}

              {/* Needle */}
              <g 
                style={{ 
                  transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  filter: 'url(#needleShadow)',
                }}
              >
                <line
                  x1={centerX}
                  y1={centerY}
                  x2={needleTip.x}
                  y2={needleTip.y}
                  stroke="url(#needleGradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <polygon
                  points={`${base1.x},${base1.y} ${base2.x},${base2.y} ${needleTip.x},${needleTip.y}`}
                  fill="url(#needleGradient)"
                  opacity="0.8"
                />
              </g>

              {/* Center hub */}
              <circle 
                cx={centerX} 
                cy={centerY} 
                r="18" 
                fill="url(#hubGradient)"
                style={{ filter: 'drop-shadow(0 2px 6px rgba(99, 102, 241, 0.3))' }}
              />
              <circle cx={centerX} cy={centerY} r="11" fill="white" opacity="0.3" />
              <circle cx={centerX} cy={centerY} r="7" fill="white" />
            </svg>

            {/* Labels below gauge */}
            <div className="flex justify-between items-start px-8 mt-6">
              {zones.map((zone) => {
                const config = tierConfig[zone.tier];
                const isActive = tier === zone.tier;
                
                return (
                  <button
                    key={zone.tier}
                    onClick={() => onTierChange(zone.tier)}
                    onMouseEnter={() => setHoveredTier(zone.tier)}
                    onMouseLeave={() => setHoveredTier(null)}
                    className={`flex flex-col items-center gap-2 transition-all ${
                      isActive ? 'scale-110' : 'hover:scale-105'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                      isActive 
                        ? `${config.iconBg} shadow-lg` 
                        : 'bg-slate-200 hover:bg-slate-300'
                    }`}>
                      <Droplets className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-600'}`} />
                    </div>
                    <div className="text-center">
                      <div className={`text-xs font-semibold ${
                        isActive ? config.textColor : 'text-slate-600'
                      }`}>
                        {config.shortLabel}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Current Selection Display */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className={`p-4 rounded-xl bg-gradient-to-br ${displayConfig.bgGradient} border-2 ${displayConfig.borderColor} transition-all duration-300`}>
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 ${displayConfig.iconBg} rounded-lg flex items-center justify-center flex-shrink-0 shadow-md`}>
                <Droplets className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h5 className="font-semibold text-slate-900">{displayConfig.label}</h5>
                  {hoveredTier === null && (
                    <div className="px-2 py-0.5 bg-indigo-600 text-white text-[10px] font-semibold rounded-full">
                      ACTIVE
                    </div>
                  )}
                </div>
                <p className="text-sm text-slate-700 mb-2">{displayConfig.description}</p>
                <div className="flex items-center gap-4 text-xs">
                  <div className={`flex items-center gap-1 ${displayConfig.textColor} font-medium`}>
                    <div className={`w-2 h-2 ${displayConfig.iconBg} rounded-full`}></div>
                    {displayConfig.detailedDescription}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Strategy Note */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 rounded-2xl p-5 overflow-hidden shadow-lg">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-300 rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
              <StrategyIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-xs font-semibold text-purple-100 uppercase tracking-wide">Strategy Guidance</div>
              <div className="text-[10px] text-indigo-200">{displayConfig.label} Scenario</div>
            </div>
          </div>
          
          <p className="text-sm text-white leading-relaxed">
            {displayConfig.strategyNote}
          </p>

          {/* Key metrics */}
          <div className="flex flex-wrap gap-2 mt-4">
            <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
              <div className="text-[10px] text-indigo-100">Buy Pressure</div>
              <div className="text-sm font-semibold text-white">${displayConfig.buyPressure}M</div>
            </div>
            <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
              <div className="text-[10px] text-indigo-100">Risk Level</div>
              <div className="text-sm font-semibold text-white">{displayConfig.riskLevel}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { tierConfig };