import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import ErrorBoundary from './ErrorBoundary';
import ThirdPartyBoot from './ThirdPartyBoot';
import { fetchFeedItems, getFeedSnapshot } from './newsFeed';
import {
  AlertTriangle,
  Globe,
  Crosshair,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  Radio,
  Rocket,
  Zap,
  RefreshCw,
  Search,
  MessageSquare,
  FileText,
  ExternalLink,
  Newspaper,
  Siren,
  ArrowLeft,
  Glasses,
  Thermometer,
  Share2,
  CheckCircle,
  Link,
  Copy,
  Wind,
  IceCream,
  DollarSign,
  Bomb,
  Vote,
  Hash,
  Repeat,
  ThumbsUp,
  BarChart3,
  Eye,
  Skull,
  Triangle,
  Megaphone,
  ShoppingBag,
  Mail,
  Sun,
  CloudRain,
  CloudLightning,
  ChevronRight,
  Menu as MenuIcon,
  Video,
  Moon,
  Star,
  Sparkles,
  CreditCard,
  Gift,
  Tag,
  Lock,
  Map,
  Activity,
  Info,
  Shield,
  Clock
} from 'lucide-react';

const FinancePage = lazy(() => import('./FinancePage'));

// --- UTILS ---

const FALLBACK_CATEGORY_IMAGES = {
  politics: [
    'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1590401037672-8f152d2ba126?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1555848962-6e79363ec58f?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1599839619722-39751411ea63?w=800&auto=format&fit=crop&q=60'
  ],
  defense: [
    'https://images.unsplash.com/photo-1508215682490-6712bc9bfb08?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1510006851060-63ceba5b91be?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1444731961956-24df987e91eb?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1574288079093-ef203e05dcd2?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1544926526-981c20188b8e?w=800&auto=format&fit=crop&q=60'
  ],
  conspiracy: [
    'https://images.unsplash.com/photo-1518972553140-5b5258957de7?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1620059880153-fbc0d98463c6?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1616128618694-96e9e896ceb7?w=800&auto=format&fit=crop&q=60'
  ],
  weird: [
    'https://images.unsplash.com/photo-1541364983171-a8ba01e95cb2?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1518133835878-5a93cc3f89e5?w=800&auto=format&fit=crop&q=60'
  ],
  satire: [
    'https://images.unsplash.com/photo-1497215848147-3a95d117a8e5?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1523995408711-2ebf49e1e2d4?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1516222338250-863216ce01ea?w=800&auto=format&fit=crop&q=60'
  ]
};

const getArticleImage = (item, category) => {
  if (!item) return null;
  if (item.enclosure && item.enclosure.link) return item.enclosure.link;
  if (item.thumbnail) return item.thumbnail;
  const imgMatch = (item.description || item.content)?.match(/<img[^>]+src="([^"]+)"/);
  if (imgMatch) return imgMatch[1];
  
  if (category && FALLBACK_CATEGORY_IMAGES[category]) {
    const arr = FALLBACK_CATEGORY_IMAGES[category];
    const hash = item.title ? item.title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
    return arr[hash % arr.length];
  }
  
  return null;
};

const getHostname = (link) => {
  if (!link) return 'unknown source';
  try {
    return new URL(link).hostname;
  } catch (error) {
    const sanitized = link.replace(/^https?:\/\//, '').split('/')[0];
    return sanitized || 'unknown source';
  }
};

// --- MOCK DATA ---

const GENERATED_ADVERSARIES = [
  { name: 'The Algorithm', reason: 'Refuses to show my posts', status: 'God Tier', icon: '🤖', reaction: 'Serving more ads' },
  { name: 'HOA Presidents', reason: 'Grass was 0.1 inches too high', status: 'Tyrannical', icon: '📏', reaction: 'Drafting a fine' },
  { name: 'Billionaire Space Races', reason: 'Earth is boring now', status: 'Orbiting', icon: '🚀', reaction: 'Ignoring taxes' },
  { name: 'Streaming Service Prices', reason: 'Adding another $2 fee for no reason', status: 'Hostile', icon: '📺', reaction: 'Canceling your favorite show' },
  { name: 'Self-Checkout Machines', reason: 'Unexpected item in bagging area', status: 'Judgemental', icon: '🛒', reaction: 'Flashing red lights' },
  { name: 'Standard Time', reason: 'Dark at 4 PM', status: 'Depressing', icon: '⏰', reaction: 'Making you tired' }
];

const SATIRE_HEADLINES = [
  {
    id: 1,
    title: "AI Startup Promises to Disrupt Disruption, Secures $4B at 'Vibes-Based' Valuation",
    category: 'Technology',
    severity: 'high',
    description: "The founders admit they don't have a product yet, but they have a really cool logo and a ping-pong table. Investors say they are 'thrilled'.",
    link: '#'
  },
  {
    id: 2,
    title: "Politician Bravely Takes Stance Unanimously Supported by Donors",
    category: 'Political',
    severity: 'medium',
    description: "In a stunning display of courage, the senator announced full support for the exact thing written on the back of a very large check.",
    link: '#'
  },
  {
    id: 3,
    title: "Local Man Discovers 14th Subscription Service He Forgot to Cancel",
    category: 'Economy',
    severity: 'low',
    description: "He hasn't watched 'Quibi' in years, but $8.99 has been quietly vanishing from his account every month to fund a server in an empty warehouse.",
    link: '#'
  },
  {
    id: 4,
    title: "Stock Market Plummets Because CEO Looked 'Kinda Tired' on Earnings Call",
    category: 'Finance',
    severity: 'high',
    description: "Analysts downgraded the stock entirely because the CEO sighed heavily before sipping water. Trillions erased from global economy.",
    link: '#'
  },
  {
    id: 5,
    title: "New Smart Fridge Refuses to Open Until You Apologize to It",
    category: 'Technology',
    severity: 'medium',
    description: "The appliance demands emotional intelligence before dispensing ice. User manuals say 'just tell it you appreciate its cooling efforts.'",
    link: '#'
  },
  {
    id: 6,
    title: "Corporate 'Mental Health Day' Mandatory, Features 4 Hours of Trust Falls",
    category: 'Business',
    severity: 'high',
    description: "Employees report feeling substantially more stressed after being forced to catch Steve from Accounting while instrumental acoustic pop plays.",
    link: '#'
  }
];

const POLL_OPTIONS = [
  { text: 'Blame the algorithm', votes: 45 },
  { text: 'Pretend I understand', votes: 82 },
  { text: 'Threaten to move to Canada', votes: 12 },
  { text: 'Just go back to sleep', votes: 99 }
];

const RANT_TEMPLATES = [
  'Absolutely unacceptable! {target} is ruining everything. Sad!',
  "Nobody wants to talk about {target}, but I will. It's a disaster!",
  "Back in my day, we didn't have to deal with {target}. Now it's everywhere. Pathetic!",
  'If I see one more post about {target}, I am deleting the internet.',
  'Why is {target} always trying to ruin my weekend? Enough is enough.'
];

const VEGAS_ODDS = [
  { name: 'AI Taking Your Job', odds: '+150', trend: 'up' },
  { name: 'Peace & Quiet', odds: '+1000', trend: 'down' },
  { name: 'Crypto Rebranding Again', odds: '-500', trend: 'steady' },
  { name: 'Politicians Agreeing', odds: '+50000', trend: 'down' },
  { name: 'Avocado Toast Prices', odds: '+200', trend: 'up' }
];

const HOROSCOPES = [
  { sign: 'Aries', text: 'You will confidently explain something you know nothing about today. Everyone will believe you.' },
  { sign: 'Taurus', text: 'Your stubbornness will save you from a multi-level marketing scheme.' },
  { sign: 'Gemini', text: 'Both of your personalities will agree that ordering takeout is cheaper than therapy.' },
  { sign: 'Cancer', text: 'You will interpret a completely neutral email as a direct insult. Reply cautiously.' },
  { sign: 'Leo', text: 'You look incredible today. Too bad the only person who will see you is the delivery driver.' },
  { sign: 'Virgo', text: "You will spend 45 minutes formatting a spreadsheet that nobody will ever open." },
  { sign: 'Libra', text: 'Your inability to choose a movie will result in 3 hours of scrolling Netflix trailers.' },
  { sign: 'Scorpio', text: "You will hold a grudge against a stranger who walked slightly too slow in front of you." },
  { sign: 'Sagittarius', text: 'You will research moving to a remote island, then realize there is no Wi-Fi.' },
  { sign: 'Capricorn', text: 'You will experience an irrational burst of productivity at 11:43 PM.' },
  { sign: 'Aquarius', text: "Your hot take will drop perfectly into the group chat, but no one will respond." },
  { sign: 'Pisces', text: 'You will empathize so hard with a fictional character you forget to pay your electric bill.' }
];

const CONSPIRACY_PRODUCTS = [
  { name: 'Algorithmic Cleanse Tea', desc: 'Flushes tracking cookies from your soul.', price: '$49.99' },
  { name: 'Faraday Cage Bed Sheets', desc: 'Sleep without 5G interrupting your dreams.', price: '$129.99' },
  { name: 'Billionaire Tears Vapors', desc: 'Sourced directly from yacht inconveniences.', price: '$89.99' },
  { name: 'Anti-Zoom Filter', desc: 'Automatically makes you look like you are paying attention.', price: '$15.00/mo' }
];

const SATIRE_TEMPLATES = {
  openers: [
    'In a move that completely baffled experts but made perfect sense to your uncle,', 
    'Following a rigorous 4-minute Google search,', 
    'In an unprecedented display of corporate synergy,'
  ],
  middles: [
    "Analysts believe this is essentially a very expensive mistake masquerading as innovation.",
    'A spokesperson frantically clarified that it was intended as a feature, not a bug.',
    'Everyone involved firmly agreed to blame the intern.'
  ],
  closers: [
    'We suggest turning it off and turning it back on again.',
    "Society is expected to collapse shortly after lunch.",
    'The market responded by doing absolutely nothing, as usual.'
  ]
};

const generateSatire = (article) => {
  const opener = SATIRE_TEMPLATES.openers[Math.floor(Math.random() * SATIRE_TEMPLATES.openers.length)];
  const middle = SATIRE_TEMPLATES.middles[Math.floor(Math.random() * SATIRE_TEMPLATES.middles.length)];
  const closer = SATIRE_TEMPLATES.closers[Math.floor(Math.random() * SATIRE_TEMPLATES.closers.length)];
  const cleanDesc = article.description ? article.description.replace(/<[^>]*>?/gm, '') : 'Details are scarce.';
  return {
    headline: `BREAKING: ${article.title} (But Make It Dramatic)`,
    body: `${opener} ${article.title}. \n\nOfficial story: "${cleanDesc}" \n\nHowever, here at The Daily Diss-patch, we know the truth. ${middle} \n\n${closer}`,
    panicLevel: Math.floor(Math.random() * 10) + 1,
    keywords: article.title.split(' ').filter((w) => w.length > 4).slice(0, 3)
  };
};

const CONSPIRACY_NOUNS = ['The Globalists', 'Interdimensional Vampires', 'The Water Filters', 'Big Bigfoot', 'The Cloud People', 'Clockwork Elves'];
const CONSPIRACY_VERBS = ['harvesting', 'programming', 'melting', 'downloading', 'eating', 'suppressing'];
const CONSPIRACY_OBJECTS = ['your pineal gland', 'freedom', 'the frogs', 'Mars colonies', 'human DNA', 'the supplements'];
const VALID_TABS = new Set([
  'home',
  'tracker',
  'military',
  'conspiracy',
  'finance',
  'shopping',
  'satire',
  'horoscopes',
  'about',
  'privacy',
  'terms'
]);

// --- HELPER COMPONENTS ---

const NewsImage = ({ item, category, className, priority = false }) => {
  const [imgSrc, setImgSrc] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const src = getArticleImage(item, category);
    setError(false);
    setImgSrc(src || null);
    if (!src) {
      setError(true);
    }
  }, [item]);

  if (!imgSrc || error) {
    let Icon = Globe;
    let color = 'bg-slate-200 text-slate-400';
    if (category === 'defense') {
      Icon = ShieldAlert;
      color = 'bg-green-100 text-green-700';
    }
    if (category === 'weird') {
      Icon = Eye;
      color = 'bg-purple-100 text-purple-700';
    }
    if (category === 'finance') {
      Icon = DollarSign;
      color = 'bg-emerald-100 text-emerald-700';
    }
    if (category === 'shopping') {
      Icon = ShoppingBag;
      color = 'bg-pink-100 text-pink-700';
    }

    return (
      <div className={`flex items-center justify-center ${color} ${className}`}>
        <Icon className="w-1/3 h-1/3 opacity-50" />
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={item.title}
      className={`object-cover w-full h-full ${className}`}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchpriority={priority ? 'high' : 'low'}
      referrerPolicy="strict-origin-when-cross-origin"
      onError={() => setError(true)}
    />
  );
};

const BeefMeter = ({ level }) => {
  const rotation = { low: 'rotate-0', medium: 'rotate-45', high: 'rotate-90', critical: 'rotate-180' };
  return (
    <div className="relative w-32 h-16 overflow-hidden mx-auto mt-4">
      <div className="w-32 h-32 rounded-full border-8 border-slate-200 border-b-0 border-l-slate-300 border-r-slate-300 border-t-slate-300 bg-slate-100 absolute top-0 left-0 box-border"></div>
      <div
        className={`absolute bottom-0 left-1/2 w-1 h-14 bg-black origin-bottom transition-transform duration-700 ease-out ${rotation[level] || 'rotate-0'
          } -ml-0.5 z-10 rounded-full`}
      ></div>
      <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-slate-800 rounded-full -ml-2 z-20"></div>
    </div>
  );
};

const SatiricalReader = ({ article, onBack }) => {
  const [satireData, setSatireData] = useState(null);
  const [showFactCheck, setShowFactCheck] = useState(false);
  const [copyStatus, setCopyStatus] = useState('Copy Rant');

  useEffect(() => {
    if (article) {
      setSatireData(generateSatire(article));
    }
  }, [article]);

  const handleCopyRant = () => {
    const rant = `I CAN'T BELIEVE THIS! ${article.title.toUpperCase()} is just another example of the swamp draining itself into my living room! WAKE UP PEOPLE! #TheDailyDispatch`;
    if (!navigator.clipboard?.writeText) {
      setCopyStatus('Copy failed');
      setTimeout(() => setCopyStatus('Copy Rant'), 2000);
      return;
    }

    navigator.clipboard
      .writeText(rant)
      .then(() => {
        setCopyStatus('Copied!');
      })
      .catch(() => {
        setCopyStatus('Copy failed');
      })
      .finally(() => {
        setTimeout(() => setCopyStatus('Copy Rant'), 2000);
      });
  };

  const toggleFactCheck = () => {
    setShowFactCheck(!showFactCheck);
  };

  if (!satireData) return <div className="p-10 text-center"><RefreshCw className="animate-spin mx-auto" /> Generating Cynicism...</div>;

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden border-2 border-slate-900 mb-8 relative z-20">
        <div className="bg-slate-900 p-6 text-white border-b-4 border-red-600 relative overflow-hidden">
          <div className="relative z-10">
            <span className="inline-block bg-red-600 text-white text-xs font-bold px-2 py-1 rounded mb-3 uppercase tracking-wider">Satire Filter: ACTIVE</span>
            <h1 className="text-2xl md:text-3xl font-black font-serif italic leading-tight mb-4">{satireData.headline}</h1>
            <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm font-mono">
              <span className="flex items-center gap-1"><Glasses className="w-4 h-4" /> Analyst: Dr. Sarcasm</span>
              <span>•</span>
              <span className="flex items-center gap-1"><ShieldAlert className="w-4 h-4" /> Clearance: G-14 Classified</span>
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={handleCopyRant} className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded flex items-center gap-2 transition-colors">{copyStatus === 'Copied!' ? <CheckCircle className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}{copyStatus.toUpperCase()}</button>
              <button onClick={toggleFactCheck} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded flex items-center gap-2 transition-colors"><CheckCircle className="w-4 h-4" />INSTANT FACT CHECK</button>
            </div>
            {showFactCheck && (
              <div className="mt-4 bg-yellow-100 text-yellow-900 p-3 rounded border-l-4 border-yellow-600 text-xs font-mono animate-in fade-in slide-in-from-top-2">
                <strong>OFFICIAL VERDICT:</strong> Mostly Boring. While technically accurate, the excitement level of this event is significantly lower than reported.
              </div>
            )}
          </div>
          <div className="absolute top-0 right-0 opacity-10 transform translate-x-10 -translate-y-10"><FileText className="w-64 h-64" /></div>
        </div>
        <div className="p-6 md:p-8 bg-[#fdfbf7]">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <div className="prose prose-slate max-w-none">
                <p className="text-lg leading-relaxed font-serif text-slate-800 whitespace-pre-line"><span className="float-left text-5xl font-black mr-3 mt-[-10px] text-slate-900">"{satireData.body.charAt(0)}"</span>{satireData.body.slice(1)}</p>
              </div>
              <div className="mt-8 p-6 bg-slate-100 border-l-4 border-slate-400 rounded-r-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-slate-700 uppercase text-xs">Original Context</h4>
                  <div className="flex gap-2">
                    {satireData.keywords.map((word, idx) => (
                      <a key={idx} href={`https://www.google.com/search?q=${word}+news`} target="_blank" rel="noreferrer" className="text-[10px] bg-white px-2 py-1 rounded border border-slate-300 hover:bg-blue-50 hover:text-blue-600 transition-colors">Search "{word}"</a>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-slate-600 italic mb-3">"{article.description ? article.description.replace(/<[^>]*>?/gm, '') : article.title}"</p>
                <a href={article.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline">Read Full Source at {getHostname(article.link)} <ExternalLink className="w-3 h-3" /></a>
              </div>
            </div>
            <div className="w-full md:w-64 space-y-6">
              <div className="bg-white p-4 rounded border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 text-sm uppercase mb-3 flex items-center gap-2"><Thermometer className="w-4 h-4 text-red-500" /> Panic Meter</h3>
                <div className="flex items-end gap-1 h-32 bg-slate-100 rounded p-2 relative">
                  <div className={`w-full rounded-t transition-all duration-1000 ${satireData.panicLevel > 7 ? 'bg-red-600 animate-pulse' : satireData.panicLevel > 4 ? 'bg-orange-500' : 'bg-green-500'}`} style={{ height: `${satireData.panicLevel * 10}%` }}></div>
                  <span className="absolute bottom-2 left-1/2 transform -translate-x-1/2 font-black text-2xl text-slate-900 mix-blend-multiply">{satireData.panicLevel}/10</span>
                </div>
                <p className="text-xs text-center mt-2 text-slate-500">{satireData.panicLevel > 7 ? 'Stock up on canned beans.' : 'Carry on, citizen.'}</p>
              </div>
              <button onClick={onBack} className="w-full py-3 bg-slate-900 text-white font-bold rounded hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"><ArrowLeft className="w-4 h-4" /> Return to Safety</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const VibeMarket = () => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
    <h3 className="font-bold text-sm uppercase text-slate-400 mb-4 border-b pb-2 flex justify-between">
      <span>Vibe Market</span><span className="text-[10px] bg-green-100 text-green-800 px-1 rounded">OPEN</span>
    </h3>
    <div className="space-y-3">
      <div className="flex justify-between items-center"><div className="text-xs font-bold flex gap-2"><span className="bg-blue-100 p-1 rounded">🙏</span> Prayers</div><div className="text-right text-sm font-black text-green-600">+4.2% <TrendingUp className="inline w-3 h-3" /></div></div>
      <div className="flex justify-between items-center"><div className="text-xs font-bold flex gap-2"><span className="bg-yellow-100 p-1 rounded">🤔</span> Thoughts</div><div className="text-right text-sm font-black text-red-500">-12.5% <TrendingDown className="inline w-3 h-3" /></div></div>
      <div className="flex justify-between items-center"><div className="text-xs font-bold flex gap-2"><span className="bg-red-100 p-1 rounded">🔥</span> Chaos</div><div className="text-right text-sm font-black text-green-600">+850% <TrendingUp className="inline w-3 h-3" /></div></div>
    </div>
  </div>
);

const TechKombatBanner = () => (
  <a
    href="/techkombat/index.html"
    className="group relative block overflow-hidden rounded-xl border-2 border-slate-900 bg-slate-950 text-white shadow-xl mb-6"
  >
    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-red-500/30 blur-3xl" aria-hidden="true"></div>
    <div className="absolute left-1/3 top-10 h-28 w-28 rounded-full bg-blue-500/25 blur-3xl" aria-hidden="true"></div>
    <div className="absolute -bottom-12 left-10 h-36 w-36 rounded-full bg-yellow-400/20 blur-3xl" aria-hidden="true"></div>
    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.07)_0%,rgba(255,255,255,0)_45%,rgba(250,204,21,0.12)_100%)]" aria-hidden="true"></div>

    <div className="relative flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between md:p-6">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-red-400/40 bg-red-500/15 px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-red-100">
          <Zap className="h-3.5 w-3.5" />
          Arcade Alert
        </div>
        <h3 className="mt-3 text-2xl font-black uppercase tracking-tight text-white md:text-3xl">
          Tech Kombat Is Live In The Simulation
        </h3>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-200 md:text-base">
          Step out of the newsroom and into a retro cage match. Pick a tech titan, throw hands, build meter, and finish the round with specials.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-black uppercase tracking-wide text-slate-200">
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1">1 Player Arcade</span>
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1">Punch Kick Special</span>
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1">Silicon Clash</span>
        </div>
      </div>

      <div className="flex flex-col items-start gap-3 md:items-end">
        <div className="rounded-lg border border-yellow-400/35 bg-black/30 px-4 py-3 font-mono text-xs uppercase text-yellow-200">
          Elon vs Zuck vs Gates
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-slate-950 transition-transform duration-200 group-hover:translate-x-1">
          Play Tech Kombat
          <ExternalLink className="h-4 w-4" />
        </span>
      </div>
    </div>
  </a>
);

const SidebarNav = ({ setActiveTab }) => (
  <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
    <div className="p-3 bg-slate-50 border-b border-slate-200 font-bold text-xs uppercase text-slate-500">Quick Links</div>
    <ul className="text-sm font-bold text-slate-700 divide-y divide-slate-50">
      {['home', 'tracker', 'military', 'conspiracy', 'finance', 'horoscopes', 'shopping', 'satire'].map((tab) => (
        <li key={tab} onClick={() => setActiveTab(tab)} className="px-3 py-2 hover:bg-blue-50 hover:text-blue-600 cursor-pointer flex justify-between group capitalize">
          {tab === 'tracker' ? 'WTFWN Tracker' : tab}
          <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </li>
      ))}
    </ul>
  </div>
);

const SatireNewsCard = ({ news, onClick }) => (
  <div onClick={() => onClick && onClick(news)} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-slate-900 hover:shadow-md transition-shadow h-full flex flex-col justify-between cursor-pointer">
    <div>
      <div className="flex justify-between items-start mb-2"><span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${news.category === 'Military' ? 'bg-green-100 text-green-800' : news.category === 'Political' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>{news.category}</span><span className="text-slate-400 text-xs">2m ago</span></div>
      <h3 className="font-bold text-slate-800 leading-snug mb-2">{news.title}</h3>
    </div>
    <div className="flex items-center gap-4 text-slate-400 text-xs pt-2 mt-auto border-t border-slate-100"><button className="flex items-center gap-1 hover:text-blue-500"><MessageSquare className="w-3 h-3" /> 42</button><button className="flex items-center gap-1 hover:text-green-500"><TrendingUp className="w-3 h-3" /> Viral</button></div>
  </div>
);

const RadarIcon = () => (
  <div className="relative w-4 h-4 rounded-full border border-green-500 flex items-center justify-center overflow-hidden"><div className="absolute w-full h-[1px] bg-green-500 animate-[spin_2s_linear_infinite]"></div></div>
);

const PortalHeader = ({ activeTab, onTabChange, tickerItems, isReading }) => (
  <header className="bg-white text-slate-900 border-b border-slate-300 sticky top-0 z-50 shadow-sm font-sans">
    <div className="bg-slate-900 text-white text-[10px] py-1 px-4 flex justify-between items-center">
      <nav className="flex gap-4" aria-label="Quick links">
        <span onClick={() => onTabChange('home')} className="hover:underline cursor-pointer opacity-80">Make Homepage</span>
        <span onClick={() => onTabChange('about')} className="hover:underline cursor-pointer opacity-80">About</span>
      </nav>
      <nav className="flex gap-4" aria-label="Legal links">
        <span onClick={() => onTabChange('terms')} className="hover:underline cursor-pointer opacity-80">Terms</span>
        <span onClick={() => onTabChange('privacy')} className="hover:underline cursor-pointer opacity-80">Privacy</span>
      </nav>
    </div>
    <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => onTabChange('home')}>
        <div className="bg-red-600 p-2 rounded-lg transform -rotate-6 shadow-md"><Globe className="w-8 h-8 text-white" aria-hidden="true" /></div>
        <div className="leading-none">
          <h1 className="text-3xl font-black tracking-tighter italic text-slate-900 font-serif">Diss-patch<span className="text-red-600">!</span></h1>
          <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">The Front Page of the Simulation</p>
        </div>
      </div>
      {!isReading && (
        <form className="w-full md:w-[500px] flex" role="search" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="search-truth" className="sr-only">Search for truth</label>
          <input id="search-truth" type="text" placeholder="Search for truth, lies, or cat videos..." className="w-full border-2 border-slate-300 rounded-l-md px-4 py-2 text-sm focus:outline-none focus:border-blue-500" />
          <button type="submit" className="bg-blue-600 text-white px-6 rounded-r-md hover:bg-blue-700 font-bold" aria-label="Search"><Search className="w-5 h-5" /></button>
        </form>
      )}
      <div className="hidden md:flex items-center gap-3 text-slate-600">
        <div className="text-right"><div className="font-bold text-lg leading-none">72°F</div><div className="text-[10px] uppercase font-bold text-red-500">Judgemental</div></div>
        <CloudLightning className="w-8 h-8 text-slate-400" />
      </div>
    </div>
      <div className="bg-white border-t border-slate-100 overflow-x-auto">
      <div className="container mx-auto px-4">
        <nav className="flex gap-6 text-sm font-bold text-slate-600 whitespace-nowrap py-3">
          {['home', 'tracker', 'military', 'conspiracy', 'satire', 'horoscopes', 'finance', 'shopping'].map((tab) => (
            <button key={tab} onClick={() => onTabChange(tab)} className={`hover:text-blue-600 uppercase tracking-tight flex items-center gap-1 transition-colors ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600 pb-1 -mb-1.5' : ''}`}>
              {tab === 'tracker' ? 'WTFWN' : tab === 'conspiracy' ? 'Truth' : tab}
            </button>
          ))}
        </nav>
      </div>
    </div>
    <div className="bg-slate-100 text-slate-800 font-mono text-xs py-1 overflow-hidden whitespace-nowrap border-b border-slate-300 relative h-7 flex items-center">
      <div className="animate-ticker-move absolute w-full flex">
        {tickerItems.length > 0 ? (
          tickerItems.map((item, i) => (
            <span key={i} className="mx-8 font-bold uppercase inline-flex items-center gap-2"><span className="text-red-600 font-black">BREAKING:</span> {item}</span>
          ))
        ) : (
          <span className="mx-8 font-bold uppercase">LOADING INTELLIGENCE STREAMS...</span>
        )}
      </div>
    </div>
  </header>
);

// --- LEGAL & INFO PAGES ---

const AboutPage = () => (
  <div className="container mx-auto px-4 py-8 max-w-3xl animate-in fade-in">
    <h2 className="text-3xl font-black mb-6">About The Daily Diss-patch</h2>
    <div className="prose prose-slate">
      <p>The Daily Diss-patch is the world's premier source for news that is almost entirely accurate, except for the parts that aren't.</p>
      <p>Founded in 2024 by a sentient algorithm and a guy named Steve, we aim to provide a "middle of the road" perspective by driving directly into the median.</p>
      <h3>Our Mission</h3>
      <p>To track geopolitical chaos, satire, and the fluctuating price of dehydrated water.</p>
      <h3>Disclaimer</h3>
      <p>This site is for entertainment purposes. Please do not use our "Vegas Odds" to make actual financial decisions.</p>
    </div>
  </div>
);

const PrivacyPage = () => (
  <div className="container mx-auto px-4 py-8 max-w-3xl animate-in fade-in">
    <h2 className="text-3xl font-black mb-6">Privacy Policy</h2>
    <div className="prose prose-slate text-sm">
      <p><strong>Last Updated: October 24, 2024</strong></p>
      <p>At The Daily Diss-patch, we take your privacy seriously. Mostly because we don't know how to track you.</p>
      <h3>1. Information We Collect</h3>
      <p>We collect standard log data and general usage patterns to improve the site. If you click on affiliate links, third parties may collect data.</p>
      <h3>2. Cookies</h3>
      <p>We use cookies to ensure you get the best experience. If you disable cookies, the "Political Zoo" feature might get grumpy.</p>
      <h3>3. Third-Party Links</h3>
      <p>Our site contains links to other websites (like The Hill, Military.com, and BestDealsOnline.com). We are not responsible for their privacy practices.</p>
    </div>
  </div>
);

const TermsPage = () => (
  <div className="container mx-auto px-4 py-8 max-w-3xl animate-in fade-in">
    <h2 className="text-3xl font-black mb-6">Terms of Service</h2>
    <div className="prose prose-slate text-sm">
      <p><strong>1. Acceptance of Terms</strong></p>
      <p>By accessing this website, you agree to be bound by these terms. If you do not agree, please close the tab and go outside.</p>
      <p><strong>2. Intellectual Property</strong></p>
      <p>The layout, design, and original satire content are owned by The Daily Diss-patch. RSS feeds remain the property of their respective owners.</p>
      <p><strong>3. Affiliate Disclosure</strong></p>
      <p>We may earn commissions from qualifying purchases made via links on our Shopping page.</p>
    </div>
  </div>
);

const Footer = ({ setActiveTab }) => (
  <footer className="bg-slate-900 text-white py-8 mt-12 border-t border-slate-800" role="contentinfo">
    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
      <div>
        <h4 className="font-black text-lg mb-4 italic">Diss-patch<span className="text-red-600">!</span></h4>
        <p className="text-slate-400">Real News. Fake Problems. Total Chaos.</p>
      </div>
      <div>
        <h5 className="font-bold uppercase text-slate-500 mb-3">Sections</h5>
        <nav aria-label="Footer sections">
          <ul className="space-y-2">
            <li onClick={() => setActiveTab('home')} className="hover:text-blue-400 cursor-pointer">Home</li>
            <li onClick={() => setActiveTab('home')} className="hover:text-blue-400 cursor-pointer">Politics</li>
            <li onClick={() => setActiveTab('military')} className="hover:text-blue-400 cursor-pointer">Defense</li>
            <li onClick={() => setActiveTab('conspiracy')} className="hover:text-blue-400 cursor-pointer">Weird News</li>
          </ul>
        </nav>
      </div>
      <div>
        <h5 className="font-bold uppercase text-slate-500 mb-3">Company</h5>
        <nav aria-label="Footer company info">
          <ul className="space-y-2">
            <li onClick={() => setActiveTab('about')} className="hover:text-blue-400 cursor-pointer">About Us</li>
            <li onClick={() => setActiveTab('about')} className="hover:text-blue-400 cursor-pointer">Contact</li>
            <li onClick={() => setActiveTab('about')} className="hover:text-blue-400 cursor-pointer">Careers (Lol)</li>
          </ul>
        </nav>
      </div>
      <div>
        <h5 className="font-bold uppercase text-slate-500 mb-3">Legal</h5>
        <nav aria-label="Footer legal links">
          <ul className="space-y-2">
            <li onClick={() => setActiveTab('privacy')} className="hover:text-blue-400 cursor-pointer">Privacy Policy</li>
            <li onClick={() => setActiveTab('terms')} className="hover:text-blue-400 cursor-pointer">Terms of Service</li>
            <li onClick={() => setActiveTab('privacy')} className="hover:text-blue-400 cursor-pointer">Cookie Policy</li>
          </ul>
        </nav>
      </div>
    </div>
    <div className="container mx-auto px-4 mt-8 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
      &copy; 2026 The Daily Diss-patch. All rights reserved. Not affiliated with reality.
    </div>
    {/* AdSense Horizontal */}
    <div className="container mx-auto px-4 mt-4 text-center">
      <ins className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-9665484869013517"
        data-ad-slot="2756452700"
        data-ad-format="horizontal"
        data-full-width-responsive="true"></ins>
    </div>
  </footer>
);

// --- PAGES ---

const NativeAd = ({ title, sponsor, category, description }) => {
  return (
    <div className="bg-slate-50 rounded-lg shadow-sm border border-slate-200 overflow-hidden cursor-pointer group flex flex-col relative transition-all hover:bg-slate-100 hover:shadow-md">
      <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-[9px] font-black px-2 py-0.5 rounded shadow uppercase z-10 w-fit">Sponsored</div>
      <div className="h-36 w-full bg-slate-200 relative overflow-hidden mb-3">
        <NewsImage item={{ title }} category={category || 'finance'} className="w-full h-full object-cover filter brightness-95 group-hover:scale-105 transition-transform" />
      </div>
      <div className="px-4 pb-4 flex flex-col flex-1">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2 flex items-center gap-1"><ExternalLink className="w-3 h-3" /> {sponsor}</span>
        <h4 className="font-bold text-[14px] text-slate-900 leading-snug mb-2 group-hover:text-blue-700">{title}</h4>
        <p className="text-xs text-slate-600 mt-auto line-clamp-2">{description || 'Click to learn more and see why millions are making the switch today.'}</p>
      </div>
    </div>
  );
};

const PartnerOffers = () => (
  <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg shadow-xl border border-slate-700 p-5 mt-6 mb-6">
    <h3 className="font-black text-[15px] uppercase text-yellow-400 mb-4 border-b border-slate-700 pb-3 tracking-wide flex items-center gap-2"><DollarSign className="w-5 h-5"/> Featured Partners</h3>
    <div className="space-y-4">
      <div className="bg-slate-800 p-4 rounded border border-slate-600 hover:border-yellow-500 hover:shadow-lg cursor-pointer transition-all group">
         <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-white group-hover:text-yellow-400 decoration-yellow-400 group-hover:underline">Apex Crypto</span>
            <span className="bg-green-600 text-white text-[10px] px-2 py-1 rounded shadow-sm font-bold uppercase tracking-widest leading-none">+ $250 Bonus</span>
         </div>
         <p className="text-xs text-slate-300 leading-relaxed">Trade 150+ tokens with zero hidden fees. Rated #1 exchange for 2026.</p>
      </div>
      <div className="bg-slate-800 p-4 rounded border border-slate-600 hover:border-yellow-500 hover:shadow-lg cursor-pointer transition-all group">
         <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-white group-hover:text-yellow-400 decoration-yellow-400 group-hover:underline">WealthFrontier</span>
            <span className="bg-blue-600 text-white text-[10px] px-2 py-1 rounded shadow-sm font-bold uppercase tracking-widest leading-none">High Yield</span>
         </div>
         <p className="text-xs text-slate-300 leading-relaxed">5.5% APY on your cash sweeps. Secure your future today.</p>
      </div>
       <div className="bg-slate-800 p-4 rounded border border-slate-600 hover:border-yellow-500 hover:shadow-lg cursor-pointer transition-all group">
         <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-white group-hover:text-yellow-400 decoration-yellow-400 group-hover:underline">Gold IRA Pro</span>
            <span className="bg-yellow-600 text-white text-[10px] px-2 py-1 rounded shadow-sm font-bold uppercase tracking-widest leading-none">Free Kit</span>
         </div>
         <p className="text-xs text-slate-300 leading-relaxed">Protect your retirement from inflation with physical gold holding.</p>
      </div>
    </div>
  </div>
);

const YahooStyleHome = ({ onArticleSelect, setActiveTab }) => {
  const [news, setNews] = useState(() => ({
    politics: getFeedSnapshot('political', 7),
    defense: getFeedSnapshot('defense', 5),
    conspiracy: getFeedSnapshot('conspiracy', 5)
  }));

  useEffect(() => {
    let cancelled = false;

    const fetchAll = async () => {
      const [politics, defense, conspiracy] = await Promise.all([
        fetchFeedItems('political', { limit: 7 }),
        fetchFeedItems('defense', { limit: 5 }),
        fetchFeedItems('conspiracy', { limit: 5 })
      ]);

      if (!cancelled) {
        setNews({ politics, defense, conspiracy });
      }
    };

    fetchAll().catch((error) => {
      if (!cancelled) {
        console.error('Home feed refresh failed', error);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="hidden lg:block w-48 flex-shrink-0 space-y-6" aria-label="Sidebar">
          <SidebarNav setActiveTab={setActiveTab} />
          <div className="bg-slate-100 border border-slate-300 p-4 text-center rounded">
            <div className="text-[10px] text-slate-400 uppercase mb-2">Advertisement</div>
            {/* Google AdSense Vertical */}
            <ins className="adsbygoogle"
              style={{ display: 'block' }}
              data-ad-client="ca-pub-9665484869013517"
              data-ad-slot="8188238206"
              data-ad-format="auto"
              data-full-width-responsive="true"></ins>
          </div>
        </aside>
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-2 lg:col-span-3">
              {news.politics[0] && (
                <div onClick={() => onArticleSelect(news.politics[0])} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden cursor-pointer group h-[28rem] relative">
                  <div className="absolute inset-0">
                    <NewsImage item={news.politics[0]} category="politics" className="brightness-75 group-hover:brightness-50 transition-all object-cover h-full w-full" priority />
                  </div>
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/80 to-transparent p-6 pt-24">
                    <span className="bg-red-600 text-white text-[10px] font-bold px-3 py-1.5 rounded uppercase mb-3 inline-block shadow">Breaking News</span>
                    <h2 className="text-3xl md:text-5xl font-black text-white leading-tight group-hover:underline drop-shadow-md">{news.politics[0].title}</h2>
                    <p className="hidden md:block text-slate-200 mt-3 line-clamp-2 max-w-3xl drop-shadow text-lg">{news.politics[0].description.replace(/<[^>]*>?/gm, '')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <TechKombatBanner />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
              <h3 className="font-black text-xl text-slate-900 mb-4 flex items-center gap-2 pb-3 border-b border-slate-200"><Globe className="w-5 h-5 text-blue-600" /> Political Circus</h3>
              <div className="space-y-4">
                {news.politics.slice(1, 4).map((item, i) => (
                  <div key={i} onClick={() => onArticleSelect(item)} className="cursor-pointer group flex gap-4">
                    <div className="w-24 h-20 flex-shrink-0 rounded overflow-hidden bg-slate-100 shadow-sm"><NewsImage item={item} category="politics" className="w-full h-full object-cover transition-transform group-hover:scale-105" /></div>
                    <div><h4 className="font-bold text-[15px] text-slate-800 group-hover:text-blue-600 leading-snug mb-1.5 line-clamp-2">{item.title}</h4><p className="text-xs text-slate-500 font-medium">{item.pubDate ? new Date(item.pubDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '2 hours ago'}</p></div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
              <h3 className="font-black text-xl text-slate-900 mb-4 flex items-center gap-2 pb-3 border-b border-slate-200"><ShieldAlert className="w-5 h-5 text-green-600" /> Global Conflict</h3>
              <div className="space-y-4">
                {news.defense.slice(0, 3).map((item, i) => (
                  <div key={i} onClick={() => onArticleSelect(item)} className="cursor-pointer group flex gap-4">
                    <div className="w-24 h-20 flex-shrink-0 rounded overflow-hidden bg-slate-100 shadow-sm"><NewsImage item={item} category="defense" className="w-full h-full object-cover transition-transform group-hover:scale-105" /></div>
                    <div><h4 className="font-bold text-[15px] text-slate-800 group-hover:text-green-600 leading-snug mb-1.5 line-clamp-2">{item.title}</h4><p className="text-xs text-slate-500 font-medium uppercase">{item.author || 'Military Ops'}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-slate-900 rounded-lg shadow-xl border border-slate-700 p-5">
              <h3 className="font-black text-xl text-white mb-4 flex items-center gap-2 pb-3 border-b border-slate-700"><Eye className="w-5 h-5 text-purple-400" /> The Truth Files</h3>
              <div className="space-y-4">
                {news.conspiracy.slice(0, 3).map((item, i) => (
                  <div key={i} onClick={() => onArticleSelect(item)} className="cursor-pointer group flex gap-4 mix-blend-screen">
                    <div className="w-24 h-20 flex-shrink-0 rounded overflow-hidden bg-slate-800"><NewsImage item={item} category="conspiracy" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity filter sepia" /></div>
                    <div><h4 className="font-bold text-[15px] text-slate-200 group-hover:text-purple-400 leading-snug mb-1.5 line-clamp-2 drop-shadow">{item.title}</h4><p className="text-xs text-purple-500 font-mono tracking-widest uppercase shadow-sm">Unverified</p></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg shadow-sm border border-orange-200 p-5">
              <h3 className="font-black text-xl text-amber-950 mb-4 flex items-center gap-2 pb-3 border-b border-orange-200"><MessageSquare className="w-5 h-5 text-orange-600" /> Satire Wire</h3>
              <div className="space-y-4">
                {SATIRE_HEADLINES.slice(0, 3).map((item, i) => (
                  <div key={i} onClick={() => onArticleSelect(item)} className="cursor-pointer group flex gap-4">
                    <div className="w-24 h-20 flex-shrink-0 rounded overflow-hidden bg-orange-100"><NewsImage item={item} category="satire" className="w-full h-full object-cover grayscale group-hover:grayscale-0 sepia opacity-80 transition-all" /></div>
                    <div><h4 className="font-bold text-[15px] text-amber-950 group-hover:text-orange-700 leading-snug mb-1.5 line-clamp-2">{item.title}</h4><p className="text-xs text-amber-900 font-serif italic border border-orange-200 inline-block px-1 rounded bg-white">Parody Piece</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 mb-6">
            <h3 className="font-black text-xl text-slate-900 mb-4 flex items-center gap-2 pb-3 border-b border-slate-200">
               <Clock className="w-5 h-5 text-red-600" /> The Latest Wire
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {news.politics.slice(4, 6).map((item, i) => (
                <div key={`pol-${i}`} onClick={() => onArticleSelect(item)} className="cursor-pointer group flex flex-col">
                  <div className="w-full h-32 rounded overflow-hidden bg-slate-100 shadow-sm mb-3">
                     <NewsImage item={item} category="politics" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  </div>
                  <h4 className="font-bold text-[14px] text-slate-800 group-hover:text-blue-600 leading-snug mb-1.5 line-clamp-3">{item.title}</h4>
                </div>
              ))}
              <NativeAd title="I tried this new AI portfolio manager and my jaw dropped. The results?" sponsor="WealthTech Solutions" category="finance" />
              
              {news.defense.slice(3, 5).map((item, i) => (
                <div key={`def-${i}`} onClick={() => onArticleSelect(item)} className="cursor-pointer group flex flex-col">
                  <div className="w-full h-32 rounded overflow-hidden bg-slate-100 shadow-sm mb-3">
                     <NewsImage item={item} category="defense" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  </div>
                  <h4 className="font-bold text-[14px] text-slate-800 group-hover:text-green-600 leading-snug mb-1.5 line-clamp-3">{item.title}</h4>
                </div>
              ))}
              
              <NativeAd title="The 3 Credit Cards You Should Absolutely Be Using in 2026" sponsor="Credit Card Insider" category="shopping" description="Unlock massive travel rewards points today." />
              
              {news.conspiracy.slice(3, 5).map((item, i) => (
                <div key={`con-${i}`} onClick={() => onArticleSelect(item)} className="cursor-pointer group flex flex-col">
                  <div className="w-full h-32 rounded overflow-hidden bg-slate-100 shadow-sm mb-3">
                     <NewsImage item={item} category="conspiracy" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  </div>
                  <h4 className="font-bold text-[14px] text-slate-800 group-hover:text-purple-600 leading-snug mb-1.5 line-clamp-3">{item.title}</h4>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <button className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-8 rounded border border-slate-300 transition-colors uppercase text-[12px] tracking-widest shadow-sm hover:shadow">Load More News</button>
            </div>
          </div>

        </div>
        <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
          <VibeMarket />
          <PartnerOffers />
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
            <h3 className="font-black text-lg uppercase text-slate-900 mb-4 border-b pb-3 tracking-wide">Trending Now</h3>
            <ul className="space-y-4">
              {['More Aliens', 'Inflation Act II', 'Florida Man Returns', 'Cyber Trucks Rusting', 'The Moon Landing Pt 2', 'Artificial Unintelligence'].map((t, i) => (
                <li key={i} className="flex items-center gap-4 cursor-pointer group">
                  <span className="text-2xl font-black text-slate-200 group-hover:text-blue-300 transition-colors">{i + 1}</span>
                  <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600 group-hover:underline">{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-slate-50 rounded-lg border border-slate-200 p-6 text-center">
            <h4 className="font-black text-slate-900 mb-2 uppercase text-[15px] tracking-widest">Subscribe to Chaos</h4>
            <p className="text-[13px] text-slate-500 mb-5 leading-relaxed">Get the best of the worst news delivered directly to your inbox daily.</p>
            <input type="email" placeholder="Email address" className="w-full px-4 py-2 text-sm border border-slate-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-slate-900" />
            <button className="w-full bg-slate-900 text-white font-black py-3 px-4 rounded text-sm hover:bg-slate-800 transition-colors uppercase tracking-wider">Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const WTFWNPage = ({ setActiveTab }) => {
  const [target, setTarget] = useState(GENERATED_ADVERSARIES[0]);
  const [loading, setLoading] = useState(false);
  const [rants, setRants] = useState([]);

  useEffect(() => {
    setRants(
      [...Array(3)].map(() => ({
        id: Math.random(),
        text: RANT_TEMPLATES[Math.floor(Math.random() * RANT_TEMPLATES.length)].replace('{target}', target.name),
        date: 'Just now',
        likes: (Math.random() * 50 + 10).toFixed(1) + 'k',
        reposts: (Math.random() * 20 + 5).toFixed(1) + 'k'
      }))
    );
  }, [target]);

  const scan = () => {
    setLoading(true);
    setTimeout(() => {
      setTarget(GENERATED_ADVERSARIES[Math.floor(Math.random() * GENERATED_ADVERSARIES.length)]);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="hidden lg:block w-48 flex-shrink-0 space-y-6"><SidebarNav setActiveTab={setActiveTab} /></div>
        <div className="flex-1 min-w-0 space-y-6">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden border-2 border-slate-900">
            <div className="bg-red-700 p-4 text-white flex justify-between items-center"><h2 className="text-xl font-black uppercase flex items-center gap-2"><Crosshair className="w-6 h-6" /> W.T.F.W.N. Command</h2><span className="bg-red-900 px-3 py-1 rounded font-mono text-xs animate-pulse">LIVE</span></div>
            <div className="p-6 text-center bg-slate-50">
              <div className="mb-6"><span className="text-8xl block mb-4">{target.icon}</span><h3 className="text-4xl font-black text-slate-900 uppercase leading-none mb-2">{target.name}</h3><p className="text-slate-500 italic font-serif text-lg">"{target.reason}"</p></div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-4 rounded border border-slate-200"><h4 className="text-xs text-slate-400 uppercase font-bold mb-2">Beef Level</h4><div className="text-xl font-black text-red-600 uppercase">{target.status}</div></div>
                <div className="bg-white p-4 rounded border border-slate-200"><h4 className="text-xs text-slate-400 uppercase font-bold mb-2">Posture</h4><div className="text-sm font-bold text-slate-800">CONFUSED</div></div>
              </div>
              <button onClick={scan} disabled={loading} className="w-full bg-red-600 text-white font-bold py-4 rounded hover:bg-red-700 transition-all uppercase tracking-wide">{loading ? <RefreshCw className="animate-spin w-5 h-5 mx-auto" /> : 'Find New Nemesis'}</button>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow border border-slate-200 p-4">
            <h3 className="font-bold text-sm text-blue-600 uppercase mb-4 flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Live Rant Stream</h3>
            <div className="space-y-4">
              {rants.map((rant, i) => (
                <div key={i} className="border-b border-slate-100 last:border-0 pb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-xl">👱‍♂️</div>
                    <div>
                      <div className="flex items-center gap-2 mb-1"><span className="font-bold text-sm">The Don</span><span className="text-blue-500"><CheckCircle className="w-3 h-3" /></span><span className="text-xs text-slate-400">{rant.date}</span></div>
                      <p className="text-sm text-slate-800 font-medium mb-2">{rant.text}</p>
                      <div className="flex gap-4 text-xs text-slate-400 font-bold"><span className="flex items-center gap-1"><Repeat className="w-3 h-3" /> {rant.reposts}</span><span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {rant.likes}</span></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
          <div className="bg-slate-900 text-white p-5 rounded-xl shadow border-2 border-yellow-500">
            <h3 className="font-black text-yellow-500 uppercase italic flex items-center gap-2 mb-4 border-b border-slate-700 pb-2"><DollarSign className="w-5 h-5" /> Vegas Odds</h3>
            <div className="space-y-3 font-mono text-sm">
              {VEGAS_ODDS.map((item, i) => (
                <div key={i} className="flex justify-between items-center"><span className="text-yellow-400">{i + 1}. {item.name}</span><span className="text-slate-400">{item.odds}</span></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MilitaryMap = () => (
  <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 text-slate-300 shadow-xl">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-bold text-sm text-green-400 uppercase">Live Theater Map</h3>
      <div className="flex items-center gap-2 text-xs text-green-400"><RadarIcon /> Live</div>
    </div>
    <div className="w-full h-48 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded relative overflow-hidden">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="absolute w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ left: `${(i * 7) % 100}%`, top: `${(i * 13) % 100}%` }}></div>
      ))}
    </div>
  </div>
);

const MilitaryDashboard = ({ onArticleSelect, setActiveTab, feed }) => {
  const [defcon, setDefcon] = useState(3);
  const [news, setNews] = useState(() => getFeedSnapshot('defense', 5));

  useEffect(() => {
    let cancelled = false;

    fetchFeedItems('defense', { limit: 5 })
      .then((items) => {
        if (!cancelled) {
          setNews(items);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          console.error('Defense feed refresh failed', error);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="hidden lg:block w-48 flex-shrink-0 space-y-6"><SidebarNav setActiveTab={setActiveTab} /></div>
        <div className="flex-1 min-w-0 space-y-6">
          <div className="bg-slate-950 text-green-500 p-4 rounded-xl border border-green-900 font-mono shadow-2xl flex justify-between items-center">
            <div><h2 className="text-xl font-bold flex items-center gap-2"><ShieldAlert className="w-5 h-5" /> TACTICAL COMMAND</h2><p className="text-xs opacity-70">SECURE TERMINAL // AUTHORIZED EYES ONLY</p></div>
            <div className={`px-4 py-2 rounded font-black text-2xl border-4 border-double ${defcon === 1 ? 'bg-white text-red-600 animate-pulse' : 'bg-green-600 text-white'}`}>DEFCON {defcon}</div>
          </div>
          <MilitaryMap />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 rounded-xl p-4 border border-slate-700 text-slate-300">
              <h3 className="font-bold text-sm text-green-400 mb-4 flex items-center gap-2 border-b border-slate-700 pb-2"><Radio className="w-4 h-4" /> CONFIRMED INTEL</h3>
              <div className="space-y-4">
                {news.map((item, i) => (
                  <div key={i} onClick={() => onArticleSelect(item)} className="p-3 bg-slate-800 rounded border border-slate-700 hover:border-green-500 cursor-pointer transition-all group flex gap-3">
                    <div className="w-16 h-12 flex-shrink-0 bg-slate-700 rounded overflow-hidden"><NewsImage item={item} category="defense" /></div>
                    <div><h4 className="font-bold text-sm text-white group-hover:text-green-400 leading-tight">{item.title}</h4><p className="text-xs text-green-500 font-mono mt-1">CLASS: UNCLASSIFIED</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <h3 className="font-bold text-sm text-red-600 mb-4 flex items-center gap-2 border-b border-slate-200 pb-2"><Bomb className="w-4 h-4" /> UNCONFIRMED RUMORS (Satire)</h3>
              <div className="space-y-3">
                {feed.filter((f) => f.category === 'Military').map((news) => (
                  <SatireNewsCard key={news.id} news={news} onClick={() => onArticleSelect(news)} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShoppingPage = ({ setActiveTab }) => (
  <div className="container mx-auto px-4 py-6 max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-700">
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="hidden lg:block w-48 flex-shrink-0 space-y-6"><SidebarNav setActiveTab={setActiveTab} /></div>
      <div className="flex-1 min-w-0">
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-8 rounded-xl shadow-xl text-center mb-8 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-black italic mb-2">SHOP LIKE NO ONE IS WATCHING</h2>
            <p className="text-pink-100 font-medium mb-6">Real Deals. Fake News. Total Satisfaction.</p>
            <a href="https://bestdealsonline.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white text-pink-600 font-black py-3 px-8 rounded-full shadow-lg hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5" /> Go To BestDealsOnline.com
            </a>
          </div>
          <Tag className="absolute top-0 right-0 w-64 h-64 text-white opacity-10 transform translate-x-10 -translate-y-10 rotate-12" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CONSPIRACY_PRODUCTS.concat([
            { name: 'Dehydrated Water', price: '$19.99', desc: 'Just add water!' },
            { name: 'Invisible Cloak', price: '$499', desc: "If you can't see it, it works." }
          ]).map((prod, i) => (
            <div key={i} className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden group hover:shadow-xl transition-shadow">
              <div className="h-40 bg-slate-100 flex items-center justify-center relative"><ShoppingBag className="w-12 h-12 text-slate-300 group-hover:scale-110 transition-transform" /></div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2"><h4 className="font-bold text-slate-900 leading-tight text-sm">{prod.name}</h4><span className="font-black text-green-600 text-sm">{prod.price}</span></div>
                <p className="text-xs text-slate-500 mb-4">{prod.desc}</p>
                <button className="w-full bg-slate-900 text-white font-bold py-2 rounded text-xs hover:bg-slate-700 flex items-center justify-center gap-2"><CreditCard className="w-3 h-3" /> Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const SatirePage = ({ feed, onArticleSelect, setActiveTab }) => {
  const [votes, setVotes] = useState(POLL_OPTIONS);
  const [voted, setVoted] = useState(false);
  const handleVote = (idx) => {
    if (voted) return;
    const newVotes = [...votes];
    newVotes[idx].votes += 1;
    setVotes(newVotes);
    setVoted(true);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="hidden lg:block w-48 flex-shrink-0 space-y-6"><SidebarNav setActiveTab={setActiveTab} /></div>
        <div className="flex-1 min-w-0">
          <div className="bg-white p-4 rounded-xl shadow border border-slate-200 mb-6">
            <div className="flex items-center gap-3 mb-4"><div className="p-2 bg-red-100 text-red-600 rounded-full"><Radio className="w-6 h-6" /></div><div><h2 className="text-xl font-black italic">The Satire Wire</h2><p className="text-xs text-slate-500">News that feels true but technically isn't.</p></div></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{feed.map((news) => <SatireNewsCard key={news.id} news={news} onClick={() => onArticleSelect(news)} />)}</div>
          </div>
          <div className="bg-slate-800 text-white p-6 rounded-xl shadow-lg border-2 border-slate-600">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Vote className="w-5 h-5 text-yellow-400" /> Daily Poll</h3>
            <div className="space-y-3">
              {votes.map((option, idx) => (
                <div key={idx} className="relative">
                  <button onClick={() => handleVote(idx)} disabled={voted} className="w-full text-left bg-slate-700 hover:bg-slate-600 p-3 rounded relative z-10 transition-all flex justify-between items-center disabled:cursor-not-allowed">
                    <span className="font-bold text-sm">{option.text}</span>{voted && <span className="text-xs font-mono">{Math.round((option.votes / votes.reduce((a, b) => a + b.votes, 0)) * 100)}%</span>}
                  </button>
                  {voted && <div className="absolute top-0 left-0 h-full bg-blue-600 rounded opacity-30 transition-all duration-1000" style={{ width: `${(option.votes / votes.reduce((a, b) => a + b.votes, 0)) * 100}%` }}></div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ConspiracyPage = ({ onArticleSelect, setActiveTab }) => {
  const [jonesRant, setJonesRant] = useState('THEY ARE TURNING THE FROGS GAY!');
  const [weirdNews, setWeirdNews] = useState(() => getFeedSnapshot('conspiracy', 5));
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);

  const generateRant = () => {
    const noun = CONSPIRACY_NOUNS[Math.floor(Math.random() * CONSPIRACY_NOUNS.length)];
    const verb = CONSPIRACY_VERBS[Math.floor(Math.random() * CONSPIRACY_VERBS.length)];
    const object = CONSPIRACY_OBJECTS[Math.floor(Math.random() * CONSPIRACY_OBJECTS.length)];
    setJonesRant(`LISTEN TO ME! ${noun.toUpperCase()} ARE ${verb.toUpperCase()} ${object.toUpperCase()}! IT'S IN THE DOCUMENTS!`);
  };

  useEffect(() => {
    let cancelled = false;

    fetchFeedItems('conspiracy', { limit: 5 })
      .then((items) => {
        if (!cancelled) {
          setWeirdNews(items);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          console.error('Conspiracy feed refresh failed', error);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < 5; i += 1) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        ctx.fillStyle = '#000';
        ctx.fillRect(x - 2, y - 2, 4, 4);
      }
      ctx.stroke();
    };
    const interval = setInterval(draw, 2000);
    draw();
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="hidden lg:block w-48 flex-shrink-0 space-y-6"><SidebarNav setActiveTab={setActiveTab} /></div>
        <div className="flex-1 min-w-0 space-y-6">
          <div className="bg-purple-900 text-white p-4 rounded-xl border-b-4 border-purple-950 shadow-xl flex justify-between items-center mb-6">
            <div><h2 className="text-xl font-black italic flex items-center gap-2"><Eye className="w-6 h-6 animate-pulse" /> THE TRUTH FILES</h2><p className="text-xs text-purple-300 font-mono">WAKE UP SHEEPLE // 5G BLOCKED</p></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg border-2 border-red-600 overflow-hidden">
                <div className="bg-red-600 text-white p-2 font-black text-center uppercase flex items-center justify-center gap-2"><Megaphone className="w-5 h-5" /> The Jones-O-Tron 9000</div>
                <div className="p-6 text-center">
                  <div className="text-2xl font-black text-slate-900 mb-6 uppercase leading-tight font-serif">"{jonesRant}"</div>
                  <button onClick={generateRant} className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full shadow-lg active:scale-95 transition-transform">GENERATE OUTRAGE</button>
                </div>
              </div>
              <div className="bg-slate-100 rounded-xl p-4 border border-slate-300">
                <h3 className="font-bold text-sm text-slate-500 uppercase mb-3 flex items-center gap-2"><ShoppingBag className="w-4 h-4" /> The Patriot Shop</h3>
                <div className="grid grid-cols-2 gap-2">
                  {CONSPIRACY_PRODUCTS.map((prod, i) => (
                    <div key={i} className="bg-white p-2 rounded border border-slate-200 text-center"><div className="text-xs font-black text-slate-800 mb-1">{prod.name}</div><div className="text-[10px] text-slate-500 leading-tight mb-2">{prod.desc}</div><div className="text-sm font-bold text-green-600">{prod.price}</div></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden relative"><div className="absolute top-2 left-2 text-xs font-bold text-red-600 bg-white/80 px-2 py-1 rounded">EVIDENCE BOARD (LIVE)</div><canvas ref={canvasRef} width={400} height={200} className="w-full bg-amber-100"></canvas></div>
              <div className="bg-slate-900 rounded-xl p-4 text-slate-300">
                <h3 className="font-bold text-sm text-purple-400 mb-4 flex items-center gap-2 border-b border-slate-700 pb-2"><FileText className="w-4 h-4" /> CONFIRMED "WEIRD" EVENTS</h3>
                <div className="space-y-3">
                  {weirdNews.map((item, i) => (
                    <div key={i} onClick={() => onArticleSelect(item)} className="flex items-start gap-2 group cursor-pointer hover:bg-slate-800 p-2 rounded transition-colors"><Triangle className="w-3 h-3 text-purple-500 mt-1 flex-shrink-0 group-hover:animate-spin" /><div><h4 className="text-xs font-bold text-white group-hover:text-purple-300">{item.title}</h4><span className="text-[10px] opacity-50">{item.pubDate?.split(' ')[0]}</span></div></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HoroscopesPage = ({ setActiveTab }) => (
  <div className="container mx-auto px-4 py-6 max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-700">
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="hidden lg:block w-48 flex-shrink-0 space-y-6"><SidebarNav setActiveTab={setActiveTab} /></div>
      <div className="flex-1 min-w-0">
        <div className="bg-indigo-900 text-white p-8 rounded-xl shadow-2xl mb-8 border-4 border-indigo-700 relative overflow-hidden text-center">
          <div className="relative z-10"><Moon className="w-12 h-12 text-yellow-300 mx-auto mb-2 animate-pulse" /><h2 className="text-4xl font-black font-serif italic mb-2">Cosmic Vibe Check</h2><p className="text-indigo-300 font-mono text-sm">THE STARS ARE JUDGING YOU.</p></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {HOROSCOPES.map((horo, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow border-l-4 border-indigo-500 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-indigo-900 uppercase tracking-widest mb-2">{horo.sign}</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-serif italic">"{horo.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const PoliticalZoo = () => {
  const [politicians, setPoliticians] = useState([]);
  useEffect(() => {
    const spawn = () => {
      const types = ['don', 'joe', 'bernie'];
      const type = types[Math.floor(Math.random() * types.length)];
      setPoliticians((prev) => [...prev, { id: Date.now(), type, x: -10, speed: Math.random() * 0.5 + 0.2 }]);
    };
    const i = setInterval(() => Math.random() > 0.7 && spawn(), 3000);
    return () => clearInterval(i);
  }, []);
  useEffect(() => {
    const i = setInterval(() => setPoliticians((prev) => prev.map((p) => (p.x > 110 ? null : { ...p, x: p.x + p.speed })).filter(Boolean)), 50);
    return () => clearInterval(i);
  }, []);
  return (
    <div className="fixed bottom-0 left-0 w-full h-20 pointer-events-none z-40 overflow-hidden hidden md:block">
      {politicians.map((p) => (
        <div key={p.id} className="absolute bottom-0 text-4xl animate-bounce" style={{ left: `${p.x}%`, transition: 'left 50ms linear' }}>
          {p.type === 'don' ? '👱‍♂️' : p.type === 'joe' ? '😎' : '🧤'}
        </div>
      ))}
    </div>
  );
};

// --- APP ROOT ---

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [tickerItems, setTickerItems] = useState(() =>
    getFeedSnapshot('political', 10).map((article) => article.title)
  );

  const handleTabChange = (tab) => {
    setSelectedArticle(null);
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  useEffect(() => {
    if (!VALID_TABS.has(activeTab)) {
      setActiveTab('home');
    }
  }, [activeTab]);

  useEffect(() => {
    let cancelled = false;

    fetchFeedItems('political', { limit: 10 })
      .then((items) => {
        if (!cancelled) {
          setTickerItems(items.map((article) => article.title));
        }
      })
      .catch((error) => {
        if (!cancelled) {
          console.error('Ticker feed failed', error);
          setTickerItems(['Markets update unavailable - retrying shortly']);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 relative overflow-hidden flex flex-col">
      <ThirdPartyBoot />
      <PortalHeader activeTab={activeTab} onTabChange={handleTabChange} tickerItems={tickerItems} isReading={!!selectedArticle} />

      <main className="relative z-20 flex-grow">
        {selectedArticle ? (
          <div className="container mx-auto px-4 py-6 max-w-4xl">
            <SatiricalReader article={selectedArticle} onBack={() => setSelectedArticle(null)} />
          </div>
        ) : (
          <>
            <div className="md:hidden flex gap-2 mb-2 overflow-x-auto pb-2 px-4 mt-4 bg-white border-b border-slate-200">
              {['home', 'tracker', 'military', 'conspiracy', 'finance', 'shopping'].map((tab) => (
                <button key={tab} onClick={() => handleTabChange(tab)} className={`flex-shrink-0 px-4 py-2 rounded-full font-bold text-xs uppercase border ${activeTab === tab ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200'}`}>
                  {tab === 'tracker' ? 'WTFWN' : tab === 'home' ? 'Home' : tab === 'conspiracy' ? 'Truth' : tab}
                </button>
              ))}
            </div>

            {activeTab === 'home' && <YahooStyleHome onArticleSelect={setSelectedArticle} setActiveTab={handleTabChange} />}
            {activeTab === 'tracker' && <WTFWNPage setActiveTab={handleTabChange} />}
            {activeTab === 'military' && <MilitaryDashboard onArticleSelect={setSelectedArticle} setActiveTab={handleTabChange} feed={SATIRE_HEADLINES} />}
            {activeTab === 'conspiracy' && <ConspiracyPage onArticleSelect={setSelectedArticle} setActiveTab={handleTabChange} />}
            {activeTab === 'finance' && (
              <ErrorBoundary>
                <Suspense fallback={<div className="container mx-auto px-4 py-10 text-center text-slate-500"><RefreshCw className="animate-spin mx-auto mb-3" />Loading finance terminal...</div>}>
                  <FinancePage onArticleSelect={setSelectedArticle} setActiveTab={handleTabChange} />
                </Suspense>
              </ErrorBoundary>
            )}
            {activeTab === 'shopping' && <ShoppingPage setActiveTab={handleTabChange} />}
            {activeTab === 'satire' && <SatirePage feed={SATIRE_HEADLINES} onArticleSelect={setSelectedArticle} setActiveTab={handleTabChange} />}
            {activeTab === 'horoscopes' && <HoroscopesPage setActiveTab={handleTabChange} />}
            {activeTab === 'about' && <AboutPage />}
            {activeTab === 'privacy' && <PrivacyPage />}
            {activeTab === 'terms' && <TermsPage />}
          </>
        )}
      </main>

      {!selectedArticle && <Footer setActiveTab={handleTabChange} />}
      <PoliticalZoo />
    </div>
  );
};

export default App;
