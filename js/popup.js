/* Bohème Aesthetics — 10% Off Popup
   Self-contained: injects its own CSS, HTML, and handles all logic.
   Add GHL webhook URL before going live. */
(function () {
  'use strict';

  var GHL_WEBHOOK = 'https://services.leadconnectorhq.com/hooks/FcnDS1vR1zIpQ8YaaESA/webhook-trigger/d2d8ec0f-f967-4150-a726-7a4d48efe1fb';
  var STORAGE_KEY = 'boheme-popup-seen';

  if (sessionStorage.getItem(STORAGE_KEY)) return;

  /* ── CSS ── */
  var style = document.createElement('style');
  style.textContent = [
    '#bpop{position:fixed;inset:0;z-index:9000;display:flex;align-items:center;justify-content:center;padding:1.5rem;background:rgba(44,44,44,0);transition:background .35s ease;pointer-events:none;}',
    '#bpop.open{background:rgba(44,44,44,0.58);pointer-events:all;}',
    '#bpop-modal{background:#FAF7F2;border:1px solid rgba(44,44,44,0.1);border-radius:18px;padding:3rem 2.5rem 2.5rem;max-width:460px;width:100%;position:relative;transform:translateY(18px) scale(0.97);opacity:0;transition:transform .42s cubic-bezier(.16,1,.3,1),opacity .32s ease;text-align:center;box-shadow:0 24px 80px rgba(44,44,44,0.16);}',
    '#bpop.open #bpop-modal{transform:translateY(0) scale(1);opacity:1;}',
    '#bpop-close{position:absolute;top:.85rem;right:.85rem;width:28px;height:28px;border-radius:50%;background:none;border:1px solid rgba(44,44,44,0.14);color:rgba(44,44,44,0.45);font-size:.72rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .14s,color .14s;font-family:inherit;}',
    '#bpop-close:hover{background:rgba(44,44,44,0.07);color:#2C2C2C;}',
    '.bpop-eye{font-size:.6rem;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:#8B9E7E;margin-bottom:.65rem;}',
    '.bpop-hed{font-family:"Cormorant Garamond",Georgia,serif;font-size:2.7rem;font-weight:300;line-height:1.05;color:#2C2C2C;margin-bottom:.85rem;}',
    '.bpop-hed em{font-style:italic;color:#B67A7A;}',
    '.bpop-sub{font-size:.84rem;color:rgba(44,44,44,.58);line-height:1.65;max-width:340px;margin:0 auto 1.65rem;}',
    '#bpop-form{display:flex;flex-direction:column;gap:.7rem;}',
    '#bpop-email{width:100%;padding:.875rem 1rem;background:#fff;border:1px solid rgba(44,44,44,.18);border-radius:8px;font-size:.95rem;font-family:"Inter",sans-serif;color:#2C2C2C;text-align:center;transition:border-color .18s;-webkit-appearance:none;appearance:none;}',
    '#bpop-email:focus{outline:none;border-color:#8B9E7E;}',
    '#bpop-email::placeholder{color:rgba(44,44,44,.26);}',
    '#bpop-email.err{border-color:rgba(180,60,60,.55);}',
    '#bpop-submit{width:100%;padding:.95rem;background:#2C2C2C;color:#FAF7F2;font-size:.82rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;border:none;border-radius:8px;cursor:pointer;font-family:"Inter",sans-serif;transition:background .14s,opacity .14s;}',
    '#bpop-submit:hover{background:#3D3D3D;}',
    '#bpop-submit:disabled{opacity:.42;cursor:not-allowed;}',
    '.bpop-micro{font-size:.6rem;color:rgba(44,44,44,.3);margin-top:.7rem;letter-spacing:.04em;}',
    '#bpop-ok{display:none;padding:.75rem 0;}',
    '.bpop-ok-icon{font-size:2.2rem;margin-bottom:.6rem;}',
    '.bpop-ok-hed{font-family:"Cormorant Garamond",Georgia,serif;font-size:1.9rem;font-weight:300;color:#2C2C2C;margin-bottom:.35rem;}',
    '.bpop-ok-sub{font-size:.82rem;color:rgba(44,44,44,.58);}',
    '@media(max-width:520px){#bpop{align-items:flex-end;padding:0;}#bpop-modal{border-radius:20px 20px 0 0;max-width:100%;padding:2.5rem 1.5rem 2.5rem;}.bpop-hed{font-size:2.2rem;}}'
  ].join('');
  document.head.appendChild(style);

  /* ── HTML ── */
  var wrap = document.createElement('div');
  wrap.innerHTML =
    '<div id="bpop" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Get 10% off your next online order">' +
      '<div id="bpop-modal">' +
        '<button id="bpop-close" aria-label="Close offer">✕</button>' +
        '<p class="bpop-eye">Exclusive Offer</p>' +
        '<h2 class="bpop-hed">10% Off<br><em>Your Next Order</em></h2>' +
        '<p class="bpop-sub">Join the Bohème inner circle. Get 10% off your next online order — plus first access to new treatments and skincare drops.</p>' +
        '<form id="bpop-form" novalidate>' +
          '<input type="email" id="bpop-email" placeholder="your@email.com" autocomplete="email" />' +
          '<button type="submit" id="bpop-submit">Unlock My 10% Off</button>' +
        '</form>' +
        '<p class="bpop-micro">No spam. Unsubscribe anytime.</p>' +
        '<div id="bpop-ok">' +
          '<div class="bpop-ok-icon">✓</div>' +
          '<p class="bpop-ok-hed">You’re in.</p>' +
          '<p class="bpop-ok-sub">Check your inbox for your discount code.</p>' +
        '</div>' +
      '</div>' +
    '</div>';
  document.body.appendChild(wrap);

  /* ── Logic ── */
  var overlay   = document.getElementById('bpop');
  var closeBtn  = document.getElementById('bpop-close');
  var form      = document.getElementById('bpop-form');
  var emailEl   = document.getElementById('bpop-email');
  var submitBtn = document.getElementById('bpop-submit');
  var micro     = document.querySelector('.bpop-micro');
  var success   = document.getElementById('bpop-ok');

  function openPop() {
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(function () { emailEl.focus(); }, 420);
  }

  function closePop() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    sessionStorage.setItem(STORAGE_KEY, '1');
  }

  setTimeout(openPop, 5000);

  closeBtn.addEventListener('click', closePop);
  overlay.addEventListener('click', function (e) { if (e.target === overlay) closePop(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closePop();
  });

  function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    var email = emailEl.value.trim();
    if (!validEmail(email)) { emailEl.classList.add('err'); emailEl.focus(); return; }
    emailEl.classList.remove('err');
    submitBtn.disabled = true;
    submitBtn.textContent = '…';

    try {
      if (GHL_WEBHOOK !== 'YOUR_GHL_WEBHOOK_URL_HERE') {
        await fetch(GHL_WEBHOOK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email:  email,
            source: 'Bohème Aesthetics — 10% Off Popup',
            tags:   ['popup-signup', '10-percent-off', 'online-orders']
          })
        });
      }
    } catch (err) {
      console.error('[Bohème popup]', err);
    }

    form.style.display = 'none';
    if (micro) micro.style.display = 'none';
    success.style.display = 'block';
    setTimeout(closePop, 3500);
  });

  emailEl.addEventListener('input', function () { emailEl.classList.remove('err'); });
}());
