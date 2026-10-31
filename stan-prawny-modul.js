/*!
 * EdukacjaBudowlana – nota „Stan prawny” w artykułach (wersja 2026-10-30)
 * W artykułach, które powołują się na rozporządzenie z 12 kwietnia 2002 r. w sprawie warunków
 * technicznych (WT 2002), wstawia na początku treści krótką ramkę z aktualnym stanem prawnym.
 * Artykuły, które już omawiają art. 102a Prawa budowlanego albo mają ramkę z danych (pole law, funkcja wtNote), są pomijane.
 * Przy zmianie stanu prawnego (np. ogłoszeniu nowych WT) wystarczy zmienić tekst w NOTA.
 * Wymaga jednej linii w index.html przed </body>:
 *   <script src="stan-prawny-modul.js?v=20261030" defer></script>
 */
(function () {
  'use strict';

  var NOTA = {
    tytul: 'Stan prawny na 30 października 2026 r.',
    tekst: 'Rozporządzenie w sprawie warunków technicznych, jakim powinny odpowiadać budynki i ich usytuowanie (z 12 kwietnia 2002 r.), na które powołuje się ten artykuł, przestało obowiązywać we wrześniu 2026 r. Nowe rozporządzenie nie zostało jeszcze ogłoszone. Przez 18 miesięcy od 20 września 2026 r. (mniej więcej do 20 marca 2028 r.) projekt można sporządzić według dotychczasowych warunków technicznych, jeżeli inwestor złoży oświadczenie (art. 102a Prawa budowlanego, Dz.U. 2026 poz. 1161). Numery paragrafów (§) podane w artykule odnoszą się do rozporządzenia z 2002 r.',
    link: '#normy',
    linkTxt: 'Zobacz aktualny status przepisów →'
  };

  var RE_NORM = /^(Warunki techniczne(?! (budowli|wykonania|użytkowania))|WT\b|Rozporządzenie Ministra Infrastruktury z 12 kwietnia 2002|Rozporządzenie w sprawie warunków technicznych(?! użytkowania))/i;
  var RE_TXT = /12 kwietnia 2002|w sprawie warunków technicznych,? jakim powinny|Warunk\w* Techniczn\w*(?! Wykonania)|\bWT 20(02|17|21)\b/;

  var ART = null;
  function arts() {
    if (ART) return ART;
    ART = {};
    try {
      JSON.parse(document.getElementById('data').textContent).articles.forEach(function (a) {
        if (a.law && a.law.length) return; // ramka „Stan prawny” jest już w danych artykułu (wtNote)
        var n = (a.norms || []).some(function (x) { return RE_NORM.test(x); });
        var h = String(a.html || '');
        var t = RE_TXT.test(h.replace(/<[^>]+>/g, ' '));
        if ((n || t) && h.indexOf('102a') < 0) ART[a.slug] = 1;
      });
    } catch (e) {}
    return ART;
  }

  var CSS = '.sp-note{border-left:4px solid #2E6FA8;background:color-mix(in srgb,#2E6FA8 10%,var(--surface));padding:14px 18px;border-radius:0 8px 8px 0;margin:0 0 1.4em;font-size:16px;line-height:1.55;color:var(--ink)}' +
    '.sp-note b{display:block;font:700 13px var(--f-display);letter-spacing:.12em;text-transform:uppercase;color:#2E6FA8;margin-bottom:4px}' +
    '.sp-note p{margin:0 0 6px}.sp-note a{font-weight:600;color:var(--orange)}' +
    ':root[data-theme="dark"] .sp-note b{color:#6FA8DC}@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .sp-note b{color:#6FA8DC}}';

  function mount() {
    var m = location.hash.match(/^#a-([a-z0-9-]+)/);
    var view = document.getElementById('view');
    if (!m || !view || !arts()[m[1]]) return;
    var prose = view.querySelector('.prose');
    if (!prose || prose.querySelector('[data-sp]')) return;
    if (!document.getElementById('sp-css')) { var s = document.createElement('style'); s.id = 'sp-css'; s.textContent = CSS; document.head.appendChild(s); }
    var box = document.createElement('aside');
    box.className = 'sp-note'; box.setAttribute('data-sp', ''); box.setAttribute('role', 'note');
    box.innerHTML = '<b></b><p></p><a></a>';
    box.querySelector('b').textContent = NOTA.tytul;
    box.querySelector('p').textContent = NOTA.tekst;
    var a = box.querySelector('a'); a.href = NOTA.link; a.textContent = NOTA.linkTxt;
    prose.insertBefore(box, prose.firstChild);
  }
  function init() {
    var view = document.getElementById('view');
    if (!view) return setTimeout(init, 50);
    new MutationObserver(function () { mount(); }).observe(view, {childList: true, subtree: true});
    window.addEventListener('hashchange', function () { setTimeout(mount, 0); });
    mount();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
