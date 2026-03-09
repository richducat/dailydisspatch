const FEED_CACHE_PREFIX = 'dailydisspatch:feed-cache:';
const FEED_CACHE_TTL_MS = 15 * 60 * 1000;

export const RSS_FEEDS = {
  political: { url: 'https://feeds.npr.org/1014/rss.xml', name: 'Political Intel' },
  defense: { url: 'https://www.military.com/rss-feeds/content?type=news', name: 'Military Ops' },
  conspiracy: { url: 'https://www.upi.com/rss/Odd_News/', name: 'The Files' }
};

const FEED_FALLBACKS = {
  political: [
    {
      title: 'Capitol negotiators promise a breakthrough right after one more televised argument.',
      description: 'Leaders say progress is near, pending several more appearances in front of cameras.',
      link: '#',
      pubDate: '2026-03-09 08:00:00'
    },
    {
      title: 'White House staffers unveil a fresh plan to explain the old plan.',
      description: 'Briefing binders were reportedly color-coded for maximum confidence and minimal clarity.',
      link: '#',
      pubDate: '2026-03-09 07:30:00'
    },
    {
      title: 'Senate aides describe budget talks as constructive, tense, and fully catered.',
      description: 'Negotiators claim morale remains stable so long as snacks continue to arrive on schedule.',
      link: '#',
      pubDate: '2026-03-09 07:00:00'
    },
    {
      title: 'Polling memo confirms voters still prefer lower prices and fewer surprises.',
      description: 'Analysts say the electorate remains stubbornly attached to obvious outcomes.',
      link: '#',
      pubDate: '2026-03-09 06:30:00'
    },
    {
      title: 'Campaign war rooms pivot from momentum to “selective expectation management.”',
      description: 'Strategists insist the message is landing, even if only on internal Slack threads.',
      link: '#',
      pubDate: '2026-03-09 06:00:00'
    },
    {
      title: 'Committee hearing expands to include charts, countercharts, and one accidental hot mic.',
      description: 'Sources say the charts were clear, the conclusions less so.',
      link: '#',
      pubDate: '2026-03-09 05:30:00'
    }
  ],
  defense: [
    {
      title: 'Defense analysts monitor shipping lanes after another tense overnight exchange.',
      description: 'Officials say the situation remains fluid but contained.',
      link: '#',
      pubDate: '2026-03-09 08:10:00'
    },
    {
      title: 'Joint exercise briefing highlights logistics, readiness, and coffee consumption.',
      description: 'Commanders called the operation disciplined, measured, and heavily caffeinated.',
      link: '#',
      pubDate: '2026-03-09 07:40:00'
    },
    {
      title: 'Satellite review shows increased activity near a long-watched border corridor.',
      description: 'Regional observers say the movement merits attention but not panic.',
      link: '#',
      pubDate: '2026-03-09 07:05:00'
    },
    {
      title: 'Pentagon readout emphasizes deterrence, coordination, and secure comms uptime.',
      description: 'Officials reiterated that readiness depends on both posture and patience.',
      link: '#',
      pubDate: '2026-03-09 06:15:00'
    },
    {
      title: 'Naval planners update deployment timelines as weather and politics collide.',
      description: 'Operational shifts were described as minor but strategically annoying.',
      link: '#',
      pubDate: '2026-03-09 05:45:00'
    }
  ],
  conspiracy: [
    {
      title: 'Local residents report suspicious lights, ordinary explanations immediately rejected.',
      description: 'Witnesses remain unconvinced by officials citing weather balloons and perspective.',
      link: '#',
      pubDate: '2026-03-09 08:20:00'
    },
    {
      title: 'Internet detectives connect three unrelated events using string, maps, and confidence.',
      description: 'The thread currently spans twelve posts and one heavily annotated screenshot.',
      link: '#',
      pubDate: '2026-03-09 07:50:00'
    },
    {
      title: 'Neighborhood group warns that the pigeons are “coordinated.”',
      description: 'Experts declined to comment on the birds and quietly left the meeting.',
      link: '#',
      pubDate: '2026-03-09 07:10:00'
    },
    {
      title: 'Late-night radio host cites “documents” that may have been takeout menus.',
      description: 'Callers described the evidence as compelling, if somewhat greasy.',
      link: '#',
      pubDate: '2026-03-09 06:35:00'
    },
    {
      title: 'Fresh theory links smart toasters, moon phases, and municipal zoning.',
      description: 'No part of the claim was verified, which only strengthened belief in it.',
      link: '#',
      pubDate: '2026-03-09 05:55:00'
    }
  ]
};

const memoryCache = new Map();
const inFlightRequests = new Map();

const normalizeFeedItem = (feedKey, item, index) => ({
  guid: item.guid || `${feedKey}-${index}-${item.link || item.title || 'item'}`,
  title: item.title || 'Untitled update',
  link: item.link || '#',
  pubDate: item.pubDate || '',
  author: item.author || RSS_FEEDS[feedKey]?.name || 'Daily Disspatch',
  description: item.description || item.content || item.title || '',
  content: item.content || item.description || '',
  thumbnail: item.thumbnail || '',
  enclosure: item.enclosure && typeof item.enclosure === 'object' ? item.enclosure : null
});

const getFallbackItems = (feedKey) =>
  (FEED_FALLBACKS[feedKey] || []).map((item, index) => normalizeFeedItem(feedKey, item, index));

const readStorageCache = (feedKey) => {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(`${FEED_CACHE_PREFIX}${feedKey}`);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed?.timestamp || !Array.isArray(parsed.items)) return null;
    if (Date.now() - parsed.timestamp > FEED_CACHE_TTL_MS) return null;

    return {
      timestamp: parsed.timestamp,
      items: parsed.items.map((item, index) => normalizeFeedItem(feedKey, item, index))
    };
  } catch (error) {
    return null;
  }
};

const writeStorageCache = (feedKey, items) => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(
      `${FEED_CACHE_PREFIX}${feedKey}`,
      JSON.stringify({
        timestamp: Date.now(),
        items
      })
    );
  } catch (error) {
    // Ignore storage failures; the in-memory cache is enough for this session.
  }
};

const readCachedFeed = (feedKey) => {
  const memoryEntry = memoryCache.get(feedKey);
  if (memoryEntry && Date.now() - memoryEntry.timestamp <= FEED_CACHE_TTL_MS) {
    return memoryEntry;
  }

  const storageEntry = readStorageCache(feedKey);
  if (storageEntry) {
    memoryCache.set(feedKey, storageEntry);
    return storageEntry;
  }

  return null;
};

const saveCachedFeed = (feedKey, items) => {
  const entry = {
    timestamp: Date.now(),
    items
  };

  memoryCache.set(feedKey, entry);
  writeStorageCache(feedKey, items);
  return entry;
};

export const getFeedSnapshot = (feedKey, limit = 0) => {
  const cachedItems = readCachedFeed(feedKey)?.items;
  const items = cachedItems?.length ? cachedItems : getFallbackItems(feedKey);

  return limit > 0 ? items.slice(0, limit) : items;
};

const fetchFeedFromRemote = async (feedKey) => {
  const feed = RSS_FEEDS[feedKey];
  if (!feed?.url) {
    throw new Error(`Unknown feed "${feedKey}"`);
  }

  const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`);
  if (!response.ok) {
    throw new Error(`${feedKey} feed failed with status ${response.status}`);
  }

  const json = await response.json();
  if (json.status !== 'ok' || !Array.isArray(json.items) || json.items.length === 0) {
    throw new Error(`${feedKey} feed returned no usable items`);
  }

  return json.items.map((item, index) => normalizeFeedItem(feedKey, item, index));
};

export const fetchFeedItems = async (feedKey, options = {}) => {
  const { limit = 6 } = options;
  const cachedItems = getFeedSnapshot(feedKey);

  const freshCache = readCachedFeed(feedKey);
  if (freshCache?.items?.length) {
    return freshCache.items.slice(0, limit);
  }

  if (!inFlightRequests.has(feedKey)) {
    inFlightRequests.set(
      feedKey,
      fetchFeedFromRemote(feedKey)
        .then((items) => {
          saveCachedFeed(feedKey, items);
          return items;
        })
        .catch((error) => {
          console.error(`${feedKey} feed failed`, error);
          return cachedItems.length ? cachedItems : getFallbackItems(feedKey);
        })
        .finally(() => {
          inFlightRequests.delete(feedKey);
        })
    );
  }

  const items = await inFlightRequests.get(feedKey);
  return items.slice(0, limit);
};
