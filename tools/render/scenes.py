import sys, math, random; sys.path.insert(0, '/home/claude/render')
from lib import *
OUT = '/home/claude/render/out/'

def sofa_block(name, x0, y0, x1, y1, mat, seat_h=0.42, back=None):
    o = boxmm(name + 'b', x0, y0, 0.06, x1, y1, seat_h - 0.12, mat, 0.03)
    o.modifiers['bev'].segments = 5
    c = boxmm(name + 'c', x0 + 0.01, y0 + 0.01, seat_h - 0.13, x1 - 0.01, y1 - 0.01, seat_h, mat, 0.06)
    c.modifiers['bev'].segments = 6
    if back:
        bx0, by0, bx1, by1 = back
        b = boxmm(name + 'k', bx0, by0, 0.06, bx1, by1, seat_h + 0.32, mat, 0.07)
        b.modifiers['bev'].segments = 6

def books(x0, x1, y, z, depth=0.2, seed=1):
    rnd = random.Random(seed)
    cols = [(0.55, 0.5, 0.42), (0.3, 0.26, 0.22), (0.72, 0.68, 0.6), (0.42, 0.33, 0.25), (0.18, 0.17, 0.16)]
    mats = [solid(f'bk{seed}{i}', c, 0.7) for i, c in enumerate(cols)]
    x = x0
    while x < x1:
        t = rnd.uniform(0.02, 0.045); h = rnd.uniform(0.2, 0.28)
        if rnd.random() < 0.12:
            x += rnd.uniform(0.08, 0.2); continue
        boxmm('book', x, y - depth, z, x + t, y, z + h, rnd.choice(mats), 0.002)
        x += t + 0.002

# ------------------------------------------------------------------ LIVING
def living():
    reset(); world((0.84, 0.85, 0.88), 0.4)
    P = palette()
    boxmm('base', -4, -5, -0.05, 4, 4.2, -0.02, P['matte_dark'], 0)
    floor_planks(-3.6, 3.6, -3.5, 4.0, along='Y', seed=3)
    boxmm('back', -4, 4.0, 0, 4, 4.2, 3.0, P['wall'], 0)
    boxmm('ceil', -4, -2, 2.9, 4, 4.2, 3.0, P['wall'], 0)
    boxmm('lw', -3.8, -5, 0, -3.6, 4.2, 3.0, P['wall'], 0)
    # right wall with window y -1..3.4
    boxmm('rw1', 3.6, -5, 0, 3.8, -1.0, 3.0, P['wall'], 0)
    boxmm('rw2', 3.6, 3.4, 0, 3.8, 4.2, 3.0, P['wall'], 0)
    boxmm('rw3', 3.6, -1.0, 0, 3.8, 3.4, 0.1, P['wall'], 0)
    boxmm('rw4', 3.6, -1.0, 2.7, 3.8, 3.4, 3.0, P['wall'], 0)
    backdrop((10, 1, 1.5), (0.1, 30, 12), strength=2.4)
    # media wall: walnut slatted cladding x -1.9..1.9
    rnd = random.Random(2)
    for i in range(38):
        x = -1.9 + i * 0.1
        boxmm(f'slat{i}', x, 3.94, 0, x + 0.085, 4.0, 2.9, P['walnut'], 0.004)
    boxmm('slatback', -1.9, 3.99, 0, 1.9, 4.0, 2.9, P['matte_dark'], 0)
    # tv
    boxmm('tv', -0.75, 3.9, 1.05, 0.75, 3.93, 1.9, solid('screen', (0.006, 0.006, 0.007), 0.25), 0.003)
    # floating low cabinet
    boxmm('lowcab', -1.6, 3.48, 0.28, 1.6, 3.94, 0.62, P['walnut_h'], 0.002)
    fronts_x('lc', -1.58, 1.58, 3.48, 0.3, 0.6, 4, P['walnut_h'])
    boxmm('lctop', -1.62, 3.46, 0.62, 1.62, 3.94, 0.65, P['limestone'], 0.002)
    boxmm('lcled', -1.55, 3.6, 0.275, 1.55, 3.9, 0.28, P['led'], 0)
    # side shelving niches in ivory matte
    for side in (-1, 1):
        xa, xb = (-3.6, -1.95) if side < 0 else (1.95, 3.6)
        boxmm('nichebk', xa, 3.6, 0, xb, 4.0, 2.9, P['matte_ivory'], 0)
        for j, z in enumerate([0.0, 0.62, 1.3, 1.95, 2.55]):
            boxmm(f'sh{side}{j}', xa + 0.02, 3.62, z, xb - 0.02, 4.0, z + 0.03, P['walnut_h'], 0.002)
        boxmm('led', xa + 0.05, 3.66, 2.55 - 0.003, xb - 0.05, 3.7, 2.55, P['led'], 0)
        books(xa + 0.15, xa + 0.9, 3.98, 1.33, seed=5 + side)
        cyl('vs', (xb - 0.35, 3.85, 0.79), 0.09, 0.32, P['matte_taupe'])
        cyl('vs2', (xa + 0.5, 3.82, 2.07), 0.12, 0.09, P['matte_ivory'])
        boxmm('drw', xa + 0.02, 3.58, 0.0, xb - 0.02, 3.62, 0.6, P['matte_ivory'], 0.002)
    # rug
    boxmm('rug', -2.2, 0.3, 0, 2.2, 3.2, 0.012, fabric('rugm', (0.3, 0.26, 0.21)), 0.004)
    # sofa (back to camera, slight angle)
    sofa_block('sofaL', -2.6, 0.15, -1.7, 2.3, P['boucle'], back=(-2.6, 0.15, -2.35, 2.3))
    # cushions
    for i, y in enumerate([0.6, 1.6]):
        c = boxmm(f'cush{i}', -2.35, y, 0.42, -2.2, y + 0.5, 0.82, P['linen'], 0.05); c.modifiers['bev'].segments = 6
    # coffee tables
    cyl('ct1', (0.1, 2.2, 0.18), 0.48, 0.36, P['limestone'], verts=96)
    cyl('ct2', (0.85, 2.55, 0.13), 0.3, 0.26, P['walnut_h'], verts=96)
    cyl('ctbowl', (0.0, 2.15, 0.39), 0.14, 0.06, P['matte_dark'])
    boxmm('ctbook', 0.2, 2.0, 0.36, 0.48, 2.35, 0.39, solid('bkc', (0.6, 0.55, 0.47), 0.7), 0.002)
    # floor lamp
    cyl('fl_base', (2.6, 3.0, 0.01), 0.16, 0.02, P['black_metal'])
    cyl('fl_pole', (2.6, 3.0, 0.8), 0.01, 1.6, P['black_metal'], verts=12)
    cyl('fl_shade', (2.6, 3.0, 1.62), 0.22, 0.3, emissive('shade', (1, 0.82, 0.6), 1.6))
    point((2.6, 3.0, 1.6), 30)
    # light
    sun((60, 0, 105), 10, color=(1, 0.83, 0.64), angle=1.0)
    area((0, -3.5, 2.0), (80, 0, 0), 3.5, 80, size_y=1.5)

def living_shots(mode):
    living()
    if mode == 'test':
        camera((2.6, -1.4, 1.4), (-0.6, 4.0, 1.4), lens=24, shift=(0, -0.12))
        render(OUT + 'living_test.png', 800, 450, samples=24)
    else:
        camera((2.6, -1.4, 1.4), (-0.6, 4.0, 1.4), lens=24, shift=(0, -0.12))
        render(OUT + 'living_wide.png', 2000, 1000, samples=48)
        camera((2.2, 1.5, 1.0), (-0.2, 3.95, 0.7), lens=40, dof=(2.9, 3.5))
        render(OUT + 'living_media.png', 1300, 1600, samples=48)

# ------------------------------------------------------------------ WARDROBE
def wardrobe():
    reset(); world((0.84, 0.85, 0.88), 0.4)
    P = palette()
    boxmm('base', -4, -5, -0.05, 4, 4.2, -0.02, P['matte_dark'], 0)
    floor_planks(-3.2, 3.2, -3, 4.0, along='Y', seed=11)
    boxmm('back', -4, 4.0, 0, 4, 4.2, 2.9, P['wall'], 0)
    boxmm('ceil', -4, -2, 2.85, 4, 4.2, 2.95, P['wall'], 0)
    boxmm('rw', 3.2, -5, 0, 3.4, 4.2, 2.9, P['wall'], 0)
    # left wall window
    boxmm('lw1', -3.4, -5, 0, -3.2, -0.5, 2.9, P['wall'], 0)
    boxmm('lw2', -3.4, 2.6, 0, -3.2, 4.2, 2.9, P['wall'], 0)
    boxmm('lw3', -3.4, -0.5, 2.55, -3.2, 2.6, 2.9, P['wall'], 0)
    boxmm('lw4', -3.4, -0.5, 0, -3.2, 2.6, 0.4, P['wall'], 0)
    backdrop((-10, 1, 1.5), (0.1, 30, 12), strength=2.4)
    # sheer curtain
    m = solid('sheer', (0.9, 0.86, 0.8), 0.9)
    m.node_tree.nodes['Principled BSDF'].inputs['Transmission Weight'].default_value = 0.7
    for i in range(14):
        boxmm(f'cur{i}', -3.12 + 0.02 * (i % 2), -0.45 + i * 0.22, 0.02, -3.1 + 0.02 * (i % 2), -0.45 + i * 0.22 + 0.2, 2.8, m, 0.01)
    # wardrobe wall x -3.15..3.15, depth 0.62, floor-to-ceiling
    X0, X1 = -2.6, 3.15
    n = 6; gap = 0.004; w = (X1 - X0 - 1.3 - gap * (n - 1)) / n
    x = X0
    for i in range(n + 1):
        if i == 2:  # open niche with walnut interior
            nx0, nx1 = x, x + 1.3
            boxmm('nback', nx0, 3.8, 0.0, nx1, 3.99, 2.85, P['walnut'], 0)
            boxmm('nside1', nx0, 3.38, 0, nx0 + 0.02, 4.0, 2.85, P['walnut'], 0.001)
            boxmm('nside2', nx1 - 0.02, 3.38, 0, nx1, 4.0, 2.85, P['walnut'], 0.001)
            boxmm('ntop', nx0, 3.38, 2.83, nx1, 4.0, 2.85, P['walnut_h'], 0)
            for j, z in enumerate([0.0, 0.42, 2.2]):
                boxmm(f'nsh{j}', nx0, 3.4, z, nx1, 3.99, z + 0.025, P['walnut_h'], 0.002)
            boxmm('nled', nx0 + 0.05, 3.45, 2.195, nx1 - 0.05, 3.5, 2.2, P['led'], 0)
            cyl('rail', ((nx0 + nx1) / 2, 3.7, 2.05), 0.012, 1.25, P['bronze'], rot=(0, math.radians(90), 0))
            rnd = random.Random(4)
            gm = [fabric('g1', (0.35, 0.3, 0.24)), fabric('g2', (0.08, 0.07, 0.065)), fabric('g3', (0.5, 0.46, 0.4)), fabric('g4', (0.2, 0.15, 0.11))]
            gx = nx0 + 0.12
            while gx < nx1 - 0.15:
                L = rnd.uniform(0.75, 1.15)
                g = boxmm('gar', gx, 3.5, 2.03 - L, gx + 0.05, 3.9, 2.03, rnd.choice(gm), 0.02)
                gx += rnd.uniform(0.05, 0.09)
            for k in range(3):
                boxmm(f'box{k}', nx0 + 0.1 + k * 0.38, 3.5, 2.225, nx0 + 0.42 + k * 0.38, 3.9, 2.45, P['linen'], 0.01)
            cyl('shoe', (nx0 + 0.4, 3.7, 0.47), 0.05, 0.1, P['matte_dark'])
            x = nx1 + gap
            continue
        boxmm(f'wd{i}', x, 3.36, 0.0, x + w, 3.38, 2.85, P['oak'], 0.0015)
        # recessed vertical grip
        side = x + w - 0.012 if i % 2 == 0 else x
        boxmm(f'grip{i}', side, 3.358, 0.9, side + 0.012, 3.37, 1.4, P['bronze'], 0.001)
        x += w + gap
    # bench + throw
    boxmm('bench', -1.0, 1.6, 0.38, 0.6, 2.0, 0.44, P['walnut_h'], 0.004)
    for lx in (-0.95, 0.5):
        boxmm('bl', lx, 1.62, 0, lx + 0.05, 1.98, 0.38, P['walnut'], 0.003)
    t = boxmm('throw', -0.6, 1.58, 0.44, -0.1, 2.02, 0.47, P['linen'], 0.01)
    sun((62, 0, -60), 9, color=(1, 0.85, 0.68), angle=1.5)
    area((0, -3, 2.2), (78, 0, 0), 4, 90, size_y=1.5)

def wardrobe_shots(mode):
    wardrobe()
    if mode == 'test':
        camera((1.9, -0.6, 1.25), (-0.2, 4.0, 1.25), lens=26, shift=(0, -0.1))
        render(OUT + 'wardrobe_test.png', 640, 800, samples=24)
    else:
        camera((1.9, -0.6, 1.25), (-0.2, 4.0, 1.25), lens=26, shift=(0, -0.1))
        render(OUT + 'wardrobe.png', 1300, 1625, samples=48)
        camera((0.55, 1.55, 1.38), (-0.5, 3.9, 1.38), lens=30, dof=(2.5, 6.0))
        render(OUT + 'wardrobe_niche.png', 1400, 1000, samples=48)

# ------------------------------------------------------------------ BEDROOM
def bedroom():
    reset(); world((0.84, 0.85, 0.88), 0.4)
    P = palette()
    boxmm('base', -4, -5, -0.05, 4, 4.2, -0.02, P['matte_dark'], 0)
    floor_planks(-3.2, 3.2, -3, 4.0, along='X', seed=21)
    boxmm('back', -4, 4.0, 0, 4, 4.2, 2.9, P['wall'], 0)
    boxmm('ceil', -4, -2, 2.85, 4, 4.2, 2.95, P['wall'], 0)
    boxmm('lw', -3.4, -5, 0, -3.2, 4.2, 2.9, P['wall'], 0)
    boxmm('rw1', 3.2, -5, 0, 3.4, 0.2, 2.9, P['wall'], 0)
    boxmm('rw2', 3.2, 3.2, 0, 3.4, 4.2, 2.9, P['wall'], 0)
    boxmm('rw3', 3.2, 0.2, 2.6, 3.4, 3.2, 2.9, P['wall'], 0)
    boxmm('rw4', 3.2, 0.2, 0, 3.4, 3.2, 0.1, P['wall'], 0)
    backdrop((10, 1, 1.5), (0.1, 30, 12), strength=2.4)
    # walnut panel wall behind bed
    for i in range(6):
        x = -2.4 + i * 0.8
        boxmm(f'pan{i}', x, 3.96, 0, x + 0.797, 4.0, 2.85, P['walnut'], 0.002)
    # upholstered headboard
    hb = boxmm('hb', -1.0, 3.82, 0.3, 1.0, 3.96, 1.25, P['boucle'], 0.05); hb.modifiers['bev'].segments = 6
    # bed
    boxmm('frame', -0.95, 1.7, 0.08, 0.95, 3.85, 0.35, P['walnut_h'], 0.01)
    mt = boxmm('mat', -0.92, 1.73, 0.35, 0.92, 3.82, 0.55, solid('sheet', (0.6, 0.56, 0.5), 0.9), 0.05); mt.modifiers['bev'].segments = 6
    dv = boxmm('duvet', -0.97, 1.65, 0.45, 0.97, 3.2, 0.62, P['linen'], 0.07); dv.modifiers['bev'].segments = 8
    for i, x in enumerate([-0.85, 0.05]):
        p = boxmm(f'pil{i}', x, 3.35, 0.55, x + 0.8, 3.75, 0.8, solid('pill', (0.64, 0.6, 0.54), 0.95), 0.08); p.modifiers['bev'].segments = 8
    pc = boxmm('pilc', -0.5, 3.2, 0.55, 0.5, 3.4, 0.82, fabric('pc', (0.45, 0.37, 0.28)), 0.07); pc.modifiers['bev'].segments = 8
    # floating nightstands
    for s in (-1, 1):
        x0 = -1.65 if s < 0 else 1.15
        boxmm(f'ns{s}', x0, 3.5, 0.32, x0 + 0.5, 3.96, 0.52, P['walnut_h'], 0.003)
        boxmm(f'nsf{s}', x0 + 0.01, 3.48, 0.34, x0 + 0.49, 3.5, 0.5, P['walnut_h'], 0.0015)
        cyl(f'pend{s}', (x0 + 0.25, 3.7, 1.0), 0.07, 0.24, emissive(f'pg{s}', (1, 0.8, 0.58), 6))
        cyl(f'cord{s}', (x0 + 0.25, 3.7, 1.95), 0.003, 1.7, P['black_metal'], verts=8)
        point((x0 + 0.25, 3.7, 0.95), 18)
    cyl('book_ns', (-1.3, 3.75, 0.54), 0.06, 0.04, P['matte_ivory'])
    boxmm('bk', 1.25, 3.6, 0.52, 1.5, 3.85, 0.56, solid('bkn', (0.5, 0.45, 0.38), 0.7), 0.002)
    # bench at foot
    boxmm('bench', -0.8, 1.15, 0.36, 0.8, 1.5, 0.45, P['boucle'], 0.03)
    for lx in (-0.75, 0.7):
        boxmm('bl', lx, 1.18, 0, lx + 0.04, 1.47, 0.36, P['black_metal'], 0.002)
    boxmm('rug', -1.8, 0.7, 0, 1.8, 3.6, 0.01, fabric('rug2', (0.32, 0.28, 0.23)), 0.004)
    sun((64, 0, 112), 8, color=(1, 0.84, 0.66), angle=1.5)
    area((0, -3, 2.2), (78, 0, 0), 4, 90, size_y=1.5)

def bedroom_shots(mode):
    bedroom()
    if mode == 'test':
        camera((1.7, -1.8, 1.25), (-0.2, 4.0, 1.0), lens=26, shift=(0, -0.02))
        render(OUT + 'bedroom_test.png', 800, 520, samples=24)
    else:
        camera((1.7, -1.8, 1.25), (-0.2, 4.0, 1.0), lens=26, shift=(0, -0.02))
        render(OUT + 'bedroom.png', 1800, 1170, samples=48)

# ------------------------------------------------------------------ HALLWAY
def hallway():
    reset(); world((0.84, 0.85, 0.88), 0.35)
    P = palette()
    tile = stone('tile', (0.42, 0.37, 0.3), (0.3, 0.26, 0.21), vein_amt=0.15, rough=0.4, scale=2)
    for i in range(6):
        for j in range(10):
            boxmm('t', -1.2 + i * 0.6, -1 + j * 0.6, -0.02, -1.2 + i * 0.6 + 0.597, -1 + j * 0.6 + 0.597, 0, tile, 0.002)
    boxmm('ceil', -2, -2, 2.7, 2, 6, 2.8, P['wall'], 0)
    boxmm('lw', -1.3, -2, 0, -1.2, 6, 2.7, P['wall_warm'], 0)
    boxmm('end1', -2, 5.0, 0, -0.4, 5.1, 2.7, P['wall'], 0)
    boxmm('end2', 0.4, 5.0, 0, 2, 5.1, 2.7, P['wall'], 0)
    boxmm('end3', -0.4, 5.0, 0, 0.4, 5.1, 0.6, P['wall'], 0)
    boxmm('end4', -0.4, 5.0, 2.4, 0.4, 5.1, 2.7, P['wall'], 0)
    # end: tall slot window
    # right wall: integrated storage x 0.9..1.3
    boxmm('rwall', 1.4, -2, 0, 1.5, 5.0, 2.7, P['wall_warm'], 0)
    y = -1.0; i = 0
    while y < 4.9:
        if 1.0 <= y < 2.6 and i >= 0:
            # bench niche
            boxmm('nb', 1.1, y, 0, 1.4, y + 1.6, 2.7, P['walnut'], 0)
            boxmm('nbench', 0.73, y, 0.42, 1.38, y + 1.6, 0.47, P['walnut_h'], 0.003)
            boxmm('nbase', 0.75, y, 0.0, 1.38, y + 1.6, 0.42, P['matte_ivory'], 0.002)
            boxmm('nshelf', 0.95, y, 1.95, 1.38, y + 1.6, 1.98, P['walnut_h'], 0.002)
            boxmm('nled', 1.0, y + 0.05, 1.945, 1.05, y + 1.55, 1.95, P['led'], 0)
            area((1.05, y + 0.8, 1.93), (0, 0, 0), 0.1, 40, size_y=1.4)
            for k in range(4):
                cyl(f'hook{k}', (1.09, y + 0.3 + k * 0.33, 1.65), 0.012, 0.08, P['bronze'], rot=(0, math.radians(90), 0))
            boxmm('coat', 1.0, y + 0.25, 0.95, 1.08, y + 0.6, 1.65, fabric('coat', (0.36, 0.3, 0.24)), 0.02)
            boxmm('cush', 0.85, y + 0.9, 0.47, 1.3, y + 1.45, 0.55, P['linen'], 0.03)
            y += 1.6 + 0.004; i += 1; continue
        boxmm(f'hd{i}', 0.73, y, 0.0, 0.75, y + 0.596, 2.7, P['matte_ivory'], 0.0015)
        boxmm(f'hg{i}', 0.725, y + 0.585, 1.0, 0.735, y + 0.596, 1.5, P['walnut'], 0.001)
        y += 0.6; i += 1
    # left: oak console + art
    boxmm('cons', -1.2, 2.6, 0.8, -0.85, 4.2, 0.84, P['walnut_h'], 0.003)
    cyl('vase', (-1.03, 3.2, 1.05), 0.08, 0.42, P['matte_taupe'])
    boxmm('art', -1.2, 2.9, 1.25, -1.17, 3.9, 2.0, solid('art', (0.6, 0.53, 0.44), 0.9), 0.002)
    boxmm('artf', -1.21, 2.88, 1.23, -1.19, 3.92, 2.02, P['walnut'], 0.002)
    # end window
    backdrop((0, 7, 1.5), (6, 0.1, 6), strength=3)
    sun((55, 0, 180), 7, color=(1, 0.85, 0.68), angle=2)
    area((0, 4.9, 1.5), (90, 0, 0), 0.8, 120, size_y=1.8)
    area((0, -1.8, 2.0), (80, 0, 0), 1.5, 50)
    

def hallway_shots(mode):
    hallway()
    # end-wall cutout: remove part of end wall for window
    if mode == 'test':
        camera((-0.5, -1.6, 1.3), (0.1, 5.0, 1.3), lens=24, shift=(0, -0.08))
        render(OUT + 'hall_test.png', 600, 800, samples=24)
    else:
        camera((-0.5, -1.6, 1.3), (0.1, 5.0, 1.3), lens=24, shift=(0, -0.08))
        render(OUT + 'hall.png', 1300, 1700, samples=48)

# ------------------------------------------------------------------ OFFICE
def office():
    reset(); world((0.84, 0.85, 0.88), 0.4)
    P = palette()
    boxmm('base', -4, -5, -0.05, 4, 4.2, -0.02, P['matte_dark'], 0)
    floor_planks(-3.2, 3.2, -3, 4.0, along='Y', seed=31)
    boxmm('back', -4, 4.0, 0, 4, 4.2, 2.9, P['wall'], 0)
    boxmm('ceil', -4, -2, 2.85, 4, 4.2, 2.95, P['wall'], 0)
    boxmm('rw', 3.2, -5, 0, 3.4, 4.2, 2.9, P['wall'], 0)
    boxmm('lw1', -3.4, -5, 0, -3.2, 0.5, 2.9, P['wall'], 0)
    boxmm('lw2', -3.4, 3.6, 0, -3.2, 4.2, 2.9, P['wall'], 0)
    boxmm('lw3', -3.4, 0.5, 2.6, -3.2, 3.6, 2.9, P['wall'], 0)
    boxmm('lw4', -3.4, 0.5, 0, -3.2, 3.6, 0.5, P['wall'], 0)
    backdrop((-10, 1, 1.5), (0.1, 30, 12), strength=2.4)
    # shelving grid walnut x -2.4..2.4
    X0, X1 = -2.4, 2.4
    boxmm('sback', X0, 3.97, 0, X1, 4.0, 2.85, P['matte_taupe'], 0)
    cols = 6; cw = (X1 - X0) / cols
    for c in range(cols + 1):
        x = X0 + c * cw
        boxmm(f'v{c}', x - 0.012, 3.6, 0, x + 0.012, 4.0, 2.85, P['walnut'], 0.002)
    for j, z in enumerate([0.0, 0.72, 1.32, 1.9, 2.45, 2.83]):
        boxmm(f'h{j}', X0, 3.6, z, X1, 4.0, z + 0.025, P['walnut_h'], 0.002)
    boxmm('lowfr', X0, 3.58, 0.02, X1, 3.6, 0.7, P['walnut'], 0)
    for c in range(cols):
        boxmm(f'lf{c}', X0 + c * cw + 0.014, 3.578, 0.02, X0 + (c + 1) * cw - 0.014, 3.6, 0.7, P['walnut'], 0.0015)
    rnd = random.Random(8)
    for j, z in enumerate([1.345, 1.925, 2.475]):
        for c in range(cols):
            r = rnd.random()
            x0 = X0 + c * cw + 0.03
            if r < 0.45:
                books(x0, x0 + rnd.uniform(0.3, 0.7), 3.98, z, seed=c * 10 + j)
            elif r < 0.7:
                cyl('obj', (x0 + 0.3, 3.82, z + 0.1), rnd.uniform(0.05, 0.1), rnd.uniform(0.12, 0.3), rnd.choice([P['matte_ivory'], P['matte_dark'], P['matte_taupe']]))
    # desk cantilevered from shelving
    boxmm('desk', -1.6, 2.85, 0.73, 1.6, 3.6, 0.77, P['oak'], 0.003)
    boxmm('deskleg', 1.5, 2.88, 0, 1.56, 3.57, 0.73, P['oak'], 0.003)
    boxmm('laptop', -0.4, 3.0, 0.77, 0.0, 3.27, 0.785, solid('alu', (0.5, 0.5, 0.5), 0.3, metal=1), 0.004)
    cyl('mug', (0.35, 3.15, 0.82), 0.04, 0.1, P['matte_ivory'])
    boxmm('pad', -1.2, 3.0, 0.77, -0.75, 3.35, 0.78, solid('pad', (0.75, 0.72, 0.66), 0.8), 0.001)
    # lamp
    cyl('lb', (-1.3, 3.35, 0.78), 0.07, 0.015, P['black_metal'])
    cyl('lp', (-1.3, 3.35, 1.05), 0.006, 0.55, P['black_metal'], verts=8)
    cyl('lh', (-1.2, 3.25, 1.3), 0.06, 0.12, P['black_metal'])
    point((-1.2, 3.25, 1.2), 10)
    # chair
    boxmm('seat', -0.5, 2.1, 0.45, 0.1, 2.6, 0.5, P['oak'], 0.01)
    boxmm('cback', -0.5, 2.0, 0.55, 0.1, 2.06, 0.9, P['oak'], 0.01)
    for lx, ly in [(-0.48, 2.12), (0.06, 2.12), (-0.48, 2.56), (0.06, 2.56)]:
        boxmm('leg', lx, ly, 0, lx + 0.03, ly + 0.03, 0.45, P['black_metal'], 0.003)
    for lx in (-0.48, 0.06):
        boxmm('bkl', lx, 2.0, 0.45, lx + 0.03, 2.06, 0.9, P['black_metal'], 0.003)
    sun((60, 0, -65), 9, color=(1, 0.85, 0.68), angle=1.2)
    area((0, -3, 2.2), (78, 0, 0), 4, 90, size_y=1.5)

def office_shots(mode):
    office()
    if mode == 'test':
        camera((1.4, -0.4, 1.3), (-0.1, 4.0, 1.3), lens=26, shift=(0, -0.08))
        render(OUT + 'office_test.png', 800, 600, samples=24)
    else:
        camera((1.4, -0.4, 1.3), (-0.1, 4.0, 1.3), lens=26, shift=(0, -0.08))
        render(OUT + 'office.png', 1600, 1200, samples=48)

# ------------------------------------------------------------------ MACROS
def macros(mode):
    reset(); world((0.84, 0.85, 0.88), 0.3)
    P = palette()
    s = 1 if mode == 'test' else 0
    sz = (500, 625) if s else (1100, 1375)
    smp = 24 if s else 56
    # 1 wood grain: walnut fronts with seam, raking light
    fronts_x('wf', -0.6, 0.6, 0.0, 0, 1.2, 2, P['walnut'], gap=0.004)
    boxmm('wb', -0.7, 0.0, -0.1, 0.7, 0.3, 1.3, P['matte_dark'], 0)
    area((-1.2, -0.6, 1.0), (90, 0, -65), 0.4, 60)
    area((0.5, -1.5, 0.6), (90, 0, 10), 1.2, 20)
    camera((0.25, -0.55, 0.75), (-0.05, 0.0, 0.55), lens=55, dof=(0.6, 2.4))
    render(OUT + 'm_wood.png', *sz, samples=smp)
    # 2 stone edge on walnut drawers
    reset(); world((0.84, 0.85, 0.88), 0.3); P = palette()
    boxmm('c', -0.8, 0, 0, 0.8, 0.6, 0.88, P['walnut'], 0)
    fronts_x('d', -0.78, 0.78, 0.0, 0.4, 0.86, 2, P['walnut'])
    fronts_x('d2', -0.78, 0.78, 0.0, 0.1, 0.395, 2, P['walnut'])
    boxmm('top', -0.85, -0.04, 0.88, 0.85, 0.6, 0.94, P['limestone'], 0.004)
    boxmm('wall', -2, 0.6, 0, 2, 0.7, 2, P['limestone'], 0)
    cyl('bowl', (0.15, 0.25, 0.99), 0.13, 0.1, P['matte_ivory'], verts=64)
    cyl('cup', (0.42, 0.18, 0.98), 0.04, 0.08, P['matte_dark'])
    sun((55, 0, -55), 9, color=(1, 0.84, 0.66), angle=1.5)
    area((0, -2, 1.5), (80, 0, 0), 2, 30)
    camera((-0.55, -0.6, 1.12), (0.05, 0.15, 0.85), lens=50, dof=(0.8, 2.8))
    render(OUT + 'm_stone.png', *sz, samples=smp)
    # 3 integrated handle (gola channel) in matte taupe
    reset(); world((0.84, 0.85, 0.88), 0.3); P = palette()
    boxmm('carc', -0.9, 0, 0, 0.9, 0.6, 0.9, P['matte_taupe'], 0)
    fronts_x('u', -0.9, 0.9, 0.0, 0.48, 0.82, 2, P['matte_taupe'])
    fronts_x('l', -0.9, 0.9, 0.0, 0.08, 0.42, 2, P['matte_taupe'])
    boxmm('ch1', -0.9, 0.02, 0.42, 0.9, 0.06, 0.48, P['bronze'], 0.002)
    boxmm('ch2', -0.9, 0.02, 0.82, 0.9, 0.06, 0.88, P['bronze'], 0.002)
    boxmm('top', -0.92, -0.02, 0.88, 0.92, 0.6, 0.91, P['walnut_h'], 0.003)
    boxmm('flr', -2, -2, -0.02, 2, 2, 0, P['oak_floor'], 0)
    boxmm('wall', -2, 0.6, 0, 2, 0.7, 2, P['wall'], 0)
    area((-1.4, -0.7, 1.4), (60, 0, -55), 0.6, 70)
    area((0.6, -1.5, 0.8), (85, 0, 10), 1.5, 25)
    camera((0.55, -0.7, 0.66), (0.0, 0.0, 0.5), lens=55, dof=(0.9, 2.4))
    render(OUT + 'm_handle.png', *sz, samples=smp)
    # 4 shelf with warm LED
    reset(); world((0.84, 0.85, 0.88), 0.08); P = palette()
    boxmm('back', -1, 0.3, 0, 1, 0.35, 2, P['walnut'], 0)
    for z in (0.5, 1.1):
        boxmm('sh', -1, 0, z, 1, 0.3, z + 0.035, P['walnut_h'], 0.002)
        boxmm('led', -0.95, 0.02, z - 0.003, 0.95, 0.05, z, P['led'], 0)
    cyl('v1', (-0.3, 0.17, 0.66), 0.07, 0.27, P['matte_ivory'])
    cyl('v2', (-0.12, 0.17, 0.6), 0.05, 0.16, P['matte_taupe'])
    books(0.1, 0.55, 0.28, 0.535, seed=3)
    cyl('b1', (0.0, 0.15, 1.17), 0.12, 0.06, P['matte_dark'])
    area((0, -2, 1), (85, 0, 0), 2, 6)
    camera((0.35, -0.85, 0.85), (0.0, 0.1, 0.62), lens=50, dof=(1.0, 2.2))
    render(OUT + 'm_shelf.png', *sz, samples=smp)

if __name__ == '__main__':
    argv = sys.argv[sys.argv.index('--') + 1:]
    scene, mode = argv[0], argv[1]
    {'living': living_shots, 'wardrobe': wardrobe_shots, 'bedroom': bedroom_shots,
     'hall': hallway_shots, 'office': office_shots, 'macros': macros}[scene](mode)
