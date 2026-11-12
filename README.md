# Massen Esmaeili — personal website

Personal portfolio: https://mawssen.github.io/

A buildless, responsive static site. Publish this folder at the root of `Mawssen/Mawssen.github.io`; GitHub Pages serves `main` from `/ (root)`. No third-party JavaScript, fonts, trackers, or runtime dependencies.

## Interactive SVD / MPS comparison

The comparison uses scikit-image's **camera** photograph, released under CC0 by photographer Lav Varshney. The original 512 × 512 image is included as `camera-source.png`; source and license: https://scikit-image.org/docs/stable/api/skimage.data.html#skimage.data.camera

The image was selected after measuring several standard images, with the user's explicit approval to select a favorable example. This is an image-compression demonstration, not DNS or a result reported in the paper. The full least-to-most-compressed range includes a slight SVD win at its least-compressed setting.

### Reproduce

Install Python dependencies `numpy`, `scipy`, and `Pillow`, then run:

```sh
OPENBLAS_NUM_THREADS=1 VECLIB_MAXIMUM_THREADS=1 python build-comparison.py
```

The script uses the included source image and produces `compression-atlas.png` and `compression-data.js`. The browser uses `compression.js` to select genuine precomputed reconstructions; it does not interpolate or fabricate numerical results. Source-image SHA-256 is included in the results file.

### Numerical definitions

- Downsample once, 512 × 512 → 256 × 256, using Pillow's Lanczos filter; convert intensities to float64 in [0,1].
- Matrix SVD: compress the 256 × 256 image matrix; absorb singular values into one factor. Stored scalar count = `r * (256 + 256)`.
- MPS / TT-SVD: tensorize into 16 physical dimensions of size 2, ordered row-bit 1, column-bit 1, row-bit 2, column-bit 2, … from most significant/coarsest to least significant/finest. Use fixed maximum bond dimension χ, with rank limits at the boundaries.
- Exact core storage = `sum(2 * chi[k-1] * chi[k])`, with boundary dimensions 1. CR = `65536 / stored` in both cases. See Eq. (2.9): https://arxiv.org/pdf/2608.28869#page=8
- For each MPS budget choose `r = ceil(MPS stored / 512)`: SVD has equal or more stored scalars. Show the two actual CRs separately.
- Relative error = Frobenius norm of the residual / Frobenius norm of the original. Infidelity is also stored in the numerical results, following Eq. (2.11).
- Metrics use unclipped float64 arrays. Grayscale renderings are clipped to [0,1] and quantized only for display. Absolute error maps use one shared maximum across all frames and methods.
- CR describes numerical model storage, not PNG delivery size. These are fixed maximum-bond results, separate from the paper's adaptive-cutoff DNS experiments.

The generator verifies nontruncated MPS reconstruction to relative error < 1e-12, the exact core-count identity and fixed-rank envelopes, SVD residuals against singular-value tails, and conservative SVD storage budgets.

## Publications and presentations

Biographical content is grounded in the user's supplied CV. All five presentation titles link to the exact URLs in the current CV:

- https://dfd-meeting.aps.org/dfd/2026/events/B17/16
- https://dfd-meeting.aps.org/dfd/2026/events/A15/11
- https://siamnnp2026.sciencesconf.org/data/pages/SIAM_NNP26_program.pdf#page=2
- https://wccm-eccomas2026.org/event/contribution/b455601d-055a-11f1-919d-000c29ddfc0c
- https://meetings-archive.aps.org/dfd/2025/j26/1/

Publication: https://arxiv.org/abs/2608.28869

## Identity

Aubergine, pale lilac, and citron. ME stands for Massen Esmaeili, Mechanical Engineering, and “me.”
