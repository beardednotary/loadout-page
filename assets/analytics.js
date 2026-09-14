// Google Analytics 4 with Consent Mode v2. Include in <head> on every page, before any other script.
// Analytics cookies stay off until the visitor clicks Allow; until then GA only receives cookieless signals.
(() => {
  const MEASUREMENT_ID = 'G-J943N748QB';
  const STORAGE_KEY = 'loadout-analytics-consent'; // 'granted' | 'denied'
  const COOKIE_LIFETIME_S = 60 * 60 * 24 * 395; // 13 months instead of GA's 2-year default

  const readChoice = () => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  };
  const writeChoice = (value) => {
    try {
      if (value) localStorage.setItem(STORAGE_KEY, value);
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Storage blocked: the banner simply reappears next visit.
    }
  };

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  // Consent defaults must be in place before the tag loads. No ads are run, so ad consent is always denied.
  gtag('consent', 'default', {
    analytics_storage: readChoice() === 'granted' ? 'granted' : 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500,
  });
  gtag('js', new Date());
  gtag('config', MEASUREMENT_ID, { cookie_expires: COOKIE_LIFETIME_S });

  const tag = document.createElement('script');
  tag.async = true;
  tag.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(tag);

  /** For page code, e.g. loadoutTrack('generate_lead', { form_location: 'hero' }). */
  window.loadoutTrack = (name, params = {}) => gtag('event', name, params);

  /** Removes GA's own cookies (_ga, _ga_<id>) when someone withdraws consent. */
  function clearAnalyticsCookies() {
    const host = location.hostname;
    const domains = ['', host, `.${host}`, `.${host.split('.').slice(-2).join('.')}`];
    for (const cookie of document.cookie.split(';')) {
      const name = cookie.split('=')[0].trim();
      if (!name.startsWith('_ga')) continue;
      for (const domain of domains) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain ? `; domain=${domain}` : ''}`;
      }
    }
  }

  const CSS = `
    #lo-consent { position: fixed; left: 50%; bottom: 16px; z-index: 1000; display: flex; align-items: center; gap: 16px; width: min(680px, calc(100% - 24px)); padding: 12px 12px 12px 18px; transform: translateX(-50%); border: 1px solid #393c41; border-radius: 8px; background: #25272a; color: #e8eaed; box-shadow: 0 20px 50px -20px rgba(0, 0, 0, 0.7); font: 400 14px/1.45 Inter, "Segoe UI", system-ui, sans-serif; }
    #lo-consent p { flex: 1; margin: 0; }
    #lo-consent a { color: #38c6f4; text-underline-offset: 3px; }
    #lo-consent .lo-actions { display: flex; flex: none; gap: 8px; }
    #lo-consent button { height: 36px; padding: 0 14px; border: 1px solid #45484e; border-radius: 4px; background: transparent; color: #e8eaed; font: 600 11px/1 Montserrat, "Segoe UI", sans-serif; letter-spacing: 0.14em; text-transform: uppercase; cursor: pointer; }
    #lo-consent button:hover { border-color: #a7acb2; }
    #lo-consent .lo-allow { border-color: #38c6f4; background: #38c6f4; color: #121315; }
    #lo-consent .lo-allow:hover { filter: brightness(1.1); }
    #lo-consent button:focus-visible { outline: 2px solid #38c6f4; outline-offset: 2px; }
    @media (max-width: 560px) { #lo-consent { flex-direction: column; align-items: stretch; } #lo-consent .lo-actions { justify-content: flex-end; } }
  `;

  function setChoice(granted) {
    writeChoice(granted ? 'granted' : 'denied');
    gtag('consent', 'update', { analytics_storage: granted ? 'granted' : 'denied' });
    if (!granted) clearAnalyticsCookies();
    document.getElementById('lo-consent')?.remove();
  }

  function showBanner() {
    if (document.getElementById('lo-consent')) return;
    if (!document.getElementById('lo-consent-style')) {
      const style = document.createElement('style');
      style.id = 'lo-consent-style';
      style.textContent = CSS;
      document.head.appendChild(style);
    }
    const bar = document.createElement('div');
    bar.id = 'lo-consent';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Analytics cookie choice');
    bar.innerHTML =
      '<p>We use Google Analytics cookies to see how people find LoadOut. <a href="/privacy#website">Details</a></p>' +
      '<div class="lo-actions"><button type="button" data-choice="denied">No thanks</button><button type="button" class="lo-allow" data-choice="granted">Allow</button></div>';
    bar.addEventListener('click', (event) => {
      const choice = event.target.closest('button')?.dataset.choice;
      if (choice) setChoice(choice === 'granted');
    });
    document.body.appendChild(bar);
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (!readChoice()) showBanner();
  });

  // Anything marked data-consent-settings (e.g. the footer's "Cookie settings") reopens the choice.
  document.addEventListener('click', (event) => {
    if (!event.target.closest?.('[data-consent-settings]')) return;
    event.preventDefault();
    writeChoice(null);
    showBanner();
  });
})();
