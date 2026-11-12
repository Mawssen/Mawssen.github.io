(() => {
  const carousel = document.querySelector('.presentation-carousel');
  if (!carousel) return;
  const slides = [...carousel.querySelectorAll('.presentation-slide')];
  const stage = carousel.querySelector('.presentation-stage');
  const previous = carousel.querySelector('.previous');
  const next = carousel.querySelector('.next');
  const pause = carousel.querySelector('.presentation-pause');
  const position = carousel.querySelector('.presentation-position');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0, timer, transition, paused = motion.matches, hovered = false, focused = false;
  const schedule = () => {
    clearTimeout(timer);
    if (!paused && !hovered && !focused && !document.hidden) timer = setTimeout(() => show(1), 6500);
  };
  const updatePause = () => {
    pause.textContent = paused ? 'Play ▷' : 'Pause Ⅱ';
    pause.setAttribute('aria-label', `${paused ? 'Start' : 'Pause'} automatic presentation slides`);
    stage.setAttribute('aria-live', paused ? 'polite' : 'off');
  };
  const show = direction => {
    clearTimeout(timer);
    clearTimeout(transition);
    slides.forEach((slide, i) => { slide.hidden = i !== current; slide.classList.remove('is-entering', 'is-leaving'); });
    const outgoing = slides[current];
    const finish = () => {
      outgoing.hidden = true;
      outgoing.classList.remove('is-leaving');
      current = (current + direction + slides.length) % slides.length;
      slides[current].hidden = false;
      slides[current].classList.add('is-entering');
      position.textContent = `${current + 1} / ${slides.length}`;
      position.setAttribute('aria-label', `Presentation ${current + 1} of ${slides.length}`);
      schedule();
    };
    if (motion.matches) finish();
    else { outgoing.classList.add('is-leaving'); transition = setTimeout(finish, 220); }
  };
  previous.hidden = next.hidden = false;
  carousel.querySelector('.presentation-controls').hidden = false;
  previous.addEventListener('click', () => show(-1));
  next.addEventListener('click', () => show(1));
  pause.addEventListener('click', () => { paused = !paused; updatePause(); schedule(); });
  carousel.addEventListener('mouseenter', () => { hovered = true; schedule(); });
  carousel.addEventListener('mouseleave', () => { hovered = false; schedule(); });
  carousel.addEventListener('focusin', () => { focused = true; schedule(); });
  carousel.addEventListener('focusout', event => { focused = carousel.contains(event.relatedTarget); schedule(); });
  document.addEventListener('visibilitychange', schedule);
  motion.addEventListener('change', () => { if (motion.matches) paused = true; updatePause(); schedule(); });
  updatePause();
  schedule();
})();
