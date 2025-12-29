import { useState, useEffect } from 'react';
import { Sparkles, ChevronRight, X, BarChart3, Brain, Target, Calculator, HelpCircle, ChevronDown } from 'lucide-react';

interface JourneyStep {
  id: number;
  title: string;
  target: string;
  copy: string;
  icon: any;
  gradient: string;
  encouragement: string;
  anchorPosition: 'top-left' | 'center' | 'bottom' | 'right';
  learnTerm?: string;
  learnDefinition?: string;
}

const journeySteps: JourneyStep[] = [
  {
    id: 1,
    title: 'The Board',
    target: '[data-tour="board"]',
    copy: "This is The Board. Tap any ticker to dive deep.",
    icon: BarChart3,
    gradient: 'from-teal-500 to-cyan-600',
    encouragement: "Welcome",
    anchorPosition: 'top-left',
    learnTerm: 'The Board',
    learnDefinition: 'The Board shows stocks that are being considered for S&P inclusion. Think of it like a waiting room—only the strongest companies make it here, and even fewer get promoted to the actual index.'
  },
  {
    id: 2,
    title: 'Core Analysis',
    target: '[data-tour="intelligence"]',
    copy: "Here is your Core Analysis. We look for the 'Sector Vacuum'—where the index needs this stock.",
    icon: Brain,
    gradient: 'from-indigo-500 to-purple-600',
    encouragement: "Nice",
    anchorPosition: 'center',
    learnTerm: 'Sector Vacuum',
    learnDefinition: 'A Sector Vacuum happens when an index is underweight in a specific industry. When there\'s a gap, the index committee must fill it—creating a buying opportunity for smart traders who spot it early.'
  },
  {
    id: 3,
    title: 'The Playbook',
    target: '[data-tour="playbook"]',
    copy: "The Playbook is your timing coach. It tells you exactly when to build and when to harvest.",
    icon: Target,
    gradient: 'from-purple-500 to-pink-600',
    encouragement: "Perfect",
    anchorPosition: 'bottom',
    learnTerm: 'Harvesting',
    learnDefinition: 'Harvesting means taking profits at the optimal time. We sell 75% when the headline hits (peak hype), then exit the rest after institutions finish buying. This locks in gains before the crowd realizes the party is over.'
  },
  {
    id: 4,
    title: 'Scenario Lab',
    target: '[data-tour="scenario"]',
    copy: "Scenario Lab. Plug in your bankroll to see your projected Alpha move.",
    icon: Calculator,
    gradient: 'from-blue-500 to-indigo-600',
    encouragement: "You're ready",
    anchorPosition: 'right',
    learnTerm: 'Alpha',
    learnDefinition: 'Alpha is just a fancy word for "Extra Profit." Most people get average returns matching the market. We use index inclusion math to help you capture the extra gains that come from forced institutional buying.'
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
  const [showLearnTerm, setShowLearnTerm] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
      const step = journeySteps[currentStep];
      const element = document.querySelector(step.target);
      if (element) {
        const rect = element.getBoundingClientRect();
        setSpotlightRect(rect);
        
        // Determine best card position based on available space
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;
        const spaceRight = viewportWidth - rect.right;
        
        if (spaceBelow > 300) {
          setCardPosition('bottom');
        } else if (spaceAbove > 300) {
          setCardPosition('top');
        } else if (spaceRight > 400) {
          setCardPosition('right');
        } else {
          setCardPosition('bottom');
        }
        
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

  useEffect(() => {
    const currentRef = document.querySelector('[data-tour="board"]');
    if (currentRef) {
      const rect = currentRef.getBoundingClientRect();
      setSpotlightRect(rect);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isOpen) return null;

  const handleStartJourney = () => {
    setShowWelcome(false);
  };

  const handleNext = () => {
    setShowLearnTerm(false); // Reset Learn Term expansion
    if (currentStep < journeySteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
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
              <h3 className="text-xl font-semibold text-slate-900 mb-6">What you'll learn in 90 seconds:</h3>
              
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
                    <p className="text-sm text-slate-600">How we calculate alpha and sector demand</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">The Playbook</h4>
                    <p className="text-sm text-slate-600">When to enter and exit for maximum gains</p>
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
                    <span className="font-semibold">90-second contextual tour:</span> We'll highlight each module with a spotlight effect and explain what it does. You can replay this anytime via the <span className="font-semibold">"Quick Start Guide"</span> in the header.
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
      
      {/* Dimmed Background with Dynamic Spotlight Cutout */}
      <div className="fixed inset-0 z-[150] pointer-events-none">
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
                />
              )}
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="rgba(15, 23, 42, 0.7)"
            mask="url(#spotlight-mask)"
          />
        </svg>
      </div>

      {/* Spotlight Border Animation */}
      {spotlightRect && (
        <>
          <div
            className="fixed z-[151] pointer-events-none animate-in fade-in duration-300"
            style={{
              left: spotlightRect.left - 24,
              top: spotlightRect.top - 24,
              width: spotlightRect.width + 48,
              height: spotlightRect.height + 48,
            }}
          >
            <div className="w-full h-full rounded-3xl border-4 border-indigo-400 shadow-2xl shadow-indigo-500/50 animate-pulse" />
          </div>

          {/* Coach Mark - Animated Blue Dot */}
          <div
            className="fixed z-[152] pointer-events-none"
            style={{
              left: spotlightRect.left + spotlightRect.width / 2 - 6,
              top: spotlightRect.top - 40,
            }}
          >
            <div className="relative">
              {/* Outer pulse rings */}
              <div className="absolute inset-0 w-12 h-12 -translate-x-1/2 -translate-y-1/2">
                <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75"></div>
                <div className="absolute inset-2 bg-blue-500 rounded-full animate-ping opacity-50" style={{ animationDelay: '0.3s' }}></div>
              </div>
              {/* Core dot */}
              <div className="relative w-3 h-3 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"></div>
            </div>
          </div>
        </>
      )}

      {/* Floating Mentor Card */}
      <div
        className="fixed z-[200] pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-300"
        style={getMentorCardStyle()}
      >
        <div className="w-[90vw] sm:w-[500px] max-w-lg bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-indigo-200 overflow-hidden">
          {/* Progress Bar */}
          <div className="h-2 bg-slate-100">
            <div
              className={`h-full bg-gradient-to-r ${step.gradient} transition-all duration-500`}
              style={{ width: `${((currentStep + 1) / journeySteps.length) * 100}%` }}
            />
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
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
              <span className={`inline-block px-4 py-1.5 bg-gradient-to-r ${step.gradient} text-white text-sm font-semibold rounded-full`}>
                ✨ {step.encouragement}
              </span>
            </div>

            {/* Copy */}
            <p className="text-base text-slate-700 leading-relaxed mb-4">
              {step.copy}
            </p>

            {/* Progressive Disclosure - Learn Term */}
            {step.learnTerm && step.learnDefinition && (
              <div className="mb-8">
                <button
                  onClick={() => setShowLearnTerm(!showLearnTerm)}
                  className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Learn: What is "{step.learnTerm}"?</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showLearnTerm ? 'rotate-180' : ''}`} />
                </button>
                
                {showLearnTerm && (
                  <div className="mt-3 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <HelpCircle className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-indigo-900 mb-2">{step.learnTerm}</h4>
                        <p className="text-sm text-indigo-800 leading-relaxed">{step.learnDefinition}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3">
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="flex-1 px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-2xl transition-colors"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                className={`flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r ${step.gradient} text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all ${
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