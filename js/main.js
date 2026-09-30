const bgC = document.getElementById('bg');
const bgX = bgC.getContext('2d');
const fxC = document.getElementById('fx');
const fxX = fxC.getContext('2d');
let W, H;

function resize() { W = bgC.width = fxC.width = innerWidth; H = bgC.height = fxC.height = innerHeight; }
addEventListener('resize', resize); resize();

const heartColors = ['#7a2e3a','#8b7355','#9c4a56','#b8964e','#5c4a3a','#c4887a','#a0785e'];
const sparkColors = ['#b8964e','#7a2e3a','#8b7355','#c4887a','#d4b06a','#9c4a56'];
const petalColors = ['#c4887a','#d4b06a','#a0785e','#9c4a56','#8b7355'];
const heartStyles = ['outline','dashed','filled','double'];

// ═══ BACKGROUND ═══
const bokeh = [];
for (let i = 0; i < 25; i++) {
  bokeh.push({
    x: Math.random()*W, y: Math.random()*H,
    r: 20+Math.random()*50,
    vx: (Math.random()-.5)*.15, vy: (Math.random()-.5)*.1,
    alpha: .02+Math.random()*.025,
    phase: Math.random()*Math.PI*2,
    hue: Math.random()<.5 ? [178,34,52] : (Math.random()<.5 ? [184,150,78] : [139,115,85])
  });
}
const dust = [];
for (let i = 0; i < 60; i++) {
  dust.push({
    x: Math.random()*W, y: Math.random()*H,
    r: .4+Math.random()*1.5,
    vx: (Math.random()-.5)*.2, vy: -.05-Math.random()*.15,
    alpha: .08+Math.random()*.12,
    phase: Math.random()*Math.PI*2
  });
}

let t = 0;
function drawBg() {
  t += .008; bgX.clearRect(0,0,W,H);
  for (const b of bokeh) {
    b.x += b.vx+Math.sin(t*.5+b.phase)*.08;
    b.y += b.vy+Math.cos(t*.4+b.phase)*.06;
    if(b.x<-60)b.x=W+60; if(b.x>W+60)b.x=-60;
    if(b.y<-60)b.y=H+60; if(b.y>H+60)b.y=-60;
    const p=.7+.3*Math.sin(t+b.phase);
    const[r,g,bb]=b.hue;
    bgX.beginPath(); bgX.arc(b.x,b.y,b.r,0,Math.PI*2);
    bgX.fillStyle=`rgba(${r},${g},${bb},${b.alpha*p})`; bgX.fill();
  }
  for (const d of dust) {
    d.x+=d.vx+Math.sin(t*1.5+d.phase)*.12; d.y+=d.vy;
    if(d.y<-10){d.y=H+10;d.x=Math.random()*W}
    if(d.x<-10)d.x=W+10; if(d.x>W+10)d.x=-10;
    const fl=.6+.4*Math.sin(t*2+d.phase);
    bgX.beginPath(); bgX.arc(d.x,d.y,d.r,0,Math.PI*2);
    bgX.fillStyle=`rgba(139,115,85,${d.alpha*fl})`; bgX.fill();
  }
  requestAnimationFrame(drawBg);
}
drawBg();

// ═══ FX PARTICLES ═══
const particles = [];
let fxRunning=false, running=false;

function drawFx() {
  fxX.clearRect(0,0,W,H);
  for(let i=particles.length-1;i>=0;i--){
    if(!particles[i].update()) particles.splice(i,1);
    else particles[i].draw(fxX);
  }
  if(particles.length>0||running) requestAnimationFrame(drawFx);
  else fxRunning=false;
}
function ensureFx(){if(!fxRunning){fxRunning=true;drawFx()}}

function burstHearts(n){
  const cx=W/2,cy=H/2;
  for(let i=0;i<n;i++){
    const a=(Math.PI*2*i)/n+(Math.random()-.5)*.4, sp=3+Math.random()*6;
    particles.push(new Particle('heart',cx,cy,{
      vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,
      size:14+Math.random()*22,
      color:heartColors[~~(Math.random()*heartColors.length)],
      decay:.008+Math.random()*.008,vrot:(Math.random()-.5)*.06,gravity:.03,
      style:heartStyles[~~(Math.random()*4)]
    }));
  }
}
function burstSparks(n){
  const cx=W/2,cy=H/2;
  for(let i=0;i<n;i++){
    const a=Math.random()*Math.PI*2, sp=2+Math.random()*8;
    particles.push(new Particle('spark',cx,cy,{
      vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,
      size:1+Math.random()*2.5,
      color:sparkColors[~~(Math.random()*sparkColors.length)],
      decay:.012+Math.random()*.015,gravity:.02
    }));
  }
}
function burstPetals(n){
  const cx=W/2,cy=H/2;
  for(let i=0;i<n;i++){
    const a=Math.random()*Math.PI*2, sp=1.5+Math.random()*5;
    particles.push(new Particle('petal',cx,cy,{
      vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,
      size:5+Math.random()*8,
      color:petalColors[~~(Math.random()*petalColors.length)],
      decay:.005+Math.random()*.007,rot:Math.random()*Math.PI*2,
      vrot:(Math.random()-.5)*.08,gravity:.04
    }));
  }
}
function burstRings(n){
  const cx=W/2,cy=H/2;
  for(let i=0;i<n;i++){
    const a=(Math.PI*2*i)/n, sp=2+Math.random()*3;
    particles.push(new Particle('ring',cx,cy,{
      vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,
      size:4+Math.random()*6,color:'rgba(184,150,78,.5)',
      decay:.006+Math.random()*.006,gravity:.01
    }));
  }
}
function floatingHeart(){
  particles.push(new Particle('heart',Math.random()*W,H+20,{
    vx:(Math.random()-.5)*.4,vy:-.5-Math.random()*.6,
    size:10+Math.random()*16,
    color:heartColors[~~(Math.random()*heartColors.length)],
    decay:.002+Math.random()*.003,vrot:(Math.random()-.5)*.015,gravity:0,
    style:heartStyles[~~(Math.random()*4)]
  }));
}
function fallingPetal(){
  particles.push(new Particle('petal',Math.random()*W,-20,{
    vx:(Math.random()-.5)*.5,vy:.3+Math.random()*.4,
    size:4+Math.random()*5,
    color:petalColors[~~(Math.random()*petalColors.length)],
    decay:.002+Math.random()*.002,rot:Math.random()*Math.PI*2,
    vrot:(Math.random()-.5)*.03,gravity:.003
  }));
}

// ═══ MAIN ═══
let triggered=false, floatTimer=null;

document.body.addEventListener('click',()=>{
  if(!triggered){triggered=true;go();}
  else{reset();}
});

function go(){
  running=true; ensureFx();
  document.getElementById('prompt').classList.add('gone');

  // flash
  let fa=.6;
  (function fl(){
    fxX.save();fxX.globalAlpha=fa;
    const g=fxX.createRadialGradient(W/2,H/2,0,W/2,H/2,W*.5);
    g.addColorStop(0,'rgba(196,136,122,.5)');
    g.addColorStop(.5,'rgba(244,237,224,.6)');
    g.addColorStop(1,'transparent');
    fxX.fillStyle=g;fxX.fillRect(0,0,W,H);fxX.restore();
    fa-=.04;if(fa>0)requestAnimationFrame(fl);
  })();

  // explosion
  burstSparks(60);burstRings(16);
  setTimeout(()=>{burstHearts(30);burstPetals(25);burstSparks(30)},150);
  setTimeout(()=>{burstHearts(15);burstPetals(12)},500);
  setTimeout(()=>{burstHearts(8);burstSparks(15)},850);

  // photo
  setTimeout(()=>{
    const pw=document.getElementById('photoWrap');
    pw.style.pointerEvents='auto'; pw.classList.add('show');
  },100);

  // ── MESSAGE SEQUENCE ──
  document.getElementById('msg').classList.add('show');

  // 1) "Te amooo" pops in, then o's grow one by one
  setTimeout(()=> document.getElementById('line1').classList.add('pop'), 1400);

  // 2) "mi amooooooooor" + o's + R
  setTimeout(()=>{
    const l2 = document.getElementById('line2');
    l2.classList.add('show');
    setTimeout(()=> l2.classList.add('animate'), 100);
  }, 2600);

  // 3) separator + subtitle
  setTimeout(()=> document.getElementById('sep').classList.add('show'), 4800);
  setTimeout(()=> document.getElementById('sub').classList.add('show'), 5200);
  setTimeout(()=> document.getElementById('restart').classList.add('show'), 6200);

  // ambient
  setTimeout(()=>{
    floatTimer=setInterval(()=>{
      floatingHeart();
      if(Math.random()<.5) fallingPetal();
      if(Math.random()<.2) fallingPetal();
    },450);
  },1800);
}

function reset(){
  triggered=false; running=false;
  if(floatTimer){clearInterval(floatTimer);floatTimer=null;}
  particles.length=0; fxX.clearRect(0,0,W,H);

  const pw=document.getElementById('photoWrap');
  pw.classList.remove('show'); pw.style.pointerEvents='none';
  void pw.offsetWidth;

  document.getElementById('prompt').classList.remove('gone');
  document.getElementById('msg').classList.remove('show');
  document.getElementById('line1').classList.remove('pop');

  // reset line1 o's
  document.querySelectorAll('#line1 .g').forEach(o=>{
    o.style.animation='none'; void o.offsetWidth; o.style.animation='';
  });

  const l2=document.getElementById('line2');
  l2.classList.remove('show','animate');
  l2.querySelectorAll('.g2').forEach(o=>{
    o.style.animation='none'; void o.offsetWidth; o.style.animation='';
  });

  document.getElementById('sep').classList.remove('show');
  document.getElementById('sub').classList.remove('show');
  document.getElementById('restart').classList.remove('show');
}
