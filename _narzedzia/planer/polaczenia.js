/* ---------- zakładka: schemat połączeń ---------- */
const WIRE={L1:"#8B4A1E",L2:"#1A1A1A",L3:"#8A8A8A",N:"#1F7ACC",G:"#2E8B3A",Y:"#F4D21F",BG:"#FBFAF6",INK:"#1C2126",MUT:"#55606B",RED:"#B3261E"};
const WNAME={L1:"L1 brązowy",L2:"L2 czarny",L3:"L3 szary",N:"N niebieski",PE:"PE żółto-zielony",PEN:"PEN żółto-zielony, niebieskie końce"};
const busS=I=>I<=25?6:I<=40?10:I<=63?16:I<=80?25:I<=100?35:50;
const peS=s=>s<=16?s:s<=35?16:s/2;
const phOf=x=>x.phase==="L1L2L3"?["L1","L2","L3"]:[x.phase];
let polFit=false;

/* lista połączeń: jedno źródło danych tabeli i testów */
function wiring(D){
 const f3=S.supply==="3f",tnc=S.net==="tnc",PH=f3?["L1","L2","L3"]:["L1"];
 const sm=busS(D.FR),sw=D.wlz.S,W=[];
 const add=(sec,k,from,to,s,uw)=>W.push({sec,k,from,to,s,uw:uw||""});
 const a="Wejście zasilania";
 PH.forEach(p=>add(a,p,"WLZ, żyła "+p,"FR, zacisk wejściowy "+p,sw));
 if(tnc){
  add(a,"PEN","WLZ, żyła PEN","szyna PE, zacisk główny",sw,"PEN nigdy nie idzie przez RCD ani FR");
  add(a,"N","szyna PE, mostek","szyna N0",sw,"jedyne połączenie N z PE w całej instalacji");
 }else{
  add(a,"N","WLZ, żyła N","szyna N0",sw);
  add(a,"PE","WLZ, żyła PE","szyna PE, zacisk główny",peS(sw));
 }
 add(a,"PE","szyna PE","GSU (główna szyna uziemiająca)",peS(sw),"najkrótszą drogą");
 const b="Odpływy z rozłącznika";
 PH.forEach(p=>add(b,p,"FR, zacisk wyjściowy "+p,"szyna zasilająca "+p,sm));
 if(!f3)add(b,"N","szyna N0","FR, zacisk wejściowy N",sm,"FR 2P rozłącza także N");
 if(!f3)add(b,"N","FR, zacisk wyjściowy N","szyna zasilająca N",sm);
 const nSrc=f3?"szyna N0":"szyna zasilająca N";
 PH.forEach(p=>add(b,p,"szyna zasilająca "+p,"SPD, zacisk "+p,16,"przed RCD, łącznie do 0,5 m"));
 add(b,"N",nSrc,"SPD, zacisk N",16,"przed RCD");
 add(b,"PE","SPD, zacisk PE","szyna PE",16,"typ 1: min. 16 mm², najkrótszą drogą");
 PH.forEach(p=>add(b,p,"szyna zasilająca "+p,"lampka H, zacisk "+p,1.5,"krótko, odporne na zwarcie, zabezpieczenie wg producenta"));
 add(b,"N",nSrc,"lampka H, zacisk N",1.5);
 D.groups.forEach(g=>{
  if(g.kind==="rcd"){
   const c="RCD "+g.no+" · "+g.In+" A 30 mA typ "+g.type,s=busS(g.In);
   PH.forEach(p=>add(c,p,"szyna zasilająca "+p,"RCD "+g.no+", wejście "+p,s));
   add(c,"N",nSrc,"RCD "+g.no+", wejście N",s,"N przed RCD tylko z tego punktu");
   add(c,"N","RCD "+g.no+", wyjście N","szyna N"+g.no,s,"osobna szyna tej grupy");
   g.items.forEach(x=>phOf(x).forEach(p=>add(c,p,"RCD "+g.no+", wyjście "+p,"obwód "+x.no+" "+x.r.ch+x.r.In+", wejście "+p,x.r.S)));
  }
  g.items.forEach(x=>{const c="Obwód "+x.no+" · "+x.c.name+" · "+cableName(x.r.S,x.r.m,x.r.ph),rb=g.kind==="rcbo";
   if(rb){add(c,x.phase,"szyna zasilająca "+x.phase,"RCBO "+x.no+", wejście "+x.phase,x.r.S);add(c,"N",nSrc,"RCBO "+x.no+", wejście N",x.r.S);}
   phOf(x).forEach(p=>add(c,p,(rb?"RCBO ":"obwód ")+x.no+(rb?"":" "+x.r.ch+x.r.In)+", wyjście "+p,"przewód obwodu, żyła "+p,x.r.S));
   add(c,"N",rb?"RCBO "+x.no+", wyjście N":"szyna N"+g.no,"przewód obwodu, żyła N",x.r.S,x.r.ph===3?"podłącz, gdy odbiornik ma zacisk N":"");
   add(c,"PE","szyna PE","przewód obwodu, żyła PE",x.r.S,"PE omija RCD");});
 });
 return W;
}

/* kontrola zasad */
function polChecks(D){
 const tnc=S.net==="tnc",C=[];
 const add=(ok,t)=>C.push({ok,t});
 if(tnc)add(D.wlz.S>=10,"Przekrój PEN "+fS(D.wlz.S)+" mm² Cu (wymagane min. 10 mm²)");
 add(true,tnc?"PEN rozdzielony przed RCD: najpierw szyna PE, potem mostek do N0. Za punktem podziału układ TN-S":"Układ TN-S: N i PE prowadzone osobno od wejścia");
 add(true,"Każdy RCD ma własną szynę N, a przewód PE omija wszystkie RCD");
 D.groups.filter(g=>g.kind==="rcd").forEach(g=>{const pl=[0,0,0];g.items.forEach(x=>{const I=x.r.IB*x.c.kz;if(x.r.ph===3){pl[0]+=I;pl[1]+=I;pl[2]+=I;}else pl[+x.phase[1]-1]+=I;});
  const m=Math.max(...pl);add(m<=g.In,"RCD "+g.no+": obciążenie najbardziej obciążonej fazy "+fmt(m)+" A przy I<sub>n</sub> "+g.In+" A");});
 const bad=D.rows.filter(x=>!x.r.ok);
 add(!bad.length,bad.length?"Obwody wymagające korekty: "+bad.map(x=>"nr "+x.no).join(", ")+". Sprawdź zakładkę Przewody":"Wszystkie obwody spełniają warunki z zakładki Przewody");
 if(D.wlz.noFit)add(false,"WLZ nie spełnia warunków. Sprawdź zakładkę Bilans");
 return C;
}

function svgPol(D){
 const f3=S.supply==="3f",tnc=S.net==="tnc",PH=f3?["L1","L2","L3"]:["L1"];
 const RY={L1:72,L2:88,L3:104},RN=122,TOP=150,BOT=226,GRY={L1:250,L2:264,L3:278},MT=300,MB=356,NB=400,PB=444,TE=490,LB=512;
 const CW=92,LN=14,PX={L1:38,L2:60,L3:82},C0=76,MG=26,X0=46;
 let gx=X0;const G=[];
 D.groups.forEach(g=>{const its=g.kind==="rcd"?D.blocks.find(b=>b.g===g).items.filter(d=>d.k==="mcb").map(d=>d.x):g.items;
  const w=g.kind==="rcd"?C0+its.length*CW+6:CW+8;G.push({g,its,x:gx,w});gx+=w+MG;});
 const xS=gx+4,sw=f3?118:74,xH=xS+sw+18,hw=f3?118:74,xN=xH+hw+26,xP=xN+150,xF=xP+34,pF=f3?{L1:xF+18,L2:xF+46,L3:xF+74}:{N:xF+18,L1:xF+50},fw=f3?92:68,W=xF+fw+62,H=772,yW=716;
 const LBG=[],BAR=[],VER=[],BOX=[],DOT=[],TXT=[];
 const T=(x,y,t,o)=>{o=o||{};TXT.push(`<text x="${x}" y="${y}" font-family="Arial,Helvetica,sans-serif" font-size="${o.s||10.5}" font-weight="${o.b?700:400}" fill="${o.c||WIRE.INK}" text-anchor="${o.a||"start"}"${o.r?` transform="rotate(90 ${x} ${y})"`:""}>${esc(t)}</text>`);};
 const line=(a,b,c,d,col,w,ex)=>`<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="${col}" stroke-width="${w}"${ex||""}/>`;
 const hb=(a,c,y,col,w)=>BAR.push(line(a,y,c,y,col,w||3));
 const dot=(x,y)=>DOT.push(`<circle cx="${x}" cy="${y}" r="3.6" fill="${WIRE.INK}"/>`);
 /* przewód pionowy z przerwą w tle: bez kropki znaczy brak połączenia */
 const v=(x,y1,y2,k,w)=>{w=w||3;const a=Math.min(y1,y2),b=Math.max(y1,y2);if(b-a>16)VER.push(line(x,a+7,x,b-7,WIRE.BG,w+4));
  if(k==="PE"){VER.push(line(x,a,x,b,WIRE.G,w)+line(x,a,x,b,WIRE.Y,w,' stroke-dasharray="7 7"'));}else VER.push(line(x,a,x,b,WIRE[k],w));};
 const box=(x,y,w,h,col)=>BOX.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="#FFFFFF" stroke="${col||"#444441"}" stroke-width="1.2"/>`);

 /* szyny zasilające przed RCD */
 const xFN=f3?xN:pF.N, x0=X0-12;
 PH.forEach(p=>{hb(x0,pF[p],RY[p],WIRE[p]);T(10,RY[p]+4,p,{b:1,c:p==="L3"?"#5F5E5A":WIRE[p]});});
 hb(x0,xFN,RN,WIRE.N);T(10,RN+4,f3?"N0":"N",{b:1,c:"#185FA5"});

 /* grupy */
 G.forEach(o=>{const g=o.g,x=o.x;
  BOX.unshift(`<rect x="${x}" y="134" width="${o.w}" height="${TE-120}" rx="6" fill="${g.color}" fill-opacity=".07" stroke="${g.color}" stroke-opacity=".55"/>`);
  if(g.kind==="rcd"){
   const nx=x+LN,used={};o.its.forEach(i=>phOf(i).forEach(p=>{used[p]=1;}));
   v(nx,RN,TOP,"N");dot(nx,RN);
   PH.forEach(p=>{const px=x+PX[p];v(px,RY[p],TOP,p);dot(px,RY[p]);});
   box(x+4,TOP,102,BOT-TOP,g.color);
   T(nx,TOP+13,"N",{s:9.5,a:"middle",c:WIRE.MUT});PH.forEach(p=>{T(x+PX[p],TOP+13,p,{s:9.5,a:"middle",c:WIRE.MUT});T(x+PX[p],BOT-5,p,{s:9.5,a:"middle",c:WIRE.MUT});});T(nx,BOT-5,"N",{s:9.5,a:"middle",c:WIRE.MUT});
   T(x+55,TOP+32,"RCD "+g.no,{b:1,a:"middle",s:12});T(x+55,TOP+47,g.In+" A 30 mA typ "+g.type,{a:"middle",s:9.5,c:WIRE.MUT});T(x+55,TOP+59,g.poles+"P",{a:"middle",s:9.5,c:WIRE.MUT});
   /* N z RCD na własną szynę */
   v(nx,BOT,NB,"N");dot(nx,NB);
   BAR.push(`<rect x="${x+8}" y="${NB-4}" width="${o.w-16}" height="8" fill="${WIRE.N}"/>`);
   T(x+o.w-10,NB-8,"N"+g.no,{a:"end",b:1,c:"#185FA5",s:10});
   PH.forEach(p=>{const px=x+PX[p];if(!used[p]){BOX.push(`<circle cx="${px}" cy="${BOT+6}" r="3.5" fill="${WIRE.BG}" stroke="${WIRE[p]}" stroke-width="1.4"/>`);return;}
    const ts=[];o.its.forEach((i,j)=>{const cx=x+C0+j*CW+CW/2;const pos=i.r.ph===3?{L1:cx-30,L2:cx-18,L3:cx-6}[p]:cx-18;if(phOf(i).includes(p))ts.push(pos);});
    const a=Math.min(px,...ts),b=Math.max(px,...ts);if(b>a)hb(a,b,GRY[p],WIRE[p]);v(px,BOT,GRY[p],p);dot(px,GRY[p]);ts.forEach(t=>{v(t,GRY[p],MT,p);if(t!==px)dot(t,GRY[p]);});});
  }
  o.its.forEach((i,j)=>{const cx=g.kind==="rcd"?x+C0+j*CW+CW/2:x+o.w/2,r=i.r,rb=g.kind==="rcbo";
   const lx=r.ph===3?{L1:cx-30,L2:cx-18,L3:cx-6}:{[i.phase]:cx-18},nxx=r.ph===3?cx+10:cx,pex=r.ph===3?cx+26:cx+18;
   if(rb){v(lx[i.phase],RY[i.phase],MT,i.phase);dot(lx[i.phase],RY[i.phase]);v(nxx,RN,MT,"N");dot(nxx,RN);}
   Object.keys(lx).forEach(p=>v(lx[p],MB,TE,p));
   if(rb)v(nxx,MB,TE,"N");else{v(nxx,NB,TE,"N");dot(nxx,NB);}
   v(pex,PB,TE,"PE");dot(pex,PB);
   const bx=r.ph===3?cx-42:cx-40,bw=r.ph===3?48:rb?62:44;box(bx,MT,bw,MB-MT,g.color);
   T(bx+bw/2,MT+18,r.ch+r.In,{b:1,a:"middle",s:12});T(bx+bw/2,MT+32,(rb?"RCBO ":"")+"nr "+i.no,{a:"middle",s:9.5,c:WIRE.MUT});T(bx+bw/2,MT+46,r.ph===3?"3P":i.phase,{a:"middle",s:9.5,b:1,c:r.ph===3?WIRE.MUT:(i.phase==="L3"?"#5F5E5A":WIRE[i.phase])});
   BOX.push(`<rect x="${cx-40}" y="${TE}" width="80" height="12" rx="2" fill="#E4E1D8" stroke="#888780"/>`);
   const nm=i.c.name.length>27?i.c.name.slice(0,26)+"…":i.c.name;
   T(cx+4,LB+4,i.no+". "+nm,{b:1,s:10.5,r:1});T(cx-11,LB+4,cableName(r.S,r.m,r.ph)+" · "+i.phase.replace("L1L2L3","L1 L2 L3")+" · "+fmt(i.c.P,1)+" kW",{s:9.5,c:WIRE.MUT,r:1});});
 });

 /* ogranicznik i lampki */
 const pinS=x0=>f3?{L1:x0+16,L2:x0+40,L3:x0+64,N:x0+92}:{L1:x0+18,N:x0+50};
 [[xS,sw,"SPD",f3?"T1+T2 3P+N":"T1+T2 1P+N"],[xH,hw,"H",f3?"L1 L2 L3":"L1"]].forEach(a=>{const P=pinS(a[0]);
  PH.forEach(p=>{v(P[p],RY[p],TOP,p);dot(P[p],RY[p]);});v(P.N,RN,TOP,"N");dot(P.N,RN);box(a[0],TOP,a[1],BOT-TOP);
  Object.keys(P).forEach(p=>T(P[p],TOP+13,p,{s:9.5,a:"middle",c:WIRE.MUT}));T(a[0]+a[1]/2,TOP+34,a[2],{b:1,a:"middle",s:12});T(a[0]+a[1]/2,TOP+49,a[3],{a:"middle",s:9.5,c:WIRE.MUT});});
 v(xS+sw/2,BOT,PB,"PE");dot(xS+sw/2,PB);T(xS+sw/2,BOT-6,"PE",{s:9.5,a:"middle",c:"#27500A"});

 /* szyny N0 i PE */
 BAR.push(`<rect x="${xN-14}" y="${NB-5}" width="132" height="10" fill="${WIRE.N}"/>`);
 BAR.push(`<rect x="${X0-22}" y="${PB-6}" width="${xP+5-(X0-22)}" height="12" fill="${WIRE.G}"/>`+line(X0-22,PB,xP+5,PB,WIRE.Y,4,' stroke-dasharray="10 10"'));
 T(X0+6,PB+22,"Główna szyna PE",{b:1,c:"#27500A",s:10.5});
 T(xN+118,NB-9,"Szyna N0 (przed RCD)",{a:"end",b:1,c:"#185FA5",s:10});
 if(f3){v(xN,RN,NB,"N",4);dot(xN,RN);dot(xN,NB);}
 else{BAR.push(line(xN,NB,xN,240,WIRE.N,3)+line(xN,240,pF.N,240,WIRE.N,3));v(pF.N,240,BOT,"N");v(pF.N,RN,TOP,"N");dot(xN,NB);}

 /* rozłącznik i WLZ od dołu po prawej */
 PH.forEach(p=>{v(pF[p],RY[p],TOP,p);dot(pF[p],RY[p]);v(pF[p],BOT,yW,p);});
 box(xF,TOP,fw,BOT-TOP);Object.keys(pF).forEach(p=>{T(pF[p],TOP+13,p,{s:9.5,a:"middle",c:WIRE.MUT});T(pF[p],BOT-5,p,{s:9.5,a:"middle",c:WIRE.MUT});});
 T(xF+fw/2,TOP+34,"FR",{b:1,a:"middle",s:12});T(xF+fw/2,TOP+49,(f3?"3P ":"2P ")+D.FR+" A",{a:"middle",s:9.5,c:WIRE.MUT});
 if(tnc){
  VER.push(line(xP,PB,xP,yW,WIRE.BG,0)+line(xP,PB,xP,yW,WIRE.G,6)+line(xP,PB,xP,yW,WIRE.Y,6,' stroke-dasharray="9 9"'));
  VER.push(`<rect x="${xP-5}" y="${PB+7}" width="10" height="11" fill="${WIRE.N}"/><rect x="${xP-5}" y="${yW-11}" width="10" height="11" fill="${WIRE.N}"/>`);
  dot(xP,PB);T(xP-10,yW-20,"PEN",{a:"end",b:1,c:WIRE.RED,s:13});
  VER.push(line(xN+74,PB-6,xN+74,NB+5,WIRE.N,5));dot(xN+74,PB-6);dot(xN+74,NB+5);T(xN+82,NB+27,"mostek",{c:"#185FA5",s:10});
 }else{
  v(xN+108,NB,yW,"N",3);dot(xN+108,NB);v(xP,PB,yW,"PE",4);dot(xP,PB);T(xN+102,yW-14,"N",{a:"end",b:1,c:"#185FA5",s:12});T(xP-8,yW-14,"PE",{a:"end",b:1,c:"#27500A",s:12});
 }
 const bx=xN-22,bw=W-bx-(W-xP)+22;
 BOX.push(`<rect x="${bx}" y="${NB-30}" width="${bw}" height="150" rx="5" fill="none" stroke="${WIRE.RED}" stroke-width="1.5" stroke-dasharray="6 4"/>`);
 T(bx+8,NB+64,tnc?"Podział PEN":"Wejście N i PE",{b:1,c:WIRE.RED,s:12});
 if(tnc){T(bx+8,NB+82,"1. PEN na szynę PE",{c:WIRE.RED,s:10});T(bx+8,NB+96,"2. Mostek PE do N0",{c:WIRE.RED,s:10});T(bx+8,NB+110,"3. Dalej N i PE osobno",{c:WIRE.RED,s:10});}
 else{T(bx+8,NB+82,"N na szynę N0",{c:WIRE.RED,s:10});T(bx+8,NB+96,"PE na szynę PE",{c:WIRE.RED,s:10});T(bx+8,NB+110,"Bez mostka N z PE",{c:WIRE.RED,s:10});}
 BOX.push(`<rect x="${xN-6}" y="${yW}" width="${W-xN-8}" height="46" rx="4" fill="#E4E1D8" stroke="#888780"/>`);
 T((xN-6+W-8)/2,yW+19,"WLZ "+wlzName(D),{b:1,a:"middle",s:12});
 T((xN-6+W-8)/2,yW+35,tnc?(f3?"L1 L2 L3 PEN · TN-C":"L1 PEN · TN-C"):(f3?"L1 L2 L3 N PE · TN-S":"L1 N PE · TN-S"),{a:"middle",s:9.5,c:WIRE.MUT});

 /* GSU */
 v(X0-14,PB,yW,"PE",3);dot(X0-14,PB+6);
 BOX.push(`<rect x="${X0-30}" y="${yW}" width="178" height="46" rx="4" fill="#E4E1D8" stroke="#888780"/>`);
 T(X0+59,yW+19,"GSU i uziom",{b:1,a:"middle",s:12});T(X0+59,yW+35,"połączenia wyrównawcze",{a:"middle",s:9.5,c:WIRE.MUT});

 /* legenda */
 const lg=[["L1","brązowy"],["L2","czarny"],["L3","szary"],["N","niebieski"],["PE","żółto-zielony"],["PEN","żółto-zielony + niebieskie końce"]];let lx=12;const LG=[];
 lg.filter(a=>f3||(a[0]!=="L2"&&a[0]!=="L3")).filter(a=>tnc||a[0]!=="PEN").forEach(a=>{const k=a[0];
  if(k==="PE"||k==="PEN"){LG.push(line(lx,20,lx+32,20,WIRE.G,4)+line(lx,20,lx+32,20,WIRE.Y,4,' stroke-dasharray="7 7"'));if(k==="PEN")LG.push(`<rect x="${lx}" y="16" width="6" height="8" fill="${WIRE.N}"/><rect x="${lx+26}" y="16" width="6" height="8" fill="${WIRE.N}"/>`);}
  else LG.push(line(lx,20,lx+32,20,WIRE[k],4));
  T(lx+38,24,k+" "+a[1],{s:11});lx+=38+Math.round((k.length+a[1].length+1)*6.1)+18;});
 LG.push(`<circle cx="${lx+4}" cy="20" r="3.6" fill="${WIRE.INK}"/>`);T(lx+13,24,"kropka = połączenie, krzyżowanie bez kropki = brak połączenia",{s:11});
 T(12,46,S.name,{b:1,s:12});
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Schemat połączeń przewodów w rozdzielnicy"><rect width="${W}" height="${H}" fill="${WIRE.BG}"/>`+BOX.filter(s=>s.includes('fill-opacity')).join("")+BAR.join("")+VER.join("")+BOX.filter(s=>!s.includes('fill-opacity')).join("")+DOT.join("")+LG.join("")+TXT.join("")+"</svg>";
}
function renderPol(D){
 const host=$("#polacz");
 if(!D.rows.length){host.innerHTML='<div class="empty">Dodaj obwody, a schemat połączeń powstanie tutaj.</div>';return;}
 const W=wiring(D),C=polChecks(D),bad=C.filter(c=>!c.ok).length,dotc=k=>k==="PE"||k==="PEN"?"background:repeating-linear-gradient(90deg,#2E8B3A 0 3px,#F4D21F 3px 6px)":"background:"+WIRE[k];
 let sec="",rows="",n=0;W.forEach(w=>{if(w.sec!==sec){sec=w.sec;rows+=`<tr><td colspan="6" class="wsec">${esc(sec)}</td></tr>`;}n++;
  rows+=`<tr><td>${n}</td><td style="white-space:nowrap"><span class="dot" style="${dotc(w.k)}"></span>${w.k}</td><td>${esc(w.from)}</td><td>${esc(w.to)}</td><td class="r">${fS(w.s)} mm²</td><td>${esc(w.uw)}</td></tr>`;});
 host.innerHTML=`<div class="stack" style="margin-bottom:14px">
  <div class="${bad?"note":"tip"}">${bad?bad+(bad===1?" punkt wymaga":" punkty wymagają")+" poprawy, zanim wykonasz połączenia.":"Schemat spełnia zasady sprawdzane przez program. Zmiana obwodu, fazy albo układu sieci od razu przerysowuje połączenia."}</div></div>
 <div class="row" style="margin-bottom:10px"><button class="btn ghost" type="button" id="p-fit">${polFit?"Pokaż w pełnej skali":"Dopasuj do szerokości"}</button><button class="btn ghost" type="button" id="p-svg">Pobierz schemat (SVG)</button><button class="btn ghost" type="button" id="p-copy">Kopiuj listę połączeń</button><span class="chip" id="p-st">${S.supply==="3f"?"3 fazy":"1 faza"} · ${S.net==="tnc"?"TN-C, podział PEN":"TN-S"}</span></div>
 <div class="draw${polFit?" fit":""}" id="p-draw">${svgPol(D)}</div>
 <p class="caption">Rys. 3. Schemat połączeń, schemat poglądowy. Układ aparatów w kolejności z zakładki Rozdzielnica. Przewiń w bok na telefonie.</p>
 <h3><span class="n">07.1</span>Kontrola połączeń</h3>
 <div class="stack">${C.map(c=>`<div class="${c.ok?"tip":"note"}"><span>${c.t}</span></div>`).join("")}</div>
 <h3><span class="n">07.2</span>Kolejność łączenia</h3>
 <ol class="pipe"><li><b>Odłącz zasilanie</b>wyłącz i zabezpiecz przed załączeniem, sprawdź brak napięcia</li>
 <li><b>${S.net==="tnc"?"Podziel PEN":"Podłącz N i PE"}</b>${S.net==="tnc"?"PEN na szynę PE, potem mostek do N0":"N na N0, PE na szynę PE, bez mostka"}</li>
 <li><b>Podłącz szynę PE</b>do GSU i uziomu, potem PE wszystkich obwodów</li>
 <li><b>Podłącz fazy</b>WLZ do FR, z FR do SPD, lampek i wejść RCD</li>
 <li><b>Podłącz N</b>z N0 na wejścia RCD, z wyjść RCD na szyny N1, N2 i kolejne</li>
 <li><b>Podłącz obwody</b>fazy z wyłączników, N z szyny swojego RCD</li>
 <li><b>Sprawdź</b>dokręcenie zacisków, pomiary i przycisk testu każdego RCD</li></ol>
 <h3><span class="n">07.3</span>Lista połączeń</h3>
 <p class="lead">Każdy przewód z rysunku: kolor, skąd, dokąd i przekrój. Połączenia wewnętrzne wykonuje się przewodem jednożyłowym H07V-K (LgY) w tuleikach albo szyną grzebieniową o obciążalności nie mniejszej niż podana.</p>
 <div class="scroll"><table class="t" id="p-tab"><thead><tr><th>Nr</th><th>Żyła</th><th>Skąd</th><th>Dokąd</th><th class="r">Przekrój</th><th>Uwaga</th></tr></thead><tbody>${rows}</tbody></table></div>
 <h3><span class="n">07.4</span>Zasady</h3>
 <div class="stack">
  <div class="law">PN-HD 60364-4-41, pkt 411.4 · RCD nie stosuje się w układzie TN-C. W TN-C-S za RCD nie może być PEN, a przewód ochronny przyłącza się do PEN po stronie zasilania RCD</div>
  <div class="law">PN-HD 60364-5-54, pkt 543.4 · PEN min. 10 mm² Cu. Przy rozdzieleniu PEN dochodzi do zacisku lub szyny PE. Od punktu rozdzielenia N i PE nie wolno ponownie łączyć</div>
  <div class="law">PN-EN 60445, PN-HD 308 S2 · N niebieski, PE żółto-zielony, PEN żółto-zielony z niebieskimi końcami albo niebieski z żółto-zielonymi końcami; fazy brązowy, czarny, szary</div>
  <div class="law">PN-HD 60364-5-534 · SPD przy wprowadzeniu zasilania, przed RCD, przewody łączące łącznie do 0,5 m, typ 1 z przewodem do PE min. 16 mm² Cu; zabezpieczenie wstępne i układ połączeń wg producenta</div>
  <div class="note"><span>Położenie zacisku N w RCD i kolejność biegunów zależą od producenta, łącz według oznaczeń na aparacie. Ten rysunek nie zastępuje projektu. Prace w rozdzielnicy wykonuje osoba z uprawnieniami elektrycznymi, a po zakończeniu trzeba wykonać pomiary.</span></div>
 </div>`;
 $("#p-fit").onclick=()=>{polFit=!polFit;$("#p-draw").classList.toggle("fit",polFit);$("#p-fit").textContent=polFit?"Pokaż w pełnej skali":"Dopasuj do szerokości";};
 $("#p-svg").onclick=()=>{const u=URL.createObjectURL(new Blob([$("#p-draw").innerHTML],{type:"image/svg+xml"}));const a=document.createElement("a");a.href=u;a.download="schemat-polaczen-rozdzielnicy.svg";root.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1000);};
 $("#p-copy").onclick=()=>{const tsv=["Lp.\tŻyła\tSkąd\tDokąd\tPrzekrój mm²\tUwaga\tGrupa"].concat(W.map((w,i)=>[i+1,w.k,w.from,w.to,fS(w.s),w.uw,w.sec].join("\t"))).join("\n");const st=$("#p-st");
  try{navigator.clipboard.writeText(tsv).then(()=>{st.textContent="skopiowano";st.className="chip ok";},()=>{st.textContent="nie udało się skopiować";st.className="chip er";});}catch(e){st.textContent="nie udało się skopiować";st.className="chip er";}};
}

