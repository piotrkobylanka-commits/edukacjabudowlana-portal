/*!
 * EdukacjaBudowlana – dział „Normy i przepisy” (wersja 2026-10-30)
 * 1) Scala wpisy z pola „norms” artykułów w akty prawne i rodziny norm.
 * 2) Na bieżąco sprawdza status polskich aktów w API Sejmu (ISAP / ELI),
 *    a aktów UE przez normy-eu.php (EUR-Lex). Wynik trzyma 12 h w przeglądarce.
 * Wymaga jednej linii w index.html:  <script src="normy-modul.js" defer></script>
 */
(function () {
  'use strict';
  var VER = 'nx2';
  var TTL = 12 * 3600 * 1000;               // jak często sprawdzać ponownie (12 h)
  var ELI_API = 'https://api.sejm.gov.pl/eli/acts/DU/';
  var EU_ENDPOINT = 'normy-eu.php';

  /* ---------- KATALOG AKTÓW ----------
     t: ustawa | rozp | ue | inne ; eli: 'rok/pozycja' w Dz.U. ; celex: numer CELEX
     re: wyrażenie dopasowujące wpisy z artykułów; note: stała uwaga redakcji      */
  var CAT = [
    // Ustawy
    {k:'pb',  t:'ustawa', n:'Prawo budowlane', eli:'1994/414', re:/^(Prawo budowlane|Nowelizacja Prawa budowlanego)/i},
    {k:'nowpb', t:'ustawa', n:'Ustawa z 4 grudnia 2025 r. o zmianie ustawy – Prawo budowlane', eli:'2025/1847', re:/Dz\.?U\.? 2025 poz\. 1847/i},
    {k:'kc',  t:'ustawa', n:'Kodeks cywilny', eli:'1964/93', re:/^Kodeks cywilny/i},
    {k:'kpc', t:'ustawa', n:'Kodeks postępowania cywilnego', eli:'1964/296', re:/^Kodeks postępowania cywilnego/i},
    {k:'kpa', t:'ustawa', n:'Kodeks postępowania administracyjnego', eli:'1960/168', re:/^KPA\b|^Kodeks postępowania administracyjnego/i},
    {k:'kk',  t:'ustawa', n:'Kodeks karny', eli:'1997/553', re:/^Kodeks karny(?! skarbowy)/i},
    {k:'kks', t:'ustawa', n:'Kodeks karny skarbowy', eli:'1999/930', re:/^Kodeks karny skarbowy/i},
    {k:'kp',  t:'ustawa', n:'Kodeks pracy', eli:'1974/141', re:/^Kodeks pracy/i},
    {k:'kw',  t:'ustawa', n:'Kodeks wykroczeń', eli:'1971/114', re:/^Kodeks wykroczeń/i},
    {k:'kro', t:'ustawa', n:'Kodeks rodzinny i opiekuńczy', eli:'1964/59', re:/^Kodeks rodzinny/i},
    {k:'ksh', t:'ustawa', n:'Kodeks spółek handlowych', eli:'2000/1037', re:/^Kodeks spółek handlowych/i},
    {k:'pe',  t:'ustawa', n:'Prawo energetyczne', eli:'1997/348', re:/^Prawo energetyczne/i},
    {k:'pgk', t:'ustawa', n:'Prawo geodezyjne i kartograficzne', eli:'1989/163', re:/^Prawo geodezyjne/i},
    {k:'pgg', t:'ustawa', n:'Prawo geologiczne i górnicze', eli:'2011/981', re:/^Prawo geologiczne/i},
    {k:'pos', t:'ustawa', n:'Prawo ochrony środowiska', eli:'2001/627', re:/^Prawo ochrony środowiska/i},
    {k:'pw',  t:'ustawa', n:'Prawo wodne', eli:'2017/1566', re:/^Prawo wodne/i},
    {k:'pzp', t:'ustawa', n:'Prawo zamówień publicznych', eli:'2019/2019', re:/^(Prawo zamówień publicznych|Pzp\b)/i},
    {k:'dew', t:'ustawa', n:'Ustawa deweloperska (o ochronie praw nabywcy lokalu mieszkalnego lub domu jednorodzinnego)', eli:'2021/1177', re:/^Ustawa deweloperska|^Ustawa o ochronie praw nabywcy/i},
    {k:'cheb',t:'ustawa', n:'Ustawa o charakterystyce energetycznej budynków', eli:'2014/1200', re:/^Ustawa o charakterystyce energetycznej/i},
    {k:'drog',t:'ustawa', n:'Ustawa o drogach publicznych', eli:'1985/60', re:/^Ustawa o drogach publicznych/i},
    {k:'emob',t:'ustawa', n:'Ustawa o elektromobilności i paliwach alternatywnych', eli:'2018/317', re:/^Ustawa o elektromobilności/i},
    {k:'fp',  t:'ustawa', n:'Ustawa o finansach publicznych', eli:'2009/1240', re:/^Ustawa o finansach publicznych/i},
    {k:'kwh', t:'ustawa', n:'Ustawa o księgach wieczystych i hipotece', eli:'1982/147', re:/^Ustawa o księgach wieczystych/i},
    {k:'grl', t:'ustawa', n:'Ustawa o ochronie gruntów rolnych i leśnych', eli:'1995/78', re:/^Ustawa o ochronie gruntów rolnych/i},
    {k:'ol',  t:'ustawa', n:'Ustawa o ochronie ludności i obronie cywilnej', eli:'2024/1907', re:/^Ustawa o ochronie ludności/i},
    {k:'ppoz',t:'ustawa', n:'Ustawa o ochronie przeciwpożarowej', eli:'1991/351', re:/^Ustawa o ochronie przeciwpożarowej/i},
    {k:'opr', t:'ustawa', n:'Ustawa o ochronie przyrody', eli:'2004/880', re:/^Ustawa o ochronie przyrody/i},
    {k:'zab', t:'ustawa', n:'Ustawa o ochronie zabytków i opiece nad zabytkami', eli:'2003/1568', re:/^Ustawa o ochronie zabytków/i},
    {k:'odp', t:'ustawa', n:'Ustawa o odpadach', eli:'2013/21', re:/^Ustawa o odpadach/i},
    {k:'upzp',t:'ustawa', n:'Ustawa o planowaniu i zagospodarowaniu przestrzennym', eli:'2003/717', re:/^Ustawa o planowaniu i zagospodarowaniu/i},
    {k:'upol',t:'ustawa', n:'Ustawa o podatkach i opłatach lokalnych', eli:'1991/31', re:/^Ustawa o podatkach i opłatach lokalnych/i},
    {k:'kons',t:'ustawa', n:'Ustawa o prawach konsumenta', eli:'2014/827', re:/^Ustawa o prawach konsumenta/i},
    {k:'opoz',t:'ustawa', n:'Ustawa o przeciwdziałaniu nadmiernym opóźnieniom w transakcjach handlowych', eli:'2013/403', re:/^Ustawa o przeciwdziałaniu nadmiernym opóźnieniom/i},
    {k:'spm', t:'ustawa', n:'Ustawa o spółdzielniach mieszkaniowych', eli:'2001/27', re:/^Ustawa o spółdzielniach mieszkaniowych/i},
    {k:'ucp', t:'ustawa', n:'Ustawa o utrzymaniu czystości i porządku w gminach', eli:'1996/622', re:/^Ustawa o utrzymaniu czystości/i},
    {k:'uwl', t:'ustawa', n:'Ustawa o własności lokali', eli:'1994/388', re:/^Ustawa o własności lokali/i},
    {k:'dost',t:'ustawa', n:'Ustawa o zapewnianiu dostępności osobom ze szczególnymi potrzebami', eli:'2019/1696', re:/^Ustawa o zapewnianiu dostępności/i},
    {k:'zak', t:'ustawa', n:'Ustawa o zapobieganiu oraz zwalczaniu zakażeń i chorób zakaźnych u ludzi', eli:'2008/1570', re:/^Ustawa o zapobieganiu oraz zwalczaniu zakażeń/i},
    {k:'wod', t:'ustawa', n:'Ustawa o zbiorowym zaopatrzeniu w wodę i zbiorowym odprowadzaniu ścieków', eli:'2001/747', re:/^Ustawa (z 7 czerwca 2001 r\. )?o zbiorowym zaopatrzeniu w wodę/i},
    {k:'fgaz',t:'ustawa', n:'Ustawa F-gazowa (o substancjach zubożających warstwę ozonową oraz o niektórych fluorowanych gazach cieplarnianych)', eli:'2015/881', re:/^Ustawa F-gazowa/i},

    // Rozporządzenia krajowe
    {k:'wt', t:'rozp', n:'Warunki techniczne, jakim powinny odpowiadać budynki i ich usytuowanie (rozporządzenie z 12 kwietnia 2002 r.)', eli:'2002/690',
     re:/^(Warunki techniczne(?! (budowli|wykonania|użytkowania))|WT\b|Rozporządzenie Ministra Infrastruktury z 12 kwietnia 2002|Rozporządzenie w sprawie warunków technicznych(?! użytkowania))/i,
     note:'Nowe rozporządzenie nie zostało dotąd ogłoszone. Przepisy przejściowe Prawa budowlanego (m.in. art. 102a) pozwalają przez 18 miesięcy od 20.09.2026 r. stosować dotychczasowe warunki techniczne.'},
    {k:'wtu', t:'rozp', n:'Warunki techniczne użytkowania budynków mieszkalnych (rozporządzenie z 16 sierpnia 1999 r.)', eli:'1999/836', re:/warunków technicznych użytkowania budynków mieszkalnych/i,
     note:'Utraciło moc 20.09.2026 r. Jego zakres ma przejąć nowe rozporządzenie o warunkach technicznych, które nie zostało jeszcze ogłoszone (stan na 30.10.2026 r.).'},
    {k:'bhpb',t:'rozp', n:'Rozporządzenie w sprawie BHP podczas wykonywania robót budowlanych (6 lutego 2003 r.)', eli:'2003/401', re:/^Rozporządzenie (w sprawie )?BHP (podczas|przy|z 6)|^Rozporządzenie bhp przy robotach/i},
    {k:'bhpo',t:'rozp', n:'Rozporządzenie w sprawie ogólnych przepisów BHP', eli:'1997/844', re:/^Rozporządzenie w sprawie ogólnych przepisów BHP/i},
    {k:'geot',t:'rozp', n:'Rozporządzenie w sprawie ustalania geotechnicznych warunków posadawiania obiektów budowlanych', eli:'2012/463', re:/geotechnicznych warunków posadawiania/i},
    {k:'proj',t:'rozp', n:'Rozporządzenie w sprawie szczegółowego zakresu i formy projektu budowlanego', eli:'2020/1609', re:/^Rozporządzenie o zakresie (i formie )?projektu budowlanego/i},
    {k:'hal', t:'rozp', n:'Rozporządzenie w sprawie dopuszczalnych poziomów hałasu w środowisku', eli:'2007/826', re:/dopuszczalnych poziomów hałasu/i},
    {k:'wpit',t:'rozp', n:'Rozporządzenie Ministra Zdrowia w sprawie jakości wody przeznaczonej do spożycia przez ludzi (22 maja 2026 r.; zastąpiło rozporządzenie z 7 grudnia 2017 r.)', eli:'2026/748', re:/jakości wody przeznaczonej do spożycia/i},
    {k:'ppb', t:'rozp', n:'Rozporządzenie w sprawie ochrony przeciwpożarowej budynków, innych obiektów budowlanych i terenów', eli:'2010/719', re:/^Rozporządzenie (MSWiA z 7 czerwca 2010|ppoż|o ochronie przeciwpożarowej budynków)/i},
    {k:'pwk', t:'rozp', n:'Rozporządzenie w sprawie prac uciążliwych, niebezpiecznych lub szkodliwych dla zdrowia kobiet w ciąży i kobiet karmiących', eli:'2017/796', re:/prace wzbronione kobietom/i},
    {k:'r729',t:'rozp', n:'Rozporządzenie MRiT z 2 maja 2024 r.', eli:'2024/729', re:/Dz\.?U\.? 2024 poz\. 729/i},
    {k:'r2454',t:'rozp',n:'Rozporządzenie MRiT z 20 grudnia 2021 r.', eli:'2021/2454', re:/Dz\.?U\.? 2021 poz\. 2454/i},
    {k:'edb', t:'rozp', n:'Rozporządzenie w sprawie dziennika budowy oraz systemu Elektroniczny Dziennik Budowy', eli:'2023/45', re:/Dz\.?U\.? 2023 poz\. 45\b|dziennika budowy oraz systemu/i},
    {k:'r1548',t:'rozp',n:'Rozporządzenie MSWiA z 4 listopada 2025 r.', eli:'2025/1548', re:/Dz\.?U\.? 2025 poz\. 1548/i},
    {k:'r235',t:'rozp', n:'Rozporządzenie MSWiA z 21 lutego 2025 r.', eli:'2025/235', re:/Dz\.?U\.? 2025 poz\. 235\b/i},
    {k:'r272',t:'rozp', n:'Rozporządzenie z 18 lutego 2026 r. w sprawie wzoru zawiadomienia o zakończeniu budowy i wniosku o pozwolenie na użytkowanie', eli:'2026/272', re:/Dz\.?U\.? 2026 poz\. 272/i},

    // Prawo UE
    {k:'epbd',t:'ue', n:'Dyrektywa (UE) 2024/1275 w sprawie charakterystyki energetycznej budynków (EPBD)', celex:'32024L1275', re:/EPBD|2024\/1275/i},
    {k:'d844',t:'ue', n:'Dyrektywa (UE) 2018/844 zmieniająca dyrektywę EPBD', celex:'32018L0844', re:/2018\/844/},
    {k:'d970',t:'ue', n:'Dyrektywa (UE) 2023/970', celex:'32023L0970', re:/2023\/970/},
    {k:'d42', t:'ue', n:'Dyrektywa 2004/42/WE (lotne związki organiczne w farbach i lakierach)', celex:'32004L0042', re:/2004\/42/},
    {k:'d36', t:'ue', n:'Dyrektywa 2005/36/WE w sprawie uznawania kwalifikacji zawodowych', celex:'32005L0036', re:/2005\/36/},
    {k:'d35', t:'ue', n:'Dyrektywa 2013/35/UE (pola elektromagnetyczne w środowisku pracy)', celex:'32013L0035', re:/2013\/35/},
    {k:'bss', t:'ue', n:'Dyrektywa Rady 2013/59/Euratom (BSS, ochrona przed promieniowaniem, m.in. radon)', celex:'32013L0059', re:/BSS Euratom|2013\/59/i},
    {k:'cpr', t:'ue', n:'Rozporządzenie (UE) nr 305/2011 (CPR) w sprawie wyrobów budowlanych', celex:'32011R0305', re:/305\/2011|^Rozporządzenie CPR$/i},
    {k:'cpr2',t:'ue', n:'Rozporządzenie (UE) 2024/3110 w sprawie wyrobów budowlanych (nowe CPR)', celex:'32024R3110', re:/2024\/3110|UE o wyrobach budowlanych \(od 8\.01\.2026\)/i},
    {k:'fg',  t:'ue', n:'Rozporządzenie (UE) 2024/573 w sprawie fluorowanych gazów cieplarnianych', celex:'32024R0573', re:/2024\/573/},
    {k:'r1309',t:'ue',n:'Rozporządzenie (UE) 2024/1309', celex:'32024R1309', re:/2024\/1309/},
    {k:'eco1',t:'ue', n:'Rozporządzenie (UE) nr 1253/2014 (ekoprojekt: centrale wentylacyjne)', celex:'32014R1253', re:/1253\/2014/},
    {k:'eco2',t:'ue', n:'Rozporządzenie (UE) nr 812/2013 (etykiety energetyczne: podgrzewacze wody)', celex:'32013R0812', re:/812\/2013/},
    {k:'eco3',t:'ue', n:'Rozporządzenie (UE) nr 814/2013 (ekoprojekt: podgrzewacze wody)', celex:'32013R0814', re:/814\/2013/},
    {k:'rodo',t:'ue', n:'RODO – rozporządzenie (UE) 2016/679', celex:'32016R0679', re:/^RODO/i},
    {k:'ets2',t:'ue', n:'EU ETS 2 (system handlu uprawnieniami do emisji dla budynków i transportu)', re:/^EU ETS 2/i}
  ];

  /* Rodziny norm – nazwy dla najczęściej przywoływanych */
  var FAM = {
    'PN-EN 1990':'Eurokod 0 – Podstawy projektowania konstrukcji','PN-EN 1991':'Eurokod 1 – Oddziaływania na konstrukcje',
    'PN-EN 1992':'Eurokod 2 – Projektowanie konstrukcji z betonu','PN-EN 1993':'Eurokod 3 – Projektowanie konstrukcji stalowych',
    'PN-EN 1995':'Eurokod 5 – Projektowanie konstrukcji drewnianych','PN-EN 1996':'Eurokod 6 – Projektowanie konstrukcji murowych',
    'PN-EN 1997':'Eurokod 7 – Projektowanie geotechniczne','PN-EN 1998':'Eurokod 8 – Projektowanie konstrukcji poddanych oddziaływaniom sejsmicznym',
    'PN-HD 60364':'Instalacje elektryczne niskiego napięcia','PN-EN 206':'Beton – wymagania, właściwości, produkcja i zgodność',
    'PN-EN 13670':'Wykonywanie konstrukcji z betonu','PN-EN ISO 13788':'Cieplno-wilgotnościowe właściwości komponentów i elementów budynku',
    'PN-B-03430':'Wentylacja w budynkach mieszkalnych zamieszkania zbiorowego i użyteczności publicznej',
    'PN-B-02151':'Akustyka budowlana – ochrona przed hałasem w budynkach','PN-EN 12056':'Systemy kanalizacji grawitacyjnej wewnątrz budynków',
    'PN-EN 1264':'Wodne systemy ogrzewania i chłodzenia płaszczyznowego','PN-EN 62305':'Ochrona odgromowa',
    'PN-EN 13813':'Podkłady podłogowe – materiały i właściwości','PN-EN 12831':'Obliczanie projektowego obciążenia cieplnego',
    'PN-EN 13914':'Projektowanie, przygotowanie i wykonywanie tynków','PN-EN 998':'Zaprawy do murów',
    'PN-EN 771':'Elementy murowe','PN-EN 806':'Instalacje wodociągowe wewnątrz budynków','PN-EN ISO 10211':'Mostki cieplne – obliczenia szczegółowe',
    'PN-EN ISO 14683':'Mostki cieplne – metody uproszczone','PN-EN ISO 9972':'Badanie szczelności powietrznej budynków',
    'PN-EN 13501':'Klasyfikacja ogniowa wyrobów i elementów budowlanych','PN-EN 1717':'Ochrona przed wtórnym zanieczyszczeniem wody',
    'PN-EN 1443':'Kominy – wymagania ogólne','PN-EN 13163':'Wyroby ze styropianu (EPS) do izolacji cieplnej',
    'PN-EN ISO 12944':'Ochrona konstrukcji stalowych przed korozją za pomocą powłok','PN-EN 1504':'Wyroby i systemy do ochrony i napraw konstrukcji betonowych',
    'PN-EN 61439':'Rozdzielnice i sterownice niskonapięciowe','PN-EN 13859':'Elastyczne wyroby wodochronne – membrany',
    'PN-EN 14351':'Okna i drzwi – norma wyrobu','PN-EN 338':'Drewno konstrukcyjne – klasy wytrzymałości',
    'PN-EN 10080':'Stal do zbrojenia betonu','PN-ISO 9836':'Właściwości użytkowe w budownictwie – wskaźniki powierzchniowe i kubaturowe'
  };
  var EUROKOD = {'0':'PN-EN 1990','1':'PN-EN 1991','2':'PN-EN 1992','3':'PN-EN 1993','5':'PN-EN 1995','6':'PN-EN 1996','7':'PN-EN 1997','8':'PN-EN 1998'};

  /* ---------- klasyfikacja jednego wpisu ---------- */
  function classify(raw) {
    var s = raw.trim();
    for (var i = 0; i < CAT.length; i++) if (CAT[i].re.test(s)) return {key: CAT[i].k, cite: provision(s)};
    var m;
    if ((m = s.match(/^Eurokod\s*(\d)/i)) && EUROKOD[m[1]]) return {key: 'PN:' + EUROKOD[m[1]], cite: s.replace(/^Eurokod\s*\d\s*,?/i, '').replace(/[()]/g, '').trim(), t: 'norma'};
    if (/^PN[- ]/i.test(s)) { var f = normFamily(s); return {key: 'PN:' + f.fam, cite: f.part, t: 'norma'}; }
    if (/^(DIN|EN|ISO|IEC|VDI|OIB|NEC|Bauordnung|Building Regulations|Wiring Regulations|BN-|N-SEP|EAD|ETA$)/i.test(s)) return {key: 'X:' + s, t: 'zagr'};
    if (/^(Wyrok|Uchwała|SN\b)/i.test(s)) return {key: 'X:' + s, t: 'orzecz'};
    return {key: 'X:' + s, t: 'inne'};
  }
  function provision(s) {                  // „art. 22 pkt 7”, „§ 120”, „zał. 2”
    var m = s.match(/(art\.\s?[\d¹²³⁴⁵a-z]+.*|§+\s?\d.*|zał(\.|ącznik)\s?(nr\s)?\d.*|Dział\s+[IVX]+.*)$/i);
    if (m) return m[1].replace(/\s+/g, ' ').trim();
    var p = s.match(/\(([^)]+)\)\s*$/) || s.match(/:\s*(.+)$/);   // „Kodeks cywilny (rękojmia)”
    return p ? p[1].trim() : '';
  }
  function normFamily(s) {
    var base = s.replace(/\s*\(.*$/, '').replace(/\s+(pkt|tabl|tablica|załącznik|z poprawką|z Az\d|Az\d).*$/i, '')
                .replace(/\/Az\d.*$/i, '').replace(/[+:].*$/, '').trim();
    base = base.replace(/^PN-(\d\d)\/([A-Z])-(\d+)/, 'PN-$2-$3').replace(/^PN-([A-Z]) (\d)/, 'PN-$1-$2'); // PN-83/B-03430 → PN-B-03430
    var m = base.match(/^(PN(?:-[A-Z]{1,3})?(?:[- ](?:EN|ISO|IEC|HD)(?:\/IEC)?)*)[ -](\d+)(.*)$/);
    if (!m) return {fam: base, part: ''};
    var fam = m[1].replace(/-$/, '') + (/^PN-[A-Z]$/.test(m[1]) ? '-' : ' ') + m[2];
    return {fam: fam, part: s !== fam ? s : ''};
  }

  /* ---------- budowa indeksu ---------- */
  var DATA = null;
  function build() {
    if (DATA) return DATA;
    var D = JSON.parse(document.getElementById('data').textContent);
    var byKey = {}, catBy = {};
    CAT.forEach(function (c) { catBy[c.k] = c; });
    D.articles.forEach(function (a) {
      (a.norms || []).forEach(function (raw) {
        var c = classify(raw), e = byKey[c.key];
        if (!e) {
          var cat = catBy[c.key];
          e = byKey[c.key] = cat ? {k: cat.k, t: cat.t, n: cat.n, eli: cat.eli, celex: cat.celex, note: cat.note, arts: {}, cites: {}, raw: {}}
            : c.key.indexOf('PN:') === 0 ? {k: c.key, t: 'norma', n: c.key.slice(3), sub: FAM[c.key.slice(3)] || '', arts: {}, cites: {}, raw: {}}
            : {k: c.key, t: c.t, n: c.key.slice(2), arts: {}, cites: {}, raw: {}};
        }
        var ar = e.arts[a.slug] || (e.arts[a.slug] = {slug: a.slug, title: a.title, cites: {}});
        if (c.cite && !/^\d{4}( r\.)?$|^Dz\.?\s?U/i.test(c.cite) && c.cite.length < 70) { ar.cites[c.cite] = 1; e.cites[c.cite] = (e.cites[c.cite] || 0) + 1; }
        e.raw[raw] = 1;
      });
    });
    var list = Object.keys(byKey).map(function (k) { var e = byKey[k]; e.list = Object.keys(e.arts).map(function (s) { return e.arts[s]; }); e.count = e.list.length; return e; });
    DATA = {list: list, rawCount: list.reduce(function (n, e) { return n + Object.keys(e.raw).length; }, 0), arts: D.articles.length};
    return DATA;
  }

  /* ---------- status: ISAP (API Sejmu) i EUR-Lex ---------- */
  function cacheGet(id) { try { var v = JSON.parse(localStorage.getItem(VER + ':' + id)); return v && Date.now() - v.at < TTL ? v : null; } catch (e) { return null; } }
  function cacheSet(id, v) { try { v.at = Date.now(); localStorage.setItem(VER + ':' + id, JSON.stringify(v)); } catch (e) {} }

  function checkEli(e) {
    var hit = cacheGet('eli:' + e.eli);
    if (hit) return Promise.resolve(hit);
    return fetch(ELI_API + e.eli).then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (j) {
      var v = {inForce: j.inForce === 'IN_FORCE' ? true : j.inForce === 'NOT_IN_FORCE' ? false : null, status: j.status || '', repeal: j.repealDate || '',
               title: j.title || '', isap: 'https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU' + j.year + pad(j.volume || 0, 3) + pad(j.pos, 4),
               ref: 'Dz.U. ' + j.year + (j.volume ? ' nr ' + j.volume : '') + ' poz. ' + j.pos};
      cacheSet('eli:' + e.eli, v); return v;
    });
  }
  function checkEu(list) {
    var ids = list.map(function (e) { return e.celex; });
    var hit = cacheGet('eu:all');
    if (hit) return Promise.resolve(hit);
    return fetch(EU_ENDPOINT + '?celex=' + ids.join(','), {cache: 'no-store'}).then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (j) { if (!j || !j.acts) throw 0; cacheSet('eu:all', j); return j; });
  }
  function pad(n, w) { n = String(n); while (n.length < w) n = '0' + n; return n; }
  function plDate(d) { if (!d) return ''; var p = d.slice(0, 10).split('-'); return p[2] + '.' + p[1] + '.' + p[0]; }

  /* ---------- widok ---------- */
  var TYPES = [
    {t: 'ustawa', n: 'Ustawy', d: 'Akty podstawowe ogłaszane w Dzienniku Ustaw. Status sprawdzany automatycznie w ISAP.'},
    {t: 'rozp', n: 'Rozporządzenia', d: 'Przepisy wykonawcze do ustaw. Status sprawdzany automatycznie w ISAP.'},
    {t: 'ue', n: 'Prawo Unii Europejskiej', d: 'Rozporządzenia stosowane bezpośrednio i dyrektywy wdrażane do prawa polskiego.'},
    {t: 'norma', n: 'Polskie Normy', d: 'Pogrupowane w rodziny (np. wszystkie części Eurokodu 2). Stosowanie norm jest dobrowolne, chyba że powołuje je przepis lub umowa.'},
    {t: 'zagr', n: 'Normy zagraniczne i dokumenty techniczne', d: 'DIN, ISO, EAD, przepisy innych krajów – przywoływane dla porównania.'},
    {t: 'orzecz', n: 'Orzecznictwo', d: 'Wyroki i uchwały sądów, na które powołują się artykuły.'},
    {t: 'inne', n: 'Wytyczne, instrukcje i pojęcia', d: 'Instrukcje ITB, wytyczne branżowe i dokumenty, które nie są aktami prawnymi.'}
  ];
  var st = {t: '', q: '', bad: false};
  var STATUS = {};

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]; }); }
  function fold(s) { return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l'); }
  function plural(n, a, b, c) { return n === 1 ? a : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) ? b : c; }

  function badge(e) {
    var s = STATUS[e.k];
    if (e.eli || e.celex) {
      if (!s) return '<span class="nx-b nx-wait">Sprawdzanie…</span>';
      if (s.err) return '<span class="nx-b nx-unk">Brak odpowiedzi źródła</span>';
      if (s.inForce === true) return '<span class="nx-b nx-ok">Obowiązuje</span>';
      if (s.inForce === false) return '<span class="nx-b nx-off">Nie obowiązuje' + (s.repeal ? ' od ' + plDate(s.repeal) : '') + '</span>';
      return '<span class="nx-b nx-unk">' + esc(s.status || 'Status nieustalony') + '</span>';
    }
    if (e.t === 'norma') return '<span class="nx-b nx-neu">Polska Norma</span>';
    return '';
  }
  function srcLink(e) {
    var s = STATUS[e.k];
    if (e.eli) return '<a class="nx-src" href="' + (s && s.isap ? s.isap : 'https://isap.sejm.gov.pl/') + '" target="_blank" rel="noopener">' + esc(s && s.ref ? s.ref : 'ISAP') + ' ↗</a>';
    if (e.celex) return '<a class="nx-src" href="https://eur-lex.europa.eu/legal-content/PL/TXT/?uri=CELEX:' + e.celex + '" target="_blank" rel="noopener">EUR-Lex ↗</a>';
    if (e.t === 'norma') return '<a class="nx-src" href="https://sklep.pkn.pl/" target="_blank" rel="noopener">Katalog PKN ↗</a>';
    return '';
  }

  function row(e) {
    var cites = Object.keys(e.cites).sort(function (a, b) { return e.cites[b] - e.cites[a]; });
    var s = STATUS[e.k];
    var title = s && s.title && e.t !== 'ue' ? s.title : '';
    var arts = e.list.slice().sort(function (a, b) { return a.title.localeCompare(b.title, 'pl'); }).map(function (a) {
      var c = Object.keys(a.cites); return '<li><a href="#a-' + esc(a.slug) + '">' + esc(a.title) + '</a>' + (c.length ? ' <span class="nx-c">' + esc(c.join('; ')) + '</span>' : '') + '</li>';
    }).join('');
    return '<article class="nx-row' + (s && s.inForce === false ? ' nx-alert' : '') + '" id="nx-' + esc(e.k.replace(/[^a-z0-9]/gi, '-')) + '">' +
      '<div class="nx-main"><h3>' + esc(e.n) + '</h3>' +
        (e.sub ? '<p class="nx-sub">' + esc(e.sub) + '</p>' : '') +
        (title && fold(title).indexOf(fold(e.n).slice(0, 18)) < 0 ? '<p class="nx-sub">' + esc(title) + '</p>' : '') +
        (s && s.inForce === false && e.note ? '<p class="nx-note">' + esc(e.note) + '</p>' : '') +
        (cites.length ? '<div class="nx-cites">' + cites.slice(0, 14).map(function (c) { return '<span>' + esc(c) + '</span>'; }).join('') + (cites.length > 14 ? '<span>+' + (cites.length - 14) + '</span>' : '') + '</div>' : '') +
      '</div>' +
      '<div class="nx-st">' + badge(e) + srcLink(e) + '</div>' +
      '<details class="nx-arts"><summary>' + e.count + ' ' + plural(e.count, 'artykuł', 'artykuły', 'artykułów') + '</summary><ul>' + arts + '</ul></details>' +
    '</article>';
  }

  function render(view) {
    var d = build();
    var q = fold(st.q.trim());
    var match = function (e) {
      if (st.t && e.t !== st.t) return false;
      if (st.bad && !(STATUS[e.k] && STATUS[e.k].inForce === false)) return false;
      if (!q) return true;
      return fold(e.n + ' ' + (e.sub || '') + ' ' + Object.keys(e.raw).join(' ') + ' ' + ((STATUS[e.k] || {}).title || '')).indexOf(q) >= 0;
    };
    var groups = TYPES.map(function (g) {
      var rows = d.list.filter(function (e) { return e.t === g.t && match(e); })
        .sort(function (a, b) { return g.t === 'norma' ? a.n.localeCompare(b.n, 'pl', {numeric: true}) : (b.count - a.count) || a.n.localeCompare(b.n, 'pl'); });
      if (!rows.length) return '';
      return '<section class="nx-g"><header><h2>' + g.n + '</h2><span>' + rows.length + '</span></header><p class="nx-gd">' + g.d + '</p>' + rows.map(row).join('') + '</section>';
    }).join('');
    var counts = {}; d.list.forEach(function (e) { counts[e.t] = (counts[e.t] || 0) + 1; });
    var bad = d.list.filter(function (e) { return STATUS[e.k] && STATUS[e.k].inForce === false; });
    var checked = d.list.filter(function (e) { return (e.eli || e.celex) && STATUS[e.k] && !STATUS[e.k].err; }).length;
    var checkable = d.list.filter(function (e) { return e.eli || e.celex; }).length;
    var badArts = {}; bad.forEach(function (e) { e.list.forEach(function (a) { badArts[a.slug] = 1; }); });

    var html =
      '<section class="page-head" data-nx="1"><div class="wrap"><nav class="crumbs" aria-label="Okruszki"><a href="#start">Start</a><span aria-hidden="true">/</span><span>Wiedza</span><span aria-hidden="true">/</span><span>Normy i przepisy</span></nav>' +
      '<p class="nx-eyebrow">Baza prawna portalu</p><h1 class="page-title">Normy i przepisy</h1>' +
      '<p class="page-lead">Ustawy, rozporządzenia, prawo UE i Polskie Normy, na które powołują się artykuły. Wpisy z artykułów są scalone w akty i rodziny norm, a status przepisów sprawdzamy automatycznie w oficjalnych źródłach.</p>' +
      '<div class="nx-meta"><span><i class="nx-dot' + (checked < checkable ? ' nx-dot-wait' : '') + '"></i>Status sprawdzony: <b>' + checked + ' z ' + checkable + '</b> aktów (ISAP, EUR-Lex) · ' + new Date().toLocaleDateString('pl-PL') + '</span>' +
      '<span><b>' + d.list.length + '</b> pozycji (scalone z ' + d.rawCount + ' wpisów w ' + d.arts + ' artykułach)</span></div></div></section>' +

      (bad.length ? '<section class="nx-warnbar"><div class="wrap"><b>Wymaga uwagi:</b> ' + bad.length + ' ' + plural(bad.length, 'akt nie obowiązuje', 'akty nie obowiązują', 'aktów nie obowiązuje') +
        ', a powołuje się na ' + plural(bad.length, 'niego', 'nie', 'nie') + ' ' + Object.keys(badArts).length + ' ' + plural(Object.keys(badArts).length, 'artykuł', 'artykuły', 'artykułów') + ': ' +
        bad.map(function (e) { return '<a href="#normy" data-jump="nx-' + esc(e.k) + '">' + esc(e.n.replace(/\s*\(.*\)$/, '')) + '</a>'; }).join(', ') + '.</div></section>' : '') +

      '<div class="nx-tools"><div class="wrap"><label class="nx-search"><input type="search" id="nx-q" placeholder="Szukaj: numer, nazwa, artykuł…" value="' + esc(st.q) + '" aria-label="Szukaj w wykazie"></label>' +
      '<div class="nx-chips" role="group" aria-label="Rodzaj"><button class="chip" data-t="" aria-pressed="' + (st.t === '') + '">Wszystkie <span class="k">' + d.list.length + '</span></button>' +
      TYPES.filter(function (g) { return counts[g.t]; }).map(function (g) { return '<button class="chip" data-t="' + g.t + '" aria-pressed="' + (st.t === g.t) + '">' + g.n.replace(' i dokumenty techniczne', '').replace('Wytyczne, instrukcje i pojęcia', 'Wytyczne i inne').replace('Prawo Unii Europejskiej', 'Prawo UE') + ' <span class="k">' + counts[g.t] + '</span></button>'; }).join('') +
      '<button class="chip nx-badchip" data-bad="1" aria-pressed="' + st.bad + '">Nieobowiązujące <span class="k">' + bad.length + '</span></button></div></div></div>' +

      '<section class="section nx-body"><div class="wrap">' + (groups || '<div class="empty">Brak pozycji dla tych kryteriów.</div>') +
      '<aside class="nx-legal"><b>Jak to działa.</b> Status ustaw i rozporządzeń pobieramy z API Sejmu (baza ISAP), a aktów UE z EUR-Lex. Dane odświeżają się automatycznie co 12 godzin. Polskie Normy nie mają publicznego źródła statusu, więc sprawdzaj je w katalogu PKN. ' +
      'Opisy mają charakter informacyjny i nie zastępują porady prawnej ani projektowej. Wiążący jest tekst aktu w Dzienniku Ustaw lub Dzienniku Urzędowym UE oraz oficjalna treść normy.</aside></div></section>';

    view.innerHTML = html;
    var qi = view.querySelector('#nx-q');
    qi.addEventListener('input', function () { st.q = qi.value; var p = qi.selectionStart; render(view); var n = view.querySelector('#nx-q'); n.focus(); n.setSelectionRange(p, p); });
    view.querySelectorAll('.nx-chips .chip').forEach(function (b) {
      b.addEventListener('click', function () { if (b.dataset.bad) st.bad = !st.bad; else st.t = b.dataset.t; render(view); });
    });
    view.querySelectorAll('[data-jump]').forEach(function (a) {
      a.addEventListener('click', function (ev) { ev.preventDefault(); var t = view.querySelector('#' + a.dataset.jump.replace(/[^a-z0-9-]/gi, '-')); if (t) { t.scrollIntoView({block: 'center'}); t.querySelector('details').open = true; } });
    });
  }

  var started = false;
  function loadStatuses(view) {
    if (started) return; started = true;
    var d = build(), rer = function () { if (location.hash === '#normy' && document.getElementById('nx-q') && document.activeElement !== document.getElementById('nx-q')) render(view); };
    var eli = d.list.filter(function (e) { return e.eli; });
    var i = 0, active = 0, pending = null;
    function next() {
      while (active < 6 && i < eli.length) (function (e) {
        active++; checkEli(e).then(function (v) { STATUS[e.k] = v; }, function () { STATUS[e.k] = {err: 1}; })
          .then(function () { active--; clearTimeout(pending); pending = setTimeout(rer, 120); next(); });
      })(eli[i++]);
    }
    next();
    var eu = d.list.filter(function (e) { return e.celex; });
    if (eu.length) checkEu(eu).then(function (j) {
      var today = new Date().toISOString().slice(0, 10);
      eu.forEach(function (e) {
        var a = j.acts[e.celex];
        if (!a) STATUS[e.k] = {err: 1};
        else if (a.inForce === true && a.end && a.end < today) STATUS[e.k] = {inForce: null, status: 'Sprawdź w EUR-Lex'};   // dane sprzeczne
        else STATUS[e.k] = {inForce: a.inForce, repeal: a.inForce === false ? (a.end || '') : '', status: a.inForce == null ? 'Brak danych w EUR-Lex' : ''};
      }); rer();
    }, function () { eu.forEach(function (e) { STATUS[e.k] = {err: 1}; }); rer(); });
  }

  /* ---------- podpięcie pod router aplikacji ---------- */
  var CSS = '.nx-eyebrow{font:700 13px/1 var(--f-display);letter-spacing:.14em;text-transform:uppercase;color:var(--orange);margin:6px 0 8px}' +
    '.nx-meta{display:flex;flex-wrap:wrap;gap:6px 26px;margin-top:16px;font-size:14px;color:var(--ink-2)}.nx-meta b{color:var(--ink)}' +
    '.nx-dot{display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--acc-ok);margin-right:7px;vertical-align:1px}.nx-dot-wait{background:var(--acc-warn);animation:nxp 1s infinite alternate}@keyframes nxp{to{opacity:.3}}' +
    '.nx-warnbar{background:var(--danger-soft);border-bottom:1px solid var(--line)}.nx-warnbar .wrap{padding-block:12px;font-size:15px;color:var(--ink)}.nx-warnbar b{color:var(--danger)}.nx-warnbar a{color:var(--danger);font-weight:600}' +
    '.nx-tools{position:sticky;top:0;z-index:20;background:var(--paper);border-bottom:1px solid var(--line)}.nx-tools .wrap{display:flex;flex-wrap:wrap;gap:10px;align-items:center;padding-block:12px}' +
    '.nx-search{flex:1 1 240px;max-width:320px}.nx-search input{width:100%;height:40px;border:1px solid var(--line-2);border-radius:10px;background:var(--surface);padding:0 14px;font:inherit;font-size:15px;color:var(--ink)}' +
    '.nx-search input:focus{outline:2px solid var(--signal);outline-offset:-1px}.nx-chips{display:flex;flex-wrap:wrap;gap:6px}.nx-chips .chip{padding:6px 12px;font-size:13.5px}' +
    '.nx-badchip[aria-pressed="true"]{background:var(--danger);border-color:var(--danger)}' +
    '.nx-body .wrap{padding-top:8px}.nx-g{margin:26px 0 34px}.nx-g header{display:flex;align-items:baseline;gap:10px;border-bottom:2px solid var(--ink);padding-bottom:6px}' +
    '.nx-g h2{font:600 26px/1 var(--f-display);text-transform:uppercase;letter-spacing:.02em;margin:0}.nx-g header span{font:500 14px var(--f-mono);color:var(--ink-3)}' +
    '.nx-gd{font-size:14px;color:var(--ink-3);margin:8px 0 10px}' +
    '.nx-row{display:grid;grid-template-columns:minmax(0,1fr) 210px 170px;gap:6px 22px;padding:14px 4px;border-bottom:1px solid var(--line);align-items:start}' +
    '.nx-row:hover{background:var(--surface)}.nx-alert{background:linear-gradient(90deg,var(--danger-soft),transparent 60%)}' +
    '.nx-row h3{font-size:16.5px;font-weight:600;line-height:1.35;margin:0}.nx-sub{font-size:13.5px;color:var(--ink-3);margin:3px 0 0}' +
    '.nx-note{font-size:13.5px;color:var(--ink);background:var(--acc-warn-s);border-radius:8px;padding:7px 10px;margin:8px 0 0}' +
    '.nx-cites{display:flex;flex-wrap:wrap;gap:4px;margin-top:8px}.nx-cites span{font:500 12px/1.2 var(--f-mono);background:var(--sunken);color:var(--ink-2);border-radius:5px;padding:3px 6px}' +
    '.nx-st{display:flex;flex-direction:column;align-items:flex-start;gap:6px}' +
    '.nx-b{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:600;padding:5px 10px;border-radius:999px;line-height:1.1}.nx-b:before{content:"";width:7px;height:7px;border-radius:50%;background:currentColor;flex:none}' +
    '.nx-ok{color:var(--acc-ok);background:var(--acc-ok-s)}.nx-off{color:var(--danger);background:var(--danger-soft)}.nx-unk{color:var(--acc-warn);background:var(--acc-warn-s)}.nx-neu{color:var(--ink-2);background:var(--sunken)}.nx-wait{color:var(--ink-3);background:var(--surface)}' +
    '.nx-src{font-size:13px;font-weight:600;color:var(--orange);text-decoration:none}.nx-src:hover{text-decoration:underline}' +
    '.nx-arts summary{cursor:pointer;font-size:14px;font-weight:600;color:var(--ink-2);list-style:none}.nx-arts summary:before{content:"▸ ";color:var(--orange)}.nx-arts[open] summary:before{content:"▾ "}' +
    '.nx-arts[open]{grid-column:1/-1}.nx-arts ul{columns:2 340px;column-gap:28px;margin:8px 0 0;padding:0 0 0 16px;font-size:14px}.nx-arts li{break-inside:avoid;margin:0 0 5px}.nx-arts a{color:var(--ink)}.nx-c{font:12px var(--f-mono);color:var(--ink-3)}' +
    '.nx-legal{margin:30px 0 10px;padding:16px 18px;border-left:4px solid var(--signal);background:var(--surface);border-radius:0 10px 10px 0;font-size:14px;color:var(--ink-2)}.nx-legal b{color:var(--ink)}' +
    '@media(max-width:820px){.nx-row{grid-template-columns:1fr}.nx-st{flex-direction:row;flex-wrap:wrap;align-items:center}.nx-search{max-width:none}}';

  function mount() {
    var view = document.getElementById('view');
    if (!view || location.hash.replace('#', '') !== 'normy') return;
    if (view.querySelector('[data-nx]')) return;
    if (!document.getElementById('nx-css')) { var s = document.createElement('style'); s.id = 'nx-css'; s.textContent = CSS; document.head.appendChild(s); }
    render(view);
    loadStatuses(view);
  }
  function init() {
    var view = document.getElementById('view');
    if (!view) return setTimeout(init, 50);
    new MutationObserver(function () { mount(); }).observe(view, {childList: true});
    window.addEventListener('hashchange', function () { setTimeout(mount, 0); });
    mount();
  }
  window.EBNormy = {classify: classify, build: build, catalog: CAT};
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
