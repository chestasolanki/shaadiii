const opening = document.querySelector('#opening');
const openButton = document.querySelector('#open');
const main = document.querySelector('#invitation');
function setClosed(closed, focus = true) {
  document.body.classList.toggle('locked', closed);
  opening.classList.toggle('opened', !closed);
  main.inert = closed;
  if (closed) { window.scrollTo({top: 0, behavior: 'instant'}); if (focus) openButton.focus(); }
  else { document.querySelector('#home').focus({preventScroll: true}); }
}
setClosed(true, false);
openButton.addEventListener('click', () => setClosed(false));
function revealDate() {
  const heart = document.querySelector('#scratch');
  heart.classList.add('is-revealed');
  heart.setAttribute('aria-label', 'Wedding date: 21 November 2026, Saturday at 6 PM');
  document.querySelector('#scratch-title').textContent = '21 November 2026';
  document.querySelector('#scratch-sub').textContent = 'Saturday · 6:00 PM';
  document.querySelector('#reveal-date').textContent = 'Date revealed  ✦';
}
document.querySelector('#scratch').addEventListener('click', revealDate);
document.querySelector('#reveal-date').addEventListener('click', revealDate);
document.querySelector('#replay').addEventListener('click', () => setClosed(true));
const target = new Date('2026-11-21T18:00:00+05:30');
function update() {
  const delta = Math.max(0, target - Date.now());
  const values = [Math.floor(delta / 86400000), Math.floor(delta / 3600000) % 24, Math.floor(delta / 60000) % 60, Math.floor(delta / 1000) % 60];
  ['days', 'hours', 'minutes', 'seconds'].forEach((id, i) => document.getElementById(id).textContent = String(values[i]).padStart(2, '0'));
  document.querySelector('#countdown-note').textContent = delta === 0 ? 'The celebration has arrived ♥' : '';
}
update(); setInterval(update, 1000);
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('js-motion');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), {threshold: .12});
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
}

