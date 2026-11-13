(() => {
  'use strict';
  const card = document.getElementById('quantum-cat');
  if (!card) return;
  const button = card.querySelector('.cat-observe');
  const status = card.querySelector('.cat-announcement');
  const stage = card.querySelector('.cat-stage');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
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
      status.textContent = 'Box closed. Ready to observe again.';
      button.textContent = 'Observe';
      return;
    }
    // Equal-probability browser-side draw; nothing is stored.
    const outcome = Math.random() < 0.5 ? 'alive' : 'dizzy';
    busy = true;
    button.setAttribute('aria-disabled', 'true');
    finishPending = () => {
      card.dataset.state = outcome;
      stage.setAttribute('aria-label', outcome === 'alive'
        ? 'A happy cat relaxing in a calm hot tub with smooth laminar flow lines.'
        : 'A cute, unharmed cat with swirly eyes in the swirling water of a hot tub.');
      status.textContent = stage.getAttribute('aria-label');
      button.textContent = 'Reset';
    };
    if (motion.matches) finish();
    else {
      card.classList.add('is-collapsing');
      timer = setTimeout(finish, 280);
    }
  });
  motion.addEventListener('change', () => { if (motion.matches) finish(); });
})();
