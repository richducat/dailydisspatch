import React, { useState, useEffect, useRef } from 'react';
import {
  AlertTriangle,
  Globe,
  Crosshair,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
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
  Loader2,
  AlertCircle,
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
  Flame,
  Megaphone,
  Gem,
  Unlock,
  Users,
  Briefcase,
  Target,
  Radar,
  BrainCircuit,
  FlagTriangleRight,
  Home,
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
  Shield
} from 'lucide-react';

// --- UTILS ---

const getArticleImage = (item) => {
  if (!item) return null;
  if (item.enclosure && item.enclosure.link) return item.enclosure.link;
  if (item.thumbnail) return item.thumbnail;
  const imgMatch = (item.description || item.content)?.match(/<img[^>]+src="([^"]+)"/);
  if (imgMatch) return imgMatch[1];
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
  { name: 'The Federal Reserve', reason: 'Interest rates exist', status: 'Critical', icon: '💸', reaction: 'Printing money in panic' },
  { name: 'Windmills', reason: "They're killing the birds, very sad", status: 'Ongoing', icon: '🌬️', reaction: 'Spinning menacingly' },
  { name: 'NATO', reason: "Didn't pay the lunch bill", status: 'Elevated', icon: '🛡️', reaction: 'Holding an emergency meeting' },
  { name: 'The Ocean', reason: 'Too wet, very un-American', status: 'Mild', icon: '🌊', reaction: 'Waving back' },
  { name: 'Mars', reason: "Hasn't been colonized yet. Low energy.", status: 'Watching', icon: '🪐', reaction: 'Being red' },
  { name: 'Standard Time', reason: 'Daylight Savings is for winners', status: 'Heated', icon: '⏰', reaction: 'Ticking loudly' }
];

const SATIRE_HEADLINES = [
  {
    id: 1,
    title: "US Navy conducts 'Freedom of Navigation' drill in a puddle, claims it's international waters",
    category: 'Military',
    severity: 'low',
    description:
      "Admiral Nelson stated that the puddle was 'clearly navigable' by a toy boat and thus subject to maritime law. China has issued a strong condemnation of the splash damage.",
    link: '#'
  },
  {
    id: 2,
    title: "Congress votes to rename 'French Fries' to 'Freedom Taters' again",
    category: 'Political',
    severity: 'medium',
    description:
      'In a bipartisan effort to waste time, the House has passed a bill declaring that potatoes are now patriotic citizens. France declined to comment, mostly because they are busy eating better food.',
    link: '#'
  },
  {
    id: 3,
    title: "Pentagon budget increases by $800 billion to develop 'invisibility cloaks' for tanks",
    category: 'Military',
    severity: 'high',
    description:
      "The project, codenamed 'Where's Waldo', aims to hide 60-ton vehicles using a series of mirrors and smoke machines. Critics argue you can still hear the tank engine from 3 miles away.",
    link: '#'
  },
  {
    id: 4,
    title: 'Diplomatic cables reveal the Ambassador to France just really wanted a croissant',
    category: 'Diplomacy',
    severity: 'low',
    description:
      "Leaked memos show 400 pages of correspondence requesting 'the buttery flaky ones' and zero mention of nuclear treaties. The State Department calls it 'strategic gastronomy'.",
    link: '#'
  },
  {
    id: 5,
    title: "Space Force officially adopts 'Pew Pew' as official motto",
    category: 'Military',
    severity: 'medium',
    description: 'General Spacey announced the change after a Twitter poll. The uniform will now include mandatory laser pointers and capes.',
    link: '#'
  },
  {
    id: 6,
    title: 'Trade War update: Avocados are now contraband, Millennial toast market crashes',
    category: 'Economy',
    severity: 'high',
    description:
      'Customs agents seized 4 million tons of guacamole at the border. Brunch prices in Brooklyn have skyrocketed to $45 per slice.',
    link: '#'
  }
];

const POLL_OPTIONS = [
  { text: 'Panic immediately', votes: 45 },
  { text: 'Blame the other party', votes: 82 },
  { text: 'Tweet about it', votes: 12 },
  { text: 'Just go back to sleep', votes: 99 }
];

const RANT_TEMPLATES = [
  'Total disaster! {target} is treating us very badly. Unfair! Sad!',
  "Many people are saying {target} is a loser. I don't know, but that's what they say!",
  'If I were in charge of {target}, it would be huge. Currently? Tiny. Very small.',
  'We are looking into {target} very strongly. Powerful investigation!',
  'Why does {target} hate freedom? We love freedom. We have the best freedom.'
];

const VEGAS_ODDS = [
  { name: 'The Metric System', odds: '+150', trend: 'up' },
  { name: 'Vegetables', odds: '+300', trend: 'steady' },
  { name: 'Clouds', odds: '+500', trend: 'down' },
  { name: 'TikTok Teens', odds: '+1000', trend: 'up' },
  { name: 'Shark Attacks', odds: '+2500', trend: 'steady' }
];

const HOROSCOPES = [
  { sign: 'Aries', text: 'You will start a fight with a vending machine today. The machine will win.' },
  { sign: 'Taurus', text: 'Avoid making eye contact with squirrels. They know what you did.' },
  { sign: 'Gemini', text: 'Today is a great day to start a rumor about yourself just to feel something.' },
  { sign: 'Cancer', text: 'You will cry during a commercial for car insurance. Embrace it.' },
  { sign: 'Leo', text: 'Your hair looks fantastic, but everyone is actually looking at the spinach in your teeth.' },
  { sign: 'Virgo', text: "Organizing your desktop icons won't fix your life, but you'll try anyway." },
  { sign: 'Libra', text: 'Indecision will strike when choosing lunch. You will starve until dinner.' },
  { sign: 'Scorpio', text: "Revenge is a dish best served cold, but you're too impatient. Microwaved revenge it is." },
  { sign: 'Sagittarius', text: 'You will feel an urge to travel. Your bank account will respectfully disagree.' },
  { sign: 'Capricorn', text: 'Work harder. The simulation demands productivity.' },
  { sign: 'Aquarius', text: "Your unique ideas are valid, but maybe keep the one about 'hamster-powered cars' to yourself." },
  { sign: 'Pisces', text: 'You will dissociate during a Zoom meeting and agree to lead a project by accident.' }
];

const CONSPIRACY_PRODUCTS = [
  { name: 'BRAIN FORCE ULTRA', desc: 'Now with 50% more rage.', price: '$59.99' },
  { name: 'Tactical Wipes', desc: 'For when the grid goes down.', price: '$29.99' },
  { name: 'Male Vitality Bone Broth', desc: 'Made from real dinosaur bones.', price: '$89.99' },
  { name: 'Tinfoil Beanie (Heavy Duty)', desc: 'Blocks 6G waves.', price: '$15.00' }
];

const RSS_FEEDS = {
  political: { url: 'https://thehill.com/homenews/administration/feed/', name: 'Political Intel' },
  defense: { url: 'https://www.military.com/rss-feeds/content?type=news', name: 'Military Ops' },
  conspiracy: { url: 'https://www.upi.com/rss/Odd_News/', name: 'The Files' },
  finance: { url: 'https://www.cnbc.com/id/10000664/device/rss/rss.html', name: 'Market Watch' }
};

const SATIRE_TEMPLATES = {
  openers: ['In a move that surprised absolutely no one,', 'Sources close to the situation,', 'It has come to our attention that reality is glitching again, as'],
  middles: [
    "Experts believe this is basically just a fancy way of saying 'oops'.",
    'The Pentagon has not confirmed if aliens are involved.',
    'This will likely result in a 3-hour committee meeting.'
  ],
  closers: [
    'We recommend panicking slightly, then taking a nap.',
    "History will remember this moment as 'that Tuesday when things got weird'.",
    'The stock market reacted by doing absolutely nothing.'
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

const NewsImage = ({ item, category, className }) => {
  const [imgSrc, setImgSrc] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const src = getArticleImage(item);
    if (src) setImgSrc(src);
    else setError(true);
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

  return <img src={imgSrc} alt={item.title} className={`object-cover w-full h-full ${className}`} onError={() => setError(true)} />;
};

const BeefMeter = ({ level }) => {
  const rotation = { low: 'rotate-0', medium: 'rotate-45', high: 'rotate-90', critical: 'rotate-180' };
  return (
    <div className="relative w-32 h-16 overflow-hidden mx-auto mt-4">
      <div className="w-32 h-32 rounded-full border-8 border-slate-200 border-b-0 border-l-slate-300 border-r-slate-300 border-t-slate-300 bg-slate-100 absolute top-0 left-0 box-border"></div>
      <div
        className={`absolute bottom-0 left-1/2 w-1 h-14 bg-black origin-bottom transition-transform duration-700 ease-out ${
          rotation[level] || 'rotate-0'
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
    navigator.clipboard.writeText(rant);
    setCopyStatus('Copied!');
    setTimeout(() => setCopyStatus('Copy Rant'), 2000);
  };

  const toggleFactCheck = () => {
    setShowFactCheck(!showFactCheck);
  };

  if (!satireData) return <div className="p-10 text-center"><RefreshCw className="animate-spin mx-auto"/> Generating Cynicism...</div>;

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden border-2 border-slate-900 mb-8 relative z-20">
        <div className="bg-slate-900 p-6 text-white border-b-4 border-red-600 relative overflow-hidden">
          <div className="relative z-10">
            <span className="inline-block bg-red-600 text-white text-xs font-bold px-2 py-1 rounded mb-3 uppercase tracking-wider">Satire Filter: ACTIVE</span>
            <h1 className="text-2xl md:text-3xl font-black font-serif italic leading-tight mb-4">{satireData.headline}</h1>
            <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm font-mono">
              <span className="flex items-center gap-1"><Glasses className="w-4 h-4"/> Analyst: Dr. Sarcasm</span>
              <span>•</span>
              <span className="flex items-center gap-1"><ShieldAlert className="w-4 h-4"/> Clearance: G-14 Classified</span>
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
                <a href={article.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline">Read Full Source at {getHostname(article.link)} <ExternalLink className="w-3 h-3"/></a>
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
      <div className="flex justify-between items-center"><div className="text-xs font-bold flex gap-2"><span className="bg-blue-100 p-1 rounded">🙏</span> Prayers</div><div className="text-right text-sm font-black text-green-600">+4.2% <TrendingUp className="inline w-3 h-3"/></div></div>
      <div className="flex justify-between items-center"><div className="text-xs font-bold flex gap-2"><span className="bg-yellow-100 p-1 rounded">🤔</span> Thoughts</div><div className="text-right text-sm font-black text-red-500">-12.5% <TrendingDown className="inline w-3 h-3"/></div></div>
      <div className="flex justify-between items-center"><div className="text-xs font-bold flex gap-2"><span className="bg-red-100 p-1 rounded">🔥</span> Chaos</div><div className="text-right text-sm font-black text-green-600">+850% <TrendingUp className="inline w-3 h-3"/></div></div>
    </div>
  </div>
);

const SidebarNav = ({ setActiveTab }) => (
  <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
    <div className="p-3 bg-slate-50 border-b border-slate-200 font-bold text-xs uppercase text-slate-500">Quick Links</div>
    <ul className="text-sm font-bold text-slate-700 divide-y divide-slate-50">
      {['home', 'tracker', 'military', 'conspiracy', 'finance', 'horoscopes', 'shopping', 'satire'].map((tab) => (
        <li key={tab} onClick={() => setActiveTab(tab)} className="px-3 py-2 hover:bg-blue-50 hover:text-blue-600 cursor-pointer flex justify-between group capitalize">
          {tab === 'tracker' ? 'WTFWN Tracker' : tab}
          <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"/>
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

const PortalHeader = ({ activeTab, setActiveTab, tickerItems, onBack, isReading }) => (
  <header className="bg-white text-slate-900 border-b border-slate-300 sticky top-0 z-50 shadow-sm font-sans">
    <div className="bg-slate-900 text-white text-[10px] py-1 px-4 flex justify-between items-center">
      <div className="flex gap-4">
        <span onClick={() => !isReading && setActiveTab('home')} className="hover:underline cursor-pointer opacity-80">Make Homepage</span>
        <span onClick={() => setActiveTab('about')} className="hover:underline cursor-pointer opacity-80">About</span>
      </div>
      <div className="flex gap-4">
        <span onClick={() => setActiveTab('terms')} className="hover:underline cursor-pointer opacity-80">Terms</span>
        <span onClick={() => setActiveTab('privacy')} className="hover:underline cursor-pointer opacity-80">Privacy</span>
      </div>
    </div>
    <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => !isReading && setActiveTab('home')}>
        <div className="bg-red-600 p-2 rounded-lg transform -rotate-6 shadow-md"><Globe className="w-8 h-8 text-white" /></div>
        <div className="leading-none">
          <h1 className="text-3xl font-black tracking-tighter italic text-slate-900 font-serif">Diss-patch<span className="text-red-600">!</span></h1>
          <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">The Front Page of the Simulation</p>
        </div>
      </div>
      {!isReading && (
        <div className="w-full md:w-[500px] flex">
          <input type="text" placeholder="Search for truth, lies, or cat videos..." className="w-full border-2 border-slate-300 rounded-l-md px-4 py-2 text-sm focus:outline-none focus:border-blue-500" />
          <button className="bg-blue-600 text-white px-6 rounded-r-md hover:bg-blue-700 font-bold"><Search className="w-5 h-5" /></button>
        </div>
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
            <button key={tab} onClick={() => setActiveTab(tab)} className={`hover:text-blue-600 uppercase tracking-tight flex items-center gap-1 transition-colors ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600 pb-1 -mb-1.5' : ''}`}>
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
  <footer className="bg-slate-900 text-white py-8 mt-12 border-t border-slate-800">
    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
      <div>
        <h4 className="font-black text-lg mb-4 italic">Diss-patch<span className="text-red-600">!</span></h4>
        <p className="text-slate-400">Real News. Fake Problems. Total Chaos.</p>
      </div>
      <div>
        <h5 className="font-bold uppercase text-slate-500 mb-3">Sections</h5>
        <ul className="space-y-2">
          <li onClick={() => setActiveTab('home')} className="hover:text-blue-400 cursor-pointer">Home</li>
          <li onClick={() => setActiveTab('home')} className="hover:text-blue-400 cursor-pointer">Politics</li>
          <li onClick={() => setActiveTab('military')} className="hover:text-blue-400 cursor-pointer">Defense</li>
          <li onClick={() => setActiveTab('conspiracy')} className="hover:text-blue-400 cursor-pointer">Weird News</li>
        </ul>
      </div>
      <div>
        <h5 className="font-bold uppercase text-slate-500 mb-3">Company</h5>
        <ul className="space-y-2">
          <li onClick={() => setActiveTab('about')} className="hover:text-blue-400 cursor-pointer">About Us</li>
          <li onClick={() => setActiveTab('about')} className="hover:text-blue-400 cursor-pointer">Contact</li>
          <li onClick={() => setActiveTab('about')} className="hover:text-blue-400 cursor-pointer">Careers (Lol)</li>
        </ul>
      </div>
      <div>
        <h5 className="font-bold uppercase text-slate-500 mb-3">Legal</h5>
        <ul className="space-y-2">
          <li onClick={() => setActiveTab('privacy')} className="hover:text-blue-400 cursor-pointer">Privacy Policy</li>
          <li onClick={() => setActiveTab('terms')} className="hover:text-blue-400 cursor-pointer">Terms of Service</li>
          <li onClick={() => setActiveTab('privacy')} className="hover:text-blue-400 cursor-pointer">Cookie Policy</li>
        </ul>
      </div>
    </div>
    <div className="container mx-auto px-4 mt-8 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
      &copy; 2024 The Daily Diss-patch. All rights reserved. Not affiliated with reality.
    </div>
  </footer>
);

// --- PAGES ---

const YahooStyleHome = ({ onArticleSelect, setActiveTab }) => {
  const [news, setNews] = useState({ politics: [], defense: [], weird: [] });
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [p, d, w] = await Promise.all([
          fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_FEEDS.political.url)}`).then((r) => r.json()),
          fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_FEEDS.defense.url)}`).then((r) => r.json()),
          fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_FEEDS.conspiracy.url)}`).then((r) => r.json())
        ]);
        setNews({
          politics: p.status === 'ok' ? p.items.slice(0, 6) : [],
          defense: d.status === 'ok' ? d.items.slice(0, 4) : [],
          weird: w.status === 'ok' ? w.items.slice(0, 5) : []
        });
      } catch (e) {
        console.error(e);
      }
    };
    fetchAll();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="hidden lg:block w-48 flex-shrink-0 space-y-6">
          <SidebarNav setActiveTab={setActiveTab} />
          <div className="bg-slate-100 border border-slate-300 p-4 text-center rounded">
             <div className="text-[10px] text-slate-400 uppercase mb-2">Ad</div>
             <h4 className="font-black text-slate-800 mb-2">Bunker Sale!</h4>
             <button className="bg-slate-900 text-white text-xs px-4 py-2 rounded uppercase font-bold">Shop Now</button>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          {news.politics[0] && (
            <div onClick={() => onArticleSelect(news.politics[0])} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mb-6 cursor-pointer group h-80 relative">
              <div className="absolute inset-0">
                <NewsImage item={news.politics[0]} category="politics" className="brightness-75 group-hover:brightness-50 transition-all" />
              </div>
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/70 to-transparent p-6 pt-20">
                <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase mb-2 inline-block">Top Story</span>
                <h2 className="text-2xl md:text-4xl font-black text-white leading-tight group-hover:underline">{news.politics[0].title}</h2>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
             <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2 pb-2 border-b border-slate-100"><Globe className="w-5 h-5 text-blue-600" /> Political Circus</h3>
                <div className="space-y-4">
                  {news.politics.slice(1, 5).map((item, i) => (
                    <div key={i} onClick={() => onArticleSelect(item)} className="cursor-pointer group flex gap-3">
                      <div className="w-20 h-16 flex-shrink-0 rounded overflow-hidden bg-slate-100"><NewsImage item={item} category="politics" /></div>
                      <div><h4 className="font-bold text-sm text-slate-800 group-hover:text-blue-600 leading-snug mb-1 line-clamp-2">{item.title}</h4><p className="text-xs text-slate-400">2 hours ago</p></div>
                    </div>
                  ))}
                </div>
             </div>
             <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2 pb-2 border-b border-slate-100"><ShieldAlert className="w-5 h-5 text-green-600" /> Global Conflict</h3>
                <div className="space-y-4">
                  {news.defense.map((item, i) => (
                    <div key={i} onClick={() => onArticleSelect(item)} className="cursor-pointer group flex gap-3">
                      <div className="w-20 h-16 flex-shrink-0 rounded overflow-hidden bg-slate-100"><NewsImage item={item} category="defense" /></div>
                      <div><h4 className="font-bold text-sm text-slate-800 group-hover:text-green-600 leading-snug mb-1 line-clamp-2">{item.title}</h4><p className="text-xs text-slate-400">Military Ops</p></div>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </div>
        <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
          <VibeMarket />
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
            <h3 className="font-bold text-sm uppercase text-slate-900 mb-3">Trending Now</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm font-bold text-blue-600">
              {['Aliens', 'Inflation', 'Florida Man', 'Cyber Trucks', 'The Moon', 'Avocados', 'AI Takeover', 'Cat Videos'].map((t, i) => (
                <li key={i} className="hover:underline cursor-pointer"><span className="text-slate-800">{t}</span></li>
              ))}
            </ol>
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
                        <div className="flex gap-4 text-xs text-slate-400 font-bold"><span className="flex items-center gap-1"><Repeat className="w-3 h-3"/> {rant.reposts}</span><span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3"/> {rant.likes}</span></div>
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
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_FEEDS.defense.url)}`)
      .then((res) => res.json())
      .then((data) => data.status === 'ok' && setNews(data.items.slice(0, 5)));
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

const StockAI_Simple = () => {
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
  const [tokenNews, setTokenNews] = useState([]);
  const [feedNews, setFeedNews] = useState([]);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const container = document.getElementById('tv-ticker-tape');
    if (container) {
      container.innerHTML = '';
      const widgetContainer = document.createElement('div');
      widgetContainer.className = 'tradingview-widget-container__widget';
      container.appendChild(widgetContainer);

      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
      script.async = true;
      script.innerHTML = JSON.stringify({
        symbols: [
          { proName: 'FOREXCOM:SPXUSD', title: 'S&P 500' },
          { proName: 'FOREXCOM:NSXUSD', title: 'Nasdaq 100' },
          { proName: 'BITSTAMP:BTCUSD', title: 'Bitcoin' },
          { proName: 'BITSTAMP:ETHUSD', title: 'Ethereum' },
          { proName: 'BINANCE:SOLUSDT', title: 'Solana' },
          { proName: 'NASDAQ:NVDA', title: 'NVIDIA' },
          { proName: 'NASDAQ:TSLA', title: 'Tesla' }
        ],
        showSymbolLogo: true,
        colorTheme: 'dark',
        isTransparent: false,
        displayMode: 'adaptive',
        locale: 'en'
      });
      container.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (view !== 'HOME') return;

    const container = document.getElementById('tv-market-overview');
    if (container) {
      container.innerHTML = '';
      const widgetContainer = document.createElement('div');
      widgetContainer.className = 'tradingview-widget-container__widget';
      container.appendChild(widgetContainer);

      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-tickers.js';
      script.async = true;
      script.innerHTML = JSON.stringify({
        symbols: [
          { proName: 'FOREXCOM:SPXUSD', title: 'S&P 500' },
          { proName: 'FOREXCOM:NSXUSD', title: 'Nasdaq 100' },
          { proName: 'FX_IDC:EURUSD', title: 'EUR/USD' },
          { proName: 'BITSTAMP:BTCUSD', title: 'Bitcoin' },
          { proName: 'BITSTAMP:ETHUSD', title: 'Ethereum' }
        ],
        colorTheme: 'dark',
        isTransparent: true,
        showSymbolLogo: true,
        locale: 'en'
      });
      container.appendChild(script);
    }
  }, [view]);

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
        id: Math.random().toString(36).substr(2, 9),
        source: randomSource,
        title: tmpl.t.replace('[SYM]', symbol || 'Market'),
        time: `${Math.floor(Math.random() * 24) + 1}h ago`,
        type: tmpl.type,
        imageUrl: randomImage
      };
    });
  };

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

    let tvSymbol = `BINANCE:${ticker}USDT`;
    if (assetType === 'STOCK') {
      tvSymbol = `NASDAQ:${ticker}`;
    } else if (liveData?.source === 'DexScreener') {
      tvSymbol = 'BINANCE:SOLUSDT';
    }

    const container = document.getElementById('tradingview_widget');
    if (container) {
      container.innerHTML = '';
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = () => {
        if (window.TradingView) {
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
        }
      };
      container.appendChild(script);
    }
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
        processedData = processData(token.symbol, token.current_price || 150.0, token.price_change_percentage_24h || 2.5, 50000000, 'Real', 2000000000000);
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
      ? 'Euphor. Retail is chasing green candles. Institutional flows are steady.'
      : 'Fearful. Retail is panic selling. Smart money is waiting for support.';

    const trends = isBullish ? ['AI & Compute', 'Memes'] : ['Stablecoins', 'Defensive Assets'];
    const catalysts = ['Upcoming Earnings/Unlock', 'Sector Rotation'];

    return { viralReason, whales, entry, stop, target, sentiment, trends, catalysts };
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-emerald-500/30 pb-20">
      <div className="bg-slate-900 border-b border-slate-800 h-10 overflow-hidden relative z-50">
        <div id="tv-ticker-tape" className="tradingview-widget-container h-full w-full bg-slate-950"></div>
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
                      <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[8px] font-bold">
                        {item.symbol[0]}
                      </div>
                    )}
                    <div>
                      <span className="font-bold text-white text-sm block">{item.name}</span>
                      <span className="text-xs text-slate-500 uppercase">{item.symbol}</span>
                    </div>
                    {item.type === 'STOCK' && (
                      <span className="ml-auto text-[10px] bg-blue-900 text-blue-300 px-1.5 py-0.5 rounded">STOCK</span>
                    )}
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
            <div className="h-[200px] w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-2">
              <div id="tv-market-overview" className="tradingview-widget-container h-full w-full"></div>
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
                <ScannerButton
                  icon={<TrendingUp className="w-6 h-6" />}
                  title="Viral Stocks"
                  active={activeScan === 'VIRAL_STOCKS'}
                  onClick={() => runScanner('VIRAL_STOCKS')}
                  color="emerald"
                />
                <ScannerButton
                  icon={<Rocket className="w-6 h-6" />}
                  title="Moon Bag (Solana)"
                  active={activeScan === 'MOON_BAG'}
                  onClick={() => runScanner('MOON_BAG')}
                  color="purple"
                />
                <ScannerButton
                  icon={<Flame className="w-6 h-6" />}
                  title="High Volatility"
                  active={activeScan === 'VOLATILITY'}
                  onClick={() => runScanner('VOLATILITY')}
                  color="orange"
                />
                <ScannerButton
                  icon={<BarChart3 className="w-6 h-6" />}
                  title="Stock Options"
                  active={activeScan === 'STOCKS_OPTIONS'}
                  onClick={() => runScanner('STOCKS_OPTIONS')}
                  color="blue"
                />
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
                            item.price_change_percentage_24h >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {item.symbol ? item.symbol[0] : '?'}
                        </div>
                        <div
                          className={`text-xs font-bold px-2 py-1 rounded bg-slate-900 ${
                            item.price_change_percentage_24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {item.price_change_percentage_24h >= 0 ? '+' : ''}
                          {item.price_change_percentage_24h.toFixed(2)}%
                        </div>
                      </div>
                      <div className="font-bold text-white group-hover:text-emerald-400 truncate">{item.name}</div>
                      <div className="text-xs text-slate-500 mb-2 flex justify-between">
                        <span>{item.symbol}</span>
                        {item.score && (
                          <span className="text-purple-400 flex items-center gap-1">
                            <Rocket className="w-3 h-3" /> Score: {item.score.toFixed(1)}
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-sm">${item.current_price < 0.01 ? item.current_price.toFixed(6) : item.current_price.toFixed(2)}</div>
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
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-xs font-bold bg-slate-800 rounded-full text-white">All</button>
                    <button className="px-3 py-1 text-xs font-bold text-slate-500 hover:text-white transition-colors">Crypto</button>
                    <button className="px-3 py-1 text-xs font-bold text-slate-500 hover:text-white transition-colors">Stocks</button>
                  </div>
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
                    <TickerRow symbol="NVDA" name="NVIDIA" price="890.10" change="+2.4%" isUp={true} />
                    <TickerRow symbol="BTC" name="Bitcoin" price="92,450" change="+1.2%" isUp={true} />
                    <TickerRow symbol="GME" name="GameStop" price="24.50" change="+12.4%" isUp={true} />
                    <TickerRow symbol="TSLA" name="Tesla" price="175.30" change="-1.5%" isUp={false} />
                    <TickerRow symbol="SOL" name="Solana" price="145.20" change="+5.1%" isUp={true} />
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
                <div id="tradingview_widget" className="w-full h-full"></div>
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

const ScannerButton = ({ icon, title, active, onClick, color }) => {
  const activeClasses = {
    emerald: 'bg-emerald-500/20 border-emerald-500 text-emerald-400',
    purple: 'bg-purple-500/20 border-purple-500 text-purple-400',
    orange: 'bg-orange-500/20 border-orange-500 text-orange-400',
    blue: 'bg-blue-500/20 border-blue-500 text-blue-400'
  };

  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
        active ? activeClasses[color] || activeClasses.emerald : 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300'
      }`}
    >
      {icon}
      <span className="text-xs font-bold">{title}</span>
    </button>
  );
};

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
  </div>
);

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
  const [weirdNews, setWeirdNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);

  const generateRant = () => {
    const noun = CONSPIRACY_NOUNS[Math.floor(Math.random() * CONSPIRACY_NOUNS.length)];
    const verb = CONSPIRACY_VERBS[Math.floor(Math.random() * CONSPIRACY_VERBS.length)];
    const object = CONSPIRACY_OBJECTS[Math.floor(Math.random() * CONSPIRACY_OBJECTS.length)];
    setJonesRant(`LISTEN TO ME! ${noun.toUpperCase()} ARE ${verb.toUpperCase()} ${object.toUpperCase()}! IT'S IN THE DOCUMENTS!`);
  };

  useEffect(() => {
    fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_FEEDS.conspiracy.url)}`)
      .then((r) => r.json())
      .then((d) => d.status === 'ok' && setWeirdNews(d.items.slice(0, 5)));
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
  const [tickerItems, setTickerItems] = useState([]);

  useEffect(() => {
    if (!VALID_TABS.has(activeTab)) {
      setActiveTab('home');
    }
  }, [activeTab]);

  useEffect(() => {
    fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_FEEDS.political.url)}`)
      .then((res) => res.json())
      .then((data) => data.status === 'ok' && setTickerItems(data.items.slice(0, 10).map((a) => a.title)));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 relative overflow-hidden flex flex-col">
      <PortalHeader activeTab={activeTab} setActiveTab={setActiveTab} tickerItems={tickerItems} onBack={() => setSelectedArticle(null)} isReading={!!selectedArticle} />

      <main className="relative z-20 flex-grow">
        {selectedArticle ? (
          <div className="container mx-auto px-4 py-6 max-w-4xl">
            <SatiricalReader article={selectedArticle} onBack={() => setSelectedArticle(null)} />
          </div>
        ) : (
          <>
            <div className="md:hidden flex gap-2 mb-2 overflow-x-auto pb-2 px-4 mt-4 bg-white border-b border-slate-200">
               {['home', 'tracker', 'military', 'conspiracy', 'finance', 'shopping'].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-shrink-0 px-4 py-2 rounded-full font-bold text-xs uppercase border ${activeTab === tab ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200'}`}>
                  {tab === 'tracker' ? 'WTFWN' : tab === 'home' ? 'Home' : tab === 'conspiracy' ? 'Truth' : tab}
                </button>
              ))}
            </div>

            {activeTab === 'home' && <YahooStyleHome onArticleSelect={setSelectedArticle} setActiveTab={setActiveTab} />}
            {activeTab === 'tracker' && <WTFWNPage setActiveTab={setActiveTab} />}
            {activeTab === 'military' && <MilitaryDashboard onArticleSelect={setSelectedArticle} setActiveTab={setActiveTab} feed={SATIRE_HEADLINES} />}
            {activeTab === 'conspiracy' && <ConspiracyPage onArticleSelect={setSelectedArticle} setActiveTab={setActiveTab} />}
            {activeTab === 'finance' && <StockAI_Simple />}
            {activeTab === 'shopping' && <ShoppingPage setActiveTab={setActiveTab} />}
            {activeTab === 'satire' && <SatirePage feed={SATIRE_HEADLINES} onArticleSelect={setSelectedArticle} setActiveTab={setActiveTab} />}
            {activeTab === 'horoscopes' && <HoroscopesPage setActiveTab={setActiveTab} />}
            {activeTab === 'about' && <AboutPage />}
            {activeTab === 'privacy' && <PrivacyPage />}
            {activeTab === 'terms' && <TermsPage />}
          </>
        )}
      </main>

      {!selectedArticle && <Footer setActiveTab={setActiveTab} />}
      <PoliticalZoo />
    </div>
  );
};

export default App;
