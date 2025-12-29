import { TrendingUp, TrendingDown, Search, ChevronRight, X, BarChart3, DollarSign, Target, Sparkles } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { VacancyMonitor } from './VacancyMonitor';
import { useIsMobile } from './ui/use-mobile';

interface Stock {
  ticker: string;
  company: string;
  score: number;
  change: number;
  index: 'S&P 600' | 'S&P 400' | 'S&P 500';
  marketCap: string;
  avgVolume: string;
  price: string;
}

const mockStocks: Stock[] = [
  { ticker: 'AXON', company: 'Axon Enterprise', score: 94, change: 3.2, index: 'S&P 600', marketCap: '$8.2B', avgVolume: '42M', price: '$342.18' },
  { ticker: 'CROX', company: 'Crocs Inc.', score: 91, change: 2.1, index: 'S&P 600', marketCap: '$6.8B', avgVolume: '38M', price: '$128.45' },
  { ticker: 'CHWY', company: 'Chewy Inc.', score: 88, change: 1.8, index: 'S&P 400', marketCap: '$12.4B', avgVolume: '52M', price: '$45.67' },
  { ticker: 'ENPH', company: 'Enphase Energy', score: 86, change: -0.5, index: 'S&P 400', marketCap: '$15.2B', avgVolume: '65M', price: '$112.34' },
  { ticker: 'HALO', company: 'Halozyme Therapeutics', score: 84, change: 1.2, index: 'S&P 600', marketCap: '$7.1B', avgVolume: '28M', price: '$58.92' },
  { ticker: 'TECH', company: 'Bio-Techne Corp', score: 82, change: 0.9, index: 'S&P 400', marketCap: '$9.6B', avgVolume: '31M', price: '$78.23' },
  { ticker: 'GLOB', company: 'Globant SA', score: 79, change: -1.1, index: 'S&P 600', marketCap: '$8.9B', avgVolume: '44M', price: '$234.56' },
  { ticker: 'AVNT', company: 'Avient Corp', score: 76, change: 0.4, index: 'S&P 400', marketCap: '$11.3B', avgVolume: '48M', price: '$52.18' },
  { ticker: 'NTRA', company: 'Natera Inc.', score: 73, change: 2.5, index: 'S&P 600', marketCap: '$6.4B', avgVolume: '35M', price: '$67.89' },
  { ticker: 'FTNT', company: 'Fortinet Inc.', score: 71, change: 1.6, index: 'S&P 500', marketCap: '$45.2B', avgVolume: '125M', price: '$189.45' },
  { ticker: 'PRVA', company: 'Privia Health', score: 68, change: -0.8, index: 'S&P 600', marketCap: '$5.8B', avgVolume: '22M', price: '$42.31' },
  { ticker: 'ZS', company: 'Zscaler Inc.', score: 65, change: 0.3, index: 'S&P 500', marketCap: '$38.7B', avgVolume: '98M', price: '$256.78' },
];

type IndexFilter = 'All' | 'S&P 600' | 'S&P 400' | 'S&P 500';

export function UniverseMonitor() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<IndexFilter>('All');
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedStock, setExpandedStock] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (drawerOpen) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setDrawerOpen(false);
        }
      };
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [drawerOpen]);

  const filteredStocks = mockStocks.filter((stock) => {
    const matchesSearch =
      stock.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndex = selectedIndex === 'All' || stock.index === selectedIndex;
    return matchesSearch && matchesIndex;
  });

  const topTargets = mockStocks.filter((stock) => stock.score >= 84).slice(0, 5);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    return 'text-slate-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 85) return 'bg-green-50';
    if (score >= 70) return 'bg-blue-50';
    return 'bg-slate-50';
  };

  const getIndexColors = (index: IndexFilter) => {
    switch (index) {
      case 'S&P 600':
        return {
          active: 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-sm scale-105',
          inactive: 'bg-white text-teal-700 hover:bg-teal-50 border border-teal-300 hover:border-teal-400',
          accent: 'from-teal-100 to-cyan-100 text-teal-700 border-teal-200',
          border: 'border-l-teal-500',
          dot: 'bg-teal-500'
        };
      case 'S&P 400':
        return {
          active: 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-sm scale-105',
          inactive: 'bg-white text-blue-700 hover:bg-blue-50 border border-blue-300 hover:border-blue-400',
          accent: 'from-blue-100 to-cyan-100 text-blue-700 border-blue-200',
          border: 'border-l-blue-500',
          dot: 'bg-blue-500'
        };
      case 'S&P 500':
        return {
          active: 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-sm scale-105',
          inactive: 'bg-white text-purple-700 hover:bg-purple-50 border border-purple-300 hover:border-purple-400',
          accent: 'from-purple-100 to-violet-100 text-purple-700 border-purple-200',
          border: 'border-l-purple-500',
          dot: 'bg-purple-500'
        };
      default: // 'All'
        return {
          active: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm scale-105',
          inactive: 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-300 hover:border-slate-400',
          accent: 'from-indigo-100 to-purple-100 text-indigo-700 border-indigo-200',
          border: 'border-l-indigo-500',
          dot: 'bg-indigo-500'
        };
    }
  };

  const handleStockClick = (stock: Stock) => {
    if (isMobile) {
      setSelectedStock(stock);
      setDrawerOpen(true);
    }
  };

  return (
    <>
      {/* Vacancy Monitor */}
      <VacancyMonitor />

      {/* Top 5 High-Alpha Targets Carousel (Mobile Only) */}
      {isMobile && topTargets.length > 0 && (
        <div className="mb-6 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-4 border-b border-amber-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-slate-900 text-sm font-semibold">Top 5 High-Alpha Targets</h3>
                <p className="text-xs text-slate-600">Swipe to explore premium opportunities</p>
              </div>
            </div>
          </div>
          <div 
            ref={carouselRef}
            className="flex gap-3 overflow-x-auto p-4 snap-x snap-mandatory scrollbar-hide bg-gradient-to-br from-slate-50 to-white"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {topTargets.map((stock, index) => (
              <div
                key={stock.ticker}
                className="flex-shrink-0 w-[280px] snap-start"
                onClick={() => handleStockClick(stock)}
              >
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl shadow-lg p-5 border-2 border-indigo-400 relative overflow-hidden cursor-pointer transform transition-transform active:scale-95">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  
                  <div className="relative z-10">
                    {/* Rank Badge */}
                    <div className="absolute top-0 right-0 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                      <span className="text-white font-bold text-sm">#{index + 1}</span>
                    </div>

                    {/* Stock Info */}
                    <div className="mb-4">
                      <div className="text-2xl font-bold text-white mb-1">{stock.ticker}</div>
                      <div className="text-sm text-indigo-100">{stock.company}</div>
                      <div className="text-xs text-indigo-200 mt-1">{stock.index}</div>
                    </div>

                    {/* Score Display */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-xs text-indigo-200 mb-1">Inclusion Score</div>
                        <div className="text-4xl font-bold text-white">{stock.score}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-indigo-200 mb-1">Price</div>
                        <div className="text-lg font-semibold text-white">{stock.price}</div>
                      </div>
                    </div>

                    {/* Change Indicator */}
                    <div className="flex items-center justify-between">
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
                        stock.change >= 0 
                          ? 'bg-green-500/30 text-green-100' 
                          : 'bg-red-500/30 text-red-100'
                      }`}>
                        {stock.change >= 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        <span className="font-semibold">{Math.abs(stock.change)}%</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-white/60" />
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4 w-full h-2 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 to-emerald-300 rounded-full transition-all"
                        style={{ width: `${stock.score}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Universe Monitor */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        {/* Unified Header - Brand Identity */}
        <div className="bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 p-5 relative overflow-hidden">
          {/* Decorative gradient orbs */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold">Universe Monitor</h2>
              <p className="text-slate-300 text-xs">Live S&P Index Rankings</p>
            </div>
          </div>
        </div>

        {/* Search & Filter Section */}
        <div className="p-4 bg-gradient-to-br from-white to-slate-50 border-b border-slate-200">
          {/* Index Filter Pills */}
          <div className="mb-4">
            <label className="text-xs font-medium text-slate-700 mb-2 block">Filter by Index</label>
            <div className="flex gap-1.5 flex-wrap">
              {(['All', 'S&P 600', 'S&P 400', 'S&P 500'] as IndexFilter[]).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedIndex(filter)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                    selectedIndex === filter
                      ? getIndexColors(filter).active
                      : getIndexColors(filter).inactive
                  }`}
                >
                  {filter}
                  {filter !== 'All' && (
                    <span className={`ml-1 text-[10px] ${selectedIndex === filter ? 'opacity-90' : 'opacity-60'}`}>
                      {mockStocks.filter(s => s.index === filter).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search ticker or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Results Count */}
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Showing <span className="font-semibold text-slate-700">{filteredStocks.length}</span> stocks
            </span>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        </div>

        {/* Stock List */}
        <div className="overflow-y-auto md:max-h-[calc(100vh-380px)] max-h-[400px] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-slate-300">
          {filteredStocks.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-sm text-slate-600 font-medium">No stocks found</p>
              <p className="text-xs text-slate-500 mt-1">Try adjusting your search or filter</p>
            </div>
          ) : (
            filteredStocks.map((stock, index) => (
              <div
                key={stock.ticker}
                onClick={() => handleStockClick(stock)}
                className={`p-4 border-b border-slate-100 border-l-4 ${getIndexColors(stock.index).border} transition-all hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 ${
                  isMobile ? 'active:bg-slate-100 cursor-pointer' : 'hover:border-indigo-200'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-slate-900 font-semibold">{stock.ticker}</span>
                      <span className={`text-xs px-2 py-0.5 bg-gradient-to-r ${getIndexColors(stock.index).accent} rounded-md font-medium border`}>
                        #{filteredStocks.indexOf(stock) + 1}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">{stock.company}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${getIndexColors(stock.index).dot}`}></div>
                        <p className="text-xs text-slate-500 font-medium">{stock.index}</p>
                      </div>
                      {!isMobile && (
                        <>
                          <span className="text-xs text-slate-300">•</span>
                          <p className="text-xs text-slate-500">Cap: {stock.marketCap}</p>
                          <span className="text-xs text-slate-300">•</span>
                          <p className="text-xs text-slate-500">Vol: {stock.avgVolume}</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div
                      className={`px-3 py-1.5 rounded-lg ${getScoreBgColor(stock.score)} ${getScoreColor(stock.score)} text-base font-bold border-2 ${
                        stock.score >= 85 ? 'border-green-200' : stock.score >= 70 ? 'border-blue-200' : 'border-slate-200'
                      }`}
                    >
                      {stock.score}
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-semibold ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stock.change >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {Math.abs(stock.change)}%
                    </div>
                  </div>
                </div>
                
                {/* Score Bar */}
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      stock.score >= 85
                        ? 'bg-gradient-to-r from-green-500 to-green-600'
                        : stock.score >= 70
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                        : 'bg-gradient-to-r from-slate-400 to-slate-500'
                    }`}
                    style={{ width: `${stock.score}%` }}
                  />
                </div>

                {/* Tap indicator for mobile */}
                {isMobile && (
                  <div className="flex items-center justify-end mt-2">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      Tap for details
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer Stats */}
        <div className="p-3 bg-gradient-to-br from-slate-50 to-indigo-50 border-t border-slate-200">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></div>
            <div className="text-xs text-slate-700">
              Tracking <span className="font-semibold text-indigo-700">{mockStocks.length}</span> stocks • Live updates
            </div>
          </div>
        </div>
      </div>

      {/* Detail Drawer (Mobile Only) */}
      {isMobile && drawerOpen && selectedStock && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-[70] transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed inset-x-0 bottom-0 z-[70] bg-white rounded-t-2xl shadow-2xl animate-slide-up">
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-br from-slate-50 to-white">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-slate-900">{selectedStock.ticker}</h3>
                    <div className={`px-3 py-1 rounded-lg ${getScoreBgColor(selectedStock.score)} ${getScoreColor(selectedStock.score)} text-lg font-bold border-2 ${
                      selectedStock.score >= 85 ? 'border-green-200' : selectedStock.score >= 70 ? 'border-blue-200' : 'border-slate-200'
                    }`}>
                      {selectedStock.score}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">{selectedStock.company}</p>
                  <p className="text-xs text-slate-500 mt-1">{selectedStock.index}</p>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
              {/* Price and Change */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-slate-500" />
                    <span className="text-xs text-slate-600 font-medium">Current Price</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{selectedStock.price}</div>
                </div>
                <div className={`p-4 rounded-xl border-2 ${
                  selectedStock.change >= 0 
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' 
                    : 'bg-gradient-to-br from-red-50 to-orange-50 border-red-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {selectedStock.change >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span className="text-xs text-slate-600 font-medium">24h Change</span>
                  </div>
                  <div className={`text-2xl font-bold ${selectedStock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change}%
                  </div>
                </div>
              </div>

              {/* Market Data */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-indigo-600" />
                  Market Data
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border border-indigo-200">
                    <div className="text-xs text-indigo-700 font-medium mb-1">Market Cap</div>
                    <div className="text-lg font-bold text-indigo-900">{selectedStock.marketCap}</div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                    <div className="text-xs text-purple-700 font-medium mb-1">Avg Volume</div>
                    <div className="text-lg font-bold text-purple-900">{selectedStock.avgVolume}</div>
                  </div>
                </div>

                {/* Score Progress */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-600 font-medium mb-3">Inclusion Score Progress</div>
                  <div className="w-full h-3 bg-white rounded-full overflow-hidden border border-slate-200">
                    <div
                      className={`h-full rounded-full transition-all ${
                        selectedStock.score >= 85
                          ? 'bg-gradient-to-r from-green-500 to-green-600'
                          : selectedStock.score >= 70
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                          : 'bg-gradient-to-r from-slate-400 to-slate-500'
                      }`}
                      style={{ width: `${selectedStock.score}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>0</span>
                    <span className="font-semibold">{selectedStock.score}/100</span>
                  </div>
                </div>

                {/* Status Badge */}
                {selectedStock.score >= 85 && (
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-semibold text-green-900">High-Alpha Target</span>
                    </div>
                    <p className="text-xs text-green-700 mt-1">Strong inclusion candidate</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}