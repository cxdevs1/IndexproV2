import { useState } from 'react';
import { UniverseMonitor } from './components/UniverseMonitor';
import { StockIntelligence } from './components/StockIntelligence';
import { ActionDeck } from './components/ActionDeck';
import { MobileNavigation } from './components/MobileNavigation';
import { AlertSettingsModal } from './components/AlertSettingsModal';
import { useIsMobile } from './components/ui/use-mobile';
import { Bell, Settings } from 'lucide-react';

export default function App() {
  const isMobile = useIsMobile();
  const [mobileActiveTab, setMobileActiveTab] = useState<'universe' | 'intelligence' | 'alerts'>('universe');
  const [showAlertSettings, setShowAlertSettings] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-base sm:text-lg">IP</span>
              </div>
              <h1 className="text-slate-900 text-base sm:text-lg">IndexPro</h1>
              <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs">Pro</span>
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
          {/* Left Column - Universe Monitor */}
          <div className="col-span-12 lg:col-span-3">
            <UniverseMonitor />
          </div>

          {/* Center Column - Stock Intelligence */}
          <div className="col-span-12 lg:col-span-5">
            <StockIntelligence />
          </div>

          {/* Right Column - Action Deck */}
          <div className="col-span-12 lg:col-span-4">
            <ActionDeck />
          </div>
        </div>
      )}

      {/* Mobile View with Tabs */}
      {isMobile && (
        <div className="pb-20">
          {/* Tab 1: Universe */}
          {mobileActiveTab === 'universe' && (
            <div className="p-4">
              <UniverseMonitor />
            </div>
          )}

          {/* Tab 2: Intelligence */}
          {mobileActiveTab === 'intelligence' && (
            <div className="p-4">
              <StockIntelligence />
            </div>
          )}

          {/* Tab 3: Alerts/Action */}
          {mobileActiveTab === 'alerts' && (
            <div className="p-4 space-y-4">
              <ActionDeck />
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
    </div>
  );
}