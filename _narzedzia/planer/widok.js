/* widok rozdzielnicy: aparaty i przewody tak, jak stoją na szynach DIN (rzędy z zakładki Rozdzielnica) */
function svgBoard(D){
 const f3=S.supply==="3f",tnc=S.net==="tnc",PH=f3?["L1","L2","L3"]:["L1"];
 const U=46,DH=128,GR=38,ex=12,x0=ex+80,RLX=f3?{L3:ex+24,L2:ex+40,L1:ex+56}:{L1:ex+32,N:ex+56};
 const rows=D.lay.map(r=>{const gap={};r.forEach((d,i)=>{if(d.k==="rcd"&&r[i+1]&&r[i+1].g===d.g)gap[d.col+d.w-1]=1;});
  const X=[];let e=0;for(let k=0;k<D.W;k++){X[k]=x0+k*U+e;if(gap[k])e+=GR;}
  return {it:r.map(d=>Object.assign({},d,{px:X[d.col],mx:m=>X[d.col]+m*U+U/2})),X,e};});
 const xR=x0+D.W*U+Math.max(0,...rows.map(r=>r.e))+22,xRN=xR+12,xRP=xR+32,xPEN=xR+56,RRX=f3?{L3:xR+78,L2:xR+94,L1:xR+110}:{L1:xR+110},W=xR+136;
 const WY=f3?{L1:84,L2:96,L3:108}:{N:84,L1:96};
 const by=ry=>f3?{L3:ry,L2:ry+11,L1:ry+22,N:ry+33}:{L1:ry+11,N:ry+33};
 const cy=ry=>({L3:ry+52,L2:ry+62,L1:ry+72});
 let ry=130;rows.forEach(r=>{r.ry=ry;r.dy=ry+88;r.ns=r.dy+170;r.ps=r.dy+196;r.te=r.dy+226;ry+=r.it.length?462:190;});
 const bz=ry-10,N0Y=bz+24,PBY=bz+84,yW=bz+204,H=yW+60;
 const full=rows.filter(r=>r.it.length),BK=[],STR=[],BAR=[],DEV=[],VER=[],DOT=[],TXT=[];
 const T=(x,y,t,o)=>{o=o||{};TXT.push(`<text x="${x}" y="${y}" font-family="Arial,Helvetica,sans-serif" font-size="${o.s||10.5}" font-weight="${o.b?700:400}" fill="${o.c||WIRE.INK}" text-anchor="${o.a||"start"}"${o.r?` transform="rotate(90 ${x} ${y})"`:""}>${esc(t)}</text>`);};
 const line=(a,b,c,d,col,w,e2)=>`<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="${col}" stroke-width="${w}"${e2||""}/>`;
 const dot=(x,y)=>DOT.push(`<circle cx="${x}" cy="${y}" r="3.2" fill="${WIRE.INK}"/>`);
 const hb=(a,c,y,k,w)=>{w=w||3;BAR.push(line(a,y,c,y,WIRE[k],w,' stroke-linecap="round"'));};
 const v=(x,y1,y2,k,w)=>{w=w||3;const a=Math.min(y1,y2),b=Math.max(y1,y2);if(b-a>14)VER.push(line(x,a+6,x,b-6,"#DAD7CF",w+4));
  if(k==="PE")VER.push(line(x,a,x,b,WIRE.G,w)+line(x,a,x,b,WIRE.Y,w,' stroke-dasharray="7 7"'));else VER.push(line(x,a,x,b,WIRE[k],w,' stroke-linecap="round"'));};
 const screw=(x,y,r)=>{r=r||6;return `<circle cx="${x}" cy="${y}" r="${r}" fill="#C9C6BE" stroke="#77756E"/><line x1="${x-r+2}" y1="${y+r/2}" x2="${x+r-2}" y2="${y-r/2}" stroke="#55534E" stroke-width="1.4"/>`;};
 const body=(x,dy,w,col)=>DEV.push(`<rect x="${x+1}" y="${dy}" width="${w-2}" height="${DH}" rx="3" fill="#F8F7F3" stroke="#6E6C66"/><rect x="${x+4}" y="${dy+22}" width="${w-8}" height="${DH-44}" rx="2" fill="#FFFFFF" stroke="#CFCBC2"/>`+(col?`<rect x="${x+1}" y="${dy}" width="${w-2}" height="5" rx="2" fill="${col}"/>`:""));
 const pins=(xs,dy,top,bot)=>xs.forEach(x=>{if(top)DEV.push(screw(x,dy+13));if(bot)DEV.push(screw(x,dy+DH-13));});
 const lever=(x,y,col)=>DEV.push(`<rect x="${x-7}" y="${y}" width="14" height="28" rx="3" fill="#D8D5CC" stroke="#6E6C66"/><rect x="${x-5}" y="${y+2}" width="10" height="13" rx="2" fill="${col||"#2A2D31"}"/>`);
 const phc=p=>p==="L3"?"#5F5E5A":WIRE[p];
 const TP=13,BP=DH-13;

 /* obudowa, szyny DIN, wolne pola */
 BK.push(`<rect x="${ex-6}" y="60" width="${W-ex+6}" height="${bz+172-60}" rx="12" fill="#3A3F45"/><rect x="${ex}" y="66" width="${W-ex-6}" height="${bz+160-66}" rx="7" fill="#DAD7CF"/>`);
 rows.forEach((r,i)=>{const y=r.dy+DH/2;BK.push(`<rect x="${x0-12}" y="${y-11}" width="${xR-x0+2}" height="22" fill="#A9ACAE" stroke="#85888A"/>`);
  for(let x=x0;x<xR-24;x+=40)BK.push(`<rect x="${x}" y="${y-3}" width="20" height="6" rx="3" fill="#7E8184"/>`);
  T(ex+66,y+4,"R"+(i+1),{b:1,a:"end",s:11,c:WIRE.MUT});
  const occ=new Array(D.W).fill(false);r.it.forEach(d=>{for(let k=0;k<d.w;k++)occ[d.col+k]=true;});
  occ.forEach((o,k)=>{if(!o)BK.push(`<rect x="${r.X[k]+2}" y="${r.dy+22}" width="${U-4}" height="${DH-44}" rx="2" fill="#ECE9E2" stroke="#A9A69C" stroke-dasharray="3 3"/>`);});});

 /* zasilanie: WLZ do FR, pętla z FR na szyny zasilające */
 const r0=rows[0],fr=r0.it.find(d=>d.k==="fr"),b1=by(r0.ry),lastBus=by(full[full.length-1].ry),FP=f3?["L1","L2","L3"]:["N","L1"];
 FP.forEach((p,i)=>{const px=fr.mx(i),ly=r0.dy+DH+6+i*10,rx=RLX[p],top=p==="N"?xRN:RRX[p];
  v(px,WY[p],r0.dy+TP,p,4);hb(px,top,WY[p],p,4);if(p!=="N")v(top,WY[p],yW,p,4);
  v(px,r0.dy+BP,ly,p);hb(rx,px,ly,p);v(rx,b1[p],Math.max(ly,lastBus[p]),p);if(ly<lastBus[p])dot(rx,ly);});
 if(f3)v(xRN,b1.N,N0Y,"N",4);else v(xRN,WY.N,N0Y,"N",4);

 /* rzędy */
 const seenN={};
 rows.forEach((r,ri)=>{if(!r.it.length)return;const dy=r.dy,B=by(r.ry),C=cy(r.ry),tap={L1:[],L2:[],L3:[],N:[]};
  const bus=(p,x)=>{tap[p].push(x);v(x,B[p],dy+TP,p);dot(x,B[p]);};
  let peMin=xRP;const peT=x=>{peMin=Math.min(peMin,x);dot(x,r.ps);};
  const P=f3?["L1","L2","L3","N"]:["L1","N"];
  r.it.forEach(d=>{const w=d.w*U,cx=d.px+w/2;
   if(d.k==="fr"){body(d.px,dy,w);pins(FP.map((p,i)=>d.mx(i)),dy,1,1);lever(cx,dy+42,"#B3261E");T(cx,dy+84,"FR",{b:1,a:"middle",s:13});T(cx,dy+97,(f3?"3P ":"2P ")+D.FR+" A",{a:"middle",s:9.5,c:WIRE.MUT});FP.forEach((p,i)=>T(d.mx(i),dy+29,p,{a:"middle",s:8.5,c:WIRE.MUT}));}
   else if(d.k==="spd"){body(d.px,dy,w);P.forEach((p,i)=>{bus(p,d.mx(i));DEV.push(`<rect x="${d.px+i*U+6}" y="${dy+44}" width="${U-12}" height="42" rx="2" fill="#E9E6DE" stroke="#8C897F"/><rect x="${d.px+i*U+12}" y="${dy+50}" width="${U-24}" height="10" rx="1" fill="#2F9E44"/>`);T(d.mx(i),dy+33,p,{a:"middle",s:8.5,c:WIRE.MUT});});pins(P.map((p,i)=>d.mx(i)),dy,1,0);DEV.push(screw(cx,dy+BP));T(cx,dy+102,"SPD T1+T2",{b:1,a:"middle",s:10.5});
    v(cx,dy+BP,r.ps,"PE",4);peT(cx);}
   else if(d.k==="lamp"){body(d.px,dy,w);const xs=P.map((p,i)=>cx+(i-(P.length-1)/2)*(f3?10:18));P.forEach((p,i)=>{bus(p,xs[i]);DEV.push(screw(xs[i],dy+TP,3.6));});PH.forEach((p,i)=>DEV.push(`<circle cx="${cx}" cy="${dy+44+i*17}" r="6" fill="#3FBF5F" stroke="#27500A"/>`));T(cx,dy+102,"H",{b:1,a:"middle",s:12});}
   else if(d.k==="rcd"){const g=d.g;body(d.px,dy,w,g.color);const ps=[d.mx(0)].concat(PH.map((p,i)=>d.mx(i+1)));pins(ps,dy,1,1);bus("N",d.mx(0));PH.forEach((p,i)=>bus(p,d.mx(i+1)));
    lever(d.mx(.5),dy+38);DEV.push(`<circle cx="${d.mx(d.w-1)}" cy="${dy+50}" r="9" fill="#F4D21F" stroke="#7A6A10"/>`);T(d.mx(d.w-1),dy+54,"T",{b:1,a:"middle",s:10});
    T(cx,dy+80,"RCD "+g.no,{b:1,a:"middle",s:13});T(cx,dy+93,g.In+" A 30 mA typ "+g.type,{a:"middle",s:f3?9.5:7.5,c:WIRE.MUT});
    T(d.mx(0),dy+33,"N",{a:"middle",s:8.5,c:WIRE.MUT});PH.forEach((p,i)=>T(d.mx(i+1),dy+33,p,{a:"middle",s:8.5,c:WIRE.MUT}));}
   else if(d.k==="mcb"){const x=d.x,ph=phOf(x),xs=ph.map((p,i)=>d.mx(i));body(d.px,dy,w,d.g.color);pins(xs,dy,1,1);lever(cx,dy+30);T(cx,dy+76,x.r.ch+x.r.In,{b:1,a:"middle",s:13});T(cx,dy+89,"nr "+x.no,{a:"middle",s:9.5,c:WIRE.MUT});T(cx,dy+101,x.r.ph===3?"3P":x.phase,{b:1,a:"middle",s:9.5,c:x.r.ph===3?WIRE.MUT:phc(x.phase)});}
   else if(d.k==="rcbo"){const x=d.x,lx=d.mx(0),nx=d.mx(1);body(d.px,dy,w,d.g.color);pins([lx,nx],dy,1,1);bus(x.phase,lx);bus("N",nx);lever(cx,dy+30);T(cx,dy+76,x.r.ch+x.r.In,{b:1,a:"middle",s:13});T(cx,dy+89,"RCBO nr "+x.no,{a:"middle",s:9.5,c:WIRE.MUT});T(cx,dy+101,x.phase+" · 30 mA",{b:1,a:"middle",s:9,c:phc(x.phase)});
    v(lx,dy+BP,r.te,x.phase);v(nx,dy+BP,r.te,"N");const pex=nx+14;v(pex,r.ps,r.te,"PE");peT(pex);
    DEV.push(`<rect x="${lx-10}" y="${r.te}" width="${pex-lx+20}" height="12" rx="2" fill="#E4E1D8" stroke="#888780"/>`);
    const nm=x.c.name.length>23?x.c.name.slice(0,22)+"…":x.c.name;T(cx+8,r.te+18,x.no+". "+nm,{b:1,s:10,r:1});T(cx-5,r.te+18,cableName(x.r.S,x.r.m,x.r.ph)+" · "+fmt(x.c.P,1)+" kW",{s:9,c:WIRE.MUT,r:1});}
  });
  /* grupy RCD: pętla na szynę grzebieniową, szyna N, odpływy */
  [...new Set(r.it.filter(d=>d.k==="rcd"||d.k==="mcb").map(d=>d.g))].forEach(g=>{
   const rc=r.it.find(d=>d.k==="rcd"&&d.g===g),ms=r.it.filter(d=>d.k==="mcb"&&d.g===g);
   const teeth={L1:[],L2:[],L3:[]};ms.forEach(d=>phOf(d.x).forEach((p,i)=>teeth[p].push(d.mx(i))));
   const allPh={};g.items.forEach(x=>phOf(x).forEach(p=>{allPh[p]=1;}));
   const gapX=rc?rc.px+rc.w*U:0,RX={L3:gapX+9,L2:gapX+19,L1:gapX+29},LOOP={L3:0,L2:10,L1:20};
   PH.forEach((p,i)=>{const tx=teeth[p];
    if(tx.length){const a=rc?RX[p]:Math.min(...tx)-14;hb(a,Math.max(...tx),C[p],p,3.5);tx.forEach(x=>{v(x,C[p],dy+TP,p);dot(x,C[p]);});
     if(rc){const pin=rc.mx(i+1),ly=dy+DH+6+LOOP[p];v(pin,dy+BP,ly,p);hb(pin,RX[p],ly,p);v(RX[p],C[p],ly,p);}
     else T(Math.min(...tx)-16,C[p]+3,"z RCD "+g.no,{a:"end",s:9,c:phc(p)});}
    else if(rc){if(allPh[p]){const pin=rc.mx(i+1);v(pin,dy+BP,dy+DH+12,p);T(pin+8,dy+DH+15,"cd. w niższym rzędzie",{s:9,c:phc(p)});}
     else DEV.push(`<circle cx="${rc.mx(i+1)}" cy="${dy+BP}" r="6" fill="none" stroke="${WIRE[p]}" stroke-width="2"/>`);}});
   const last=ms.length?ms[ms.length-1]:rc,x1=(rc?rc.mx(0):ms[0].px)-10,x2=last.px+last.w*U-4;
   STR.push(`<rect x="${x1}" y="${r.ns-7}" width="${x2-x1}" height="14" rx="2" fill="#1F7ACC" stroke="#124F86"/>`);
   T(x1+6,r.ns+4,"N"+g.no+(seenN[g.no]?" cd.":""),{b:1,c:"#FFFFFF",s:10});seenN[g.no]=1;
   if(rc){v(rc.mx(0),dy+BP,r.ns,"N");dot(rc.mx(0),r.ns);}
   ms.forEach(d=>{const x=d.x,ph=phOf(x),xs=ph.map((p,i)=>d.mx(i)),lx=xs[xs.length-1],nx=lx+10,pex=lx+20;
    ph.forEach((p,i)=>v(xs[i],dy+BP,r.te,p));v(nx,r.ns,r.te,"N");dot(nx,r.ns);v(pex,r.ps,r.te,"PE");peT(pex);
    DEV.push(`<rect x="${xs[0]-9}" y="${r.te}" width="${pex-xs[0]+18}" height="12" rx="2" fill="#E4E1D8" stroke="#888780"/>`);
    const cx=(xs[0]+pex)/2,nm=x.c.name.length>23?x.c.name.slice(0,22)+"…":x.c.name;T(cx+8,r.te+18,x.no+". "+nm,{b:1,s:10,r:1});T(cx-5,r.te+18,cableName(x.r.S,x.r.m,x.r.ph)+" · "+fmt(x.c.P,1)+" kW",{s:9,c:WIRE.MUT,r:1});});
  });
  /* szyny zasilające rzędu */
  PH.forEach(p=>{if(tap[p].length)hb(RLX[p],Math.max(...tap[p]),B[p],p,3.5);dot(RLX[p],B[p]);});
  if(f3){hb(Math.min(...tap.N),xRN,B.N,"N",3.5);dot(xRN,B.N);}else if(tap.N.length){hb(RLX.N,Math.max(...tap.N),B.N,"N",3.5);dot(RLX.N,B.N);}
  /* listwa PE rzędu */
  STR.push(`<rect x="${peMin-10}" y="${r.ps-7}" width="${xRP-peMin+16}" height="14" rx="2" fill="${WIRE.G}" stroke="#1E5E28"/>`+line(peMin-10,r.ps,xRP+6,r.ps,WIRE.Y,5,' stroke-dasharray="10 10"'));
  dot(xRP,r.ps);
  if(f3)T(xRN-6,B.N-5,"N0",{a:"end",b:1,s:10,c:"#185FA5"});
 });
 v(xRP,full[0].ps,PBY,"PE",4);

 /* podział PEN i szyny główne */
 STR.push(`<rect x="${xRN-170}" y="${N0Y-7}" width="178" height="14" rx="2" fill="#1F7ACC" stroke="#124F86"/>`);
 STR.push(`<rect x="${xRN-300}" y="${PBY-8}" width="${xPEN+8-(xRN-300)}" height="16" rx="2" fill="${WIRE.G}" stroke="#1E5E28"/>`+line(xRN-300,PBY,xPEN+8,PBY,WIRE.Y,5,' stroke-dasharray="11 11"'));
 dot(xRN,N0Y);dot(xRP,PBY);
 T(xRN-164,N0Y+4,f3?"N0 przed RCD":"N0 przed FR",{b:1,c:"#FFFFFF",s:10});T(xRN-282,PBY+24,"Główna szyna PE",{b:1,c:"#27500A",s:10.5});
 if(tnc){VER.push(line(xPEN,PBY,xPEN,yW,WIRE.G,6)+line(xPEN,PBY,xPEN,yW,WIRE.Y,6,' stroke-dasharray="9 9"')+`<rect x="${xPEN-5}" y="${PBY+9}" width="10" height="11" fill="${WIRE.N}"/><rect x="${xPEN-5}" y="${yW-11}" width="10" height="11" fill="${WIRE.N}"/>`);
  dot(xPEN,PBY);T(xPEN-10,PBY+98,"PEN",{a:"end",b:1,c:WIRE.RED,s:13});
  VER.push(line(xRN-90,PBY-8,xRN-90,N0Y+7,WIRE.N,5));dot(xRN-90,PBY-8);dot(xRN-90,N0Y+7);T(xRN-82,N0Y+36,"mostek",{c:"#185FA5",s:10});
 }else{v(xRN-30,N0Y,yW,"N",4);dot(xRN-30,N0Y);v(xPEN,PBY,yW,"PE",4);dot(xPEN,PBY);T(xRN-38,PBY+98,"N",{a:"end",b:1,c:"#185FA5",s:12});T(xPEN-8,PBY+98,"PE",{a:"end",b:1,c:"#27500A",s:12});}
 const bx=xRN-182;
 DEV.push(`<rect x="${bx}" y="${N0Y-24}" width="${xPEN+14-bx}" height="${PBY+64-(N0Y-24)}" rx="5" fill="none" stroke="${WIRE.RED}" stroke-width="1.6" stroke-dasharray="6 4"/>`);
 T(bx+10,PBY+36,tnc?"Podział PEN":"Wejście N i PE",{b:1,c:WIRE.RED,s:12});
 T(bx+10,PBY+51,tnc?"PEN na szynę PE, mostek do N0":"N na N0, PE na szynę PE",{c:WIRE.RED,s:10});
 /* WLZ i GSU poza obudową */
 const bw=W-(xRN-60)-8;
 DEV.push(`<rect x="${xRN-60}" y="${yW}" width="${bw}" height="46" rx="4" fill="#E4E1D8" stroke="#888780"/>`);
 T(xRN-60+bw/2,yW+19,"WLZ "+wlzName(D),{b:1,a:"middle",s:12});T(xRN-60+bw/2,yW+35,tnc?(f3?"L1 L2 L3 PEN · TN-C":"L1 PEN · TN-C"):(f3?"L1 L2 L3 N PE · TN-S":"L1 N PE · TN-S"),{a:"middle",s:9.5,c:WIRE.MUT});
 const gx=xRN-292;v(gx,PBY,yW,"PE",4);dot(gx,PBY);
 DEV.push(`<rect x="${gx-90}" y="${yW}" width="180" height="46" rx="4" fill="#E4E1D8" stroke="#888780"/>`);
 T(gx,yW+19,"GSU i uziom",{b:1,a:"middle",s:12});T(gx,yW+35,"połączenia wyrównawcze",{a:"middle",s:9.5,c:WIRE.MUT});

 /* legenda */
 const lg=[["L1","brązowy"],["L2","czarny"],["L3","szary"],["N","niebieski"],["PE","żółto-zielony"],["PEN","z niebieskimi końcami"]];let lx=12;const LG=[];
 lg.filter(a=>f3||(a[0]!=="L2"&&a[0]!=="L3")).filter(a=>tnc||a[0]!=="PEN").forEach(a=>{const k=a[0];
  if(k==="PE"||k==="PEN"){LG.push(line(lx,20,lx+28,20,WIRE.G,4)+line(lx,20,lx+28,20,WIRE.Y,4,' stroke-dasharray="7 7"'));if(k==="PEN")LG.push(`<rect x="${lx}" y="16" width="6" height="8" fill="${WIRE.N}"/><rect x="${lx+22}" y="16" width="6" height="8" fill="${WIRE.N}"/>`);}
  else LG.push(line(lx,20,lx+28,20,WIRE[k],4));
  T(lx+33,24,k+" "+a[1],{s:11});lx+=33+Math.round((k.length+a[1].length+1)*5.9)+14;});
 LG.push(`<circle cx="${lx+4}" cy="20" r="3.2" fill="${WIRE.INK}"/>`);T(lx+12,24,"kropka = połączenie",{s:11});
 T(12,46,S.name,{b:1,s:12});
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Widok rozdzielnicy z aparatami na szynach DIN i przewodami"><rect width="${W}" height="${H}" fill="${WIRE.BG}"/>`+BK.join("")+STR.join("")+BAR.join("")+DEV.join("")+VER.join("")+DOT.join("")+LG.join("")+TXT.join("")+"</svg>";
}

