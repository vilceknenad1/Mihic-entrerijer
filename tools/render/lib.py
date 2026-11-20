"""Small scene-building kit for Enterijer Mihić imagery (Blender 5 / Cycles)."""
import bpy, math, random
from mathutils import Vector

def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = 'CYCLES'
    sc.cycles.device = 'CPU'
    sc.cycles.samples = 96
    sc.cycles.use_adaptive_sampling = True
    sc.cycles.adaptive_threshold = 0.03
    sc.cycles.use_denoising = True
    sc.cycles.max_bounces = 6
    sc.cycles.diffuse_bounces = 3
    sc.cycles.glossy_bounces = 3
    sc.cycles.transmission_bounces = 4
    sc.cycles.caustics_reflective = False
    sc.cycles.caustics_refractive = False
    sc.cycles.blur_glossy = 1.0
    sc.render.film_transparent = False
    try:
        sc.view_settings.view_transform = 'AgX'
        sc.view_settings.look = 'AgX - Medium High Contrast'
    except Exception:
        pass
    sc.render.image_settings.file_format = 'PNG'
    w = bpy.data.worlds.new('W'); sc.world = w
    w.use_nodes = True
    return sc

def world(color=(0.9, 0.86, 0.8), strength=0.8):
    w = bpy.context.scene.world
    bg = w.node_tree.nodes.get('Background')
    if bg is None:
        bg = w.node_tree.nodes.new('ShaderNodeBackground')
        out = w.node_tree.nodes.get('World Output') or w.node_tree.nodes.new('ShaderNodeOutputWorld')
        w.node_tree.links.new(bg.outputs[0], out.inputs[0])
    bg.inputs[0].default_value = (*color, 1)
    bg.inputs[1].default_value = strength

# ---------------------------------------------------------------- materials
def _mat(name):
    m = bpy.data.materials.new(name); m.use_nodes = True
    nt = m.node_tree
    p = nt.nodes.get('Principled BSDF')
    return m, nt, p

def solid(name, color, rough=0.5, metal=0.0, coat=0.0):
    m, nt, p = _mat(name)
    p.inputs['Base Color'].default_value = (*color, 1)
    p.inputs['Roughness'].default_value = rough
    p.inputs['Metallic'].default_value = metal
    if coat:
        p.inputs['Coat Weight'].default_value = coat
    return m

def emissive(name, color=(1, 0.78, 0.52), strength=20):
    m, nt, p = _mat(name)
    p.inputs['Base Color'].default_value = (*color, 1)
    p.inputs['Emission Color'].default_value = (*color, 1)
    p.inputs['Emission Strength'].default_value = strength
    return m

def wood(name, dark, light, grain='Z', scale=18.0, rough=0.42, pores=True, seed=0.0):
    """Procedural wood: stretched, distorted bands + fine pore streaks."""
    m, nt, p = _mat(name)
    N, L = nt.nodes, nt.links
    tc = N.new('ShaderNodeTexCoord')
    mp = N.new('ShaderNodeMapping')
    s = {'Z': (1, 1, 0.035), 'X': (0.035, 1, 1), 'Y': (1, 0.035, 1)}[grain]
    mp.inputs['Scale'].default_value = s
    mp.inputs['Location'].default_value = (seed, seed * 1.7, seed * 0.3)
    L.new(tc.outputs['Object'], mp.inputs['Vector'])
    wv = N.new('ShaderNodeTexWave')
    wv.wave_type = 'BANDS'; wv.bands_direction = 'DIAGONAL'
    wv.inputs['Scale'].default_value = scale
    wv.inputs['Distortion'].default_value = 9.0
    wv.inputs['Detail'].default_value = 4.0
    wv.inputs['Detail Scale'].default_value = 0.6
    wv.inputs['Detail Roughness'].default_value = 0.55
    L.new(mp.outputs['Vector'], wv.inputs['Vector'])
    # mid streaks (break regularity) + fine pores
    def stretched(sc3, nscale, detail):
        mpx = N.new('ShaderNodeMapping'); mpx.inputs['Scale'].default_value = sc3
        mpx.inputs['Location'].default_value = (seed * 2.3, seed, seed * 0.7)
        L.new(tc.outputs['Object'], mpx.inputs['Vector'])
        n = N.new('ShaderNodeTexNoise'); n.inputs['Scale'].default_value = nscale
        n.inputs['Detail'].default_value = detail; n.inputs['Roughness'].default_value = 0.6
        L.new(mpx.outputs['Vector'], n.inputs['Vector']); return n
    k = {'Z': 2, 'X': 0, 'Y': 1}[grain]
    def vec(a, b):
        v = [a, a, a]; v[k] = b; return tuple(v)
    nm = stretched(vec(1, 0.03), scale * 0.6, 10)
    nz = stretched(vec(1, 0.02), scale * 9, 3)
    m1 = N.new('ShaderNodeMix'); m1.data_type = 'FLOAT'; m1.inputs['Factor'].default_value = 0.72
    L.new(wv.outputs['Fac'], m1.inputs['A']); L.new(nm.outputs['Fac'], m1.inputs['B'])
    mix = N.new('ShaderNodeMix'); mix.data_type = 'FLOAT'
    mix.inputs['Factor'].default_value = 0.3 if pores else 0.12
    L.new(m1.outputs['Result'], mix.inputs['A'])
    L.new(nz.outputs['Fac'], mix.inputs['B'])
    cr = N.new('ShaderNodeValToRGB')
    cr.color_ramp.elements[0].position = 0.15
    cr.color_ramp.elements[0].color = (*dark, 1)
    cr.color_ramp.elements[1].position = 0.9
    cr.color_ramp.elements[1].color = (*light, 1)
    L.new(mix.outputs['Result'], cr.inputs['Fac'])
    L.new(cr.outputs['Color'], p.inputs['Base Color'])
    p.inputs['Roughness'].default_value = rough
    p.inputs['Coat Weight'].default_value = 0.08
    p.inputs['Coat Roughness'].default_value = 0.3
    bump = N.new('ShaderNodeBump'); bump.inputs['Strength'].default_value = 0.08
    bump.inputs['Distance'].default_value = 0.002
    L.new(nz.outputs['Fac'], bump.inputs['Height'])
    L.new(bump.outputs['Normal'], p.inputs['Normal'])
    return m

def stone(name, base, vein, cloud=0.15, rough=0.28, vein_amt=0.55, scale=1.5):
    """Warm limestone / soft marble with subtle veining."""
    m, nt, p = _mat(name)
    N, L = nt.nodes, nt.links
    tc = N.new('ShaderNodeTexCoord')
    nz = N.new('ShaderNodeTexNoise')
    nz.inputs['Scale'].default_value = 2.2 * scale
    nz.inputs['Detail'].default_value = 10
    nz.inputs['Roughness'].default_value = 0.62
    L.new(tc.outputs['Object'], nz.inputs['Vector'])
    wv = N.new('ShaderNodeTexWave')
    wv.wave_type = 'BANDS'; wv.bands_direction = 'DIAGONAL'
    wv.inputs['Scale'].default_value = 0.9 * scale
    wv.inputs['Distortion'].default_value = 14
    wv.inputs['Detail'].default_value = 8
    wv.inputs['Detail Roughness'].default_value = 0.7
    L.new(tc.outputs['Object'], wv.inputs['Vector'])
    vr = N.new('ShaderNodeValToRGB')  # thin veins
    vr.color_ramp.elements[0].position = 0.0
    vr.color_ramp.elements[0].color = (1, 1, 1, 1)
    vr.color_ramp.elements[1].position = 0.06
    vr.color_ramp.elements[1].color = (0, 0, 0, 1)
    L.new(wv.outputs['Fac'], vr.inputs['Fac'])
    cr = N.new('ShaderNodeValToRGB')
    cr.color_ramp.elements[0].color = (*[c * (1 - cloud) for c in base], 1)
    cr.color_ramp.elements[1].color = (*base, 1)
    L.new(nz.outputs['Fac'], cr.inputs['Fac'])
    mx = N.new('ShaderNodeMix'); mx.data_type = 'RGBA'
    L.new(vr.outputs['Color'], mx.inputs['Factor'])
    mx.inputs['Factor'].default_value = 0
    L.new(cr.outputs['Color'], mx.inputs['A'])
    mx.inputs['B'].default_value = (*vein, 1)
    mul = N.new('ShaderNodeMath'); mul.operation = 'MULTIPLY'
    mul.inputs[1].default_value = vein_amt
    L.new(vr.outputs['Color'], mul.inputs[0])
    L.new(mul.outputs[0], mx.inputs['Factor'])
    L.new(mx.outputs['Result'], p.inputs['Base Color'])
    p.inputs['Roughness'].default_value = rough
    return m

def plaster(name, color, rough=0.9):
    m, nt, p = _mat(name)
    N, L = nt.nodes, nt.links
    tc = N.new('ShaderNodeTexCoord')
    nz = N.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 6; nz.inputs['Detail'].default_value = 12
    L.new(tc.outputs['Object'], nz.inputs['Vector'])
    cr = N.new('ShaderNodeValToRGB')
    cr.color_ramp.elements[0].color = (*[c * 0.94 for c in color], 1)
    cr.color_ramp.elements[1].color = (*color, 1)
    L.new(nz.outputs['Fac'], cr.inputs['Fac'])
    L.new(cr.outputs['Color'], p.inputs['Base Color'])
    p.inputs['Roughness'].default_value = rough
    b = N.new('ShaderNodeBump'); b.inputs['Strength'].default_value = 0.05
    L.new(nz.outputs['Fac'], b.inputs['Height']); L.new(b.outputs['Normal'], p.inputs['Normal'])
    return m

def fabric(name, color, rough=0.95):
    m, nt, p = _mat(name)
    N, L = nt.nodes, nt.links
    tc = N.new('ShaderNodeTexCoord')
    nz = N.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 400; nz.inputs['Detail'].default_value = 2
    L.new(tc.outputs['Object'], nz.inputs['Vector'])
    p.inputs['Base Color'].default_value = (*color, 1)
    p.inputs['Roughness'].default_value = rough
    p.inputs['Sheen Weight'].default_value = 0.2
    b = N.new('ShaderNodeBump'); b.inputs['Strength'].default_value = 0.25
    L.new(nz.outputs['Fac'], b.inputs['Height']); L.new(b.outputs['Normal'], p.inputs['Normal'])
    return m

def glass(name='glass'):
    m, nt, p = _mat(name)
    p.inputs['Transmission Weight'].default_value = 1.0
    p.inputs['Roughness'].default_value = 0.0
    p.inputs['IOR'].default_value = 1.45
    return m

# ---------------------------------------------------------------- geometry
def box(name, center, size, mat, bevel=0.003, segs=2):
    bpy.ops.mesh.primitive_cube_add(size=1, location=center)
    o = bpy.context.active_object; o.name = name
    o.scale = size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if bevel:
        b = o.modifiers.new('bev', 'BEVEL'); b.width = bevel; b.segments = segs
        b.limit_method = 'ANGLE'
    o.data.materials.append(mat)
    return o

def boxmm(name, x0, y0, z0, x1, y1, z1, mat, bevel=0.003):
    return box(name, ((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2),
               (abs(x1 - x0), abs(y1 - y0), abs(z1 - z0)), mat, bevel)

def cyl(name, center, r, h, mat, verts=48, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=r, depth=h, location=center, rotation=rot)
    o = bpy.context.active_object; o.name = name
    o.data.materials.append(mat)
    bpy.ops.object.shade_smooth()
    return o

def fronts_x(prefix, x0, x1, y, z0, z1, n, mat, depth=0.019, gap=0.003, seed=0):
    """Row of cabinet doors facing -Y at plane y, spanning x0..x1."""
    w = (x1 - x0 - gap * (n - 1)) / n
    out = []
    for i in range(n):
        a = x0 + i * (w + gap)
        out.append(boxmm(f'{prefix}{i}', a, y - depth, z0, a + w, y, z1, mat, 0.0015))
    return out

def fronts_y(prefix, y0, y1, x, z0, z1, n, mat, depth=0.019, gap=0.003, facing=1):
    """Row of doors facing +X (facing=1) at plane x."""
    w = (y1 - y0 - gap * (n - 1)) / n
    for i in range(n):
        a = y0 + i * (w + gap)
        if facing > 0:
            boxmm(f'{prefix}{i}', x, a, z0, x + depth, a + w, z1, mat, 0.0015)
        else:
            boxmm(f'{prefix}{i}', x - depth, a, z0, x, a + w, z1, mat, 0.0015)

# ---------------------------------------------------------------- light/camera
def sun(rot_deg=(50, 0, 30), strength=4.0, color=(1, 0.93, 0.82), angle=1.5):
    d = bpy.data.lights.new('sun', 'SUN'); d.energy = strength; d.color = color
    d.angle = math.radians(angle)
    o = bpy.data.objects.new('sun', d); bpy.context.collection.objects.link(o)
    o.rotation_euler = [math.radians(a) for a in rot_deg]
    return o

def area(loc, rot_deg, size, power, color=(1, 0.96, 0.9), shape='RECTANGLE', size_y=None):
    d = bpy.data.lights.new('area', 'AREA'); d.energy = power; d.color = color
    d.shape = shape; d.size = size; d.size_y = size_y or size
    o = bpy.data.objects.new('area', d); bpy.context.collection.objects.link(o)
    o.location = loc; o.rotation_euler = [math.radians(a) for a in rot_deg]
    return o

def point(loc, power, color=(1, 0.8, 0.55), radius=0.05):
    d = bpy.data.lights.new('pt', 'POINT'); d.energy = power; d.color = color
    d.shadow_soft_size = radius
    o = bpy.data.objects.new('pt', d); bpy.context.collection.objects.link(o)
    o.location = loc
    return o

def camera(loc, target, lens=28, shift=(0, 0), dof=None):
    c = bpy.data.cameras.new('cam'); c.lens = lens
    c.shift_x, c.shift_y = shift
    if dof:
        c.dof.use_dof = True; c.dof.focus_distance = dof[0]; c.dof.aperture_fstop = dof[1]
    o = bpy.data.objects.new('cam', c); bpy.context.collection.objects.link(o)
    o.location = loc
    d = Vector(target) - Vector(loc)
    o.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
    bpy.context.scene.camera = o
    return o

def render(path, w=1600, h=1000, samples=None, exposure=0.0):
    sc = bpy.context.scene
    sc.render.resolution_x = w; sc.render.resolution_y = h
    sc.render.resolution_percentage = 100
    if samples: sc.cycles.samples = samples
    sc.view_settings.exposure = exposure
    sc.render.filepath = path
    bpy.ops.render.render(write_still=True)

# shared palette (linear-ish values)
def palette():
    return dict(
        walnut=wood('walnut', (0.038, 0.019, 0.010), (0.13, 0.068, 0.034), 'Z', 16),
        walnut_h=wood('walnut_h', (0.038, 0.019, 0.010), (0.13, 0.068, 0.034), 'X', 16, seed=3.1),
        oak=wood('oak', (0.30, 0.19, 0.105), (0.52, 0.37, 0.22), 'Z', 22, rough=0.55),
        oak_floor=wood('oak_floor', (0.27, 0.17, 0.095), (0.46, 0.32, 0.19), 'X', 14, rough=0.5),
        limestone=stone('limestone', (0.72, 0.64, 0.52), (0.48, 0.40, 0.32), vein_amt=0.35),
        marble=stone('marble', (0.8, 0.75, 0.67), (0.36, 0.30, 0.25), vein_amt=0.6, rough=0.18, scale=1.2),
        wall=plaster('wall', (0.6, 0.55, 0.47)),
        wall_warm=plaster('wall_warm', (0.66, 0.58, 0.48)),
        matte_taupe=solid('matte_taupe', (0.42, 0.36, 0.29), 0.62),
        matte_ivory=solid('matte_ivory', (0.56, 0.52, 0.45), 0.55),
        matte_dark=solid('matte_dark', (0.035, 0.032, 0.028), 0.55),
        bronze=solid('bronze', (0.38, 0.24, 0.13), 0.32, metal=1.0),
        black_metal=solid('black_metal', (0.02, 0.02, 0.02), 0.35, metal=1.0),
        led=emissive('led', strength=18),
        linen=fabric('linen', (0.4, 0.34, 0.27)),
        boucle=fabric('boucle', (0.34, 0.29, 0.23)),
        glass=glass(),
    )

def floor_planks(x0, x1, y0, y1, dark=(0.18, 0.12, 0.075), light=(0.34, 0.25, 0.16), w=0.19, along='X', variants=6, seed=7):
    rnd = random.Random(seed)
    mats = [wood(f'fl{i}', tuple(c * rnd.uniform(0.92, 1.05) for c in dark), tuple(c * rnd.uniform(0.94, 1.04) for c in light),
                 along, rnd.uniform(11, 16), rough=0.48, seed=rnd.uniform(0, 50)) for i in range(variants)]
    if along == 'X':
        y = y0; row = 0
        while y < y1:
            x = x0 - rnd.uniform(0, 1.2)
            while x < x1:
                L = rnd.uniform(1.0, 2.2)
                boxmm('pl', max(x, x0), y, -0.02, min(x + L - 0.002, x1), y + w - 0.002, 0, rnd.choice(mats), 0.0015)
                x += L
            y += w; row += 1
    else:
        x = x0
        while x < x1:
            y = y0 - rnd.uniform(0, 1.2)
            while y < y1:
                L = rnd.uniform(1.0, 2.2)
                boxmm('pl', x, max(y, y0), -0.02, x + w - 0.002, min(y + L - 0.002, y1), 0, rnd.choice(mats), 0.0015)
                y += L
            x += w

def backdrop(center, size, rot_deg=(0, 0, 0), strength=3.0, color=(1.0, 0.97, 0.92)):
    """Bright exterior seen through windows (camera-visible only)."""
    m = emissive('sky_card', color, strength)
    o = box('backdrop', center, size, m, 0)
    o.rotation_euler = [math.radians(a) for a in rot_deg]
    o.visible_diffuse = False; o.visible_glossy = False; o.visible_shadow = False
    o.visible_transmission = False; o.visible_volume_scatter = False
    return o
