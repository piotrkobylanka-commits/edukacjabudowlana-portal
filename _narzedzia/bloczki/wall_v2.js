  /* ---------- otwory: położenie, kontrola, rysunek ściany ---------- */
  // liczba kondygnacji w podanej wysokości muru (do rozmieszczania otworów i kontroli)
  const floorsOf = (S, g, k) => (S.wien.on && k !== 'd' && (S.wien.n || 1) > 1) ? Math.min(4, Math.round(S.wien.n)) : Math.max(1, Math.min(4, Math.round(g.h / 2.8)));
  // ściany w rozwinięciu: dla ścian zewnętrznych – kolejne ściany obwodu rzutu (gdy długość = obwód)
  function segsOf(S, r){
    const RG = r.k === 'z' ? r.RG : null;
    if (RG && RG.walls.length > 1 && Math.abs(RG.perim - r.g.len) < .05) return RG.walls.map((w, i) => ({s: w.s, len: w.len, nm: `${i + 1} · ${w.nm}`, i}));
    return [{s: 0, len: r.g.len, nm: r.k === 'z' ? 'ściany zewnętrzne' : 'ściany ' + GR[r.k].sh, i: 0}];
  }
  const sillOf = o => o.sill != null && o.sill !== '' && isFinite(o.sill) ? +o.sill : (OTY[o.t] ? OTY[o.t].sill : 0);
  const ovl = (a0, a1, b0, b1) => Math.min(a1, b1) - Math.max(a0, b0);
  // geometria ściany: wysokość z murem nad stropem (szczyty), obrys szczytów
  function wallGeo(S, r){
    const g = r.g, RG = r.k === 'z' ? r.RG : null, roofOn = !!(RG && S.dach.t !== 'brak' && RG.hmax > 0), ts = roofOn ? Math.max(0, S.dach.ts) : 0, base = g.h + ts;
    const poly = roofOn ? [[0, base], ...RG.prof.map(q => [q[0], base + q[1]]), [RG.perim, base]] : null;
    const inP = (x, y) => { if (!poly) return false; let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++){ const [xi, yi] = poly[i], [xj, yj] = poly[j]; if (((yi > y) !== (yj > y)) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
    return {roofOn, ts, base, poly, inP, ymax: roofOn ? base + RG.hmax : g.h};
  }
  // rozmieszczenie: otwory ustawione ręcznie (o.at[i]) zostają, pozostałe trafiają w wolne miejsca
  function layout(S, r){
    const g = r.g, k = r.k, fl = floorsOf(S, g, k), fh = g.h / fl, segs = segsOf(S, r), G = wallGeo(S, r), m = S.nad.on ? Math.max(.1, S.nad.op) : .1;
    const items = []; S.op.forEach((o, ri) => { if (o.g !== k || !(o.n > 0 && o.w > 0 && o.h > 0)) return; for (let ii = 0; ii < Math.round(o.n); ii++) items.push({o, ri, ii, t: o.t, w: Math.min(o.w, g.len), h: o.h, fix: o.at && o.at[ii] ? o.at[ii] : null}); });
    const placed = [], band = it => [it.y0, it.y1 + (S.nad.on ? S.nad.h : 0)];
    const put = it => { it.x1 = it.x0 + it.w; it.y1 = it.y0 + it.h; placed.push(it); };
    const clampX = (x, w) => Math.max(0, Math.min(g.len - w, x)), clampY = (y, h) => Math.max(0, Math.min(G.ymax - h, y));
    items.filter(it => it.fix).forEach(it => { it.x0 = clampX(+it.fix.x || 0, it.w); it.y0 = clampY(+it.fix.y || 0, it.h); put(it); });
    const fits = (x, it) => { if (x < -1e-6 || x + it.w > g.len + 1e-6) return false;
      if (segs.length > 1){ const sg = segs.find(s => x >= s.s - 1e-6 && x < s.s + s.len); if (!sg || x < sg.s + m - 1e-6 || x + it.w > sg.s + sg.len - m + 1e-6) return false; }
      const b = [it.y0, it.y0 + it.h + (S.nad.on ? S.nad.h : 0)];
      return !placed.some(q => ovl(b[0], b[1], ...band(q)) > 0 && ovl(x - 2 * m, x + it.w + 2 * m, q.x0, q.x1) > 0); };
    const auto = items.filter(it => !it.fix);
    for (let f = 0; f < fl; f++){
      const part = auto.filter((it, i) => i % fl === f), tw = part.reduce((s, o) => s + o.w, 0), gap = Math.max(.3, (g.len - tw) / (part.length + 1)); let x = gap;
      part.forEach(it => { it.y0 = clampY(f * fh + sillOf(it.o), it.h); let best = null;
        for (let d = 0; d <= g.len && best == null; d += .05){ for (const c of d ? [x + d, x - d] : [x]){ const cx = Math.round(c * 20) / 20; if (fits(cx, it)){ best = cx; break; } } }
        it.x0 = best != null ? best : clampX(x, it.w); x = it.x0 + it.w + gap; put(it); });
    }
    return {items, fl, fh, segs, G, m};
  }
  // kontrola położenia otworów; pierMin – minimalna szerokość filarka [m]
  function checkOps(S, r, L){
    const g = r.g, k = r.k, {items, fh, segs, G, m} = L, nad = S.nad.on, op = S.nad.op, pierMin = Math.max(.3, (r.p.L + r.p.jv) / 1000);
    const cm = v => fx(v * 100, 0) + ' cm', corners = segs.length > 1 ? [...segs.map(s => s.s), g.len] : (k === 'z' ? [0, g.len] : []);
    items.forEach(it => { it.msg = []; it.st = null; });
    const add = (it, st, t) => { it.msg.push(t); if (st === 'err' || !it.st) it.st = st; };
    items.forEach(it => {
      corners.slice(1, -1).forEach(c => { if (it.x0 < c - 1e-6 && it.x1 > c + 1e-6) add(it, 'err', 'otwór przechodzi przez narożnik'); });
      corners.forEach(c => { const d = it.x0 >= c - 1e-6 ? it.x0 - c : c - it.x1; if (d >= -1e-6 && d < (nad ? op : .1) - 1e-6 && !(it.x0 < c - 1e-6 && it.x1 > c + 1e-6)) add(it, 'warn', nad ? `od narożnika tylko ${cm(Math.max(0, d))} – nadproże potrzebuje ${cm(op)} oparcia` : `otwór przy samym narożniku (${cm(Math.max(0, d))})`); });
      if (it.y0 < g.h - 1e-6){ const f = Math.min(Math.floor((it.y0 + 1e-6) / fh), Math.round(g.h / fh) - 1), top = (f + 1) * fh, wTop = top - (S.wien.on && k !== 'd' ? S.wien.h : 0);
        if (it.y1 > top + 1e-6) add(it, 'err', f + 1 < Math.round(g.h / fh) ? 'otwór przecina strop między kondygnacjami' : 'otwór wyższy niż ściana');
        else if (it.y1 + (nad ? S.nad.h : 0) > wTop + 1e-6) add(it, 'warn', nad ? `nadproże (${cm(S.nad.h)}) nie mieści się pod ${S.wien.on && k !== 'd' ? 'wieńcem' : 'stropem'} – brakuje ${cm(it.y1 + S.nad.h - wTop)}` : 'otwór sięga wieńca'); }
      else if (G.roofOn){ if (it.y0 < G.base - 1e-6) add(it, 'err', 'otwór przecina strop');
        else if (![[it.x0, it.y0], [it.x1, it.y0], [it.x0, it.y1], [it.x1, it.y1]].every(q => G.inP(q[0], q[1]))) add(it, 'err', 'otwór wystaje poza obrys szczytu lub ścianki kolankowej'); }
    });
    for (let a = 0; a < items.length; a++) for (let b = a + 1; b < items.length; b++){ const A = items[a], B = items[b];
      const vb = ovl(A.y0, A.y1 + (nad ? S.nad.h : 0), B.y0, B.y1 + (nad ? S.nad.h : 0)); if (vb <= 0) continue;
      const gap = Math.max(A.x0, B.x0) - Math.min(A.x1, B.x1);
      if (gap < -1e-6 && ovl(A.y0, A.y1, B.y0, B.y1) > 1e-6){ add(A, 'err', 'nachodzi na inny otwór'); add(B, 'err', 'nachodzi na inny otwór'); }
      else if (gap >= -1e-6 && nad && gap < 2 * op - 1e-6){ const t = `filarek ${cm(Math.max(0, gap))} – za wąski na oparcie dwóch nadproży (2 × ${cm(op)})`; add(A, 'warn', t); add(B, 'warn', t); }
      else if (gap >= -1e-6 && gap < pierMin - 1e-6){ const t = `filarek ${cm(gap)} – węższy niż jeden element, same docinki`; add(A, 'warn', t); add(B, 'warn', t); } }
    return items.filter(it => it.st);
  }
  // odległości od sąsiadów na tej samej wysokości (do wymiarowania zaznaczonego otworu)
  function neigh(L, it, len){
    const same = L.items.filter(q => q !== it && ovl(q.y0, q.y1, it.y0, it.y1) > 0), sg = L.segs.find(s => it.x0 >= s.s - 1e-6 && it.x0 < s.s + s.len) || L.segs[0];
    const lb = Math.max(sg.s, ...same.filter(q => q.x1 <= it.x0 + 1e-6).map(q => q.x1)), rb = Math.min(sg.s + sg.len, len, ...same.filter(q => q.x0 >= it.x1 - 1e-6).map(q => q.x0));
    return {sg, lb, rb};
  }
  function svgWall(S, r, sel, view){
    const g = r.g, p = r.p, M = MAT[p.mat] || MAT.bk, bl = p.L / 1000, bj = p.jv / 1000, bh = p.H / 1000, rh = (p.H + p.jh) / 1000;
    const L = layout(S, r), bad = checkOps(S, r, L), ops = L.items, G = L.G, hW = S.wien.on && r.k !== 'd' ? S.wien.h : 0, RG = r.k === 'z' ? r.RG : null, roofOn = G.roofOn, ts = G.ts;
    const seg = view != null && L.segs[view] ? L.segs[view] : null, vx0 = seg ? seg.s : 0, vx1 = seg ? seg.s + seg.len : Math.max(g.len, roofOn ? RG.perim : 0), vw = vx1 - vx0;
    const sc = seg ? Math.max(40, Math.min(150, 860 / Math.max(vw, 1))) : Math.max(34, Math.min(90, 900 / Math.max(vw, 1)));
    const padL = 56, padR = 40, padT = 46 + (roofOn ? (RG.hmax + ts) * sc : 0), padB = 74, W = Math.max(640, padL + vw * sc + padR), H = padT + g.h * sc + padB;
    const X = x => padL + (x - vx0) * sc, Y = y => padT + (g.h - y) * sc, inV = (a, b) => b > vx0 - 1e-6 && a < vx1 + 1e-6;
    const obst = []; ops.forEach(o => { obst.push([o.x0, o.x1, o.y0, o.y1]); if (S.nad.on) obst.push([o.x0 - S.nad.op, o.x1 + S.nad.op, o.y1, o.y1 + S.nad.h]); });
    let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" class="mu-wall${seg ? ' fit' : ''}" role="group" aria-label="Rozwinięcie ściany z układem elementów i otworami"><defs>
      <pattern id="muW" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill="#B9BCBE"/><line x1="0" y1="0" x2="0" y2="8" stroke="#8D9194" stroke-width="2"/></pattern>
      <pattern id="muG" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#DCE9F3"/><path d="M0 6L6 0" stroke="#A9C6DD" stroke-width="1"/></pattern>
      <pattern id="muGr" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#F8DEDA"/><path d="M0 6L6 0" stroke="#E7A49B" stroke-width="1"/></pattern>
      <clipPath id="muVw"><rect x="${X(vx0) - 6}" y="0" width="${vw * sc + 12}" height="${H}"/></clipPath></defs>`;
    s += `<rect class="mu-hit" x="${X(vx0)}" y="${Y(G.ymax)}" width="${vw * sc}" height="${(G.ymax) * sc}" fill="transparent"/>`;
    s += `<rect x="${X(vx0) - 4}" y="${Y(0)}" width="${vw * sc + 8}" height="6" fill="#6B6F73"/><g clip-path="url(#muVw)">`;
    let full = 0, cut = 0;
    const blk = (R, isCut) => { const [x0, x1, y0, y1] = R; if (!inV(x0, x1)) return ''; if (isCut) cut++; else full++;
      return `<rect x="${X(x0).toFixed(1)}" y="${Y(y1).toFixed(1)}" width="${((x1 - x0) * sc).toFixed(1)}" height="${((y1 - y0) * sc).toFixed(1)}" fill="${isCut ? '#F2B48C' : M.front}" stroke="${M.edge}" stroke-width=".8"/>`; };
    const top = g.h - hW;
    for (let k = 0; k * rh < top - 1e-6; k++){ const y0 = k * rh, y1 = Math.min(y0 + bh, top), vcut = y0 + bh > top + 1e-6, off = k % 2 ? (bl + bj) / 2 : 0;
      for (let x = -off; x < g.len - 1e-6; x += bl + bj){ if (x + bl < vx0 - 1e-6 || x > vx1 + 1e-6) continue; const B = [Math.max(0, x), Math.min(g.len, x + bl), y0, y1]; if (B[1] - B[0] < 1e-4) continue;
        let parts = [B]; obst.forEach(O => { parts = parts.flatMap(q => rectSub(q, O)); });
        const hcut = B[0] > x + 1e-6 || B[1] < x + bl - 1e-6;
        parts.forEach(q => { const whole = parts.length === 1 && Math.abs(q[1] - q[0] - (B[1] - B[0])) < 1e-6 && Math.abs(q[3] - q[2] - (B[3] - B[2])) < 1e-6; s += blk(q, hcut || vcut || !whole); }); } }
    if (hW) s += `<rect x="${X(0)}" y="${Y(g.h)}" width="${g.len * sc}" height="${hW * sc}" fill="url(#muW)" stroke="#5B6064"/><text x="${X(Math.max(0, vx0) + .15)}" y="${Y(g.h) + hW * sc / 2 + 4}" class="mu-lab">wieniec</text>`;
    if (roofOn){ const base = G.base, poly = G.poly;
      if (ts) s += `<rect x="${X(0)}" y="${Y(base)}" width="${RG.perim * sc}" height="${ts * sc}" fill="url(#muW)" stroke="#5B6064"/><text x="${X(vx0 + .2)}" y="${Y(base) + ts * sc / 2 + 4}" class="mu-lab">strop</text>`;
      s += `<clipPath id="muRoof"><path d="M${poly.map(q => X(q[0]) + ' ' + Y(q[1])).join('L')}Z"/></clipPath><g clip-path="url(#muRoof)">`;
      for (let k = 0; k * rh < RG.hmax; k++){ const y0 = base + k * rh, y1 = y0 + bh, off = k % 2 ? (bl + bj) / 2 : 0;
        for (let x = -off; x < RG.perim; x += bl + bj){ if (x + bl < vx0 - 1e-6 || x > vx1 + 1e-6) continue; const c = [[x + .002, y0 + .002], [x + bl - .002, y0 + .002], [x + .002, y1 - .002], [x + bl - .002, y1 - .002]].map(q => G.inP(q[0], q[1]));
          if (!c.some(Boolean) && !G.inP(x + bl / 2, y0 + .002)) continue;
          const B = [Math.max(0, x), Math.min(RG.perim, x + bl), y0, y1]; let parts = [B]; obst.forEach(O => { parts = parts.flatMap(q => rectSub(q, O)); });
          const edge = !c.every(Boolean) || x < 0 || x + bl > RG.perim; parts.forEach(q => { s += blk(q, edge || parts.length > 1 || Math.abs(q[1] - q[0] - (B[1] - B[0])) > 1e-6 || Math.abs(q[3] - q[2] - bh) > 1e-6); }); } }
      s += `</g><path d="M${poly.map(q => X(q[0]) + ' ' + Y(q[1])).join('L')}Z" fill="none" stroke="#3a3d42" stroke-width="1.6"/>`; }
    s += '</g>';
    // ściany obwodu (narożniki) i ich nazwy
    if (L.segs.length > 1) L.segs.forEach(w => { if (!inV(w.s, w.s + w.len)) return;
      s += `<line x1="${X(w.s)}" x2="${X(w.s)}" y1="${Y(0) + 4}" y2="${Y(G.ymax) - 8}" stroke="#2E6FA8" stroke-dasharray="4 4" stroke-width="1"/>`;
      if (w.len * sc > 70) s += `<text x="${X(w.s + w.len / 2)}" y="${Y(G.ymax) - 14}" text-anchor="middle" class="mu-lab mu-segl" data-seg="${w.i}">ściana ${w.nm} · ${fx(w.len, 2)} m</text>`; });
    if (roofOn && Math.abs(RG.perim - g.len) > .05) s += `<text x="${X(vx0)}" y="${Y(G.ymax) - 30}" class="mu-ax">długość ścian (${fx(g.len, 1)} m) różni się od obwodu rzutu (${fx(RG.perim, 1)} m)</text>`;
    s += `<rect x="${X(0)}" y="${Y(g.h)}" width="${g.len * sc}" height="${g.h * sc}" fill="none" stroke="#3a3d42" stroke-width="1.8" clip-path="url(#muVw)"/>`;
    for (let f = 1; f < L.fl; f++) s += `<line x1="${X(vx0) - 8}" x2="${X(Math.min(vx1, g.len)) + 8}" y1="${Y(f * L.fh)}" y2="${Y(f * L.fh)}" stroke="#2E6FA8" stroke-dasharray="6 5" stroke-width="1.2"/><text x="${X(Math.min(vx1, g.len)) + 6}" y="${Y(f * L.fh) - 4}" class="mu-lab" style="fill:#2E6FA8">poziom ${f}</text>`;
    // otwory (przeciąganie, uchwyty, stan kontroli)
    const isSel = o => sel && sel.r === o.ri && sel.i === o.ii;
    ops.forEach(o => { if (!inV(o.x0, o.x1)) return; const on = isSel(o), err = o.st === 'err', wr = o.st === 'warn', col = err ? '#C62828' : wr ? '#B26A00' : '#2E6FA8';
      const sgn = (L.segs.find(q => o.x0 >= q.s - 1e-6 && o.x0 < q.s + q.len) || L.segs[0]);
      if (S.nad.on) s += `<rect x="${X(o.x0 - S.nad.op)}" y="${Y(o.y1 + S.nad.h)}" width="${(o.w + 2 * S.nad.op) * sc}" height="${S.nad.h * sc}" fill="${err ? '#D98C84' : '#9AA0A6'}" stroke="#5B6064" stroke-width="1" pointer-events="none"/>`;
      s += `<g class="mu-op${on ? ' on' : ''}${err ? ' err' : wr ? ' warn' : ''}" data-r="${o.ri}" data-i="${o.ii}" tabindex="0" role="button" aria-pressed="${on}" aria-label="${OTY[o.t] ? OTY[o.t].nm : o.t} ${fx(o.w * 100, 0)} × ${fx(o.h * 100, 0)} cm, ściana ${esc(sgn.nm)}, ${fx(o.x0 - sgn.s, 2)} m od narożnika${o.msg.length ? ', uwaga: ' + esc(o.msg.join('; ')) : ''}">`
        + `<rect x="${X(o.x0)}" y="${Y(o.y1)}" width="${o.w * sc}" height="${o.h * sc}" fill="url(#${err ? 'muGr' : 'muG'})" stroke="${col}" stroke-width="${on ? 3 : 1.6}"${wr && !on ? ' stroke-dasharray="6 3"' : ''}/>`;
      if (o.t === 'okno' || o.t === 'balk') s += `<line x1="${X(o.x0 + o.w / 2)}" x2="${X(o.x0 + o.w / 2)}" y1="${Y(o.y1)}" y2="${Y(o.y0)}" stroke="${col}" stroke-width="1"/>`;
      if (o.t === 'drzwi') s += `<path d="M${X(o.x0)} ${Y(o.y0)}A${o.w * sc} ${o.w * sc} 0 0 1 ${X(o.x1)} ${Y(o.y0) - Math.min(o.w, o.h) * sc}" fill="none" stroke="${col}" stroke-width=".8" stroke-dasharray="3 3"/>`;
      if (o.w * sc > 46) s += `<text x="${X(o.x0 + o.w / 2)}" y="${Y(o.y0 + o.h / 2) + 4}" text-anchor="middle" class="mu-ot">${fx(o.w * 100, 0)}×${fx(o.h * 100, 0)}</text>`;
      if (o.st && o.w * sc > 22) s += `<g transform="translate(${X(o.x1) - 11} ${Y(o.y1) + 11})" pointer-events="none"><circle r="8" fill="${col}"/><text y="4" text-anchor="middle" class="mu-bang">!</text></g>`;
      if (on){ const hs = 14; s += `<rect class="mu-hd" data-hd="w" x="${X(o.x1) - hs / 2}" y="${Y(o.y0 + o.h / 2) - hs}" width="${hs}" height="${hs * 2}" rx="4"/><rect class="mu-hd" data-hd="h" x="${X(o.x0 + o.w / 2) - hs}" y="${Y(o.y1) - hs / 2}" width="${hs * 2}" height="${hs}" rx="4"/>`; }
      s += `<title>${OTY[o.t] ? OTY[o.t].nm : o.t} ${fx(o.w, 2)} × ${fx(o.h, 2)} m${o.msg.length ? ' – ' + esc(o.msg.join('; ')) : ' – przeciągnij, żeby przesunąć'}</title></g>`; });
    // wymiary zaznaczonego otworu: odległości do narożnika / sąsiadów i parapet
    const so = ops.find(isSel);
    if (so && inV(so.x0, so.x1)){ const {lb, rb} = neigh(L, so, g.len), yd = Y(so.y0) + 18, fl0 = Math.min(Math.floor((so.y0 + 1e-6) / L.fh), L.fl - 1) * L.fh, base0 = so.y0 >= g.h - 1e-6 && G.roofOn ? G.base : fl0;
      const dim = (a, b, y) => b - a > .01 ? `<line x1="${X(a)}" x2="${X(b)}" y1="${y}" y2="${y}" class="mu-dsel"/><line x1="${X(a)}" x2="${X(a)}" y1="${y - 6}" y2="${y + 6}" class="mu-dsel"/><line x1="${X(b)}" x2="${X(b)}" y1="${y - 6}" y2="${y + 6}" class="mu-dsel"/><text x="${(X(a) + X(b)) / 2}" y="${y - 5}" text-anchor="middle" class="mu-dst">${fx((b - a) * 100, 0)}</text>` : '';
      s += `<g pointer-events="none">${dim(lb, so.x0, yd)}${dim(so.x1, rb, yd)}`;
      if (so.y0 - base0 > .01) s += `<line x1="${X(so.x0) - 14}" x2="${X(so.x0) - 14}" y1="${Y(base0)}" y2="${Y(so.y0)}" class="mu-dsel"/><text x="${X(so.x0) - 18}" y="${(Y(base0) + Y(so.y0)) / 2 + 4}" text-anchor="end" class="mu-dst">${fx((so.y0 - base0) * 100, 0)}</text>`;
      s += '</g>'; }
    // wymiary ściany
    const yb = Y(0) + 30, xa = Math.max(0, vx0), xb = Math.min(g.len, vx1);
    s += `<line x1="${X(xa)}" x2="${X(xb)}" y1="${yb}" y2="${yb}" class="mu-dl"/><line x1="${X(xa)}" x2="${X(xa)}" y1="${yb - 6}" y2="${yb + 6}" class="mu-dl"/><line x1="${X(xb)}" x2="${X(xb)}" y1="${yb - 6}" y2="${yb + 6}" class="mu-dl"/><text x="${X(xa + Math.min(xb - xa, 12) / 2)}" y="${yb - 6}" text-anchor="middle" class="mu-dt">${seg ? 'ściana ' + esc(seg.nm) + ' · ' : 'długość '}${fx(xb - xa, 2)} m</text>`;
    s += `<line x1="${X(xa) - 22}" x2="${X(xa) - 22}" y1="${Y(0)}" y2="${Y(g.h)}" class="mu-dl"/><text x="${X(xa) - 28}" y="${Y(g.h / 2)}" text-anchor="middle" class="mu-dt" transform="rotate(-90 ${X(xa) - 28} ${Y(g.h / 2)})">${fx(g.h, 2)} m</text>`;
    const nOp = ops.filter(o => inV(o.x0, o.x1)).length;
    s += `<text x="${X(xa)}" y="${H - 12}" class="mu-ax">${seg ? 'ta ściana' : 'rozwinięcie ścian'}: ${nOp} ${nOp === 1 ? 'otwór' : nOp % 10 >= 2 && nOp % 10 <= 4 && (nOp % 100 < 12 || nOp % 100 > 14) ? 'otwory' : 'otworów'} · widocznych elementów: ${full} całych, ${cut} docinanych</text>`;
    return {svg: s + '</svg>', full, cut, L, bad, sc, vx0, padL, padT};
  }
