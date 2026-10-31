/*!
 * EdukacjaBudowlana – „Usługi” w sklepie (#sklep), wersja 2026-10-30
 * Dokleja na końcu widoku sklepu sekcję z usługami (np. e-book na zamówienie).
 * Nową usługę dopisz do tablicy USLUGI. Pole „url” = link do koszyka Easytools;
 * puste pole → przycisk „Zamów e-book” (e-mail).
 * Wymaga jednej linii w index.html przed </body>:
 *   <script src="uslugi-modul.js?v=20261030" defer></script>
 * oraz grafiki w img/shop/ (ścieżka w polu „img”).
 */
(function () {
  'use strict';

  var EMAIL = 'biuro@edukacjabudowlana.pl';
  var USLUGI = [
    {
      id: 'ebook-na-zamowienie',
      tag: 'Usługa',
      title: 'E-book inwestora na zamówienie',
      lead: 'Budujesz dom? Prześlij nam swój projekt, a napiszemy e-book dla Ciebie: co zaplanować, co sprawdzać i na co uważać – wiedza inżynierów dopasowana do Twojej budowy.',
      points: [
        'Opracowanie oparte na Twoim projekcie domu',
        'Co zaplanować, co sprawdzać i na co uważać na kolejnych etapach',
        'Masz inny temat? Opracujemy go dla Ciebie'
      ],
      steps: ['Prześlij projekt lub opisz temat', 'Płacisz stałą cenę – bez wyceny', 'Dostajesz e-book do pobrania'],
      price: '350 zł',           // stała cena z Easytools – puste = napis „Stała cena, ustalona z góry”
      url: 'https://cart.easy.tools/checkout/26354048/e-boook-na-twoje-indywidualne-zlecenie',
      img: 'img/shop/ebook-na-zamowienie.webp',
      alt: 'Plakat: Budujesz dom? Prześlij nam swój projekt. Napiszemy e-book dla Ciebie.'
    }
  ];

  var E = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]; }); };

  function card(u) {
    var mail = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(u.title) + '&body=' + encodeURIComponent('Dzień dobry,\n\nchcę zamówić: ' + u.title + '.\nKrótki opis budowy / tematu:\n\n');
    var cta = u.url
      ? '<a class="ux-btn ux-primary" href="' + E(u.url) + '" target="_blank" rel="noopener">Zamów' + (u.price ? ' – ' + E(u.price) : '') + '</a><a class="ux-btn" href="' + mail + '">Zadaj pytanie</a>'
      : '<a class="ux-btn ux-primary" href="' + mail + '">Zamów e-book</a><a class="ux-btn" href="#kontakt">Formularz kontaktowy</a>';
    return '<article class="ux-card" id="usluga-' + E(u.id) + '">' +
      '<div class="ux-img"><img src="' + E(u.img) + '" alt="' + E(u.alt || u.title) + '" loading="lazy" onerror="var c=this.closest(\'.ux-card\');c.classList.add(\'ux-noimg\');this.parentNode.remove()"></div>' +
      '<div class="ux-txt"><span class="ux-tag">' + E(u.tag || 'Usługa') + '</span><h3>' + E(u.title) + '</h3>' +
        '<p class="ux-lead">' + E(u.lead) + '</p>' +
        (u.points && u.points.length ? '<ul class="ux-pts">' + u.points.map(function (p) { return '<li>' + E(p) + '</li>'; }).join('') + '</ul>' : '') +
        (u.steps && u.steps.length ? '<ol class="ux-steps">' + u.steps.map(function (s, i) { return '<li><b>' + (i + 1) + '</b><span>' + E(s) + '</span></li>'; }).join('') + '</ol>' : '') +
        '<div class="ux-buy"><div class="ux-price">' + (u.price ? '<b>' + E(u.price) + '</b><small>stała cena, ustalona z góry</small>' : '<b>Stała cena</b><small>ustalona z góry – bez wyceny i niespodzianek</small>') + '</div><div class="ux-cta">' + cta + '</div></div>' +
      '</div></article>';
  }

  var CSS =
    '.ux-sec{border-top:1px solid var(--line,#CFCAC2)}.ux-sec .wrap{padding-block:40px 56px}' +
    '.ux-eyebrow{font:700 13px/1 var(--f-display,sans-serif);letter-spacing:.14em;text-transform:uppercase;color:var(--orange,#B5470A);margin:0 0 8px}' +
    '.ux-sec h2{font:800 34px/1.05 var(--f-display,sans-serif);text-transform:uppercase;margin:0 0 6px}.ux-sub{color:var(--ink-2,#4F4B45);margin:0 0 22px;max-width:70ch}' +
    '.ux-card{display:grid;grid-template-columns:minmax(220px,340px) minmax(0,1fr);gap:28px;background:#fff;border:1px solid var(--line,#CFCAC2);border-radius:14px;padding:22px;margin-bottom:18px;box-shadow:0 1px 2px rgba(30,34,39,.06)}' +
    '.ux-img img{display:block;width:100%;height:auto;border-radius:10px;box-shadow:0 8px 24px rgba(30,34,39,.14)}' +
    '.ux-tag{display:inline-block;background:var(--orange-soft,#F8E1D0);color:var(--orange,#B5470A);font:700 12.5px var(--f-ui,sans-serif);padding:4px 10px;border-radius:999px}' +
    '.ux-txt h3{font:800 28px/1.1 var(--f-display,sans-serif);text-transform:uppercase;margin:10px 0 8px}.ux-lead{font-size:17px;line-height:1.55;color:var(--ink-2,#4F4B45);margin:0 0 14px}' +
    '.ux-pts{list-style:none;padding:0;margin:0 0 16px;display:grid;gap:7px}.ux-pts li{position:relative;padding-left:26px;font-size:15.5px}' +
    '.ux-pts li:before{content:"";position:absolute;left:0;top:3px;width:16px;height:16px;border-radius:50%;background:var(--signal,#F26B1D) url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27%3E%3Cpath d=%27M4 8.5l2.5 2.5L12 5.5%27 fill=%27none%27 stroke=%27%23fff%27 stroke-width=%272%27/%3E%3C/svg%3E") center/12px no-repeat}' +
    '.ux-steps{list-style:none;padding:0;margin:0 0 18px;display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.ux-steps li{display:flex;gap:9px;align-items:center;background:var(--surface,#F6F4F0);border:1px solid var(--line,#CFCAC2);border-radius:10px;padding:10px 12px;font-size:14px;line-height:1.3}' +
    '.ux-steps b{flex:none;width:26px;height:26px;border-radius:50%;display:grid;place-items:center;background:var(--ink,#1E2227);color:#fff;font:700 14px var(--f-display,sans-serif)}' +
    '.ux-buy{display:flex;flex-wrap:wrap;gap:14px 22px;align-items:center;justify-content:space-between;border-top:1px solid var(--line,#CFCAC2);padding-top:16px}' +
    '.ux-price b{display:block;font:800 24px/1.1 var(--f-display,sans-serif)}.ux-price small{color:var(--ink-3,#736E66);font-size:13.5px}' +
    '.ux-cta{display:flex;flex-wrap:wrap;gap:8px}.ux-btn{display:inline-flex;align-items:center;border:1px solid var(--line-2,#B9B3AA);border-radius:8px;padding:11px 16px;font:700 15px var(--f-ui,sans-serif);color:var(--ink,#1E2227);text-decoration:none;background:var(--surface,#F6F4F0)}' +
    '.ux-btn:hover{border-color:var(--signal,#F26B1D)}.ux-primary{background:var(--signal,#F26B1D);border-color:var(--signal,#F26B1D);color:var(--on-signal,#1E2227)}.ux-primary:hover{filter:brightness(1.05)}' +
    '.ux-card.ux-noimg{grid-template-columns:1fr}' +
    '@media(max-width:820px){.ux-card{grid-template-columns:1fr;padding:16px}.ux-img{max-width:360px}.ux-steps{grid-template-columns:1fr}.ux-sec h2{font-size:28px}}';

  function mount() {
    var view = document.getElementById('view');
    if (!view || location.hash.replace('#', '') !== 'sklep') return;
    if (view.querySelector('[data-ux]')) return;
    if (!document.getElementById('ux-css')) { var s = document.createElement('style'); s.id = 'ux-css'; s.textContent = CSS; document.head.appendChild(s); }
    var sec = document.createElement('section');
    sec.className = 'section ux-sec'; sec.setAttribute('data-ux', ''); sec.id = 'uslugi';
    sec.innerHTML = '<div class="wrap"><p class="ux-eyebrow">Usługi</p><h2>Opracujemy to dla Ciebie</h2><p class="ux-sub">Gotowe e-booki to nie wszystko. Jeśli potrzebujesz materiału pod swój projekt albo temat, przygotujemy go na zamówienie.</p>' + USLUGI.map(card).join('') + '</div>';
    view.appendChild(sec);
  }
  function init() {
    var view = document.getElementById('view');
    if (!view) return setTimeout(init, 50);
    new MutationObserver(function () { mount(); }).observe(view, {childList: true});
    window.addEventListener('hashchange', function () { setTimeout(mount, 0); });
    mount();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
