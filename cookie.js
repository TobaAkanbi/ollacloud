/* OLLA CLOUD — Cookie consent banner */
(function () {
  var STORAGE_KEY = 'olla_cookie_consent';

  // Don't show if already answered
  if (localStorage.getItem(STORAGE_KEY)) return;

  var css = `
    #olla-cookie-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,.45);
      z-index: 9000;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      padding: 24px;
      animation: cookieFadeIn .3s ease;
    }
    @keyframes cookieFadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    #olla-cookie-box {
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 24px 64px rgba(0,0,0,.18);
      padding: 32px 36px;
      max-width: 560px;
      width: 100%;
      animation: cookieSlideUp .35s cubic-bezier(.22,.68,0,1.2);
    }
    @keyframes cookieSlideUp {
      from { transform: translateY(40px); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }
    #olla-cookie-box .ck-logo {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
    }
    #olla-cookie-box .ck-logo svg {
      flex-shrink: 0;
    }
    #olla-cookie-box .ck-logo span {
      font-family: -apple-system, 'Space Grotesk', sans-serif;
      font-weight: 700;
      font-size: 15px;
      color: #0A0A0B;
      letter-spacing: -.02em;
    }
    #olla-cookie-box h2 {
      font-family: -apple-system, 'Space Grotesk', sans-serif;
      font-size: 18px;
      font-weight: 700;
      color: #0A0A0B;
      letter-spacing: -.02em;
      margin: 0 0 10px;
    }
    #olla-cookie-box p {
      font-family: -apple-system, 'Inter', sans-serif;
      font-size: 14px;
      line-height: 1.65;
      color: #5A6578;
      margin: 0 0 24px;
    }
    #olla-cookie-box p a {
      color: #FF2D46;
      text-decoration: underline;
      text-underline-offset: 3px;
    }
    #olla-cookie-box p a:hover {
      color: #cc2438;
    }
    .ck-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    .ck-btn {
      font-family: -apple-system, 'Space Grotesk', sans-serif;
      font-size: 14px;
      font-weight: 600;
      padding: 11px 24px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      transition: transform .18s ease, box-shadow .18s ease, background .18s ease;
      line-height: 1;
    }
    .ck-btn:hover { transform: translateY(-2px); }
    .ck-accept {
      background: #0A0A0B;
      color: #fff;
    }
    .ck-accept:hover {
      background: #222;
      box-shadow: 0 8px 20px rgba(0,0,0,.2);
    }
    .ck-decline {
      background: transparent;
      color: #5A6578;
      border: 1px solid #D8DDE6;
    }
    .ck-decline:hover {
      background: #F6F8FB;
      box-shadow: none;
    }
    @media (max-width: 480px) {
      #olla-cookie-box { padding: 24px 20px; }
      .ck-btn { width: 100%; text-align: center; }
    }
  `;

  var html = `
    <div id="olla-cookie-overlay">
      <div id="olla-cookie-box" role="dialog" aria-modal="true" aria-labelledby="ck-title">
        <h2 id="ck-title">Cookie Notice</h2>
        <p>
          We use cookies to improve your experience on our website, understand how our services are used, and personalise content. By clicking <strong>Accept</strong>, you consent to our use of cookies. You can <strong>Decline</strong> to opt out of non-essential cookies.<br><br>
          For more details on how we collect and use your data, please read our
          <a href="privacy.html" target="_blank" rel="noopener">Privacy Policy</a>.
        </p>
        <div class="ck-actions">
          <button class="ck-btn ck-accept" id="ck-accept-btn">Accept all cookies</button>
          <button class="ck-btn ck-decline" id="ck-decline-btn">Decline</button>
        </div>
      </div>
    </div>
  `;

  // ── IP collection ──────────────────────────────────────────────
  // To change the destination sheet, update this URL.
  // Get a new URL from: Extensions → Apps Script → Deploy → Manage deployments
  var SHEET_URL = 'https://script.google.com/macros/s/AKfycbwht2NMmK0Hl2kEHbbjtuC-dmT-lphM0SQNoxPQMLMneTK65WlpQGcUOJTrK2j2MFXmMw/exec';

  function collectIP() {
    fetch('https://ipapi.co/json/')
      .then(function(r) { return r.json(); })
      .then(function(geo) {
        fetch(SHEET_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            timestamp: new Date(Date.now() + 3600000).toISOString().replace('T', ' ').slice(0, 19),
            ip:        geo.ip        || '',
            country:   geo.country_name || '',
            city:      geo.city      || '',
            page:      window.location.href
          })
        });
      })
      .catch(function() {});
  }
  // ───────────────────────────────────────────────────────────────

  function dismiss(choice) {
    localStorage.setItem(STORAGE_KEY, choice);
    if (choice === 'accepted') collectIP();
    var overlay = document.getElementById('olla-cookie-overlay');
    if (overlay) {
      overlay.style.animation = 'cookieFadeIn .25s ease reverse forwards';
      setTimeout(function () { overlay.remove(); }, 260);
    }
  }

  function init() {
    // Inject styles
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // Inject HTML
    var tmp = document.createElement('div');
    tmp.innerHTML = html;
    document.body.appendChild(tmp.firstElementChild);

    // Bind buttons
    document.getElementById('ck-accept-btn').addEventListener('click', function () { dismiss('accepted'); });
    document.getElementById('ck-decline-btn').addEventListener('click', function () { dismiss('declined'); });

    // Close on overlay background click
    document.getElementById('olla-cookie-overlay').addEventListener('click', function (e) {
      if (e.target.id === 'olla-cookie-overlay') dismiss('declined');
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') dismiss('declined');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
