import sys, math; sys.path.insert(0, '/home/claude/render')
from lib import *

def build(variant='hero'):
    sc = reset(); world((0.82, 0.84, 0.88), 0.45)
    P = palette()
    # room shell
    boxmm('floor', -3.2, -4, -0.05, 4.5, 4.2, -0.02, P['matte_dark'], 0)
    floor_planks(-3.0, 4.0, -2.6, 4.0, along='Y')
    boxmm('ceil', -3.2, -1, 3.0, 4.5, 4.2, 3.1, P['wall'], 0)
    boxmm('back', -3.2, 4.0, 0, 4.5, 4.2, 3.0, P['wall'], 0)
    # left wall with tall window y 0.2..3.7, z 0.12..2.75
    boxmm('lw1', -3.2, -4, 0, -3.0, 0.2, 3.0, P['wall'], 0)
    boxmm('lw2', -3.2, 3.7, 0, -3.0, 4.2, 3.0, P['wall'], 0)
    boxmm('lw3', -3.2, 0.2, 0, -3.0, 3.7, 0.12, P['wall'], 0)
    boxmm('lw4', -3.2, 0.2, 2.75, -3.0, 3.7, 3.0, P['wall'], 0)
    for i, y in enumerate([0.2, 1.37, 2.53, 3.66]):
        boxmm(f'mul{i}', -3.06, y, 0.12, -3.02, y + 0.04, 2.75, P['black_metal'], 0.002)
    boxmm('tran', -3.06, 0.2, 2.2, -3.02, 3.7, 2.235, P['black_metal'], 0.002)
    # tall walnut column
    boxmm('tallcarc', 1.62, 3.42, 0, 3.4, 4.0, 2.62, P['walnut'], 0.002)
    fronts_x('tall', 1.64, 3.38, 3.42, 0.02, 2.6, 3, P['walnut'])
    # base run
    boxmm('plinth', -1.6, 3.5, 0, 1.6, 4.0, 0.1, P['matte_dark'], 0)
    boxmm('basecarc', -1.6, 3.42, 0.1, 1.6, 4.0, 0.88, P['walnut'], 0.0)
    for r, (z0, z1) in enumerate([(0.1, 0.48), (0.485, 0.86)]):
        fronts_x(f'dr{r}_', -1.58, 1.58, 3.42, z0, z1, 4, P['walnut'])
    boxmm('ctop', -1.62, 3.36, 0.88, 1.62, 4.0, 0.92, P['limestone'], 0.003)
    boxmm('splash', -1.62, 3.97, 0.92, 1.62, 4.0, 1.55, P['limestone'], 0.0)
    # floating shelf + led
    boxmm('shelf', -1.5, 3.72, 1.86, 1.5, 4.0, 1.91, P['walnut_h'], 0.002)
    boxmm('ledstrip', -1.45, 3.9, 1.855, 1.45, 3.98, 1.86, P['led'], 0)
    boxmm('ledstrip2', -1.6, 3.5, 0.865, 1.6, 3.52, 0.87, P['led'], 0)
    # shelf objects
    cyl('vase1', (-1.0, 3.86, 2.06), 0.06, 0.3, P['matte_ivory'])
    cyl('vase2', (-0.82, 3.86, 2.0), 0.05, 0.18, P['matte_taupe'])
    for i in range(4):
        cyl(f'plate{i}', (0.8, 3.86, 1.92 + i * 0.012), 0.12, 0.01, P['matte_ivory'])
    cyl('bowlc', (1.1, 3.86, 1.97), 0.07, 0.12, P['matte_dark'])
    # cooktop (flush black)
    boxmm('cooktop', -0.4, 3.5, 0.92, 0.35, 3.9, 0.926, P['black_metal'], 0.001)
    # tap
    cyl('tapstem', (-1.1, 3.88, 1.1), 0.012, 0.36, P['bronze'])
    cyl('tapspout', (-1.1, 3.76, 1.27), 0.011, 0.24, P['bronze'], rot=(math.radians(90), 0, 0))
    # island
    ix0, ix1, iy0, iy1 = -0.9, 1.9, 1.35, 2.35
    boxmm('itop', ix0, iy0, 0.88, ix1, iy1, 0.94, P['limestone'], 0.003)
    boxmm('iend1', ix0, iy0, 0, ix0 + 0.06, iy1, 0.88, P['limestone'], 0.002)
    boxmm('iend2', ix1 - 0.06, iy0, 0, ix1, iy1, 0.88, P['limestone'], 0.002)
    boxmm('ibase', ix0 + 0.06, iy0 + 0.25, 0.08, ix1 - 0.06, iy1 - 0.05, 0.88, P['walnut'], 0)
    fronts_y('ifr', ix0 + 0.08, ix1 - 0.08, 0, 0, 0, 0, P['walnut']) if False else None
    fronts_x('ifr', ix0 + 0.08, ix1 - 0.08, iy1 - 0.03, 0.1, 0.86, 3, P['walnut'])
    # back face of island (camera side) walnut panels
    boxmm('ifront', ix0 + 0.06, iy0 + 0.22, 0.08, ix1 - 0.06, iy0 + 0.25, 0.88, P['walnut'], 0.001)
    # island objects
    cyl('bowl', (0.9, 1.75, 0.98), 0.17, 0.08, P['matte_ivory'], verts=64)
    boxmm('board', -0.45, 1.55, 0.94, 0.05, 1.85, 0.965, P['oak'], 0.004)
    # stools
    for i, x in enumerate([-0.25, 0.55, 1.35]):
        cyl(f'seat{i}', (x, 1.05, 0.66), 0.19, 0.04, P['oak'])
        for a in range(4):
            ang = a * math.pi / 2 + math.pi / 4
            cyl(f'leg{i}{a}', (x + 0.13 * math.cos(ang), 1.05 + 0.13 * math.sin(ang), 0.32), 0.012, 0.64, P['black_metal'], verts=12)
        boxmm(f'ring{i}', x - 0.12, 0.93, 0.22, x + 0.12, 1.17, 0.23, P['black_metal'], 0.002)
    # pendants
    for i, x in enumerate([-0.2, 0.5, 1.2]):
        cyl(f'cord{i}', (x, 1.85, 2.45), 0.003, 1.1, P['black_metal'], verts=8)
        cyl(f'shade{i}', (x, 1.85, 1.86), 0.09, 0.18, P['matte_dark'])
        cyl(f'diff{i}', (x, 1.85, 1.765), 0.08, 0.004, emissive(f'pe{i}', strength=40))
        point((x, 1.85, 1.72), 25, radius=0.04)
    backdrop((-9, 2, 1.5), (0.1, 30, 12), strength=2.2)
    # lighting
    sun((58, 0, -70), 12, color=(1, 0.84, 0.66), angle=1.0)
    area((2.0, -3.5, 2.2), (75, 0, 20), 3.0, 60, size_y=2.0)
    area((0.5, 1.8, 2.95), (0, 0, 0), 2.0, 60, size_y=1.2)
    return sc

if __name__ == '__main__':
    import sys
    argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
    mode = argv[0] if argv else 'test'
    build()
    if mode == 'test':
        camera((2.7, -1.7, 1.2), (0.2, 3.6, 1.2), lens=24, shift=(0, -0.04))
        render('/home/claude/render/out/kitchen_test.png', 800, 500, samples=24)
    elif mode == 'hero':
        camera((2.7, -1.7, 1.2), (0.2, 3.6, 1.2), lens=24, shift=(0, -0.04))
        render('/home/claude/render/out/kitchen_hero.png', 1920, 1120, samples=56)
    elif mode == 'detail':
        camera((0.9, 1.15, 1.42), (-0.5, 3.95, 1.25), lens=34, dof=(3.0, 6.0))
        render('/home/claude/render/out/kitchen_detail.png', 1200, 1500, samples=56)
