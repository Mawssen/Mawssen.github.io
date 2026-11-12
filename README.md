# Massen Esmaeili — personal website

Personal portfolio: https://mawssen.github.io/

A buildless, responsive static site. Publish this folder at the root of `Mawssen/Mawssen.github.io`; GitHub Pages serves `main` from `/ (root)`. No third-party JavaScript, fonts, trackers, or runtime dependencies.

## Interactive MPS comparison

The page shows only the original photograph, its Matrix Product State (MPS) reconstruction, a compression slider, a rank-aware MPS schematic, and one measured error-comparison sentence.

Image: scikit-image's **camera** photograph, CC0 by Lav Varshney. The original 512 × 512 image is included as `camera-source.png`. Source and license: https://scikit-image.org/docs/stable/api/skimage.data.html#skimage.data.camera

This image was selected with the user's approval after measuring several standard images. This is a selected image benchmark, not DNS, a universal claim about MPS, or a result reported in the paper.

### Reproduce

Requires Python, NumPy, SciPy, and Pillow:

```sh
OPENBLAS_NUM_THREADS=1 VECLIB_MAXIMUM_THREADS=1 python build-comparison.py
```

The script builds `compression-atlas.png` and `compression-data.js` from the included image. The browser selects genuine precomputed reconstructions without interpolating image data or metrics. Package versions and the source SHA-256 are in the results file.

### Equal compression ratios

Both representations store **exactly the same number of float64 scalars at every setting**. The image is downsampled once to 256 × 256 using Lanczos, then normalized to [0,1].

- Matrix SVD operates on the 256 × 256 image matrix. Singular values are absorbed into one factor, so the stored count is `r * (256 + 256)`.
- MPS uses 16 physical dimensions of size 2. Row and column bits are interleaved coarse to fine. Exact core storage is `sum(2 * chi[k-1] * chi[k])`, with boundary dimensions 1, following Eq. (2.9): https://arxiv.org/pdf/2608.28869#page=8
- CR is `65536 / stored` for both methods. Relative error is the Frobenius norm of the residual divided by the Frobenius norm of the original.
- Rather than rounded, nearly equal budgets, this revision uses deterministic bond-rank profiles whose core counts are exact multiples of 512. The profile search begins from capped-rank envelopes and adjusts two bonds to match the matrix storage budget, subject to valid neighboring-rank constraints.
- Profiles are nested componentwise: moving toward more compression never increases any bond rank. All actual retained ranks are stored in the results file. These profiles are not uniform-chi approximations or the paper's adaptive-cutoff DNS results.
- The displayed MPS bond widths are `0.8 + 10 * retained_rank / global_maximum_rank`. Boundary and physical legs keep their proper topology; widths are visual encodings of the bond dimensions.
- Metrics use unclipped float64 arrays; images share the same [0,1] grayscale, clipped and quantized only for display. CR describes numerical storage, not PNG download size.
- The sentence on the page reports `100 * (1 - MPS_error / SVD_error)` when MPS wins, and correctly reports the opposite result if SVD wins. No outcome is hard-coded.

The generator checks exact untruncated TT-SVD reconstruction (< 1e-12 relative error), core storage, validity and nesting of bond profiles, matrix-SVD singular-value tails, and exactly equal storage/CR.

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
