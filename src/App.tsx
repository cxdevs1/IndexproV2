import { UniverseMonitor } from './components/UniverseMonitor';
import { StockIntelligence } from './components/StockIntelligence';
import { ActionDeck } from './components/ActionDeck';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">IP</span>
              </div>
              <h1 className="text-slate-900">IndexPro</h1>
              <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs">Pro</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-600">
                Market Open <span className="text-green-600">●</span>
              </div>
              <div className="text-sm text-slate-500">Last updated: Just now</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Grid */}
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
    </div>
  );
}
