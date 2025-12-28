import { X, Bell, BellOff } from 'lucide-react';
import { useState } from 'react';

interface AlertSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AlertSettingsModal({ isOpen, onClose }: AlertSettingsModalProps) {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [scoreThreshold, setScoreThreshold] = useState(80);
  const [vacancyAlerts, setVacancyAlerts] = useState(true);
  const [liquidityAlerts, setLiquidityAlerts] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-gradient-to-br from-slate-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-slate-900">Alert Settings</h3>
                <p className="text-sm text-slate-500">Manage your notifications</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Push Notifications Toggle */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {pushEnabled ? (
                  <Bell className="w-4 h-4 text-indigo-600" />
                ) : (
                  <BellOff className="w-4 h-4 text-slate-400" />
                )}
                <span className="text-slate-900">Push Notifications</span>
              </div>
              <p className="text-sm text-slate-500">
                Receive real-time alerts on your device
              </p>
            </div>
            <button
              onClick={() => setPushEnabled(!pushEnabled)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                pushEnabled ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                  pushEnabled ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Score Threshold */}
          <div className="space-y-3">
            <div>
              <label className="text-slate-900 mb-1 block">Score Threshold</label>
              <p className="text-sm text-slate-500">
                Alert when inclusion score crosses this threshold
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Threshold: {scoreThreshold}</span>
                <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded">
                  {scoreThreshold >= 85 ? 'High' : scoreThreshold >= 70 ? 'Medium' : 'Low'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={scoreThreshold}
                onChange={(e) => setScoreThreshold(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, rgb(79 70 229) 0%, rgb(79 70 229) ${scoreThreshold}%, rgb(226 232 240) ${scoreThreshold}%, rgb(226 232 240) 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-slate-400">
                <span>0</span>
                <span>50</span>
                <span>100</span>
              </div>
            </div>
          </div>

          {/* Alert Categories */}
          <div className="space-y-3">
            <label className="text-slate-900 block">Alert Categories</label>

            <div className="space-y-3">
              {/* Vacancy Alerts */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex-1">
                  <div className="text-sm text-slate-900 mb-0.5">Index Vacancies</div>
                  <div className="text-xs text-slate-500">
                    New acquisition or bankruptcy announcements
                  </div>
                </div>
                <button
                  onClick={() => setVacancyAlerts(!vacancyAlerts)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    vacancyAlerts ? 'bg-indigo-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                      vacancyAlerts ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Liquidity Alerts */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex-1">
                  <div className="text-sm text-slate-900 mb-0.5">Liquidity Gaps</div>
                  <div className="text-xs text-slate-500">
                    Stocks falling below volume thresholds
                  </div>
                </div>
                <button
                  onClick={() => setLiquidityAlerts(!liquidityAlerts)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    liquidityAlerts ? 'bg-indigo-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                      liquidityAlerts ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Price Movement Alerts */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex-1">
                  <div className="text-sm text-slate-900 mb-0.5">Price Movements</div>
                  <div className="text-xs text-slate-500">Large 30-day price changes (&gt;15%)</div>
                </div>
                <button
                  onClick={() => setPriceAlerts(!priceAlerts)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    priceAlerts ? 'bg-indigo-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                      priceAlerts ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Example Alert */}
          <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
            <div className="text-xs text-indigo-900 mb-1">Example Alert</div>
            <div className="text-sm text-indigo-700">
              "AXON crossed score threshold of {scoreThreshold} (current: 94)"
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-200 bg-slate-50">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-sm"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
