const MUR = (() => {
  const fx = (x, d = 1) => PX.fx(x, d), fi = n => Math.round(n).toLocaleString('pl-PL');
  /* ---------- ilustracje: bloczek w aksonometrii ---------- */
  const MAT = {
    bk:   {nm: 'beton komórkowy', top: '#F3F1EC', front: '#E6E2DA', end: '#D6D1C7', edge: '#8C857A', tex: 'pores', dot: 'rgba(120,112,100,.28)'},
    sil:  {nm: 'silikat', top: '#EEEDE8', front: '#E1DFD8', end: '#CFCCC3', edge: '#86837B', tex: 'fine', dot: 'rgba(110,108,100,.18)'},
    cer:  {nm: 'ceramika poryzowana', top: '#D9774B', front: '#C4633A', end: '#A9522F', edge: '#6E3219', tex: 'ribs', dot: 'rgba(90,35,15,.35)'},
    ker:  {nm: 'keramzytobeton', top: '#A3A5A3', front: '#8F9290', end: '#7C7F7D', edge: '#4E5150', tex: 'grain', dot: 'rgba(40,42,42,.38)'},
    bet:  {nm: 'beton zwykły', top: '#B8BBBC', front: '#A5A8AA', end: '#909396', edge: '#55595C', tex: 'speck', dot: 'rgba(50,52,55,.3)'},
  };
  const rnd = s => () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  function svgBlock(p, o = {}){
    const M = MAT[p.mat] || MAT.bk, W = o.W || 420, Hh = o.H || 300, c = Math.cos(Math.PI / 6), sn = .5;
    const L = p.L, T = p.T, H = p.H, pw = p.jv === 0, hole = p.holes || 'none';
    const tooth = pw ? Math.min(18, T / 10) : 0, teeth = !pw ? [] : p.mat === 'cer' ? Math.max(3, Math.round(T / 45)) : 1;
    // profil czoła x = L + off(y): pióro (BK, silikat – jedno, ceramika – wiele żeber)
    const prof = [];
    if (!pw) prof.push([0, 0], [T, 0]);
    else if (teeth === 1){ const a = T * .32, b = T * .68; prof.push([0, 0], [a, 0], [a + 6, tooth], [b - 6, tooth], [b, 0], [T, 0]); }
    else { const n = teeth * 2 + 1, st = T / n; for (let i = 0; i < n; i++){ const off = i % 2 ? tooth : 0; prof.push([i * st, off], [(i + 1) * st, off]); } }
    const P = (x, y, z) => [(x - y) * c, (x + y) * sn - z];
    const pts = [P(0, 0, 0), P(L + tooth, 0, 0), P(L + tooth, T, 0), P(0, T, 0), P(0, 0, H), P(L + tooth, T, H), P(0, T, H), P(L + tooth, 0, H)];
    const minx = Math.min(...pts.map(q => q[0])), maxx = Math.max(...pts.map(q => q[0])), miny = Math.min(...pts.map(q => q[1])), maxy = Math.max(...pts.map(q => q[1]));
    const pad = o.pad ?? 54, sc = Math.min((W - 2 * pad) / (maxx - minx), (Hh - 2 * pad) / (maxy - miny));
    const ox = (W - (maxx - minx) * sc) / 2 - minx * sc, oy = (Hh - (maxy - miny) * sc) / 2 - miny * sc;
    const T2 = (x, y, z) => { const q = P(x, y, z); return [ox + q[0] * sc, oy + q[1] * sc]; };
    const path = arr => 'M' + arr.map(q => q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join('L') + 'Z';
    const id = 'b' + Math.round(L) + Math.round(T) + Math.round(H) + p.mat + (o.k || '');
    let s = `<svg viewBox="0 0 ${W} ${Hh}" class="mu-blk" role="img" aria-label="Element murowy ${M.nm} ${L}×${T}×${H} mm"><defs>
      <linearGradient id="${id}f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${M.front}"/><stop offset="1" stop-color="${M.end}" stop-opacity=".9"/></linearGradient>
      <radialGradient id="${id}s" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".18"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>`;
    // cień
    const sh = [T2(0, 0, 0), T2(L, 0, 0), T2(L, T, 0), T2(0, T, 0)], scx = (sh[0][0] + sh[2][0]) / 2, scy = (sh[1][1] + sh[3][1]) / 2 + 10;
    s += `<ellipse cx="${scx}" cy="${scy}" rx="${(maxx - minx) * sc * .55}" ry="${(maxy - miny) * sc * .18}" fill="url(#${id}s)"/>`;
    // czoło (x = L + off): pasy profilu od tyłu (y=0) do przodu
    for (let i = 0; i < prof.length - 1; i++){ const [y0, o0] = prof[i], [y1, o1] = prof[i + 1];
      if (Math.abs(y1 - y0) < 1e-6 && o0 !== o1){ if (o1 < o0) s += `<path d="${path([T2(L + o0, y0, 0), T2(L + o1, y1, 0), T2(L + o1, y1, H), T2(L + o0, y0, H)])}" fill="${M.front}" stroke="${M.edge}" stroke-width=".8"/>`; continue; }
      if (o1 !== o0){ s += `<path d="${path([T2(L + o0, y0, 0), T2(L + o1, y1, 0), T2(L + o1, y1, H), T2(L + o0, y0, H)])}" fill="${M.end}" stroke="${M.edge}" stroke-width=".8"/>`; continue; }
      s += `<path d="${path([T2(L + o0, y0, 0), T2(L + o1, y1, 0), T2(L + o1, y1, H), T2(L + o0, y0, H)])}" fill="${o0 ? M.end : shade(M.end, .9)}" stroke="${M.edge}" stroke-width=".8"/>`; }
    // uchwyty montażowe na czole (BK, silikat)
    if ((p.mat === 'bk' || p.mat === 'sil') && H > 150 && L > 300){ const gy0 = T * .36, gy1 = T * .64, gz0 = H * .52, gz1 = H * .8, ox2 = L + tooth + .5;
      s += `<path d="${path([T2(ox2, gy0, gz0), T2(ox2, gy1, gz0), T2(ox2, gy1, gz1), T2(ox2, gy0, gz1)])}" fill="${shade(M.end, .78)}" stroke="${M.edge}" stroke-width=".7"/>`; }
    // lico (y = T)
    const fr = [T2(0, T, 0), T2(L + prof[prof.length - 1][1], T, 0), T2(L + prof[prof.length - 1][1], T, H), T2(0, T, H)];
    s += `<path d="${path(fr)}" fill="url(#${id}f)" stroke="${M.edge}" stroke-width="1.2"/>`;
    // góra (z = H): obrys z profilem czoła
    const top = [T2(0, 0, H), ...prof.map(([y, of]) => T2(L + of, y, H)), T2(0, T, H)];
    s += `<path d="${path(top)}" fill="${M.top}" stroke="${M.edge}" stroke-width="1.2" stroke-linejoin="round"/>`;
    // tekstury
    const r = rnd(L * 7 + T * 3 + H), dots = (fn, n, rr) => { let t = ''; for (let i = 0; i < n; i++){ const q = fn(r(), r()); t += `<circle cx="${q[0].toFixed(1)}" cy="${q[1].toFixed(1)}" r="${(rr * (.4 + r() * .8)).toFixed(2)}"/>`; } return t; };
    const dens = M.tex === 'pores' ? 1 : M.tex === 'grain' ? 1.6 : M.tex === 'speck' ? .9 : M.tex === 'fine' ? .4 : 0;
    if (dens){ const nf = Math.round(dens * 260), nt = Math.round(dens * 160), rr = M.tex === 'grain' ? 1.5 : 1.1;
      s += `<g fill="${M.dot}">${dots((u, v) => T2(u * L, T, v * H), nf, rr)}${dots((u, v) => T2(u * L, v * T, H), nt, rr)}</g>`; }
    if (M.tex === 'ribs'){ const n = Math.max(6, Math.round(H / 12)); for (let i = 1; i < n; i++){ const z = H * i / n, a = T2(0, T, z), b = T2(L, T, z); s += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${M.edge}" stroke-opacity=".28" stroke-width="1"/>`; } }
    // otwory na górze
    const hp = (x0, x1, y0, y1) => `<path d="${path([T2(x0, y0, H), T2(x1, y0, H), T2(x1, y1, H), T2(x0, y1, H)])}" fill="${shade(M.end, .55)}" stroke="${M.edge}" stroke-width=".6"/>`;
    if (hole === 'grid'){ const nx = Math.max(4, Math.round(L / 34)), ny = Math.max(3, Math.round(T / 34)), mx = L * .05, my = T * .07, gx = (L - 2 * mx) / nx, gy = (T - 2 * my) / ny;
      for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++){ const x0 = mx + i * gx + gx * .14, y0 = my + j * gy + gy * .22; s += hp(x0, x0 + gx * .72, y0, y0 + gy * .56); } }
    else if (hole === 'cham'){ const n = 3, mx = L * .08, gx = (L - 2 * mx) / n; for (let i = 0; i < n; i++){ const x0 = mx + i * gx + gx * .1; s += hp(x0, x0 + gx * .8, T * .2, T * .8); } }
    else if (hole === 'round'){ const n = Math.max(2, Math.round(L / 110)); for (let i = 0; i < n; i++){ const cx = L * (i + .5) / n; s += hp(cx - L * .06, cx + L * .06, T * .3, T * .7); } }
    // wymiary
    if (!o.noDim){ const dl = (a, b, t, off, anchor) => { const m = [(a[0] + b[0]) / 2 + off[0], (a[1] + b[1]) / 2 + off[1]];
        return `<line x1="${a[0] + off[0] * .45}" y1="${a[1] + off[1] * .45}" x2="${b[0] + off[0] * .45}" y2="${b[1] + off[1] * .45}" class="mu-dl"/><text x="${m[0]}" y="${m[1]}" text-anchor="${anchor}" class="mu-dt">${t}</text>`; };
      s += dl(T2(0, T, 0), T2(L, T, 0), `${L} mm`, [-14, 26], 'middle');
      s += dl(T2(L + tooth, 0, 0), T2(L + tooth, T, 0), `${T} mm`, [22, 22], 'start');
      s += dl(T2(0, T, 0), T2(0, T, H), `${H} mm`, [-22, 0], 'end'); }
    return s + '</svg>';
  }
  function shade(hex, f){ const n = [1, 3, 5].map(i => Math.max(0, Math.min(255, Math.round(parseInt(hex.slice(i, i + 2), 16) * f)))); return '#' + n.map(v => v.toString(16).padStart(2, '0')).join(''); }

  // baza produktów: id, mat, producent, nazwa, L (długość lica), T (grubość ściany), H, jh (spoina pozioma), jv (pionowa; 0 = pióro-wpust), m2 (szt./m² wg producenta), pal (szt./paleta), kg (masa szt.), zap: [rodzaj, zużycie, jednostka], holes
  // dane z kart technicznych i cenników producentów (październik 2026); kg – masa szt. (z masy palety minus ok. 25 kg palety, gdy producent podaje tylko paletę)
  const PROD = [
    {id: 'yt24', mat: 'bk', br: 'Ytong', nm: 'Ytong Enduro PP4/0,6 S+GT 24 cm', L: 599, T: 240, H: 199, jh: 2, jv: 0, m2: 8.33, pal: 48, kg: 22.5, sys: ['cienka'], cons: {cienka: [3.2, 'kg/m2']}, holes: 'none'},
    {id: 'hh24', mat: 'bk', br: 'H+H', nm: 'H+H Gold 2,5-500 PWU 24', L: 590, T: 240, H: 240, jh: 2, jv: 0, m2: 7.06, pal: 48, kg: 18.7, sys: ['cienka'], cons: {cienka: [2.4, 'kg/m2']}, holes: 'none'},
    {id: 'sol24', mat: 'bk', br: 'Solbet', nm: 'Solbet Optimal Plus 600 24 P+W+U', L: 590, T: 240, H: 240, jh: 2, jv: 0, m2: 7.06, pal: 48, kg: 24.4, sys: ['cienka'], cons: {cienka: [3.0, 'kg/m2']}, holes: 'none'},
    {id: 'yt12', mat: 'bk', br: 'Ytong', nm: 'Ytong Enduro PP4/0,6 S 11,5 cm', L: 599, T: 115, H: 199, jh: 2, jv: 0, m2: 8.33, pal: 104, kg: 10.8, sys: ['cienka'], cons: {cienka: [1.5, 'kg/m2']}, holes: 'none'},
    {id: 'hh115', mat: 'bk', br: 'H+H', nm: 'H+H Gold+ 4,0-500 11,5', L: 625, T: 115, H: 250, jh: 2, jv: 0, m2: 6.4, pal: 78, kg: 9, sys: ['cienka'], cons: {cienka: [1.2, 'kg/m2']}, holes: 'none'},
    {id: 'sil24', mat: 'sil', br: 'Silka', nm: 'Silka E24 kl. 15 (drążona)', L: 333, T: 240, H: 199, jh: 2, jv: 0, m2: 15, pal: 45, kg: 24, sys: ['cienka'], cons: {cienka: [3.6, 'kg/m2']}, holes: 'round'},
    {id: 'sil18', mat: 'sil', br: 'Silka', nm: 'Silka E18 kl. 15 (drążona)', L: 333, T: 180, H: 199, jh: 2, jv: 0, m2: 15, pal: 60, kg: 17.1, sys: ['cienka'], cons: {cienka: [2.7, 'kg/m2']}, holes: 'round'},
    {id: 'hhs18', mat: 'sil', br: 'H+H', nm: 'H+H Silikat N18 15-1600', L: 250, T: 180, H: 220, jh: 2, jv: 0, m2: 18, pal: 80, kg: 14.5, sys: ['cienka', 'trad'], cons: {cienka: [1.8, 'kg/m2']}, alt: {trad: {jh: 10, jv: 0, m2: 17.4}}, holes: 'round'},
    {id: 'sil12', mat: 'sil', br: 'Silka', nm: 'Silka E12', L: 333, T: 120, H: 199, jh: 2, jv: 0, m2: 15, pal: 90, kg: 11.5, sys: ['cienka'], cons: {cienka: [1.8, 'kg/m2']}, holes: 'round'},
    {id: 'sil8', mat: 'sil', br: 'Silka', nm: 'Silka E8', L: 333, T: 80, H: 199, jh: 2, jv: 0, m2: 15, pal: 135, kg: 7.5, sys: ['cienka'], cons: {cienka: [1.2, 'kg/m2']}, holes: 'round'},
    {id: 'pt25', mat: 'cer', br: 'Porotherm', nm: 'Porotherm 25 P+W', L: 373, T: 250, H: 238, jh: 12, jv: 0, m2: 10.7, pal: 72, kg: 18, sys: ['trad', 'cieplo'], cons: {trad: [16, 'l/m2'], cieplo: [16, 'l/m2']}, holes: 'grid'},
    {id: 'pt30', mat: 'cer', br: 'Porotherm', nm: 'Porotherm 30 P+W', L: 248, T: 300, H: 238, jh: 12, jv: 0, m2: 16, pal: 80, kg: 14, sys: ['trad', 'cieplo'], cons: {trad: [20, 'l/m2'], cieplo: [20, 'l/m2']}, holes: 'grid'},
    {id: 'pt38d', mat: 'cer', br: 'Porotherm', nm: 'Porotherm 38 Dryfix', L: 248, T: 380, H: 249, jh: 1, jv: 0, m2: 16, pal: 60, kg: 17, sys: ['pianka'], cons: {pianka: [6, 'm2/puszka']}, holes: 'grid'},
    {id: 'lei25', mat: 'cer', br: 'Leier', nm: 'Leier Thermopor 25 P+W', L: 375, T: 250, H: 238, jh: 12, jv: 0, m2: 10.7, pal: 72, kg: 17, sys: ['trad', 'cieplo'], cons: {}, holes: 'grid'},
    {id: 'lei25p', mat: 'cer', br: 'Leier', nm: 'Leier Thermopor Plan 25 P+W (szlifowany)', L: 375, T: 250, H: 249, jh: 1, jv: 0, m2: 10.7, pal: 72, kg: 16.6, sys: ['cienka'], cons: {}, holes: 'grid'},
    {id: 'pt115', mat: 'cer', br: 'Porotherm', nm: 'Porotherm 11,5 P+W', L: 498, T: 115, H: 238, jh: 12, jv: 0, m2: 8, pal: 100, kg: 11, sys: ['trad'], cons: {trad: [7, 'l/m2']}, holes: 'grid'},
    {id: 'pt8', mat: 'cer', br: 'Porotherm', nm: 'Porotherm 8 P+W', L: 498, T: 80, H: 238, jh: 12, jv: 0, m2: 8, pal: 120, kg: 9, sys: ['trad'], cons: {trad: [5, 'l/m2']}, holes: 'grid'},
    {id: 'ker24', mat: 'ker', br: 'Leca', nm: 'Leca BLOK fundamentowy 5 (ściana 24)', L: 380, T: 240, H: 240, jh: 10, jv: 10, m2: 11, pal: 50, kg: 19.6, sys: ['trad', 'cem'], cons: {}, holes: 'cham'},
    {id: 'bet24', mat: 'bet', br: '', nm: 'Bloczek betonowy 38×24×12 B15', L: 380, T: 240, H: 120, jh: 10, jv: 10, m2: null, pal: 60, kg: 25, sys: ['cem', 'trad'], cons: {}, holes: 'none'},
  ];
  const SRC = [['Ytong PP4/0,6', 'https://xella.bimproduction.eu/uploads/model/attachments/9/Ytong_PP4_0_6_15_30_cm.pdf'], ['H+H katalog techniczny', 'https://edge.sitecorecloud.io/hnhinternational-2bb7370b/media/sites/hplushpl/do-pobrania-pdf/02-dopobrania-katalogi/hh_katalog-_techniczny.pdf'], ['H+H cennik 16.02.2026', 'https://edge.sitecorecloud.io/hnhinternational-2bb7370b/media/sites/hplushpl/do-pobrania-pdf/cennik-hhpl_abk_20260216.pdf'], ['Solbet Optimal Plus 600', 'https://realbud.com/pl/p/Beton-komorkowy-24-cm-SOLBET-590x240x240-P-W-odm.-600%2C-Optimal-Plus/9518'], ['Silka E (karta systemowa)', 'https://xella.bimproduction.eu/uploads/model/attachments/24/Silka_E.pdf'], ['Porotherm 25 P+W – karta techniczna', 'https://www.woymar.pl/files/ml/files/331202plpl_mkt_tec_por_porotherm_25_pplusw_karta_techniczna_porotherm.pdf'], ['Porotherm 38 Dryfix – karta techniczna', 'https://www.wienerberger.pl/content/dam/wienerberger/poland/marketing/documents-magazines/technical/technical-product-info-sheet/wall/PL_MKT_TEC_POR_Porotherm_38_Dryfix_karta_techniczna_porotherm.pdf'], ['Silka E-S', 'https://storefrontapi.commerce.xella.com/medias/sys_master/root/h14/h11/8835735617566/Silka_E_S/Silka-E-S.pdf'], ['Silka E ściany działowe', 'https://storefrontapi.commerce.xella.com/medias/sys_master/root/h31/h0c/8850681561118/Silka_E_sciana_dzialowa/Silka-E-sciana-dzialowa.pdf'], ['H+H Silikat N18', 'https://edge.sitecorecloud.io/hnhinternational-2bb7370b/media/sites/hplushpl/do-pobrania-pdf/produkty-pdf/silikaty-/karta-techniczna--hh-silikat-n18-15-1600.pdf'], ['Wienerberger cennik produktów', 'https://www.wienerberger.pl/content/dam/wienerberger/poland/marketing/documents-magazines/business-documents/Cennik-produktow-Wienerberger.pdf'], ['Leier Thermopor Plan 25', 'https://www.leier.pl/product/thermopor-plan-25-pw/'], ['Leca BLOK fundamentowy', 'https://betomex.koszalin.pl/wp-content/uploads/2025/06/karta_techniczna_Leca_BLOK_fudamentowy_5.pdf'], ['weber ZM5 (wydajność zaprawy)', 'https://www.pl.weber/files/pl/2025-06/printable_sheet_weber_ZM5.pdf']];

  const GR = {z: {nm: 'Ściany zewnętrzne', sh: 'zewnętrzne', min: 180}, w: {nm: 'Ściany wewnętrzne nośne', sh: 'wewnętrzne nośne', min: 150}, d: {nm: 'Ścianki działowe', sh: 'działowe', min: 0}};
  // sz – typowe wymiary otworu w murze [szer., wys.] w m (gotowe rozmiary w edytorze; zawsze sprawdź w projekcie i u producenta stolarki)
  // otwór w murze jest większy od stolarki (okna ok. 3–6 cm szersze i 6–9 cm wyższe); drzwi wewnętrzne – otwór od wykończonej posadzki
  const OTY = {okno: {nm: 'okno', sill: .85, sz: [[.6, .6, 'małe okno'], [.9, 1.2, 'okno 865×1135'], [1.2, 1.5, 'okno 1165×1435'], [1.5, 1.5, 'okno 1465×1435'], [1.8, 1.5, 'okno 1765×1435'], [2.4, 1.5, 'okno trójdzielne']]},
    balk: {nm: 'drzwi balkonowe', sill: 0, sz: [[.9, 2.15, 'jednoskrzydłowe'], [1.5, 2.15, 'dwuskrzydłowe'], [1.8, 2.3, 'dwuskrzydłowe szerokie'], [2.4, 2.3, 'przesuwne'], [3.0, 2.4, 'przesuwne HST']]},
    drzwi: {nm: 'drzwi', sill: 0, sz: [[.8, 2.07, 'pod drzwi wewnętrzne 70'], [.9, 2.07, 'pod drzwi wewnętrzne 80'], [1.0, 2.07, 'pod drzwi wewnętrzne 90'], [1.03, 2.13, 'pod drzwi zewnętrzne 90']]},
    brama: {nm: 'brama garażowa', sill: 0, sz: [[2.5, 2.125, 'brama segmentowa'], [3.0, 2.125, 'brama segmentowa'], [5.0, 2.125, 'brama dwustanowiskowa']]}};
  const MUV = 2; // wersja kalkulatora (2 – ręczne ustawianie otworów)
  // nadproża: wysokość [m] i minimalne oparcie z każdej strony [m] w zależności od szerokości otworu w [m] (karty producentów)
  const NAD = {
    auto: {nm: 'według materiału ścian zewnętrznych'},
    pt238: {nm: 'ceramiczne Porotherm 23,8', h: .238, op: w => w <= 1.5 ? .125 : w <= 1.85 ? .2 : .25, d: 'oparcie 12,5 cm do 1,5 m, 20 cm do 1,85 m, 25 cm powyżej'},
    pt115: {nm: 'ceramiczne Porotherm 11,5 (ścianki działowe)', h: .071, op: () => .125, d: 'oparcie 12,5 cm, nad belką nadmurowanie'},
    l19: {nm: 'żelbetowe L19', h: .19, op: w => w <= 1.3 ? .10 : w <= 2.2 ? .12 : .14, d: 'oparcie 10–14 cm zależnie od długości belki'},
    hhg: {nm: 'H+H Gold+ belka (beton komórkowy)', h: .125, op: () => .115, d: 'oparcie min. 11,5 cm'},
    ytyf: {nm: 'Ytong YF płaskie, zespolone', h: .124, op: w => w <= 1.5 ? .2 : .25, d: 'oparcie 20–25 cm zależnie od rozpiętości'},
    ytyn: {nm: 'samonośne z betonu komórkowego (Ytong YN, Termalica TNN)', h: .249, op: w => w <= 1.2 ? .2 : .25, d: 'oparcie 20–25 cm zależnie od rozpiętości'},
    u: {nm: 'kształtki U / wylewane', h: .25, op: () => .25, d: 'oparcie 25 cm, wysokość jednej warstwy'},
    own: {nm: 'własne wymiary'},
  };
  const NAD_MAT = {cer: 'pt238', bk: 'ytyf', sil: 'u', ker: 'l19', bet: 'l19'};
  // rodzaj nadproża i jego wymiary dla stanu S (zgodność wstecz: bez typu = własne wymiary)
  const nadOf = (S, gk) => { const n = S.nad || {}; let k = n.typ || 'own'; if (k === 'auto'){ const gg = S.g[gk || 'z'] || S.g.z, mat = (prodBy(gg.prod) || {}).mat; k = gk === 'd' && mat === 'cer' ? 'pt115' : NAD_MAT[mat] || 'l19'; }
    const T = NAD[k] || NAD.own; return k === 'own' || !T.h ? {k, nm: NAD.own.nm, h: +n.h || 0, op: () => +n.op || 0} : {k, nm: T.nm, h: T.h, op: T.op, d: T.d}; };
  const PRE = {
    parter: {t: 'Dom parterowy z poddaszem', d: 'Rzut 12 × 10 m, beton komórkowy 24 cm, szczyty pod dach dwuspadowy.',
      g: {z: {on: 1, len: 44, h: 2.8, prod: 'yt24', meas: 'os', cor: 4}, w: {on: 1, len: 10, h: 2.8, prod: 'sil18', meas: 'os', cor: 0}, d: {on: 1, len: 22, h: 2.6, prod: 'yt12', meas: 'os', cor: 0}},
      op: [{t: 'okno', w: 1.5, h: 1.5, n: 5, g: 'z'}, {t: 'balk', w: 2.0, h: 2.1, n: 1, g: 'z'}, {t: 'drzwi', w: 1.0, h: 2.1, n: 1, g: 'z'}, {t: 'drzwi', w: .9, h: 2.0, n: 6, g: 'd'}],
      dach: {t: 'dwu', plan: 'rect', A: 12, B: 10, L2: 6, a: 40, hk: 1.0, hn: 1.2, ha: .6, ts: .25, auto: 1}, wien: {on: 0, h: .24}, nad: {on: 1, typ: 'auto', h: .12, op: .125}, zap: 5},
    pietro: {t: 'Dom piętrowy z dachem kopertowym', d: 'Rzut 11 × 9 m, dwie kondygnacje, pustak ceramiczny 25 cm + działówki 11,5 cm.',
      g: {z: {on: 1, len: 40, h: 5.5, prod: 'pt25', meas: 'zew', cor: 4}, w: {on: 1, len: 16, h: 5.3, prod: 'pt25', meas: 'os', cor: 0}, d: {on: 1, len: 30, h: 5.2, prod: 'pt115', meas: 'os', cor: 0}},
      op: [{t: 'okno', w: 1.4, h: 1.4, n: 10, g: 'z'}, {t: 'balk', w: 1.8, h: 2.2, n: 2, g: 'z'}, {t: 'drzwi', w: 1.0, h: 2.1, n: 1, g: 'z'}, {t: 'drzwi', w: .9, h: 2.05, n: 9, g: 'd'}, {t: 'drzwi', w: .9, h: 2.05, n: 2, g: 'w'}],
      dach: {t: 'hip', plan: 'rect', A: 11, B: 9, L2: 6, a: 30, hk: .3, hn: 1.2, ha: .6, ts: .25, auto: 0}, wien: {on: 1, h: .24, n: 2}, nad: {on: 1, typ: 'auto', h: .12, op: .125}, zap: 5},
    garaz: {t: 'Garaż wolnostojący', d: 'Rzut 6 × 7 m, bloczki keramzytobetonowe 24 cm, brama i drzwi boczne.',
      g: {z: {on: 1, len: 26, h: 2.6, prod: 'ker24', meas: 'os', cor: 4}, w: {on: 0, len: 0, h: 2.6, prod: 'ker24', meas: 'os', cor: 0}, d: {on: 0, len: 0, h: 2.5, prod: 'yt12', meas: 'os', cor: 0}},
      op: [{t: 'brama', w: 2.5, h: 2.125, n: 1, g: 'z'}, {t: 'drzwi', w: .9, h: 2.0, n: 1, g: 'z'}, {t: 'okno', w: 1.2, h: .6, n: 2, g: 'z'}],
      dach: {t: 'dwu', plan: 'rect', A: 7, B: 6, L2: 4, a: 30, hk: 0, hn: 1, ha: .5, ts: .2, auto: 1}, wien: {on: 0, h: .24}, nad: {on: 1, typ: 'auto', h: .12, op: .125}, zap: 5},
    fund: {t: 'Ściany fundamentowe', d: 'Pod dom 12 × 10 m: obwód 44 m + ściana środkowa 10 m, bloczki betonowe 38×24×12, 5 warstw.',
      g: {z: {on: 1, len: 44, h: .6, prod: 'bet24', meas: 'os', cor: 4}, w: {on: 1, len: 10, h: .6, prod: 'bet24', meas: 'os', cor: 0}, d: {on: 0, len: 0, h: 0, prod: 'yt12', meas: 'os', cor: 0}},
      op: [], dach: {t: 'brak', plan: 'rect', A: 12, B: 10, L2: 6, a: 35, hk: 0, hn: 1, ha: .6, ts: .25, auto: 1}, wien: {on: 0, h: .24}, nad: {on: 0, typ: 'auto', h: .12, op: .125}, zap: 3},
    dzial: {t: 'Ścianki działowe w mieszkaniu', d: 'Mieszkanie w stanie surowym: 26 m ścianek z gazobetonu 12 cm, 5 otworów drzwiowych.',
      g: {z: {on: 0, len: 0, h: 2.7, prod: 'hh24', meas: 'os', cor: 0}, w: {on: 0, len: 0, h: 2.7, prod: 'sil18', meas: 'os', cor: 0}, d: {on: 1, len: 26, h: 2.65, prod: 'yt12', meas: 'os', cor: 0}},
      op: [{t: 'drzwi', w: .9, h: 2.05, n: 5, g: 'd'}], dach: {t: 'brak', plan: 'rect', A: 12, B: 10, L2: 6, a: 35, hk: 0, hn: 1, ha: .6, ts: .25, auto: 0}, wien: {on: 0, h: .24}, nad: {on: 1, typ: 'auto', h: .12, op: .125}, zap: 4},
    silk: {t: 'Dom z dachem naczółkowym', d: 'Rzut 12 × 10 m z poddaszem, silikat 18 cm pod ocieplenie 20 cm, działówki z silikatu 12 cm.',
      g: {z: {on: 1, len: 44, h: 2.8, prod: 'sil18', meas: 'os', cor: 4}, w: {on: 1, len: 12, h: 2.8, prod: 'sil18', meas: 'os', cor: 0}, d: {on: 1, len: 20, h: 2.65, prod: 'sil12', meas: 'os', cor: 0}},
      op: [{t: 'okno', w: 1.5, h: 1.5, n: 6, g: 'z'}, {t: 'balk', w: 2.2, h: 2.2, n: 1, g: 'z'}, {t: 'drzwi', w: 1.0, h: 2.1, n: 1, g: 'z'}, {t: 'drzwi', w: .9, h: 2.05, n: 5, g: 'd'}],
      dach: {t: 'nacz', plan: 'rect', A: 12, B: 10, L2: 6, a: 40, hk: 1.0, hn: 1.4, ha: .6, ts: .25, auto: 1}, wien: {on: 0, h: .24}, nad: {on: 1, typ: 'auto', h: .12, op: .125}, zap: 5},
    mono: {t: 'Dom z dachem jednospadowym', d: 'Nowoczesna bryła 14 × 9 m, dach 12°, silikat 24 cm; ściany boczne to trapezy.',
      g: {z: {on: 1, len: 46, h: 3.0, prod: 'sil24', meas: 'os', cor: 4}, w: {on: 1, len: 9, h: 3.0, prod: 'sil18', meas: 'os', cor: 0}, d: {on: 1, len: 24, h: 2.75, prod: 'sil12', meas: 'os', cor: 0}},
      op: [{t: 'okno', w: 2.0, h: 1.5, n: 4, g: 'z'}, {t: 'balk', w: 3.0, h: 2.4, n: 1, g: 'z'}, {t: 'drzwi', w: 1.1, h: 2.2, n: 1, g: 'z'}, {t: 'drzwi', w: .9, h: 2.05, n: 5, g: 'd'}],
      dach: {t: 'mono', plan: 'rect', A: 14, B: 9, L2: 6, a: 12, hk: .5, hn: 1, ha: .6, ts: .25, auto: 1}, wien: {on: 0, h: .24}, nad: {on: 1, typ: 'auto', h: .12, op: .125}, zap: 5},
    ldom: {t: 'Dom na rzucie L z poddaszem', d: 'Skrzydła 14 × 9 m i 9 × 7 m, ceramika 25 cm, dwa szczyty i ścianki kolankowe.',
      g: {z: {on: 1, len: 60, h: 2.8, prod: 'pt25', meas: 'os', cor: 6}, w: {on: 1, len: 14, h: 2.8, prod: 'pt25', meas: 'os', cor: 0}, d: {on: 1, len: 26, h: 2.65, prod: 'pt115', meas: 'os', cor: 0}},
      op: [{t: 'okno', w: 1.5, h: 1.5, n: 7, g: 'z'}, {t: 'balk', w: 2.0, h: 2.2, n: 2, g: 'z'}, {t: 'drzwi', w: 1.0, h: 2.1, n: 1, g: 'z'}, {t: 'drzwi', w: .9, h: 2.05, n: 7, g: 'd'}],
      dach: {t: 'dwu', plan: 'L', A: 14, B: 9, L2: 7, a: 38, hk: 1.0, hn: 1.2, ha: .6, ts: .25, auto: 1}, wien: {on: 0, h: .24}, nad: {on: 1, typ: 'auto', h: .12, op: .125}, zap: 5},
  };

  // spoiwa: jh – typowa grubość spoiny, unit – w czym liczone zużycie, kgl – kg suchej mieszanki na 1 l spoiny, yl – litrów gotowej zaprawy z worka, loss – straty
  const MO = {
    cienka: {nm: 'zaprawa cienkowarstwowa', sh: 'klej do bloczków, spoina 1–3 mm', jh: 2, unit: 'kg', kgl: 1.6, loss: 1.0, bag: 25, bu: 'worków 25 kg', col: '#B9BEC2',
      why: 'Cienka spoina to prawie brak mostków termicznych w murze i szybkie murowanie. Wymaga elementów o równych, dokładnych wymiarach i równej pierwszej warstwy na zaprawie tradycyjnej.'},
    pianka: {nm: 'zaprawa-pianka (np. Dryfix)', sh: 'poliuretanowa, z pistoletu, dwa pasma na spoinie poziomej', jh: 1, unit: 'puszek', m2can: 8, bu: 'puszek', col: '#F0C64E',
      why: 'Murowanie bez wody i mieszania, szybkie i czyste. Tylko do elementów szlifowanych lub o bardzo dokładnej wysokości i tylko w systemie, który producent elementu dopuszcza; ważna temperatura stosowania z karty pianki.'},
    trad: {nm: 'zaprawa murarska tradycyjna', sh: 'cementowo-wapienna, spoina ok. 10–12 mm', jh: 12, unit: 'l', loss: 1.2, holeF: 1.1, yl: 14.5, bu: 'worków 25 kg', col: '#D9CBB0',
      why: 'Wyrównuje odchyłki wymiarów elementów. Spoina 1 cm co warstwę to mostek termiczny – w ścianach jednowarstwowych lepiej sprawdza się zaprawa ciepłochronna.'},
    cieplo: {nm: 'zaprawa ciepłochronna', sh: 'lekka (perlit, keramzyt), spoina ok. 12 mm', jh: 12, unit: 'l', loss: 1.2, holeF: 1.1, yl: null, bu: '', col: '#EFE7D2',
      why: 'Lekka zaprawa przewodzi ciepło co najmniej dwa razy słabiej niż tradycyjna cementowo-wapienna (λ ok. 0,8 W/(m·K)), więc spoiny 10–12 mm mniej osłabiają izolacyjność ściany jednowarstwowej z ceramiki lub keramzytobetonu. Nie stosuje się jej przy cienkich spoinach ani do silikatów.'},
    cem: {nm: 'zaprawa cementowa', sh: 'zwykle M5–M10 według projektu, do ścian fundamentowych', jh: 12, unit: 'l', loss: 1.2, yl: 14.5, bu: 'worków 25 kg', col: '#BDBCB6',
      why: 'Odporna na wilgoć – do ścian fundamentowych i piwnicznych z bloczków betonowych. Klasę zaprawy podaje projekt; nie powinna być mocniejsza od elementu murowego.'},
  };

  const DACH = {brak: 'bez poddasza', flat: 'płaski z attyką', mono: 'jednospadowy', dwu: 'dwuspadowy', nacz: 'dwuspadowy z naczółkami', hip: 'czterospadowy'};
  /* ściany zewnętrzne nad stropem: kolejne ściany obwodu (rozwinięcie) z profilem górnej krawędzi */
  function roofGeom(D){
    const t = D.t, A = Math.max(0, D.A), B = Math.max(0, D.B), L2 = Math.max(0, D.L2), tn = Math.tan(Math.max(0, Math.min(70, D.a)) * Math.PI / 180), hk = Math.max(0, D.hk), H = B / 2 * tn, hn = Math.min(Math.max(0, D.hn), H);
    const L = D.plan === 'L' && A > B;
    const lens = L ? [A, B + L2, B, L2, A - B, B] : [A, B, A, B], names = L ? ['front', 'bok skrzydła', 'szczyt skrzydła', 'bok wewn.', 'tył', 'szczyt'] : ['front', 'bok', 'tył', 'bok'];
    let types;
    if (t === 'brak') types = lens.map(() => 'none');
    else if (t === 'flat') types = lens.map(() => 'att');
    else if (t === 'hip') types = lens.map(() => 'eave');
    else if (t === 'mono') types = L ? lens.map(() => 'eave') : ['low', 'rise', 'high', 'fall'];
    else types = L ? ['eave', 'eave', 'gable', 'eave', 'eave', 'gable'] : ['eave', 'gable', 'eave', 'gable'];
    const nacz = t === 'nacz', top = (ty, u, len) => ty === 'none' ? 0 : ty === 'att' ? D.ha : ty === 'eave' || ty === 'low' ? hk : ty === 'high' ? hk + B * tn : ty === 'rise' ? hk + u * tn : ty === 'fall' ? hk + (len - u) * tn
      : (() => { const v = hk + Math.max(0, B / 2 - Math.abs(u - B / 2)) * tn; return nacz ? Math.min(v, hk + H - hn) : v; })();
    const area = (ty, len) => ty === 'none' ? 0 : ty === 'att' ? len * D.ha : ty === 'eave' || ty === 'low' ? len * hk : ty === 'high' ? len * (hk + B * tn) : ty === 'rise' || ty === 'fall' ? len * hk + len * len * tn / 2
      : B * hk + B * H / 2 - (nacz && H > 0 ? B * hn * hn / (2 * H) : 0);
    let s0 = 0; const walls = lens.map((len, i) => { const w = {len, ty: types[i], nm: names[i], s: s0}; s0 += len; return w; });
    // profil (punkty względem początku rozwinięcia i wierzchu stropu)
    const prof = []; walls.forEach(w => { const pts = w.ty === 'gable' ? (nacz && hn > 0 ? [0, B / 2 - hn / tn * 1, B / 2 + hn / tn * 1, w.len] : [0, B / 2, w.len]) : w.ty === 'rise' || w.ty === 'fall' ? [0, w.len] : [0, w.len];
      pts.forEach(u => prof.push([w.s + Math.max(0, Math.min(w.len, u)), top(w.ty, Math.max(0, Math.min(w.len, u)), w.len)])); });
    let kol = 0, szc = 0, att = 0; walls.forEach(w => { const a = area(w.ty, w.len); if (w.ty === 'att') att += a; else if (w.ty !== 'none'){ const k = w.len * hk; kol += k; szc += a - k; } });
    const hmax = Math.max(0, ...prof.map(q => q[1]));
    return {walls, prof, perim: s0, kol, szc, att, hmax, nG: types.filter(x => x === 'gable').length, tn, H};
  }
  const prodBy = id => PROD.find(p => p.id === id) || PROD[0];
  const sysOf = (p, g) => (g && g.mo && p.sys.includes(g.mo)) ? g.mo : p.sys[0];
  const bagsOf = (sys, u, q) => { const m = MO[sys]; return q == null ? null : m.unit === 'puszek' || u === 'puszek' ? Math.ceil(q) : u === 'kg' ? (m.bag ? Math.ceil(q / m.bag) : null) : m.yl ? Math.ceil(q / m.yl) : null; };
  // zużycie spoiwa: dane producenta (p.cons[sys]) albo geometria spoin
  function mortQty(p, sys, net, vol){
    const m = MO[sys], c = p.cons && p.cons[sys]; let q = null, u = m.unit, src = 'prod';
    if (c){ const [v, un] = c; q = un === 'kg/m3' ? vol * v : un === 'kg/m2' ? net * v : un === 'l/m2' ? net * v : un === 'l/m3' ? vol * v : un === 'm2/puszka' ? net / v : null; u = un === 'm2/puszka' ? 'puszek' : un.startsWith('kg') ? 'kg' : 'l'; }
    else { src = 'geo'; const T = p.T / 1000, rh = (p.H + p.jh) / 1000, jh = p.jh / 1000, jv = p.jv / 1000, Vj = T * jh / rh + (jv > 0 ? T * jv * (p.H / 1000) / (((p.L + p.jv) / 1000) * rh) : 0);
      if (sys === 'pianka'){ q = net / m.m2can; u = 'puszek'; }
      else if (m.unit === 'kg'){ q = Vj * 1000 * m.kgl * m.loss * net; }
      else { q = Vj * 1000 * m.loss * (p.holes === 'grid' ? m.holeF || 1 : 1) * net; } }
    const bags = bagsOf(sys, u, q);
    return {ty: sys, q, u, bags, bu: m.bu, src};
  }
  const perM2 = p => p.m2 || 1e6 / ((p.L + p.jv) * (p.H + p.jh));
  function calcGroup(S, k){
    const g = S.g[k], p0 = prodBy(g.prod), sys = sysOf(p0, g), p = {...p0, ...((p0.alt || {})[sys] || {})}, T = p.T / 1000, ops = S.op.filter(o => o.g === k && o.n > 0 && o.w > 0 && o.h > 0);
    const RG = k === 'z' && S.dach ? roofGeom(S.dach) : null; if (RG && S.dach.auto && RG.perim > 0) g.len = +RG.perim.toFixed(2);
    if (!g.on || !(g.len > 0) || !(g.h > 0)) return {k, on: false, p, sys};
    const gross = g.len * g.h, kol = RG ? RG.kol : 0, szc = RG ? RG.szc : 0, att = RG ? RG.att : 0;
    const otw = ops.reduce((s, o) => s + o.w * o.h * o.n, 0);
    const NN = nadOf(S, k), nad = S.nad.on ? ops.reduce((s, o) => s + (o.w + 2 * NN.op(o.w)) * NN.h * o.n, 0) : 0;
    // wieniec: tylko ściany nośne (zewnętrzne i wewnętrzne), tyle wieńców, ile kondygnacji mieści się w podanej wysokości
    const nW = Math.max(1, Math.round(S.wien.n || 1)), wien = S.wien.on && k !== 'd' ? g.len * S.wien.h * nW : 0;
    // przy długości z obwodu rzutu (wymiary w osiach) naroży nie odejmujemy
    const hWi = S.wien.on && k !== 'd' ? S.wien.h * nW : 0, meas = RG && S.dach.auto ? 'os' : g.meas, cor = meas === 'zew' ? Math.max(0, g.cor) * T * Math.max(0, g.h - hWi) : 0;
    const net = Math.max(0, gross + kol + szc + att - otw - nad - wien - cor), m2 = perM2(p), raw = net * m2, pcs = Math.ceil(raw * (1 + S.zap / 100));
    const pal = p.pal ? Math.ceil(pcs / p.pal) : null, mass = p.kg ? pcs * p.kg / 1000 : null, vol = net * T;
    const mort = mortQty(p, sys, net, vol);
    const cost = (S.price || {})[p.id] > 0 ? pcs * S.price[p.id] : null;
    const rows = g.h / ((p.H + p.jh) / 1000);
    return {k, on: true, g, p, sys, ops, RG, gross, kol, att, szc, otw, nad, wien, nW, cor, net, m2, raw, pcs, pal, mass, vol, mort, cost, rows};
  }
  function calc(S){ const G = ['z', 'w', 'd'].map(k => calcGroup(S, k)), on = G.filter(x => x.on);
    const sum = f => on.reduce((s, x) => s + (f(x) || 0), 0);
    // palety liczone dla każdego elementu łącznie (ten sam element w kilku grupach ścian jedzie na wspólnych paletach)
    const byP = {}; on.forEach(x => { const b = byP[x.p.id] = byP[x.p.id] || {p: x.p, ks: [], pcs: 0, mass: 0}; b.ks.push(x.k); b.pcs += x.pcs; b.mass += x.mass || 0; });
    const PB = Object.values(byP).map(b => ({...b, pal: b.p.pal ? Math.ceil(b.pcs / b.p.pal) : null, mass: b.p.kg ? b.mass : null}));
    return {S, G, PB, pcs: sum(x => x.pcs), pal: PB.reduce((s, b) => s + (b.pal || 0), 0), mass: sum(x => x.mass), net: sum(x => x.net), cost: on.some(x => x.cost != null) ? sum(x => x.cost) : null, anyMassMissing: on.some(x => x.mass == null)}; }
  /* ---------- rysunki ---------- */
  const rectSub = (R, O) => { // R minus O, prostokąty [x0,x1,y0,y1]
    if (O[0] >= R[1] || O[1] <= R[0] || O[2] >= R[3] || O[3] <= R[2]) return [R];
    const out = [], ix0 = Math.max(R[0], O[0]), ix1 = Math.min(R[1], O[1]);
    if (O[0] > R[0]) out.push([R[0], O[0], R[2], R[3]]);
    if (O[1] < R[1]) out.push([O[1], R[1], R[2], R[3]]);
    if (O[2] > R[2]) out.push([ix0, ix1, R[2], O[2]]);
    if (O[3] < R[3]) out.push([ix0, ix1, O[3], R[3]]);
    return out.filter(q => q[1] - q[0] > 1e-4 && q[3] - q[2] > 1e-4); };
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
    const g = r.g, k = r.k, fl = floorsOf(S, g, k), fh = g.h / fl, segs = segsOf(S, r), G = wallGeo(S, r), N = nadOf(S, k), opw = w => S.nad.on ? Math.max(.1, N.op(w)) : .1, nh = S.nad.on ? N.h : 0, m = opw(1.2);
    const items = []; S.op.forEach((o, ri) => { if (o.g !== k || !(o.n > 0 && o.w > 0 && o.h > 0)) return; for (let ii = 0; ii < Math.round(o.n); ii++) items.push({o, ri, ii, t: o.t, w: Math.min(o.w, g.len), h: o.h, fix: o.at && o.at[ii] ? o.at[ii] : null}); });
    const placed = [], band = it => [it.y0, it.y1 + nh];
    const put = it => { it.x1 = it.x0 + it.w; it.y1 = it.y0 + it.h; placed.push(it); };
    const clampX = (x, w) => Math.max(0, Math.min(g.len - w, x)), clampY = (y, h) => Math.max(0, Math.min(G.ymax - h, y));
    items.filter(it => it.fix).forEach(it => { it.x0 = clampX(+it.fix.x || 0, it.w); it.y0 = clampY(+it.fix.y || 0, it.h); put(it); });
    const fits = (x, it) => { if (x < -1e-6 || x + it.w > g.len + 1e-6) return false; const mi = opw(it.w);
      if (segs.length > 1){ const sg = segs.find(s => x >= s.s - 1e-6 && x < s.s + s.len); if (!sg || x < sg.s + mi - 1e-6 || x + it.w > sg.s + sg.len - mi + 1e-6) return false; }
      const b = [it.y0, it.y0 + it.h + nh];
      return !placed.some(q => ovl(b[0], b[1], ...band(q)) > 0 && ovl(x - mi - opw(q.w), x + it.w + mi + opw(q.w), q.x0, q.x1) > 0); };
    const auto = items.filter(it => !it.fix);
    for (let f = 0; f < fl; f++){
      const part = auto.filter((it, i) => i % fl === f), tw = part.reduce((s, o) => s + o.w, 0), gap = Math.max(.3, (g.len - tw) / (part.length + 1)); let x = gap;
      part.forEach(it => { it.y0 = clampY(f * fh + sillOf(it.o), it.h); let best = null;
        for (let d = 0; d <= g.len && best == null; d += .05){ for (const c of d ? [x + d, x - d] : [x]){ const cx = Math.round(c * 20) / 20; if (fits(cx, it)){ best = cx; break; } } }
        it.x0 = best != null ? best : clampX(x, it.w); x = it.x0 + it.w + gap; put(it); });
    }
    return {items, fl, fh, segs, G, m, N, opw, nh};
  }
  // kontrola położenia otworów; pierMin – minimalna szerokość filarka [m]
  function checkOps(S, r, L){
    const g = r.g, k = r.k, {items, fh, segs, G, N} = L, nad = S.nad.on, op = w => N.op(w), nh = nad ? N.h : 0, T = r.p.T / 1000, nos = k !== 'd';
    const cm = v => fx(v * 100, Math.abs(v * 200 - Math.round(v * 200)) < 1e-6 && Math.abs(v * 100 - Math.round(v * 100)) > 1e-6 ? 1 : 0) + ' cm', corners = segs.length > 1 ? [...segs.map(s => s.s), g.len] : (k === 'z' ? [0, g.len] : []);
    items.forEach(it => { it.msg = []; it.st = null; });
    const add = (it, st, t) => { if (it.msg.includes(t)) return; it.msg.push(t); if (st === 'err' || !it.st) it.st = st; };
    items.forEach(it => {
      corners.slice(1, -1).forEach(c => { if (it.x0 < c - 1e-6 && it.x1 > c + 1e-6) add(it, 'err', 'otwór przechodzi przez narożnik'); });
      corners.forEach(c => { const d = it.x0 >= c - 1e-6 ? it.x0 - c : c - it.x1; if (d >= -1e-6 && d < (nad ? op(it.w) : .1) - 1e-6 && !(it.x0 < c - 1e-6 && it.x1 > c + 1e-6)) add(it, 'warn', nad ? `od narożnika tylko ${cm(Math.max(0, d))} – nadproże potrzebuje ${cm(op(it.w))} oparcia` : `otwór przy samym narożniku (${cm(Math.max(0, d))})`); });
      if (it.y0 < g.h - 1e-6){ const nf = Math.round(g.h / fh), f = Math.min(Math.floor((it.y0 + 1e-6) / fh), nf - 1), top = (f + 1) * fh, wTop = top - (S.wien.on && k !== 'd' ? S.wien.h : 0);
        if (it.y1 > top + 1e-6) add(it, 'err', f + 1 < nf ? 'otwór przecina strop między kondygnacjami' : 'otwór wyższy niż ściana');
        else if (it.y1 + nh > wTop + 1e-6) add(it, 'warn', nad ? `nadproże (${cm(nh)}) nie mieści się pod ${S.wien.on && k !== 'd' ? 'wieńcem' : 'stropem'} – brakuje ${cm(it.y1 + nh - wTop)}; obniż otwór albo zaprojektuj nadproże w wieńcu` : 'otwór sięga wieńca');
        else if (it.t === 'brama' && wTop - it.y1 < .2 - 1e-6) add(it, 'warn', `nad bramą tylko ${cm(wTop - it.y1)} – brama segmentowa zwykle potrzebuje min. 20 cm nad otworem (sprawdź w karcie bramy)`); }
      else if (G.roofOn){ if (it.y0 < G.base - 1e-6) add(it, 'err', 'otwór przecina strop');
        else if (![[it.x0, it.y0], [it.x1, it.y0], [it.x0, it.y1], [it.x1, it.y1]].every(q => G.inP(q[0], q[1]))) add(it, 'err', 'otwór wystaje poza obrys szczytu lub ścianki kolankowej'); }
    });
    // filarki: oparcie dwóch nadproży i minimalny przekrój ściany nośnej wg PN-EN 1996-1-1 (0,04 m²; poniżej 0,1 m² nośność obniżona)
    const pMin = .04 / T, pRed = .1 / T;
    for (let a = 0; a < items.length; a++) for (let b = a + 1; b < items.length; b++){ const A = items[a], B = items[b];
      const vb = ovl(A.y0, A.y1 + nh, B.y0, B.y1 + nh); if (vb <= 0) continue;
      const gap = Math.max(A.x0, B.x0) - Math.min(A.x1, B.x1), both = t => { add(A, t[0], t[1]); add(B, t[0], t[1]); };
      if (gap < -1e-6){ if (ovl(A.y0, A.y1, B.y0, B.y1) > 1e-6) both(['err', 'nachodzi na inny otwór']); else if (nad) both(['warn', 'nadproże koliduje z otworem nad lub pod nim']); continue; }
      if (nos && gap < pMin - 1e-6) both(['err', `filarek ${cm(gap)} – mniej niż minimalny przekrój ściany nośnej (0,04 m², przy tej grubości ${cm(pMin)})`]);
      else if (nad && gap < op(A.w) + op(B.w) - 1e-6) both(['warn', `filarek ${cm(gap)} – za wąski na oparcie dwóch nadproży (${cm(op(A.w))} + ${cm(op(B.w))})`]);
      else if (nos && gap < pRed - 1e-6) both(['warn', `filarek ${cm(gap)} – przekrój poniżej 0,1 m² (${cm(pRed)}), nośność obniżona – do sprawdzenia przez konstruktora`]); }
    return items.filter(it => it.st);
  }
  // odległości od sąsiadów na tej samej wysokości (do wymiarowania zaznaczonego otworu)
  function neigh(L, it, len){
    const same = L.items.filter(q => q !== it && ovl(q.y0, q.y1, it.y0, it.y1) > 0), sg = L.segs.find(s => it.x0 >= s.s - 1e-6 && it.x0 < s.s + s.len) || L.segs[0];
    const lb = Math.max(sg.s, ...same.filter(q => q.x1 <= it.x0 + 1e-6).map(q => q.x1)), rb = Math.min(sg.s + sg.len, len, ...same.filter(q => q.x0 >= it.x1 - 1e-6).map(q => q.x0));
    return {sg, lb, rb};
  }
  function svgWall(S, r, sel, view, tw, zm){
    const g = r.g, p = r.p, M = MAT[p.mat] || MAT.bk, bl = p.L / 1000, bj = p.jv / 1000, bh = p.H / 1000, rh = (p.H + p.jh) / 1000;
    const L = layout(S, r), bad = checkOps(S, r, L), ops = L.items, G = L.G, hW = S.wien.on && r.k !== 'd' ? S.wien.h : 0, RG = r.k === 'z' ? r.RG : null, roofOn = G.roofOn, ts = G.ts;
    const seg = view != null && L.segs.length > 1 && L.segs[view] ? L.segs[view] : null, vx0 = seg ? seg.s : 0, vx1 = seg ? seg.s + seg.len : Math.max(g.len, roofOn ? RG.perim : 0), vw = vx1 - vx0;
    // wysokość muru nad stropem w oglądanym zakresie (żeby nad ścianą okapową nie było pustego pasa)
    const hmaxV = roofOn ? (seg ? Math.max(0, ...RG.prof.filter(q => q[0] >= vx0 - 1e-6 && q[0] <= vx1 + 1e-6).map(q => q[1])) : RG.hmax) : 0;
    const narrow = seg && tw && tw < 700, zf = narrow ? Math.max(1, Math.min(4, zm || 1)) : 1, TW = narrow ? tw * zf : tw, padL = narrow ? 40 : 56, padR = narrow ? 18 : 40, padB = 74;
    const sc = seg ? (narrow ? Math.max(18, Math.min(150 * zf, (TW - padL - padR) / Math.max(vw, 1))) : Math.max(40, Math.min(150, 860 / Math.max(vw, 1)))) : Math.max(34, Math.min(90, 900 / Math.max(vw, 1)));
    const padT2 = 46 + (roofOn ? (hmaxV + ts) * sc : 0), natW = Math.ceil(padL + vw * sc + padR), W = narrow ? Math.max(Math.round(TW), natW) : Math.max(640, padL + vw * sc + padR), H = padT2 + g.h * sc + padB;
    const X = x => padL + (x - vx0) * sc, Y = y => padT2 + (g.h - y) * sc, inV = (a, b) => b > vx0 - 1e-6 && a < vx1 + 1e-6;
    const NN = L.N, nop = w => NN.op(w), obst = []; ops.forEach(o => { obst.push([o.x0, o.x1, o.y0, o.y1]); if (S.nad.on) obst.push([o.x0 - nop(o.w), o.x1 + nop(o.w), o.y1, o.y1 + NN.h]); });
    let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" class="mu-wall${seg && zf <= 1 && (!narrow || natW <= Math.round(TW) + 1) ? ' fit' : ''}" role="group" aria-label="Rozwinięcie ściany z układem elementów i otworami"><defs>
      <pattern id="muW" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill="#B9BCBE"/><line x1="0" y1="0" x2="0" y2="8" stroke="#8D9194" stroke-width="2"/></pattern>
      <pattern id="muG" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#DCE9F3"/><path d="M0 6L6 0" stroke="#A9C6DD" stroke-width="1"/></pattern>
      <pattern id="muGr" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#F8DEDA"/><path d="M0 6L6 0" stroke="#E7A49B" stroke-width="1"/></pattern>
      <clipPath id="muVw"><rect x="${X(vx0) - 6}" y="0" width="${vw * sc + 12}" height="${H}"/></clipPath></defs>`;
    const yTop = roofOn ? G.base + hmaxV : g.h; s += `<rect class="mu-hit" x="${X(vx0)}" y="${Y(yTop)}" width="${vw * sc}" height="${yTop * sc}" fill="transparent"/>`;
    s += `<rect x="${X(vx0) - 4}" y="${Y(0)}" width="${vw * sc + 8}" height="6" fill="#6B6F73"/><g clip-path="url(#muVw)">`;
    let full = 0, cut = 0;
    const blk = (R, isCut) => { const [x0, x1, y0, y1] = R; if (!inV(x0, x1)) return ''; if (isCut) cut++; else full++;
      return `<rect x="${X(x0).toFixed(1)}" y="${Y(y1).toFixed(1)}" width="${((x1 - x0) * sc).toFixed(1)}" height="${((y1 - y0) * sc).toFixed(1)}" fill="${isCut ? '#F2B48C' : M.front}" stroke="${M.edge}" stroke-width=".8"/>`; };
    // pasy muru między wieńcami: przy kilku wieńcach (kondygnacjach) każdy pas zaczyna się od wierzchu niższego wieńca
    const nWd = hW && r.nW > 1 ? Math.max(1, Math.min(r.nW, L.fl)) : 1, bands = [];
    for (let f = 0; f < nWd; f++) bands.push([f * g.h / nWd, (f + 1) * g.h / nWd - hW]);
    bands.forEach(([b0, top]) => {
    for (let k = 0; b0 + k * rh < top - 1e-6; k++){ const y0 = b0 + k * rh, y1 = Math.min(y0 + bh, top), vcut = y0 + bh > top + 1e-6, off = k % 2 ? (bl + bj) / 2 : 0;
      for (let x = -off; x < g.len - 1e-6; x += bl + bj){ if (x + bl < vx0 - 1e-6 || x > vx1 + 1e-6) continue; const B = [Math.max(0, x), Math.min(g.len, x + bl), y0, y1]; if (B[1] - B[0] < 1e-4) continue;
        let parts = [B]; obst.forEach(O => { parts = parts.flatMap(q => rectSub(q, O)); });
        const hcut = B[0] > x + 1e-6 || B[1] < x + bl - 1e-6;
        parts.forEach(q => { const whole = parts.length === 1 && Math.abs(q[1] - q[0] - (B[1] - B[0])) < 1e-6 && Math.abs(q[3] - q[2] - (B[3] - B[2])) < 1e-6; s += blk(q, hcut || vcut || !whole); }); } } });
    if (hW) bands.forEach(([, top]) => { s += `<rect x="${X(0)}" y="${Y(top + hW)}" width="${g.len * sc}" height="${hW * sc}" fill="url(#muW)" stroke="#5B6064"/><text x="${X(Math.max(0, vx0) + .15)}" y="${Y(top + hW) + hW * sc / 2 + 4}" class="mu-lab">wieniec</text>`; });
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
      s += `<line x1="${X(w.s)}" x2="${X(w.s)}" y1="${Y(0) + 4}" y2="${Y(yTop) - 8}" stroke="#2E6FA8" stroke-dasharray="4 4" stroke-width="1"/>`;
      if (w.len * sc > 70) s += `<text x="${X(w.s + w.len / 2)}" y="${Y(yTop) - 14}" text-anchor="middle" class="mu-lab mu-segl" data-seg="${w.i}">ściana ${w.nm} · ${fx(w.len, 2)} m</text>`; });
    if (roofOn && Math.abs(RG.perim - g.len) > .05) s += `<text x="${X(vx0)}" y="${Y(yTop) - 30}" class="mu-ax">długość ścian (${fx(g.len, 1)} m) różni się od obwodu rzutu (${fx(RG.perim, 1)} m)</text>`;
    s += `<rect x="${X(0)}" y="${Y(g.h)}" width="${g.len * sc}" height="${g.h * sc}" fill="none" stroke="#3a3d42" stroke-width="1.8" clip-path="url(#muVw)"/>`;
    for (let f = 1; f < L.fl; f++) s += `<line x1="${X(vx0) - 8}" x2="${X(Math.min(vx1, g.len)) + 8}" y1="${Y(f * L.fh)}" y2="${Y(f * L.fh)}" stroke="#2E6FA8" stroke-dasharray="6 5" stroke-width="1.2"/><text x="${X(Math.min(vx1, g.len)) + 6}" y="${Y(f * L.fh) - 4}" class="mu-lab" style="fill:#2E6FA8">poziom ${f}</text>`;
    // otwory (przeciąganie, uchwyty, stan kontroli)
    const isSel = o => sel && sel.r === o.ri && sel.i === o.ii;
    ops.forEach(o => { if (!inV(o.x0, o.x1)) return; const on = isSel(o), err = o.st === 'err', wr = o.st === 'warn', col = err ? '#C62828' : wr ? '#B26A00' : '#2E6FA8';
      const sgn = (L.segs.find(q => o.x0 >= q.s - 1e-6 && o.x0 < q.s + q.len) || L.segs[0]);
      if (S.nad.on) s += `<rect x="${X(o.x0 - nop(o.w))}" y="${Y(o.y1 + NN.h)}" width="${(o.w + 2 * nop(o.w)) * sc}" height="${NN.h * sc}" fill="${err ? '#D98C84' : '#9AA0A6'}" stroke="#5B6064" stroke-width="1" pointer-events="none"/>`;
      s += `<g class="mu-op${on ? ' on' : ''}${err ? ' err' : wr ? ' warn' : ''}" data-r="${o.ri}" data-i="${o.ii}" tabindex="0" role="button" aria-pressed="${!!on}" aria-label="${OTY[o.t] ? OTY[o.t].nm : o.t} ${fx(o.w * 100, 0)} × ${fx(o.h * 100, 0)} cm, ściana ${esc(sgn.nm)}, ${fx(o.x0 - sgn.s, 2)} m od narożnika${o.msg.length ? ', uwaga: ' + esc(o.msg.join('; ')) : ''}">`
        + `<rect x="${X(o.x0)}" y="${Y(o.y1)}" width="${o.w * sc}" height="${o.h * sc}" fill="url(#${err ? 'muGr' : 'muG'})" stroke="${col}" stroke-width="${on ? 3 : 1.6}"${wr && !on ? ' stroke-dasharray="6 3"' : ''}/>`;
      if (o.t === 'okno' || o.t === 'balk') s += `<line x1="${X(o.x0 + o.w / 2)}" x2="${X(o.x0 + o.w / 2)}" y1="${Y(o.y1)}" y2="${Y(o.y0)}" stroke="${col}" stroke-width="1"/>`;
      if (o.t === 'drzwi') s += `<path d="M${X(o.x0)} ${Y(o.y0)}A${o.w * sc} ${o.w * sc} 0 0 1 ${X(o.x1)} ${Y(o.y0) - Math.min(o.w, o.h) * sc}" fill="none" stroke="${col}" stroke-width=".8" stroke-dasharray="3 3"/>`;
      if (o.w * sc > 46) s += `<text x="${X(o.x0 + o.w / 2)}" y="${Y(o.y0 + o.h / 2) + 4}" text-anchor="middle" class="mu-ot">${fx(o.w * 100, 0)}×${fx(o.h * 100, 0)}</text>`;
      if (o.st && o.w * sc > 22) s += `<g transform="translate(${X(o.x1) - 11} ${Y(o.y1) + 11})" pointer-events="none"><circle r="8" fill="${col}"/><text y="4" text-anchor="middle" class="mu-bang">!</text></g>`;
      if (on){ const hs = 14; s += `<rect class="mu-hd" data-hd="w" x="${X(o.x1) - hs / 2}" y="${Y(o.y0 + o.h / 2) - hs}" width="${hs}" height="${hs * 2}" rx="4"/><rect class="mu-hd" data-hd="h" x="${X(o.x0 + o.w / 2) - hs}" y="${Y(o.y1) - hs / 2}" width="${hs * 2}" height="${hs}" rx="4"/>`; }
      s += `<title>${OTY[o.t] ? OTY[o.t].nm : o.t} ${fx(o.w, 2)} × ${fx(o.h, 2)} m${o.msg.length ? ' – ' + esc(o.msg.join('; ')) : ' – przeciągnij, żeby przesunąć'}</title></g>`; });
    // wymiary zaznaczonego otworu: odległości do narożnika / sąsiadów i parapet
    const so = ops.find(isSel);
    if (so && inV(so.x0, so.x1)){ const {lb, rb} = neigh(L, so, g.len), yd = Y((so.y0 + so.y1) / 2), fl0 = Math.min(Math.floor((so.y0 + 1e-6) / L.fh), L.fl - 1) * L.fh, base0 = so.y0 >= g.h - 1e-6 && G.roofOn ? G.base : fl0;
      const dim = (a, b, y) => b - a > .01 ? `<line x1="${X(a)}" x2="${X(b)}" y1="${y}" y2="${y}" class="mu-dsel"/><line x1="${X(a)}" x2="${X(a)}" y1="${y - 6}" y2="${y + 6}" class="mu-dsel"/><line x1="${X(b)}" x2="${X(b)}" y1="${y - 6}" y2="${y + 6}" class="mu-dsel"/><text x="${(X(a) + X(b)) / 2}" y="${y - 5}" text-anchor="middle" class="mu-dst">${fx((b - a) * 100, 0)}</text>` : '';
      s += `<g pointer-events="none">${dim(lb, so.x0, yd)}${dim(so.x1, rb, yd)}`;
      if (so.y0 - base0 > .01) s += `<line x1="${X(so.x0) - 14}" x2="${X(so.x0) - 14}" y1="${Y(base0)}" y2="${Y(so.y0)}" class="mu-dsel"/><text x="${X(so.x0) - 18}" y="${(Y(base0) + Y(so.y0)) / 2 + 4}" text-anchor="end" class="mu-dst">${fx((so.y0 - base0) * 100, 0)}</text>`;
      s += '</g>'; }
    // wymiary ściany
    const yb = Y(0) + 30, xa = Math.max(0, vx0), xb = Math.min(g.len, vx1);
    s += `<line x1="${X(xa)}" x2="${X(xb)}" y1="${yb}" y2="${yb}" class="mu-dl"/><line x1="${X(xa)}" x2="${X(xa)}" y1="${yb - 6}" y2="${yb + 6}" class="mu-dl"/><line x1="${X(xb)}" x2="${X(xb)}" y1="${yb - 6}" y2="${yb + 6}" class="mu-dl"/><text x="${X(xa + Math.min(xb - xa, 12) / 2)}" y="${yb - 6}" text-anchor="middle" class="mu-dt">${seg ? 'ściana ' + esc(seg.nm) + ' · ' : 'długość '}${fx(xb - xa, 2)} m</text>`;
    s += `<line x1="${X(xa) - 22}" x2="${X(xa) - 22}" y1="${Y(0)}" y2="${Y(g.h)}" class="mu-dl"/><text x="${X(xa) - 28}" y="${Y(g.h / 2)}" text-anchor="middle" class="mu-dt" transform="rotate(-90 ${X(xa) - 28} ${Y(g.h / 2)})">${fx(g.h, 2)} m</text>`;
    const nOp = ops.filter(o => inV(o.x0, o.x1)).length;
    const nOpT = `${nOp} ${nOp === 1 ? 'otwór' : nOp % 10 >= 2 && nOp % 10 <= 4 && (nOp % 100 < 12 || nOp % 100 > 14) ? 'otwory' : 'otworów'}`;
    s += narrow ? `<text x="${X(xa)}" y="${H - 26}" class="mu-ax">${nOpT} na tej ścianie</text><text x="${X(xa)}" y="${H - 10}" class="mu-ax">elementy: ${full} całych, ${cut} docinanych</text>`
      : `<text x="${X(xa)}" y="${H - 12}" class="mu-ax">${seg ? 'ta ściana' : 'rozwinięcie ścian'}: ${nOpT} · widocznych elementów: ${full} całych, ${cut} docinanych</text>`;
    return {svg: s + '</svg>', full, cut, L, bad, sc, vx0, padL, padT: padT2, narrow: !!narrow, zf};
  }
  function svgM2(p){
    const M = MAT[p.mat] || MAT.bk, sz = 220, pad = 26, sc = sz / 1000, bl = p.L, bj = p.jv, bh = p.H, jh = p.jh, rh = bh + jh;
    let s = `<svg viewBox="0 0 ${sz + 2 * pad} ${sz + 2 * pad + 20}" class="mu-m2" role="img" aria-label="Jeden metr kwadratowy muru"><rect x="${pad}" y="${pad}" width="${sz}" height="${sz}" fill="${jh > 5 ? '#D8D2C6' : '#EAE6DE'}"/><clipPath id="muM2"><rect x="${pad}" y="${pad}" width="${sz}" height="${sz}"/></clipPath><g clip-path="url(#muM2)">`;
    for (let k = 0; k * rh < 1000; k++){ const y = pad + sz - (k * rh + bh) * sc, off = k % 2 ? (bl + bj) / 2 : 0;
      for (let x = -off; x < 1000; x += bl + bj) s += `<rect x="${(pad + x * sc).toFixed(1)}" y="${y.toFixed(1)}" width="${(bl * sc).toFixed(1)}" height="${(bh * sc).toFixed(1)}" fill="${M.front}" stroke="${M.edge}" stroke-width=".7"/>`; }
    s += `</g><rect x="${pad}" y="${pad}" width="${sz}" height="${sz}" fill="none" stroke="#1E2227" stroke-width="2" stroke-dasharray="6 4"/><text x="${pad + sz / 2}" y="${pad - 8}" text-anchor="middle" class="mu-dt">1,00 m</text><text x="${pad + sz / 2}" y="${pad + sz + 34}" text-anchor="middle" class="mu-dt2">${fx(perM2(p), 2)} szt./m²</text>`;
    return s + '</svg>';
  }
  function svgJoint(p, sys){
    const M = MAT[p.mat] || MAT.bk, m = MO[sys], W = 240, H = 220, sc = Math.min(180 / (2 * p.L + p.jv), 150 / (2 * p.H + p.jh * 3)) , jd = Math.max(sys === 'pianka' ? 3 : 2, p.jh * sc * 3);
    const bw = p.L * sc, bh = p.H * sc, jv = p.jv ? Math.max(2, p.jv * sc * 3) : 1.2, x0 = (W - (2 * bw + jv)) / 2, y0 = 22;
    let s = `<svg viewBox="0 0 ${W} ${H}" class="mu-m2" role="img" aria-label="Spoina: ${m.nm}">`;
    const blk = (x, y, w) => `<rect x="${x}" y="${y}" width="${w}" height="${bh}" fill="${M.front}" stroke="${M.edge}"/>`;
    // dolna warstwa
    s += blk(x0, y0 + bh + jd, bw) + blk(x0 + bw + jv, y0 + bh + jd, bw);
    if (p.jv) s += `<rect x="${x0 + bw}" y="${y0 + bh + jd}" width="${jv}" height="${bh}" fill="${m.col}"/>`;
    // spoina pozioma
    if (sys === 'pianka'){ s += `<rect x="${x0}" y="${y0 + bh}" width="${2 * bw + jv}" height="${jd}" fill="#F4F1EA"/>`; [.3, .7].forEach(f => { s += `<rect x="${x0}" y="${y0 + bh + jd * .15}" width="${2 * bw + jv}" height="${jd * .7}" fill="none"/>`; }); s += `<line x1="${x0}" x2="${x0 + 2 * bw + jv}" y1="${y0 + bh + jd / 2}" y2="${y0 + bh + jd / 2}" stroke="${m.col}" stroke-width="${jd}" stroke-dasharray="14 6" stroke-linecap="round"/>`; }
    else s += `<rect x="${x0}" y="${y0 + bh}" width="${2 * bw + jv}" height="${jd}" fill="${m.col}" stroke="rgba(0,0,0,.25)" stroke-width=".6"/>`;
    // górna warstwa przesunięta
    s += blk(x0 + bw / 2, y0, bw) + `<rect x="${x0}" y="${y0}" width="${bw / 2 - (p.jv ? jv : 0)}" height="${bh}" fill="${M.front}" stroke="${M.edge}"/>` + `<rect x="${x0 + 1.5 * bw + jv}" y="${y0}" width="${bw / 2}" height="${bh}" fill="${M.front}" stroke="${M.edge}"/>`;
    if (p.jv) s += `<rect x="${x0 + bw / 2 - jv}" y="${y0}" width="${jv}" height="${bh}" fill="${m.col}"/><rect x="${x0 + 1.5 * bw}" y="${y0}" width="${jv}" height="${bh}" fill="${m.col}"/>`;
    s += `<line x1="${x0 + 2 * bw + jv + 8}" x2="${x0 + 2 * bw + jv + 8}" y1="${y0 + bh}" y2="${y0 + bh + jd}" class="mu-dl"/>`;
    s += `<text x="${W / 2}" y="${y0 + 2 * bh + jd + 26}" text-anchor="middle" class="mu-dt2">spoina ${p.jh} mm</text><text x="${W / 2}" y="${y0 + 2 * bh + jd + 44}" text-anchor="middle" class="mu-dt">${p.jv ? 'pionowa ' + p.jv + ' mm' : 'pionowa: pióro-wpust, bez spoiwa'}</text>`;
    return s + '</svg>';
  }
  // wykresy: na wąskim ekranie (telefon) etykieta nad paskiem, rysunek w skali 1:1 do szerokości kontenera
  const NAR = 560, clip = (t, n) => t.length > n ? t.slice(0, Math.max(1, n - 1)).trimEnd() + '…' : t;
  const palW = n => n === 1 ? 'paleta' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? 'palety' : 'palet';
  function svgArea(r, tw){
    const rows = [['brutto (długość × wysokość)', r.gross, 'b']];
    if (r.kol) rows.push(['+ ścianki kolankowe', r.kol, 'p']); if (r.szc) rows.push([r.RG && r.RG.nG ? '+ szczyty' : '+ ściany nad kolankowymi', r.szc, 'p']); if (r.att) rows.push(['+ attyka', r.att, 'p']);
    rows.push(['− otwory', -r.otw, 'm']); if (r.nad) rows.push(['− nadproża', -r.nad, 'm']); if (r.wien) rows.push([r.nW > 1 ? `− wieńce (${r.nW} × ${fx(r.wien / r.nW / r.g.len, 2)} m)` : '− wieniec', -r.wien, 'm']); if (r.cor) rows.push(['− podwójnie liczone naroża', -r.cor, 'm']);
    rows.push(['= mur netto', r.net, 'n']);
    const nar = tw > 0 && tw < NAR, W = nar ? Math.max(240, Math.round(tw)) : 760, L = nar ? 1 : 230, iw = nar ? W - 2 : 440, rh = nar ? 48 : 34;
    const mx = Math.max(r.gross + (r.kol || 0) + (r.szc || 0) + (r.att || 0), 1), X = v => L + v / mx * iw, H = (nar ? 8 : 20) + rows.length * rh;
    let s = `<svg viewBox="0 0 ${W} ${H}" class="mu-svg${nar ? ' nar' : ''}" role="img" aria-label="Bilans powierzchni muru">`, acc = 0;
    rows.forEach(([t, v, c], i) => { const y = (nar ? 4 : 12) + i * rh, b = c === 'n' ? ' b' : ''; let x0, x1;
      if (c === 'b' || c === 'n'){ x0 = 0; x1 = v; acc = c === 'b' ? v : acc; } else { x0 = v > 0 ? acc : acc + v; x1 = v > 0 ? acc + v : acc; acc += v; }
      const val = `${v < 0 ? '−' : ''}${fx(Math.abs(v), 2)} m²`, bar = (yb, hb) => `<rect x="${X(x0)}" y="${yb}" width="${Math.max(2, X(x1) - X(x0))}" height="${hb}" rx="4" class="mu-bar ${c}"/>`;
      s += nar ? `<text x="0" y="${y + 14}" class="mu-in${b}">${clip(t, Math.floor((W - 80) / 6.9))}</text><text x="${W - 2}" y="${y + 14}" text-anchor="end" class="mu-in${b}">${val}</text>${bar(y + 22, 18)}`
        : `<text x="${L - 10}" y="${y + 16}" text-anchor="end" class="mu-in${b}">${t}</text>${bar(y + 2, 20)}<text x="${X(Math.max(x0, x1)) + 8}" y="${y + 16}" class="mu-in${b}">${val}</text>`; });
    return s + '</svg>';
  }
  const palIco = (px, py, M) => `<g transform="translate(${px} ${py})"><path d="M0 44 L14 52 L28 44 L14 36Z" fill="#B88A55"/><path d="M0 44 L0 48 L14 56 L14 52Z" fill="#8E6A3F"/><path d="M28 44 L28 48 L14 56 L14 52Z" fill="#A27A49"/>
          <path d="M2 18 L14 25 L26 18 L14 11Z" fill="${M.top}" stroke="${M.edge}" stroke-width=".6"/><path d="M2 18 L2 43 L14 50 L14 25Z" fill="${M.front}" stroke="${M.edge}" stroke-width=".6"/><path d="M26 18 L26 43 L14 50 L14 25Z" fill="${M.end}" stroke="${M.edge}" stroke-width=".6"/>
          <path d="M2 18 L14 25 L26 18" fill="none" stroke="rgba(255,255,255,.6)" stroke-width="1"/></g>`;
  function svgPallets(R, tw){
    const on = (R.PB || []).filter(x => x.pal), nar = tw > 0 && tw < NAR, gl = x => x.ks.map(k => GR[k].sh).join(' + ');
    if (!nar){ const W = 760, rowH = 92, H = 24 + on.length * rowH;
      let s = `<svg viewBox="0 0 ${W} ${H}" class="mu-svg" role="img" aria-label="Palety do zamówienia">`;
      on.forEach((x, i) => { const y = 14 + i * rowH, M = MAT[x.p.mat] || MAT.bk, n = x.pal, show = Math.min(n, 16);
        s += `<text x="0" y="${y + 14}" class="mu-in b">${gl(x)}</text><text x="0" y="${y + 32}" class="mu-ax">${esc(x.p.nm)}</text><text x="0" y="${y + 50}" class="mu-in">${n} ${palW(n)}${x.mass ? ` · ok. ${fx(x.mass, 1)} t` : ''}</text>`;
        for (let j = 0; j < show; j++) s += palIco(220 + j * 32, y + 10, M);
        if (n > show) s += `<text x="${220 + show * 32 + 6}" y="${y + 44}" class="mu-in b">+ ${n - show}</text>`; });
      return s + '</svg>'; }
    // telefon: opis nad ikonami, ikony zawijane w maks. 2 rzędy
    const W = Math.max(240, Math.round(tw)), per = Math.max(1, Math.floor((W - 4) / 32)), blocks = on.map(x => { const n = x.pal, cap = per * 2, show = n > cap ? cap - 1 : n; return {x, n, show, rows: Math.max(1, Math.ceil((show + (n > show ? 1 : 0)) / per))}; });
    const H = blocks.reduce((a, b) => a + 66 + b.rows * 46 + 14, 0);
    let s = `<svg viewBox="0 0 ${W} ${H}" class="mu-svg nar" role="img" aria-label="Palety do zamówienia">`, y = 4;
    blocks.forEach(({x, n, show, rows}) => { const M = MAT[x.p.mat] || MAT.bk;
      s += `<text x="0" y="${y + 14}" class="mu-in b">${esc(clip(gl(x), Math.floor(W / 7.2)))}</text><text x="0" y="${y + 32}" class="mu-ax">${esc(clip(x.p.nm, Math.floor(W / 6.7)))}</text><text x="0" y="${y + 50}" class="mu-in">${n} ${palW(n)}${x.mass ? ` · ok. ${fx(x.mass, 1)} t` : ''}</text>`;
      for (let j = 0; j < show; j++) s += palIco((j % per) * 32, y + 52 + Math.floor(j / per) * 46, M);
      if (n > show){ const j = show; s += `<text x="${(j % per) * 32 + 2}" y="${y + 52 + Math.floor(j / per) * 46 + 40}" class="mu-in b">+${n - show}</text>`; }
      y += 66 + rows * 46 + 14; });
    return s + '</svg>';
  }
  function svgCmp(S, k, tw){
    const r0 = calcGroup(S, k); if (!r0.on) return '';
    const cands = PROD.filter(p => Math.abs(p.T - r0.p.T) <= 70).map(p => { const SS = {...S, g: {...S.g, [k]: {...S.g[k], prod: p.id}}}; return {p, r: calcGroup(SS, k)}; }).sort((a, b) => a.r.pcs - b.r.pcs);
    const mx = Math.max(...cands.map(c => c.r.pcs), 1), nar = tw > 0 && tw < NAR, pm = c => `${c.r.pal != null ? c.r.pal + ' pal.' : '–'}${c.r.mass != null ? ' · ' + fx(c.r.mass, 1) + ' t' : ''}`, nmOf = c => `${c.p.br} ${c.p.nm.replace(c.p.br, '').trim()}`;
    if (nar){ const W = Math.max(240, Math.round(tw)), rowH = 58, iw = W - 64, H = 26 + cands.length * rowH;
      let s = `<svg viewBox="0 0 ${W} ${H}" class="mu-svg nar" role="img" aria-label="Porównanie elementów murowych"><text x="0" y="14" class="mu-ax">sztuk do zamówienia · palet · masa</text>`;
      cands.forEach((c, i) => { const y = 22 + i * rowH, me = c.p.id === r0.p.id, M = MAT[c.p.mat], b = me ? ' b' : '', bw = Math.max(3, c.r.pcs / mx * iw);
        s += `<g class="mu-ck" data-prod="${c.p.id}"><rect x="0" y="${y}" width="${W}" height="${rowH - 4}" rx="8" fill="${me ? 'rgba(181,71,10,.08)' : 'transparent'}"/><text x="6" y="${y + 17}" class="mu-in${b}">${esc(clip(nmOf(c), Math.floor((W - 12) / 6.9)))}</text>
          <rect x="6" y="${y + 24}" width="${bw}" height="12" rx="3" fill="${M.front}" stroke="${M.edge}"/><text x="${6 + bw + 6}" y="${y + 35}" class="mu-in${b}">${fi(c.r.pcs)}</text>
          <text x="6" y="${y + 50}" class="mu-ax">${pm(c)}</text><title>${esc(c.p.nm)}: dotknij, żeby wybrać</title></g>`; });
      return s + '</svg>'; }
    const W = 760, L = 250, iw = 360, rowH = 30, H = 30 + cands.length * rowH, X = v => L + v / mx * iw;
    let s = `<svg viewBox="0 0 ${W} ${H}" class="mu-svg" role="img" aria-label="Porównanie elementów murowych"><text x="${L}" y="14" class="mu-ax">sztuk do zamówienia</text><text x="${W - 4}" y="14" text-anchor="end" class="mu-ax">palet · masa</text>`;
    cands.forEach((c, i) => { const y = 24 + i * rowH, me = c.p.id === r0.p.id, M = MAT[c.p.mat];
      s += `<g class="mu-ck" data-prod="${c.p.id}"><rect x="0" y="${y - 2}" width="${W}" height="${rowH - 2}" rx="6" fill="${me ? 'rgba(181,71,10,.08)' : 'transparent'}"/><text x="${L - 10}" y="${y + 17}" text-anchor="end" class="mu-in${me ? ' b' : ''}">${nmOf(c)}</text>
        <rect x="${L}" y="${y + 5}" width="${Math.max(3, X(c.r.pcs) - L)}" height="16" rx="4" fill="${M.front}" stroke="${M.edge}"/><text x="${X(c.r.pcs) + 6}" y="${y + 17}" class="mu-in${me ? ' b' : ''}">${fi(c.r.pcs)}</text>
        <text x="${W - 4}" y="${y + 17}" text-anchor="end" class="mu-ax">${pm(c)}</text><title>${c.p.nm}: kliknij, żeby wybrać</title></g>`; });
    return s + '</svg>';
  }

  /* ---------- interfejs ---------- */
  function html(t, pfx, inArt){
    const Hh = inArt ? 'h3' : 'h2';
    const MUIMG = {parter:'DATAURI',pietro:'DATAURI',ldom:'DATAURI',mono:'DATAURI',silk:'DATAURI',garaz:'DATAURI',fund:'DATAURI',dzial:'DATAURI'};
    const card = ([k, P]) => { const r = calc(P), main = r.G.find(x => x.on); return `<button type="button" class="zb-case mu-case" data-pre="${k}">${MUIMG[k] ? `<span class="mu-cimg ph"><img src="${MUIMG[k]}" alt="" loading="lazy" decoding="async" width="640" height="357"></span>` : `<span class="mu-cimg">${svgBlock(main.p, {W: 220, H: 130, noDim: true, pad: 16, k: 'c' + k})}</span>`}<span class="zb-ct">${esc(P.t)}</span><span class="zb-cd">${esc(P.d)}</span><span class="zb-cr ok"><b>${fi(r.pcs)} szt.</b> ${r.pal ? r.pal + (r.pal === 1 ? ' paleta' : r.pal % 10 >= 2 && r.pal % 10 <= 4 && (r.pal % 100 < 12 || r.pal % 100 > 14) ? ' palety' : ' palet') : ''}</span></button>`; };
    const prB = ['parter', 'pietro', 'ldom', 'mono', 'silk', 'garaz'].filter(k => PRE[k]).map(k => card([k, PRE[k]])).join('');
    const prS = ['fund', 'dzial'].filter(k => PRE[k]).map(k => card([k, PRE[k]])).join('');
    return `<div class="calc rs mu${inArt ? ' in-art' : ''}" id="${inArt ? 'art-calc' : 't-bloczki'}" data-calc="bloczki"><div class="calc-h">${tTile(tKey(t))}<div>${inArt ? '<p class="calc-eyebrow">Policz to sam</p>' : ''}<${Hh}>${esc(t.name)}</${Hh}></div></div>
      <p class="desc">${esc(t.desc)}</p>
      <div class="rs-sec"><p class="rs-h">Przykładowe budynki – kliknij, żeby przeliczyć wszystkie ściany</p><div class="zb-cases mu-cases">${prB}</div></div>
      <div class="rs-sec"><p class="rs-h">Tylko wybrane ściany – kliknij, żeby przeliczyć</p><div class="zb-cases mu-cases">${prS}</div></div>
      <p class="wi-hint"><b>Na żywo:</b> wybierz element z listy, przesuwaj suwaki, dodawaj okna i drzwi i ustawiaj je na rysunku ściany – liczba elementów, palety i porównanie zmieniają się od razu.</p>
      <div class="rs-sec"><p class="rs-h">1. Ściany</p><div class="mu-tabs" role="tablist"></div><div class="mu-grp"></div></div>
      <div class="rs-sec"><p class="rs-h">2. Dach, poddasze, ścianki kolankowe i szczyty</p><div class="mu-dach"></div></div>
      <div class="rs-sec mu-ed"><p class="rs-h">3. Otwory: okna, drzwi, bramy – ustaw je na ścianie</p>
        <p class="mu-tip"><b>Na rysunku:</b> przeciągnij otwór, żeby go przesunąć. Uchwytem z prawej zmienisz szerokość, uchwytem u góry wysokość. Dwuklik na murze dodaje okno. Z klawiatury: Tab wybiera otwór, strzałki przesuwają go o 5 cm (z Shift o 50 cm), Delete usuwa.</p>
        <div class="mu-wtb"></div>
        <figure class="rs-fig mu-wfig"><figcaption><b>Rozwinięcie ściany: układ elementów i otworów</b><span>Wiązanie z przesunięciem o pół elementu, otwory z nadprożami, wieniec i szczyty. Pomarańczowe elementy trzeba dociąć. Niebieskie przerywane linie to narożniki – kliknij nazwę ściany, żeby ją powiększyć.</span></figcaption><div class="mu-wallw"><div class="mu-wall-in"></div></div></figure>
        <div class="mu-sel" aria-live="polite"></div><div class="mu-opw"></div>
        <p class="rs-h mu-oph">Lista otworów</p><div class="mu-ops"></div><div class="mu-addb"><button type="button" data-add="okno">+ okno</button><button type="button" data-add="balk">+ drzwi balkonowe</button><button type="button" data-add="drzwi">+ drzwi</button><button type="button" data-add="brama">+ brama</button></div></div>
      <div class="rs-sec"><p class="rs-h">4. Odliczenia i zapas</p><div class="mu-odl"></div></div>
      <div class="rs-sec"><p class="rs-h">5. Wynik</p><div class="rs-kpis mu-kpis" aria-live="polite"></div><div class="mu-sum"></div><div class="mu-warn"></div>
        <figure class="rs-fig"><figcaption><b>Element i 1 m² muru</b><span>Rysunek zmienia się z wybranym elementem: proporcje, materiał, profil pióro-wpust, drążenia. Kwadrat pokazuje, ile elementów wchodzi w metr kwadratowy ściany.</span></figcaption><div class="mu-hero"></div></figure>
        <figure class="rs-fig"><figcaption><b>Skąd się bierze powierzchnia muru</b><span>Od powierzchni brutto odejmowane są otwory, nadproża, wieniec i podwójnie liczone naroża.</span></figcaption><div class="mu-area zb-ov"></div></figure>
        <figure class="rs-fig"><figcaption><b>Nadproża do zamówienia</b><span>Najkrótsze nadproże = szerokość otworu + 2 × oparcie. Długość dobierz z szeregu producenta systemu (zwykle następna dostępna).</span></figcaption><div class="mu-nadl"></div></figure>
        <figure class="rs-fig"><figcaption><b>Palety na budowę</b><span>Każda ikona to jedna paleta. Masa pomaga zaplanować transport i rozładunek dźwigiem (HDS).</span></figcaption><div class="mu-pal zb-ov"></div></figure>
        <figure class="rs-fig"><figcaption><b>Porównanie elementów o podobnej grubości</b><span>Ta sama ściana zbudowana z różnych elementów. Kliknij wiersz, żeby wybrać element.</span></figcaption><div class="mu-cmp zb-ov"></div></figure>
        <details class="rs-how"><summary>Założenia i metoda obliczeń</summary><ul>
          <li>Liczba sztuk = powierzchnia muru netto × sztuk na m² × (1 + zapas). Sztuki na m² według producenta; gdy brak danych – z wymiarów lica i grubości spoin: 1 / [(L + spoina pionowa)·(H + spoina pozioma)].</li>
          <li>Mur nad stropem (ściany zewnętrzne) z geometrii dachu: ścianki kolankowe = obwód ścian okapowych × wysokość ścianki; szczyt = szerokość × wysokość ścianki + trójkąt (szerokość × szerokość/2 × tg α / 2), przy naczółku bez górnego trójkąta naczółka; dach jednospadowy – ściany boczne jako trapezy, ściana wyższa podniesiona o szerokość × tg α; dach czterospadowy – tylko ścianki kolankowe; dach płaski – attyka. Wymiary w osiach ścian, bez grubości warstw dachu.</li>
          <li>Powierzchnia netto = długość × wysokość + mur nad stropem − otwory − nadproża (szerokość otworu + 2 × oparcie, wysokość nadproża; oparcie i wysokość według rodzaju nadproża z kart producentów: Porotherm 23,8 – 23,8 cm i 12,5–25 cm, L19 – 19 cm i 10–14 cm, Ytong YF – 12,4 cm i 20–25 cm, YN/TNN – 24,9 cm i 20–25 cm, H+H Gold+ – 12,5 cm i 11,5 cm) − wieńce w ścianach nośnych (gdy wysokość ściany podana do wierzchu wieńca; tyle wieńców, ile kondygnacji w tej wysokości; ścianki działowe wieńca nie mają) − naroża liczone podwójnie (gdy długość mierzona po obwodzie zewnętrznym: liczba naroży × grubość × wysokość).</li>
          <li>Zaprawa: według zużycia podanego przez producenta danego systemu (cienkowarstwowa – na m³ muru, tradycyjna – na m² ściany, klej-pianka – m² ściany z jednej puszki). Palety i masa – z danych producenta.</li>
          <li>Rysunek ściany: otwory, których nie przesunięto, rozmieszczane są automatycznie w wolnych miejscach (z dala od naroży i od siebie o oparcie nadproży). Przesunięte otwory zostają tam, gdzie je ustawisz; położenie nie zmienia powierzchni muru, ale zmienia liczbę docinek widoczną na rysunku. Kontrola sprawdza kolizje otworów, otwór na narożniku, oparcie nadproża przy narożniku i między otworami, filarki węższe niż jeden element oraz miejsce na nadproże pod wieńcem. Wiązanie z przesunięciem o pół elementu. Rzeczywisty układ wynika z rysunków projektu; producenci ceramiki oferują też elementy połówkowe, narożne i uzupełniające, które zmniejszają liczbę docinek.</li>
          <li>Ceny nie są wpisane domyślnie – podaj cenę z oferty składu, a kalkulator policzy koszt.</li><li>Dane produktów (wymiary, sztuki na m² i na paletę, masa, zużycie zaprawy) z kart technicznych i cenników producentów, październik 2026: ${SRC.map(([n, u]) => `<a href="${u}" target="_blank" rel="noopener">${n}</a>`).join(', ')}. Wydajność zaprawy tradycyjnej: ok. 14,5 l z worka 25 kg. Gdy producent nie podaje zużycia spoiwa, kalkulator szacuje je z grubości spoin.</li></ul></details>
      </div>
      <p class="note">${inArt ? `<a href="#narzedzia/k-bloczki">Otwórz kalkulator na osobnej stronie →</a>` : t.more && artBy(t.more[0]) ? `Więcej: <a href="#a-${t.more[0]}">${esc(t.more[1])}</a>.` : ''}</p></div>`;
  }

  function wire(el){
    const clone = o => JSON.parse(JSON.stringify(o));
    let S = clone(PRE.parter); delete S.t; delete S.d; S.price = {}; let tab = 'z', sel = null, flt = 'all', snap = 'cm5', drag = null, lastW = null, zoom = 1;
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
        + card('nad.on', 'Odlicz nadproża', (() => { const N = nadOf(S), typ = S.nad.typ || 'own', NA = k2 => nadOf({...S, nad: {...S.nad, typ: 'auto'}}, k2); return `<div class="field"><label>Rodzaj nadproża</label><select data-nad="typ">${Object.entries(NAD).map(([k, v]) => `<option value="${k}"${typ === k ? ' selected' : ''}>${v.nm}${k === 'auto' ? ' (' + NAD[NA('z').k].nm + (S.g.d.on && NA('d').k !== NA('z').k ? '; działowe: ' + NAD[NA('d').k].nm : '') + ')' : ''}</option>`).join('')}</select></div>`
          + (typ === 'own' ? fld('nad.h', 'Wysokość nadproża [m]', S.nad.h, 'min="0" step="0.01"') + fld('nad.op', 'Oparcie z każdej strony [m]', S.nad.op, 'min="0" step="0.005"') : `<p class="rs-wnote">Wysokość ${fx(N.h * 100, 1)} cm, ${N.d}. Dokładne wymiary i długości z karty nadproża.</p>`); })(), S.nad.on)
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
        ${D.plan === 'L' && !(D.A > D.B) ? '<p class="rs-wnote warn">Rzut L wymaga, żeby skrzydło główne A było dłuższe od szerokości B – przy tych wymiarach kalkulator liczy budynek jak prostokąt.</p>' : ''}${D.t === 'mono' && D.plan === 'L' && D.A > D.B ? '<p class="rs-wnote warn">Dach jednospadowy na rzucie L: kalkulator liczy tu tylko ścianki kolankowe na całym obwodzie. Trójkątne części ścian bocznych i wyższą ścianę dodaj ręcznie (zwiększ wysokość lub długość ścian), bo ich kształt zależy od układu połaci w projekcie.</p>' : ''}
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
        <div class="mu-snap" role="group" aria-label="Przyciąganie"><span>Przyciąganie:</span>${[['cm5', 'co 5 cm'], ['mod', G ? `do modułu elementu (${fx(G.mod * 100, 1)} cm, warstwa ${fx(G.rh * 100, 1)} cm)` : 'do modułu elementu'], ['off', 'wyłączone']].map(([k, n]) => `<button type="button" data-snap="${k}" class="${snap === k ? 'on' : ''}">${n}</button>`).join('')}<button type="button" class="mu-ra" data-act="auto">rozmieść równomiernie</button></div>${lastW && lastW.narrow ? `<div class="mu-zm" role="group" aria-label="Powiększenie rysunku"><span>Rysunek:</span>${[1, 2, 3].map(z => `<button type="button" data-zoom="${z}" class="${zoom === z ? 'on' : ''}" aria-pressed="${zoom === z}">${z === 1 ? 'cała ściana' : '× ' + z}</button>`).join('')}${zoom > 1 ? '<small>przesuń rysunek palcem w bok</small>' : ''}</div>` : ''}`; };
    const renderSel = cur => { const it = sel && itemOf(sel.r, sel.i), box = $('.mu-sel');
      if (!it){ box.innerHTML = cur.ops.length ? '<p class="rs-wnote mu-selh">Kliknij otwór na rysunku, żeby ustawić go dokładnie: ściana, odległość od narożnika, parapet, rozmiar.</p>' : ''; return; }
      const L = lastW.L, {sg, lb, rb} = neigh(L, it, cur.g.len), base = flBase(it, L, cur.g.h), o = it.o, T = OTY[o.t] || OTY.okno, st = it.st;
      const nf = (k, l, v, a) => `<label class="mu-sf"><span>${l}</span><input type="number" inputmode="decimal" data-sel="${k}" value="${+v.toFixed(3)}" ${a || 'step="0.05" min="0"'}></label>`;
      box.innerHTML = `<div class="mu-selc${st ? ' ' + st : ''}"><div class="mu-selt"><b>${T.nm[0].toUpperCase() + T.nm.slice(1)} ${fx(it.w * 100, 0)} × ${fx(it.h * 100, 0)} cm</b>${Math.round(o.n) > 1 ? `<small>jeden z ${Math.round(o.n)} w tym wierszu – zmiana rozmiaru lub rodzaju wydzieli go do osobnego wiersza</small>` : ''}</div>
        <div class="mu-sels"><label class="mu-sf"><span>rodzaj</span><select data-sel="t">${Object.entries(OTY).map(([k, v]) => `<option value="${k}"${o.t === k ? ' selected' : ''}>${v.nm}</option>`).join('')}</select></label>
        ${L.segs.length > 1 ? `<label class="mu-sf"><span>ściana</span><select data-sel="seg">${L.segs.map(s => `<option value="${s.i}"${s === sg ? ' selected' : ''}>${esc(s.nm)}</option>`).join('')}</select></label>` : ''}
        ${nf('x', L.segs.length > 1 ? 'od narożnika [m]' : 'od początku [m]', it.x0 - sg.s)}${nf('sill', it.y0 >= cur.g.h - 1e-6 && L.G.roofOn ? 'nad stropem [m]' : 'parapet [m]', it.y0 - base)}${nf('w', 'szerokość [m]', it.w, 'step="0.05" min="0.3"')}${nf('h', 'wysokość [m]', it.h, 'step="0.05" min="0.3"')}</div>
        <div class="mu-szs"><span>gotowe rozmiary:</span>${T.sz.map(([w, h, n]) => `<button type="button" data-sz="${w},${h}" title="${esc(n || '')}" class="${Math.abs(w - it.w) < .005 && Math.abs(h - it.h) < .005 ? 'on' : ''}">${fx(w * 100, 1).replace(',0', '')}×${fx(h * 100, 1).replace(',0', '')}${n ? `<small>${esc(n)}</small>` : ''}</button>`).join('')}</div>
        <p class="mu-seli">Filarek z lewej <b>${fx(Math.max(0, it.x0 - lb) * 100, 0)} cm</b> · z prawej <b>${fx(Math.max(0, rb - it.x1) * 100, 0)} cm</b>${S.nad.on ? ` · nadproże min. <b>${fx(it.w + 2 * L.N.op(it.w), 2)} m</b> (oparcie ${fx(L.N.op(it.w) * 100, 1)} cm)` : ''} · powierzchnia ${fx(it.w * it.h, 2)} m²</p>
        ${it.msg.length ? `<ul class="mu-selm">${it.msg.map(m => `<li>${esc(m)}</li>`).join('')}</ul>` : ''}
        <div class="mu-sela"><button type="button" data-act="center">wyśrodkuj na ścianie</button><button type="button" data-act="dup">powiel obok</button><button type="button" data-act="del">usuń</button><button type="button" data-act="desel">gotowe</button></div></div>`; };
    const renderBad = (cur, bad) => { $('.mu-opw').innerHTML = bad.length ? `<div class="rs-v warn"><p class="zb-p warn"><b>${bad.length} ${pl(bad.length, 'otwór wymaga', 'otwory wymagają', 'otworów wymaga')} sprawdzenia</b> – kliknij, żeby zaznaczyć na rysunku:</p><ul class="mu-badl">${bad.map(b => { const sg = lastW.L.segs.find(q => b.x0 >= q.s - 1e-6 && b.x0 < q.s + q.len) || lastW.L.segs[0]; return `<li><button type="button" data-pick="${b.ri},${b.ii}" class="${b.st}">${esc((OTY[b.t] || OTY.okno).nm)} ${fx(b.w * 100, 0)}×${fx(b.h * 100, 0)} · ${esc(sg.nm)}: ${esc(b.msg.join('; '))}</button></li>`; }).join('')}</ul></div>` : ''; };
    const drawWall = cur => { cur = cur || curR(); if (!cur.on) return; const w = svgWall(S, cur, sel, views[tab], $('.mu-wallw').clientWidth, zoom); lastW = {...w, gh: cur.g.h};
      if (sel && !itemOf(sel.r, sel.i)) sel = null;
      $('.mu-wall-in').innerHTML = w.svg; renderTb(cur); renderSel(cur); renderBad(cur, w.bad); return w; };
    const nadList = R => { if (!S.nad.on) return '<p class="rs-wnote">Nadproża nie są odliczane – włącz „Odlicz nadproża” w punkcie 4.</p>';
      const rows = {}, typ = {}; R.G.filter(x => x.on).forEach(x => { const NN = nadOf(S, x.k); x.ops.forEach(o => { const l = +(o.w + 2 * NN.op(o.w)).toFixed(3), key = x.k + '|' + l; typ[x.k] = NN; rows[key] = rows[key] || {k: x.k, l, n: 0, w: o.w}; rows[key].n += Math.round(o.n); }); });
      const tl = Object.entries(typ), same = tl.every(([, N]) => N.k === tl[0][1].k);
      const list = Object.values(rows).sort((a, b) => a.k.localeCompare(b.k) || a.l - b.l); if (!list.length) return '<p class="rs-wnote">Brak otworów.</p>';
      return `<p class="rs-wnote">${same ? `Rodzaj: ${esc(tl[0][1].nm)}${tl[0][1].d ? ' – ' + tl[0][1].d : ''}.` : 'Rodzaj: ' + tl.map(([k, N]) => `${GR[k].sh} – ${esc(N.nm)}`).join('; ') + '.'}</p><table class="mu-nadt"><thead><tr><th>ściany</th><th>otwór</th><th>nadproże min.</th><th>sztuk</th></tr></thead><tbody>${list.map(x => `<tr><td>${GR[x.k].sh}</td><td>${fx(x.w * 100, 0)} cm</td><td><b>${fx(x.l, 2)} m</b></td><td>${x.n}</td></tr>`).join('')}</tbody></table>`; };
    const run = () => {
      const R = calc(S), cur = R.G.find(x => x.k === tab), K = (l, v, u, s, st) => `<div class="rs-kpi ${st || ''}"><span class="l">${l}</span><span class="v">${v}${u ? `<small>${u}</small>` : ''}</span><span class="s">${s}</span></div>`;
      const morts = {}; R.G.filter(x => x.on && x.mort).forEach(x => { const k = x.mort.ty + '|' + x.mort.u + '|' + (x.mort.bu || ''); morts[k] = morts[k] || {ty: x.mort.ty, u: x.mort.u, q: 0, bu: x.mort.bu}; morts[k].q += x.mort.q || 0; }); Object.values(morts).forEach(m => { m.bags = bagsOf(m.ty, m.u, m.q); });
      const mtxt = Object.values(morts).map(m => `${m.bags ? fi(m.bags) + ' ' + m.bu : 'ok. ' + fx(m.q, 0) + ' ' + m.u} – ${MO[m.ty].nm}`).join('; '), trips = R.mass ? Math.max(1, Math.ceil(R.mass / 20)) : 0;
      $('.mu-kpis').innerHTML = K('Elementów razem', fi(R.pcs), 'szt.', `${fx(R.net, 1)} m² muru netto, z zapasem ${S.zap}%`, 'ok')
        + K('Palet', R.pal ? fi(R.pal) : '–', '', 'pełne palety każdego elementu (łącznie dla wszystkich ścian z tego elementu)', 'ok')
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
        $('.mu-area').innerHTML = svgArea(cur, $('.mu-area').clientWidth); $('.mu-cmp').innerHTML = svgCmp(S, tab, $('.mu-cmp').clientWidth); }
      else { lastW = null; ['.mu-hero', '.mu-wall-in', '.mu-area', '.mu-cmp'].forEach(q => { $(q).innerHTML = `<p class="rs-wnote">Grupa „${GR[tab].nm}” jest wyłączona.</p>`; }); ['.mu-wtb', '.mu-sel', '.mu-opw'].forEach(q => { $(q).innerHTML = ''; }); }
      $('.mu-nadl').innerHTML = nadList(R);
      $('.mu-pal').innerHTML = svgPallets(R, $('.mu-pal').clientWidth);
      $$('.mu-case').forEach(b => b.classList.remove('on'));
      const zl = $('.mu-tabs [data-tab="z"] small'); if (zl) zl.textContent = S.g.z.on ? `${fx(S.g.z.len, 1)} m · ${prodBy(S.g.z.prod).nm}` : 'wyłączone';
      if (tab === 'z' && S.dach.auto){ const li = $('input[type="number"][data-f="len"]'); if (li) li.value = S.g.z.len; }
    };
    // na wąskim ekranie ściany zewnętrzne pokazujemy po jednej (pierwsza ściana obwodu), na szerokim – całe rozwinięcie
    const full = () => { if (el.clientWidth && el.clientWidth < 720 && views.z == null) views.z = 0; renderGroup(); renderDach(); renderOps(); renderOdl(); run(); };
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
      if (t.dataset.nad){ S.nad.typ = t.value; renderOdl(); run(); return; }
      if (t.dataset.o){ const i = +t.closest('[data-oi]').dataset.oi, o = S.op[i], k = t.dataset.o;
        if (k === 't'){ const old = sillOf(o); o.t = t.value; const d = sillOf(o) - old; if (d && o.at) o.at.forEach(a => { if (a) a.y = Math.max(0, +(a.y + d).toFixed(3)); }); }
        else if (k === 'g'){ if (o.g !== t.value) delete o.at; o.g = t.value; renderOps(); }
        else if (k === 'sill'){ const old = sillOf(o); o.sill = t.value === '' ? null : num(t.value); const d = sillOf(o) - old; if (o.at) o.at.forEach(a => { if (a) a.y = Math.max(0, a.y + d); }); }
        else o[k] = k === 'n' ? Math.max(0, Math.round(num(t.value))) : num(t.value);
        soon(); }
    });
    // pola zaznaczonego otworu – zatwierdzane po zmianie (Enter, wyjście z pola, strzałki pola)
    el.addEventListener('change', e => { const t = e.target;
      if (t.dataset.o === 'g' || t.dataset.o === 't') run();
      // zmniejszona liczba sztuk: nadmiarowe ręczne położenia usuwamy dopiero po zatwierdzeniu niepustej wartości
      if (t.dataset.o === 'n' && t.value !== ''){ const o = S.op[+t.closest('[data-oi]').dataset.oi]; if (o){ t.value = o.n; if (o.at) o.at.length = Math.min(o.at.length, o.n); } }
      if (!t.dataset.sel || !sel) return; const k = t.dataset.sel, cur = curR(); if (!cur.on || !lastW) return;
      if (['w', 'h', 't'].includes(k)) sel = split(sel.r, sel.i);
      freeze(tab); const o = S.op[sel.r], it = itemOf(sel.r, sel.i) || {x0: o.at[sel.i].x, y0: o.at[sel.i].y, w: o.w}, a = o.at[sel.i], L = lastW.L, v = num(t.value);
      const sg = L.segs.find(q => it.x0 >= q.s - 1e-6 && it.x0 < q.s + q.len) || L.segs[0];
      if (k === 't'){ const old = sillOf(o); o.t = t.value; if (o.sill == null || o.sill === '') a.y = Math.max(0, +(a.y + sillOf(o) - old).toFixed(3)); }
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
      // uchwyt rozmiaru przy wierszu „n sztuk”: wydzielenie otworu dopiero przy pierwszym ruchu (samo kliknięcie nic nie zmienia)
      const needSplit = !!hd && Math.round(S.op[r].n) > 1;
      freeze(tab); sel = {r, i}; const P = svgPt(e), o = S.op[r], a = o.at[i], it0 = itemOf(r, i); if (!P || !a) return;
      drag = {r, i, mode: hd ? hd.dataset.hd : 'move', P0: P, x0: it0 ? it0.x0 : a.x, y0: it0 ? it0.y0 : a.y, w: o.w, h: o.h, moved: false, id: e.pointerId, G, needSplit};
      try { box.setPointerCapture(e.pointerId); } catch (_) {}
      e.preventDefault(); drawWall(); selRow(); });
    box.addEventListener('pointermove', e => { if (!drag || e.pointerId !== drag.id) return; const P = svgPt(e); if (!P) return;
      const dx = P.x - drag.P0.x, dy = P.y - drag.P0.y; if (!drag.moved && Math.hypot(dx, dy) * (lastW ? lastW.sc : 50) < 4) return; drag.moved = true; box.classList.add('dragging');
      if (drag.needSplit){ drag.needSplit = false; ({r: drag.r, i: drag.i} = split(drag.r, drag.i)); sel = {r: drag.r, i: drag.i}; }
      const o = S.op[drag.r], G = drag.G, gl = G.r.g.len, ym = lastW ? lastW.L.G.ymax : G.r.g.h;
      if (drag.mode === 'move') o.at[drag.i] = {x: Math.max(0, Math.min(gl - Math.min(o.w, gl), sx(drag.x0 + dx, G))), y: Math.max(0, Math.min(ym - o.h, sy(drag.y0 + dy, G)))};
      else if (drag.mode === 'w') o.w = Math.max(.3, sx(drag.w + dx, G));
      else o.h = Math.max(.3, sy(drag.h + dy, G));
      soonWall(); });
    const endDrag = e => { if (!drag || (e && e.pointerId !== drag.id)) return; const moved = drag.moved; drag = null; box.classList.remove('dragging'); try { box.releasePointerCapture(e.pointerId); } catch (_) {}
      if (moved){ const o = S.op[sel ? sel.r : -1], a = o && o.at && o.at[sel.i]; if (a){ a.x = +a.x.toFixed(3); a.y = +a.y.toFixed(3); } renderOps(); run();
        // widok jednej ściany podąża za otworem przeniesionym na sąsiednią ścianę
        const it = sel && itemOf(sel.r, sel.i); if (it && views[tab] != null){ const sg = lastW.L.segs.find(q => it.x0 >= q.s - 1e-6 && it.x0 < q.s + q.len); if (sg && sg.i !== views[tab]){ views[tab] = sg.i; drawWall(); } } }
      focusSel(); };
    box.addEventListener('pointerup', endDrag); box.addEventListener('pointercancel', endDrag);
    box.addEventListener('dblclick', e => { if (e.target.closest('.mu-op')) return; const cur = curR(), G = geom(); if (!cur.on || !G) return; const P = svgPt(e); if (!P || P.x < 0 || P.x > cur.g.len || P.y < 0 || P.y > lastW.L.G.ymax) return;
      freeze(tab); const [w, h] = [1.2, 1.5]; S.op.push({t: 'okno', w, h, n: 1, g: tab, at: [{x: sx(Math.max(0, P.x - w / 2), G), y: Math.max(0, sy(P.y - h / 2, G))}]}); sel = {r: S.op.length - 1, i: 0}; renderOps(); run(); focusSel(); });
    box.addEventListener('keydown', e => { const og = e.target.closest('.mu-op'); if (!og) return; const r = +og.dataset.r, i = +og.dataset.i, G = geom(); if (!G) return;
      const mv = {ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1]}[e.key];
      if (mv){ e.preventDefault(); freeze(tab); sel = {r, i}; const o = S.op[r], a = o.at[i], it = itemOf(r, i), gl = G.r.g.len, ym = lastW ? lastW.L.G.ymax : G.r.g.h, st = e.shiftKey ? .5 : snap === 'mod' ? (mv[0] ? G.mod : G.rh) : .05;
        if (it){ a.x = it.x0; a.y = it.y0; } a.x = Math.max(0, Math.min(gl - Math.min(o.w, gl), +(a.x + mv[0] * st).toFixed(3))); a.y = Math.max(0, Math.min(ym - o.h, +(a.y + mv[1] * st).toFixed(3))); run(); selRow(); focusSel(); return; }
      if (e.key === 'Delete' || e.key === 'Backspace'){ e.preventDefault(); delInst(r, i); renderOps(); run(); return; }
      if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); sel = {r, i}; drawWall(); selRow(); focusSel(); return; }
      if (e.key === 'Escape'){ sel = null; drawWall(); selRow(); } });
    el.addEventListener('click', e => {
      if (e.target.closest('.mu-op')) return;
      const pre = e.target.closest('[data-pre]'); if (pre){ const P = clone(PRE[pre.dataset.pre]); delete P.t; delete P.d; const price = S.price; S = {...P, price}; S.nad.typ = S.nad.typ || 'own'; tab = Object.keys(GR).find(k => S.g[k].on) || 'z'; sel = null; views.z = views.w = views.d = null; full(); pre.classList.add('on'); return; }
      const sg = e.target.closest('[data-seg]'); if (sg){ views[tab] = sg.dataset.seg === 'all' ? null : +sg.dataset.seg; drawWall(); return; }
      const sn = e.target.closest('[data-snap]'); if (sn){ snap = sn.dataset.snap; drawWall(); return; }
      const zb = e.target.closest('[data-zoom]'); if (zb){ zoom = +zb.dataset.zoom; drawWall(); const bx = $('.mu-wallw'), g = sel && $(`.mu-op[data-r="${sel.r}"][data-i="${sel.i}"]`); if (g){ const bb = g.getBoundingClientRect(), wb = bx.getBoundingClientRect(); bx.scrollLeft += bb.left - wb.left - wb.width / 2 + bb.width / 2; } else if (zoom === 1) bx.scrollLeft = 0; return; }
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
        if (a === 'dup'){ const gap = Math.max(.6, S.nad.on ? 2 * L.N.op(it.w) + .1 : .6); S.op.splice(sel.r + 1, 0, {t: o.t, w: it.w, h: it.h, n: 1, g: o.g, sill: o.sill, at: [{x: +(it.x1 + gap).toFixed(3), y: it.y0}]}); sel = {r: sel.r + 1, i: 0}; }
        renderOps(); run(); focusSel(); return; }
      const tb = e.target.closest('[data-tab]'); if (tb){ tab = tb.dataset.tab; sel = null; renderGroup(); renderOps(); run(); return; }
      const rf = e.target.closest('[data-roof]'); if (rf){ S.dach.t = rf.dataset.roof; renderDach(); run(); renderGroup(); return; }
      const pr = e.target.closest('[data-prod]'); if (pr){ S.g[tab].prod = pr.dataset.prod; if (!S.g[tab].on) S.g[tab].on = 1; renderGroup(); renderOdl(); run(); return; }
      const mo = e.target.closest('[data-mo]'); if (mo){ S.g[tab].mo = mo.dataset.mo; renderGroup(); run(); return; }
      const fl = e.target.closest('[data-flt]'); if (fl){ flt = fl.dataset.flt; renderGroup(); return; }
      const ad = e.target.closest('[data-add]'); if (ad){ const t = ad.dataset.add, d = (OTY[t].sz.find(q => t === 'okno' ? q[0] === 1.5 : t === 'drzwi' ? q[0] === 1.0 : true) || OTY[t].sz[0]);
        const g0 = t === 'drzwi' && tab !== 'z' ? tab : ['okno', 'balk', 'brama'].includes(t) ? 'z' : tab, g = S.g[g0].on && S.g[g0].len > 0 ? g0 : tab;
        if (S.op.some(o => o.g === g && o.at)) freeze(g);
        S.op.push({t, w: d[0], h: d[1], n: 1, g}); if (g !== tab){ tab = g; renderGroup(); }
        sel = {r: S.op.length - 1, i: 0}; renderOps(); run(); focusSel(); return; }
      const dl = e.target.closest('[data-del]'); if (dl){ S.op.splice(+dl.dataset.del, 1); sel = null; renderOps(); run(); return; }
      const row = e.target.closest('.mu-opr'); if (row && !e.target.closest('input,select,button')){ const r = +row.dataset.oi; if (S.op[r] && S.op[r].g === tab){ sel = {r, i: 0}; drawWall(); selRow(); } }
    });
    full();
    // obrót telefonu / zmiana szerokości okna: przerysuj wykresy w nowej szerokości
    if (window.ResizeObserver){ let lw = el.clientWidth, rT = 0; const ro = new ResizeObserver(() => { if (!el.isConnected){ ro.disconnect(); return; } const w = el.clientWidth; if (Math.abs(w - lw) < 8 || drag) return; lw = w; clearTimeout(rT); rT = setTimeout(run, 120); }); ro.observe(el); }
  }
  return {html, wire, calc, calcGroup, roofGeom, layout, checkOps, PROD, PRE, OTY, svgBlock, MUV};
})();