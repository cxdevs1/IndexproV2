import { useState, useRef, useEffect } from 'react';
import { Search, Calculator, TrendingUp, ChevronRight, X } from 'lucide-react';

interface MobileOnboardingProps {
  isOpen: boolean;
  onClose: () => void;
}

const onboardingCards = [
  {
    id: 1,
    title: 'Find Candidates',
    description: 'Discover stocks likely to join the S&P 500/400/600 before the official announcement.',
    icon: Search,
    color: 'from-teal-500 to-cyan-600',
    lightColor: 'from-teal-50 to-cyan-50',
    points: [
      'View live rankings on The Board',
      'Track inclusion scores in real-time',
      'Spot high-probability additions early'
    ]
  },
  {
    id: 2,
    title: 'Simulate Profits',
    description: 'Model your trade with institutional-grade tools before risking a single dollar.',
    icon: Calculator,
    color: 'from-indigo-500 to-purple-600',
    lightColor: 'from-indigo-50 to-purple-50',
    points: [
      'Set your active bankroll & conviction',
      'See position sizing automatically',
      'Preview profit/loss scenarios'
    ]
  },
  {
    id: 3,
    title: 'Harvest Gains',
    description: 'Follow The Playbook to enter at the right time and exit before institutional demand fades.',
    icon: TrendingUp,
    color: 'from-green-500 to-emerald-600',
    lightColor: 'from-green-50 to-emerald-50',
    points: [
      'Enter during "High Confidence" phase',
      'Exit 75% at announcement',
      'Close remaining at effective date'
    ]
  }
];

export function MobileOnboarding({ isOpen, onClose }: MobileOnboardingProps) {
  const [currentCard, setCurrentCard] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentCard < onboardingCards.length - 1) {
      setCurrentCard(currentCard + 1);
    }
    if (isRightSwipe && currentCard > 0) {
      setCurrentCard(currentCard - 1);
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const goToNext = () => {
    if (currentCard < onboardingCards.length - 1) {
      setCurrentCard(currentCard + 1);
    } else {
      onClose();
    }
  };

  const card = onboardingCards[currentCard];
  const Icon = card.icon;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Card Container */}
        <div
          ref={carouselRef}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Header with Gradient */}
          <div className={`bg-gradient-to-br ${card.color} p-8 relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              {/* Step Indicator */}
              <div className="flex items-center gap-2 mb-4">
                {onboardingCards.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 rounded-full transition-all ${
                      index === currentCard
                        ? 'w-8 bg-white'
                        : index < currentCard
                        ? 'w-6 bg-white/60'
                        : 'w-4 bg-white/30'
                    }`}
                  />
                ))}
              </div>

              {/* Icon */}
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 border border-white/30">
                <Icon className="w-8 h-8 text-white" />
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-white mb-2">
                {card.title}
              </h2>

              {/* Description */}
              <p className="text-white/90 text-sm leading-relaxed">
                {card.description}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Key Points */}
            <div className={`bg-gradient-to-br ${card.lightColor} rounded-xl p-4 mb-6`}>
              <div className="space-y-3">
                {card.points.map((point, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="text-center text-xs text-slate-500 mb-4">
              Step {currentCard + 1} of {onboardingCards.length}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              {currentCard > 0 && (
                <button
                  onClick={() => setCurrentCard(currentCard - 1)}
                  className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors"
                >
                  Back
                </button>
              )}
              <button
                onClick={goToNext}
                className={`flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r ${card.color} text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all ${
                  currentCard === 0 ? 'flex-1' : 'flex-1'
                }`}
              >
                {currentCard === onboardingCards.length - 1 ? (
                  "Let's Go!"
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Skip Option */}
            <button
              onClick={onClose}
              className="w-full mt-3 text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              Skip tutorial
            </button>
          </div>
        </div>

        {/* Swipe Hint (only on first card) */}
        {currentCard === 0 && (
          <div className="absolute -bottom-12 left-0 right-0 text-center">
            <p className="text-white/80 text-sm">
              Swipe or tap Next to continue
            </p>
          </div>
        )}
      </div>
    </div>
  );
}