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
  Rocket,
  WifiOff
} from 'lucide-react';

const TOP_TICKER_FALLBACK_ITEMS = ['S&P 500', 'Nasdaq 100', 'Bitcoin', 'Ethereum', 'Solana', 'NVIDIA', 'Tesla'];

const TV_CRYPTO_SYMBOL_MAP = {
  BTC: 'BITSTAMP:BTCUSD',
  ETH: 'BITSTAMP:ETHUSD',
  SOL: 'BINANCE:SOLUSDT',
  BNB: 'BINANCE:BNBUSDT',
  XRP: 'BITSTAMP:XRPUSD',
  DOGE: 'BINANCE:DOGEUSDT',
  ADA: 'BINANCE:ADAUSDT',
  AVAX: 'BINANCE:AVAXUSDT',
  LINK: 'BINANCE:LINKUSDT',
  MATIC: 'BINANCE:MATICUSDT',
  SHIB: 'BINANCE:SHIBUSDT',
  PEPE: 'BINANCE:PEPEUSDT'
};

const DEX_SEARCH_ENDPOINT = 'https://api.dexscreener.com/latest/dex/search?q=';
const DEX_TOKEN_ENDPOINT = 'https://api.dexscreener.com/latest/dex/tokens/';
const DEFAULT_DEX_QUERIES = ['bitcoin', 'ethereum', 'solana', 'chainlink', 'dogecoin', 'avalanche'];
const PRIMARY_CHAINS = new Set(['solana', 'ethereum', 'base', 'bsc', 'arbitrum']);
const ACCEPTED_QUOTES = new Set(['USDT', 'USDC', 'USD', 'WETH', 'ETH', 'SOL', 'BNB']);
const CORE_FEED_SYMBOLS = new Set([
  'BTC',
  'ETH',
  'SOL',
  'BNB',
  'XRP',
  'DOGE',
  'ADA',
  'AVAX',
  'LINK',
  'MATIC',
  'SHIB',
  'PEPE',
  'LTC',
  'TRX',
  'ATOM',
  'NEAR',
  'ARB',
  'OP',
  'UNI',
  'AAVE',
  'INJ',
  'SUI',
  'TON',
  'BONK',
  'WIF'
]);
const CHAIN_NEWS_IMAGE = {
  solana: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&auto=format&fit=crop&q=60',
  ethereum: 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=800&auto=format&fit=crop&q=60',
  bsc: 'https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?w=800&auto=format&fit=crop&q=60',
  base: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=60'
};

const TOP_TICKER_TAPE_SRC = 'https://www.tradingview-widget.com/embed-widget/ticker-tape/?locale=en#%7B%22symbols%22%3A%5B%7B%22proName%22%3A%22FOREXCOM%3ASPXUSD%22%2C%22title%22%3A%22S%26P%20500%22%7D%2C%7B%22proName%22%3A%22FOREXCOM%3ANSXUSD%22%2C%22title%22%3A%22Nasdaq%20100%22%7D%2C%7B%22proName%22%3A%22BITSTAMP%3ABTCUSD%22%2C%22title%22%3A%22Bitcoin%22%7D%2C%7B%22proName%22%3A%22BITSTAMP%3AETHUSD%22%2C%22title%22%3A%22Ethereum%22%7D%2C%7B%22proName%22%3A%22BINANCE%3ASOLUSDT%22%2C%22title%22%3A%22Solana%22%7D%2C%7B%22proName%22%3A%22NASDAQ%3ANVDA%22%2C%22title%22%3A%22NVIDIA%22%7D%2C%7B%22proName%22%3A%22NASDAQ%3ATSLA%22%2C%22title%22%3A%22Tesla%22%7D%5D%2C%22showSymbolLogo%22%3Atrue%2C%22colorTheme%22%3A%22dark%22%2C%22isTransparent%22%3Afalse%2C%22displayMode%22%3A%22adaptive%22%2C%22width%22%3A%22100%25%22%2C%22height%22%3A46%7D';
const MARKET_OVERVIEW_SRC = 'https://www.tradingview-widget.com/embed-widget/tickers/?locale=en#%7B%22symbols%22%3A%5B%7B%22proName%22%3A%22FOREXCOM%3ASPXUSD%22%2C%22title%22%3A%22S%26P%20500%22%7D%2C%7B%22proName%22%3A%22FOREXCOM%3ANSXUSD%22%2C%22title%22%3A%22Nasdaq%20100%22%7D%2C%7B%22proName%22%3A%22FX_IDC%3AEURUSD%22%2C%22title%22%3A%22EUR%2FUSD%22%7D%2C%7B%22proName%22%3A%22BITSTAMP%3ABTCUSD%22%2C%22title%22%3A%22Bitcoin%22%7D%2C%7B%22proName%22%3A%22BITSTAMP%3AETHUSD%22%2C%22title%22%3A%22Ethereum%22%7D%5D%2C%22colorTheme%22%3A%22dark%22%2C%22isTransparent%22%3Atrue%2C%22showSymbolLogo%22%3Atrue%2C%22width%22%3A%22100%25%22%2C%22height%22%3A180%7D';

const safeNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const formatCompactUsd = (value) => {
  const numeric = safeNumber(value, 0);
  if (numeric <= 0) return 'N/A';
  if (numeric < 1) return `$${numeric.toFixed(4)}`;
  return numeric.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 2
  });
};

const normalizeDexPair = (pair) => {
  if (!pair?.baseToken?.symbol || !pair?.pairAddress || !pair?.chainId) return null;

  const buys = safeNumber(pair.txns?.h24?.buys, 0);
  const sells = safeNumber(pair.txns?.h24?.sells, 0);

  return {
    id: pair.pairAddress,
    symbol: String(pair.baseToken.symbol).toUpperCase(),
    name: pair.baseToken.name || pair.baseToken.symbol,
    type: 'CRYPTO',
    source: 'DexScreener',
    pairAddress: pair.pairAddress,
    tokenAddress: pair.baseToken.address,
    chainId: pair.chainId,
    dexId: pair.dexId || 'dex',
    quoteSymbol: String(pair.quoteToken?.symbol || '').toUpperCase(),
    url: pair.url || '',
    imageUrl: pair.info?.imageUrl || '',
    current_price: safeNumber(pair.priceUsd, 0),
    price_change_percentage_24h: safeNumber(pair.priceChange?.h24, 0),
    volume24h: safeNumber(pair.volume?.h24, 0),
    liquidity: safeNumber(pair.liquidity?.usd, 0),
    marketCap: safeNumber(pair.marketCap || pair.fdv, 0),
    txns24h: buys + sells
  };
};

const dedupePairs = (pairs) => {
  const byKey = new Map();
  pairs.forEach((pair) => {
    if (!pair) return;
    const existing = byKey.get(pair.id);
    if (!existing || pair.liquidity > existing.liquidity) {
      byKey.set(pair.id, pair);
    }
  });
  return Array.from(byKey.values());
};

const dedupeByToken = (pairs) => {
  const byToken = new Map();
  pairs.forEach((pair) => {
    if (!pair?.tokenAddress) return;
    const key = `${pair.chainId}:${pair.tokenAddress}`;
    const existing = byToken.get(key);
    if (!existing || pair.liquidity > existing.liquidity) {
      byToken.set(key, pair);
    }
  });
  return Array.from(byToken.values());
};

const dedupeBySymbol = (pairs) => {
  const bySymbol = new Map();
  pairs.forEach((pair) => {
    if (!pair?.symbol) return;
    const existing = bySymbol.get(pair.symbol);
    if (!existing || pair.volume24h > existing.volume24h) {
      bySymbol.set(pair.symbol, pair);
    }
  });
  return Array.from(bySymbol.values());
};

const filterPairsForQuality = (pairs, options = {}) => {
  const {
    minLiquidity = 15000,
    minVolume = 2500,
    maxAbsChange = 80,
    requireAcceptedQuote = true,
    allowSelfQuote = true
  } = options;

  return pairs.filter((pair) => {
    if (!pair) return false;
    if (!PRIMARY_CHAINS.has(pair.chainId)) return false;
    if (pair.liquidity < minLiquidity) return false;
    if (pair.volume24h < minVolume) return false;
    if (Math.abs(pair.price_change_percentage_24h) > maxAbsChange) return false;
    if (requireAcceptedQuote && !ACCEPTED_QUOTES.has(pair.quoteSymbol)) return false;
    if (!allowSelfQuote && pair.symbol === pair.quoteSymbol) return false;
    return true;
  });
};

const selectBestPair = (pairs, symbolHint = '') => {
  if (!Array.isArray(pairs) || pairs.length === 0) return null;
  const hint = String(symbolHint || '').toUpperCase();
  const sorted = [...pairs].sort((a, b) => (b.liquidity + b.volume24h) - (a.liquidity + a.volume24h));
  if (!hint) return sorted[0];
  return sorted.find((pair) => pair.symbol === hint) || sorted[0];
};

const getTradingViewSymbol = (symbol) => {
  const upper = String(symbol || '').toUpperCase();
  return TV_CRYPTO_SYMBOL_MAP[upper] || null;
};

const FinancePage = () => {
  const [view, setView] = useState('HOME');

  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [ticker, setTicker] = useState('BTC');
  const [loading, setLoading] = useState(false);
  const [liveData, setLiveData] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [chartErrorMsg, setChartErrorMsg] = useState(null);
  const [topWidgetOffline, setTopWidgetOffline] = useState(false);
  const [overviewWidgetOffline, setOverviewWidgetOffline] = useState(false);

  const [isProMode, setIsProMode] = useState(true);
  const [scannerResults, setScannerResults] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [activeScan, setActiveScan] = useState(null);
  const [activeTab, setActiveTab] = useState('VIRAL');

  const [analyzing, setAnalyzing] = useState(false);
  const [aiInsights, setAiInsights] = useState(null);
  const [selectedPair, setSelectedPair] = useState(null);
  const [trendingPairs, setTrendingPairs] = useState([]);
  const [marketSnapshot, setMarketSnapshot] = useState({
    totalPairs: 0,
    avgChange: 0,
    leaderSymbol: 'N/A',
    leaderVolume: 0
  });

  const wrapperRef = useRef(null);
  const aiTimerRef = useRef(null);
  const scanRequestRef = useRef(0);
  const tokenRequestRef = useRef(0);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => () => {
    if (aiTimerRef.current) {
      window.clearTimeout(aiTimerRef.current);
    }
  }, []);

  const fetchDexSearchPairs = async (query, signal) => {
    const response = await fetch(`${DEX_SEARCH_ENDPOINT}${encodeURIComponent(query)}`, { signal });
    if (!response.ok) throw new Error(`DexScreener search failed (${response.status})`);

    const json = await response.json();
    const normalized = (json.pairs || [])
      .map(normalizeDexPair)
      .filter((pair) => pair && pair.current_price > 0 && pair.liquidity > 5000);

    return dedupePairs(normalized);
  };

  const fetchDexPairsByTokenAddress = async (tokenAddress, signal) => {
    const response = await fetch(`${DEX_TOKEN_ENDPOINT}${encodeURIComponent(tokenAddress)}`, { signal });
    if (!response.ok) throw new Error(`DexScreener token lookup failed (${response.status})`);

    const json = await response.json();
    const normalized = (json.pairs || [])
      .map(normalizeDexPair)
      .filter((pair) => pair && pair.current_price > 0);

    return dedupePairs(normalized);
  };

  const loadDexUniverse = async (queries, signal) => {
    const results = await Promise.allSettled(queries.map((query) => fetchDexSearchPairs(query, signal)));
    const merged = results.flatMap((result) => (result.status === 'fulfilled' ? result.value : []));
    return dedupeByToken(filterPairsForQuality(dedupePairs(merged), { allowSelfQuote: false }));
  };

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

  const generateDexHeadlines = (pair) => {
    const change = pair.price_change_percentage_24h;
    const direction = change >= 0 ? 'up' : 'down';
    const absolute = Math.abs(change).toFixed(2);

    return [
      {
        id: `${pair.id}-liq`,
        source: 'DexScreener',
        title: `${pair.symbol} liquidity pool at ${formatCompactUsd(pair.liquidity)} across ${pair.dexId}.`,
        time: 'Live',
        type: 'Liquidity',
        imageUrl: pair.imageUrl || CHAIN_NEWS_IMAGE[pair.chainId] || CHAIN_NEWS_IMAGE.solana
      },
      {
        id: `${pair.id}-vol`,
        source: 'DexScreener',
        title: `${pair.symbol} ${direction} ${absolute}% in 24h with ${formatCompactUsd(pair.volume24h)} volume.`,
        time: 'Live',
        type: change >= 0 ? 'Bullish' : 'Bearish',
        imageUrl: pair.imageUrl || CHAIN_NEWS_IMAGE[pair.chainId] || CHAIN_NEWS_IMAGE.ethereum
      },
      {
        id: `${pair.id}-txns`,
        source: 'DexScreener',
        title: `${pair.txns24h.toLocaleString('en-US')} transactions recorded on ${pair.chainId}.`,
        time: 'Live',
        type: 'Flow',
        imageUrl: pair.imageUrl || CHAIN_NEWS_IMAGE[pair.chainId] || CHAIN_NEWS_IMAGE.base
      },
      {
        id: `${pair.id}-mcap`,
        source: 'DexScreener',
        title: `${pair.symbol} market cap estimate sits near ${formatCompactUsd(pair.marketCap)}.`,
        time: 'Live',
        type: 'Market Cap',
        imageUrl: pair.imageUrl || CHAIN_NEWS_IMAGE[pair.chainId] || CHAIN_NEWS_IMAGE.solana
      }
    ];
  };

  const [tokenNews, setTokenNews] = useState([]);
  const [feedNews, setFeedNews] = useState([]);

  useEffect(() => {
    let cancelled = false;
    const abortController = new AbortController();

    const loadHomeMarketData = async () => {
      try {
        const universe = await loadDexUniverse(DEFAULT_DEX_QUERIES, abortController.signal);
        if (cancelled || universe.length === 0) return;

        const coreUniverse = dedupeBySymbol(universe.filter((pair) => CORE_FEED_SYMBOLS.has(pair.symbol)));
        const displayUniverse = coreUniverse.length > 0 ? coreUniverse : dedupeBySymbol(universe);
        if (displayUniverse.length === 0) return;

        const movers = [...displayUniverse]
          .sort((a, b) => Math.abs(b.price_change_percentage_24h) - Math.abs(a.price_change_percentage_24h))
          .slice(0, 12);

        const feed = movers.map((pair) => ({
          id: pair.id,
          source: `${pair.dexId.toUpperCase()} • ${pair.chainId.toUpperCase()}`,
          title: `${pair.name} (${pair.symbol}) ${pair.price_change_percentage_24h >= 0 ? 'gains' : 'drops'} ${Math.abs(pair.price_change_percentage_24h).toFixed(2)}% over 24h.`,
          time: 'Live',
          type: pair.price_change_percentage_24h >= 0 ? 'Bullish' : 'Bearish',
          imageUrl: pair.imageUrl || CHAIN_NEWS_IMAGE[pair.chainId] || CHAIN_NEWS_IMAGE.solana
        }));

        const trending = [...displayUniverse]
          .sort((a, b) => b.volume24h - a.volume24h)
          .slice(0, 5);

        const avgChange = displayUniverse.reduce((sum, pair) => sum + pair.price_change_percentage_24h, 0) / displayUniverse.length;
        const liquidityLeader = [...displayUniverse].sort((a, b) => b.volume24h - a.volume24h)[0];

        setFeedNews(feed);
        setTrendingPairs(trending);
        setMarketSnapshot({
          totalPairs: displayUniverse.length,
          avgChange,
          leaderSymbol: liquidityLeader?.symbol || 'N/A',
          leaderVolume: liquidityLeader?.volume24h || 0
        });
      } catch (error) {
        if (error.name === 'AbortError') return;
        console.error('Home market feed failed', error);
        if (!cancelled) {
          const fallbackTickers = ['BTC', 'ETH', 'SOL', 'LINK', 'DOGE', 'AVAX'];
          let fallbackNews = [];
          fallbackTickers.forEach((symbol) => {
            fallbackNews = [...fallbackNews, ...generateNews(symbol, 1)];
          });
          setFeedNews(fallbackNews);
        }
      }
    };

    loadHomeMarketData();
    const refreshId = window.setInterval(loadHomeMarketData, 60000);

    return () => {
      cancelled = true;
      abortController.abort();
      window.clearInterval(refreshId);
    };
  }, []);

  useEffect(() => {
    if (view !== 'DETAIL') return;

    const tvSymbol = getTradingViewSymbol(ticker);
    const mountPoint = document.getElementById('tradingview_widget');
    if (!mountPoint) return;

    if (!tvSymbol) {
      mountPoint.innerHTML = '';
      setChartErrorMsg(null);
      return;
    }

    let cancelled = false;
    setChartErrorMsg(null);

    const renderWidget = () => {
      if (cancelled) return;
      if (!mountPoint || !window.TradingView?.widget) {
        setChartErrorMsg('Interactive chart is temporarily unavailable.');
        return;
      }

      mountPoint.innerHTML = '';
      try {
        new window.TradingView.widget({
          width: '100%',
          height: '100%',
          symbol: tvSymbol,
          interval: 'D',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: 'tradingview_widget',
          hide_side_toolbar: true
        });
      } catch (error) {
        console.error('TradingView widget failed to render', error);
        setChartErrorMsg('Unable to render chart for this symbol right now.');
      }
    };

    const loadTvScript = () =>
      new Promise((resolve, reject) => {
        if (window.TradingView?.widget) {
          resolve();
          return;
        }

        const timeoutId = window.setTimeout(() => {
          reject(new Error('TradingView script timed out'));
        }, 6000);
        const onLoad = () => {
          window.clearTimeout(timeoutId);
          resolve();
        };
        const onError = () => {
          window.clearTimeout(timeoutId);
          reject(new Error('TradingView script failed'));
        };

        const existing = document.querySelector('script[data-tv-script="core"]');
        if (existing) {
          existing.addEventListener('load', onLoad, { once: true });
          existing.addEventListener('error', onError, { once: true });
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/tv.js';
        script.async = true;
        script.dataset.tvScript = 'core';
        script.addEventListener('load', onLoad, { once: true });
        script.addEventListener('error', onError, { once: true });
        document.body.appendChild(script);
      });

    loadTvScript()
      .then(renderWidget)
      .catch((error) => {
        console.error(error);
        if (!cancelled) {
          setChartErrorMsg('Chart feed failed to load. Please try again.');
        }
      });

    return () => {
      cancelled = true;
      if (mountPoint) mountPoint.innerHTML = '';
    };
  }, [ticker, view]);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchSuggestions = async () => {
      if (searchInput.length < 2) {
        setSuggestions([]);
        setShowDropdown(false);
        return;
      }
      setIsSearching(true);

      try {
        const pairs = await fetchDexSearchPairs(searchInput, abortController.signal);
        const topMatches = dedupeBySymbol(
          filterPairsForQuality(pairs, {
            minLiquidity: 5000,
            minVolume: 500,
            maxAbsChange: 150,
            requireAcceptedQuote: true,
            allowSelfQuote: false
          })
        )
          .sort((a, b) => (b.liquidity + b.volume24h) - (a.liquidity + a.volume24h))
          .slice(0, 8);

        setSuggestions(topMatches);
        setShowDropdown(topMatches.length > 0);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Search error:', error);
          setSuggestions([]);
          setShowDropdown(false);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsSearching(false);
        }
      }
    };

    const timeoutId = window.setTimeout(fetchSuggestions, 400);
    return () => {
      window.clearTimeout(timeoutId);
      abortController.abort();
    };
  }, [searchInput]);

  const runScanner = async (type) => {
    const requestId = scanRequestRef.current + 1;
    scanRequestRef.current = requestId;
    setScanning(true);
    setActiveScan(type);
    setScannerResults([]);
    setErrorMsg(null);

    try {
      const queryMap = {
        VIRAL_STOCKS: ['bitcoin', 'ethereum', 'solana', 'base', 'meme'],
        MOON_BAG: ['solana'],
        VOLATILITY: ['solana', 'ethereum', 'base', 'arbitrum'],
        STOCKS_OPTIONS: ['bitcoin', 'ethereum', 'solana']
      };

      const universe = await loadDexUniverse(queryMap[type] || DEFAULT_DEX_QUERIES);
      if (requestId !== scanRequestRef.current) return;
      if (!universe.length) throw new Error('No market data returned');

      let results = [];

      if (type === 'MOON_BAG') {
        results = universe
          .filter((pair) => pair.chainId === 'solana')
          .map((pair) => ({
            ...pair,
            score: Math.min(
              100,
              (pair.volume24h / Math.max(pair.liquidity, 1)) * 22 +
              Math.min(pair.txns24h / 35, 45) +
              Math.min(Math.abs(pair.price_change_percentage_24h), 35)
            )
          }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 6);
      } else if (type === 'STOCKS_OPTIONS') {
        results = universe
          .filter((pair) => pair.txns24h > 0)
          .map((pair) => ({
            ...pair,
            score: Math.min(
              100,
              Math.min(pair.txns24h / 40, 70) +
              (pair.volume24h / Math.max(pair.liquidity, 1)) * 15
            )
          }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 6);
      } else if (type === 'VOLATILITY') {
        results = filterPairsForQuality(universe, {
          minLiquidity: 20000,
          minVolume: 4000,
          maxAbsChange: 180,
          requireAcceptedQuote: false
        })
          .sort((a, b) => Math.abs(b.price_change_percentage_24h) - Math.abs(a.price_change_percentage_24h))
          .slice(0, 6);
      } else {
        results = universe
          .map((pair) => ({
            ...pair,
            score: Math.min(
              100,
              Math.min(pair.txns24h / 45, 55) +
              (pair.volume24h / Math.max(pair.liquidity, 1)) * 20 +
              Math.min(Math.abs(pair.price_change_percentage_24h), 25)
            )
          }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 6);
      }

      if (requestId !== scanRequestRef.current) return;
      setScannerResults(dedupeBySymbol(results).slice(0, 6));
    } catch (e) {
      console.error('Scanner failed', e);
      if (requestId === scanRequestRef.current) {
        setErrorMsg('DexScreener feed interrupted. Please retry in a few seconds.');
      }
    } finally {
      if (requestId === scanRequestRef.current) {
        setScanning(false);
      }
    }
  };

  const resolveDexPair = async (token) => {
    if (token?.pairAddress && token?.chainId) {
      return token;
    }

    if (token?.tokenAddress) {
      const byAddress = await fetchDexPairsByTokenAddress(token.tokenAddress);
      const matchByAddress = selectBestPair(
        filterPairsForQuality(byAddress, {
          minLiquidity: 4000,
          minVolume: 500,
          maxAbsChange: 180,
          requireAcceptedQuote: false,
          allowSelfQuote: false
        }),
        token.symbol
      );
      if (matchByAddress) return matchByAddress;
    }

    const query = token?.symbol || token?.name;
    if (!query) return null;
    const bySearch = await fetchDexSearchPairs(query);
    const refined = filterPairsForQuality(bySearch, {
      minLiquidity: 4000,
      minVolume: 500,
      maxAbsChange: 180,
      requireAcceptedQuote: false,
      allowSelfQuote: false
    });
    return selectBestPair(refined, token.symbol) || selectBestPair(bySearch, token.symbol);
  };

  const handleSelectToken = async (token) => {
    const requestId = tokenRequestRef.current + 1;
    tokenRequestRef.current = requestId;
    const displayName = token.name || token.symbol || '';
    setSearchInput(displayName);
    setShowDropdown(false);
    setLoading(true);
    setScannerResults([]);
    setActiveScan(null);
    setAnalyzing(true);
    setAiInsights(null);
    setChartErrorMsg(null);
    setView('DETAIL');
    setTokenNews([]);
    setErrorMsg(null);

    if (aiTimerRef.current) {
      window.clearTimeout(aiTimerRef.current);
      aiTimerRef.current = null;
    }

    const selectedTicker = String(token.symbol || '').toUpperCase();
    if (!selectedTicker) {
      if (requestId === tokenRequestRef.current) {
        setErrorMsg('Invalid symbol received. Please try another asset.');
        setLoading(false);
        setAnalyzing(false);
      }
      return;
    }
    try {
      const resolvedPair = await resolveDexPair(token);
      if (requestId !== tokenRequestRef.current) return;
      if (!resolvedPair) {
        throw new Error('No pair found for this token');
      }

      setSelectedPair(resolvedPair);
      setTicker(resolvedPair.symbol);
      setTokenNews(generateDexHeadlines(resolvedPair));

      const processedData = processData(
        resolvedPair.symbol,
        resolvedPair.current_price,
        resolvedPair.price_change_percentage_24h,
        resolvedPair.volume24h,
        'DexScreener',
        resolvedPair.marketCap
      );

      setLiveData(processedData);
      aiTimerRef.current = window.setTimeout(() => {
        if (requestId !== tokenRequestRef.current) return;
        setAiInsights(generateAiInsights(processedData));
        setAnalyzing(false);
        aiTimerRef.current = null;
      }, 1500);
    } catch (error) {
      console.error('Error:', error);
      if (requestId === tokenRequestRef.current) {
        setErrorMsg('Could not resolve live DexScreener data for this token.');
        setAnalyzing(false);
      }
    } finally {
      if (requestId === tokenRequestRef.current) {
        setLoading(false);
      }
    }
  };

  const processData = (sym, price, changePct, vol, source, mcap) => {
    const normalizedPrice = safeNumber(price, 0);
    const normalizedChange = safeNumber(changePct, 0);
    const normalizedVolume = safeNumber(vol, 0);
    const normalizedMcap = safeNumber(mcap, 0);

    const isUp = normalizedChange >= 0;
    const momentumScore = Math.min(Math.abs(normalizedChange) * 5, 100);
    let momentumLabel = 'Stable';
    if (momentumScore > 30) momentumLabel = 'Building';
    if (momentumScore > 60) momentumLabel = 'Viral / Surge';
    if (momentumScore > 90) momentumLabel = 'Extreme / FOMO';

    let retailScore = 50;
    if (Math.abs(normalizedChange) > 10) retailScore += 30;
    if (normalizedMcap > 0 && normalizedMcap < 1000000000) retailScore += 20;
    retailScore = Math.min(Math.max(retailScore, 0), 100);

    const risks = [];
    if (Math.abs(normalizedChange) > 15) risks.push({ type: 'Vol', text: 'Extreme Volatility (Pump Risk)' });
    if (normalizedMcap > 0 && normalizedMcap < 50000000) risks.push({ type: 'Liq', text: 'Low Liquidity (Trap Risk)' });
    if (!isUp && Math.abs(normalizedChange) > 10) risks.push({ type: 'Dump', text: 'Falling Knife Warning' });
    if (risks.length === 0) risks.push({ type: 'Safe', text: 'No immediate red flags detected.' });

    let formattedPrice = 'N/A';
    if (normalizedPrice > 0) {
      if (normalizedPrice < 0.0001) formattedPrice = `$${normalizedPrice.toFixed(8)}`;
      else if (normalizedPrice < 0.01) formattedPrice = `$${normalizedPrice.toFixed(6)}`;
      else if (normalizedPrice < 1) formattedPrice = `$${normalizedPrice.toFixed(4)}`;
      else formattedPrice = normalizedPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }

    return {
      symbol: String(sym || 'N/A').toUpperCase(),
      priceRaw: normalizedPrice,
      price: formattedPrice,
      changePercent: normalizedChange.toFixed(2),
      changeRaw: normalizedChange,
      isUp,
      volume: normalizedVolume > 0 ? `${(normalizedVolume / 1000000).toFixed(1)}M` : 'N/A',
      mcap: normalizedMcap > 0 ? `${(normalizedMcap / 1000000000).toFixed(2)}B` : 'N/A',
      momentumScore,
      momentumLabel,
      retailScore,
      risks,
      source
    };
  };

  const generateAiInsights = (data) => {
    const isBullish = data.isUp;
    const vol = Math.abs(safeNumber(data.changeRaw, 0));
    const basePrice = safeNumber(data.priceRaw, 0);

    const viralReason =
      vol > 10 ? 'Explosive social mentions matching price action.' : vol > 5 ? 'Steady increase in retail discussions.' : 'Volume is normal relative to historicals.';

    const whales = [];
    if (vol > 5) whales.push({ action: isBullish ? 'Accumulating' : 'Dumping', time: '2h ago', size: 'High' });
    whales.push({ action: 'Holding', time: '12h ago', size: 'Medium' });

    const entry = basePrice > 0 ? (basePrice * (isBullish ? 0.98 : 1.02)).toFixed(basePrice < 1 ? 4 : 2) : 'N/A';
    const stop = basePrice > 0 ? (basePrice * (isBullish ? 0.9 : 1.1)).toFixed(basePrice < 1 ? 4 : 2) : 'N/A';
    const target = basePrice > 0 ? (basePrice * (isBullish ? 1.15 : 0.85)).toFixed(basePrice < 1 ? 4 : 2) : 'N/A';

    const sentiment = isBullish
      ? 'Euphoric. Retail is chasing green candles. Institutional flows are steady.'
      : 'Fearful. Retail is panic selling. Smart money is waiting for support.';

    const trends = isBullish ? ['AI & Compute', 'Memes'] : ['Stablecoins', 'Defensive Assets'];
    const catalysts = ['Upcoming Earnings/Unlock', 'Sector Rotation'];

    return { viralReason, whales, entry, stop, target, sentiment, trends, catalysts };
  };

  const tradingViewSymbol = getTradingViewSymbol(ticker);
  const dexChartUrl = selectedPair?.pairAddress && selectedPair?.chainId
    ? `https://dexscreener.com/${selectedPair.chainId}/${selectedPair.pairAddress}?embed=1&theme=dark&trades=0&info=0`
    : null;

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-emerald-500/30 pb-20">
      <div className="bg-slate-900 border-b border-slate-800 h-10 overflow-hidden relative z-50">
        <iframe
          id="tv-ticker-tape"
          title="TradingView ticker tape"
          src={TOP_TICKER_TAPE_SRC}
          className="h-full w-full border-0 bg-slate-950"
          loading="lazy"
          onLoad={() => setTopWidgetOffline(false)}
          onError={() => setTopWidgetOffline(true)}
          referrerPolicy="strict-origin-when-cross-origin"
        />
        {topWidgetOffline && (
          <div className="absolute inset-0 flex items-center bg-slate-950/95 text-slate-300 text-xs font-semibold overflow-hidden whitespace-nowrap">
            <div className="animate-finance-ticker inline-flex items-center">
              {TOP_TICKER_FALLBACK_ITEMS.concat(TOP_TICKER_FALLBACK_ITEMS).map((item, idx) => (
                <span key={`${item}-${idx}`} className="mx-6 inline-flex items-center gap-2">
                  <WifiOff className="w-3 h-3 text-amber-400" />
                  <span>{item}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 p-4 sticky top-0 z-40 shadow-xl" role="banner">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('HOME')}>
            <div className="bg-emerald-500 rounded-lg p-2">
              <Newspaper className="w-6 h-6 text-slate-900" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-none hidden sm:block">
                Daily<span className="text-emerald-400">Disspatch</span>
              </h1>
              <span className="text-[10px] text-slate-500 tracking-wider hidden sm:block">FINANCE & INTELLIGENCE</span>
            </div>
          </div>

          <form className="flex-1 max-w-xl mx-4 relative group" ref={wrapperRef} role="search" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="finance-search" className="sr-only">Search live crypto pairs</label>
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
            </div>
            <input
              id="finance-search"
              type="text"
              autoComplete="off"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0) setShowDropdown(true);
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-600"
              placeholder="Search live crypto pairs (BTC, SOL, BONK)..."
            />
            {isSearching && <Loader2 className="absolute right-3 top-2.5 w-4 h-4 text-slate-500 animate-spin" />}
            {showDropdown && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
                {suggestions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectToken(item)}
                    className="w-full text-left px-4 py-3 hover:bg-slate-800 transition-colors flex items-center gap-3 border-b border-slate-800 last:border-0"
                  >
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.symbol} className="w-6 h-6 rounded-full" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[8px] font-bold">{item.symbol[0]}</div>
                    )}
                    <div>
                      <span className="font-bold text-white text-sm block">{item.name}</span>
                      <span className="text-xs text-slate-500 uppercase">{item.symbol} / {item.quoteSymbol || 'USD'}</span>
                    </div>
                    <span className="ml-auto text-[10px] bg-emerald-900 text-emerald-300 px-1.5 py-0.5 rounded uppercase">{item.chainId}</span>
                  </button>
                ))}
              </div>
            )}
          </form>

          <button
            onClick={() => setIsProMode(!isProMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs transition-all ${isProMode ? 'bg-amber-500/10 text-amber-400 border border-amber-500/50' : 'bg-slate-800 text-slate-400'
              }`}
          >
            {isProMode ? <Gem className="w-3 h-3 fill-current" /> : <Unlock className="w-3 h-3" />}
            {isProMode ? 'PRO' : 'FREE'}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6 mt-2">
        {view === 'HOME' && (
          <div className="space-y-8 animate-fade-in">
            <div className="h-[200px] w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-2 relative">
              <iframe
                id="tv-market-overview"
                title="TradingView market overview"
                src={MARKET_OVERVIEW_SRC}
                className="h-full w-full border-0"
                loading="lazy"
                onLoad={() => setOverviewWidgetOffline(false)}
                onError={() => setOverviewWidgetOffline(true)}
                referrerPolicy="strict-origin-when-cross-origin"
              />
              {overviewWidgetOffline && (
                <div className="absolute inset-2 rounded-xl border border-slate-700 bg-slate-900 flex flex-col items-center justify-center gap-2 text-center">
                  <WifiOff className="w-5 h-5 text-amber-400" />
                  <p className="text-sm font-semibold text-slate-200">Live market overview is temporarily offline.</p>
                  <p className="text-xs text-slate-500">Core scanners and search still work below.</p>
                </div>
              )}
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
                <ScannerButton icon={<TrendingUp className="w-6 h-6" />} title="Viral Pairs" active={activeScan === 'VIRAL_STOCKS'} onClick={() => runScanner('VIRAL_STOCKS')} color="emerald" />
                <ScannerButton icon={<Rocket className="w-6 h-6" />} title="Moon Bag (Solana)" active={activeScan === 'MOON_BAG'} onClick={() => runScanner('MOON_BAG')} color="purple" />
                <ScannerButton icon={<Flame className="w-6 h-6" />} title="High Volatility" active={activeScan === 'VOLATILITY'} onClick={() => runScanner('VOLATILITY')} color="orange" />
                <ScannerButton icon={<BarChart3 className="w-6 h-6" />} title="Txn Flow" active={activeScan === 'STOCKS_OPTIONS'} onClick={() => runScanner('STOCKS_OPTIONS')} color="blue" />
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
                  {scannerResults.map((item) => {
                    const changeValue = safeNumber(item.price_change_percentage_24h, 0);
                    const currentPrice = safeNumber(item.current_price, 0);
                    const hasScore = item.score !== undefined && item.score !== null;
                    const scanScore = safeNumber(item.score, 0);

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelectToken(item)}
                        className="p-4 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 cursor-pointer transition-all group"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${changeValue >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                              }`}
                          >
                            {item.symbol ? item.symbol[0] : '?'}
                          </div>
                          <div
                            className={`text-xs font-bold px-2 py-1 rounded bg-slate-900 ${changeValue >= 0 ? 'text-emerald-400' : 'text-rose-400'
                              }`}
                          >
                            {changeValue >= 0 ? '+' : ''}
                            {changeValue.toFixed(2)}%
                          </div>
                        </div>
                        <div className="font-bold text-white group-hover:text-emerald-400 truncate">{item.name}</div>
                        <div className="text-xs text-slate-500 mb-2 flex justify-between">
                          <span>{item.symbol}</span>
                          {hasScore && (
                            <span className="text-purple-400 flex items-center gap-1">
                              <Rocket className="w-3 h-3" /> Score: {scanScore.toFixed(1)}
                            </span>
                          )}
                        </div>
                        <div className="font-mono text-sm">${currentPrice < 0.01 ? currentPrice.toFixed(6) : currentPrice.toFixed(2)}</div>
                      </div>
                    );
                  })}
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

              <aside className="lg:col-span-4 space-y-6" aria-label="Finance Sidebar">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <h3 className="font-bold text-sm text-slate-400 uppercase mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Trending Tickers
                  </h3>
                  <div className="space-y-1">
                    {trendingPairs.length > 0 ? (
                      trendingPairs.map((pair) => (
                        <TickerRow
                          key={pair.id}
                          symbol={pair.symbol}
                          name={`${pair.name} (${pair.chainId})`}
                          price={pair.current_price < 1 ? pair.current_price.toFixed(4) : pair.current_price.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                          change={`${pair.price_change_percentage_24h >= 0 ? '+' : ''}${pair.price_change_percentage_24h.toFixed(2)}%`}
                          isUp={pair.price_change_percentage_24h >= 0}
                          onClick={() => handleSelectToken(pair)}
                        />
                      ))
                    ) : (
                      <div className="text-xs text-slate-500 px-2 py-3">Loading live pairs...</div>
                    )}
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

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
                  <div className="text-[10px] text-slate-500 uppercase mb-2">Market Snapshot</div>
                  <div className="rounded-lg border border-slate-700 bg-slate-950 p-4 text-left space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Tracked Pairs</span>
                      <span className="text-white font-mono">{marketSnapshot.totalPairs}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Avg 24h Move</span>
                      <span className={`font-mono ${marketSnapshot.avgChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {marketSnapshot.avgChange >= 0 ? '+' : ''}
                        {marketSnapshot.avgChange.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Top Volume</span>
                      <span className="text-white font-mono">{marketSnapshot.leaderSymbol}</span>
                    </div>
                    <div className="text-xs text-slate-500">24h Volume: {formatCompactUsd(marketSnapshot.leaderVolume)}</div>
                  </div>
                </div>
              </aside>
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
                    className={`px-4 py-2 rounded-full font-bold text-sm border flex items-center gap-2 ${liveData.isUp ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'
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
                {selectedPair?.url && (
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Live data source: DexScreener</span>
                    <a href={selectedPair.url} target="_blank" rel="noreferrer" className="text-emerald-400 hover:text-emerald-300 font-bold">
                      Open Pair
                    </a>
                  </div>
                )}
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden h-[500px] shadow-lg relative">
                {loading && (
                  <div className="absolute inset-0 z-10 bg-slate-900 flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                  </div>
                )}
                {chartErrorMsg && !loading && (
                  <div className="absolute inset-0 z-10 bg-slate-900/95 flex items-center justify-center p-6 text-center">
                    <div className="max-w-sm">
                      <AlertCircle className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                      <p className="text-sm font-semibold text-slate-200">{chartErrorMsg}</p>
                    </div>
                  </div>
                )}
                {tradingViewSymbol ? (
                  <div id="tradingview_widget" className="w-full h-full"></div>
                ) : dexChartUrl ? (
                  <iframe
                    title={`${liveData.symbol} dex chart`}
                    src={dexChartUrl}
                    className="w-full h-full border-0"
                    loading="lazy"
                    allow="clipboard-write"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">
                    No live chart is available for this token yet.
                  </div>
                )}
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
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${news.type === 'Bullish'
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
                            <div className="text-white font-mono text-sm">{aiInsights.entry === 'N/A' ? 'N/A' : `$${aiInsights.entry}`}</div>
                          </div>
                          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                            <div className="text-red-400 text-xs font-bold uppercase mb-1">Stop Loss</div>
                            <div className="text-white font-mono text-sm">{aiInsights.stop === 'N/A' ? 'N/A' : `$${aiInsights.stop}`}</div>
                          </div>
                          <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                            <div className="text-purple-400 text-xs font-bold uppercase mb-1">Target</div>
                            <div className="text-white font-mono text-sm">{aiInsights.target === 'N/A' ? 'N/A' : `$${aiInsights.target}`}</div>
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
                            className={`p-3 rounded-lg border flex items-center gap-3 ${risk.type === 'Safe' ? 'bg-green-500/10 border-green-500/30 text-green-300' : 'bg-red-500/10 border-red-500/30 text-red-300'
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
        @keyframes finance-ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-finance-ticker {
          animation: finance-ticker 26s linear infinite;
        }
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
    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${active ? scannerColorClasses[color] : 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300'
      }`}
  >
    {icon}
    <span className="text-xs font-bold">{title}</span>
  </button>
);

const TabButton = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1 px-4 py-3 text-[10px] font-bold transition-all border-b-2 min-w-[70px] ${active ? 'border-emerald-500 text-white bg-slate-800' : 'border-transparent text-slate-500 hover:text-slate-300'
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

const TickerRow = ({ symbol, name, price, change, isUp, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full text-left flex items-center justify-between p-3 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors group"
  >
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400 group-hover:text-white group-hover:bg-slate-700 transition-colors">
        {symbol[0]}
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
  </button>
);

export default FinancePage;
