(function (window, document) {
  'use strict';

  // One initializer for both React and standalone articles. Preview builds
  // must not send traffic into the production property.
  if (!['dailydisspatch.com', 'www.dailydisspatch.com'].includes(window.location.hostname)) return;
  if (window.__dailyDisspatchAnalyticsInitialized) return;
  window.__dailyDisspatchAnalyticsInitialized = true;

  var measurementId = 'G-E90B5KHBVV';
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', measurementId);

  if (!document.querySelector('script[src="https://www.googletagmanager.com/gtag/js?id=' + measurementId + '"]')) {
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
    document.head.appendChild(script);
  }
})(window, document);
