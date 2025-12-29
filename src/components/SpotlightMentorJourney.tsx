import { useState, useEffect } from 'react';
import { Sparkles, ChevronRight, X, BarChart3, Brain, Target, Calculator, DollarSign, Gauge, Shield, HelpCircle, ChevronDown } from 'lucide-react';

interface JourneyStep {
  id: number;
  title: string;
  target: string;
  copy: string;
  icon: any;
  gradient: string;
  encouragement: string;
  laymanTerm: string;
  laymanDefinition: string;
}

const journeySteps: JourneyStep[] = [
  {
    id: 1,
    title: 'The Board',
    target: '#the-board',
    copy: "This is The Board. These are the stocks waiting for S&P inclusion. Tap any ticker to dive deep.",
    icon: BarChart3,
    gradient: 'from-teal-500 to-cyan-600',
    encouragement: "Welcome",
    laymanTerm: 'The Board',
    laymanDefinition: 'The Board shows stocks being considered for S&P inclusion. Think of it like a waiting room—only the strongest companies make it here, and even fewer get promoted to the actual index.'
  },
  {
    id: 2,
    title: 'Core Analysis',
    target: '#core-analysis',
    copy: "This is Core Analysis. We look for 'Sector Vacuums'—gaps in the index that must be filled by stocks like this.",
    icon: Brain,
    gradient: 'from-indigo-500 to-purple-600',
    encouragement: "Nice",
    laymanTerm: 'Sector Vacuum',
    laymanDefinition: 'A Sector Vacuum happens when an index is underweight in a specific industry. When there\'s a gap, the index committee must fill it—creating a buying opportunity for smart traders who spot it early.'
  },
  {
    id: 3,
    title: 'The Playbook',
    target: '#the-playbook',
    copy: "The Playbook is your timing coach. It tells you exactly when to build and when to harvest.",
    icon: Target,
    gradient: 'from-purple-500 to-pink-600',
    encouragement: "Perfect",
    laymanTerm: 'Harvesting',
    laymanDefinition: 'Harvesting means taking profits at the optimal time. We sell 75% when the headline hits (peak hype), then exit the rest after institutions finish buying. This locks in gains before the crowd realizes the party is over.'
  },
  {
    id: 4,
    title: 'Active Bankroll',
    target: '#active-bankroll',
    copy: "This is your Active Bankroll—the fuel for your trade. Input how much capital you're deploying.",
    icon: DollarSign,
    gradient: 'from-green-500 to-emerald-600',
    encouragement: "Great",
    laymanTerm: 'Active Bankroll',
    laymanDefinition: 'Your Active Bankroll is the cash you\'re putting into this specific trade. We calculate your projected gains based on this number, so you can see your potential profit before you commit.'
  },
  {
    id: 5,
    title: 'Propulsion Gauge',
    target: '#propulsion-gauge',
    copy: "The Propulsion Gauge is the engine. It shows how much buying pressure will push the price up.",
    icon: Gauge,
    gradient: 'from-cyan-500 to-blue-600',
    encouragement: "Almost there",
    laymanTerm: 'Propulsion Score',
    laymanDefinition: 'The Propulsion Score combines Institutional Gravity (forced buying from index funds) and Exit Friction (short sellers forced to cover). Higher score = stronger upward pressure on the stock price.'
  },
  {
    id: 6,
    title: 'Risk Toggles',
    target: '#risk-toggles',
    copy: "These are your Risk Toggles—the brakes. Toggle scenarios to see how different conditions affect your returns.",
    icon: Shield,
    gradient: 'from-blue-500 to-indigo-600',
    encouragement: "You're ready",
    laymanTerm: 'Risk Scenarios',
    laymanDefinition: 'Risk Toggles let you model different market conditions. Turn on "Delayed Inclusion" or "Market Volatility" to see how external factors might impact your trade. Always plan for multiple scenarios.'
  }
];

interface SpotlightMentorJourneyProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SpotlightMentorJourney({ isOpen, onClose }: SpotlightMentorJourneyProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const [spotlightRect, setSpotlightRect] = useState<DOMRect | null>(null);
  const [cardPosition, setCardPosition] = useState<'top' | 'bottom' | 'left' | 'right'>('bottom');
  const [showLaymanToggle, setShowLaymanToggle] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!showWelcome && isOpen && currentStep < journeySteps.length) {
      setIsTransitioning(true);
      const step = journeySteps[currentStep];
      const element = document.querySelector(step.target);
      
      if (element) {
        // Smooth scroll first
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Delay to allow scroll, then update spotlight with spring animation
        setTimeout(() => {
          const rect = element.getBoundingClientRect();
          setSpotlightRect(rect);
          
          // Determine best card position based on available space
          const viewportHeight = window.innerHeight;
          const viewportWidth = window.innerWidth;
          const spaceBelow = viewportHeight - rect.bottom;
          const spaceAbove = rect.top;
          const spaceRight = viewportWidth - rect.right;
          
          if (spaceBelow > 350) {
            setCardPosition('bottom');
          } else if (spaceAbove > 350) {
            setCardPosition('top');
          } else if (spaceRight > 450) {
            setCardPosition('right');
          } else {
            setCardPosition('bottom');
          }
          
          setTimeout(() => setIsTransitioning(false), 300);
        }, 300);
      }
    }
  }, [currentStep, showWelcome, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleStartJourney = () => {
    setShowWelcome(false);
  };

  const handleNext = () => {
    setShowLaymanToggle(false);
    if (currentStep < journeySteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handleSpotlightClick = () => {
    // Clicking inside spotlight advances tour
    handleNext();
  };

  const handleSkip = () => {
    onClose();
  };

  if (showWelcome) {
    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header with Gradient */}
          <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-indigo-400/20 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 border border-white/30">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">
                Welcome to IndexPro
              </h2>
              <p className="text-xl text-indigo-100 leading-relaxed">
                Let's take a quick guided tour. We'll show you how to find, model, and execute your first high-alpha inclusion trade.
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-10">
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-slate-900 mb-6">What you'll learn in 2 minutes:</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">The Board</h4>
                    <p className="text-sm text-slate-600">Where to find the highest-probability candidates</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Core Analysis</h4>
                    <p className="text-sm text-slate-600">How we calculate sector demand and timing</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">The Playbook</h4>
                    <p className="text-sm text-slate-600">When to enter and when to harvest for maximum gains</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Calculator className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Scenario Lab</h4>
                    <p className="text-sm text-slate-600">How to model your trade before risking a dollar</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 mb-8 border border-indigo-200">
              <div className="flex items-start gap-4">
                <Sparkles className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-indigo-900 leading-relaxed">
                    <span className="font-semibold">Interactive 2-minute tour:</span> We'll spotlight each module and you can click through them as we explain. You can replay this anytime via the <span className="font-semibold">"Quick Start Guide"</span> in the header.
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleSkip}
                className="flex-1 px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-2xl transition-colors"
              >
                Skip for now
              </button>
              <button
                onClick={handleStartJourney}
                className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all"
              >
                Start Journey
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const step = journeySteps[currentStep];
  const StepIcon = step.icon;

  // Calculate mentor card position
  const getMentorCardStyle = () => {
    if (!spotlightRect) return {};
    
    const padding = 24;
    
    switch (cardPosition) {
      case 'bottom':
        return {
          top: spotlightRect.bottom + padding,
          left: spotlightRect.left + spotlightRect.width / 2,
          transform: 'translateX(-50%)'
        };
      case 'top':
        return {
          bottom: window.innerHeight - spotlightRect.top + padding,
          left: spotlightRect.left + spotlightRect.width / 2,
          transform: 'translateX(-50%)'
        };
      case 'right':
        return {
          top: spotlightRect.top + spotlightRect.height / 2,
          left: spotlightRect.right + padding,
          transform: 'translateY(-50%)'
        };
      default:
        return {
          top: spotlightRect.bottom + padding,
          left: '50%',
          transform: 'translateX(-50%)'
        };
    }
  };

  return (
    <>
      {/* Clickable Dimmed Background - Click to skip */}
      <div 
        className="fixed inset-0 z-[149] cursor-pointer" 
        onClick={handleSkip}
        aria-label="Click to skip tour"
      />
      
      {/* Dimmed Background with Dynamic Spotlight Cutout - Spring Animation */}
      <div className="fixed inset-0 z-[150] pointer-events-none transition-all duration-500 ease-out">
        <svg className="w-full h-full">
          <defs>
            <mask id="spotlight-mask">
              <rect width="100%" height="100%" fill="white" />
              {spotlightRect && (
                <rect
                  x={spotlightRect.left - 20}
                  y={spotlightRect.top - 20}
                  width={spotlightRect.width + 40}
                  height={spotlightRect.height + 40}
                  rx="24"
                  fill="black"
                  className="transition-all duration-500 ease-out"
                />
              )}
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="rgba(15, 23, 42, 0.75)"
            mask="url(#spotlight-mask)"
          />
        </svg>
      </div>

      {/* Interactive Spotlight Zone - Clickable Pass-Through */}
      {spotlightRect && (
        <div
          className="fixed z-[151] cursor-pointer"
          onClick={handleSpotlightClick}
          style={{
            left: spotlightRect.left - 20,
            top: spotlightRect.top - 20,
            width: spotlightRect.width + 40,
            height: spotlightRect.height + 40,
          }}
          aria-label="Click to advance tour"
        />
      )}

      {/* Coach Mark - Pulsing Blue Ring (Robinhood Style) */}
      {spotlightRect && (
        <div
          className="fixed z-[152] pointer-events-none transition-all duration-500 ease-out"
          style={{
            left: spotlightRect.left - 28,
            top: spotlightRect.top - 28,
            width: spotlightRect.width + 56,
            height: spotlightRect.height + 56,
          }}
        >
          {/* Outer pulsing ring */}
          <div className="absolute inset-0 rounded-3xl border-4 border-blue-400 animate-ping opacity-40" />
          {/* Middle ring */}
          <div className="absolute inset-2 rounded-3xl border-4 border-blue-500 animate-pulse opacity-60" />
          {/* Inner solid ring */}
          <div className="absolute inset-4 rounded-3xl border-4 border-blue-600 shadow-2xl shadow-blue-500/50" />
        </div>
      )}

      {/* Floating Mentor Card - Spring Animation */}
      <div
        className={`fixed z-[200] pointer-events-auto transition-all duration-500 ease-out ${
          isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
        style={getMentorCardStyle()}
      >
        <div className="w-[90vw] sm:w-[500px] max-w-lg bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-indigo-200 overflow-hidden">
          {/* Progress Bar */}
          <div className="h-2 bg-slate-100">
            <div
              className={`h-full bg-gradient-to-r ${step.gradient} transition-all duration-500 ease-out`}
              style={{ width: `${((currentStep + 1) / journeySteps.length) * 100}%` }}
            />
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300`}>
                  <StepIcon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                  <p className="text-sm text-slate-500">Step {currentStep + 1} of {journeySteps.length}</p>
                </div>
              </div>
              <button
                onClick={handleSkip}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Encouragement Badge */}
            <div className="mb-4">
              <span className={`inline-block px-4 py-1.5 bg-gradient-to-r ${step.gradient} text-white text-sm font-semibold rounded-full transition-all duration-300`}>
                ✨ {step.encouragement}
              </span>
            </div>

            {/* Copy */}
            <p className="text-base text-slate-700 leading-relaxed mb-6">
              {step.copy}
            </p>

            {/* Layman's Toggle - Always Present */}
            <div className="mb-6">
              <button
                onClick={() => setShowLaymanToggle(!showLaymanToggle)}
                className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Want to know the math? Click here</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showLaymanToggle ? 'rotate-180' : ''}`} />
              </button>
              
              {showLaymanToggle && (
                <div className="mt-3 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 bg-gradient-to-br ${step.gradient} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <HelpCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-indigo-900 mb-2">{step.laymanTerm}</h4>
                      <p className="text-sm text-indigo-800 leading-relaxed">{step.laymanDefinition}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Hint: Click to advance */}
            <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-700 text-center">
                💡 <span className="font-semibold">Pro tip:</span> Click the highlighted area to advance, or use the buttons below
              </p>
            </div>

            {/* Navigation */}
            <div className="flex gap-3">
              {currentStep > 0 && (
                <button
                  onClick={() => {
                    setShowLaymanToggle(false);
                    setCurrentStep(currentStep - 1);
                  }}
                  className="flex-1 px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-2xl transition-all duration-200"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                className={`flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r ${step.gradient} text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 ${
                  currentStep === 0 ? 'flex-1' : 'flex-1'
                } ${currentStep === journeySteps.length - 1 ? 'ring-4 ring-indigo-300 ring-offset-2 shadow-2xl shadow-indigo-500/50' : ''}`}
              >
                {currentStep === journeySteps.length - 1 ? "🎉 Finish Tour" : "Next Step"}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Skip Option */}
            <div className="mt-4 text-center">
              <button
                onClick={handleSkip}
                className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                Skip tour (press ESC)
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
