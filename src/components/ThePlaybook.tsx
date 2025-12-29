import { Clock, TrendingUp, Zap, LogOut, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { MentorshipTooltip } from './MentorshipTooltip';

interface Phase {
  id: string;
  title: string;
  timeframe: string;
  status: 'upcoming' | 'active' | 'completed';
  tacticalAdvice: string;
  strategy: string;
  whyThisMatters: string;
  completedDate?: string;
  actionLabel: string;
  actionColor: string;
  icon: any;
  color: string;
  bgGradient: string;
}

const phases: Phase[] = [
  {
    id: 'vetting',
    title: 'Vetting',
    timeframe: 'Days 1-30',
    status: 'completed',
    completedDate: 'Feb 15, 2025',
    tacticalAdvice: 'Prime accumulation window. Build position gradually as score persistence builds conviction.',
    strategy: 'Best risk/reward period. Monitor score stability and institutional tracking signals.',
    whyThisMatters: 'Early entry gives you the lowest prices before the market catches on. You want to be positioned before announcement rumors start.',
    actionLabel: 'ACTION: BUY',
    actionColor: '#10b981',
    icon: Clock,
    color: '#3b82f6',
    bgGradient: 'from-blue-50 to-cyan-50',
  },
  {
    id: 'high-confidence',
    title: 'High Confidence',
    timeframe: 'Days 30-60',
    status: 'active',
    tacticalAdvice: 'Optimal entry window. Institutional tracking active. Continue position building.',
    strategy: 'Score stability confirms thesis. Continue accumulation if conviction remains high. Watch for Committee signals.',
    whyThisMatters: 'Score persistence above 70 means institutional algorithms are tracking this stock. They\'ll have to buy shares when it\'s officially added, creating upward price pressure.',
    actionLabel: 'ACTION: BUY',
    actionColor: '#10b981',
    icon: TrendingUp,
    color: '#8b5cf6',
    bgGradient: 'from-purple-50 to-indigo-50',
  },
  {
    id: 'announcement',
    title: 'Announcement',
    timeframe: 'Announcement Day',
    status: 'upcoming',
    tacticalAdvice: 'Harvest 75% of position to secure gains and avoid news-cycle reversals.',
    strategy: 'High volatility expected. Best for momentum scalping. Gap-ups likely at market open.',
    whyThisMatters: 'Prices typically peak at the headline. Retail traders rush in, but smart money starts exiting. Lock in most of your gains here.',
    actionLabel: 'ACTION: SELL 75%',
    actionColor: '#f59e0b',
    icon: Zap,
    color: '#f59e0b',
    bgGradient: 'from-amber-50 to-orange-50',
  },
  {
    id: 'harvesting',
    title: 'Harvesting',
    timeframe: 'Effective Date (Days 1-5)',
    status: 'upcoming',
    tacticalAdvice: 'Final exit. Institutional buying pressure complete. Maximize average exit price.',
    strategy: 'Institutional buying completes. Price stabilizes. Begin systematic exit across 3-5 sessions to optimize average exit price.',
    whyThisMatters: 'Once the big funds finish buying, the extra demand disappears. We want you out before the crowd realizes the party\'s over.',
    actionLabel: 'ACTION: EXIT ALL',
    actionColor: '#dc2626',
    icon: LogOut,
    color: '#10b981',
    bgGradient: 'from-green-50 to-emerald-50',
  },
];

export function ThePlaybook() {
  const [selectedPhase, setSelectedPhase] = useState<string>('high-confidence');

  const getStatusIcon = (status: string) => {
    if (status === 'completed') return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    if (status === 'active') return <AlertCircle className="w-5 h-5 text-purple-600 animate-pulse" />;
    return <div className="w-5 h-5 rounded-full border-2 border-slate-300" />;
  };

  return (
    <div className="space-y-4" data-tour="playbook" id="the-playbook">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="font-semibold text-slate-900">The Playbook</h4>
          <p className="text-xs text-slate-500">Strategic coaching from vetting to harvest</p>
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
                            <div className="flex items-center gap-2">
                              <h5 className="font-semibold text-slate-900 flex items-center gap-1">
                                {phase.title}
                                {phase.id === 'vetting' && (
                                  <MentorshipTooltip 
                                    term="Vetting"
                                    definition="The system is interviewing the stock to ensure its profitability and liquidity are institutional-grade."
                                    position="bottom"
                                  />
                                )}
                                {phase.id === 'high-confidence' && (
                                  <MentorshipTooltip 
                                    term="High Confidence"
                                    definition="Score persistence above 70 means institutional algorithms are tracking this stock. They'll have to buy shares when it's officially added, creating upward price pressure."
                                    position="bottom"
                                  />
                                )}
                                {phase.id === 'harvesting' && (
                                  <MentorshipTooltip 
                                    term="Harvesting"
                                    definition="The professional strategy of exiting a position before the 'Inclusion Pop' reverses."
                                    position="bottom"
                                  />
                                )}
                              </h5>
                              {isActive && (
                                <span className="px-2 py-0.5 bg-purple-600 text-white text-[10px] font-semibold rounded-full">
                                  ACTIVE
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-600">{phase.timeframe}</p>
                            {phase.status === 'completed' && phase.completedDate && (
                              <div className="flex items-center gap-1.5 mt-1">
                                <CheckCircle2 className="w-3 h-3 text-green-600" />
                                <span className="text-[10px] text-green-700 font-medium">
                                  Completed {phase.completedDate}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Tactical Coaching - Prominent */}
                      <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-slate-200 mb-3">
                        {/* ACTION Label */}
                        <div className="mb-3 pb-3 border-b border-slate-200">
                          <div 
                            className="inline-flex items-center px-4 py-2 rounded-lg shadow-md"
                            style={{ backgroundColor: phase.actionColor }}
                          >
                            <span className="text-sm font-bold text-white tracking-wide">
                              {phase.actionLabel}
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-[10px] font-semibold text-slate-500 uppercase mb-2 tracking-wide">
                          Tactical Coaching
                        </div>
                        <div className="text-sm font-semibold text-slate-900 leading-relaxed">
                          {phase.tacticalAdvice}
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

                      {/* Why This Matters */}
                      {isSelected && (
                        <div className="mt-3 pt-3 border-t border-slate-200/60">
                          <div className="text-xs font-medium text-slate-600 mb-1 uppercase tracking-wide">
                            Why This Matters
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed" style={{ fontWeight: 400 }}>
                            {phase.whyThisMatters}
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
            <div className="text-xs font-semibold text-indigo-900 mb-1">Current Phase: High Confidence</div>
            <p className="text-xs text-indigo-700 leading-relaxed">
              Optimal entry window. Institutional tracking active. Announcement expected within 30 days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}