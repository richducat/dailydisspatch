import { useEffect } from 'react';

const ANALYTICS_ID = 'G-E90B5KHBVV';
const ADSENSE_CLIENT = 'ca-pub-9665484869013517';
const LIVE_HOSTS = new Set(['dailydisspatch.com', 'www.dailydisspatch.com']);

const injectScript = ({ src, attributes = {} }) => {
  const existing = document.querySelector(`script[src="${src}"]`);
  if (existing) return existing;

  const script = document.createElement('script');
  script.src = src;
  script.async = true;

  Object.entries(attributes).forEach(([key, value]) => {
    if (value != null) {
      script.setAttribute(key, value);
    }
  });

  document.head.appendChild(script);
  return script;
};

const initializeAds = () => {
  if (typeof window === 'undefined' || typeof window.adsbygoogle?.push !== 'function') {
    return;
  }

  document.querySelectorAll('ins.adsbygoogle').forEach((slot) => {
    if (slot.dataset.ddInit === '1' || slot.dataset.adStatus) {
      return;
    }

    try {
      window.adsbygoogle.push({});
      slot.dataset.ddInit = '1';
    } catch (error) {
      if (!String(error?.message || '').toLowerCase().includes('already')) {
        console.error('AdSense slot init failed', error);
      }
    }
  });
};

const shouldLoadThirdParty = () => {
  if (typeof window === 'undefined') return false;
  return LIVE_HOSTS.has(window.location.hostname);
};

const scheduleIdle = (callback) => {
  if (typeof window === 'undefined') return () => {};

  if ('requestIdleCallback' in window) {
    const id = window.requestIdleCallback(callback, { timeout: 2000 });
    return () => window.cancelIdleCallback(id);
  }

  const timeoutId = window.setTimeout(callback, 1200);
  return () => window.clearTimeout(timeoutId);
};

const ThirdPartyBoot = () => {
  useEffect(() => {
    if (!shouldLoadThirdParty()) return undefined;

    let observer;
    let disposed = false;

    const boot = () => {
      if (disposed) return;

      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function gtag() {
        window.dataLayer.push(arguments);
      };

      injectScript({
        src: `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_ID}`
      });

      window.gtag('js', new Date());
      window.gtag('config', ANALYTICS_ID, {
        anonymize_ip: true
      });

      const adsScript = injectScript({
        src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`,
        attributes: {
          crossorigin: 'anonymous'
        }
      });

      const onAdsReady = () => initializeAds();
      adsScript.addEventListener('load', onAdsReady, { once: true });

      if (typeof window.adsbygoogle?.push === 'function') {
        initializeAds();
      }

      observer = new MutationObserver(() => {
        initializeAds();
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    };

    const cancelIdle = scheduleIdle(boot);

    return () => {
      disposed = true;
      cancelIdle();
      if (observer) observer.disconnect();
    };
  }, []);

  return null;
};

export default ThirdPartyBoot;
