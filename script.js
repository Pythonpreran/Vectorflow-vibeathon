/* VIBEATHON — Living Cyberpunk World Script */
(function(){
'use strict';
let mx=-500,my=-500,vibeScore=0;
const achievements=[];

// ═══ BOOT SEQUENCE ═══
const bootLines=[
  {t:'[SYS] BIOS v6.6.6 — NeonCore Mainframe',c:'sys'},{t:'[SYS] CPU: Quantum-X9 @ 12.8 THz ........... OK',c:'ok'},
  {t:'[SYS] RAM: 512 PB Holographic Memory ....... OK',c:'ok'},{t:'[SYS] GPU: CyberForce RTX 9090 Ti .......... OK',c:'ok'},
  {t:'[NET] Darknet relay ......................... CONNECTED',c:'ok'},{t:'[SEC] Firewall: QUANTUM_SHIELD .............. ARMED',c:'warn'},
  {t:'[SEC] Intrusion Detection ................... ACTIVE',c:'warn'},{t:'[DB]  Participant database ................... 500+ entries',c:'sys'},
  {t:'[SRV] Event server .......................... ONLINE',c:'ok'},{t:'[GPU] 3D cyberpunk renderer .................. LOADED',c:'ok'},
  {t:'[SYS] Particle engine ....................... INITIALIZED',c:'ok'},{t:'[AUD] Sound system ........................... CALIBRATED',c:'ok'},
  {t:'',c:'sys'},{t:'[SYS] ★ VIBEATHON SYSTEM READY ★',c:'warn'},{t:'[SYS] Launching interface...',c:'sys'},
];
const bb=document.getElementById('boot-body'),bp=document.getElementById('boot-bar'),bs=document.getElementById('boot-screen');
let bi=0;
function addBL(){
  if(bi>=bootLines.length){bp.style.width='100%';setTimeout(()=>bs.classList.add('off'),500);return;}
  const l=bootLines[bi];const d=document.createElement('div');d.className='boot-line '+l.c;d.textContent=l.t;bb.appendChild(d);bb.scrollTop=bb.scrollHeight;
  bp.style.width=((bi+1)/bootLines.length*100)+'%';bi++;setTimeout(addBL,l.t===''?60:50+Math.random()*70);
}
setTimeout(addBL,300);

// ═══ CURSOR SYSTEM ═══
const cg=document.getElementById('cursor-glow'),cd=document.getElementById('cursor-dot');
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;});
(function ac(){if(cg){cg.style.left=mx+'px';cg.style.top=my+'px';}if(cd){cd.style.left=mx+'px';cd.style.top=my+'px';}requestAnimationFrame(ac);})();
if('ontouchstart' in window){document.body.style.cursor='auto';[cg,cd].forEach(e=>e&&(e.style.display='none'));}

// ═══ CURSOR NEON TRAIL ═══
const trailCanvas=document.getElementById('cursor-trail-canvas');
const trailCtx=trailCanvas.getContext('2d');
let trail=[];
function resizeTrail(){trailCanvas.width=innerWidth;trailCanvas.height=innerHeight;}
resizeTrail();addEventListener('resize',resizeTrail);
document.addEventListener('mousemove',()=>{trail.push({x:mx,y:my,a:1,s:3+Math.random()*2});if(trail.length>40)trail.shift();});
(function drawTrail(){
  trailCtx.clearRect(0,0,trailCanvas.width,trailCanvas.height);
  trail.forEach((p,i)=>{p.a-=.03;p.s*=.97;if(p.a<=0)return;
    trailCtx.save();trailCtx.globalAlpha=p.a*.5;trailCtx.fillStyle=i%2===0?'#00f0ff':'#ff2d95';trailCtx.shadowColor=trailCtx.fillStyle;trailCtx.shadowBlur=8;
    trailCtx.beginPath();trailCtx.arc(p.x,p.y,p.s,0,Math.PI*2);trailCtx.fill();trailCtx.restore();
  });
  trail=trail.filter(p=>p.a>0);requestAnimationFrame(drawTrail);
})();

// ═══ NAVBAR ═══
document.getElementById('nav-ham').addEventListener('click',()=>document.getElementById('mob-menu').classList.toggle('active'));
document.querySelectorAll('.ml').forEach(l=>l.addEventListener('click',()=>document.getElementById('mob-menu').classList.remove('active')));
addEventListener('scroll',()=>{document.getElementById('navbar').style.background=scrollY>80?'rgba(10,10,18,.92)':'rgba(10,10,18,.65)';});
document.querySelectorAll('a[href^="#"]').forEach(a=>{a.addEventListener('click',function(e){e.preventDefault();const t=document.querySelector(this.getAttribute('href'));t&&t.scrollIntoView({behavior:'smooth',block:'start'});});});

// ═══ COUNTDOWN ═══
// Removed precise countdown logic as date is "COMING SOON"

// ═══ TILT ═══
document.querySelectorAll('[data-tilt]').forEach(el=>{
  el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect();const rX=((e.clientY-r.top-r.height/2)/r.height*2)*-7,rY=((e.clientX-r.left-r.width/2)/r.width*2)*7;
    el.style.transform=`perspective(800px) rotateX(${rX}deg) rotateY(${rY}deg) translateY(-5px)`;});
  el.addEventListener('mouseleave',()=>{el.style.transform='';});
});

// ═══ VIBE SCORE SYSTEM ═══
const vScoreEl=document.getElementById('vibe-score'),vBarEl=document.getElementById('vibe-bar');
function addVibe(pts,reason){
  vibeScore+=pts;vScoreEl.textContent=vibeScore;vBarEl.style.width=Math.min(vibeScore,100)+'%';
  // pulse effect
  vScoreEl.style.transform='scale(1.3)';setTimeout(()=>vScoreEl.style.transform='scale(1)',200);
}

// ═══ ACHIEVEMENT SYSTEM ═══
const achEl=document.getElementById('achievement'),achIcon=document.getElementById('ach-icon'),achTitle=document.getElementById('ach-title'),achDesc=document.getElementById('ach-desc');
function showAch(icon,title,desc){
  if(achievements.includes(title))return;achievements.push(title);
  achIcon.textContent=icon;achTitle.textContent=title;achDesc.textContent=desc;
  achEl.classList.remove('ach-hidden');addVibe(10,'Achievement: '+title);
  setTimeout(()=>achEl.classList.add('ach-hidden'),3500);
}

// scroll achievement
let scrollDepth=0;
addEventListener('scroll',()=>{
  const pct=scrollY/(document.body.scrollHeight-innerHeight)*100;
  if(pct>25&&scrollDepth<1){scrollDepth=1;showAch('🗺️','EXPLORER','Scrolled past 25% of the site');}
  if(pct>50&&scrollDepth<2){scrollDepth=2;showAch('📡','DEEP SCAN','Reached the halfway point');}
  if(pct>90&&scrollDepth<3){scrollDepth=3;showAch('🏁','FULL RECON','Explored nearly the entire site');}
});

// hover achievement
let hoverCount=0;
document.querySelectorAll('.hcard,.tcard,.spk,.pbox').forEach(el=>{
  el.addEventListener('mouseenter',()=>{hoverCount++;addVibe(1);if(hoverCount===5)showAch('👆','HACKER TOUCH','Hovered over 5 elements');if(hoverCount===15)showAch('🔍','DEEP DIVE','Interacted with 15 elements');});
});

// ═══ COLLECTIBLE ORBS ═══
const orbContainer=document.getElementById('orbs-container');
const orbColors=['blue','pink','green'];
let orbsCollected=0;
function spawnOrbs(){
  for(let i=0;i<8;i++){
    const orb=document.createElement('div');
    orb.className='orb '+orbColors[i%3];
    orb.style.left=(10+Math.random()*80)+'vw';
    orb.style.top=(15+Math.random()*75)+'vh';
    orb.style.animationDelay=(Math.random()*3)+'s';
    orb.addEventListener('click',()=>{
      orb.classList.add('collected');orbsCollected++;addVibe(5,'Orb collected');
      setTimeout(()=>orb.remove(),500);
      if(orbsCollected===3)showAch('💎','ORB HUNTER','Collected 3 energy orbs');
      if(orbsCollected===8)showAch('🌟','ORB MASTER','Collected all 8 orbs!');
    });
    orbContainer.appendChild(orb);
  }
}
setTimeout(spawnOrbs,4500);

// ═══ LIGHTNING ═══
const lightEl=document.getElementById('lightning-flash');
function triggerLightning(){
  lightEl.style.opacity='1';
  setTimeout(()=>lightEl.style.opacity='0',60);
  setTimeout(()=>{lightEl.style.opacity='.4';setTimeout(()=>lightEl.style.opacity='0',40);},120);
  setTimeout(triggerLightning,8000+Math.random()*15000);
}
setTimeout(triggerLightning,6000);

// ═══ GSAP SCROLL ═══
gsap.registerPlugin(ScrollTrigger);
gsap.from('.hero-badge',{opacity:0,y:-20,duration:.7,delay:3.5});
gsap.from('.glitch',{opacity:0,scale:.85,duration:1,delay:3.7,ease:'back.out(1.7)'});
gsap.from('.hero-sub',{opacity:0,y:12,duration:.5,delay:4});
gsap.from('.hero-stats',{opacity:0,y:12,duration:.5,delay:4.2});
gsap.from('.countdown',{opacity:0,y:12,duration:.5,delay:4.4});
gsap.from('.cta-btn',{opacity:0,y:12,duration:.5,delay:4.6});

gsap.utils.toArray('.sec-head').forEach(h=>{gsap.from(h,{scrollTrigger:{trigger:h,start:'top 85%'},opacity:0,y:30,duration:.6});});
gsap.utils.toArray('.hcard').forEach((c,i)=>{gsap.from(c,{scrollTrigger:{trigger:c,start:'top 85%'},opacity:0,y:45,duration:.5,delay:i*.1});});
gsap.utils.toArray('.tcard').forEach((c,i)=>{gsap.from(c,{scrollTrigger:{trigger:c,start:'top 85%'},opacity:0,y:35,scale:.95,duration:.45,delay:i*.08});});
gsap.utils.toArray('.tl-n').forEach(n=>{
  const l=n.classList.contains('left');gsap.set(n,{opacity:0,x:l?-30:30,y:18});
  gsap.to(n,{scrollTrigger:{trigger:n,start:'top 82%'},opacity:1,x:0,y:0,duration:.55,ease:'power2.out'});
});
gsap.to('#tl-fill',{scrollTrigger:{trigger:'.tl-wrap',start:'top 80%',end:'bottom 30%',scrub:true},height:'100%'});
gsap.utils.toArray('.spk').forEach((c,i)=>{gsap.from(c,{scrollTrigger:{trigger:c,start:'top 85%'},opacity:0,y:25,duration:.45,delay:i*.06});});
gsap.utils.toArray('.pbox').forEach((c,i)=>{gsap.from(c,{scrollTrigger:{trigger:c,start:'top 85%'},opacity:0,y:35,rotationY:10,duration:.6,delay:i*.12});});
gsap.utils.toArray('.pe').forEach((c,i)=>{gsap.from(c,{scrollTrigger:{trigger:c,start:'top 90%'},opacity:0,x:-20,duration:.45,delay:i*.08});});
gsap.from('.reg-card',{scrollTrigger:{trigger:'.reg-card',start:'top 82%'},opacity:0,y:35,scale:.97,duration:.6});
gsap.from('.footer-inner',{scrollTrigger:{trigger:'#footer',start:'top 90%'},opacity:0,y:20,duration:.6});

// Portal dividers
gsap.utils.toArray('.portal-divider').forEach(p=>{gsap.from(p,{scrollTrigger:{trigger:p,start:'top 90%'},opacity:0,scaleX:0,duration:.6});});

// ═══ PARTICLES (disabled — replaced with building silhouettes) ═══
const pC=document.getElementById('particle-canvas');
// Canvas is hidden via CSS, skip particle rendering entirely

// ═══ LIVING CITY 3D ═══
try{
  const sc=new THREE.Scene();
  sc.fog=new THREE.FogExp2(0x040410, 0.015);
  const cam=new THREE.PerspectiveCamera(60,innerWidth/innerHeight,.1,1000);
  cam.position.set(0,5,30);cam.lookAt(0,0,0);
  const ren=new THREE.WebGLRenderer({alpha:true,antialias:true});
  ren.setSize(innerWidth,innerHeight);ren.setPixelRatio(Math.min(devicePixelRatio,2));
  document.getElementById('three-bg').appendChild(ren.domElement);
  
  // Particles
  const geo=new THREE.BufferGeometry(),N=3000,pos=new Float32Array(N*3),col=new Float32Array(N*3);
  for(let i=0;i<N;i++){pos[i*3]=(Math.random()-.5)*150;pos[i*3+1]=(Math.random()-.5)*80+10;pos[i*3+2]=70-Math.random()*450;const c=Math.random();if(c<.33){col[i*3]=0;col[i*3+1]=.94;col[i*3+2]=1;}else if(c<.66){col[i*3]=1;col[i*3+1]=.18;col[i*3+2]=.58;}else{col[i*3]=.69;col[i*3+1]=.15;col[i*3+2]=1;}}
  geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  geo.setAttribute('color',new THREE.BufferAttribute(col,3));
  const gPts=new THREE.Points(geo,new THREE.PointsMaterial({size:.25,vertexColors:true,transparent:true,opacity:.6,blending:THREE.AdditiveBlending,sizeAttenuation:true}));
  sc.add(gPts);
  
  // Cyberpunk Glowing Grid Road
  const lm=new THREE.LineBasicMaterial({color:0x00f0ff,transparent:true,opacity:.08,blending:THREE.AdditiveBlending});
  for(let i=-24;i<=24;i+=4){sc.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(i,-5,-400),new THREE.Vector3(i,-5,50)]),lm));}
  for(let i=-400;i<=50;i+=10){sc.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-24,-5,i),new THREE.Vector3(24,-5,i)]),lm));}
  
  // Extremely Grand Neon Buildings (Solid + Glow Edges)
  const bGeo = new THREE.BoxGeometry(1,1,1);
  const edgeGeo = new THREE.EdgesGeometry(bGeo);
  const colors = [0x00f0ff, 0xff2d95, 0xb026ff];
  
  for(let i=0;i<180;i++){
    const c = colors[i%3];
    const matSolid = new THREE.MeshBasicMaterial({color: c, transparent:true, opacity:0.04, blending:THREE.AdditiveBlending});
    const mesh = new THREE.Mesh(bGeo, matSolid);
    
    // Sharp neon wireframe wrapped around the solid mesh
    const matEdge = new THREE.LineBasicMaterial({color: c, transparent:true, opacity:0.6, blending:THREE.AdditiveBlending});
    const lines = new THREE.LineSegments(edgeGeo, matEdge);
    mesh.add(lines);

    mesh.position.x=(Math.random()<.5?-1:1)*(18+Math.random()*50);
    mesh.position.z=70-Math.random()*450;
    mesh.scale.set(6+Math.random()*20, 15+Math.random()*90, 6+Math.random()*20);
    mesh.position.y=mesh.scale.y/2-5;
    sc.add(mesh);
  }

  // Animation Loop
  (function aT(){requestAnimationFrame(aT);gPts.rotation.y+=.00015;
    const p=gPts.geometry.attributes.position.array,t=Date.now()*.001;for(let i=0;i<p.length;i+=3)p[i+1]+=Math.sin(t+p[i]*.1)*.002;gPts.geometry.attributes.position.needsUpdate=true;
    const tx=(mx/innerWidth-.5)*6,ty=-(my/innerHeight-.5)*4;cam.position.x+=(tx-cam.position.x)*.05;cam.position.y+=(5+ty-cam.position.y)*.05;cam.lookAt(cam.position.x*.2, cam.position.y*.2, cam.position.z-40);ren.render(sc,cam);})();
  addEventListener('resize',()=>{cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();ren.setSize(innerWidth,innerHeight);});
  
  // GSAP SCROLL BINDING
  if(window.gsap && window.ScrollTrigger){
     gsap.to(cam.position,{z:-300,ease:"none",scrollTrigger:{trigger:document.body,start:"top top",end:"bottom bottom",scrub:1.5}});
  }
}catch(e){console.warn('Three.js City:',e);}

// ═══ HERO PARALLAX ═══
const hC=document.querySelector('.hero-content'),hE=document.querySelector('.hero-env');
document.addEventListener('mousemove',()=>{const x=(mx/innerWidth-.5)*2,y=(my/innerHeight-.5)*2;
  if(hC)hC.style.transform=`translate(${x*12}px,${y*6}px)`;if(hE)hE.style.transform=`translate(${x*-8}px,${y*-5}px)`;});

// ═══ GLITCH ON SCROLL (subtle) ═══
let lsy=0;
// Removed aggressive hue-rotate on scroll to prevent flickering

// ═══ REGISTRATION ═══
// (Form removed, handled by external link)

// ═══ EASTER EGG ═══
let lc=0;document.getElementById('nav-logo').addEventListener('click',()=>{lc++;addVibe(2);if(lc>=5){lc=0;document.getElementById('easter-egg').style.display='flex';showAch('🥚','EGG HUNTER','Found the hidden easter egg!');}});

// ═══ SOUNDS ═══
let aC;
function sfxH(){if(!aC)aC=new(AudioContext||webkitAudioContext)();const o=aC.createOscillator(),g=aC.createGain();o.connect(g);g.connect(aC.destination);o.frequency.value=900+Math.random()*300;o.type='sine';g.gain.value=.02;g.gain.exponentialRampToValueAtTime(.001,aC.currentTime+.07);o.start();o.stop(aC.currentTime+.07);}
function sfxC(){if(!aC)aC=new(AudioContext||webkitAudioContext)();const o=aC.createOscillator(),g=aC.createGain();o.connect(g);g.connect(aC.destination);o.frequency.value=1200;o.type='square';g.gain.value=.03;g.gain.exponentialRampToValueAtTime(.001,aC.currentTime+.04);o.start();o.stop(aC.currentTime+.04);}
document.querySelectorAll('.nl,.cta-btn,.tcard,.hcard,.spk,.reg-btn,.mq-logo').forEach(e=>e.addEventListener('mouseenter',sfxH));
document.querySelectorAll('.cta-btn,.reg-btn,.nav-cta,.nav-logo,.orb').forEach(e=>e.addEventListener('click',sfxC));

// ═══ BG GRADIENT (static — no rotation to avoid flicker) ═══
const h=document.getElementById('hero');if(h)h.style.background='linear-gradient(180deg,#06061a,#0a0a1a 40%,#0f0a22 70%,#06061a)';

// ═══ HACKER TERMINAL ═══
const ht=document.getElementById('hterm'),htb=document.getElementById('hterm-body'),hti=document.getElementById('hterm-input');
let htO=false;function togHT(){htO=!htO;ht.classList.toggle('hterm-off',!htO);if(htO){hti.focus();showAch('💻','HACKER','Opened the hidden terminal');}}
document.addEventListener('keydown',e=>{if(e.key==='`'||e.key==='~'){e.preventDefault();togHT();}});
document.getElementById('hterm-x').addEventListener('click',togHT);
function htP(t,c=''){const d=document.createElement('div');d.className='htl '+(c||'');d.innerHTML=t;htb.appendChild(d);htb.scrollTop=htb.scrollHeight;}
const cmds={help:()=>{htP('Commands:','sys');['help','about','events','register','prizes','timeline','hack','matrix','clear','vibe'].forEach(c=>htP('  <span class="hl">'+c+'</span>','sys'));},
  about:()=>{htP('VIBEATHON 2026 — An Immersive 8 Hour Hackathon','warn');htP('Organized by Vectorflow Club of VVCE Mysuru | ₹23K+ prizes');},
  events:()=>{htP('TRACKS:','warn');htP('  Details Coming Soon. Standby for problem statements.');},
  register:()=>{htP('Redirecting...','sys');togHT();setTimeout(()=>document.getElementById('register').scrollIntoView({behavior:'smooth'}),300);},
  prizes:()=>{htP('PRIZES (Per Track):','warn');htP('  🏆 $150  •  🥈 $100  •  🥉 $50');htP('  Note: Prizes may change depending on sponsors');},
  timeline:()=>{htP('SCHEDULE:','warn');htP('09:00 Inauguration → Workshop → Design → Snacks → Build → Pitch → 16:30 Awards');},
  hack:()=>{htP('ACCESS DENIED','err');htP('Nice try! Hint: click logo 5× ...','sys');},
  matrix:()=>{htP('Entering matrix...','warn');document.body.style.filter='hue-rotate(90deg) saturate(2)';setTimeout(()=>document.body.style.filter='none',2000);for(let i=0;i<5;i++)setTimeout(()=>htP(Array.from({length:45},()=>String.fromCharCode(0x30A0+Math.random()*96)).join('')),i*150);},
  clear:()=>{htb.innerHTML='';htP('Cleared.','sys');},
  vibe:()=>{htP('VIBE SCORE: '+vibeScore,'warn');htP('Achievements: '+achievements.length,'sys');}
};
hti&&hti.addEventListener('keydown',e=>{if(e.key==='Enter'){const c=hti.value.trim().toLowerCase();hti.value='';if(!c)return;htP('vibeathon> '+c,'sys');addVibe(2);if(cmds[c])cmds[c]();else htP('Unknown: "'+c+'". Type <span class="hl">help</span>','err');}});

// ═══ MINI GAME ═══
const gC=document.getElementById('game-canvas'),gX=gC.getContext('2d'),gBox=document.getElementById('game-box');
const gOv=document.getElementById('game-ov'),gRes=document.getElementById('game-res');
let gOn=false,gSc=0,gTm=30,gTgts=[],gExps=[],gInt;
const gCols=['#00f0ff','#ff2d95','#b026ff','#39ff14','#ffe600'];
function rGC(){const r=gBox.getBoundingClientRect();gC.width=r.width;gC.height=r.height;}rGC();addEventListener('resize',rGC);
class Tgt{constructor(){this.alive=true;this.r=16+Math.random()*12;this.x=this.r+Math.random()*(gC.width-this.r*2);this.y=this.r+Math.random()*(gC.height-this.r*2);this.c=gCols[Math.floor(Math.random()*gCols.length)];this.vx=(Math.random()-.5)*2.2;this.vy=(Math.random()-.5)*2.2;this.ph=Math.random()*Math.PI*2;}
  u(){this.x+=this.vx;this.y+=this.vy;this.ph+=.05;if(this.x<this.r||this.x>gC.width-this.r)this.vx*=-1;if(this.y<this.r||this.y>gC.height-this.r)this.vy*=-1;}
  d(){if(!this.alive)return;const s=1+.12*Math.sin(this.ph);gX.save();gX.translate(this.x,this.y);gX.scale(s,s);gX.strokeStyle=this.c;gX.shadowColor=this.c;gX.shadowBlur=15;gX.lineWidth=2;gX.beginPath();gX.arc(0,0,this.r,0,Math.PI*2);gX.stroke();gX.fillStyle=this.c;gX.globalAlpha=.25;gX.beginPath();gX.moveTo(0,-this.r*.5);gX.lineTo(this.r*.5,0);gX.lineTo(0,this.r*.5);gX.lineTo(-this.r*.5,0);gX.closePath();gX.fill();gX.globalAlpha=1;gX.beginPath();gX.arc(0,0,2.5,0,Math.PI*2);gX.fill();gX.restore();}
  hit(cx,cy){return this.alive&&Math.hypot(cx-this.x,cy-this.y)<this.r+5;}
}
class Exp{constructor(x,y,c){this.x=x;this.y=y;this.c=c;this.pts=[];this.life=1;for(let i=0;i<10;i++)this.pts.push({a:Math.random()*Math.PI*2,s:2+Math.random()*3.5,d:0});}
  u(){this.life-=.04;this.pts.forEach(p=>p.d+=p.s);}
  d(){if(this.life<=0)return;gX.save();gX.globalAlpha=this.life;gX.fillStyle=this.c;gX.shadowColor=this.c;gX.shadowBlur=6;this.pts.forEach(p=>{gX.beginPath();gX.arc(this.x+Math.cos(p.a)*p.d,this.y+Math.sin(p.a)*p.d,1.5,0,Math.PI*2);gX.fill();});gX.restore();}
}
function spTgts(){gTgts=[];for(let i=0;i<4;i++)gTgts.push(new Tgt());}
function gLoop(){if(!gOn)return;gX.clearRect(0,0,gC.width,gC.height);gX.strokeStyle='rgba(0,240,255,.03)';gX.lineWidth=1;for(let x=0;x<gC.width;x+=35){gX.beginPath();gX.moveTo(x,0);gX.lineTo(x,gC.height);gX.stroke();}for(let y=0;y<gC.height;y+=35){gX.beginPath();gX.moveTo(0,y);gX.lineTo(gC.width,y);gX.stroke();}
  gTgts.forEach(t=>{t.u();t.d();});gExps=gExps.filter(e=>e.life>0);gExps.forEach(e=>{e.u();e.d();});if(gTgts.every(t=>!t.alive)&&gSc<10)spTgts();requestAnimationFrame(gLoop);}
function startG(){gSc=0;gTm=30;gOn=true;gOv.style.display='none';gRes.style.display='none';document.getElementById('g-score').textContent='0';document.getElementById('g-time').textContent='30';gExps=[];spTgts();gLoop();clearInterval(gInt);gInt=setInterval(()=>{gTm--;document.getElementById('g-time').textContent=gTm;if(gTm<=0)endG(false);},1000);}
function endG(w){gOn=false;clearInterval(gInt);gRes.style.display='flex';const t=document.getElementById('gr-t'),m=document.getElementById('gr-m');
  if(w){t.textContent='🎉 TARGETS NEUTRALIZED!';t.style.color='#39ff14';m.innerHTML='Code: <strong style="color:#39ff14;font-size:1.1rem">CYBER-SHOOT-2026</strong>';showAch('🎮','SHARPSHOOTER','Won the mini game!');}
  else{t.textContent='💀 TIME\'S UP!';t.style.color='#ff2d95';m.textContent='Score: '+gSc+'/10. Try again!';}}
gC.addEventListener('click',e=>{if(!gOn)return;const r=gC.getBoundingClientRect(),cx=(e.clientX-r.left)*(gC.width/r.width),cy=(e.clientY-r.top)*(gC.height/r.height);
  for(let t of gTgts){if(t.hit(cx,cy)){t.alive=false;gSc++;document.getElementById('g-score').textContent=gSc;gExps.push(new Exp(t.x,t.y,t.c));sfxC();addVibe(3);if(gSc>=10)endG(true);break;}}});
gC.style.cursor='crosshair';
document.getElementById('game-go').addEventListener('click',startG);
document.getElementById('game-retry').addEventListener('click',startG);

// ═══ INTERACTION VIBE POINTS ═══
document.querySelectorAll('.cta-btn,.reg-btn,.nl,.game-btn').forEach(e=>e.addEventListener('click',()=>addVibe(3)));

// First click achievement
let firstClick=false;
document.addEventListener('click',()=>{if(!firstClick){firstClick=true;showAch('⚡','FIRST CONTACT','You clicked somewhere!');}},{once:true});

})();
