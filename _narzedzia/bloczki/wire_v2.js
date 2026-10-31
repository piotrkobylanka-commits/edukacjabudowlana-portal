  function wire(el){
    const clone = o => JSON.parse(JSON.stringify(o));
    let S = clone(PRE.parter); delete S.t; delete S.d; S.price = {}; let tab = 'z', sel = null, flt = 'all', snap = 'cm5', drag = null, lastW = null;
    const views = {z: null, w: null, d: null};
    const $ = q => el.querySelector(q), $$ = q => [...el.querySelectorAll(q)];
    const num = v => { const n = parseFloat(String(v).replace(',', '.')); return isFinite(n) ? n : 0; };
    const pl = (n, a, b, c) => n === 1 ? a : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? b : c;
    const fld = (k, l, v, a, rg) => `<div class="field"><label>${l}</label><input type="number" inputmode="decimal" data-f="${k}" value="${v}" ${a || ''}>${rg ? `<input type="range" class="wi-rg" data-f="${k}" min="${rg[0]}" max="${rg[1]}" step="${rg[2]}" value="${v}" aria-label="${l} – suwak">` : ''}</div>`;
    const renderGroup = () => {
      $('.mu-tabs').innerHTML = Object.entries(GR).map(([k, G]) => { const g = S.g[k]; return `<button type="button" role="tab" data-tab="${k}" class="${k === tab ? 'on' : ''}${g.on ? '' : ' off'}"><b>${G.nm}</b><small>${g.on ? fx(g.len, 1) + ' m · ' + prodBy(g.prod).nm : 'wyłączone'}</small></button>`; }).join('');
      const g = S.g[tab], p = prodBy(g.prod), mats = [['all', 'wszystkie'], ...Object.entries(MAT).map(([k, m]) => [k, m.nm])], autoL = tab === 'z' && S.dach.auto;
      const list = PROD.filter(q => flt === 'all' || q.mat === flt).sort((a, b) => Math.abs(a.T - p.T) - Math.abs(b.T - p.T));
      $('.mu-grp').innerHTML = `<label class="mu-on"><input type="checkbox" data-f="on" ${g.on ? 'checked' : ''}> licz ${GR[tab].sh}</label>
        <div class="calc-grid rs-g4">${fld('len', autoL ? 'Łączna długość ścian [m] (z obwodu rzutu)' : 'Łączna długość ścian [m]', g.len, `min="0" step="0.5"${autoL ? ' disabled' : ''}`, autoL ? null : [0, 120, .5])}${fld('h', 'Wysokość muru [m]', g.h, 'min="0" step="0.05"', [.3, 8, .05])}
        ${autoL ? '<div class="field"><label>Długość mierzona</label><select disabled><option>w osiach ścian (wymiary rzutu)</option></select></div>' : `<div class="field"><label>Długość mierzona</label><select data-f="meas"><option value="os"${g.meas === 'os' ? ' selected' : ''}>w osiach ścian</option><option value="zew"${g.meas === 'zew' ? ' selected' : ''}>po obwodzie zewnętrznym</option></select></div>
        ${g.meas === 'zew' ? fld('cor', 'Liczba naroży zewnętrznych', g.cor, 'min="0" step="1"') : ''}`}${fld('price', 'Cena za sztukę [zł] (opcjonalnie)', S.price[p.id] || '', 'min="0" step="0.01" placeholder="z oferty składu"')}</div>
        <div class="mu-mo"><p class="mu-moh">Spoiwo dla wybranego elementu</p><div class="mu-mos">${p.sys.map(x => `<button type="button" data-mo="${x}" class="${sysOf(p, g) === x ? 'on' : ''}"><span class="mu-mosw" style="background:${MO[x].col}"></span><b>${MO[x].nm}</b><small>${MO[x].sh}</small></button>`).join('')}</div></div>
        <div class="mu-flt">${mats.map(([k, n]) => `<button type="button" data-flt="${k}" class="${flt === k ? 'on' : ''}">${n}</button>`).join('')}</div>
        <div class="mu-prods">${list.map(q => `<button type="button" class="mu-pc${q.id === p.id ? ' on' : ''}" data-prod="${q.id}"><span class="mu-pimg">${svgBlock(q, {W: 160, H: 110, noDim: true, pad: 12, k: 'p' + q.id})}</span><b>${esc(q.nm)}</b><small>${q.L}×${q.T}×${q.H} mm · ${fx(perM2(q), 2)} szt./m²</small><small>${q.sys.map(x => MO[x].nm).join(' / ')}${q.pal ? ' · ' + q.pal + ' szt./pal.' : ''}</small></button>`).join('')}</div>`;
    };
    const renderOps = () => {
      $('.mu-ops').innerHTML = S.op.length ? `<div class="mu-opt"><span>rodzaj</span><span>szer. [m]</span><span>wys. [m]</span><span>parapet [m]</span><span>sztuk</span><span>w ścianach</span><span></span></div>` + S.op.map((o, i) => `<div class="mu-opr${sel && sel.r === i ? ' on' : ''}" data-oi="${i}"><select data-o="t" aria-label="Rodzaj otworu">${Object.entries(OTY).map(([k, v]) => `<option value="${k}"${o.t === k ? ' selected' : ''}>${v.nm}</option>`).join('')}</select><input type="number" step="0.05" min="0" data-o="w" value="${o.w}" aria-label="Szerokość [m]"><input type="number" step="0.05" min="0" data-o="h" value="${o.h}" aria-label="Wysokość [m]"><input type="number" step="0.05" min="0" data-o="sill" value="${o.sill != null && o.sill !== '' ? o.sill : ''}" placeholder="${fx(OTY[o.t] ? OTY[o.t].sill : 0, 2)}" aria-label="Wysokość parapetu nad posadzką kondygnacji [m]"><input type="number" step="1" min="0" data-o="n" value="${o.n}" aria-label="Liczba sztuk"><select data-o="g" aria-label="Grupa ścian">${Object.entries(GR).map(([k, v]) => `<option value="${k}"${o.g === k ? ' selected' : ''}>${v.sh}${o.g === k && o.at && o.at.some(Boolean) ? ' · ustawione' : ''}</option>`).join('')}</select><button type="button" class="rs-x" data-del="${i}" aria-label="Usuń wiersz">×</button></div>`).join('') : '<p class="rs-wnote">Brak otworów – dodaj okna i drzwi przyciskami poniżej albo dwuklikiem na rysunku ściany.</p>';
    };
    const renderOdl = () => {
      const card = (key, title, body, on) => `<div class="mu-oc${on ? ' on' : ''}"><label class="mu-on"><input type="checkbox" data-s="${key}" ${on ? 'checked' : ''}> ${title}</label>${on ? `<div class="mu-ocb">${body}</div>` : ''}</div>`;
      $('.mu-odl').innerHTML = ''
        + card('nad.on', 'Odlicz nadproża', fld('nad.h', 'Wysokość nadproża [m]', S.nad.h, 'min="0" step="0.01"') + fld('nad.op', 'Oparcie z każdej strony [m]', S.nad.op, 'min="0" step="0.005"'), S.nad.on)
        + card('wien.on', 'Wysokość muru podana z wieńcem', fld('wien.h', 'Wysokość wieńca [m]', S.wien.h, 'min="0" step="0.01"') + fld('wien.n', 'Liczba wieńców w tej wysokości (kondygnacji)', S.wien.n || 1, 'min="1" step="1"') + '<p class="rs-wnote">Odliczane w ścianach zewnętrznych i wewnętrznych nośnych. Ścianki działowe wieńca nie mają.</p>', S.wien.on)
        + `<div class="mu-oc on"><label class="mu-on">Zapas</label><div class="mu-ocb">${fld('zap', 'Zapas na docinki i straty [%]', S.zap, 'min="0" step="1"', [0, 15, 1])}</div></div>`;
    };
    const ROOFIMG = {brak:'DATAURI',flat:'DATAURI',mono:'DATAURI',dwu:'DATAURI',nacz:'DATAURI',hip:'DATAURI'};
    const roofIcon = (t, sel) => { if (ROOFIMG[t]) return `<span class="mu-ri ph" aria-hidden="true"><img src="${ROOFIMG[t]}" alt="" width="360" height="269" decoding="async"></span>`; const c = sel ? '#B5470A' : '#7A6F66', w = '#E9E4DC', st = `stroke="#3a3d42" stroke-width="1.4" stroke-linejoin="round"`; let r = '';
      if (t === 'brak') r = `<rect x="18" y="44" width="84" height="16" fill="#C9CBCD" ${st}/><rect x="10" y="58" width="100" height="6" fill="#9AA0A6"/>`;
      if (t === 'flat') r = `<rect x="22" y="30" width="76" height="32" fill="${w}" ${st}/><rect x="20" y="24" width="80" height="7" fill="${c}" ${st}/>`;
      if (t === 'mono') r = `<path d="M22 62V34L98 20V62Z" fill="${w}" ${st}/><path d="M16 36L104 19" stroke="${c}" stroke-width="5" stroke-linecap="round"/>`;
      if (t === 'dwu') r = `<rect x="24" y="38" width="72" height="24" fill="${w}" ${st}/><path d="M24 38L60 12L96 38Z" fill="${w}" ${st}/><path d="M16 42L60 10L104 42" fill="none" stroke="${c}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>`;
      if (t === 'nacz') r = `<rect x="24" y="38" width="72" height="24" fill="${w}" ${st}/><path d="M24 38L48 20H72L96 38Z" fill="${w}" ${st}/><path d="M16 42L48 19L60 12L72 19L104 42" fill="none" stroke="${c}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/><path d="M48 20L60 12L72 20Z" fill="${c}"/>`;
      if (t === 'hip') r = `<rect x="16" y="38" width="88" height="24" fill="${w}" ${st}/><path d="M10 40L36 18H84L110 40Z" fill="${c}" ${st}/>`;
      return `<svg viewBox="0 0 120 70" class="mu-ri" aria-hidden="true"><line x1="6" x2="114" y1="63" y2="63" stroke="#6B6F73" stroke-width="2"/>${r}</svg>`; };
    const renderDach = () => { const D = S.dach, RG = roofGeom(D), fd = (k, l, v, a, rg) => fld('d.' + k, l, v, a, rg);
      $('.mu-dach').innerHTML = `<div class="mu-rts">${Object.entries(DACH).map(([k, n]) => `<button type="button" class="mu-rt${D.t === k ? ' on' : ''}" data-roof="${k}">${roofIcon(k, D.t === k)}<span>${n}</span></button>`).join('')}</div>
        <div class="calc-grid rs-g4">
          <div class="field"><label>Rzut budynku</label><select data-dd="plan"><option value="rect"${D.plan !== 'L' ? ' selected' : ''}>prostokąt</option><option value="L"${D.plan === 'L' ? ' selected' : ''}>na kształt litery L</option></select></div>
          ${fd('A', D.plan === 'L' ? 'Długość skrzydła głównego A [m] (w osiach ścian)' : 'Długość budynku A [m] (w osiach ścian)', D.A, 'min="0" step="0.1"', [4, 30, .1])}${fd('B', 'Szerokość B [m] (w osiach, rozpiętość dachu)', D.B, 'min="0" step="0.1"', [4, 16, .1])}
          ${D.plan === 'L' ? fd('L2', 'Wysunięcie skrzydła L₂ [m]', D.L2, 'min="0" step="0.1"', [1, 20, .1]) : ''}
          ${['mono', 'dwu', 'nacz', 'hip'].includes(D.t) ? fd('a', 'Kąt nachylenia dachu α [°]', D.a, 'min="0" max="70" step="1"', [5, 60, 1]) + fd('hk', 'Ścianka kolankowa nad stropem [m]', D.hk, 'min="0" step="0.05"', [0, 2, .05]) : ''}
          ${D.t === 'nacz' ? fd('hn', 'Wysokość naczółka [m]', D.hn, 'min="0" step="0.1"', [.3, 3, .1]) : ''}${D.t === 'flat' ? fd('ha', 'Wysokość attyki [m]', D.ha, 'min="0" step="0.05"', [0, 1.5, .05]) : ''}
          ${D.t !== 'brak' ? fd('ts', 'Grubość stropu (rysunek) [m]', D.ts, 'min="0" step="0.01"') : ''}
        </div>
        <label class="mu-on mu-auto"><input type="checkbox" data-dd="auto" ${D.auto ? 'checked' : ''}> długość ścian zewnętrznych = obwód rzutu (${fx(RG.perim, 2)} m)</label>
        ${D.t !== 'brak' ? `<p class="rs-wnote">Nad stropem: ${RG.kol ? `ścianki kolankowe ${fx(RG.kol, 2)} m²` : ''}${RG.kol && RG.szc ? ', ' : ''}${RG.szc ? `${RG.nG ? 'szczyty' : 'ściany wyższe i boczne'} ${fx(RG.szc, 2)} m²` : ''}${RG.att ? `attyka ${fx(RG.att, 2)} m²` : ''}${['dwu', 'nacz', 'mono'].includes(D.t) && RG.H ? ` · wysokość muru w kalenicy ${fx(D.hk + (D.t === 'mono' ? D.B * RG.tn : RG.H - (D.t === 'nacz' ? Math.min(D.hn, RG.H) : 0)), 2)} m nad stropem` : ''}. Okna w szczytach i ściankach kolankowych dodaj do ścian zewnętrznych i przesuń na rysunku nad strop.</p>` : '<p class="rs-wnote">Bez muru nad stropem – np. ściany fundamentowe albo same ścianki działowe.</p>'}`;
    };
    /* ---------- edytor otworów ---------- */
    const curR = () => calcGroup(S, tab);
    const itemOf = (r, i) => lastW && lastW.L.items.find(x => x.ri === r && x.ii === i);
    // utrwal położenie wszystkich otworów grupy (żeby przesuwanie jednego nie przestawiało pozostałych)
    const freeze = k => { const r = calcGroup(S, k); if (!r.on) return; layout(S, r).items.forEach(it => { const o = S.op[it.ri]; o.at = o.at || []; if (!o.at[it.ii]) o.at[it.ii] = {x: +it.x0.toFixed(3), y: +it.y0.toFixed(3)}; }); };
    // wydziel jeden otwór z wiersza „n sztuk” (zmiana rozmiaru lub rodzaju jednego otworu)
    const split = (r, i) => { const o = S.op[r]; if (Math.round(o.n) <= 1) return {r, i: 0}; freeze(o.g); const pos = o.at[i]; o.at.splice(i, 1); o.n = Math.round(o.n) - 1; S.op.splice(r + 1, 0, {...o, n: 1, at: [pos]}); return {r: r + 1, i: 0}; };
    const delInst = (r, i) => { const o = S.op[r]; if (!o) return; freeze(o.g); if (o.at) o.at.splice(i, 1); o.n = Math.round(o.n) - 1; if (o.n <= 0) S.op.splice(r, 1); sel = null; };
    const geom = () => { const r = curR(); if (!r.on) return null; const p = r.p; return {r, mod: (p.L + p.jv) / 2000, rh: (p.H + p.jh) / 1000}; };
    const snapV = (v, step) => snap === 'off' ? Math.round(v * 1000) / 1000 : Math.round(v / step) * step;
    const sx = (v, G) => snapV(v, snap === 'mod' ? G.mod : .05), sy = (v, G) => snapV(v, snap === 'mod' ? G.rh : .05);
    const svgPt = e => { const sv = $('.mu-wall-in svg'); if (!sv || !lastW) return null; const m = sv.getScreenCTM(); if (!m) return null; const pt = sv.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; const q = pt.matrixTransform(m.inverse()); return {x: lastW.vx0 + (q.x - lastW.padL) / lastW.sc, y: lastW.gh - (q.y - lastW.padT) / lastW.sc}; };
    const flBase = (it, L, gh) => it.y0 >= gh - 1e-6 && L.G.roofOn ? L.G.base : Math.min(Math.floor((it.y0 + 1e-6) / L.fh), L.fl - 1) * L.fh;
    const renderTb = cur => { const L = lastW && lastW.L, segs = L ? L.segs : [], v = views[tab], G = geom();
      $('.mu-wtb').innerHTML = `${segs.length > 1 ? `<div class="mu-segs" role="group" aria-label="Widok ściany"><button type="button" data-seg="all" class="${v == null ? 'on' : ''}">całe rozwinięcie</button>${segs.map(s => `<button type="button" data-seg="${s.i}" class="${v === s.i ? 'on' : ''}">${esc(s.nm)} <small>${fx(s.len, 1)} m</small></button>`).join('')}</div>` : ''}
        <div class="mu-snap" role="group" aria-label="Przyciąganie"><span>Przyciąganie:</span>${[['cm5', 'co 5 cm'], ['mod', G ? `do modułu elementu (${fx(G.mod * 100, 1)} cm, warstwa ${fx(G.rh * 100, 1)} cm)` : 'do modułu elementu'], ['off', 'wyłączone']].map(([k, n]) => `<button type="button" data-snap="${k}" class="${snap === k ? 'on' : ''}">${n}</button>`).join('')}<button type="button" class="mu-ra" data-act="auto">rozmieść równomiernie</button></div>`; };
    const renderSel = cur => { const it = sel && itemOf(sel.r, sel.i), box = $('.mu-sel');
      if (!it){ box.innerHTML = cur.ops.length ? '<p class="rs-wnote mu-selh">Kliknij otwór na rysunku, żeby ustawić go dokładnie: ściana, odległość od narożnika, parapet, rozmiar.</p>' : ''; return; }
      const L = lastW.L, {sg, lb, rb} = neigh(L, it, cur.g.len), base = flBase(it, L, cur.g.h), o = it.o, T = OTY[o.t] || OTY.okno, st = it.st;
      const nf = (k, l, v, a) => `<label class="mu-sf"><span>${l}</span><input type="number" inputmode="decimal" data-sel="${k}" value="${+v.toFixed(3)}" ${a || 'step="0.05" min="0"'}></label>`;
      box.innerHTML = `<div class="mu-selc${st ? ' ' + st : ''}"><div class="mu-selt"><b>${T.nm[0].toUpperCase() + T.nm.slice(1)} ${fx(it.w * 100, 0)} × ${fx(it.h * 100, 0)} cm</b>${Math.round(o.n) > 1 ? `<small>jeden z ${Math.round(o.n)} w tym wierszu – zmiana rozmiaru lub rodzaju wydzieli go do osobnego wiersza</small>` : ''}</div>
        <div class="mu-sels"><label class="mu-sf"><span>rodzaj</span><select data-sel="t">${Object.entries(OTY).map(([k, v]) => `<option value="${k}"${o.t === k ? ' selected' : ''}>${v.nm}</option>`).join('')}</select></label>
        ${L.segs.length > 1 ? `<label class="mu-sf"><span>ściana</span><select data-sel="seg">${L.segs.map(s => `<option value="${s.i}"${s === sg ? ' selected' : ''}>${esc(s.nm)}</option>`).join('')}</select></label>` : ''}
        ${nf('x', L.segs.length > 1 ? 'od narożnika [m]' : 'od początku [m]', it.x0 - sg.s)}${nf('sill', it.y0 >= cur.g.h - 1e-6 && L.G.roofOn ? 'nad stropem [m]' : 'parapet [m]', it.y0 - base)}${nf('w', 'szerokość [m]', it.w, 'step="0.05" min="0.3"')}${nf('h', 'wysokość [m]', it.h, 'step="0.05" min="0.3"')}</div>
        <div class="mu-szs"><span>gotowe rozmiary:</span>${T.sz.map(([w, h]) => `<button type="button" data-sz="${w},${h}" class="${Math.abs(w - it.w) < .005 && Math.abs(h - it.h) < .005 ? 'on' : ''}">${fx(w * 100, 0)}×${fx(h * 100, 1).replace(',0', '')}</button>`).join('')}</div>
        <p class="mu-seli">Filarek z lewej <b>${fx((it.x0 - lb) * 100, 0)} cm</b> · z prawej <b>${fx((rb - it.x1) * 100, 0)} cm</b>${S.nad.on ? ` · nadproże min. <b>${fx(it.w + 2 * S.nad.op, 2)} m</b>` : ''} · powierzchnia ${fx(it.w * it.h, 2)} m²</p>
        ${it.msg.length ? `<ul class="mu-selm">${it.msg.map(m => `<li>${esc(m)}</li>`).join('')}</ul>` : ''}
        <div class="mu-sela"><button type="button" data-act="center">wyśrodkuj na ścianie</button><button type="button" data-act="dup">powiel obok</button><button type="button" data-act="del">usuń</button><button type="button" data-act="desel">gotowe</button></div></div>`; };
    const renderBad = (cur, bad) => { $('.mu-opw').innerHTML = bad.length ? `<div class="rs-v warn"><p class="zb-p warn"><b>${bad.length} ${pl(bad.length, 'otwór wymaga', 'otwory wymagają', 'otworów wymaga')} sprawdzenia</b> – kliknij, żeby zaznaczyć na rysunku:</p><ul class="mu-badl">${bad.map(b => { const sg = lastW.L.segs.find(q => b.x0 >= q.s - 1e-6 && b.x0 < q.s + q.len) || lastW.L.segs[0]; return `<li><button type="button" data-pick="${b.ri},${b.ii}" class="${b.st}">${esc((OTY[b.t] || OTY.okno).nm)} ${fx(b.w * 100, 0)}×${fx(b.h * 100, 0)} · ${esc(sg.nm)}: ${esc(b.msg.join('; '))}</button></li>`; }).join('')}</ul></div>` : ''; };
    const drawWall = cur => { cur = cur || curR(); if (!cur.on) return; const w = svgWall(S, cur, sel, views[tab]); lastW = {...w, gh: cur.g.h};
      if (sel && !itemOf(sel.r, sel.i)) sel = null;
      $('.mu-wall-in').innerHTML = w.svg; renderTb(cur); renderSel(cur); renderBad(cur, w.bad); return w; };
    const nadList = R => { if (!S.nad.on) return '<p class="rs-wnote">Nadproża nie są odliczane – włącz „Odlicz nadproża” w punkcie 4.</p>';
      const rows = {}; R.G.filter(x => x.on).forEach(x => x.ops.forEach(o => { const l = +(o.w + 2 * S.nad.op).toFixed(3), key = x.k + '|' + l; rows[key] = rows[key] || {k: x.k, l, n: 0, w: o.w}; rows[key].n += Math.round(o.n); }));
      const list = Object.values(rows).sort((a, b) => a.k.localeCompare(b.k) || a.l - b.l); if (!list.length) return '<p class="rs-wnote">Brak otworów.</p>';
      return `<table class="mu-nadt"><thead><tr><th>ściany</th><th>otwór</th><th>nadproże min.</th><th>sztuk</th></tr></thead><tbody>${list.map(x => `<tr><td>${GR[x.k].sh}</td><td>${fx(x.w * 100, 0)} cm</td><td><b>${fx(x.l, 2)} m</b></td><td>${x.n}</td></tr>`).join('')}</tbody></table>`; };
    const run = () => {
      const R = calc(S), cur = R.G.find(x => x.k === tab), K = (l, v, u, s, st) => `<div class="rs-kpi ${st || ''}"><span class="l">${l}</span><span class="v">${v}${u ? `<small>${u}</small>` : ''}</span><span class="s">${s}</span></div>`;
      const morts = {}; R.G.filter(x => x.on && x.mort).forEach(x => { const k = x.mort.ty + '|' + x.mort.u + '|' + (x.mort.bu || ''); morts[k] = morts[k] || {ty: x.mort.ty, u: x.mort.u, q: 0, bags: 0, bu: x.mort.bu}; morts[k].q += x.mort.q || 0; morts[k].bags += x.mort.bags || 0; });
      const mtxt = Object.values(morts).map(m => `${m.bags ? fi(m.bags) + ' ' + m.bu : 'ok. ' + fx(m.q, 0) + ' ' + m.u} – ${MO[m.ty].nm}`).join('; '), trips = R.mass ? Math.max(1, Math.ceil(R.mass / 20)) : 0;
      $('.mu-kpis').innerHTML = K('Elementów razem', fi(R.pcs), 'szt.', `${fx(R.net, 1)} m² muru netto, z zapasem ${S.zap}%`, 'ok')
        + K('Palet', R.pal ? fi(R.pal) : '–', '', 'pełne palety, osobno dla każdego elementu', 'ok')
        + K('Masa', R.mass ? fx(R.mass, 1) : '–', 't', R.mass ? `ok. ${trips} ${pl(trips, 'kurs', 'kursy', 'kursów')} auta z HDS (20 t)` : 'brak danych o masie', 'ok')
        + K(R.cost != null ? 'Koszt elementów' : 'Zaprawa / klej', R.cost != null ? fi(R.cost) : '', R.cost != null ? 'zł' : '', R.cost != null ? 'według wpisanych cen' : (mtxt || '–'), 'ok');
      $('.mu-sum').innerHTML = `<div class="mu-gs">${R.G.filter(x => x.on).map(x => `<div class="mu-g${x.k === tab ? ' on' : ''}" data-tab="${x.k}"><span class="mu-gimg">${svgBlock(x.p, {W: 120, H: 84, noDim: true, pad: 8, k: 's' + x.k})}</span><div><b>${GR[x.k].nm}</b><span>${esc(x.p.nm)}</span><span class="mu-gn">${fi(x.pcs)} szt.${x.pal ? ` · ${x.pal} pal.` : ''}</span><span>${fx(x.net, 1)} m² netto · ${fx(x.m2, 2)} szt./m²${x.mort && x.mort.q != null ? ` · ${x.mort.bags ? fi(x.mort.bags) + ' ' + (x.mort.bu || 'worków') : fx(x.mort.q, 0) + ' ' + x.mort.u}` : ''}</span></div></div>`).join('')}</div>`;
      const W = []; let w = null;
      if (cur.on){ w = drawWall(cur);
        if (cur.p.T < GR[tab].min) W.push(`Element o grubości ${cur.p.T / 10} cm to typowo ścianka działowa – sprawdź, czy projekt przewiduje go w ścianach ${GR[tab].sh}.`);
        if (cur.otw > .5 * (cur.gross + (cur.kol || 0) + (cur.szc || 0))) W.push('Otwory zajmują ponad połowę ściany – sprawdź przypisanie otworów do grup ścian.');
        if (w.bad.length) W.push(`${w.bad.length} ${pl(w.bad.length, 'otwór ma', 'otwory mają', 'otworów ma')} kolizję lub zbyt mały filarek – zobacz listę pod rysunkiem w punkcie 3.`);
        if (S.zap < 3) W.push('Zapas poniżej 3% zwykle nie wystarcza na docinki, uszkodzenia w transporcie i elementy przy otworach.'); }
      $('.mu-warn').innerHTML = W.length ? `<div class="rs-v warn">${W.map(t => `<p class="zb-p warn">${t}</p>`).join('')}</div>` : '';
      if (cur.on){ $('.mu-hero').innerHTML = `<div class="mu-hg"><div>${svgBlock(cur.p, {W: 460, H: 300, k: 'h'})}</div><div>${svgM2(cur.p)}</div><div>${svgJoint(cur.p, cur.sys)}</div><dl class="mu-dl2"><dt>Element</dt><dd>${esc(cur.p.nm)}</dd><dt>Wymiary</dt><dd>${cur.p.L} × ${cur.p.T} × ${cur.p.H} mm</dd><dt>Materiał</dt><dd>${MAT[cur.p.mat].nm}</dd><dt>Spoiny</dt><dd>${cur.p.jv === 0 ? 'pionowe na pióro-wpust, bez zaprawy' : 'pionowe z zaprawą ' + cur.p.jv + ' mm'}, poziome ${cur.p.jh} mm</dd>${cur.p.pal ? `<dt>Paleta</dt><dd>${cur.p.pal} szt.${cur.p.kg ? `, ok. ${fx(cur.p.pal * cur.p.kg / 1000, 2)} t` : ''}</dd>` : ''}${cur.p.kg ? `<dt>Masa</dt><dd>${fx(cur.p.kg, 1)} kg/szt.</dd>` : ''}<dt>Spoiwo</dt><dd>${MO[cur.sys].nm}${cur.mort && cur.mort.q != null ? `, ok. ${fx(cur.mort.q, 0)} ${cur.mort.u}${cur.mort.bags ? ' = ' + fi(cur.mort.bags) + ' ' + cur.mort.bu : ''} <small>(${cur.mort.src === 'geo' ? 'szacunek z grubości spoin' : 'zużycie wg producenta'})</small>` : ''}</dd></dl></div><p class="mu-why"><b>${MO[cur.sys].nm[0].toUpperCase() + MO[cur.sys].nm.slice(1)}:</b> ${MO[cur.sys].why}</p>`;
        $('.mu-area').innerHTML = svgArea(cur); $('.mu-cmp').innerHTML = svgCmp(S, tab); }
      else { lastW = null; ['.mu-hero', '.mu-wall-in', '.mu-area', '.mu-cmp'].forEach(q => { $(q).innerHTML = `<p class="rs-wnote">Grupa „${GR[tab].nm}” jest wyłączona.</p>`; }); ['.mu-wtb', '.mu-sel', '.mu-opw'].forEach(q => { $(q).innerHTML = ''; }); }
      $('.mu-nadl').innerHTML = nadList(R);
      $('.mu-pal').innerHTML = svgPallets(R);
      $$('.mu-case').forEach(b => b.classList.remove('on'));
      const zl = $('.mu-tabs [data-tab="z"] small'); if (zl) zl.textContent = S.g.z.on ? `${fx(S.g.z.len, 1)} m · ${prodBy(S.g.z.prod).nm}` : 'wyłączone';
      if (tab === 'z' && S.dach.auto){ const li = $('input[type="number"][data-f="len"]'); if (li) li.value = S.g.z.len; }
    };
    const full = () => { renderGroup(); renderDach(); renderOps(); renderOdl(); run(); };
    let raf = 0; const soon = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(run); };
    let rafW = 0; const soonWall = () => { cancelAnimationFrame(rafW); rafW = requestAnimationFrame(() => drawWall()); };
    const focusSel = () => { if (!sel) return; const g = $(`.mu-op[data-r="${sel.r}"][data-i="${sel.i}"]`); if (g) g.focus({preventScroll: true}); };
    const selRow = () => { $$('.mu-opr').forEach(r => r.classList.toggle('on', !!sel && +r.dataset.oi === sel.r)); };
    el.addEventListener('input', e => { const t = e.target;
      if (t.dataset.sel) return;
      if (t.dataset.f && t.dataset.f.startsWith('d.')){ const k = t.dataset.f.slice(2), v = num(t.value); S.dach[k] = v; $$(`[data-f="d.${k}"]`).forEach(i => { if (i !== t) i.value = v; }); soon(); clearTimeout(t._rd); t._rd = setTimeout(() => { const n = $('.mu-dach .mu-auto'); if (n){ const RG = roofGeom(S.dach); n.lastChild.textContent = ` długość ścian zewnętrznych = obwód rzutu (${fx(RG.perim, 2)} m)`; } }, 120); return; }
      if (t.dataset.f){ const k = t.dataset.f, g = S.g[tab];
        if (k === 'on'){ g.on = t.checked ? 1 : 0; renderGroup(); run(); return; }
        if (k === 'meas'){ g.meas = t.value; if (g.meas === 'zew' && !(g.cor > 0)) g.cor = 4; renderGroup(); run(); return; }
        if (k === 'price'){ S.price[g.prod] = num(t.value); soon(); return; }
        const v = num(t.value);
        if (k.includes('.')){ const [a, b] = k.split('.'); S[a][b] = v; } else if (k === 'zap') S.zap = v; else g[k] = v;
        $$(`[data-f="${k}"]`).forEach(i => { if (i !== t) i.value = v; });
        if (['len', 'h'].includes(k)) $(`.mu-tabs [data-tab="${tab}"] small`).textContent = `${fx(g.len, 1)} m · ${prodBy(g.prod).nm}`;
        soon(); return; }
      if (t.dataset.dd){ const k = t.dataset.dd; S.dach[k] = k === 'auto' ? (t.checked ? 1 : 0) : t.value; renderDach(); run(); renderGroup(); return; }
      if (t.dataset.s){ const [a, b] = t.dataset.s.split('.'); S[a][b] = t.checked ? 1 : 0; renderOdl(); run(); return; }
      if (t.dataset.o){ const i = +t.closest('[data-oi]').dataset.oi, o = S.op[i], k = t.dataset.o;
        if (k === 't' || k === 'g'){ if (k === 'g' && o.g !== t.value) delete o.at; o[k] = t.value; if (k === 'g') renderOps(); }
        else if (k === 'sill'){ const old = sillOf(o); o.sill = t.value === '' ? null : num(t.value); const d = sillOf(o) - old; if (o.at) o.at.forEach(a => { if (a) a.y = Math.max(0, a.y + d); }); }
        else { o[k] = num(t.value); if (k === 'n' && o.at) o.at.length = Math.min(o.at.length, Math.max(0, Math.round(o.n))); }
        soon(); }
    });
    // pola zaznaczonego otworu – zatwierdzane po zmianie (Enter, wyjście z pola, strzałki pola)
    el.addEventListener('change', e => { const t = e.target;
      if (t.dataset.o === 'g' || t.dataset.o === 't') run();
      if (!t.dataset.sel || !sel) return; const k = t.dataset.sel, cur = curR(); if (!cur.on || !lastW) return;
      if (['w', 'h', 't'].includes(k)) sel = split(sel.r, sel.i);
      freeze(tab); const o = S.op[sel.r], it = itemOf(sel.r, sel.i) || {x0: o.at[sel.i].x, y0: o.at[sel.i].y, w: o.w}, a = o.at[sel.i], L = lastW.L, v = num(t.value);
      const sg = L.segs.find(q => it.x0 >= q.s - 1e-6 && it.x0 < q.s + q.len) || L.segs[0];
      if (k === 't') o.t = t.value;
      else if (k === 'w') o.w = Math.max(.3, v); else if (k === 'h') o.h = Math.max(.3, v);
      else if (k === 'x') a.x = sg.s + Math.max(0, v);
      else if (k === 'sill') a.y = (itemOf(sel.r, sel.i) ? flBase(itemOf(sel.r, sel.i), L, cur.g.h) : 0) + Math.max(0, v);
      else if (k === 'seg'){ const ns = L.segs[+t.value]; if (ns) a.x = ns.s + Math.max(L.m, Math.min(it.x0 - sg.s, ns.len - o.w - L.m)); if (views[tab] != null) views[tab] = +t.value; }
      renderOps(); run(); focusSel(); });
    // przeciąganie otworów i uchwytów na rysunku ściany
    const box = $('.mu-wallw');
    box.addEventListener('pointerdown', e => {
      if (e.button > 0) return; const hd = e.target.closest('.mu-hd'), og = e.target.closest('.mu-op');
      if (!og){ if (sel && !e.target.closest('.mu-segl')){ sel = null; drawWall(); selRow(); } return; }
      const G = geom(); if (!G) return; let r = +og.dataset.r, i = +og.dataset.i;
      if (hd && Math.round(S.op[r].n) > 1){ ({r, i} = split(r, i)); renderOps(); }
      freeze(tab); sel = {r, i}; const P = svgPt(e), o = S.op[r], a = o.at[i]; if (!P || !a) return;
      drag = {r, i, mode: hd ? hd.dataset.hd : 'move', P0: P, x0: a.x, y0: a.y, w: o.w, h: o.h, moved: false, id: e.pointerId, G};
      try { box.setPointerCapture(e.pointerId); } catch (_) {}
      e.preventDefault(); drawWall(); selRow(); });
    box.addEventListener('pointermove', e => { if (!drag || e.pointerId !== drag.id) return; const P = svgPt(e); if (!P) return;
      const dx = P.x - drag.P0.x, dy = P.y - drag.P0.y; if (!drag.moved && Math.hypot(dx, dy) * (lastW ? lastW.sc : 50) < 4) return; drag.moved = true; box.classList.add('dragging');
      const o = S.op[drag.r], G = drag.G;
      if (drag.mode === 'move') o.at[drag.i] = {x: sx(drag.x0 + dx, G), y: Math.max(0, sy(drag.y0 + dy, G))};
      else if (drag.mode === 'w') o.w = Math.max(.3, sx(drag.w + dx, G));
      else o.h = Math.max(.3, sy(drag.h + dy, G));
      soonWall(); });
    const endDrag = e => { if (!drag || (e && e.pointerId !== drag.id)) return; const moved = drag.moved; drag = null; box.classList.remove('dragging'); try { box.releasePointerCapture(e.pointerId); } catch (_) {}
      if (moved){ renderOps(); run(); } focusSel(); };
    box.addEventListener('pointerup', endDrag); box.addEventListener('pointercancel', endDrag);
    box.addEventListener('dblclick', e => { if (e.target.closest('.mu-op')) return; const cur = curR(), G = geom(); if (!cur.on || !G) return; const P = svgPt(e); if (!P || P.x < 0 || P.x > cur.g.len || P.y < 0 || P.y > lastW.L.G.ymax) return;
      freeze(tab); const [w, h] = [1.2, 1.5]; S.op.push({t: 'okno', w, h, n: 1, g: tab, at: [{x: sx(Math.max(0, P.x - w / 2), G), y: Math.max(0, sy(P.y - h / 2, G))}]}); sel = {r: S.op.length - 1, i: 0}; renderOps(); run(); focusSel(); });
    box.addEventListener('keydown', e => { const og = e.target.closest('.mu-op'); if (!og) return; const r = +og.dataset.r, i = +og.dataset.i, G = geom(); if (!G) return;
      const mv = {ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1]}[e.key];
      if (mv){ e.preventDefault(); freeze(tab); sel = {r, i}; const a = S.op[r].at[i], st = e.shiftKey ? .5 : snap === 'mod' ? (mv[0] ? G.mod : G.rh) : .05; a.x = Math.max(0, +(a.x + mv[0] * st).toFixed(3)); a.y = Math.max(0, +(a.y + mv[1] * st).toFixed(3)); run(); selRow(); focusSel(); return; }
      if (e.key === 'Delete' || e.key === 'Backspace'){ e.preventDefault(); delInst(r, i); renderOps(); run(); return; }
      if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); sel = {r, i}; drawWall(); selRow(); focusSel(); return; }
      if (e.key === 'Escape'){ sel = null; drawWall(); selRow(); } });
    el.addEventListener('click', e => {
      if (e.target.closest('.mu-op')) return;
      const pre = e.target.closest('[data-pre]'); if (pre){ const P = clone(PRE[pre.dataset.pre]); delete P.t; delete P.d; const price = S.price; S = {...P, price}; tab = Object.keys(GR).find(k => S.g[k].on) || 'z'; sel = null; views.z = views.w = views.d = null; full(); pre.classList.add('on'); return; }
      const sg = e.target.closest('[data-seg]'); if (sg){ views[tab] = sg.dataset.seg === 'all' ? null : +sg.dataset.seg; drawWall(); return; }
      const sn = e.target.closest('[data-snap]'); if (sn){ snap = sn.dataset.snap; drawWall(); return; }
      const pk = e.target.closest('[data-pick]'); if (pk){ const [r, i] = pk.dataset.pick.split(',').map(Number); sel = {r, i}; const it = itemOf(r, i);
        if (it && views[tab] != null){ const s2 = lastW.L.segs.find(q => it.x0 >= q.s - 1e-6 && it.x0 < q.s + q.len); views[tab] = s2 ? s2.i : null; }
        drawWall(); selRow(); const g = $(`.mu-op[data-r="${r}"][data-i="${i}"]`); if (g){ g.focus({preventScroll: true}); const bb = g.getBoundingClientRect(), wb = box.getBoundingClientRect(); box.scrollLeft += bb.left - wb.left - wb.width / 2 + bb.width / 2; $('.mu-wallw').scrollIntoView({block: 'nearest', behavior: 'smooth'}); } return; }
      const sz = e.target.closest('[data-sz]'); if (sz && sel){ ({r: sel.r, i: sel.i} = split(sel.r, sel.i)); const [w, h] = sz.dataset.sz.split(',').map(Number); S.op[sel.r].w = w; S.op[sel.r].h = h; renderOps(); run(); focusSel(); return; }
      const ac = e.target.closest('[data-act]'); if (ac){ const a = ac.dataset.act;
        if (a === 'auto'){ S.op.forEach(o => { if (o.g === tab) delete o.at; }); sel = null; renderOps(); run(); return; }
        if (a === 'desel'){ sel = null; drawWall(); selRow(); return; }
        if (!sel) return; const it = itemOf(sel.r, sel.i); if (!it) return; freeze(tab); const L = lastW.L, o = S.op[sel.r], at = o.at[sel.i];
        if (a === 'center'){ const {sg} = neigh(L, it, curR().g.len); at.x = +(sg.s + (sg.len - it.w) / 2).toFixed(3); }
        if (a === 'del'){ delInst(sel.r, sel.i); }
        if (a === 'dup'){ const gap = Math.max(.6, S.nad.on ? 2 * S.nad.op + .1 : .6); S.op.splice(sel.r + 1, 0, {t: o.t, w: it.w, h: it.h, n: 1, g: o.g, sill: o.sill, at: [{x: +(it.x1 + gap).toFixed(3), y: it.y0}]}); sel = {r: sel.r + 1, i: 0}; }
        renderOps(); run(); focusSel(); return; }
      const tb = e.target.closest('[data-tab]'); if (tb){ tab = tb.dataset.tab; sel = null; renderGroup(); renderOps(); run(); return; }
      const rf = e.target.closest('[data-roof]'); if (rf){ S.dach.t = rf.dataset.roof; renderDach(); run(); renderGroup(); return; }
      const pr = e.target.closest('[data-prod]'); if (pr){ S.g[tab].prod = pr.dataset.prod; if (!S.g[tab].on) S.g[tab].on = 1; renderGroup(); run(); return; }
      const mo = e.target.closest('[data-mo]'); if (mo){ S.g[tab].mo = mo.dataset.mo; renderGroup(); run(); return; }
      const fl = e.target.closest('[data-flt]'); if (fl){ flt = fl.dataset.flt; renderGroup(); return; }
      const ad = e.target.closest('[data-add]'); if (ad){ const t = ad.dataset.add, d = (OTY[t].sz.find(q => t === 'okno' ? q[0] === 1.5 : t === 'drzwi' ? q[0] === 1.0 : true) || OTY[t].sz[0]);
        const g = t === 'drzwi' && tab !== 'z' ? tab : ['okno', 'balk', 'brama'].includes(t) ? 'z' : tab;
        if (S.op.some(o => o.g === g && o.at)) freeze(g);
        S.op.push({t, w: d[0], h: d[1], n: 1, g}); if (g !== tab){ tab = g; renderGroup(); }
        sel = {r: S.op.length - 1, i: 0}; renderOps(); run(); focusSel(); return; }
      const dl = e.target.closest('[data-del]'); if (dl){ S.op.splice(+dl.dataset.del, 1); sel = null; renderOps(); run(); return; }
      const row = e.target.closest('.mu-opr'); if (row && !e.target.closest('input,select,button')){ const r = +row.dataset.oi; if (S.op[r] && S.op[r].g === tab){ sel = {r, i: 0}; drawWall(); selRow(); } }
    });
    full();
  }
