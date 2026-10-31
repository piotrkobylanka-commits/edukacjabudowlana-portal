/*!
 * EdukacjaBudowlana – interaktywny „Słowniczek” (wersja 2026-10-30)
 * Zastępuje zwykłą listę pojęć widokiem z:
 *  - wyszukiwaniem z podświetlaniem (bez polskich znaków też działa), skrót klawiszowy „/”,
 *  - działami tematycznymi, sortowaniem A–Z lub wg liczby artykułów, paskiem liter ze śledzeniem,
 *  - „Zobacz też” (pojęcia powiązane), listą artykułów, kopiowaniem linku do pojęcia,
 *  - „Mapą pojęć” (wielkość = liczba artykułów, kliknięcie pokazuje powiązania),
 *  - quizem „Sprawdź się” (10 pytań, wynik zapamiętywany w przeglądarce),
 *  - „Pojęciem dnia”.
 * Dane bierze z tablicy GLOSS i D.articles strony – nic nie trzeba dopisywać przy nowych pojęciach
 * (nowe pojęcie bez przypisanego działu trafia do „Inne”; dział dopisz w MAPA poniżej).
 * Wymaga jednej linii w index.html przed </body>:
 *   <script src="slowniczek-modul.js?v=20261030b" defer></script>
 */
(function () {
  'use strict';

  /* ---------- DZIAŁY ---------- */
  var CATS = [
    {k: 'fiz',  n: 'Fizyka budowli i izolacje', c: '#2F80B0'},
    {k: 'kon',  n: 'Konstrukcja i fundamenty',  c: '#D0601A'},
    {k: 'dach', n: 'Dach',                      c: '#8A5BB5'},
    {k: 'mat',  n: 'Materiały i beton',         c: '#6E8A2A'},
    {k: 'for',  n: 'Formalności i prawo',       c: '#6B7785'},
    {k: 'ins',  n: 'Instalacje i energia',      c: '#1F9254'},
    {k: 'inne', n: 'Inne',                      c: '#8A847B'}
  ];
  var MAPA = {
    fiz: 'punkt-rosy mostek-termiczny wspolczynnik-u lambda paroizolacja izolacja-pozioma hydroizolacja etics cieply-montaz swiadectwo-energetyczne',
    kon: 'lawa-fundamentowa plyta-fundamentowa chudziak wieniec nadproze strzemiona teriva dylatacja geotechnika otulina',
    dach: 'murlata krokiew kalenica wiezba membrana',
    mat: 'klasa-betonu pielegnacja-betonu beton-komorkowy silikat cienka-spoina jastrych pomiar-cm',
    'for': 'roboty-zanikajace kierownik-budowy inspektor-nadzoru dziennik-budowy pozwolenie-na-budowe zgloszenie mpzp wz pzt mapa-do-celow-projektowych warunki-techniczne rekojmia eurokod',
    ins: 'rekuperacja pompa-ciepla scop uklad-sieci rcd uziom fotowoltaika przylacze'
  };
  var CAT_OF = {};
  Object.keys(MAPA).forEach(function (k) { MAPA[k].split(' ').forEach(function (id) { CAT_OF[id] = k; }); });
  var catBy = {}; CATS.forEach(function (c) { catBy[c.k] = c; });
  var ALFABET = 'A B C Ć D E F G H I J K L Ł M N O P R S Ś T U W Z Ź Ż'.split(' ');
  var LS_KEY = 'eb-sx-quiz-best';

  /* ---------- dane strony ----------
     Skrypt strony jest zamknięty w (function(){…}), więc GLOSS i D nie są globalne.
     Słowniczek czytamy z tekstu skryptu (tablica „const GLOSS = [ … ];”), artykuły z <script id="data">. */
  var RB = '(?<![\\p{L}\\d])', RE = '(?![\\p{L}\\d])';
  var _G = null, _A = null;
  function G() {
    if (_G) return _G;
    try { if (typeof GLOSS !== 'undefined') return (_G = GLOSS); } catch (e) {}
    var ss = document.scripts;
    for (var i = 0; i < ss.length; i++) {
      var t = ss[i].text, k = t.indexOf('const GLOSS = [');
      if (k < 0) continue;
      var a = t.indexOf('[', k), b = t.indexOf('\n];', a);
      if (b < 0) return null;
      try {
        var arr = (new Function('return ' + t.slice(a, b + 2)))();
        arr.forEach(function (g) {
          g.rx = g.r ? new RegExp(RB + '(?:' + g.r + ')' + RE, 'iu') : null;
          g.cx = g.c ? new RegExp(RB + '(?:' + g.c + ')' + RE, 'u') : null;
        });
        return (_G = arr);
      } catch (e) { return null; }
    }
    return null;
  }
  function art() {
    if (_A) return _A;
    try { _A = JSON.parse(document.getElementById('data').textContent).articles || []; } catch (e) { _A = []; }
    _A.forEach(function (x) { if (x.text == null) x.text = ' ' + String(x.html || '').replace(/<[^>]+>/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ') + ' '; });
    return _A;
  }
  var E = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]; }); };
  var N = function (s) { return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l'); };
  var PL = function (n, a, b, c) { return n === 1 ? a : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) ? b : c; };
  function hit(g, s) { return !!((g.rx && g.rx.test(s)) || (g.cx && g.cx.test(s))); }
  function stageCode(n) { return typeof n !== 'number' ? (n == null ? '' : String(n)) : n <= 10 ? String(n).padStart(2, '0') : 'ABC'.charAt(n - 11); }
  function head(title, lead) {
    return '<section class="page-head"><div class="wrap"><nav class="crumbs" aria-label="Okruszki"><a href="#start">Start</a><span aria-hidden="true">/</span><span>Słowniczek</span></nav>' +
      '<h1 class="page-title">' + E(title) + '</h1><p class="page-lead">' + E(lead) + '</p></div></section>';
  }
  var catOf = function (g) { return catBy[CAT_OF[g.id] || 'inne']; };
  var first = function (g) { return g.t.charAt(0).toUpperCase(); };

  /* ---------- indeks (liczony raz) ---------- */
  var IX = null;
  function index() {
    if (IX) return IX;
    var gl = G() || [];
    var cnt = {}, co = {};
    gl.forEach(function (g) { cnt[g.id] = 0; co[g.id] = {}; });
    art().forEach(function (a) {                                   // które pojęcia występują razem w artykułach
      var t = a.text || '', ids = gl.filter(function (g) { return hit(g, t); }).map(function (g) { return g.id; });
      ids.forEach(function (x) { cnt[x]++; ids.forEach(function (y) { if (x !== y) co[x][y] = (co[x][y] || 0) + 1; }); });
    });
    var rel = {};
    gl.forEach(function (g) { rel[g.id] = []; });
    gl.forEach(function (g) {
      gl.forEach(function (o) {
        if (o === g) return;
        if (hit(o, g.d) && rel[g.id].indexOf(o.id) < 0) rel[g.id].push(o.id);       // definicja g wspomina o
        if (hit(g, o.d) && rel[g.id].indexOf(o.id) < 0) rel[g.id].push(o.id);       // definicja o wspomina g
      });
      // uzupełnij pojęciami, które najczęściej występują w tych samych artykułach (miara Jaccarda)
      Object.keys(co[g.id]).map(function (id) { var c = co[g.id][id]; return {id: id, c: c, j: c / (cnt[g.id] + cnt[id] - c)}; })
        .filter(function (x) { return x.c >= 2 && rel[g.id].indexOf(x.id) < 0; })
        .sort(function (x, y) { return y.j - x.j; })
        .forEach(function (x, i) { if (rel[g.id].length < 6 && (x.j >= 0.1 || (rel[g.id].length < 2 && CAT_OF[x.id] === CAT_OF[g.id]))) rel[g.id].push(x.id); });
    });
    var max = 1; gl.forEach(function (g) { max = Math.max(max, cnt[g.id] || 0); });
    var by = {}; gl.forEach(function (g) { by[g.id] = g; g._s = N(g.t + ' ' + g.d); g._t = N(g.t); });
    var links = 0; gl.forEach(function (g) { links += cnt[g.id] || 0; });
    IX = {gl: gl, cnt: cnt, rel: rel, max: max, by: by, links: links};
    return IX;
  }

  /* ---------- podświetlanie wyników (ignoruje polskie znaki) ---------- */
  function mark(text, q) {
    if (!q) return E(text);
    var nt = '', map = [];
    for (var i = 0; i < text.length; i++) { var c = N(text[i]); for (var j = 0; j < c.length; j++) { nt += c[j]; map.push(i); } }
    var out = '', last = 0, from = 0, k;
    while ((k = nt.indexOf(q, from)) > -1) {
      var a = map[k], b = map[k + q.length - 1] + 1;
      if (a < last) { from = k + 1; continue; }
      out += E(text.slice(last, a)) + '<mark>' + E(text.slice(a, b)) + '</mark>';
      last = b; from = k + q.length;
    }
    return out + E(text.slice(last));
  }

  /* ---------- stan ---------- */
  var st = {q: '', cat: '', sort: 'az', tab: 'lista', sel: null, open: {}};
  var root = null;

  function filtered() {
    var ix = index(), q = N(st.q.trim());
    var l = ix.gl.filter(function (g) { return (!st.cat || (CAT_OF[g.id] || 'inne') === st.cat) && (!q || g._s.indexOf(q) > -1); });
    l.sort(st.sort === 'pop'
      ? function (a, b) { return (ix.cnt[b.id] || 0) - (ix.cnt[a.id] || 0) || a.t.localeCompare(b.t, 'pl'); }
      : function (a, b) { return a.t.localeCompare(b.t, 'pl'); });
    if (q && st.sort === 'az') l.sort(function (a, b) { return (a._t.indexOf(q) > -1 ? 0 : 1) - (b._t.indexOf(q) > -1 ? 0 : 1) || a.t.localeCompare(b.t, 'pl'); });
    return l;
  }

  /* ---------- szkielet widoku ---------- */
  function frame() {
    var ix = index(), gl = ix.gl;
    var day = Math.floor(Date.now() / 864e5), pd = gl.slice().sort(function (a, b) { return a.id < b.id ? -1 : 1; })[day % gl.length];
    var best = null; try { best = localStorage.getItem(LS_KEY); } catch (e) {}
    var catCounts = {}; gl.forEach(function (g) { var k = CAT_OF[g.id] || 'inne'; catCounts[k] = (catCounts[k] || 0) + 1; });
    var cats = CATS.filter(function (c) { return catCounts[c.k]; });
    return '<div data-sx>' + head('Słowniczek', 'Najważniejsze pojęcia z budowy w jednym albo dwóch zdaniach. W artykułach są podkreślone: najedź na nie albo dotknij, żeby zobaczyć definicję.') +
      '<section class="sx-top"><div class="wrap sx-top-in">' +
        '<div class="sx-stats">' +
          '<div><b>' + gl.length + '</b><span>' + PL(gl.length, 'pojęcie', 'pojęcia', 'pojęć') + '</span></div>' +
          '<div><b>' + cats.length + '</b><span>' + PL(cats.length, 'dział', 'działy', 'działów') + '</span></div>' +
          '<div><b>' + ix.links.toLocaleString('pl-PL') + '</b><span>odwołań w artykułach</span></div>' +
        '</div>' +
        (pd ? '<div class="sx-day" style="--cc:' + catOf(pd).c + '"><span class="sx-eyebrow">Pojęcie dnia</span><b>' + E(pd.t) + '</b><p>' + E(pd.d) + '</p><button type="button" class="sx-link" data-go="' + pd.id + '">Pokaż w słowniczku →</button></div>' : '') +
      '</div></section>' +
      '<div class="sx-tabs-bar"><div class="wrap"><div class="sx-tabs" role="tablist" aria-label="Widok słowniczka">' +
        tab('lista', 'Lista A–Ż', '<path d="M4 6h16M4 12h16M4 18h10"/>') +
        tab('mapa', 'Mapa pojęć', '<circle cx="7" cy="8" r="3"/><circle cx="17" cy="7" r="2"/><circle cx="15" cy="16" r="4"/><path d="M9.5 9.5l2.5 3.5M15.3 8.8l-.2 3.2"/>') +
        tab('quiz', 'Sprawdź się', '<path d="M9 9a3 3 0 1 1 4 2.8c-.7.3-1 .9-1 1.6V14"/><circle cx="12" cy="18" r=".6"/><circle cx="12" cy="12" r="9"/>') +
        (best ? '<span class="sx-best">Twój najlepszy wynik: <b>' + E(best) + '/10</b></span>' : '') +
      '</div></div></div>' +
      '<div class="sx-tools" data-for="lista mapa"><div class="wrap">' +
        '<div class="sx-row1">' +
          '<div class="sx-search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>' +
            '<label for="gl-q" class="sr-only">Filtruj pojęcia</label><input id="gl-q" type="search" placeholder="Szukaj pojęcia lub słowa z definicji, np. beton" autocomplete="off" value="' + E(st.q) + '"><kbd title="Naciśnij /, żeby szukać">/</kbd></div>' +
          '<label class="sx-sort"><span>Kolejność</span><select id="sx-sort"><option value="az">A–Ż</option><option value="pop"' + (st.sort === 'pop' ? ' selected' : '') + '>Najczęściej w artykułach</option></select></label>' +
          '<span class="sx-count" aria-live="polite"></span>' +
        '</div>' +
        '<div class="sx-cats" role="group" aria-label="Działy"><button type="button" class="sx-cat" data-cat="" aria-pressed="' + !st.cat + '">Wszystkie <i>' + gl.length + '</i></button>' +
          cats.map(function (c) { return '<button type="button" class="sx-cat" data-cat="' + c.k + '" style="--cc:' + c.c + '" aria-pressed="' + (st.cat === c.k) + '"><s></s>' + E(c.n) + ' <i>' + catCounts[c.k] + '</i></button>'; }).join('') +
        '</div>' +
        '<nav class="sx-letters" aria-label="Pierwsza litera" data-for="lista"></nav>' +
      '</div></div>' +
      '<section class="section sx-body"><div class="wrap">' +
        '<div class="sx-panel" data-p="lista"></div>' +
        '<div class="sx-panel" data-p="mapa"></div>' +
        '<div class="sx-panel" data-p="quiz"></div>' +
      '</div></section></div>';
  }
  function tab(k, label, icon) {
    return '<button type="button" role="tab" class="sx-tab" data-tab="' + k + '" aria-selected="' + (st.tab === k) + '"><svg viewBox="0 0 24 24" aria-hidden="true">' + icon + '</svg>' + label + '</button>';
  }

  /* ---------- LISTA ---------- */
  function itemHTML(g, q) {
    var ix = index(), c = catOf(g), n = ix.cnt[g.id] || 0, rel = ix.rel[g.id].slice(0, 6);
    var w = n ? Math.max(4, Math.round(100 * Math.sqrt(n / ix.max))) : 0;
    return '<article class="sx-item' + (st.sel === g.id ? ' hl' : '') + '" id="g-' + g.id + '" data-id="' + g.id + '" style="--cc:' + c.c + '">' +
      '<div class="sx-ih"><h3 class="sx-t">' + mark(g.t, q) + '</h3><button type="button" class="sx-badge" data-cat="' + (CAT_OF[g.id] || 'inne') + '" title="Pokaż tylko ten dział">' + E(c.n) + '</button></div>' +
      '<p class="sx-d">' + mark(g.d, q) + '</p>' +
      '<div class="sx-foot">' +
        '<span class="sx-pop" title="' + n + ' ' + PL(n, 'artykuł', 'artykuły', 'artykułów') + ' z tym pojęciem"><span class="sx-bar"><i style="width:' + w + '%"></i></span>' + (n ? 'w ' + n + ' ' + PL(n, 'artykule', 'artykułach', 'artykułach') : 'jeszcze bez artykułów') + '</span>' +
        (rel.length ? '<span class="sx-rel"><em>Zobacz też:</em>' + rel.map(function (id) { var o = ix.by[id]; return '<button type="button" class="sx-chip" data-go="' + id + '" style="--cc:' + catOf(o).c + '">' + E(o.t) + '</button>'; }).join('') + '</span>' : '') +
      '</div>' +
      '<div class="sx-act">' +
        (n ? '<button type="button" class="sx-btn" data-arts aria-expanded="' + !!st.open[g.id] + '">Artykuły (' + n + ')<span aria-hidden="true">▾</span></button>' : '') +
        '<button type="button" class="sx-btn sx-ghost" data-copy><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg><span>Kopiuj link</span></button>' +
      '</div>' +
      '<div class="sx-arts"' + (st.open[g.id] ? '' : ' hidden') + '>' + (st.open[g.id] ? artsHTML(g) : '') + '</div>' +
    '</article>';
  }
  function artsHTML(g) {
    var l = art().filter(function (a) { return hit(g, a.text || ''); });
    return l.map(function (a) { return '<a href="#a-' + E(a.slug) + '"><span class="k">' + E(stageCode(a.stage)) + '</span><span>' + E(a.title) + '</span></a>'; }).join('') || '<p class="sx-muted">Brak artykułów.</p>';
  }
  function renderList() {
    var p = root.querySelector('[data-p="lista"]'), l = filtered(), q = N(st.q.trim()), h = '';
    if (st.sort === 'az' && !q) {
      var cur = null;
      l.forEach(function (g) {
        var L = first(g);
        if (L !== cur) { if (cur !== null) h += '</div>'; cur = L; h += '<div class="sx-group" data-l="' + L + '"><div class="sx-letter" aria-hidden="true">' + L + '</div>'; }
        h += itemHTML(g, q);
      });
      if (cur !== null) h += '</div>';
    } else h = '<div class="sx-group sx-flat">' + l.map(function (g) { return itemHTML(g, q); }).join('') + '</div>';
    p.innerHTML = l.length ? h : emptyHTML();
    var present = {}; l.forEach(function (g) { present[first(g)] = 1; });
    var nav = root.querySelector('.sx-letters'), az = st.sort === 'az' && !q;
    nav.innerHTML = ALFABET.map(function (L) { return present[L] && az ? '<a href="#slowniczek" data-l="' + L + '">' + L + '</a>' : '<span aria-hidden="true">' + L + '</span>'; }).join('');
    nav.hidden = !az;
    count(l.length);
    spy();
  }
  function emptyHTML() {
    return '<div class="sx-empty"><b>Nic nie pasuje do „' + E(st.q) + '”' + (st.cat ? ' w dziale ' + E(catBy[st.cat].n) : '') + '.</b><p>Spróbuj krótszego słowa albo <button type="button" class="sx-link" data-reset>wyczyść filtry</button>. Szukasz w artykułach? <a href="#szukaj">Wyszukiwarka portalu →</a></p></div>';
  }
  function count(n) {
    var t = index().gl.length;
    root.querySelector('.sx-count').textContent = n === t ? '' : 'Pokazano ' + n + ' z ' + t;
  }

  /* śledzenie litery przy przewijaniu */
  var spyRaf = 0;
  function spy() {
    if (!root || st.tab !== 'lista') return;
    cancelAnimationFrame(spyRaf);
    spyRaf = requestAnimationFrame(function () {
      var tools = root.querySelector('.sx-tools'), lim = tools ? tools.getBoundingClientRect().bottom + 24 : 200, act = null;
      root.querySelectorAll('.sx-group[data-l]').forEach(function (g) { if (g.getBoundingClientRect().top <= lim) act = g.dataset.l; });
      root.querySelectorAll('.sx-letters a').forEach(function (a) { a.classList.toggle('on', a.dataset.l === act); });
    });
  }

  /* ---------- MAPA ---------- */
  function renderMap() {
    var ix = index(), p = root.querySelector('[data-p="mapa"]'), q = N(st.q.trim());
    var vis = {}; filtered().forEach(function (g) { vis[g.id] = 1; });
    var sel = st.sel && ix.by[st.sel] ? st.sel : null, rel = sel ? ix.rel[sel] : [];
    var cols = CATS.map(function (c) {
      var items = ix.gl.filter(function (g) { return (CAT_OF[g.id] || 'inne') === c.k; }).sort(function (a, b) { return (ix.cnt[b.id] || 0) - (ix.cnt[a.id] || 0); });
      if (!items.length) return '';
      var shown = items.filter(function (g) { return vis[g.id]; }).length;
      return '<div class="sx-mcol' + (shown ? '' : ' dim') + '" style="--cc:' + c.c + '"><h3><s></s>' + E(c.n) + '<i>' + items.length + '</i></h3><div class="sx-bubbles">' +
        items.map(function (g) {
          var n = ix.cnt[g.id] || 0, r = Math.sqrt(n / ix.max);
          var cls = 'sx-bub' + (vis[g.id] ? '' : ' off') + (g.id === sel ? ' sel' : '') + (rel.indexOf(g.id) > -1 ? ' rel' : '') + (sel && g.id !== sel && rel.indexOf(g.id) < 0 ? ' fade' : '');
          return '<button type="button" class="' + cls + '" data-pick="' + g.id + '" style="--s:' + r.toFixed(3) + '" aria-pressed="' + (g.id === sel) + '"><span class="sx-dot"></span>' + E(g.t) + '<em>' + n + '</em></button>';
        }).join('') + '</div></div>';
    }).join('');
    var g = sel ? ix.by[sel] : null;
    var side = g ? '<div class="sx-det" style="--cc:' + catOf(g).c + '"><span class="sx-eyebrow">' + E(catOf(g).n) + '</span><h3>' + E(g.t) + '</h3><p>' + E(g.d) + '</p>' +
        '<p class="sx-muted">' + (ix.cnt[g.id] ? 'Pojawia się w ' + ix.cnt[g.id] + ' ' + PL(ix.cnt[g.id], 'artykule', 'artykułach', 'artykułach') + '.' : 'Jeszcze bez artykułów.') + '</p>' +
        (rel.length ? '<div class="sx-rel sx-rel-col"><em>Powiązane (' + rel.length + '):</em>' + rel.map(function (id) { var o = ix.by[id]; return '<button type="button" class="sx-chip" data-pick="' + id + '" style="--cc:' + catOf(o).c + '">' + E(o.t) + '</button>'; }).join('') + '</div>' : '<p class="sx-muted">Brak bezpośrednich powiązań w definicjach.</p>') +
        '<div class="sx-act"><button type="button" class="sx-btn" data-go="' + g.id + '">Pokaż w liście →</button><button type="button" class="sx-btn sx-ghost" data-pick="">Zamknij</button></div></div>'
      : '<div class="sx-det sx-det-empty"><span class="sx-eyebrow">Jak czytać mapę</span><p>Każde pojęcie to kropka – <b>im większa, tym w większej liczbie artykułów</b> się pojawia. Kolor oznacza dział.</p><p>Kliknij pojęcie: zobaczysz definicję, a na mapie podświetlą się pojęcia z nim powiązane. Pole wyszukiwania i działy wygaszają resztę.</p></div>';
    p.innerHTML = '<div class="sx-map"><div class="sx-mcols">' + cols + '</div><aside class="sx-side">' + side + '</aside></div>';
    count(Object.keys(vis).length);
  }

  /* ---------- QUIZ ---------- */
  var QZ = null;
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function newQuiz(cat) {
    var gl = index().gl, pool = gl.filter(function (g) { return !cat || (CAT_OF[g.id] || 'inne') === cat; });
    if (pool.length < 4) pool = gl;
    var qs = shuffle(pool.slice()).slice(0, Math.min(10, pool.length)).map(function (g) {
      var same = gl.filter(function (o) { return o !== g && (CAT_OF[o.id] || 'inne') === (CAT_OF[g.id] || 'inne'); });
      var other = gl.filter(function (o) { return o !== g && same.indexOf(o) < 0; });
      var wrong = shuffle(same).slice(0, 3); if (wrong.length < 3) wrong = wrong.concat(shuffle(other).slice(0, 3 - wrong.length));
      return {g: g, opts: shuffle([g].concat(wrong)), ans: null};
    });
    QZ = {cat: cat || '', qs: qs, i: 0, ok: 0, done: false};
  }
  function masked(g) {
    var d = g.d;
    [g.rx, g.cx].forEach(function (rx) { if (rx) d = d.replace(new RegExp(rx.source, rx.flags.indexOf('g') > -1 ? rx.flags : rx.flags + 'g'), '…'); });
    return d;
  }
  function renderQuiz() {
    var p = root.querySelector('[data-p="quiz"]');
    if (!QZ) newQuiz('');
    var cats = CATS.filter(function (c) { return index().gl.filter(function (g) { return (CAT_OF[g.id] || 'inne') === c.k; }).length >= 4; });
    var pick = '<div class="sx-qcats" role="group" aria-label="Zakres quizu"><span>Zakres:</span><button type="button" class="sx-cat" data-qcat="" aria-pressed="' + !QZ.cat + '">Wszystkie</button>' +
      cats.map(function (c) { return '<button type="button" class="sx-cat" data-qcat="' + c.k + '" style="--cc:' + c.c + '" aria-pressed="' + (QZ.cat === c.k) + '"><s></s>' + E(c.n) + '</button>'; }).join('') + '</div>';
    if (QZ.done) {
      var tot = QZ.qs.length, best = 0;
      try { best = +localStorage.getItem(LS_KEY) || 0; if (QZ.ok > best && tot === 10) localStorage.setItem(LS_KEY, QZ.ok); } catch (e) {}
      var miss = QZ.qs.filter(function (x) { return x.ans !== x.g.id; });
      var msg = QZ.ok === tot ? 'Komplet! Kierownik budowy byłby dumny.' : QZ.ok >= tot * 0.7 ? 'Bardzo dobrze – znasz język budowy.' : QZ.ok >= tot * 0.4 ? 'Nieźle. Przejrzyj pojęcia poniżej i spróbuj jeszcze raz.' : 'Na początek wystarczy. Pojęcia poniżej warto doczytać.';
      p.innerHTML = '<div class="sx-quiz">' + pick + '<div class="sx-qcard sx-qend"><span class="sx-eyebrow">Wynik</span><div class="sx-score"><b>' + QZ.ok + '</b>/' + tot + '</div>' +
        '<div class="sx-meter"><i style="width:' + Math.round(100 * QZ.ok / tot) + '%"></i></div><p>' + msg + '</p>' +
        (miss.length ? '<div class="sx-rel sx-rel-col"><em>Do powtórki:</em>' + miss.map(function (x) { return '<button type="button" class="sx-chip" data-go="' + x.g.id + '" style="--cc:' + catOf(x.g).c + '">' + E(x.g.t) + '</button>'; }).join('') + '</div>' : '') +
        '<div class="sx-act"><button type="button" class="sx-btn sx-primary" data-qnew>Nowy quiz</button></div></div></div>';
      return;
    }
    var x = QZ.qs[QZ.i], answered = x.ans !== null;
    p.innerHTML = '<div class="sx-quiz">' + pick +
      '<div class="sx-qcard" style="--cc:' + catOf(x.g).c + '">' +
        '<div class="sx-qtop"><span class="sx-eyebrow">Pytanie ' + (QZ.i + 1) + ' z ' + QZ.qs.length + '</span><span class="sx-qok">Dobrze: <b>' + QZ.ok + '</b></span></div>' +
        '<div class="sx-meter"><i style="width:' + Math.round(100 * (QZ.i + (answered ? 1 : 0)) / QZ.qs.length) + '%"></i></div>' +
        '<p class="sx-qlead">Które pojęcie pasuje do opisu?</p><blockquote>' + E(masked(x.g)) + '</blockquote>' +
        '<div class="sx-opts">' + x.opts.map(function (o, k) {
          var cls = 'sx-opt' + (answered ? (o.id === x.g.id ? ' good' : o.id === x.ans ? ' bad' : ' mute') : '');
          return '<button type="button" class="' + cls + '" data-ans="' + o.id + '"' + (answered ? ' disabled' : '') + '><kbd>' + (k + 1) + '</kbd>' + E(o.t) + '</button>';
        }).join('') + '</div>' +
        (answered ? '<div class="sx-qfb ' + (x.ans === x.g.id ? 'ok' : 'no') + '" role="status"><b>' + (x.ans === x.g.id ? 'Dobrze!' : 'Nie tym razem – to „' + E(x.g.t) + '”.') + '</b> ' + E(x.g.d) + '</div>' +
          '<div class="sx-act"><button type="button" class="sx-btn sx-primary" data-qnext>' + (QZ.i + 1 < QZ.qs.length ? 'Następne pytanie →' : 'Zobacz wynik') + '</button><button type="button" class="sx-btn sx-ghost" data-go="' + x.g.id + '">Otwórz w słowniczku</button></div>'
          : '<p class="sx-muted sx-hint">Możesz odpowiadać klawiszami 1–4.</p>') +
      '</div></div>';
  }
  function answer(id) {
    var x = QZ.qs[QZ.i]; if (x.ans !== null) return;
    x.ans = id; if (id === x.g.id) QZ.ok++;
    renderQuiz();
    var b = root.querySelector('[data-qnext]'); if (b) b.focus({preventScroll: true});
  }

  /* przewiń tak, żeby element nie chował się pod przyklejonym paskiem */
  function scrollToEl(el, smooth) {
    var tools = root.querySelector('.sx-tools'), sticky = tools && getComputedStyle(tools).position === 'sticky';
    var off = (sticky ? 68 + tools.offsetHeight : 76) + 12;
    window.scrollTo({top: el.getBoundingClientRect().top + window.pageYOffset - off, behavior: smooth ? 'smooth' : 'auto'});
  }

  /* ---------- przełączanie ---------- */
  function setTab(t) {
    st.tab = t;
    root.querySelectorAll('.sx-tab').forEach(function (b) { b.setAttribute('aria-selected', b.dataset.tab === t); });
    root.querySelectorAll('.sx-panel').forEach(function (p) { p.hidden = p.dataset.p !== t; });
    var tools = root.querySelector('.sx-tools'); tools.hidden = t === 'quiz';
    root.querySelector('.sx-letters').style.display = t === 'lista' ? '' : 'none';
    if (t === 'lista') renderList(); else if (t === 'mapa') renderMap(); else renderQuiz();
  }
  function refresh() { if (st.tab === 'lista') renderList(); else if (st.tab === 'mapa') renderMap(); }
  function goTo(id, smooth) {
    var ix = index(); if (!ix.by[id]) return;
    st.sel = id; st.q = ''; st.cat = ''; st.open[id] = true;
    var qi = root.querySelector('#gl-q'); if (qi) qi.value = '';
    root.querySelectorAll('.sx-cats .sx-cat').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.cat === ''); });
    try { history.replaceState(null, '', '#slowniczek/' + id); } catch (e) {}
    setTab('lista');
    var it = root.querySelector('#g-' + id);
    if (it) {
      scrollToEl(it, smooth);
      it.classList.remove('flash'); void it.offsetWidth; it.classList.add('flash');
    }
  }
  function copy(id, btn) {
    var url = location.origin + location.pathname + '#slowniczek/' + id;
    var done = function () { var s = btn.querySelector('span'); var o = s.textContent; s.textContent = 'Skopiowano!'; btn.classList.add('ok'); setTimeout(function () { s.textContent = o; btn.classList.remove('ok'); }, 1600); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, function () { prompt('Skopiuj link:', url); });
    else { prompt('Skopiuj link:', url); }
  }

  /* ---------- zdarzenia ---------- */
  function wire() {
    var qi = root.querySelector('#gl-q'), tmr = 0;
    qi.addEventListener('input', function () { clearTimeout(tmr); tmr = setTimeout(function () { st.q = qi.value; st.sel = st.tab === 'mapa' ? st.sel : null; refresh(); }, 90); });
    qi.addEventListener('keydown', function (e) { if (e.key === 'Escape') { qi.value = ''; st.q = ''; refresh(); } });
    root.querySelector('#sx-sort').addEventListener('change', function (e) { st.sort = e.target.value; refresh(); });
    root.addEventListener('click', function (e) {
      var t = e.target.closest('button, a'); if (!t || !root.contains(t)) return;
      if (t.dataset.tab) { setTab(t.dataset.tab); return; }
      if (t.hasAttribute('data-cat') && !t.hasAttribute('data-qcat')) {
        st.cat = st.cat === t.dataset.cat && t.classList.contains('sx-badge') ? '' : t.dataset.cat;
        root.querySelectorAll('.sx-cats .sx-cat').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.cat === st.cat); });
        refresh();
        if (t.classList.contains('sx-badge')) scrollToEl(root.querySelector('.sx-body'), true);
        return;
      }
      if (t.dataset.go) { goTo(t.dataset.go, true); return; }
      if (t.hasAttribute('data-pick')) { st.sel = t.dataset.pick || null; renderMap(); if (st.sel && innerWidth < 900) root.querySelector('.sx-side').scrollIntoView({block: 'nearest', behavior: 'smooth'}); return; }
      if (t.hasAttribute('data-arts')) {
        var it = t.closest('.sx-item'), id = it.dataset.id, box = it.querySelector('.sx-arts');
        st.open[id] = !st.open[id];
        if (st.open[id] && !box.childElementCount) box.innerHTML = artsHTML(index().by[id]);
        box.hidden = !st.open[id]; t.setAttribute('aria-expanded', !!st.open[id]);
        return;
      }
      if (t.hasAttribute('data-copy')) { copy(t.closest('.sx-item').dataset.id, t); return; }
      if (t.hasAttribute('data-reset')) { st.q = ''; st.cat = ''; qi.value = ''; root.querySelectorAll('.sx-cats .sx-cat').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.cat === ''); }); refresh(); return; }
      if (t.dataset.l && t.closest('.sx-letters')) {
        e.preventDefault();
        var g = root.querySelector('.sx-group[data-l="' + t.dataset.l + '"]');
        if (g) scrollToEl(g, true);
        return;
      }
      if (t.hasAttribute('data-qcat')) { newQuiz(t.dataset.qcat); renderQuiz(); return; }
      if (t.dataset.ans) { answer(t.dataset.ans); return; }
      if (t.hasAttribute('data-qnext')) { if (QZ.i + 1 < QZ.qs.length) QZ.i++; else QZ.done = true; renderQuiz(); root.querySelector('.sx-tabs-bar').scrollIntoView({block: 'nearest'}); return; }
      if (t.hasAttribute('data-qnew')) { newQuiz(QZ.cat); renderQuiz(); return; }
    });
  }
  window.addEventListener('keydown', function (e) {
    if (!root || !document.body.contains(root)) return;
    var typing = /INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName || '');
    if (e.key === '/' && !typing && st.tab !== 'quiz') { e.preventDefault(); e.stopImmediatePropagation(); var qi = root.querySelector('#gl-q'); qi.focus(); qi.select(); }
    if (st.tab === 'quiz' && !typing && /^[1-4]$/.test(e.key) && QZ && !QZ.done) {
      var x = QZ.qs[QZ.i]; if (x.ans === null && x.opts[+e.key - 1]) { e.stopImmediatePropagation(); answer(x.opts[+e.key - 1].id); }
    }
  }, true);
  window.addEventListener('scroll', function () { if (root && document.body.contains(root)) spy(); }, {passive: true});

  /* ---------- CSS ---------- */
  var CSS =
    '[data-sx] .sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}' +
    '.sx-top{background:var(--surface);border-bottom:1px solid var(--line)}.sx-top-in{display:grid;grid-template-columns:auto minmax(0,1fr);gap:16px 28px;align-items:center;padding-block:4px 24px}' +
    '.sx-stats{display:flex;gap:8px}.sx-stats div{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:12px 16px;min-width:104px;display:flex;flex-direction:column;justify-content:center}' +
    '.sx-stats b{font:700 38px/1 var(--f-display);color:var(--ink)}.sx-stats span{font-size:13.5px;color:var(--ink-3);margin-top:4px}' +
    '.sx-eyebrow{display:block;font:700 12.5px/1 var(--f-display);letter-spacing:.14em;text-transform:uppercase;color:var(--cc,var(--orange));margin-bottom:6px}' +
    '.sx-day{position:relative;border:1px solid var(--line);border-left:5px solid var(--cc);border-radius:12px;background:var(--surface);padding:14px 18px;overflow:hidden}' +
    '.sx-day b{font:700 24px/1.1 var(--f-display);text-transform:uppercase}.sx-day p{margin:5px 0 6px;color:var(--ink-2);font-size:15px;max-width:80ch}' +
    '.sx-link{background:none;border:0;padding:0;font:inherit;font-weight:700;color:var(--orange);cursor:pointer;text-decoration:underline;text-underline-offset:3px}' +
    '.sx-tabs-bar{background:var(--surface);border-bottom:1px solid var(--line)}.sx-tabs{display:flex;gap:4px;align-items:flex-end;flex-wrap:wrap}.sx-tab{white-space:nowrap}' +
    '.sx-tab{display:inline-flex;align-items:center;gap:8px;border:0;background:none;padding:12px 16px 11px;font:700 17px var(--f-display);letter-spacing:.04em;text-transform:uppercase;color:var(--ink-3);cursor:pointer;border-bottom:3px solid transparent;margin-bottom:-1px}' +
    '.sx-tab svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round}.sx-tab:hover{color:var(--ink)}.sx-tab[aria-selected="true"]{color:var(--ink);border-bottom-color:var(--signal)}' +
    '.sx-best{margin-left:auto;align-self:center;font-size:14px;color:var(--ink-3);padding:8px 0}.sx-best b{color:var(--ink)}' +
    '.sx-tools{position:sticky;top:68px;z-index:20;background:color-mix(in srgb,var(--paper) 95%,transparent);backdrop-filter:blur(6px);border-bottom:2px solid var(--ink)}.sx-tools .wrap{padding-block:12px 10px}' +
    '.sx-row1{display:flex;flex-wrap:wrap;gap:10px 16px;align-items:center}' +
    '.sx-search{position:relative;flex:1 1 300px;max-width:520px}.sx-search svg{position:absolute;left:13px;top:50%;width:18px;height:18px;transform:translateY(-50%);fill:none;stroke:var(--ink-3);stroke-width:2.2;stroke-linecap:round}' +
    '.sx-search input{width:100%;height:46px;border:1px solid var(--line-2);border-radius:10px;background:var(--surface);padding:0 44px 0 40px;font:16px var(--f-ui);color:var(--ink)}.sx-search input:focus{outline:2px solid var(--signal);outline-offset:-1px}' +
    '.sx-search kbd{position:absolute;right:10px;top:50%;transform:translateY(-50%);font:600 12px var(--f-mono);border:1px solid var(--line-2);border-radius:5px;padding:2px 7px;color:var(--ink-3);background:var(--surface)}' +
    '.sx-sort{display:flex;align-items:center;gap:8px;font-size:14px;color:var(--ink-3)}.sx-sort select{width:auto;max-width:240px;height:40px;border:1px solid var(--line-2);border-radius:8px;background:var(--surface);padding:0 10px;font:600 14.5px var(--f-ui);color:var(--ink)}' +
    '.sx-count{font-size:14px;color:var(--ink-3)}' +
    '.sx-cats,.sx-qcats{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;align-items:center}.sx-qcats>span{font-size:14px;color:var(--ink-3);margin-right:4px}' +
    '.sx-cat{display:inline-flex;align-items:center;gap:7px;border:1px solid var(--line-2);background:var(--surface);border-radius:999px;padding:6px 12px;font:600 13.5px var(--f-ui);color:var(--ink);cursor:pointer}' +
    '.sx-cat s{width:9px;height:9px;border-radius:50%;background:var(--cc)}.sx-cat i{font-style:normal;font-size:12px;color:var(--ink-3)}.sx-cat:hover{border-color:var(--cc,var(--signal))}' +
    '.sx-cat[aria-pressed="true"]{background:var(--cc,var(--ink));border-color:var(--cc,var(--ink));color:#fff}.sx-cat[data-cat=""][aria-pressed="true"],.sx-cat[data-qcat=""][aria-pressed="true"]{color:var(--paper)}.sx-cat[data-cat=""][aria-pressed="true"] i{color:var(--paper)}.sx-cat[aria-pressed="true"] s{background:var(--surface)}.sx-cat[aria-pressed="true"] i{color:rgba(255,255,255,.8)}' +
    '.sx-letters{display:flex;flex-wrap:wrap;gap:3px;margin-top:10px}.sx-letters a,.sx-letters span{min-width:31px;height:31px;display:grid;place-items:center;font:700 15px var(--f-display);border-radius:6px;text-decoration:none}' +
    '.sx-letters a{border:1px solid var(--line-2);background:var(--surface);color:var(--ink)}.sx-letters a:hover{border-color:var(--signal);color:var(--orange)}.sx-letters a.on{background:var(--ink);border-color:var(--ink);color:var(--paper)}' +
    '.sx-letters span{color:var(--line-2);border:1px dashed var(--line)}' +
    '.sx-body .wrap{padding-top:6px}.sx-group{position:relative}.sx-group[data-l]{display:grid;grid-template-columns:70px minmax(0,1fr);column-gap:10px;border-bottom:1px solid var(--line)}' +
    '.sx-group[data-l] .sx-item{grid-column:2}.sx-letter{grid-row:1/span 999;position:sticky;top:250px;align-self:start;font:800 52px/1 var(--f-display);color:var(--signal);padding-top:16px}' +
    '.sx-item{padding:18px 16px;margin:6px 0;background:var(--surface);border:1px solid var(--line);border-left:4px solid var(--cc);border-radius:10px;scroll-margin-top:260px;transition:box-shadow .2s}' +
    '.sx-item:hover{box-shadow:0 6px 18px rgba(30,34,39,.08)}.sx-item.hl{background:var(--surface);box-shadow:0 0 0 2px var(--signal)}' +
    '.sx-item.flash{animation:sxf 1.6s ease-out}@keyframes sxf{0%{box-shadow:0 0 0 6px rgba(242,107,29,.55)}100%{box-shadow:0 0 0 2px var(--signal)}}' +
    '.sx-ih{display:flex;flex-wrap:wrap;align-items:baseline;gap:6px 12px}.sx-t{font:800 24px/1.1 var(--f-display);text-transform:uppercase;margin:0}' +
    '.sx-badge{border:0;border-radius:999px;background:color-mix(in srgb,var(--cc) 18%,var(--surface));color:var(--cc);font:700 12px var(--f-ui);padding:4px 9px;cursor:pointer}.sx-badge:hover{background:var(--cc);color:#fff}' +
    '.sx-d{margin:8px 0 0;color:var(--ink-2);max-width:72ch;font-size:16.5px;line-height:1.55}' +
    '[data-sx] mark{background:#FCE0A8;color:#1E2227;border-radius:3px;padding:0 1px}' +
    '.sx-foot{display:flex;flex-wrap:wrap;gap:8px 22px;align-items:center;margin-top:12px;font-size:13.5px;color:var(--ink-3)}' +
    '.sx-pop{display:inline-flex;align-items:center;gap:8px;white-space:nowrap}.sx-bar{width:80px;height:6px;border-radius:3px;background:var(--sunken);overflow:hidden}.sx-bar i{display:block;height:100%;background:var(--cc);border-radius:3px}' +
    '.sx-rel{display:flex;flex-wrap:wrap;gap:5px;align-items:center}.sx-rel em{font-style:normal;color:var(--ink-3);margin-right:2px}.sx-rel-col{margin:12px 0}' +
    '.sx-chip{border:1px solid var(--line);border-radius:999px;background:var(--surface);padding:3px 10px 3px 8px;font:600 13px var(--f-ui);color:var(--ink);cursor:pointer;display:inline-flex;align-items:center;gap:6px}' +
    '.sx-chip:before{content:"";width:7px;height:7px;border-radius:50%;background:var(--cc)}.sx-chip:hover{border-color:var(--cc);background:var(--surface)}' +
    '.sx-act{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}' +
    '.sx-btn{display:inline-flex;align-items:center;gap:7px;border:1px solid var(--line-2);background:var(--surface);border-radius:8px;padding:7px 12px;font:700 14px var(--f-ui);color:var(--ink);cursor:pointer}' +
    '.sx-btn:hover{border-color:var(--signal)}.sx-btn svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round}.sx-btn[aria-expanded="true"] span{display:inline-block;transform:rotate(180deg)}' +
    '.sx-ghost{background:none;border-color:transparent;color:var(--ink-3)}.sx-ghost:hover{color:var(--ink)}.sx-btn.ok{color:#1B7A45}' +
    '.sx-primary{background:var(--signal);border-color:var(--signal);color:var(--on-signal)}.sx-primary:hover{filter:brightness(1.05)}' +
    '.sx-arts{display:grid;gap:2px;margin-top:10px;max-height:340px;overflow:auto;border-left:3px solid var(--cc);padding-left:10px}' +
    '.sx-arts a{display:flex;gap:10px;align-items:baseline;padding:6px 8px;border-radius:6px;text-decoration:none;color:var(--ink);font-size:15px}.sx-arts a:hover{background:var(--surface)}' +
    '.sx-arts .k{font:600 12px var(--f-mono);color:var(--ink-3);min-width:24px}.sx-muted{color:var(--ink-3);font-size:14px}' +
    '.sx-empty{padding:40px 20px;text-align:center;background:var(--surface);border:1px dashed var(--line-2);border-radius:12px;margin-top:20px}.sx-empty b{font-size:18px}.sx-empty p{color:var(--ink-2)}' +
    /* mapa */
    '.sx-map{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:22px;align-items:start;margin-top:18px}' +
    '.sx-mcols{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px}' +
    '.sx-mcol{background:var(--surface);border:1px solid var(--line);border-top:4px solid var(--cc);border-radius:10px;padding:12px 14px 14px;transition:opacity .2s}.sx-mcol.dim{opacity:.45}' +
    '.sx-mcol h3{display:flex;align-items:center;gap:8px;margin:0 0 10px;font:700 17px var(--f-display);text-transform:uppercase;letter-spacing:.03em}.sx-mcol h3 s{width:10px;height:10px;border-radius:50%;background:var(--cc)}.sx-mcol h3 i{margin-left:auto;font:500 13px var(--f-mono);color:var(--ink-3)}' +
    '.sx-bubbles{display:flex;flex-wrap:wrap;gap:6px;align-items:center}' +
    '.sx-bub{--s:0;display:inline-flex;align-items:center;gap:7px;border:1px solid color-mix(in srgb,var(--cc) 35%,var(--surface));background:color-mix(in srgb,var(--cc) calc(8% + var(--s) * 24%),var(--surface));border-radius:999px;' +
      'padding:calc(4px + var(--s) * 6px) calc(10px + var(--s) * 6px);font:600 calc(13px + var(--s) * 5px)/1.1 var(--f-ui);color:var(--ink);cursor:pointer;transition:transform .15s,opacity .2s,box-shadow .2s}' +
    '.sx-bub .sx-dot{width:calc(7px + var(--s) * 13px);height:calc(7px + var(--s) * 13px);border-radius:50%;background:var(--cc);flex:none}' +
    '.sx-bub em{font:500 11px var(--f-mono);font-style:normal;color:var(--ink-3)}.sx-bub:hover{transform:translateY(-1px);box-shadow:0 3px 10px rgba(30,34,39,.12)}' +
    '.sx-bub.off{opacity:.18}.sx-bub.fade{opacity:.35}.sx-bub.rel{opacity:1;box-shadow:0 0 0 2px var(--cc)}.sx-bub.sel{opacity:1;background:var(--cc);color:#fff;border-color:var(--cc)}.sx-bub.sel .sx-dot{background:var(--surface)}.sx-bub.sel em{color:rgba(255,255,255,.8)}' +
    '.sx-side{position:sticky;top:240px}.sx-det{background:var(--surface);border:1px solid var(--line);border-top:4px solid var(--cc,var(--signal));border-radius:10px;padding:16px 18px}' +
    '.sx-det h3{font:800 26px/1.05 var(--f-display);text-transform:uppercase;margin:0 0 8px}.sx-det p{margin:0 0 10px;color:var(--ink-2);font-size:15.5px;line-height:1.55}.sx-det-empty p{font-size:14.5px}' +
    /* quiz */
    '.sx-quiz{max-width:760px;margin:18px auto 0}.sx-qcats{margin:0 0 14px}' +
    '.sx-qcard{background:var(--surface);border:1px solid var(--line);border-top:5px solid var(--cc,var(--signal));border-radius:12px;padding:20px 22px 22px}' +
    '.sx-qtop{display:flex;justify-content:space-between;align-items:baseline}.sx-qok{font-size:14px;color:var(--ink-3)}.sx-qok b{color:var(--ink)}' +
    '.sx-meter{height:6px;background:var(--sunken);border-radius:3px;overflow:hidden;margin:4px 0 16px}.sx-meter i{display:block;height:100%;background:var(--signal);transition:width .3s}' +
    '.sx-qlead{margin:0 0 6px;font-weight:700;color:var(--ink-3);font-size:14px;text-transform:uppercase;letter-spacing:.06em}' +
    '.sx-qcard blockquote{margin:0 0 16px;font-size:19px;line-height:1.5;color:var(--ink);border-left:3px solid var(--line-2);padding-left:14px}' +
    '.sx-opts{display:grid;grid-template-columns:1fr 1fr;gap:8px}' +
    '.sx-opt{display:flex;align-items:center;gap:10px;text-align:left;border:1px solid var(--line-2);background:var(--surface);border-radius:10px;padding:12px 14px;font:700 16px var(--f-ui);color:var(--ink);cursor:pointer}' +
    '.sx-opt kbd{font:600 12px var(--f-mono);border:1px solid var(--line-2);border-radius:5px;padding:1px 6px;color:var(--ink-3);background:var(--surface)}.sx-opt:hover:not([disabled]){border-color:var(--signal);background:var(--surface)}' +
    '.sx-opt.good{background:#DFF1E5;border-color:#1B7A45;color:#14532D}.sx-opt.bad{background:var(--danger-soft);border-color:var(--danger);color:var(--danger)}.sx-opt.mute{opacity:.5}.sx-opt[disabled]{cursor:default}' +
    '.sx-qfb{margin-top:14px;padding:12px 14px;border-radius:10px;font-size:15px;line-height:1.5;color:var(--ink)}.sx-qfb.ok{background:#DFF1E5}.sx-qfb.no{background:var(--danger-soft)}' +
    '.sx-hint{margin:12px 0 0}.sx-qend{text-align:center}.sx-score{font:700 30px var(--f-display);color:var(--ink-3)}.sx-score b{font-size:80px;line-height:1;color:var(--ink)}.sx-qend .sx-rel,.sx-qend .sx-act{justify-content:center}' +
    '@media(max-width:980px){.sx-map{grid-template-columns:1fr}.sx-side{position:static;order:-1}.sx-top-in{grid-template-columns:1fr}}' +
    '@media(max-width:640px){.sx-stats div{min-width:0;flex:1;padding:10px 12px}.sx-stats b{font-size:30px}.sx-group[data-l]{grid-template-columns:1fr}.sx-letter{position:static;grid-row:auto;font-size:36px;padding-top:12px}.sx-group[data-l] .sx-item{grid-column:1}' +
      '.sx-opts{grid-template-columns:1fr}.sx-tools{position:static}.sx-item,.sx-group{scroll-margin-top:80px}.sx-item{scroll-margin-top:80px}.sx-search kbd,.sx-hint{display:none}.sx-tabs{flex-wrap:nowrap;overflow-x:auto;gap:0}.sx-tab{padding:10px 9px 9px;font-size:14.5px;gap:6px}.sx-tab svg{width:16px;height:16px}.sx-best{display:none}}';

  /* ---------- podpięcie pod router ---------- */
  function mount() {
    var view = document.getElementById('view');
    var m = location.hash.replace('#', '').match(/^slowniczek(?:\/([a-z0-9-]+))?$/);
    if (!view || !m) { root = null; return; }
    if (view.querySelector('[data-sx]')) return;
    if (!G()) return;                                   // brak danych – zostaw zwykły widok
    if (!document.getElementById('sx-css')) { var s = document.createElement('style'); s.id = 'sx-css'; s.textContent = CSS; document.head.appendChild(s); }
    st.sel = m[1] || null; if (st.sel) { st.open[st.sel] = true; st.q = ''; st.cat = ''; st.tab = 'lista'; }
    view.innerHTML = frame();
    root = view.querySelector('[data-sx]');
    wire();
    setTab(st.tab);
    if (st.sel) [60, 350, 900].forEach(function (ms, i) { setTimeout(function () {
      var it = root && root.querySelector('#g-' + st.sel); if (!it) return;
      var tools = root.querySelector('.sx-tools'), want = (getComputedStyle(tools).position === 'sticky' ? 68 + tools.offsetHeight : 76) + 12;
      if (i === 0 || Math.abs(it.getBoundingClientRect().top - want) > 40) scrollToEl(it);
      if (i === 0) it.classList.add('flash');
    }, ms); });
  }
  function init() {
    var view = document.getElementById('view');
    if (!view) return setTimeout(init, 50);
    new MutationObserver(function () { mount(); }).observe(view, {childList: true});
    window.addEventListener('hashchange', function () { setTimeout(mount, 0); });
    mount();
  }
  window.EBSlowniczek = {index: index, mount: mount};
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
