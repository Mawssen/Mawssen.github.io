# Massen Esmaeili — personal website

Personal portfolio: https://mawssen.github.io/

A buildless, responsive static site. Publish this folder at the root of `Mawssen/Mawssen.github.io`; GitHub Pages serves `main` from `/ (root)`. No third-party JavaScript, fonts, trackers, or runtime dependencies.

## Compress me trial

This reversible experiment replaces the camera image in the compression lab with Massen's headshot. The original source is `Reference/Photos/Headshot.png`; only a prepared 256 × 256 grayscale crop (`headshot.png`) is included in the site. Crop box: (0, 147, 1084, 1231), then Lanczos downsampling. Reference file is unchanged. Preparation metadata: `Profiles/compress-me-preparation.json` in the application workspace.

Run `OPENBLAS_NUM_THREADS=1 VECLIB_MAXIMUM_THREADS=1 python build-comparison.py` to reproduce the atlas and metrics. Requires NumPy, SciPy and Pillow. All compressed images are actual interleaved-bit TT-SVD/MPS reconstructions with 16 physical dimensions of size 2. No blur/pixelation filter is used to imitate compression.

The first slider state is the uncompressed 256px grayscale reference at 1× raw storage, labeled “Full-resolution Massen”. It is not a claim that an exact MPS stores fewer numbers than the raw image. Eleven MPS truncations follow, with increasing storage compression from 4.7× through 2048×. The middle states say “Recognizable Massen”; the last three say “Abstract-art Massen”. The default is 42.7×. These are playful UI bands, not perceptual classification results.

MPS core storage is `sum(2 * chi[k-1] * chi[k])`; CR is 65536 / stored float64 scalars. At the nine matched budgets, matrix SVD stores exactly the same number of scalars, and the measured comparison reports whichever method actually has lower relative Frobenius error. At the strongest two truncations no positive-rank matrix SVD fits the MPS budget, so no SVD error-comparison sentence is shown. No comparison is shown for the full-resolution reference.

Ranks are nested componentwise. Schematic widths use `0.8 + 10 * log2(rank + 1) / log2(maximum_rank + 1)` to make small bond changes visible across the expanded range. Widths decrease with increasing compression. Existing reduced-motion handling remains in place; the new headshot labels themselves do not animate.

Validation covers exact untruncated reconstruction, actual core counts, monotonic CR and reconstruction errors, nested ranks, exact SVD budgets and singular-value-tail errors, all 12 UI states, label/ARIA updates, atlas rows, bond width monotonicity and image loading failure. The first reference tile is byte-identical to the original display tile.

Rollback: the complete pre-trial site is in `Profiles/github-pages-history/before-compress-me/`. The last verified live commit before this trial is `cdbc0c5dc7f17a8e4a1a845bc5a9c0c47a00e12e`. The current live site has not been updated with the trial. A standalone preview is at `Profiles/compress-me-preview.html` and can be opened without a server or network access.

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

## Presentation carousel

Five CV-linked presentations appear one at a time, with 3-second rotation, fade/slide transitions, side arrows and five clickable dots. The active dot is darker. Hovering no longer stops rotation; keyboard focus on a title/credit link keeps that link still. Reduced-motion preferences remove transitions. Hidden tabs suspend rotation.

Research imagery (illustrative external work, not Massen's research results):
- Combustion presentations: DOE/ORNL S3D turbulent jet-flame simulation; public domain. https://commons.wikimedia.org/wiki/File:U.S._Department_of_Energy_-_Science_-_394_013_004_(9393758801).jpg
- Quantum hardware presentation: IBM prototype cryostat by Lars Ploughman, CC BY-SA 2.0. https://commons.wikimedia.org/wiki/File:IBM_QC.jpg
- Turbulence presentation: turbulent velocity acting on a passive scalar, A. Turiel, public domain. https://commons.wikimedia.org/wiki/File:Turbulence-Velocity_full-res.gif

Sources and credits appear beneath each image. All images are remotely loaded from Wikimedia Commons and displayed without cropping. Locations and original CV title hyperlinks remain intact.
