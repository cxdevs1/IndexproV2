import { AlertTriangle, ArrowUpRight, ArrowDownRight, DollarSign, Copy, ExternalLink, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface LiquidityGap {
  ticker: string;
  company: string;
  currentVolume: string;
  requiredVolume: string;
  gap: string;
  severity: 'high' | 'medium' | 'low';
}

const liquidityGaps: LiquidityGap[] = [
  {
    ticker: 'PRVA',
    company: 'Privia Health',
    currentVolume: '1.2M',
    requiredVolume: '2.5M',
    gap: '-52%',
    severity: 'high',
  },
  {
    ticker: 'GLOB',
    company: 'Globant SA',
    currentVolume: '8.4M',
    requiredVolume: '12M',
    gap: '-30%',
    severity: 'medium',
  },
  {
    ticker: 'NTRA',
    company: 'Natera Inc.',
    currentVolume: '18M',
    requiredVolume: '22M',
    gap: '-18%',
    severity: 'low',
  },
];

export function ActionDeck() {
  const [positionSize, setPositionSize] = useState<'conservative' | 'aggressive'>('conservative');
  const [portfolioValue] = useState(250000);
  const [showBrokerDropdown, setShowBrokerDropdown] = useState(false);
  const [copiedOrder, setCopiedOrder] = useState(false);

  const conservativeSize = portfolioValue * 0.015; // 1.5%
  const conservativeRange = `1-3%`;
  const aggressiveSize = portfolioValue * 0.07; // 7%
  const aggressiveRange = `6-8%`;

  const currentPrice = 342.18;
  const shares = Math.floor(
    (positionSize === 'conservative' ? conservativeSize : aggressiveSize) / currentPrice
  );

  const handleCopyOrder = (action: 'buy' | 'sell') => {
    const orderText = `${action.toUpperCase()} ${shares} shares of AXON at $${currentPrice}`;
    navigator.clipboard.writeText(orderText);
    setCopiedOrder(true);
    setTimeout(() => setCopiedOrder(false), 2000);
  };

  const brokers = [
    { name: 'ThinkOrSwim', url: 'https://www.thinkorswim.com', logo: '🔷' },
    { name: 'Interactive Brokers', url: 'https://www.interactivebrokers.com', logo: '🔶' },
  ];

  return (
    <div className="space-y-6">
      {/* Liquidity Gaps */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-gradient-to-br from-amber-50 to-white">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="text-slate-900">Liquidity Gaps</h3>
          </div>
          <p className="text-sm text-slate-500">Stocks below volume threshold</p>
        </div>

        <div className="p-4 space-y-3">
          {liquidityGaps.map((gap) => (
            <div
              key={gap.ticker}
              className={`p-4 rounded-lg border-2 ${
                gap.severity === 'high'
                  ? 'border-red-200 bg-red-50'
                  : gap.severity === 'medium'
                  ? 'border-amber-200 bg-amber-50'
                  : 'border-yellow-200 bg-yellow-50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-slate-900 mb-0.5">{gap.ticker}</div>
                  <div className="text-xs text-slate-600">{gap.company}</div>
                </div>
                <div
                  className={`px-2.5 py-1 rounded-lg text-xs ${
                    gap.severity === 'high'
                      ? 'bg-red-600 text-white'
                      : gap.severity === 'medium'
                      ? 'bg-amber-600 text-white'
                      : 'bg-yellow-600 text-white'
                  }`}
                >
                  {gap.gap}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Current</div>
                  <div className="text-sm text-slate-900">{gap.currentVolume}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Required</div>
                  <div className="text-sm text-slate-900">{gap.requiredVolume}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <div className="text-xs text-slate-600">
            💡 Tip: Monitor these stocks for volume improvements before inclusion
          </div>
        </div>
      </div>

      {/* Trade Setup Widget */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-gradient-to-br from-indigo-50 to-white">
          <h3 className="text-slate-900 mb-1">Trade Setup</h3>
          <p className="text-sm text-slate-500">Position sizing for AXON</p>
        </div>

        <div className="p-4 sm:p-5">
          {/* Portfolio Value */}
          <div className="mb-6 p-4 bg-slate-50 rounded-lg">
            <div className="text-xs text-slate-500 mb-1">Portfolio Value</div>
            <div className="text-2xl text-slate-900">
              ${portfolioValue.toLocaleString()}
            </div>
          </div>

          {/* Position Size Toggle */}
          <div className="mb-6">
            <label className="text-sm text-slate-700 mb-3 block">Position Sizing Strategy</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPositionSize('conservative')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  positionSize === 'conservative'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="text-sm text-slate-900 mb-1">Conservative</div>
                <div className="text-xs text-slate-500">{conservativeRange}</div>
              </button>
              <button
                onClick={() => setPositionSize('aggressive')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  positionSize === 'aggressive'
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="text-sm text-slate-900 mb-1">Aggressive</div>
                <div className="text-xs text-slate-500">{aggressiveRange}</div>
              </button>
            </div>
          </div>

          {/* Calculated Position */}
          <div className="mb-6 p-5 bg-gradient-to-br from-slate-50 to-white rounded-lg border border-slate-200">
            <div className="text-xs text-slate-500 mb-2">Recommended Position Size</div>
            <div className="flex items-baseline gap-2 mb-4">
              <div className="text-3xl text-slate-900">
                ${positionSize === 'conservative' ? conservativeSize.toLocaleString(undefined, { maximumFractionDigits: 0 }) : aggressiveSize.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <div className="text-sm text-slate-500">
                ({positionSize === 'conservative' ? conservativeRange : aggressiveRange})
              </div>
            </div>

            {/* Share Calculation */}
            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-600">Current Price</span>
                <span className="text-slate-900">${currentPrice}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Shares to Buy</span>
                <span className="text-slate-900">
                  {shares} shares
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button 
              onClick={() => handleCopyOrder('buy')}
              className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Copy className="w-4 h-4" />
              <span>{copiedOrder ? 'Order Copied!' : 'Copy Buy Order'}</span>
            </button>
            <button 
              onClick={() => handleCopyOrder('sell')}
              className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Copy className="w-4 h-4" />
              <span>{copiedOrder ? 'Order Copied!' : 'Copy Sell Order'}</span>
            </button>

            {/* Broker Link Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowBrokerDropdown(!showBrokerDropdown)}
                className="w-full py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open in Broker</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showBrokerDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showBrokerDropdown && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden z-10">
                  {brokers.map((broker) => (
                    <a
                      key={broker.name}
                      href={broker.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
                      onClick={() => setShowBrokerDropdown(false)}
                    >
                      <span className="text-xl">{broker.logo}</span>
                      <span className="text-sm text-slate-900">{broker.name}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400 ml-auto" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Risk Indicator */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-start gap-2">
              <DollarSign className="w-4 h-4 text-blue-600 mt-0.5" />
              <div>
                <div className="text-xs text-blue-900">
                  {positionSize === 'conservative'
                    ? 'Conservative sizing reduces downside risk'
                    : 'Aggressive sizing increases potential returns and risk'}
                </div>
                <div className="text-xs text-blue-700 mt-1">
                  Max loss at -10%: $
                  {((positionSize === 'conservative' ? conservativeSize : aggressiveSize) * 0.1).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}