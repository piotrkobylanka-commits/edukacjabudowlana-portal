/* ---------- zestawienie materiałów ---------- */
function bomIcon(n){
 const dev=(w,inner)=>{const x=(34-w)/2;return `<rect x="${x}" y="5" width="${w}" height="24" rx="2" fill="#F8F7F3" stroke="#6E6C66"/><rect x="${x+2}" y="10" width="${w-4}" height="14" fill="#FFFFFF" stroke="#CFCBC2" stroke-width=".6"/>${inner}`;};
 const lev=(x,c)=>`<rect x="${x-2.5}" y="12" width="5" height="9" rx="1" fill="${c||"#2A2D31"}"/>`;
 let b="";
 if(/Listwa zaciskowa PE/.test(n))b=`<rect x="4" y="12" width="26" height="10" rx="2" fill="#2E8B3A"/><path d="M4 17h26" stroke="#F4D21F" stroke-width="3" stroke-dasharray="5 5"/>`;
 else if(/Listwa zaciskowa/.test(n))b=`<rect x="4" y="12" width="26" height="10" rx="2" fill="#1F7ACC"/>`+[9,15,21,27].map(x=>`<circle cx="${x-1}" cy="17" r="1.8" fill="#DCEBFA"/>`).join("");
 else if(/Rozdzielnica modułowa/.test(n))b=`<rect x="4" y="4" width="26" height="26" rx="3" fill="#3A3F45"/><rect x="7" y="7" width="20" height="20" rx="1" fill="#DAD7CF"/><rect x="9" y="11" width="16" height="4" fill="#F8F7F3" stroke="#6E6C66" stroke-width=".5"/><rect x="9" y="19" width="16" height="4" fill="#F8F7F3" stroke="#6E6C66" stroke-width=".5"/>`;
 else if(/Rozłącznik/.test(n))b=dev(24,lev(17,"#B3261E"));
 else if(/SPD/.test(n))b=dev(26,[10,17,24].map(x=>`<rect x="${x-2.5}" y="13" width="5" height="5" fill="#2F9E44"/>`).join(""));
 else if(/Lampki/.test(n))b=dev(14,[13,17,21].map(y=>`<circle cx="17" cy="${y}" r="2" fill="#3FBF5F"/>`).join(""));
 else if(/RCBO/.test(n))b=dev(18,lev(13)+`<circle cx="21" cy="16" r="2.4" fill="#F4D21F" stroke="#7A6A10" stroke-width=".5"/>`);
 else if(/RCD/.test(n))b=dev(26,lev(11)+`<circle cx="23" cy="16" r="3" fill="#F4D21F" stroke="#7A6A10" stroke-width=".5"/>`);
 else if(/MCB/.test(n))b=dev(12,lev(17));
 else if(/grzebieniowa/.test(n))b=`<rect x="4" y="11" width="26" height="6" rx="1" fill="#C98A3A"/>`+[8,14,20,26].map(x=>`<rect x="${x-1}" y="17" width="2" height="8" fill="#8B5A2B"/>`).join("");
 else if(/Zaślepki/.test(n))b=`<rect x="11" y="6" width="12" height="22" rx="2" fill="#ECE9E2" stroke="#8C897F" stroke-dasharray="2 2"/>`;
 else if(/Wkładka/.test(n))b=`<rect x="7" y="11" width="20" height="12" rx="2" fill="#E9E6DE" stroke="#6E6C66"/><rect x="3" y="14" width="4" height="6" fill="#B9B3AA"/><rect x="27" y="14" width="4" height="6" fill="#B9B3AA"/>`;
 else b=`<circle cx="17" cy="17" r="12" fill="none" stroke="#6E6C66" stroke-width="3"/><circle cx="17" cy="17" r="7" fill="none" stroke="#8B4A1E" stroke-width="3"/><circle cx="17" cy="17" r="2.5" fill="#1F7ACC"/>`;
 return `<svg viewBox="0 0 34 34" width="34" height="34" aria-hidden="true">${b}</svg>`;
}
/* plik .xls (BIFF8 w kontenerze OLE2), bez zewnętrznych bibliotek */
function bomXls(D,L,grps){
 const u16=n=>[n&255,n>>>8&255],u32=n=>[n&255,n>>>8&255,n>>>16&255,n>>>24&255];
 const w16=s=>{const o=[];for(let i=0;i<s.length;i++)o.push(...u16(s.charCodeAt(i)));return o;};
 const rec=(id,b)=>[...u16(id),...u16(b.length),...b];
 const str16=s=>[...u16(s.length),1,...w16(s)];
 const PAL={10:[30,34,39],11:[242,107,29],12:[243,241,236],13:[207,202,194],14:[79,89,98],15:[251,230,214],9:[255,255,255],8:[0,0,0]};
 const font=(pt,bold,col)=>rec(0x31,[...u16(pt*20),...u16(bold?1:0),...u16(col),...u16(bold?700:400),...u16(0),0,2,238,0,5,1,...w16("Arial")]);
 const F=[[10,0,10],[10,0,10],[10,0,10],[10,0,10],[18,1,10],[10,1,9],[10,1,10],[9,0,14],[11,1,10]];/* indeks 4 w pliku pomijany przez Excel: kolejne mają 5, 6, 7, 8 */
 const X={title:{f:5,v:1},sub:{f:8,v:1,al:1,wrap:1},head:{f:6,fill:10,al:1,v:1},headR:{f:6,fill:10,al:3,v:1},grp:{f:9,fill:15,al:1,v:1},txt:{f:0,al:1,v:1,b:1,wrap:1},ctr:{f:0,al:2,v:1,b:1},num:{f:7,al:3,v:1,b:1},foot:{f:7,fill:12,al:3,v:1},footL:{f:7,fill:12,al:1,v:1}};
 const names=Object.keys(X),sx=n=>16+names.indexOf(n);
 const xf=(o,style)=>{const al=(o.al||0)|(o.wrap?8:0)|((o.v===undefined?2:o.v)<<4);
  return rec(0xE0,[...u16(o.f||0),...u16(0),...u16(style?0xFFF5:1),al,0,0,style?0xF4:0xFC,...u32((o.b?1:0)<<12|64<<16|64<<23),...u32(64|(o.b?13:64)<<7|(o.fill?1:0)<<26),...u16((o.fill||64)|65<<7)]);};
 let g=[...rec(0x809,[...u16(0x600),...u16(5),...u16(0xDBB),...u16(0x7CC),...u32(0),...u32(6)]),...rec(0x42,u16(1200)),...rec(0x3D,[...u16(0),...u16(0),...u16(0x4000),...u16(0x2800),...u16(0x38),...u16(0),...u16(0),...u16(1),...u16(0x258)])];
 F.forEach(a=>{g.push(...font(a[0],a[1],a[2]));});
 for(let i=0;i<15;i++)g.push(...xf({},true));g.push(...xf({},false));names.forEach(n=>g.push(...xf(X[n],false)));
 g.push(...rec(0x293,[0,0x80,0,255]));
 const pal=[...u16(56)];for(let i=8;i<64;i++){const c=PAL[i]||[0,0,0];pal.push(c[0],c[1],c[2],0);}g.push(...rec(0x92,pal));
 const SN="Zestawienie";/* rekord BOUNDSHEET: 4 nagłówek + 8 danych + nazwa */
 const bsLen=4+6+2+SN.length*2,sheetPos=g.length+bsLen+4;
 g.push(...rec(0x85,[...u32(sheetPos),...u16(0),SN.length,1,...w16(SN)]),...rec(0x0A,[]));
 /* wiersze */
 const R=[],MG=[],row=(h,c)=>{R.push({h,c});return R.length-1;};
 const mergeTxt=(h,st,t)=>{const r=row(h,[[0,st,t]]);for(let k=1;k<6;k++)R[r].c.push([k,st,null]);MG.push([r,r,0,5]);};
 mergeTxt(30,"title","Zestawienie materiałów rozdzielnicy");
 mergeTxt(16,"sub",S.name+"  |  "+new Date().toLocaleDateString("pl-PL"));
 mergeTxt(16,"sub","Obudowa "+D.nRows+"×"+D.W+" mod.  |  zajęte "+D.used+" z "+D.total+" mod.  |  układ "+(S.net==="tnc"?"TN-C z podziałem PEN":"TN-S"));
 row(8,[]);
 row(20,[[0,"headR","Lp."],[1,"head","Pozycja"],[2,"head","Parametry"],[3,"headR","Moduły"],[4,"headR","Ilość"],[5,"head","J.m."]]);
 let lp=0;
 grps.forEach(gr=>{const it=L.filter(x=>x.grp===gr&&x.qty>0);if(!it.length)return;
  const r=row(19,[[0,"grp",gr]]);for(let k=1;k<6;k++)R[r].c.push([k,"grp",null]);MG.push([r,r,0,5]);
  it.forEach(x=>{lp++;row(x.par.length>36||x.name.length>38?30:18,[[0,"num",lp],[1,"txt",x.name],[2,"txt",x.par],[3,"num",x.mod===""?null:x.mod],[4,"num",x.qty],[5,"ctr",x.grp==="Przewody"?"m":"szt."]]);});
  const u=gr==="Przewody"?"m":"szt.",s=it.reduce((a,b)=>a+b.qty,0),mo=it.reduce((a,b)=>a+(+b.mod||0)*b.qty,0);
  row(17,[[0,"footL","Razem "+gr.toLowerCase()],[1,"footL",null],[2,"footL",null],[3,"foot",mo||null],[4,"foot",s],[5,"footL",u]]);MG.push([R.length-1,R.length-1,0,2]);});
 row(10,[]);
 mergeTxt(30,"sub","Pozycje generyczne opisane parametrami, numery katalogowe dobierz u producenta. Przewody z zapasem 10%. Narzędzie edukacyjne, nie zastępuje projektu instalacji.");
 mergeTxt(16,"sub","EdukacjaBudowlana  |  www.edukacjabudowlana.pl");
 const WD=[5,38,38,8,8,6];
 const sh=[...rec(0x809,[...u16(0x600),...u16(0x10),...u16(0xDBB),...u16(0x7CC),...u32(0),...u32(6)])];
 sh.push(...rec(0x81,u16(0x05C1)));
 const pd=new DataView(new ArrayBuffer(8));pd.setFloat64(0,0.3,true);const mg=[];for(let k=0;k<8;k++)mg.push(pd.getUint8(k));
 sh.push(...rec(0xA1,[...u16(9),...u16(100),...u16(1),...u16(1),...u16(0),...u16(2),...u16(600),...u16(600),...mg,...mg,...u16(1)]));
 WD.forEach((w,i)=>sh.push(...rec(0x7D,[...u16(i),...u16(i),...u16(w*256),...u16(15),...u16(0),...u16(0)])));
 sh.push(...rec(0x200,[...u32(0),...u32(R.length),...u16(0),...u16(6),...u16(0)]));
 sh.push(...rec(0x23E,[...u16(0x6B4),...u16(0),...u16(0),...u16(64),...u16(0),...u16(0),...u16(0),...u32(0)]));
 R.forEach((r,i)=>{sh.push(...rec(0x208,[...u16(i),...u16(0),...u16(6),...u16(r.h*20),...u16(0),...u16(0),...u16(0x140),...u16(15)]));});
 const dv=new DataView(new ArrayBuffer(8));
 R.forEach((r,i)=>r.c.forEach(c=>{const x=sx(c[1]),v=c[2];
  if(v===null)sh.push(...rec(0x201,[...u16(i),...u16(c[0]),...u16(x)]));
  else if(typeof v==="number"){dv.setFloat64(0,v,true);const b=[];for(let k=0;k<8;k++)b.push(dv.getUint8(k));sh.push(...rec(0x203,[...u16(i),...u16(c[0]),...u16(x),...b]));}
  else sh.push(...rec(0x204,[...u16(i),...u16(c[0]),...u16(x),...str16(String(v))]));}));
 const mc=[...u16(MG.length)];MG.forEach(m=>mc.push(...u16(m[0]),...u16(m[1]),...u16(m[2]),...u16(m[3])));sh.push(...rec(0xE5,mc),...rec(0x0A,[]));
 let wb=g.concat(sh);if(wb.length<4096)wb=wb.concat(new Array(4096-wb.length).fill(0));
 /* kontener OLE2 */
 const SS=512,nW=Math.ceil(wb.length/SS);let nF=1;while((nW+1+nF)>nF*128)nF++;
 const tot=nW+1+nF,o=new Uint8Array(SS*(tot+1)),dv2=new DataView(o.buffer);
 [0xD0,0xCF,0x11,0xE0,0xA1,0xB1,0x1A,0xE1].forEach((b,i)=>{o[i]=b;});
 dv2.setUint16(24,0x3E,true);dv2.setUint16(26,3,true);dv2.setUint16(28,0xFFFE,true);dv2.setUint16(30,9,true);dv2.setUint16(32,6,true);
 dv2.setUint32(44,nF,true);dv2.setUint32(48,nW,true);dv2.setUint32(56,4096,true);dv2.setInt32(60,-2,true);dv2.setInt32(68,-2,true);
 for(let i=0;i<109;i++)dv2.setInt32(76+i*4,i<nF?nW+1+i:-1,true);
 o.set(wb,SS);for(let i=wb.length;i<nW*SS;i++)o[SS+i]=0;
 const dir=SS*(nW+1),ent=(i,name,type,child,start,size)=>{const p=dir+i*128;for(let k=0;k<name.length;k++)dv2.setUint16(p+k*2,name.charCodeAt(k),true);dv2.setUint16(p+64,name?(name.length+1)*2:0,true);o[p+66]=type;o[p+67]=1;dv2.setInt32(p+68,-1,true);dv2.setInt32(p+72,-1,true);dv2.setInt32(p+76,child,true);dv2.setInt32(p+116,start,true);dv2.setUint32(p+120,size,true);};
 ent(0,"Root Entry",5,1,-2,0);ent(1,"Workbook",2,-1,0,wb.length);ent(2,"",0,-1,-1,0);ent(3,"",0,-1,-1,0);
 const fp=SS*(nW+2);for(let i=0;i<nF*128;i++)dv2.setInt32(fp+i*4,-1,true);
 for(let i=0;i<nW;i++)dv2.setInt32(fp+i*4,i===nW-1?-2:i+1,true);dv2.setInt32(fp+nW*4,-2,true);for(let i=0;i<nF;i++)dv2.setInt32(fp+(nW+1+i)*4,-3,true);
 return o;
}
function renderBom(D){
 const L=bomData(D).filter(x=>x.qty>0);const grps=["Obudowa","Aparaty","Osprzęt","Zasilanie","Przewody"];
 const GI={Obudowa:"Obudowa rozdzielnicy",Aparaty:"Aparaty modułowe","Osprzęt":"Osprzęt montażowy",Zasilanie:"Zasilanie przed licznikiem",Przewody:"Przewody"};
 const sum=(g,f)=>L.filter(x=>x.grp===g).reduce((a,b)=>a+f(b),0);
 const apSzt=sum("Aparaty",x=>x.qty),mb=sum("Przewody",x=>x.qty);
 $("#bom").innerHTML=`<div class="sum" style="margin-top:0">
  <div class="kpi"><span class="l">Pozycje</span><span class="v">${L.length}</span><span class="s">w ${grps.filter(g=>L.some(x=>x.grp===g)).length} grupach</span></div>
  <div class="kpi"><span class="l">Aparaty</span><span class="v">${apSzt}<small>szt.</small></span><span class="s">${D.used} modułów na szynach</span></div>
  <div class="kpi"><span class="l">Obudowa</span><span class="v">${D.nRows}×${D.W}<small>mod.</small></span><span class="s">wolne ${D.free} z ${D.total} modułów</span></div>
  <div class="kpi"><span class="l">Przewody</span><span class="v">${mb}<small>m</small></span><span class="s">z zapasem 10%</span></div></div>
 <div class="row bbar"><button class="btn" type="button" id="b-xls">Pobierz .xls</button><button class="btn ghost" type="button" id="b-copy">Kopiuj zestawienie</button><span class="chip" id="copy-st">plik otworzysz w Excelu lub arkuszu</span></div>
 ${grps.filter(g=>L.some(x=>x.grp===g)).map(g=>{const it=L.filter(x=>x.grp===g),u=g==="Przewody"?"m":"szt.",mo=sum(g,x=>(+x.mod||0)*x.qty);
  return `<section class="bsec"><header><h3>${GI[g]}</h3><span>${it.length} ${it.length===1?"pozycja":it.length<5?"pozycje":"pozycji"} · ${sum(g,x=>x.qty)} ${u}${mo?" · "+mo+" mod.":""}</span></header>
  <div class="blist">${it.map(x=>`<div class="bit"><span class="bic">${bomIcon(x.name)}</span><span class="bnm"><b>${esc(x.name)}</b><small>${esc(x.par)}</small></span><span class="bmo">${x.mod!==""?x.mod+" mod.":""}</span><span class="bqt">${x.qty}<small>${u}</small></span></div>`).join("")}</div></section>`;}).join("")}
 <p class="caption">Pozycje generyczne opisane parametrami. Konkretne numery katalogowe dobierz u producenta aparatury.</p>`;
 $("#b-xls").onclick=()=>{const st=$("#copy-st");try{const b=new Blob([bomXls(D,L,grps)],{type:"application/vnd.ms-excel"}),u=URL.createObjectURL(b),a=document.createElement("a");a.href=u;a.download="zestawienie-rozdzielnicy.xls";root.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1500);st.textContent="pobrano plik .xls";st.className="chip ok";}catch(e){st.textContent="nie udało się utworzyć pliku";st.className="chip er";}};
 $("#b-copy").onclick=()=>{const tsv=["Grupa\tPozycja\tParametry\tModuły\tIlość\tJ.m."].concat(grps.flatMap(g=>L.filter(x=>x.grp===g).map(x=>[g,x.name,x.par,x.mod,x.qty,x.grp==="Przewody"?"m":"szt."].join("\t")))).join("\n");
  const st=$("#copy-st");
  try{navigator.clipboard.writeText(tsv).then(()=>{st.textContent="skopiowano";st.className="chip ok";},()=>{st.textContent="nie udało się skopiować, użyj pliku .xls";st.className="chip er";});}catch(e){st.textContent="nie udało się skopiować, użyj pliku .xls";st.className="chip er";}};
}

