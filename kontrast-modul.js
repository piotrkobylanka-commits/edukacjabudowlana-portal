/* kontrast-modul.js – EdukacjaBudowlana, 30.10.2026
   Pilnuje czytelnosci napisow na wykresach i rysunkach SVG (kalkulatory, schematy).
   Dla kazdego napisu ustala tlo pod nim (ksztalt SVG pod srodkiem napisu albo tlo kontenera),
   liczy kontrast WCAG i gdy jest za maly, przestawia kolor napisu na czarny lub bialy.
   Dziala po kazdym przerysowaniu wykresu i po zmianie motywu jasny/ciemny. */
(function () {
  'use strict';
  var MIN = 3.0;          // minimalny kontrast tekst/tlo (WCAG dla grafiki i duzego tekstu)
  var DARK = '#111418', LIGHT = '#FFFFFF';

  function parse(c) {
    if (!c) return null;
    var m = String(c).match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+%?))?\s*\)/);
    if (m) {
      var a = m[4] == null ? 1 : (m[4].slice(-1) === '%' ? parseFloat(m[4]) / 100 : parseFloat(m[4]));
      return [+m[1], +m[2], +m[3], a];
    }
    m = String(c).match(/#([0-9a-f]{3,8})\b/i);
    if (m) {
      var h = m[1];
      if (h.length === 3 || h.length === 4) h = h.replace(/./g, '$&$&');
      return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1];
    }
    return null;
  }
  function lum(c) {
    var f = function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
  }
  function ratio(a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
  function mix(top, bot) { var a = top[3]; return [top[0] * a + bot[0] * (1 - a), top[1] * a + bot[1] * (1 - a), top[2] * a + bot[2] * (1 - a), 1]; }

  // kolor z gradientu SVG: srednia z przystankow
  function gradColor(svg, url) {
    var id = (url.match(/url\(\s*["']?#([^"')]+)/) || [])[1];
    if (!id) return null;
    var g = (svg.ownerDocument || document).getElementById(id);
    if (!g) return null;
    var st = g.querySelectorAll('stop'), s = [0, 0, 0], n = 0, op = 0;
    for (var i = 0; i < st.length; i++) {
      var cs = getComputedStyle(st[i]), c = parse(cs.stopColor);
      if (!c) continue;
      s[0] += c[0]; s[1] += c[1]; s[2] += c[2]; op += (+cs.stopOpacity || 0) * c[3]; n++;
    }
    return n ? [s[0] / n, s[1] / n, s[2] / n, op / n] : null;
  }
  function fillOf(el, svg) {
    var cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return null;
    var f = cs.fill, c;
    if (!f || f === 'none') return null;
    if (f.indexOf('url(') >= 0) { c = gradColor(svg, f); if (!c) return 'X'; } // wzor/obraz – tla nie da sie ocenic
    else c = parse(f);
    if (!c) return null;
    var a = c[3] * (parseFloat(cs.fillOpacity) || 0) * opac(el, svg);
    if (a < 0.45) return null;
    return [c[0], c[1], c[2], a];
  }
  function opac(el, svg) {
    var o = 1;
    for (var e = el; e && e !== svg.parentNode; e = e.parentNode) {
      if (e.nodeType === 1) o *= parseFloat(getComputedStyle(e).opacity);
    }
    return o;
  }
  // tlo elementu HTML (z gradientem: srednia kolorow)
  function boxBg(el) {
    for (var e = el; e && e.nodeType === 1; e = e.parentElement) {
      var cs = getComputedStyle(e), c = parse(cs.backgroundColor);
      if (cs.backgroundImage && cs.backgroundImage.indexOf('gradient') >= 0) {
        var all = cs.backgroundImage.match(/rgba?\([^)]+\)|#[0-9a-f]{3,8}\b/gi) || [], s = [0, 0, 0], n = 0;
        all.forEach(function (x) { var p = parse(x); if (p && p[3] > 0.5) { s[0] += p[0]; s[1] += p[1]; s[2] += p[2]; n++; } });
        if (n) return [s[0] / n, s[1] / n, s[2] / n, 1];
      }
      if (c && c[3] > 0.5) return c[3] < 1 ? mix(c, boxBg(e.parentElement) || [255, 255, 255, 1]) : c;
    }
    var root = parse(getComputedStyle(document.body).backgroundColor);
    return root && root[3] > 0.5 ? root : [255, 255, 255, 1];
  }

  // nowy kolor napisu: kolorowy napis rozjasniamy/przyciemniamy (zostaje ten sam odcien),
  // szary – od razu czarny albo bialy
  function pick(fc, bg) {
    var toW = ratio([255, 255, 255], bg) >= ratio([17, 20, 24], bg), end = toW ? [255, 255, 255] : [17, 20, 24];
    var mx = Math.max(fc[0], fc[1], fc[2]), mn = Math.min(fc[0], fc[1], fc[2]);
    if (mx - mn > 60) {
      for (var k = 0.15; k < 1; k += 0.1) {
        var c = [fc[0] + (end[0] - fc[0]) * k, fc[1] + (end[1] - fc[1]) * k, fc[2] + (end[2] - fc[2]) * k];
        if (ratio(c, bg) >= MIN + 0.8) return 'rgb(' + c.map(Math.round).join(',') + ')';
      }
    }
    return toW ? LIGHT : DARK;
  }
  var SHAPES = 'rect,circle,ellipse,path,polygon,polyline,image,foreignObject';
  function bgAt(text, svg, shapes, base) {
    var r = text.getBoundingClientRect();
    if (!r.width && !r.height) return null;
    var px = r.left + r.width / 2, py = r.top + r.height / 2, bg = base;
    // od ostatniego ksztalta przed napisem – pierwszy trafiony to tlo napisu
    for (var i = shapes.length - 1; i >= 0; i--) {
      var s = shapes[i];
      if (!(s.compareDocumentPosition(text) & Node.DOCUMENT_POSITION_FOLLOWING)) continue;
      if (s.contains(text)) continue;
      var f = s._kxR === RUN ? s._kxFill : (s._kxR = RUN, s._kxInv = null, s._kxFill = fillOf(s, svg));
      var tag = s.tagName.toLowerCase();
      if (tag === 'image' || tag === 'foreignobject') {
        // zdjecie lub HTML pod napisem – tla nie oceniamy, napis zostaje bez zmian
        var b = s.getBoundingClientRect();
        if (px >= b.left && px <= b.right && py >= b.top && py <= b.bottom && getComputedStyle(s).display !== 'none') return null;
        continue;
      }
      if (!f) continue;
      if (!s.isPointInFill) continue;
      if (!s._kxInv) { var m = s.getScreenCTM(); if (!m) continue; s._kxInv = m.inverse(); }
      var p = new DOMPoint(px, py).matrixTransform(s._kxInv), hit = false;
      try { hit = s.isPointInFill(p); } catch (e) { hit = false; }
      if (hit) { if (f === 'X') return null; bg = f[3] < 1 ? mix(f, base) : f; break; }
    }
    return bg;
  }

  function fixSvg(svg) {
    if (svg.closest('[data-kx-off]') || svg.closest('defs,symbol,marker,pattern,clipPath,mask')) return 0;
    var texts = svg.querySelectorAll('text');
    if (!texts.length) return 0;
    var shapes = [].slice.call(svg.querySelectorAll(SHAPES)).filter(function (s) { return !s.closest('defs,symbol,marker,pattern,clipPath,mask,text'); });
    var base = boxBg(svg.parentElement || svg), n = 0;
    for (var i = 0; i < texts.length; i++) {
      var t = texts[i];
      if (t.closest('defs,symbol,marker,pattern,clipPath,mask')) continue;
      if (t.hasAttribute('data-kx')) { // przywroc oryginalny styl napisu przed ponowna ocena
        var o = t.getAttribute('data-kx').split('|');
        if (o[0]) t.style.setProperty('fill', o[0], o[1]); else t.style.removeProperty('fill');
        if (o[2]) t.style.setProperty('stroke', o[2], o[3]); else t.style.removeProperty('stroke');
        t.removeAttribute('data-kx');
      }
      if (!(t.textContent || '').trim()) continue;
      var cs = getComputedStyle(t);
      if (cs.display === 'none' || cs.visibility === 'hidden' || opac(t, svg) < 0.3) continue; // ukryty albo jeszcze sie pojawia
      var fc = parse(cs.fill);
      if (!fc || cs.fill.indexOf('url(') >= 0) continue;
      var bg = bgAt(t, svg, shapes, base);
      if (!bg) continue;
      // obwodka (halo) pod tekstem: jesli dobrze kontrastuje z tekstem, napis jest czytelny
      var sc = parse(cs.stroke), sw = parseFloat(cs.strokeWidth) || 0;
      var halo = sc && cs.stroke !== 'none' && sw >= 2 && /stroke/.test(cs.paintOrder) && sc[3] > 0.6;
      if (halo && ratio(fc, sc) >= MIN) continue;
      var a = fc[3] * opac(t, svg), eff = a < 1 ? mix([fc[0], fc[1], fc[2], a], bg) : fc;
      if (ratio(eff, bg) >= MIN) continue;
      var nd = pick(fc, bg);
      t.setAttribute('data-kx', [t.style.getPropertyValue('fill'), t.style.getPropertyPriority('fill'), t.style.getPropertyValue('stroke'), t.style.getPropertyPriority('stroke')].join('|'));
      t.style.setProperty('fill', nd, 'important');
      if (halo) t.style.setProperty('stroke', lum(parse(nd)) < 0.3 ? 'rgba(255,255,255,.9)' : 'rgba(0,0,0,.75)', 'important');
      n++;
    }
    return n;
  }

  var pend = false, RUN = 0;
  function run() {
    pend = false; RUN++;
    var root = document.getElementById('view') || document.body, n = 0;
    var svgs = root.querySelectorAll('svg');
    for (var i = 0; i < svgs.length; i++) {
      if (svgs[i].parentElement && svgs[i].parentElement.closest('svg')) continue; // tylko zewnetrzne
      try { n += fixSvg(svgs[i]); } catch (e) { /* jeden wykres nie psuje reszty */ }
    }
    window.EBkx = {fixed: n, at: Date.now()};
  }
  function later() {
    if (pend) return;
    pend = true;
    (window.requestAnimationFrame || setTimeout)(function () { setTimeout(run, 60); });
  }
  function start() {
    var v = document.getElementById('view') || document.body;
    new MutationObserver(function (ms) {
      for (var i = 0; i < ms.length; i++) {
        var m = ms[i];
        if (m.type === 'childList') { later(); return; }
        if (m.type === 'attributes' && m.target.nodeType === 1 && !(m.attributeName === 'style' && m.target.hasAttribute('data-kx'))) { later(); return; }
      }
    }).observe(v, {childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'fill', 'aria-pressed', 'hidden']});
    new MutationObserver(later).observe(document.documentElement, {attributes: true, attributeFilter: ['data-theme', 'class']});
    if (window.matchMedia) { var mq = matchMedia('(prefers-color-scheme: dark)'); if (mq.addEventListener) mq.addEventListener('change', later); }
    window.addEventListener('hashchange', later);
    window.addEventListener('resize', later);
    // wykresy, ktore pojawiaja sie z animacja – sprawdz jeszcze raz po jej zakonczeniu
    var onAnim = function (e) { var x = e.target; if (x && x.closest && (x.closest('svg') || (x.querySelector && x.querySelector('svg')))) later(); };
    document.addEventListener('animationend', onAnim, true);
    document.addEventListener('transitionend', onAnim, true);
    later();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  window.EBkxRun = run;
})();
