(() => {
  'use strict';
  const data = window.COMPRESSION_DATA;
  const slider = document.getElementById('compression-slider');
  const outcome = document.getElementById('compression-outcome');
  if (!data || !slider) return;
  const atlas = new Image();
  const original = document.getElementById('original-canvas');
  const mps = document.getElementById('mps-canvas');
  const maximumBond = Math.max(...data.frames.flatMap(frame => frame.bonds));
  let ready = false;
  function draw(canvas, col, row) {
    canvas.getContext('2d').drawImage(atlas, col*data.size, row*data.size, data.size, data.size, 0, 0, data.size, data.size);
  }
  function update() {
    if (!ready) return;
    const i = Number(slider.value);
    const frame = data.frames[i];
    draw(original, 0, 0);
    draw(mps, 1, 1+i);
    const ratio = frame.mps.cr.toFixed(1) + '×';
    document.getElementById('compression-value').textContent = ratio;
    slider.setAttribute('aria-valuetext', ratio + ' storage compression');
    mps.setAttribute('aria-label', 'Matrix Product State reconstruction at ' + ratio + ' storage compression');
    for (let k=0;k<data.sites-1;k++) {
      document.getElementById('mps-bond-'+k).setAttribute('stroke-width', (0.8 + 10*frame.bonds[k+1]/maximumBond).toFixed(3));
    }
    // Both methods store exactly the same number of float64 values at every setting.
    const difference = 100 * (1-frame.mps.relativeError/frame.svd.relativeError);
    if (difference >= 0) {
      outcome.textContent = 'At the same storage compression, MPS has ' + difference.toFixed(1) + '% lower error than Singular Value Decomposition (SVD).';
    } else {
      const svdBenefit = 100 * (1-frame.svd.relativeError/frame.mps.relativeError);
      outcome.textContent = 'At the same storage compression, Singular Value Decomposition (SVD) has ' + svdBenefit.toFixed(1) + '% lower error than MPS.';
    }
  }
  slider.addEventListener('input', update);
  atlas.onload = () => {
    ready = true;
    slider.max = data.frames.length - 1;
    slider.value = data.defaultIndex;
    slider.disabled = false;
    update();
  };
  atlas.onerror = () => { outcome.textContent = 'The comparison images could not load. Please reload.'; };
  atlas.src = 'compression-atlas.png?v=2';
})();
