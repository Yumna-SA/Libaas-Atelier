/* Libaas Atelier: shared data layer (localStorage) + page logic */
const L=localStorage,J=JSON,$=(s,e=document)=>e.querySelector(s),$$=(s,e=document)=>[...e.querySelectorAll(s)];
const get=(k,d)=>{try{return J.parse(L.getItem(k))||d}catch(x){return d}},set=(k,v)=>L.setItem(k,J.stringify(v));
const ST=['Placed','Assigned','Measured','Stitching','Ready'],P={};
const me=()=>get('me',null),cat=()=>get('cat'),rs=n=>'Rs '+Number(n).toLocaleString('en-US');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
/* Demo data on first visit */
(function(){if(get('users'))return;
set('users',[{id:1,name:'Owner',email:'owner@libaas.com',password:'owner123',role:'owner'},{id:2,name:'Tailor One',email:'tailor1@libaas.com',password:'tailor123',role:'tailor'},{id:3,name:'Tailor Two',email:'tailor2@libaas.com',password:'tailor123',role:'tailor'},{id:4,name:'Ayesha',email:'customer@libaas.com',password:'cust123',role:'customer'}]);
set('orders',[]);set('cat',{types:['Kurta','Shalwar kameez','Frock','Gharara'],fabrics:[{n:'Lawn',p:2500},{n:'Chiffon',p:4000},{n:'Silk',p:6500}],colors:[{n:'Mint',h:'#7FC8A9'},{n:'Emerald',h:'#1F6F5C'},{n:'Coral',h:'#F28C6B'},{n:'Plum',h:'#5B2A4E'},{n:'Navy',h:'#2C4A6B'},{n:'Cream',h:'#E9DFC9'}],fee:800})})();
/* Redirect away if the logged-in role does not match */
function guard(r){const u=me();if(!u||u.role!==r){location.href='login.html';return null}return u}
/* 2D mannequin: color, sleeves, neckline and length change the SVG */
function man(o,w=110){const c=o.color||'#1F6F5C',t=o.type||'Kurta',h={Short:62,Medium:76,Long:94}[o.length]||76,s={Full:62,Half:40,Bell:56}[o.sleeves]||56,b=o.sleeves==='Bell'?8:0,sk='#e3d2c2',dk='#23303A',
n={Round:'M25 20Q30 27 35 20',V:'M25 20L30 30L35 20',Boat:'M22 20Q30 23 38 20'}[o.neckline]||'M25 20Q30 27 35 20';let low,top;
if(t==='Frock'){const e=Math.min(h+4,100),y=e-6;low=`<path d="M22 ${y}h7l-1 ${108-y}h-5zM31 ${y}h7l-1 ${108-y}h-5z" fill="${dk}"/>`;top=`<path d="M19 20H41L39 42Q47 ${e-10} 53 ${e}Q30 ${e+7} 7 ${e}Q13 ${e-10} 21 42Z" fill="${c}"/><path d="M21 42H39" stroke="#F7F6F2" stroke-opacity=".7" stroke-width="1.4"/><path d="M30 44V${e+5}M24 46L16 ${e+3}M36 46L44 ${e+3}" stroke="#F7F6F2" stroke-opacity=".35" stroke-width=".6" fill="none"/>`}
else if(t==='Shalwar kameez'){low=`<path d="M14 ${h-2}H30L27 106H21zM30 ${h-2}H46L39 106H33z" fill="${c}" stroke="#F7F6F2" stroke-width=".6"/>`;top=`<path d="M19 20h22l3 ${h-20}H16z" fill="${c}"/><path d="M19 21Q30 31 41 21L43 27Q30 37 17 27z" fill="#F7F6F2" fill-opacity=".45"/>`}
else if(t==='Gharara'){const g=Math.min(h,72);low=`<path d="M18 56H30V106H5L13 82zM30 56H42L47 82L55 106H30z" fill="${c}" stroke="#F7F6F2" stroke-width=".6"/>`;top=`<path d="M19 20h22l4 ${g-20}H15z" fill="${c}"/>`}
else{low=`<path d="M18 ${h}h11l-1 ${108-h}h-8zM31 ${h}h11l-2 ${108-h}h-8z" fill="${dk}"/>`;top=`<path d="M19 20h22l4 ${h-20}H15z" fill="${c}"/>`}
return `<svg viewBox="0 0 60 112" width="${w}" role="img" aria-label="Outfit preview"><circle cx="30" cy="10" r="7" fill="${sk}"/>${low}${top}<path d="M19 21L${9-b} ${s}l${6+b} 3 8-30zM41 21L${51+b} ${s}l-${6+b} 3-8-30z" fill="${c}"/><path d="${n}" fill="#F7F6F2" stroke="#F7F6F2"/></svg>`}
function chips(box,opts,sel,cb,lab=opts){box.innerHTML=opts.map((o,i)=>`<button type="button" class="chip${o===sel?' on':''}">${lab[i]}</button>`).join('');$$('.chip',box).forEach((b,i)=>b.onclick=()=>{$$('.chip',box).forEach(x=>x.classList.remove('on'));b.classList.add('on');cb(opts[i])})}
function sw(box,cols,sel,cb){box.innerHTML=cols.map(x=>`<button type="button" class="sw${x.h===sel?' on':''}" style="background:${x.h}" title="${x.n}" aria-label="${x.n}"></button>`).join('');$$('.sw',box).forEach((b,i)=>b.onclick=()=>{$$('.sw',box).forEach(y=>y.classList.remove('on'));b.classList.add('on');cb(cols[i].h,cols[i].n)})}
/* Shared header and footer */
function chrome(){const u=me();
$('#h').innerHTML=`<div class="wrap bar"><a class="logo" href="index.html">Libaas <span>Atelier</span></a><button class="mb" id="menuBtn">☰ Menu</button><nav id="mainNav"><a href="index.html">Home</a><a href="quiz.html">Style quiz</a><a href="builder.html">Outfit builder</a>${u?`<a href="${u.role}.html">Dashboard</a><a href="#" id="lo">Log out</a>`:'<a class="pill" href="login.html">Log in</a>'}</nav></div><div class="tape"></div>`;
$('#f').innerHTML=`<div class="tape"></div><div class="wrap fgrid"><div><a class="logo" href="index.html">Libaas <span>Atelier</span></a><p>Know what suits you. Stitched just for you.</p></div><div><h4>Explore</h4><a href="index.html">Home</a><a href="quiz.html">Style quiz</a><a href="builder.html">Outfit builder</a><a href="login.html">Log in</a></div><div><h4>Contact</h4><p>hello@libaasatelier.com<br>Pakistan</p></div></div><div class="wrap copy">© 2026 Libaas Atelier. All rights reserved.</div>`;
const l=$('#lo');if(l)l.onclick=e=>{e.preventDefault();L.removeItem('me');location.href='index.html'}}
/* Rule-based AI stylist: body shape sets neckline and sleeves, occasion sets outfit type, fabric and length, budget limits the fabric, skin tone picks the best colors */
const TN={Fair:['Emerald','Plum','Navy'],Medium:['Mint','Coral','Emerald'],Dusky:['Cream','Coral','Mint']};
function suggest(a){const c=cat(),B={Pear:['Boat','Bell'],Curvy:['V','Half'],Hourglass:['V','Half'],Apple:['V','Full'],Rectangle:['Round','Bell']}[a.Body],
O={Wedding:['Gharara','Silk','Long'],Eid:['Shalwar kameez','Chiffon','Long'],Office:['Shalwar kameez','Lawn','Medium'],Casual:['Kurta','Lawn','Medium']}[a.Occasion],cap={'Under 4000':4000,'4000-7000':7000,'7000+':1e9}[a.Budget];
let ty=a.Body==='Rectangle'&&a.Occasion!=='Wedding'?'Frock':O[0];if(!c.types.includes(ty))ty=c.types[0];
let f=c.fabrics.find(x=>x.n===O[1])||c.fabrics[0];if(f.p+c.fee>cap)f=[...c.fabrics].reverse().find(x=>x.p+c.fee<=cap)||c.fabrics[0];
const col=c.colors.find(x=>x.n===a.Color)||c.colors[0],good=TN[a.Skin].includes(col.n);
return{type:ty,fabric:f.n,color:col.h,colorName:col.n,neckline:B[0],sleeves:B[1],length:O[2],why:`For a ${a.Body.toLowerCase()} shape, a ${B[0].toLowerCase()} neckline with ${B[1].toLowerCase()} sleeves balances the silhouette. ${col.n} ${good?'flatters':'is a bold pick for'} ${a.Skin.toLowerCase()} skin${good?'':', and the colors below suit it even better'}. ${ty} in ${f.n.toLowerCase()} suits ${a.Occasion.toLowerCase()} wear within your budget.`}}
P.home=()=>$$('[data-man]').forEach(e=>e.innerHTML=man({type:e.dataset.type,color:e.dataset.man,sleeves:'Bell',neckline:'V',length:'Medium'},+e.dataset.w));
P.login=()=>{let m='in';const f=$('#lf'),g=$('#msg');
$('#sw').onclick=e=>{e.preventDefault();m=m==='in'?'up':'in';const i=m==='in';$('#nm').hidden=i;$('#tt').textContent=i?'Log in':'Create your account';$('#sb').textContent=i?'Log in':'Sign up';$('#sw').textContent=i?'New customer? Sign up':'Have an account? Log in';g.textContent=''};
const go=u=>{set('me',u);location.href=get('pending')&&u.role==='customer'?'builder.html':u.role+'.html'};
f.onsubmit=e=>{e.preventDefault();const em=f.email.value.trim().toLowerCase(),pw=f.password.value,us=get('users');if(!em||!pw)return g.textContent='Enter your email and password.';
if(m==='up'){if(!f.name.value.trim())return g.textContent='Enter your name.';if(us.some(u=>u.email===em))return g.textContent='That email already has an account. Log in instead.';const u={id:Date.now(),name:f.name.value.trim(),email:em,password:pw,role:'customer'};us.push(u);set('users',us);go(u)}
else{const u=us.find(u=>u.email===em&&u.password===pw);if(!u)return g.textContent='Email or password is wrong.';go(u)}}};
P.quiz=()=>{const c=cat(),a={},ok=()=>['Body','Skin','Occasion','Budget','Color'].every(k=>a[k]);let s=null;
const title=()=>`${s.type} in ${s.colorName.toLowerCase()} ${s.fabric.toLowerCase()}`;
const show=()=>{s=suggest(a);const alt=TN[a.Skin].map(n=>c.colors.find(x=>x.n===n)).filter(x=>x&&x.h!==s.color);
$('#res').innerHTML=`<div class="pv" id="qp">${man(s,150)}</div><h3 style="margin-top:16px" id="qt">${title()}</h3><p>${s.neckline} neckline, ${s.sleeves.toLowerCase()} sleeves, ${s.length.toLowerCase()} length.</p><p>${s.why}</p>${alt.length?`<label>Best colors for ${a.Skin.toLowerCase()} skin (tap to try)</label><div class="chips" id="qa"></div>`:''}<button class="btn" id="bb">Build this outfit</button>`;
if(alt.length)sw($('#qa'),alt,'',(h,n)=>{s.color=h;s.colorName=n;$('#qp').innerHTML=man(s,150);$('#qt').textContent=title()});
$('#bb').onclick=()=>{set('pending',{type:s.type,fabric:s.fabric,color:s.color,sleeves:s.sleeves,neckline:s.neckline,length:s.length});location.href='builder.html'}};
const up=()=>{if(ok()){$('#qe').textContent='';show()}};
chips($('#qb'),['Pear','Curvy','Hourglass','Apple','Rectangle'],'',v=>{a.Body=v;up()});chips($('#qs'),['Fair','Medium','Dusky'],'',v=>{a.Skin=v;up()});chips($('#qo'),['Wedding','Office','Casual','Eid'],'',v=>{a.Occasion=v;up()});
chips($('#qd'),['Under 4000','4000-7000','7000+'],'',v=>{a.Budget=v;up()},['Under Rs 4,000','Rs 4,000 to 7,000','Rs 7,000+']);sw($('#qc'),c.colors,'',(h,n)=>{a.Color=n;up()});
$('#qf').onsubmit=e=>{e.preventDefault();if(!ok())return $('#qe').textContent='Answer every question to get your suggestion.';$('#qe').textContent='';show()}};
P.builder=()=>{const c=cat(),p=get('pending',null),o=p||{type:c.types[0],fabric:c.fabrics[0].n,color:c.colors[0].h,sleeves:'Full',neckline:'Round',length:'Medium'};$('#note').hidden=!p;
const d=()=>{const f=c.fabrics.find(x=>x.n===o.fabric)||c.fabrics[0];o.total=f.p+c.fee;$('#pv').innerHTML=man(o,170);$('#sum').textContent=`${o.type}, ${o.fabric}, ${o.sleeves.toLowerCase()} sleeves, ${o.neckline.toLowerCase()} neckline, ${o.length.toLowerCase()} length`;$('#tot').textContent=rs(o.total)};
chips($('#gt'),c.types,o.type,v=>{o.type=v;d()});chips($('#gf'),c.fabrics.map(f=>f.n),o.fabric,v=>{o.fabric=v;d()},c.fabrics.map(f=>`${f.n} ${rs(f.p)}`));sw($('#gc'),c.colors,o.color,v=>{o.color=v;d()});
chips($('#gs'),['Full','Half','Bell'],o.sleeves,v=>{o.sleeves=v;d()});chips($('#gn'),['Round','V','Boat'],o.neckline,v=>{o.neckline=v;d()});chips($('#gl'),['Short','Medium','Long'],o.length,v=>{o.length=v;d()});d();
$('#add').onclick=()=>{const u=me();set('pending',o);if(!u)return location.href='login.html';if(u.role!=='customer')return $('#err').textContent='Only customers can place orders. Log in with a customer account.';
const os=get('orders');os.push({id:101+os.length,cid:u.id,cname:u.name,outfit:o,total:o.total,status:'Placed',tid:null,m:null,notes:'',appt:'',at:Date.now()});set('orders',os);L.removeItem('pending');location.href='customer.html'}};
P.customer=()=>{const u=guard('customer');if(!u)return;$('#hi').textContent='Hi, '+u.name;const os=get('orders').filter(o=>o.cid===u.id).reverse();
$('#list').innerHTML=os.length?os.map(o=>{const i=ST.indexOf(o.status),m=o.m;return `<article class="card ord"><div class="pv">${man(o.outfit,100)}</div><div><h3>Order #${o.id}</h3><p>${o.outfit.type}, ${o.outfit.fabric}, ${o.outfit.sleeves.toLowerCase()} sleeves. <span class="price">${rs(o.total)}</span></p><ol class="steps">${ST.map((s,k)=>`<li class="${k<i?'d':k===i?'n':''}">${s}</li>`).join('')}</ol><label>Measurement appointment<input type="datetime-local" data-id="${o.id}" value="${o.appt}"></label><p class="m">${m?`Chest ${m.chest}, waist ${m.waist}, hips ${m.hips}, shoulder ${m.shoulder}, sleeve ${m.sleeve}, length ${m.length} (inches).${o.notes?`<br>Tailor's note: ${esc(o.notes)}`:''}`:'Your tailor will add your measurements after your appointment.'}</p></div></article>`}).join(''):'<div class="card empty"><p>No orders yet. Find out what suits you, then design it.</p><a class="btn" href="quiz.html">Take the style quiz</a></div>';
$$('[data-id]').forEach(i=>i.onchange=()=>{const a=get('orders');a.find(o=>o.id==i.dataset.id).appt=i.value;set('orders',a)})};
P.tailor=()=>{const u=guard('tailor');if(!u)return;let sel=null;const K=['chest','waist','hips','shoulder','sleeve','length'],f=$('#mf');
const d=()=>{const os=get('orders').filter(o=>o.tid===u.id);$('#tl').innerHTML=os.length?os.map(o=>`<button class="row${sel===o.id?' on':''}" data-id="${o.id}"><span>#${o.id} ${esc(o.cname)}</span><span class="badge">${o.status}</span></button>`).join(''):'<p class="empty">No orders assigned yet. The owner will assign them to you.</p>';
$$('.row').forEach(r=>r.onclick=()=>{sel=+r.dataset.id;$('#msg').textContent='';d()});const o=os.find(x=>x.id===sel);$('#td').hidden=!o;if(!o)return;
$('#tp').innerHTML=man(o.outfit,130)+`<p>${o.outfit.type}, ${o.outfit.fabric}, ${o.outfit.sleeves.toLowerCase()} sleeves, ${o.outfit.neckline.toLowerCase()} neckline, ${o.outfit.length.toLowerCase()} length</p>`;
K.forEach(k=>f[k].value=o.m?o.m[k]:'');f.notes.value=o.notes;f.status.value=['Measured','Stitching','Ready'].includes(o.status)?o.status:'Measured';
f.onsubmit=e=>{e.preventDefault();const m={};for(const k of K){const v=parseFloat(f[k].value);if(!(v>0))return $('#msg').textContent='Enter every measurement as a number in inches.';m[k]=v}
const a=get('orders'),x=a.find(y=>y.id===o.id);x.m=m;x.notes=f.notes.value;x.status=f.status.value;set('orders',a);d();$('#msg').textContent='Saved.'}};d()};
P.owner=()=>{if(!guard('owner'))return;
const d=()=>{const os=get('orders'),ts=get('users').filter(u=>u.role==='tailor'),c=cat();
$('#mt').innerHTML=[['Orders',os.length],['Tailors',ts.length],['Sales (ready orders)',rs(os.filter(o=>o.status==='Ready').reduce((s,o)=>s+o.total,0))]].map(([a,b])=>`<div class="card met"><b>${b}</b>${a}</div>`).join('');
$('#ot').innerHTML=os.length?`<table><tr><th>Order</th><th>Customer</th><th>Outfit</th><th>Total</th><th>Status</th><th>Tailor</th></tr>${os.map(o=>`<tr><td>#${o.id}</td><td>${esc(o.cname)}</td><td>${o.outfit.type}, ${o.outfit.fabric}</td><td>${rs(o.total)}</td><td><span class="badge">${o.status}</span></td><td><select data-id="${o.id}"><option value="">Assign tailor</option>${ts.map(t=>`<option value="${t.id}"${o.tid===t.id?' selected':''}>${esc(t.name)}</option>`).join('')}</select></td></tr>`).join('')}</table>`:'<p class="empty">No orders yet. They appear here when customers order.</p>';
$$('#ot select').forEach(s=>s.onchange=()=>{const a=get('orders'),o=a.find(x=>x.id==s.dataset.id);o.tid=s.value?+s.value:null;if(s.value&&o.status==='Placed')o.status='Assigned';set('orders',a);d()});
$('#pr').innerHTML=c.fabrics.map((f,i)=>`<label>${f.n}<input type="number" min="0" data-f="${i}" value="${f.p}"></label>`).join('')+`<label>Stitching fee<input type="number" min="0" id="fee" value="${c.fee}"></label>`;
$('#cl').innerHTML=c.types.map((t,i)=>`<button class="chip" data-d="types:${i}" title="Remove">${t} ×</button>`).join('')+c.colors.map((x,i)=>`<button class="chip" data-d="colors:${i}" title="Remove"><i class="dot" style="background:${x.h}"></i>${x.n} ×</button>`).join('');
$$('#cl .chip').forEach(b=>b.onclick=()=>{const c=cat(),[k,i]=b.dataset.d.split(':');if(c[k].length<2)return;c[k].splice(i,1);set('cat',c);d()});
const bs=ST.map(s=>[s,os.filter(o=>o.status===s).length]),mx=Math.max(1,...bs.map(b=>b[1]));$('#bar').innerHTML=bs.map(([s,n])=>`<div class="bc"><b>${n}</b><i style="height:${n/mx*100}%"></i>${s}</div>`).join('')};
$('#sp').onclick=()=>{const c=cat();$$('[data-f]').forEach(i=>c.fabrics[i.dataset.f].p=+i.value||0);c.fee=+$('#fee').value||0;set('cat',c);d();$('#pm').textContent='Prices saved.'};
$('#ad').onsubmit=e=>{e.preventDefault();const c=cat(),f=e.target,n=f.name.value.trim();if(!n)return;if(f.kind.value==='type')c.types.push(n);else c.colors.push({n,h:f.hex.value});set('cat',c);f.reset();d()};d()};
document.addEventListener('DOMContentLoaded',()=>{chrome();(P[document.body.dataset.p]||(()=>{}))()});