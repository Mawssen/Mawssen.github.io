(() => {
  'use strict';
  const card = document.getElementById('quantum-cat');
  if (!card) return;
  const button = card.querySelector('.cat-observe');
  const status = card.querySelector('.cat-state');
  const counter = card.querySelector('.cat-counter');
  const stage = card.querySelector('.cat-stage');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const counts = { alive: 0, dizzy: 0 };
  const initialDescription = stage.getAttribute('aria-label');
  let busy = false;
  let timer;
  let finishPending;
  function finish() {
    if (!finishPending) return;
    clearTimeout(timer);
    const apply = finishPending;
    finishPending = null;
    card.classList.remove('is-collapsing');
    apply();
    busy = false;
    button.removeAttribute('aria-disabled');
  }
  button.hidden = false;
  button.addEventListener('click', () => {
    if (busy) return;
    if (card.dataset.state !== 'superposition') {
      card.dataset.state = 'superposition';
      stage.setAttribute('aria-label', initialDescription);
      status.textContent = 'State: superposition';
      button.textContent = 'Observe';
      return;
    }
    // A fair, browser-side draw; counts live only in this page's memory.
    const outcome = Math.random() < 0.5 ? 'alive' : 'dizzy';
    busy = true;
    button.setAttribute('aria-disabled', 'true');
    finishPending = () => {
      counts[outcome] += 1;
      card.dataset.state = outcome;
      stage.setAttribute('aria-label', outcome === 'alive'
        ? 'A happy cat relaxing in a calm hot tub with smooth laminar flow lines.'
        : 'An unharmed, playful cat with swirly eyes spun around by a turbulent vortex.');
      status.textContent = outcome === 'alive' ? 'Measured: |alive⟩ ✨' : 'Measured: |dizzy⟩ 🌀';
      counter.textContent = `Alive: ${counts.alive} · Dizzy: ${counts.dizzy}`;
      button.textContent = 'Reset superposition';
    };
    if (motion.matches) finish();
    else {
      card.classList.add('is-collapsing');
      timer = setTimeout(finish, 280);
    }
  });
  motion.addEventListener('change', () => { if (motion.matches) finish(); });
})();
