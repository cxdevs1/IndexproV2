import { useState, useEffect } from 'react';
import { UniverseMonitor } from './components/TheBoard';
import { StockIntelligence } from './components/StockIntelligence';
import { TradeImpactSimulator } from './components/ScenarioLab';
import { MobileNavigation } from './components/MobileNavigation';
import { AlertSettingsModal } from './components/AlertSettingsModal';
import { SpotlightMentorJourney } from './components/SpotlightMentorJourney';
import { MobileOnboarding } from './components/MobileOnboarding';
import { useIsMobile } from './components/ui/use-mobile';
import { Bell, BookOpen } from 'lucide-react';

export default function App() {
  const isMobile = useIsMobile();
  const [mobileActiveTab, setMobileActiveTab] = useState<'board' | 'intelligence' | 'scenario'>('board');
  const [showAlertSettings, setShowAlertSettings] = useState(false);
  const [showGuidedTour, setShowGuidedTour] = useState(false);
  const [showMobileOnboarding, setShowMobileOnboarding] = useState(false);

  // Check if user is new (first time visiting)
  useEffect(() => {
    const hasVisited = localStorage.getItem('indexPro_hasVisited');
    if (!hasVisited) {
      if (isMobile) {
        setShowMobileOnboarding(true);
      } else {
        setShowGuidedTour(true);
      }
    }
  }, [isMobile]);

  const handleTourComplete = () => {
    localStorage.setItem('indexPro_hasVisited', 'true');
    setShowGuidedTour(false);
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('indexPro_hasVisited', 'true');
    setShowMobileOnboarding(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-base sm:text-lg">IP</span>
              </div>
              <h1 className="text-slate-900 text-base sm:text-lg">IndexPro</h1>
              <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs">Institutional</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              {!isMobile && (
                <div className="flex items-center gap-4 mr-4">
                  <div className="text-sm text-slate-600">
                    Market Open <span className="text-green-600">●</span>
                  </div>
                  <div className="text-sm text-slate-500">Last updated: Just now</div>
                </div>
              )}
              {/* Tutorial Replay Button */}
              <button
                onClick={() => isMobile ? setShowMobileOnboarding(true) : setShowGuidedTour(true)}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg hover:bg-indigo-50 transition-colors group relative"
                title="Quick Start Guide"
              >
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap hidden sm:block">
                  Quick Start Guide
                </span>
              </button>
              <button
                onClick={() => setShowAlertSettings(true)}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors relative"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
                <div className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop View */}
      {!isMobile && (
        <div className="grid grid-cols-12 gap-6 p-6 max-w-[1800px] mx-auto">
          {/* Left Column - The Board */}
          <div className="col-span-12 lg:col-span-3" data-tour="board">
            <UniverseMonitor />
          </div>

          {/* Center Column - Core Analysis */}
          <div className="col-span-12 lg:col-span-5" data-tour="intelligence">
            <StockIntelligence />
          </div>

          {/* Right Column - Scenario Lab */}
          <div className="col-span-12 lg:col-span-4" data-tour="scenario">
            <TradeImpactSimulator />
          </div>
        </div>
      )}

      {/* Mobile View with Tabs */}
      {isMobile && (
        <div className="pb-20">
          {/* Tab 1: The Board */}
          {mobileActiveTab === 'board' && (
            <div className="p-4">
              <UniverseMonitor />
            </div>
          )}

          {/* Tab 2: Core Analysis */}
          {mobileActiveTab === 'intelligence' && (
            <div className="p-4">
              <StockIntelligence />
            </div>
          )}

          {/* Tab 3: Scenario Lab */}
          {mobileActiveTab === 'scenario' && (
            <div className="p-4 space-y-4">
              <TradeImpactSimulator />
            </div>
          )}

          {/* Mobile Navigation */}
          <MobileNavigation
            activeTab={mobileActiveTab}
            onTabChange={setMobileActiveTab}
          />
        </div>
      )}

      {/* Alert Settings Modal */}
      <AlertSettingsModal
        isOpen={showAlertSettings}
        onClose={() => setShowAlertSettings(false)}
      />

      {/* Guided Tour */}
      <SpotlightMentorJourney
        isOpen={showGuidedTour}
        onClose={handleTourComplete}
      />

      {/* Mobile Onboarding */}
      <MobileOnboarding
        isOpen={showMobileOnboarding}
        onClose={handleOnboardingComplete}
      />
    </div>
  );
}