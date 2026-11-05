const intro = document.querySelector('#intro');
const main = document.querySelector('#invitation');
const openButton = document.querySelector('#open');
const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let introTimer;
const music = document.querySelector('#wedding-music');
const musicToggle = document.querySelector('#music-toggle');
const musicStatus = document.querySelector('#music-status');
let musicWanted = false, musicRequested = false, musicTimer;
function updateMusicButton() {
  const playing = !music.paused;
  musicToggle.setAttribute('aria-pressed', String(playing));
  musicToggle.setAttribute('aria-label', playing ? 'Pause music' : 'Play music');
}
function playMusic() {
  if (!musicWanted) return;
  music.play().then(() => {
    if (!musicWanted) music.pause();
  }).catch(() => {
    if (!musicWanted) return;
    musicWanted = false;
    updateMusicButton();
    musicStatus.textContent = 'Tap the sound button to play music';
  });
}
music.addEventListener('play', updateMusicButton);
music.addEventListener('pause', updateMusicButton);
musicToggle.addEventListener('click', () => {
  if (musicWanted) {
    musicWanted = false;
    clearTimeout(musicTimer);
    music.pause();
    updateMusicButton();
  } else {
    musicWanted = true;
    musicStatus.textContent = '';
    playMusic();
  }
});
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo({top:0,behavior:'instant'});
function openInvitation() {
  if (intro.classList.contains('opened')) return;
  window.scrollTo({top:0,behavior:'instant'});
  intro.classList.add('opened');
  if (!musicRequested) {
    musicRequested = true;
    musicWanted = true;
    musicToggle.hidden = false;
    musicTimer = setTimeout(playMusic, 300);
  }
  const duration = prefersReducedMotion.matches ? 0 : 3000;
  introTimer = setTimeout(() => {
    intro.classList.add('done');
    document.body.classList.remove('locked');
    document.body.classList.add('unveiled');
    main.inert = false;
    document.querySelector('#home').focus({preventScroll:true});
  }, duration);
}
openButton.addEventListener('click', openInvitation);
document.querySelector('#replay').addEventListener('click', () => {
  clearTimeout(introTimer);
  window.scrollTo({top:0,behavior:'instant'});
  main.inert = true;
  document.body.classList.remove('unveiled');
  document.body.classList.add('locked');
  intro.classList.remove('done','opened');
  revealed = false; canvas.style.pointerEvents = ''; paintScratch();
  document.querySelector('#reveal-button').textContent = 'Tap to reveal';
  openButton.focus();
});
const canvas = document.querySelector('#scratch');
const ctx = canvas.getContext('2d', {willReadFrequently:true});
function heartPath() {
  const p = new Path2D();
  p.moveTo(150,258);p.bezierCurveTo(130,243,8,163,8,92);p.bezierCurveTo(8,25,93,3,150,69);p.bezierCurveTo(207,3,292,25,292,92);p.bezierCurveTo(292,163,170,243,150,258);p.closePath();return p;
}
function paintScratch() {
  ctx.clearRect(0,0,300,270);
  const path=heartPath();
  const gradient=ctx.createLinearGradient(0,0,300,270);
  gradient.addColorStop(0,'#a84353');gradient.addColorStop(.5,'#7d1e2d');gradient.addColorStop(1,'#56101c');
  ctx.fillStyle=gradient;ctx.fill(path);ctx.strokeStyle='#912c3b';ctx.lineWidth=1.5;ctx.stroke(path);
  ctx.save();ctx.clip(path);
  for(let i=0;i<450;i++){const x=(i*71)%300,y=(i*113)%270;ctx.fillStyle=i%7===0?'rgba(255,255,240,.5)':'rgba(255,255,240,.14)';ctx.fillRect(x,y,i%7===0?2:1,i%7===0?2:1)}
  ctx.restore();
  ctx.fillStyle='#fffdf0';ctx.textAlign='center';ctx.font='600 16px Georgia';ctx.fillText('SCRATCH HERE',150,123);ctx.font='italic 15px Georgia';ctx.fillText('to reveal a special date',150,148);
}
paintScratch();
let drawing=false,last=null,revealed=false;
function position(event){const rect=canvas.getBoundingClientRect();return {x:(event.clientX-rect.left)*300/rect.width,y:(event.clientY-rect.top)*270/rect.height}}
function scratch(event){if(!drawing || revealed)return;const pt=position(event);ctx.save();ctx.globalCompositeOperation='destination-out';ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=42;ctx.beginPath();ctx.moveTo(last?last.x:pt.x,last?last.y:pt.y);ctx.lineTo(pt.x,pt.y);ctx.stroke();ctx.restore();last=pt}
function celebrate() {
  if (prefersReducedMotion.matches) return;
  const burst = document.createElement('div');
  burst.className = 'celebration';
  burst.setAttribute('aria-hidden', 'true');
  const colors = ['#d1ad67', '#f1d7b2', '#721924', '#f8f0df', '#a82c3e', '#e6c280'];
  for (let i = 0; i < 48; i++) {
    const piece = document.createElement('span');
    piece.style.setProperty('--x', (Math.random() * 100).toFixed(1) + '%');
    piece.style.setProperty('--drift', (Math.random() * 160 - 80).toFixed(0) + 'px');
    piece.style.setProperty('--delay', (Math.random() * .45).toFixed(2) + 's');
    piece.style.setProperty('--color', colors[i % colors.length]);
    burst.appendChild(piece);
  }
  document.body.appendChild(burst);
  setTimeout(() => burst.remove(), 3200);
}
function reveal(){if(revealed)return;revealed=true;ctx.clearRect(0,0,300,270);canvas.style.pointerEvents='none';document.querySelector('#reveal-button').textContent='Date revealed ♥';celebrate();}
canvas.addEventListener('pointerdown',event=>{drawing=true;last=null;canvas.setPointerCapture(event.pointerId);scratch(event)});
canvas.addEventListener('pointermove',scratch);
function finish(){if(!drawing)return;drawing=false;last=null;const pixels=ctx.getImageData(0,0,300,270).data;let cleared=0,total=0;for(let y=40;y<210;y+=6){for(let x=35;x<265;x+=6){if(ctx.isPointInPath(heartPath(),x,y)){total++;if(pixels[(y*300+x)*4+3]<80)cleared++}}}if(cleared/total>.42)reveal()}
canvas.addEventListener('pointerup',finish);canvas.addEventListener('pointercancel',finish);
document.querySelector('#reveal-button').addEventListener('click',reveal);
const target=new Date('2026-11-25T17:00:00+05:30');
function update(){const remaining=Math.max(0,target-Date.now());const values=[Math.floor(remaining/86400000),Math.floor(remaining/3600000)%24,Math.floor(remaining/60000)%60,Math.floor(remaining/1000)%60];['days','hours','minutes','seconds'].forEach((id,i)=>document.getElementById(id).textContent=String(values[i]).padStart(2,'0'));document.querySelector('#countdown-note').textContent=remaining===0?'The celebration has arrived ♥':''}
update();setInterval(update,1000);

// Reveal invitation details as they enter the viewport; leave them visible afterwards.
if ('IntersectionObserver' in window && !prefersReducedMotion.matches) {
  const details = document.querySelectorAll('.linen .section h2, .linen .section .heart-divider, .linen .section-symbol, .ganesh-mantra, .welcome-copy, .wedding-photo, .scratch-wrap, .text-button, .section .pill, .countdown, .date-heading, .events article, .venue h3, .venue p, .section .map, .closing-names, .family-label, .family-names');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold: 0.12});
  details.forEach(element => { element.classList.add('scroll-reveal'); observer.observe(element); });
  document.documentElement.classList.add('scroll-motion');
}
