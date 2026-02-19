import React, { useState, useEffect, useRef } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Zap,
  Search,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Flame,
  Gem,
  BarChart3,
  Unlock,
  ShieldAlert,
  Users,
  Briefcase,
  Newspaper,
  Activity,
  Target,
  Radar,
  BrainCircuit,
  Megaphone,
  FlagTriangleRight,
  Home,
  ArrowLeft,
  Globe,
  Clock,
  Rocket
} from 'lucide-react';



const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const firstChar = (value, fallback = '?') => {
  if (typeof value !== 'string' || value.length === 0) return fallback;
  return value[0].toUpperCase();
};
const FinancePage = () => {
  const [view, setView] = useState('HOME');

  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [ticker, setTicker] = useState('BTC');
  const [assetType, setAssetType] = useState('CRYPTO');
  const [loading, setLoading] = useState(false);
  const [liveData, setLiveData] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [isProMode, setIsProMode] = useState(true);
  const [scannerResults, setScannerResults] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [activeScan, setActiveScan] = useState(null);
  const [activeTab, setActiveTab] = useState('VIRAL');

  const [analyzing, setAnalyzing] = useState(false);
  const [aiInsights, setAiInsights] = useState(null);

  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [marketTape, setMarketTape] = useState([
    { symbol: 'SPX', label: 'S&P 500', price: '5,122', change: '+0.6%', up: true },
    { symbol: 'NDX', label: 'Nasdaq 100', price: '18,321', change: '+0.9%', up: true },
    { symbol: 'BTC', label: 'Bitcoin', price: '92,450', change: '+1.2%', up: true },
    { symbol: 'ETH', label: 'Ethereum', price: '4,110', change: '-0.3%', up: false }
  ]);

  useEffect(() => {
    const loadTape = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true'
        );
        if (!response.ok) return;
        const data = await response.json();
        setMarketTape([
          { symbol: 'SPX', label: 'S&P 500', price: '5,122', change: '+0.6%', up: true },
          { symbol: 'NDX', label: 'Nasdaq 100', price: '18,321', change: '+0.9%', up: true },
          {
            symbol: 'BTC',
            label: 'Bitcoin',
            price: Math.round(data.bitcoin?.usd || 92450).toLocaleString(),
            change: `${(data.bitcoin?.usd_24h_change || 0).toFixed(2)}%`,
            up: (data.bitcoin?.usd_24h_change || 0) >= 0
          },
          {
            symbol: 'ETH',
            label: 'Ethereum',
            price: Math.round(data.ethereum?.usd || 4110).toLocaleString(),
            change: `${(data.ethereum?.usd_24h_change || 0).toFixed(2)}%`,
            up: (data.ethereum?.usd_24h_change || 0) >= 0
          },
          {
            symbol: 'SOL',
            label: 'Solana',
            price: Math.round(data.solana?.usd || 145).toLocaleString(),
            change: `${(data.solana?.usd_24h_change || 0).toFixed(2)}%`,
            up: (data.solana?.usd_24h_change || 0) >= 0
          }
        ]);
      } catch {
        // keep fallback tape values to avoid hard failures
      }
    };

    loadTape();
  }, []);

  const generateNews = (symbol, count = 4) => {
    const sources = [
      'The Capital Ledger',
      'Global Markets Wire',
      'Alpha Insight',
      'Sector Watch',
      'The Financial Brief',
      'Sovereign Equity',
      'Daily Disspatch',
      'NextGen Finance'
    ];

    const images = [
      'https://images.unsplash.com/photo-1611974765270-ca1258634369?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1535320903710-d9cf113d2061?w=800&auto=format&fit=crop&q=60'
    ];

    const templates = [
      { t: 'Analyst consensus shifts: [SYM] showing key technical breakout signals.', type: 'Bullish' },
      { t: 'Institutional volume profile suggests accumulation in [SYM] below key resistance.', type: 'Bullish' },
      { t: 'Market uncertainty: Significant outflows detected in [SYM] sector today.', type: 'Bearish' },
      { t: 'Regulatory landscape update: New framework may impact [SYM] liquidity.', type: 'Neutral' },
      { t: '[SYM] mentions surge 200% as retail sentiment indicators flip positive.', type: 'Viral' },
      { t: 'Private Wealth Report: Why [SYM] is gaining traction in family office portfolios.', type: 'Social' },
      { t: 'Strategic Update: Rumored infrastructure partnership for [SYM] ecosystem.', type: 'Catalyst' },
      { t: 'Options Activity: Unusual call volume detected for [SYM] expiring next week.', type: 'Options' },
      { t: 'Global Macro: How recent central bank policy affects [SYM] outlook.', type: 'Macro' }
    ];

    return Array.from({ length: count }).map(() => {
      const tmpl = templates[Math.floor(Math.random() * templates.length)];
      const randomSource = sources[Math.floor(Math.random() * sources.length)];
      const randomImage = images[Math.floor(Math.random() * images.length)];
      return {
        id: Math.random().toString(36).slice(2, 11),
        source: randomSource,
        title: tmpl.t.replace('[SYM]', symbol || 'Market'),
        time: `${Math.floor(Math.random() * 24) + 1}h ago`,
        type: tmpl.type,
        imageUrl: randomImage
      };
    });
  };

  const [tokenNews, setTokenNews] = useState([]);
  const [feedNews, setFeedNews] = useState([]);

  useEffect(() => {
    const tickers = ['BTC', 'NVDA', 'ETH', 'TSLA', 'AAPL', 'SOL', 'AMD', 'COIN', 'MSFT', 'GOOGL', 'META', 'AMZN'];
    let allNews = [];
    tickers.forEach((t) => {
      allNews = [...allNews, ...generateNews(t, 1)];
    });
    setFeedNews(allNews.sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    if (view !== 'DETAIL') return;
  }, [ticker, assetType, view, liveData]);

  const popularStocks = [
    { id: 'nvidia', symbol: 'NVDA', name: 'NVIDIA Corp', type: 'STOCK' },
    { id: 'tesla', symbol: 'TSLA', name: 'Tesla Inc', type: 'STOCK' },
    { id: 'apple', symbol: 'AAPL', name: 'Apple Inc', type: 'STOCK' },
    { id: 'microsoft', symbol: 'MSFT', name: 'Microsoft Corp', type: 'STOCK' },
    { id: 'amazon', symbol: 'AMZN', name: 'Amazon.com', type: 'STOCK' },
    { id: 'meta', symbol: 'META', name: 'Meta Platforms', type: 'STOCK' },
    { id: 'google', symbol: 'GOOGL', name: 'Alphabet Inc', type: 'STOCK' },
    { id: 'amd', symbol: 'AMD', name: 'Advanced Micro Devices', type: 'STOCK' },
    { id: 'coinbase', symbol: 'COIN', name: 'Coinbase Global', type: 'STOCK' },
    { id: 'gamestop', symbol: 'GME', name: 'GameStop Corp', type: 'STOCK' },
    { id: 'amc', symbol: 'AMC', name: 'AMC Entertainment', type: 'STOCK' },
    { id: 'palantir', symbol: 'PLTR', name: 'Palantir Tech', type: 'STOCK' },
    { id: 'sofi', symbol: 'SOFI', name: 'SoFi Technologies', type: 'STOCK' }
  ];

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchInput.length < 2) {
        setSuggestions([]);
        return;
      }
      setIsSearching(true);

      const stockMatches = popularStocks.filter(
        (s) => s.symbol.toLowerCase().includes(searchInput.toLowerCase()) || s.name.toLowerCase().includes(searchInput.toLowerCase())
      );

      try {
        const response = await fetch(`https://api.coingecko.com/api/v3/search?query=${searchInput}`);
        const data = await response.json();
        const cryptoMatches = data.coins ? data.coins.slice(0, 5) : [];
        setSuggestions([...stockMatches, ...cryptoMatches]);
        setShowDropdown(true);
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions(stockMatches);
        setShowDropdown(true);
      } finally {
        setIsSearching(false);
      }
    };
    const timeoutId = setTimeout(fetchSuggestions, 400);
    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  const runScanner = async (type) => {
    setScanning(true);
    setActiveScan(type);
    setScannerResults([]);
    setErrorMsg(null);

    try {
      let results = [];

      if (type === 'MOON_BAG') {
        const response = await fetch('https://api.dexscreener.com/latest/dex/search?q=solana');

        if (!response.ok) throw new Error('DexScreener API Busy');

        const data = await response.json();

        if (data.pairs) {
          results = data.pairs
            .filter((p) => p.chainId === 'solana' && p.liquidity && p.liquidity.usd > 1000)
            .map((p) => {
              const volume = p.volume?.h24 || 0;
              const liquidity = p.liquidity.usd || 1;
              const ratio = volume / liquidity;

              return {
                id: p.baseToken.address,
                symbol: p.baseToken.symbol,
                name: p.baseToken.name,
                price_change_percentage_24h: p.priceChange?.h24 || 0,
                current_price: parseFloat(p.priceUsd),
                type: 'CRYPTO',
                score: ratio,
                liquidity,
                source: 'DexScreener'
              };
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, 6);
        }
      } else if (type === 'VIRAL_STOCKS') {
        await new Promise((r) => setTimeout(r, 600));
        results = [
          { id: 'gme', symbol: 'GME', name: 'GameStop', price_change_percentage_24h: 12.4, current_price: 24.5, type: 'STOCK' },
          { id: 'amc', symbol: 'AMC', name: 'AMC Ent', price_change_percentage_24h: 8.1, current_price: 4.3, type: 'STOCK' },
          { id: 'pltr', symbol: 'PLTR', name: 'Palantir', price_change_percentage_24h: 5.5, current_price: 28.2, type: 'STOCK' },
          { id: 'sofi', symbol: 'SOFI', name: 'SoFi Tech', price_change_percentage_24h: 4.1, current_price: 7.8, type: 'STOCK' },
          { id: 'nvda', symbol: 'NVDA', name: 'NVIDIA', price_change_percentage_24h: 2.2, current_price: 890.1, type: 'STOCK' }
        ];
      } else {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false'
        );
        if (!response.ok) throw new Error('CoinGecko API Limit');

        const data = await response.json();

        if (type === 'MOONSHOTS') {
          results = data.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h).slice(0, 4);
        } else if (type === 'VOLATILITY') {
          results = data.sort((a, b) => Math.abs(b.price_change_percentage_24h) - Math.abs(a.price_change_percentage_24h)).slice(0, 4);
        }
      }
      setScannerResults(results);
    } catch (e) {
      console.error('Scanner failed', e);
      setErrorMsg('Data feed interrupted (API Limit or Network). Please try again in 10s.');
    } finally {
      setScanning(false);
    }
  };

  const handleSelectToken = async (token) => {
    const isStock = token.type === 'STOCK';
    setSearchInput(token.name);
    setShowDropdown(false);
    setLoading(true);
    setScannerResults([]);
    setActiveScan(null);
    setAnalyzing(true);
    setView('DETAIL');
    setTokenNews(generateNews(token.symbol));
    setErrorMsg(null);

    const selectedTicker = token.symbol;
    setTicker(selectedTicker);
    setAssetType(isStock ? 'STOCK' : 'CRYPTO');

    try {
      let processedData;

      if (isStock) {
        processedData = processData(
          token.symbol,
          token.current_price || 150.0,
          token.price_change_percentage_24h || 2.5,
          50000000,
          'Real',
          2000000000000
        );
      } else if (token.source === 'DexScreener') {
        processedData = processData(token.symbol, token.current_price, token.price_change_percentage_24h, token.liquidity, 'DexScreener', null);
      } else {
        const fetchId = token.id;
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${fetchId}&vs_currencies=usd&include_24hr_vol=true&include_24hr_change=true&include_market_cap=true`
        );
        const json = await response.json();

        if (json[fetchId]) {
          const raw = json[fetchId];
          processedData = processData(selectedTicker, raw.usd, raw.usd_24h_change, raw.usd_24h_vol, 'Real', raw.usd_market_cap);
        } else {
          throw new Error('Data missing');
        }
      }

      setLiveData(processedData);
      setTimeout(() => {
        setAiInsights(generateAiInsights(processedData));
        setAnalyzing(false);
      }, 1500);
    } catch (error) {
      console.error('Error:', error);
      setErrorMsg('Could not load deep data for this asset. Try scanning again.');
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const processData = (sym, price, changePct, vol, source, mcap) => {
    const isUp = changePct >= 0;
    const momentumScore = Math.min(Math.abs(changePct) * 5, 100);
    let momentumLabel = 'Stable';
    if (momentumScore > 30) momentumLabel = 'Building';
    if (momentumScore > 60) momentumLabel = 'Viral / Surge';
    if (momentumScore > 90) momentumLabel = 'Extreme / FOMO';

    let retailScore = 50;
    if (Math.abs(changePct) > 10) retailScore += 30;
    if (mcap && mcap < 1000000000) retailScore += 20;
    retailScore = Math.min(Math.max(retailScore, 0), 100);

    const risks = [];
    if (Math.abs(changePct) > 15) risks.push({ type: 'Vol', text: 'Extreme Volatility (Pump Risk)' });
    if (mcap && mcap < 50000000) risks.push({ type: 'Liq', text: 'Low Liquidity (Trap Risk)' });
    if (!isUp && Math.abs(changePct) > 10) risks.push({ type: 'Dump', text: 'Falling Knife Warning' });
    if (risks.length === 0) risks.push({ type: 'Safe', text: 'No immediate red flags detected.' });

    let formattedPrice = price;
    if (price < 0.0001) formattedPrice = `$${price.toFixed(8)}`;
    else if (price < 0.01) formattedPrice = `$${price.toFixed(6)}`;
    else if (price < 1) formattedPrice = `$${price.toFixed(4)}`;
    else formattedPrice = price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

    return {
      symbol: sym.toUpperCase(),
      priceRaw: price,
      price: formattedPrice,
      changePercent: changePct ? changePct.toFixed(2) : '0.00',
      changeRaw: changePct,
      isUp,
      volume: vol ? `${(vol / 1000000).toFixed(1)}M` : 'N/A',
      mcap: mcap ? `${(mcap / 1000000000).toFixed(2)}B` : 'N/A',
      momentumScore,
      momentumLabel,
      retailScore,
      risks,
      source
    };
  };

  const generateAiInsights = (data) => {
    const isBullish = data.isUp;
    const vol = Math.abs(data.changeRaw);

    const viralReason =
      vol > 10 ? 'Explosive social mentions matching price action.' : vol > 5 ? 'Steady increase in retail discussions.' : 'Volume is normal relative to historicals.';

    const whales = [];
    if (vol > 5) whales.push({ action: isBullish ? 'Accumulating' : 'Dumping', time: '2h ago', size: 'High' });
    whales.push({ action: 'Holding', time: '12h ago', size: 'Medium' });

    const entry = (data.priceRaw * (isBullish ? 0.98 : 1.02)).toFixed(data.priceRaw < 1 ? 4 : 2);
    const stop = (data.priceRaw * (isBullish ? 0.9 : 1.1)).toFixed(data.priceRaw < 1 ? 4 : 2);
    const target = (data.priceRaw * (isBullish ? 1.15 : 0.85)).toFixed(data.priceRaw < 1 ? 4 : 2);

    const sentiment = isBullish
      ? 'Euphoric. Retail is chasing green candles. Institutional flows are steady.'
      : 'Fearful. Retail is panic selling. Smart money is waiting for support.';

    const trends = isBullish ? ['AI & Compute', 'Memes'] : ['Stablecoins', 'Defensive Assets'];
    const catalysts = ['Upcoming Earnings/Unlock', 'Sector Rotation'];

    return { viralReason, whales, entry, stop, target, sentiment, trends, catalysts };
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-emerald-500/30 pb-20">
      <div className="bg-slate-900 border-b border-slate-800 h-10 overflow-hidden relative z-50">
        <div className="h-full w-full bg-slate-950 flex items-center gap-6 px-4 overflow-x-auto no-scrollbar">
          {marketTape.map((item) => (
            <div key={item.symbol} className="flex items-center gap-2 text-xs whitespace-nowrap">
              <span className="font-bold text-slate-200">{item.label}</span>
              <span className="font-mono text-slate-300">{item.price}</span>
              <span className={item.up ? 'text-emerald-400' : 'text-rose-400'}>{item.up && !item.change.startsWith('+') ? `+${item.change}` : item.change}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 p-4 sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('HOME')}>
            <div className="bg-emerald-500 rounded-lg p-2">
              <Newspaper className="w-6 h-6 text-slate-900" />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-none hidden sm:block">
                Daily<span className="text-emerald-400">Disspatch</span>
              </h1>
              <span className="text-[10px] text-slate-500 tracking-wider hidden sm:block">FINANCE & INTELLIGENCE</span>
            </div>
          </div>

          <div className="flex-1 max-w-xl mx-4 relative group" ref={wrapperRef}>
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0) setShowDropdown(true);
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-600"
              placeholder="Search stocks (NVDA) or crypto (BTC)..."
            />
            {isSearching && <Loader2 className="absolute right-3 top-2.5 w-4 h-4 text-slate-500 animate-spin" />}
            {showDropdown && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
                {suggestions.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectToken(item)}
                    className="w-full text-left px-4 py-3 hover:bg-slate-800 transition-colors flex items-center gap-3 border-b border-slate-800 last:border-0"
                  >
                    {item.thumb ? (
                      <img src={item.thumb} alt={item.symbol} className="w-6 h-6 rounded-full" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[8px] font-bold">{firstChar(item.symbol)}</div>
                    )}
                    <div>
                      <span className="font-bold text-white text-sm block">{item.name}</span>
                      <span className="text-xs text-slate-500 uppercase">{item.symbol}</span>
                    </div>
                    {item.type === 'STOCK' && <span className="ml-auto text-[10px] bg-blue-900 text-blue-300 px-1.5 py-0.5 rounded">STOCK</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setIsProMode(!isProMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs transition-all ${
              isProMode ? 'bg-amber-500/10 text-amber-400 border border-amber-500/50' : 'bg-slate-800 text-slate-400'
            }`}
          >
            {isProMode ? <Gem className="w-3 h-3 fill-current" /> : <Unlock className="w-3 h-3" />}
            {isProMode ? 'PRO' : 'FREE'}
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-4 space-y-6 mt-2">
        {view === 'HOME' && (
          <div className="space-y-8 animate-fade-in">
            <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {marketTape.map((item) => (
                  <div key={item.symbol} className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                    <div className="text-xs text-slate-400">{item.symbol}</div>
                    <div className="text-lg font-bold mt-1">{item.price}</div>
                    <div className={`text-xs font-semibold ${item.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {item.up && !item.change.startsWith('+') ? `+${item.change}` : item.change}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <h2 className="text-xl font-bold">Top Stories Today</h2>
                </div>
                <button className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
                  See All <ArrowLeft className="w-3 h-3 rotate-180" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-600 transition-all cursor-pointer group relative h-[350px]">
                  <img
                    src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=2670&auto=format&fit=crop"
                    alt="Market News"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-10"></div>

                  <div className="absolute bottom-0 left-0 p-8 z-20 max-w-3xl">
                    <div className="flex gap-2 mb-3">
                      <span className="bg-emerald-500 text-slate-950 text-xs font-bold px-2 py-1 rounded">Market Mover</span>
                      <span className="bg-slate-800/80 backdrop-blur text-slate-200 text-xs font-bold px-2 py-1 rounded">AI Sector</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors leading-tight">
                      Tech Sector Rally: AI Infrastructure Demand Hits All-Time High
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-slate-300">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> 2h ago
                      </span>
                      <span className="font-semibold text-emerald-400">The Capital Ledger</span>
                      <span className="text-slate-500">•</span>
                      <span>5 min read</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 flex flex-col h-[350px]">
                  <NewsCardCompact
                    title="Fed Chair Powell signals potential rate cut in late 2026 as inflation cools."
                    source="Global Markets Wire"
                    time="1h ago"
                    tag="Macro"
                    imageUrl="https://images.unsplash.com/photo-1611974765270-ca1258634369?w=800&auto=format&fit=crop&q=60"
                  />
                  <NewsCardCompact
                    title="Crypto Regulation: New legislative framework proposed for DeFi oversight."
                    source="Alpha Insight"
                    time="3h ago"
                    tag="Policy"
                    imageUrl="https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=800&auto=format&fit=crop&q=60"
                  />
                  <NewsCardCompact
                    title="Tesla (TSLA) upgrades production forecast for next-gen models."
                    source="Sector Watch"
                    time="4h ago"
                    tag="EVs"
                    imageUrl="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=60"
                  />
                  <div className="hidden lg:block flex-1">
                    <NewsCardCompact
                      title="Solana network activity flips Ethereum on weekly volume metrics."
                      source="The Financial Brief"
                      time="5h ago"
                      tag="Crypto"
                      imageUrl="https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&auto=format&fit=crop&q=60"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-amber-400" />
                <h2 className="text-xl font-bold text-white">Market Intelligence Scanner</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <ScannerButton icon={<TrendingUp className="w-6 h-6" />} title="Viral Stocks" active={activeScan === 'VIRAL_STOCKS'} onClick={() => runScanner('VIRAL_STOCKS')} color="emerald" />
                <ScannerButton icon={<Rocket className="w-6 h-6" />} title="Moon Bag (Solana)" active={activeScan === 'MOON_BAG'} onClick={() => runScanner('MOON_BAG')} color="purple" />
                <ScannerButton icon={<Flame className="w-6 h-6" />} title="High Volatility" active={activeScan === 'VOLATILITY'} onClick={() => runScanner('VOLATILITY')} color="orange" />
                <ScannerButton icon={<BarChart3 className="w-6 h-6" />} title="Stock Options" active={activeScan === 'STOCKS_OPTIONS'} onClick={() => runScanner('STOCKS_OPTIONS')} color="blue" />
              </div>

              {scanning && (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                </div>
              )}
              {errorMsg && (
                <div className="text-center text-red-400 py-4 text-sm flex items-center justify-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {errorMsg}
                </div>
              )}

              {!scanning && scannerResults.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in-up">
                  {scannerResults.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelectToken(item)}
                      className="p-4 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 cursor-pointer transition-all group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                            toNumber(item.price_change_percentage_24h) >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {firstChar(item.symbol)}
                        </div>
                        <div
                          className={`text-xs font-bold px-2 py-1 rounded bg-slate-900 ${
                            toNumber(item.price_change_percentage_24h) >= 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {toNumber(item.price_change_percentage_24h) >= 0 ? '+' : ''}
                          {toNumber(item.price_change_percentage_24h).toFixed(2)}%
                        </div>
                      </div>
                      <div className="font-bold text-white group-hover:text-emerald-400 truncate">{item.name}</div>
                      <div className="text-xs text-slate-500 mb-2 flex justify-between">
                        <span>{item.symbol}</span>
                        {Number.isFinite(toNumber(item.score, Number.NaN)) && (
                          <span className="text-purple-400 flex items-center gap-1">
                            <Rocket className="w-3 h-3" /> Score: {toNumber(item.score).toFixed(1)}
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-sm">
                        ${toNumber(item.current_price) < 0.01 ? toNumber(item.current_price).toFixed(6) : toNumber(item.current_price).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-400" /> Market Feed
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {feedNews.map((news, i) => (
                    <NewsCardStandard key={i} news={news} />
                  ))}
                </div>

                <button className="w-full py-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-xl text-sm font-bold text-slate-400 transition-all mt-4">
                  Load More Articles
                </button>
              </div>

              <div className="lg:col-span-4 space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <h3 className="font-bold text-sm text-slate-400 uppercase mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Trending Tickers
                  </h3>
                  <div className="space-y-1">
                    <TickerRow symbol="NVDA" name="NVIDIA" price="890.10" change="+2.4%" isUp />
                    <TickerRow symbol="BTC" name="Bitcoin" price="92,450" change="+1.2%" isUp />
                    <TickerRow symbol="GME" name="GameStop" price="24.50" change="+12.4%" isUp />
                    <TickerRow symbol="TSLA" name="Tesla" price="175.30" change="-1.5%" isUp={false} />
                    <TickerRow symbol="SOL" name="Solana" price="145.20" change="+5.1%" isUp />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-900/20 to-slate-900 border border-emerald-500/20 rounded-xl p-6 text-center">
                  <Gem className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                  <h4 className="font-bold text-white mb-2">Upgrade to Pro</h4>
                  <p className="text-xs text-slate-400 mb-4">Get real-time on-chain data and whale alerts.</p>
                  <button className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-lg text-xs transition-colors">
                    Unlock Premium
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'DETAIL' && liveData && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in-up">
            <div className="lg:col-span-12 flex items-center gap-2 text-sm text-slate-400 mb-2">
              <button onClick={() => setView('HOME')} className="hover:text-white flex items-center gap-1">
                <Home className="w-4 h-4" /> Home
              </button>
              <span>/</span>
              <span className="text-white font-bold">{liveData.symbol}</span>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                {Math.abs(parseFloat(liveData.changePercent)) > 10 && (
                  <div className="absolute top-4 right-4 animate-pulse">
                    <Flame className="w-6 h-6 text-orange-500" />
                  </div>
                )}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-slate-400 font-bold uppercase tracking-wider text-xs">Now Analyzing</h3>
                    <div className="text-4xl font-bold tracking-tight">{liveData.symbol}</div>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-full font-bold text-sm border flex items-center gap-2 ${
                      liveData.isUp ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'
                    }`}
                  >
                    {liveData.isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {liveData.isUp ? 'Trending UP' : 'Trending DOWN'}
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-5xl font-bold text-white tracking-tight">{liveData.price}</span>
                  <span className={`text-xl font-medium ${liveData.isUp ? 'text-green-400' : 'text-red-400'}`}>
                    {liveData.isUp ? '+' : ''}
                    {liveData.changePercent}%
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 border-t border-slate-800 pt-4">
                  <div>
                    <div className="text-xs text-slate-500 uppercase font-bold">Volume</div>
                    <div className="text-lg font-mono">{liveData.volume}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase font-bold">Mkt Cap</div>
                    <div className="text-lg font-mono">{liveData.mcap}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase font-bold">Momentum</div>
                    <div className={`text-lg font-bold ${liveData.momentumScore > 70 ? 'text-purple-400' : 'text-blue-400'}`}>{liveData.momentumLabel}</div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden h-[500px] shadow-lg relative">
                {loading && (
                  <div className="absolute inset-0 z-10 bg-slate-900 flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                  </div>
                )}
                <div className="w-full h-full p-8 flex flex-col justify-center bg-gradient-to-br from-slate-900 to-slate-950">
                  <div className="text-xs uppercase tracking-wider text-slate-500 mb-3">Price action overview</div>
                  <div className="relative h-56 border border-slate-800 rounded-xl bg-slate-950/80 overflow-hidden">
                    <svg viewBox="0 0 600 220" className="w-full h-full">
                      <polyline
                        fill="none"
                        stroke={liveData.isUp ? '#34d399' : '#f87171'}
                        strokeWidth="4"
                        points={
                          liveData.isUp
                            ? '20,170 80,150 140,160 200,130 260,120 320,100 380,90 440,80 500,70 580,40'
                            : '20,40 80,70 140,60 200,90 260,100 320,120 380,130 440,150 500,165 580,185'
                        }
                      />
                    </svg>
                  </div>
                  <div className="mt-4 text-sm text-slate-400">
                    Live chart embed was removed for stability; this panel keeps the experience responsive while data loads.
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                  <Newspaper className="w-5 h-5 text-blue-400" /> Latest Headlines for {liveData.symbol}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tokenNews.map((news) => (
                    <div
                      key={news.id}
                      className="bg-slate-950 border border-slate-800 rounded-xl hover:border-slate-600 transition-colors cursor-pointer group overflow-hidden flex"
                    >
                      <div className="w-24 h-auto bg-slate-900 relative flex-shrink-0">
                        <img src={news.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="p-3 flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              news.type === 'Bullish'
                                ? 'bg-green-900 text-green-400'
                                : news.type === 'Bearish'
                                  ? 'bg-red-900 text-red-400'
                                  : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {news.type}
                          </span>
                          <span className="text-xs text-slate-500">{news.time}</span>
                        </div>
                        <h4 className="font-bold text-slate-200 text-sm group-hover:text-blue-400 transition-colors line-clamp-2">{news.title}</h4>
                        <div className="mt-1 text-xs text-slate-500">{news.source}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col h-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="p-4 border-b border-slate-800 bg-slate-900 flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white">Intelligence Hub</h3>
                {analyzing && (
                  <span className="text-xs text-emerald-400 flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" /> Analyzing...
                  </span>
                )}
              </div>

              <div className="flex border-b border-slate-800 overflow-x-auto bg-slate-900 no-scrollbar">
                <TabButton icon={<Megaphone className="w-3 h-3" />} label="Viral" active={activeTab === 'VIRAL'} onClick={() => setActiveTab('VIRAL')} />
                <TabButton icon={<Briefcase className="w-3 h-3" />} label="Smart $" active={activeTab === 'SMART'} onClick={() => setActiveTab('SMART')} />
                <TabButton icon={<Target className="w-3 h-3" />} label="Plan" active={activeTab === 'PLAN'} onClick={() => setActiveTab('PLAN')} />
                <TabButton icon={<Users className="w-3 h-3" />} label="Sentiment" active={activeTab === 'SENT'} onClick={() => setActiveTab('SENT')} />
                <TabButton icon={<ShieldAlert className="w-3 h-3" />} label="Flags" active={activeTab === 'FLAGS'} onClick={() => setActiveTab('FLAGS')} />
                <TabButton icon={<Radar className="w-3 h-3" />} label="Trends" active={activeTab === 'TRENDS'} onClick={() => setActiveTab('TRENDS')} />
                <TabButton icon={<Zap className="w-3 h-3" />} label="News" active={activeTab === 'NEWS'} onClick={() => setActiveTab('NEWS')} />
              </div>

              <div className="p-6 flex-1 bg-slate-900/50 overflow-y-auto min-h-[500px]">
                {analyzing ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                    <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
                    <p className="text-sm font-mono">Scanning Social Signals & On-Chain Data...</p>
                  </div>
                ) : aiInsights ? (
                  <>
                    {activeTab === 'VIRAL' && (
                      <div className="space-y-4 animate-fade-in">
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                          <div className="text-xs text-emerald-400 uppercase font-bold mb-1">Viral Score</div>
                          <div className="text-3xl font-bold text-white mb-2">{liveData.momentumScore}/100</div>
                          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div style={{ width: `${liveData.momentumScore}%` }} className="h-full bg-emerald-500 transition-all duration-1000"></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-bold text-slate-200">Why it's trending:</h4>
                          <p className="text-sm text-slate-400 leading-relaxed">{aiInsights.viralReason}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-4">
                          <InfoCard label="Social Vol" value={liveData.volume} />
                          <InfoCard label="Hype Check" value={liveData.momentumScore > 70 ? 'High' : 'Normal'} />
                        </div>
                      </div>
                    )}

                    {activeTab === 'SMART' && (
                      <div className="space-y-4 animate-fade-in">
                        <h4 className="font-bold text-slate-200">Recent Whale Activity</h4>
                        <div className="space-y-3">
                          {aiInsights.whales.map((w, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                                  <Briefcase className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="font-bold text-sm text-white">{w.action}</div>
                                  <div className="text-xs text-slate-500">Wallet Size: {w.size}</div>
                                </div>
                              </div>
                              <div className="text-xs text-slate-400">{w.time}</div>
                            </div>
                          ))}
                        </div>
                        <div className="p-3 bg-blue-900/20 border border-blue-500/20 rounded-lg text-xs text-blue-300">
                          <span className="font-bold">Insight:</span> Large wallets are {liveData.isUp ? 'holding strength' : 'waiting for lower entries'}.
                        </div>
                      </div>
                    )}

                    {activeTab === 'PLAN' && (
                      <div className="space-y-4 animate-fade-in">
                        <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 text-center">
                          <div className="text-slate-400 text-xs uppercase mb-1">Current Price</div>
                          <div className="text-2xl font-bold text-white">{liveData.price}</div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 text-center">
                          <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                            <div className="text-green-400 text-xs font-bold uppercase mb-1">Buy Zone</div>
                            <div className="text-white font-mono text-sm">${aiInsights.entry}</div>
                          </div>
                          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                            <div className="text-red-400 text-xs font-bold uppercase mb-1">Stop Loss</div>
                            <div className="text-white font-mono text-sm">${aiInsights.stop}</div>
                          </div>
                          <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                            <div className="text-purple-400 text-xs font-bold uppercase mb-1">Target</div>
                            <div className="text-white font-mono text-sm">${aiInsights.target}</div>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 text-center mt-2">Levels calculated based on daily volatility.</p>
                      </div>
                    )}

                    {activeTab === 'SENT' && (
                      <div className="space-y-6 animate-fade-in">
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-bold uppercase">
                            <span className="text-blue-400">Institutional</span>
                            <span className="text-pink-400">Retail FOMO</span>
                          </div>
                          <div className="h-4 bg-slate-800 rounded-full overflow-hidden flex relative">
                            <div style={{ width: `${100 - liveData.retailScore}%` }} className="bg-blue-600 h-full"></div>
                            <div style={{ width: `${liveData.retailScore}%` }} className="bg-pink-600 h-full"></div>
                            <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_white] left-1/2"></div>
                          </div>
                          <div className="flex justify-between text-xs text-slate-400">
                            <span>{100 - liveData.retailScore}%</span>
                            <span>{liveData.retailScore}%</span>
                          </div>
                        </div>

                        <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                          <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                            <Users className="w-4 h-4 text-emerald-400" /> Crowd Analysis
                          </h4>
                          <p className="text-sm text-slate-300 leading-relaxed">{aiInsights.sentiment}</p>
                        </div>
                      </div>
                    )}

                    {activeTab === 'FLAGS' && (
                      <div className="space-y-3 animate-fade-in">
                        {liveData.risks.map((risk, i) => (
                          <div
                            key={i}
                            className={`p-3 rounded-lg border flex items-center gap-3 ${
                              risk.type === 'Safe' ? 'bg-green-500/10 border-green-500/30 text-green-300' : 'bg-red-500/10 border-red-500/30 text-red-300'
                            }`}
                          >
                            {risk.type === 'Safe' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                            <div>
                              <span className="font-bold text-sm block">{risk.text}</span>
                              {risk.type !== 'Safe' && <span className="text-xs opacity-70">Proceed with caution.</span>}
                            </div>
                          </div>
                        ))}
                        {liveData.risks.length === 1 && liveData.risks[0].type === 'Safe' && (
                          <div className="text-center text-xs text-slate-500 mt-4">All systems nominal. No rug-pull indicators found.</div>
                        )}
                      </div>
                    )}

                    {activeTab === 'TRENDS' && (
                      <div className="space-y-4 animate-fade-in">
                        <h4 className="font-bold text-slate-200">Related Sector Heat</h4>
                        <div className="flex gap-2 flex-wrap">
                          {aiInsights.trends.map((t, i) => (
                            <span key={i} className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs text-slate-300">
                              #{t}
                            </span>
                          ))}
                          <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs text-slate-300">#Crypto</span>
                          <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs text-slate-300">#Tech</span>
                        </div>
                        <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                          <div className="text-xs text-purple-400 uppercase font-bold mb-2">Sector Outlook</div>
                          <p className="text-sm text-slate-300">
                            This sector is currently {liveData.isUp ? 'outperforming' : 'lagging'} the broader market. Rotation suggests{' '}
                            {liveData.isUp ? 'momentum inflow' : 'defensive positioning'}.
                          </p>
                        </div>
                      </div>
                    )}

                    {activeTab === 'NEWS' && (
                      <div className="space-y-4 animate-fade-in">
                        <div className="space-y-2">
                          {aiInsights.catalysts.map((c, i) => (
                            <div key={i} className="flex gap-3 p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
                              <div className="mt-1">
                                <FlagTriangleRight className="w-4 h-4 text-yellow-400" />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-white">{c}</div>
                                <div className="text-xs text-slate-500">Expected Impact: High</div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="text-xs text-slate-500 text-center">AI Scan of last 24h headlines & filings.</div>
                      </div>
                    )}
                  </>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

const scannerColorClasses = {
  emerald: 'bg-emerald-500/20 border-emerald-500 text-emerald-400',
  purple: 'bg-purple-500/20 border-purple-500 text-purple-400',
  orange: 'bg-orange-500/20 border-orange-500 text-orange-400',
  blue: 'bg-blue-500/20 border-blue-500 text-blue-400'
};

const ScannerButton = ({ icon, title, active, onClick, color }) => (
  <button
    onClick={onClick}
    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
      active ? scannerColorClasses[color] : 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300'
    }`}
  >
    {icon}
    <span className="text-xs font-bold">{title}</span>
  </button>
);

const TabButton = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1 px-4 py-3 text-[10px] font-bold transition-all border-b-2 min-w-[70px] ${
      active ? 'border-emerald-500 text-white bg-slate-800' : 'border-transparent text-slate-500 hover:text-slate-300'
    }`}
  >
    {icon}
    {label}
  </button>
);

const InfoCard = ({ label, value }) => (
  <div className="p-3 bg-slate-800 border border-slate-700 rounded-lg">
    <div className="text-[10px] text-slate-500 uppercase font-bold">{label}</div>
    <div className="text-sm font-bold text-white">{value}</div>
  </div>
);

const NewsCardCompact = ({ title, source, time, tag, imageUrl }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 hover:border-slate-600 transition-colors cursor-pointer flex gap-4 overflow-hidden group h-full">
    {imageUrl && (
      <div className="w-20 flex-shrink-0 rounded-lg overflow-hidden bg-slate-800 relative h-full">
        <img src={imageUrl} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
      </div>
    )}
    <div className="flex-1 min-w-0 flex flex-col justify-center">
      <div className="flex justify-between items-start mb-1">
        <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">{tag}</span>
        <span className="text-xs text-slate-500">{time}</span>
      </div>
      <h4 className="text-sm font-bold text-slate-200 leading-snug mb-1 group-hover:text-emerald-400 transition-colors line-clamp-2">{title}</h4>
      <div className="flex items-center gap-1 text-xs text-slate-500 truncate">
        <Globe className="w-3 h-3 flex-shrink-0" /> {source}
      </div>
    </div>
  </div>
);

const NewsCardStandard = ({ news }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-600 transition-all cursor-pointer group flex flex-col h-full">
    <div className="h-40 bg-slate-800 relative overflow-hidden">
      <img src={news.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
      <div className="absolute top-2 left-2">
        <span className="bg-black/50 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded">{news.type}</span>
      </div>
    </div>
    <div className="p-4 flex flex-col flex-1">
      <div className="flex justify-between items-center mb-2 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <Globe className="w-3 h-3" /> {news.source}
        </span>
        <span>{news.time}</span>
      </div>
      <h3 className="font-bold text-slate-200 mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">{news.title}</h3>
    </div>
  </div>
);

const TickerRow = ({ symbol, name, price, change, isUp }) => (
  <div className="flex items-center justify-between p-3 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors group">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400 group-hover:text-white group-hover:bg-slate-700 transition-colors">
        {firstChar(symbol)}
      </div>
      <div>
        <div className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">{symbol}</div>
        <div className="text-xs text-slate-500">{name}</div>
      </div>
    </div>
    <div className="text-right">
      <div className="font-mono text-sm text-white">${price}</div>
      <div className={`text-xs font-bold ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>{change}</div>
    </div>
  </div>
);

export default FinancePage;
