(() => {
  'use strict';
  const data = window.COMPRESSION_DATA;
  const slider = document.getElementById('compression-slider');
  const outcome = document.getElementById('compression-outcome');
  if (!data || !slider) return;
  const play = document.getElementById('compression-play');
  const reset = document.getElementById('compression-reset');
  const less = document.getElementById('compression-less');
  const more = document.getElementById('compression-more');
  const errors = document.getElementById('show-errors');
  const atlas = new Image();
  const original = document.getElementById('original-canvas');
  const svd = document.getElementById('svd-canvas');
  const mps = document.getElementById('mps-canvas');
  let timer = null;
  let direction = 1;
  let ready = false;
  const number = x => x.toLocaleString('en-US');
  const pct = x => (100*x).toFixed(2) + '%';
  const cr = x => x.toFixed(1) + '×';
  const text = (id, value) => { document.getElementById(id).textContent = value; };
  function stop() {
    if (timer !== null) window.clearInterval(timer);
    timer = null;
    play.textContent = 'Play comparison';
    play.setAttribute('aria-pressed', 'false');
    outcome.setAttribute('aria-live', 'polite');
  }
  function draw(canvas, column, row) {
    canvas.getContext('2d').drawImage(atlas, column*data.size, row*data.size, data.size, data.size, 0, 0, data.size, data.size);
  }
  function update() {
    if (!ready) return;
    const i = Number(slider.value);
    const frame = data.frames[i];
    draw(original, 0, 0);
    const row = 1 + i + (errors.checked ? data.frames.length : 0);
    draw(svd, 0, row);
    draw(mps, 1, row);
    svd.setAttribute('aria-label', (errors.checked ? 'SVD absolute error map' : 'Matrix SVD reconstruction') + ', rank ' + frame.rank);
    mps.setAttribute('aria-label', (errors.checked ? 'MPS absolute error map' : 'MPS reconstruction') + ', maximum bond dimension ' + frame.chi);
    text('svd-rank', 'rank ' + frame.rank);
    text('mps-chi', 'χ = ' + frame.chi);
    text('svd-cr', cr(frame.svd.cr) + ' CR');
    text('mps-cr', cr(frame.mps.cr) + ' CR');
    text('svd-error', pct(frame.svd.relativeError) + ' error');
    text('mps-error', pct(frame.mps.relativeError) + ' error');
    text('compression-value', cr(frame.mps.cr));
    slider.setAttribute('aria-valuetext', cr(frame.mps.cr) + ' MPS compression, chi ' + frame.chi);
    less.disabled = i === 0;
    more.disabled = i === data.frames.length - 1;
    document.getElementById('error-scale').hidden = !errors.checked;
    text('error-scale-text', '0 → ' + data.errorMaximum.toFixed(3));
    const winner = frame.mps.relativeError < frame.svd.relativeError ? 'MPS' : 'SVD';
    const a = Math.min(frame.mps.relativeError, frame.svd.relativeError);
    const b = Math.max(frame.mps.relativeError, frame.svd.relativeError);
    const benefit = (100*(1-a/b)).toFixed(1);
    outcome.textContent = winner + ' has ' + benefit + '% lower error at this setting.';
    outcome.dataset.winner = winner.toLowerCase();
    text('storage-detail', 'This setting: MPS stores ' + number(frame.mps.stored) + ' values; SVD stores ' + number(frame.svd.stored) + '. Boundary-to-boundary MPS bonds: ' + frame.bonds.join(' · ') + '.');
  }
  slider.addEventListener('input', () => { stop(); update(); });
  less.addEventListener('click', () => { stop(); slider.stepDown(); update(); });
  more.addEventListener('click', () => { stop(); slider.stepUp(); update(); });
  errors.addEventListener('change', update);
  reset.addEventListener('click', () => { stop(); slider.value = data.defaultIndex; errors.checked = false; update(); });
  play.addEventListener('click', () => {
    if (timer !== null) { stop(); return; }
    play.textContent = 'Pause comparison';
    play.setAttribute('aria-pressed', 'true');
    outcome.setAttribute('aria-live', 'off');
    timer = window.setInterval(() => {
      let next = Number(slider.value) + direction;
      if (next < 0 || next >= data.frames.length) { direction *= -1; next = Number(slider.value) + direction; }
      slider.value = next;
      update();
    }, 1400);
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  atlas.onload = () => {
    ready = true;
    slider.max = data.frames.length - 1;
    slider.value = data.defaultIndex;
    [slider, play, reset, errors].forEach(el => { el.disabled = false; });
    update();
  };
  atlas.onerror = () => { outcome.textContent = 'The comparison images could not load. Reload to try again.'; };
  atlas.src = 'compression-atlas.png?v=1';
})();
