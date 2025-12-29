import { Clock, TrendingUp, Zap, LogOut, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface Phase {
  id: string;
  title: string;
  timeframe: string;
  status: 'upcoming' | 'active' | 'completed';
  buyAdvice: string;
  sellAdvice: string;
  strategy: string;
  icon: any;
  color: string;
  bgGradient: string;
}

const phases: Phase[] = [
  {
    id: 'incubation',
    title: 'Incubation',
    timeframe: 'Days 1-30',
    status: 'completed',
    buyAdvice: '✓ Prime accumulation window',
    sellAdvice: '✗ Too early - hold position',
    strategy: 'Build position gradually. Score persistence builds conviction. Best risk/reward period.',
    icon: Clock,
    color: '#3b82f6',
    bgGradient: 'from-blue-50 to-cyan-50',
  },
  {
    id: 'persistence',
    title: 'Score Persistence',
    timeframe: 'Days 30-60',
    status: 'active',
    buyAdvice: '✓ Final entry opportunity',
    sellAdvice: '⚠ Monitor for announcement',
    strategy: 'Score stability confirms thesis. Continue accumulation if conviction remains high. Watch for Committee signals.',
    icon: TrendingUp,
    color: '#8b5cf6',
    bgGradient: 'from-purple-50 to-indigo-50',
  },
  {
    id: 'squeeze',
    title: 'The Squeeze Window',
    timeframe: 'Announcement Day',
    status: 'upcoming',
    buyAdvice: '⚠ High volatility - use caution',
    sellAdvice: '✓ Momentum scalping optimal',
    strategy: 'Squeeze Window: High volatility expected. Best for momentum scalping. Gap-ups likely at market open.',
    icon: Zap,
    color: '#f59e0b',
    bgGradient: 'from-amber-50 to-orange-50',
  },
  {
    id: 'exit',
    title: 'Exit Phase',
    timeframe: 'Days 1-5 post-announcement',
    status: 'upcoming',
    buyAdvice: '✗ No new entries',
    sellAdvice: '✓ Scale out systematically',
    strategy: 'Institutional buying completes. Price stabilizes. Begin systematic exit across 3-5 sessions to optimize average exit price.',
    icon: LogOut,
    color: '#10b981',
    bgGradient: 'from-green-50 to-emerald-50',
  },
];

export function TacticalRoadmap() {
  const [selectedPhase, setSelectedPhase] = useState<string>('persistence');

  const getStatusIcon = (status: string) => {
    if (status === 'completed') return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    if (status === 'active') return <AlertCircle className="w-5 h-5 text-purple-600 animate-pulse" />;
    return <div className="w-5 h-5 rounded-full border-2 border-slate-300" />;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="font-semibold text-slate-900">Tactical Roadmap</h4>
          <p className="text-xs text-slate-500">Strategic phases from incubation to exit</p>
        </div>
      </div>

      {/* Vertical Timeline */}
      <div className="relative">
        {/* Connecting line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-purple-200 to-green-200"></div>

        {/* Phase Cards */}
        <div className="space-y-4">
          {phases.map((phase, index) => {
            const PhaseIcon = phase.icon;
            const isSelected = selectedPhase === phase.id;
            const isActive = phase.status === 'active';

            return (
              <div
                key={phase.id}
                className="relative"
              >
                {/* Timeline dot */}
                <div className="absolute left-0 top-6 z-10">
                  {getStatusIcon(phase.status)}
                </div>

                {/* Phase Card */}
                <div
                  className={`ml-12 cursor-pointer transition-all duration-300 ${
                    isSelected ? 'scale-[1.02]' : 'hover:scale-[1.01]'
                  }`}
                  onClick={() => setSelectedPhase(phase.id)}
                >
                  <div
                    className={`relative bg-gradient-to-br ${phase.bgGradient} rounded-xl p-5 border-2 overflow-hidden shadow-sm ${
                      isSelected ? 'shadow-lg' : ''
                    } ${isActive ? 'ring-2 ring-purple-400 ring-offset-2' : ''}`}
                    style={{ borderColor: isSelected ? phase.color : '#e2e8f0' }}
                  >
                    {/* Background glow */}
                    {isSelected && (
                      <div className="absolute inset-0 opacity-20">
                        <div
                          className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl"
                          style={{ backgroundColor: phase.color }}
                        ></div>
                      </div>
                    )}

                    <div className="relative z-10">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3 flex-1">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
                            style={{ backgroundColor: phase.color }}
                          >
                            <PhaseIcon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-semibold text-slate-900 flex items-center gap-2">
                              {phase.title}
                              {isActive && (
                                <span className="px-2 py-0.5 bg-purple-600 text-white text-[10px] font-semibold rounded-full">
                                  ACTIVE
                                </span>
                              )}
                            </h5>
                            <p className="text-xs text-slate-600">{phase.timeframe}</p>
                          </div>
                        </div>
                      </div>

                      {/* Buy/Sell Advice - Prominent */}
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-slate-200">
                          <div className="text-[10px] font-semibold text-slate-500 uppercase mb-1">
                            Buy Signal
                          </div>
                          <div className="text-sm font-semibold text-slate-900">
                            {phase.buyAdvice}
                          </div>
                        </div>
                        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-slate-200">
                          <div className="text-[10px] font-semibold text-slate-500 uppercase mb-1">
                            Sell Signal
                          </div>
                          <div className="text-sm font-semibold text-slate-900">
                            {phase.sellAdvice}
                          </div>
                        </div>
                      </div>

                      {/* Strategy Details */}
                      {isSelected && (
                        <div className="mt-3 pt-3 border-t border-slate-200/60">
                          <div className="text-xs font-medium text-slate-600 mb-1 uppercase tracking-wide">
                            Strategic Guidance
                          </div>
                          <p className="text-sm text-slate-700 leading-relaxed">
                            {phase.strategy}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Footer */}
      <div className="mt-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-xs font-semibold text-indigo-900 mb-1">Current Phase: Score Persistence</div>
            <p className="text-xs text-indigo-700 leading-relaxed">
              Continue monitoring score stability. Announcement expected within 30 days. Prepare for squeeze window.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
