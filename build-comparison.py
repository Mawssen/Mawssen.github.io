"""Reproduce the static comparison. Requires numpy, scipy, Pillow.
Run in this directory: python build-comparison.py
Source: scikit-image camera.png, CC0 by Lav Varshney.
"""
from pathlib import Path
import hashlib, json
import numpy as np
import scipy, PIL
from PIL import Image
from scipy.linalg import svd

ROOT = Path(__file__).resolve().parent
SIZE = 256
CHIS = [32, 24, 20, 16, 12, 10, 8, 6, 4]
SOURCE = ROOT / 'camera-source.png'

def tensorize(a):
    q = int(np.log2(a.shape[0]))
    assert a.shape == (2**q, 2**q)
    permutation = [j for k in range(q) for j in (k, q+k)]
    return a.reshape([2]*(2*q)).transpose(permutation), permutation

def tt_svd(a, chi):
    t, permutation = tensorize(a)
    n = t.ndim
    remaining, left, cores = t, 1, []
    for k in range(n-1):
        u, s, vh = svd(remaining.reshape(left*2, -1), full_matrices=False, check_finite=False)
        r = min(chi, len(s))
        cores.append(u[:, :r].reshape(left, 2, r))
        remaining, left = s[:r, None]*vh[:r], r
    cores.append(remaining.reshape(left, 2, 1))
    reconstructed = cores[0]
    for core in cores[1:]:
        reconstructed = np.tensordot(reconstructed, core, axes=(-1, 0))
    reconstructed = reconstructed.reshape([2]*n).transpose(np.argsort(permutation)).reshape(a.shape)
    bonds = [1] + [c.shape[2] for c in cores]
    stored = sum(c.size for c in cores)
    assert stored == sum(2*l*r for l,r in zip(bonds[:-1], bonds[1:]))
    assert bonds == [1]+[min(chi, 2**k, 2**(n-k)) for k in range(1,n)]+[1]
    return reconstructed, stored, bonds

def metric(reference, reconstructed, stored):
    dot = np.vdot(reference, reconstructed).real
    norm2 = np.vdot(reference, reference).real
    den = norm2*np.vdot(reconstructed, reconstructed).real
    return {'stored': int(stored), 'cr': reference.size/stored,
            'relativeError': float(np.linalg.norm(reference-reconstructed)/np.sqrt(norm2)),
            'infidelity': float(max(0, 1-dot*dot/den))}

def grayscale(a):
    # Identical display scale for every original/reconstruction, with no rescaling.
    return Image.fromarray(np.round(np.clip(a, 0, 1)*255).astype('uint8'), 'L').convert('RGB')

def error_rgb(a, maximum):
    stops = np.array([[244,240,248],[170,133,186],[95,46,111],[209,96,67],[252,220,102]])
    x=np.clip(a/maximum,0,1)*4
    lo=np.minimum(x.astype(int),3); frac=x-lo
    rgb=stops[lo]*(1-frac[...,None])+stops[lo+1]*frac[...,None]
    return Image.fromarray(np.round(rgb).astype('uint8'),'RGB')

def main():
    a = np.asarray(Image.open(SOURCE).convert('L').resize((SIZE,SIZE),Image.Resampling.LANCZOS),dtype=np.float64)/255
    u,s,vh=svd(a,full_matrices=False,check_finite=False)
    frames, arrays=[],[]
    for chi in CHIS:
        m,stored,bonds=tt_svd(a,chi)
        # Absorb singular values into the right factor: r*(m+n) scalars, no extra Sigma.
        r=int(np.ceil(stored/(2*SIZE)))
        z=(u[:,:r]*s[:r])@vh[:r]
        sm=metric(a,z,r*2*SIZE); tm=metric(a,m,stored)
        assert sm['stored'] >= tm['stored']
        assert abs(sm['relativeError']-np.linalg.norm(s[r:])/np.linalg.norm(a))<1e-12
        frames.append({'chi':chi,'rank':r,'bonds':bonds,'svd':sm,'mps':tm})
        arrays.append((z,m))
    # Nontruncated TT-SVD must reproduce the image, independently of the selected budgets.
    exact,_,_=tt_svd(a,SIZE)
    assert np.linalg.norm(a-exact)/np.linalg.norm(a)<1e-12
    max_error=float(max(np.abs(x-a).max() for pair in arrays for x in pair))
    atlas=Image.new('RGB',(2*SIZE,(1+2*len(frames))*SIZE),(244,240,248))
    atlas.paste(grayscale(a),(0,0))
    for i,(z,m) in enumerate(arrays):
        for col,x in enumerate((z,m)):
            atlas.paste(grayscale(x),(col*SIZE,(1+i)*SIZE))
            atlas.paste(error_rgb(np.abs(x-a),max_error),(col*SIZE,(1+len(frames)+i)*SIZE))
    atlas.save(ROOT/'compression-atlas.png',optimize=True)
    result={'versions':{'numpy':np.__version__,'scipy':scipy.__version__,'Pillow':PIL.__version__},'size':SIZE,'sites':16,'precision':'float64','defaultIndex':CHIS.index(8),
            'errorMaximum':max_error,'sourceSha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
            'frames':frames}
    (ROOT/'compression-data.js').write_text('window.COMPRESSION_DATA = '+json.dumps(result,separators=(',',':'))+';\n')
    for f in frames:
        print(f"chi={f['chi']:2}, MPS CR={f['mps']['cr']:.2f}, SVD CR={f['svd']['cr']:.2f}, errors={f['mps']['relativeError']:.5f}/{f['svd']['relativeError']:.5f}")
    print('PASS: exact TT reconstruction, bond storage identity, predicted ranks, SVD tail errors, and conservative SVD budgets.')

if __name__=='__main__':main()
