"""Interior scene + HVAC system for a scroll-driven web hero, driven by a scene spec (JSON).

Run (macOS Blender; any OS works with the right Blender path):
  /Applications/Blender.app/Contents/MacOS/Blender -b --factory-startup \\
    --python build_scene.py -- scene.json out.glb RENDER_DIR [render]

The spec picks materials (CC0 Poly Haven scans, tinted to the reference), colours, the ceiling
type ("slats" | "tiles" | "open") and which features exist. See scene.example.json and
references/generator.md in the skill. Textures download once into spec.cache_dir.

Blender is Z-up; glTF export turns it Y-up, so Blender -Y (the open front of the room) is +Z in three.js.
Nodes and extras the web template reads:
  ceiling_reveal (children)    slats / ceiling tiles that fade out to x-ray the plenum
  slab                         fades out for views from above
  ahu_door / ahu_fan           door hinge and fan axis are the object origins
  extras on HVAC parts         explode_sys / explode_ahu: [x, y, z] offsets in Blender axes,
                               delay: 0..1 stagger, fade_explode: fade instead of move
  furniture (children), windows, room ...   shadow casters
Material names the template special-cases: leaf_* (alpha clip), glass (no depth write), screen.
"""
import bpy, bmesh, json, math, os, sys, urllib.request
import numpy as np
from mathutils import Matrix, Vector

argv = sys.argv[sys.argv.index("--") + 1:]
SPEC_PATH, OUT_GLB, RENDER_DIR = argv[0], argv[1], argv[2]
DO_RENDER = len(argv) > 3 and argv[3] == "render"

EXAMPLE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "scene.example.json")
DEFAULTS = json.load(open(EXAMPLE)) if os.path.exists(EXAMPLE) else {}
user = json.load(open(SPEC_PATH))


def merged(a, b):
    out = dict(a)
    for k, v in b.items():
        out[k] = merged(a[k], v) if isinstance(v, dict) and isinstance(a.get(k), dict) else v
    return out


SPEC = merged(DEFAULTS, user)
for key, m in user.get("materials", {}).items():
    # a material in the spec replaces the default whole, so a new scan never inherits the old scan's tint
    SPEC["materials"][key] = {"tile": DEFAULTS.get("materials", {}).get(key, {}).get("tile", 1.0), **m}
FEAT = SPEC["features"]
HVAC = SPEC["hvac"]
CEIL_TYPE = SPEC["ceiling"]["type"]
assert CEIL_TYPE in ("slats", "tiles", "open"), f"unknown ceiling type {CEIL_TYPE}"
CACHE = os.path.expanduser(SPEC["cache_dir"])

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
root = scene.collection
rng = np.random.default_rng(11)

# ---------------------------------------------------------------- images
def hexc(h):
    h = h.lstrip("#")
    return np.array([int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)])


def srgb(h):
    return tuple(float(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4) for x in hexc(h))


def col(key):
    return SPEC["colors"][key]


def polyhaven(asset, kind):
    name = f"{asset}_{kind}_1k.jpg"
    path = os.path.join(CACHE, name)
    if not os.path.exists(path):
        os.makedirs(CACHE, exist_ok=True)
        urllib.request.urlretrieve(f"https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/{asset}/{name}", path)
    return path


def load(path, color=True, size=None, mul=None, add=0.0, seamless=False):
    img = bpy.data.images.load(path, check_existing=False)
    if not color:
        img.colorspace_settings.name = "Non-Color"
    if size and tuple(img.size) != (size, size):
        img.scale(size, size)
    if mul is not None or add or seamless:
        W, H = img.size
        px = np.empty(len(img.pixels), dtype=np.float32)
        img.pixels.foreach_get(px)
        px = px.reshape(H, W, 4)
        if seamless:  # cross-fade the borders with the half-offset copy, so a photo tiles without hard seams
            m = np.maximum(np.abs(np.linspace(-1, 1, W))[None, :], np.abs(np.linspace(-1, 1, H))[:, None])
            m = np.clip(m * 2.5 - 1.5, 0, 1)[..., None]
            px = px * (1 - m) + np.roll(px, (H // 2, W // 2), axis=(0, 1)) * m
        px[..., :3] = np.clip(px[..., :3] * np.asarray(mul if mul is not None else 1.0) + add, 0, 1)
        img.pixels.foreach_set(px.astype(np.float32).ravel())
    img.pack()
    return img


def make_image(name, rgba):
    H, W, C = rgba.shape
    if C == 3:
        rgba = np.concatenate([rgba, np.ones((H, W, 1))], axis=2)
    img = bpy.data.images.new(name, W, H, alpha=True)
    img.pixels.foreach_set(np.flipud(rgba).astype(np.float32).ravel())
    img.pack()
    return img


def blur(a, k):
    for axis in (0, 1):
        c = np.cumsum(np.pad(a, [(k, k) if i == axis else (0, 0) for i in range(a.ndim)], mode="edge"), axis=axis)
        a = (np.take(c, range(2 * k, c.shape[axis]), axis=axis) - np.take(c, range(0, c.shape[axis] - 2 * k), axis=axis)) / (2 * k)
    return a


def leaf_image(name, base, light, seed, heart):
    """A single leaf with midrib and veins on a transparent ground; stalk end at the bottom edge."""
    W, H = 192, 288
    r = np.random.default_rng(seed)
    u = np.linspace(-1, 1, W)[None, :]
    v = 1 - np.linspace(0, 1, H)[:, None]
    width = 0.97 * np.sin(np.pi * np.clip(v, 0, 1) ** (0.55 if heart else 0.8)) ** 0.85
    alpha = np.clip((width - np.abs(u)) * 40, 0, 1)
    if heart:
        alpha *= np.clip((np.abs(u) - 0.25 * np.clip(1 - v / 0.12, 0, 1)) * 40 + 1, 0, 1)
    g = 0.25 + 0.5 * v + 0.15 * (1 - np.abs(u) / (width + 1e-3))
    c = base[None, None, :] * (1 - g[..., None]) + light[None, None, :] * g[..., None]
    midrib = np.clip(1 - np.abs(u) / 0.025, 0, 1)
    veins = np.clip((np.sin((v * 11 - np.abs(u) * 3.2) * np.pi) - 0.9) * 8, 0, 1) * (np.abs(u) < width * 0.92)
    c = c + 0.12 * (midrib + 0.6 * veins)[..., None] + (r.random((H, W, 1)) - 0.5) * 0.03
    c = c * (1 - 0.25 * np.clip(1 - (width - np.abs(u)) * 12, 0, 1)[..., None])
    return make_image(name, np.concatenate([np.clip(c, 0, 1), alpha[..., None]], axis=2))


def screen_image():
    """A dashboard on the monitors."""
    W, H = 512, 288
    im = np.ones((H, W, 3)) * hexc("101826")
    im[:, :56] = hexc("0b1220")
    im[:30, 56:] = hexc("141d2e")
    for i in range(6):
        im[52 + i * 28:58 + i * 28, 14:42] = hexc("2a3650")
    for k, c in enumerate(("3b5bfd", "2fbf8f", "f2a03d")):
        x0 = 72 + k * 142
        im[44:96, x0:x0 + 130] = hexc("17223a")
        im[56:62, x0 + 10:x0 + 70] = hexc("4a5874")
        im[70:86, x0 + 10:x0 + 60] = hexc(c)
    im[110:270, 72:330] = hexc("17223a")
    for i in range(10):
        h = int(rng.uniform(30, 130))
        im[260 - h:260, 86 + i * 24:102 + i * 24] = hexc("3b5bfd")
    im[110:270, 342:496] = hexc("17223a")
    xs = np.arange(352, 488)
    ys = (190 + 30 * np.sin(xs / 14.0) - (xs - 352) * 0.4).astype(int)
    for dx in range(-1, 2):
        im[np.clip(ys + dx, 0, H - 1), xs] = hexc("2fbf8f")
    return make_image("screen_ui", im)


def keyboard_image():
    W, H = 384, 120
    im = np.ones((H, W, 3)) * hexc("b9bcc0")
    for row in range(5):
        for c in range(15):
            x0, y0 = 8 + c * 25, 8 + row * 22
            im[y0:y0 + 18, x0:x0 + 21] = hexc("f1f2f3")
    im[96:114, 90:280] = hexc("f1f2f3")
    return make_image("keyboard", im)


def sky_image():
    """Soft, out-of-focus city beyond the windows."""
    W, H = 1024, 384
    t = np.linspace(0, 1, H)[:, None, None]
    im = np.repeat(hexc(col("sky_top"))[None, None, :] * (1 - t) + hexc(col("sky_bottom"))[None, None, :] * t, W, axis=1)
    sil = np.zeros((H, W))
    x = 0
    while x < W:
        w = int(rng.uniform(30, 90))
        h = int(rng.uniform(0.18, 0.55) * H)
        sil[H - h:, x:x + w] = rng.uniform(0.55, 1.0)
        x += w + int(rng.uniform(0, 12))
    sil = blur(sil, 6)
    im = im * (1 - 0.35 * sil[..., None]) + hexc("c9d0d8")[None, None, :] * 0.35 * sil[..., None]
    return make_image("city_sky", np.clip(im, 0, 1))


# ---------------------------------------------------------------- materials
def material(name, color, metal=0.0, rough=0.5, emit=0.0, alpha=1.0):
    m = bpy.data.materials.new(name)
    try:
        m.use_nodes = True
    except Exception:
        pass
    b = m.node_tree.nodes.get("Principled BSDF")
    b.inputs["Base Color"].default_value = (*srgb(color), 1)
    b.inputs["Metallic"].default_value = metal
    b.inputs["Roughness"].default_value = rough
    if emit:
        b.inputs["Emission Color"].default_value = (*srgb(color), 1)
        b.inputs["Emission Strength"].default_value = emit
    if alpha < 1:
        b.inputs["Alpha"].default_value = alpha
    return m


def textured(name, diff, nor=None, rough=None, metal=0.0, rough_value=0.5, normal_strength=1.0,
             emission=None, emit=0.0, alpha_clip=False):
    m = bpy.data.materials.new(name)
    try:
        m.use_nodes = True
    except Exception:
        pass
    nt = m.node_tree
    b = nt.nodes.get("Principled BSDF")
    t = nt.nodes.new("ShaderNodeTexImage")
    t.image = diff
    nt.links.new(t.outputs["Color"], b.inputs["Base Color"])
    if alpha_clip:                                        # glTF exporter turns ROUND into alphaMode MASK
        rnd = nt.nodes.new("ShaderNodeMath")
        rnd.operation = "ROUND"
        nt.links.new(t.outputs["Alpha"], rnd.inputs[0])
        nt.links.new(rnd.outputs[0], b.inputs["Alpha"])
    if nor is not None:
        tn = nt.nodes.new("ShaderNodeTexImage")
        tn.image = nor
        nm = nt.nodes.new("ShaderNodeNormalMap")
        nm.inputs["Strength"].default_value = normal_strength
        nt.links.new(tn.outputs["Color"], nm.inputs["Color"])
        nt.links.new(nm.outputs["Normal"], b.inputs["Normal"])
    if rough is not None:
        tr = nt.nodes.new("ShaderNodeTexImage")
        tr.image = rough
        nt.links.new(tr.outputs["Color"], b.inputs["Roughness"])
    else:
        b.inputs["Roughness"].default_value = rough_value
    b.inputs["Metallic"].default_value = metal
    if emission is not None:
        te = nt.nodes.new("ShaderNodeTexImage")
        te.image = emission
        nt.links.new(te.outputs["Color"], b.inputs["Emission Color"])
        b.inputs["Emission Strength"].default_value = emit
    return m


def scanned(name, spec):
    """A Poly Haven scan ("asset") and/or the user's own photos ("diff", "nor", "rough": file paths).
    With both, the photo gives the colour and the scan keeps its relief and roughness."""
    def source(kind, key):
        if spec.get(key):
            return os.path.expanduser(spec[key])
        return polyhaven(spec["asset"], kind) if spec.get("asset") else None

    nor, rough = source("nor_gl", "nor"), source("rough", "rough")
    return textured(
        name,
        load(source("diff", "diff"), mul=spec.get("mul"), add=spec.get("add", 0.0),
             size=spec.get("dsize", 1024 if spec.get("diff") else None), seamless=spec.get("seamless", False)),
        load(nor, color=False, size=spec.get("nsize", 512)) if nor else None,
        load(rough, color=False, size=spec.get("rsize", 256), mul=spec.get("rough_mul", 1.0)) if rough else None,
        rough_value=spec.get("roughness", 0.6),
        normal_strength=spec.get("normal_strength", 1.0),
    )


MS = SPEC["materials"]
M = {key: scanned(key, MS[key]) for key in ("wood", "floor", "plaster", "border", "fabric", "fabric_light")}
M.update({
    "screen": textured("screen", (img := screen_image()), emission=img, emit=1.2, rough_value=0.25),
    "keyboard": textured("keyboard_keys", keyboard_image(), rough_value=0.5),
    "sky": textured("city_sky", (sky := sky_image()), emission=sky, emit=1.0, rough_value=1.0),
    "pothos": textured("leaf_pothos", leaf_image("pothos", hexc(col("leaf_dark")), hexc(col("leaf_light")), 1, True), rough_value=0.55, alpha_clip=True),
    "fig": textured("leaf_fig", leaf_image("fig", hexc(col("leaf_dark")) * 0.8, hexc(col("leaf_light")) * 0.7, 2, False), rough_value=0.4, alpha_clip=True),
    "white": material("desk_white", col("desk"), 0.0, 0.42),
    "white_panel": material("panel_white", col("panel"), 0.0, 0.7),
    "black": material("black_powder", col("dark_metal"), 0.3, 0.5),
    "plastic": material("black_plastic", col("plastic"), 0.0, 0.45),
    "chrome": material("chrome", "d7dade", 1.0, 0.12),
    "accent": material("accent_metal", col("accent_metal"), 0.9, 0.3),
    "warm": material("led_warm", col("led"), 0.0, 0.4, emit=6.0),
    "downlight": material("led_white", "fff3e2", 0.0, 0.4, emit=8.0),
    "panel_led": material("led_panel", "fbf6ee", 0.0, 0.4, emit=3.0),
    "glass": material("glass", "dfe9ea", 0.0, 0.04, alpha=0.12),
    "frame": material("window_frame", col("window_frame"), 0.6, 0.38),
    "blind": material("roller_blind", col("blind"), 0.0, 0.9),
    "soil": material("soil", "2b2420", 0.0, 1.0),
    "pot": material("planter_grey", col("pot"), 0.0, 0.85),
    "grey": material("light_grey", "c9cacc", 0.1, 0.5),
    "mug": material("ceramic", "f4f2ee", 0.0, 0.25),
    "white_metal": material("white_metal", "f4f5f7", 0.25, 0.32),
    "book1": material("book_sand", "c8b79c", 0.0, 0.8),
    "book2": material("book_ink", "2c2e33", 0.0, 0.8),
    "book3": material("book_white", "e6e3dc", 0.0, 0.8),
    "book4": material("book_rust", "9a5a3c", 0.0, 0.8),
    "tv": material("tv_screen", "0e1117", 0.2, 0.15, emit=0.05),
    "duct": material("duct", col("duct"), 0.55, 0.4),
    "duct_wrap": material("duct_wrap", col("duct_wrap"), 0.0, 0.85),
    "ahu": material("ahu", col("ahu"), 0.45, 0.38),
    "ahu_inner": material("ahu_inner", "8e9298", 0.4, 0.5),
    "steel": material("steel", "9aa0a8", 0.85, 0.3),
    "fins": material("fins", "b9c0cb", 0.9, 0.25),
    "filter": material("filter_media", "e8e2d4", 0.0, 0.9),
    "copper": material("copper", "b8763e", 0.9, 0.3),
    "insulation": material("insulation", "1d1f23", 0.0, 0.8),
    "arrow_light": material("arrow_light", "c9cbcf", 0.2, 0.5),
    "sprinkler": material("sprinkler_red", col("sprinkler"), 0.3, 0.45),
    "slab": material("slab", col("slab"), 0.0, 0.95),
})


def uvs(key, long_axis="y"):
    s = 1 / MS[key]["tile"]
    return (s, s, rng.random(), rng.random(), long_axis)


# ---------------------------------------------------------------- builders
class Part:
    """Accumulates geometry for one object; each material gets its own slot."""

    def __init__(self, name, origin=(0, 0, 0)):
        self.name, self.origin = name, Vector(origin)
        self.bm = bmesh.new()
        self.layer = self.bm.loops.layers.uv.verify()
        self.mats = []

    def _slot(self, mat):
        if mat not in self.mats:
            self.mats.append(mat)
        return self.mats.index(mat)

    def _finish(self, before, mat, smooth=False, uv=None):
        idx = self._slot(mat)
        faces = [f for f in self.bm.faces if f not in before]
        for f in faces:
            f.material_index = idx
            f.smooth = smooth
            f.normal_update()
        if uv:
            self._uv(faces, uv)
        return faces

    def _uv(self, faces, spec):
        """Box mapping in world metres; v runs along `long`, so grain follows the board."""
        su, sv, ou, ov, long_axis = spec
        L = "xyz".index(long_axis)
        for f in faces:
            n = f.normal
            N = max(range(3), key=lambda a: abs(n[a]))
            ua, va = [a for a in range(3) if a != N]
            if L in (ua, va):
                va, ua = L, (ua if va == L else va)
            for loop in f.loops:
                p = loop.vert.co + self.origin
                loop[self.layer].uv = (p[ua] * su + ou, p[va] * sv + ov)

    def _mtx(self, loc, rot, size):
        mtx = Matrix.Translation(Vector(loc) - self.origin)
        if rot is not None:
            mtx = mtx @ rot
        return mtx @ Matrix.Diagonal((*size, 1))

    def box(self, size, loc, mat, rot=None, uv=None):
        before = set(self.bm.faces)
        bmesh.ops.create_cube(self.bm, size=1.0, matrix=self._mtx(loc, rot, size))
        return self._finish(before, mat, uv=uv)

    def rbox(self, size, loc, mat, radius, seg=3, rot=None, uv=None):
        """Box with rounded edges (cushions, screens, plastics)."""
        before = set(self.bm.faces)
        res = bmesh.ops.create_cube(self.bm, size=1.0, matrix=self._mtx(loc, rot, size))
        edges = list({e for v in res["verts"] for e in v.link_edges})
        bmesh.ops.bevel(self.bm, geom=edges, offset=radius, offset_type="OFFSET", segments=seg,
                        profile=0.5, affect="EDGES", clamp_overlap=True)
        return self._finish(before, mat, smooth=True, uv=uv)

    def cyl(self, r, length, loc, mat, axis="z", seg=24, r2=None, uv=None, direction=None):
        before = set(self.bm.faces)
        if direction is not None:
            rot = Vector((0, 0, 1)).rotation_difference(Vector(direction)).to_matrix().to_4x4()
        else:
            rot = {"z": Matrix(), "x": Matrix.Rotation(math.pi / 2, 4, "Y"), "y": Matrix.Rotation(math.pi / 2, 4, "X")}[axis]
        mtx = Matrix.Translation(Vector(loc) - self.origin) @ rot
        bmesh.ops.create_cone(self.bm, cap_ends=True, cap_tris=False, segments=seg, radius1=r,
                              radius2=r if r2 is None else r2, depth=length, matrix=mtx)
        return self._finish(before, mat, smooth=True, uv=uv)

    def ball(self, r, loc, mat, scale=(1, 1, 1), subdiv=2):
        before = set(self.bm.faces)
        mtx = Matrix.Translation(Vector(loc) - self.origin) @ Matrix.Diagonal((*scale, 1))
        bmesh.ops.create_icosphere(self.bm, subdivisions=subdiv, radius=r, matrix=mtx)
        return self._finish(before, mat, smooth=True)

    def tube(self, pts, r, mat, closed=False, seg=12):
        """Sweep a circle along a polyline (rings, cables, chair frames, stems)."""
        before = set(self.bm.faces)
        P = [Vector(p) - self.origin for p in pts]
        n = len(P)
        rings = []
        for i in range(n):
            a, b = (P[i - 1], P[(i + 1) % n]) if closed else (P[max(i - 1, 0)], P[min(i + 1, n - 1)])
            t = (b - a).normalized()
            ref = Vector((0, 0, 1)) if abs(t.z) < 0.9 else Vector((1, 0, 0))
            u = (ref - t * ref.dot(t)).normalized()
            v = t.cross(u)
            rings.append([self.bm.verts.new(P[i] + r * (math.cos(2 * math.pi * j / seg) * u + math.sin(2 * math.pi * j / seg) * v)) for j in range(seg)])
        for i in range(n if closed else n - 1):
            A, B = rings[i], rings[(i + 1) % n]
            for j in range(seg):
                self.bm.faces.new((A[j], A[(j + 1) % seg], B[(j + 1) % seg], B[j]))
        return self._finish(before, mat, smooth=True)

    def quad(self, corners, mat, uv=((0, 0), (1, 0), (1, 1), (0, 1))):
        before = set(self.bm.faces)
        vs = [self.bm.verts.new(Vector(c) - self.origin) for c in corners]
        f = self.bm.faces.new(vs)
        for loop, t in zip(f.loops, uv):
            loop[self.layer].uv = t
        return self._finish(before, mat)

    def leaf(self, base, length, width, yaw, pitch, mat, fold=0.25, roll=0.0):
        """A leaf card folded along its midrib; the texture's alpha cuts the outline."""
        before = set(self.bm.faces)
        R = Matrix.Rotation(yaw, 4, "Z") @ Matrix.Rotation(pitch, 4, "X") @ Matrix.Rotation(roll, 4, "Y")
        o = Vector(base) - self.origin
        w2, lift = width / 2, width * fold
        local = [(-w2, 0, lift), (0, 0, 0), (w2, 0, lift), (w2, length, lift), (0, length, 0), (-w2, length, lift)]
        vs = [self.bm.verts.new(o + (R @ Vector(p))) for p in local]
        uvq = [(0, 0), (0.5, 0), (1, 0), (1, 1), (0.5, 1), (0, 1)]
        for idx in ((0, 1, 4, 5), (1, 2, 3, 4)):
            f = self.bm.faces.new([vs[i] for i in idx])
            for loop, i in zip(f.loops, idx):
                loop[self.layer].uv = uvq[i]
        return self._finish(before, mat, smooth=True)

    def bend(self, start, R, r, mat, steps=10, seg=20):
        """Quarter bend from heading -Y to heading -Z, starting at `start`."""
        C = Vector(start) - Vector((0, 0, R))
        pts = [C + R * Vector((0, -math.sin(t), math.cos(t))) for t in np.linspace(0, math.pi / 2, steps + 1)]
        return self.tube(pts, r, mat, seg=seg)

    def helix(self, start, direction, length, r, mat, pitch=0.13, wire=0.0035):
        """Lock-seam spiral on a round duct."""
        d = Vector(direction).normalized()
        u = Vector((1, 0, 0)) if abs(d.x) < 0.9 else Vector((0, 0, 1))
        u = (u - d * u.dot(d)).normalized()
        v = d.cross(u)
        n = int(length / pitch * 20)
        pts = [Vector(start) + d * (length * i / n) + r * (math.cos(2 * math.pi * length * i / n / pitch) * u
               + math.sin(2 * math.pi * length * i / n / pitch) * v) for i in range(n + 1)]
        return self.tube(pts, wire, mat, seg=5)

    def build(self, parent=None, bevel=0.0, **extras):
        me = bpy.data.meshes.new(self.name)
        self.bm.to_mesh(me)
        self.bm.free()
        for m in self.mats:
            me.materials.append(m)
        ob = bpy.data.objects.new(self.name, me)
        root.objects.link(ob)
        ob.location = self.origin
        if parent is not None:
            ob.parent = parent
            ob.location = self.origin - parent.location
        if bevel:
            mod = ob.modifiers.new("Bevel", "BEVEL")
            mod.width = bevel
            mod.segments = 2
            mod.limit_method = "ANGLE"
        for k, v in extras.items():
            ob[k] = v
        return ob


def empty(name, loc=(0, 0, 0)):
    ob = bpy.data.objects.new(name, None)
    ob.location = loc
    root.objects.link(ob)
    return ob


# ---------------------------------------------------------------- layout constants
RX0, RX1, RY0, RY1 = -5.2, 5.2, -4.6, 3.6        # room; -Y is the open front the camera looks in from
CEIL = 3.0                                        # white plaster ceiling around the feature zone
SX0, SX1, SY0, SY1 = -3.3, 3.3, -2.7, 2.7         # feature ceiling zone over the work area
SLAB_Z = 4.0
WIN_HEAD = 2.72
LOW = CEIL - 0.2                                  # underside of slats / tile grid / exposed boxes
CELL = 0.6                                        # tile module

if CEIL_TYPE == "slats":
    PZ = LOW + SPEC["ceiling"]["slat_depth"]      # top of the feature ceiling
    SUPPLY_Y, RETURN_Y, BRANCH_Y, SPR_Y = 0.9, -0.9, -0.3, 0.0
elif CEIL_TYPE == "tiles":
    PZ = LOW + 0.05
    SUPPLY_Y, RETURN_Y, BRANCH_Y, SPR_Y = 1.2, -1.2, 0.0, -0.6
else:
    PZ = LOW + 0.05
    SUPPLY_Y, RETURN_Y, BRANCH_Y, SPR_Y = 0.9, -0.9, -0.3, 0.0
PITCH = SPEC["ceiling"].get("pitch", 0.11)


def snap_x(x):
    """Where a diffuser can sit: in a slat gap, in a tile cell, or anywhere on an open ceiling."""
    if CEIL_TYPE == "slats":
        return SX0 + PITCH * round((x - SX0) / PITCH)
    if CEIL_TYPE == "tiles":
        return SX0 + CELL / 2 + CELL * round((x - SX0 - CELL / 2) / CELL)
    return x


def snap_y(y):
    if CEIL_TYPE == "tiles":
        return SY0 + CELL / 2 + CELL * round((y - SY0 - CELL / 2) / CELL)
    return y


# ---------------------------------------------------------------- room shell
shell = Part("room")
shell.box((RX1 - RX0, RY1 - RY0, 0.02), ((RX0 + RX1) / 2, (RY0 + RY1) / 2, -0.01), M["border"], uv=uvs("border"))
shell.box((8.0, 6.6, 0.012), (-0.6, -0.4, 0.006), M["floor"], uv=uvs("floor"))
shell.box((RX1 - RX0 + 0.3, 0.15, CEIL + 0.05), ((RX0 + RX1) / 2, RY1 + 0.075, (CEIL + 0.05) / 2), M["plaster"], uv=uvs("plaster", "x"))
shell.box((0.15, RY1 - RY0, CEIL + 0.05), (RX1 + 0.075, (RY0 + RY1) / 2, (CEIL + 0.05) / 2), M["plaster"], uv=uvs("plaster"))
if FEAT["windows"]:
    shell.box((0.15, RY1 - RY0, CEIL + 0.05 - WIN_HEAD), (RX0 - 0.075, (RY0 + RY1) / 2, (CEIL + 0.05 + WIN_HEAD) / 2), M["plaster"], uv=uvs("plaster"))
else:
    shell.box((0.15, RY1 - RY0, CEIL + 0.05), (RX0 - 0.075, (RY0 + RY1) / 2, (CEIL + 0.05) / 2), M["plaster"], uv=uvs("plaster"))
for x0, x1, y0, y1 in ((RX0, RX1, RY0, SY0), (RX0, RX1, SY1, RY1), (RX0, SX0, SY0, SY1), (SX1, RX1, SY0, SY1)):
    shell.box((x1 - x0, y1 - y0, 0.05), ((x0 + x1) / 2, (y0 + y1) / 2, CEIL + 0.025), M["plaster"], uv=uvs("plaster", "x"))
FASCIA_Z0 = LOW - 0.08                             # dropped plaster frame around the zone
for (sx, sy, cx, cy) in (
    (SX1 - SX0 + 0.12, 0.06, 0, SY0 - 0.03), (SX1 - SX0 + 0.12, 0.06, 0, SY1 + 0.03),
    (0.06, SY1 - SY0, SX0 - 0.03, 0), (0.06, SY1 - SY0, SX1 + 0.03, 0),
):
    shell.box((sx, sy, CEIL - FASCIA_Z0), (cx, cy, (CEIL + FASCIA_Z0) / 2), M["plaster"], uv=uvs("plaster", "x"))
if FEAT["linear_lights"]:
    for x in (-4.25, 4.25):
        shell.box((0.04, RY1 - RY0 - 0.6, 0.012), (x, (RY0 + RY1) / 2, CEIL - 0.004), M["black"])
        shell.box((0.014, RY1 - RY0 - 0.66, 0.006), (x, (RY0 + RY1) / 2, CEIL - 0.011), M["warm"])
if FEAT["downlights"]:
    for x in np.linspace(-4.0, 4.0, 6):
        for y in (-3.65, 3.15):
            shell.cyl(0.07, 0.012, (x, y, CEIL - 0.004), M["black"], seg=24)
            shell.cyl(0.055, 0.006, (x, y, CEIL - 0.011), M["downlight"], seg=24)
shell.box((RX1 - RX0, 0.012, 0.08), ((RX0 + RX1) / 2, RY1 - 0.006, 0.04), M["white_panel"])
shell.box((0.012, RY1 - RY0, 0.08), (RX1 - 0.006, (RY0 + RY1) / 2, 0.04), M["white_panel"])
shell.build()

if FEAT["windows"]:
    win = Part("windows")
    glass = Part("glass")
    bays = np.linspace(RY0, RY1, 7)
    for y in bays:
        win.box((0.14, 0.06, WIN_HEAD), (RX0, y, WIN_HEAD / 2), M["frame"])
    for z in (0.03, 2.3, WIN_HEAD - 0.03):
        win.box((0.14, RY1 - RY0, 0.06), (RX0, (RY0 + RY1) / 2, z), M["frame"])
    win.box((0.3, RY1 - RY0, 0.04), (RX0 + 0.13, (RY0 + RY1) / 2, 0.06), M["white_panel"])
    for i in range(6):
        y0, y1 = bays[i] + 0.03, bays[i + 1] - 0.03
        glass.box((0.012, y1 - y0, 2.24), (RX0, (y0 + y1) / 2, 1.18), M["glass"])
        glass.box((0.012, y1 - y0, WIN_HEAD - 2.36), (RX0, (y0 + y1) / 2, (2.33 + WIN_HEAD) / 2), M["glass"])
        if FEAT["blinds"]:
            drop = (0.25, 0.9, 0.5, 1.2, 0.35, 0.7)[i]
            win.box((0.012, y1 - y0 - 0.02, drop), (RX0 + 0.12, (y0 + y1) / 2, WIN_HEAD - 0.06 - drop / 2), M["blind"])
            win.box((0.03, y1 - y0 - 0.02, 0.03), (RX0 + 0.12, (y0 + y1) / 2, WIN_HEAD - 0.06 - drop), M["frame"])
            win.cyl(0.035, y1 - y0, (RX0 + 0.13, (y0 + y1) / 2, WIN_HEAD - 0.04), M["white_panel"], axis="y", seg=16)
    win.build(bevel=0.002)
    glass.build()
    city = Part("city")
    city.quad([(-16, 9, -1.5), (-16, -9, -1.5), (-16, -9, 6.0), (-16, 9, 6.0)], M["sky"])
    city.build()

if FEAT["feature_wall"] or FEAT["shelving"]:
    wall = Part("feature_wall")
    if FEAT["feature_wall"]:
        wall.box((3.8, 0.04, CEIL), (-3.3, RY1 - 0.02, CEIL / 2), M["wood"], uv=uvs("wood", "z"))
        for i in range(13):
            wall.box((0.008, 0.006, CEIL), (-5.1 + i * 0.3, RY1 - 0.041, CEIL / 2), M["black"])
    if FEAT["shelving"]:
        SH_X0, SH_X1, SH_Y0, SH_Y1 = -4.7, -1.9, 3.18, 3.54
        wall.box((SH_X1 - SH_X0, SH_Y1 - SH_Y0, 0.42), ((SH_X0 + SH_X1) / 2, (SH_Y0 + SH_Y1) / 2, 0.21), M["wood"], uv=uvs("wood", "x"))
        for i in range(4):
            wall.box((0.004, 0.004, 0.36), (SH_X0 + 0.7 * (i + 1), SH_Y0 - 0.001, 0.22), M["black"])
            wall.box((0.1, 0.012, 0.01), (SH_X0 + 0.7 * i + 0.35, SH_Y0 - 0.008, 0.36), M["accent"])
        for i in range(5):
            wall.box((0.025, SH_Y1 - SH_Y0, 2.0), (SH_X0 + i * (SH_X1 - SH_X0) / 4, (SH_Y0 + SH_Y1) / 2, 1.42), M["black"])
        for z in (0.86, 1.32, 1.78, 2.24):
            wall.box((SH_X1 - SH_X0 + 0.025, SH_Y1 - SH_Y0, 0.022), ((SH_X0 + SH_X1) / 2, (SH_Y0 + SH_Y1) / 2, z), M["black"])
        books = ("book1", "book2", "book3", "book4")
        for bay in range(4):
            bx = SH_X0 + bay * 0.7
            for shelf, z in enumerate((0.86, 1.32, 1.78, 2.24)):
                kind = (bay + shelf) % 3
                if kind == 0:
                    x = bx + 0.06
                    for k in range(int(rng.integers(7, 12))):
                        w, h = rng.uniform(0.02, 0.045), rng.uniform(0.2, 0.31)
                        lean = Matrix.Rotation(0.18, 4, "Y") if k == 0 else None
                        wall.box((w, 0.22, h), (x + w / 2, SH_Y1 - 0.15, z + 0.011 + h / 2), M[books[int(rng.integers(0, 4))]], rot=lean)
                        x += w + 0.004
                    wall.box((0.18, 0.2, 0.05), (bx + 0.52, SH_Y1 - 0.15, z + 0.036), M["book3"])
                elif kind == 1:
                    wall.cyl(0.06, 0.24, (bx + 0.22, SH_Y1 - 0.17, z + 0.131), M["mug"], seg=24, r2=0.04)
                    wall.cyl(0.085, 0.05, (bx + 0.47, SH_Y1 - 0.17, z + 0.036), M["accent"], seg=24, r2=0.1)
                else:
                    wall.box((0.22, 0.2, 0.08), (bx + 0.35, SH_Y1 - 0.15, z + 0.051), M["book2"])
                    wall.box((0.18, 0.18, 0.06), (bx + 0.35, SH_Y1 - 0.15, z + 0.12), M["book1"])
                    wall.cyl(0.04, 0.09, (bx + 0.58, SH_Y1 - 0.17, z + 0.056), M["pot"], seg=16)
                    for j in range(9):
                        wall.leaf((bx + 0.58, SH_Y1 - 0.17, z + 0.1), rng.uniform(0.07, 0.1), 0.05, rng.uniform(0, 6.3),
                                  rng.uniform(-0.9, -0.2), M["pothos"])
    wall.build(bevel=0.002)

# ---------------------------------------------------------------- feature ceiling
reveal = empty("ceiling_reveal")
if CEIL_TYPE == "slats":
    SW, SD = SPEC["ceiling"]["slat_width"], SPEC["ceiling"]["slat_depth"]
    for k in range(int(round((SX1 - SX0) / PITCH))):
        x = SX0 + PITCH / 2 + PITCH * k
        s = Part(f"slat_{k:02d}", origin=(x, 0, LOW + SD / 2))
        s.box((SW, SY1 - SY0 - 0.02, SD), (x, 0, LOW + SD / 2), M["wood"], uv=uvs("wood", "y"))
        s.build(parent=reveal, bevel=0.003)
    carriers = Part("slat_carriers", origin=(0, 0, PZ + 0.015))
    for y in (-1.9, 0.0, 1.9):
        carriers.box((SX1 - SX0, 0.03, 0.03), (0, y, PZ + 0.015), M["black"])
    carriers.build(parent=reveal)
elif CEIL_TYPE == "tiles":
    grid = Part("ceiling_grid")
    nx, ny = int(round((SX1 - SX0) / CELL)), int(round((SY1 - SY0) / CELL))
    for k in range(ny + 1):
        y = SY0 + CELL * k
        grid.box((SX1 - SX0, 0.024, 0.004), (0, y, LOW + 0.002), M["white_panel"])
        grid.box((SX1 - SX0, 0.004, 0.032), (0, y, LOW + 0.02), M["white_panel"])
    for k in range(nx + 1):
        x = SX0 + CELL * k
        grid.box((0.024, SY1 - SY0, 0.004), (x, 0, LOW + 0.002), M["white_panel"])
        grid.box((0.004, SY1 - SY0, 0.026), (x, 0, LOW + 0.017), M["white_panel"])
    grid.build()
# tiles are laid after the diffusers are placed (below), so cells stay free for them

# ---------------------------------------------------------------- HVAC
taken = set()                                       # tile cells used by diffusers and panels


def cell_of(x, y):
    return (round((x - SX0 - CELL / 2) / CELL), round((y - SY0 - CELL / 2) / CELL))


if HVAC["enabled"]:
    SUP_W, SUP_H = 0.5, 0.32
    RET_W, RET_H = 0.45, 0.28
    MAIN_Z = PZ + 0.62
    AHU_X0, AHU_X1 = -2.95, -1.95
    AHU_Y0, AHU_Y1 = -1.25, 1.25
    AHU_Z0, AHU_Z1 = PZ + 0.3, PZ + 0.94
    BOX_TOP = PZ + 0.23
    SYS_AHU = [0.0, 0.0, 1.45]
    drops = [snap_x(x) for x in (-1.5, 0.3, 2.1)]
    branch_xs = [snap_x(x) for x in (-0.9, 0.9)]
    returns = [snap_x(x) for x in (-0.3, 1.5)]
    faces = Part("diffusers")                       # what shows on the ceiling stays put

    def diffuser(name, x, yc, length, neck_to=None):
        """Diffuser face plus the plenum box above it (the box takes part in the exploded view)."""
        if CEIL_TYPE == "slats":
            faces.box((0.058, length, 0.02), (x, yc, LOW + 0.01), M["black"])
            for dx in (-0.012, 0.012):
                faces.box((0.006, length - 0.04, 0.025), (x + dx, yc, LOW + 0.012), M["insulation"])
            faces.box((0.05, length, PZ - LOW), (x, yc, (LOW + PZ) / 2 + 0.01), M["black"])
            bw, bl = 0.24, length + 0.02
        else:
            taken.add(cell_of(x, yc))
            z = LOW if CEIL_TYPE == "tiles" else PZ - 0.02
            for i, s in enumerate((0.595, 0.47, 0.38, 0.29, 0.2)):
                w = 0.05 if i == 0 else 0.035
                for dx, dy, sx, sy in ((0, -s / 2 + w / 2, s, w), (0, s / 2 - w / 2, s, w), (-s / 2 + w / 2, 0, w, s - 2 * w), (s / 2 - w / 2, 0, w, s - 2 * w)):
                    faces.box((sx, sy, 0.012), (x + dx, yc + dy, z + 0.006 + i * 0.012), M["white_metal"])
            bw, bl = 0.5, 0.5
        p = Part(name, origin=(x, yc, (PZ + BOX_TOP) / 2))
        p.box((bw, bl, BOX_TOP - PZ - 0.01), (x, yc, (PZ + 0.01 + BOX_TOP) / 2), M["duct"])
        if neck_to is not None:
            p.box((0.2, 0.32, neck_to - BOX_TOP), (x, RETURN_Y, (BOX_TOP + neck_to) / 2), M["duct"])
        p.build(bevel=0.002, explode_sys=[0.0, 0.0, 0.3], delay=0.55)

    dlen = 1.2 if CEIL_TYPE == "slats" else CELL
    for i, x in enumerate(drops):
        diffuser(f"box_supply_{i}", x, snap_y(SUPPLY_Y), dlen)
    for i, x in enumerate(branch_xs):
        diffuser(f"box_branch_{i}", x, snap_y(BRANCH_Y), dlen)
    for i, x in enumerate(returns):
        diffuser(f"box_return_{i}", x, snap_y(RETURN_Y), dlen, neck_to=MAIN_Z - RET_H / 2)
    FX, FY = 2.75, snap_y(-2.1)
    if HVAC["ducted_unit"]:
        diffuser("box_unit", snap_x(FX), FY, 0.9 if CEIL_TYPE == "slats" else CELL)
    faces.build(bevel=0.002)

    def arrow(p, x, y_face, z, direction, mat):
        p.box((0.22, 0.003, 0.03), (x, y_face - 0.0015, z), mat)
        for i in range(6):
            p.box((0.012, 0.003, 0.09 * (1 - i / 6)), (x + direction * (0.11 + i * 0.012), y_face - 0.0015, z), mat)

    x_edges = np.linspace(AHU_X1, 2.8, 5)
    for i in range(4):
        x0, x1 = x_edges[i], x_edges[i + 1]
        p = Part(f"supply_{i}", origin=((x0 + x1) / 2, SUPPLY_Y, MAIN_Z))
        p.box((x1 - x0 - 0.004, SUP_W, SUP_H), ((x0 + x1) / 2, SUPPLY_Y, MAIN_Z), M["duct"])
        p.box((0.03, SUP_W + 0.05, SUP_H + 0.05), (x1 - 0.015, SUPPLY_Y, MAIN_Z), M["accent"])
        arrow(p, (x0 + x1) / 2, SUPPLY_Y - SUP_W / 2, MAIN_Z, 1, M["accent"])
        p.build(bevel=0.004, explode_sys=[(i - 1.5) * 0.4, 0.0, 1.0], delay=0.2 + i * 0.08)
    x_edges = np.linspace(AHU_X1, 2.4, 5)
    for i in range(4):
        x0, x1 = x_edges[i], x_edges[i + 1]
        p = Part(f"return_{i}", origin=((x0 + x1) / 2, RETURN_Y, MAIN_Z))
        p.box((x1 - x0 - 0.004, RET_W, RET_H), ((x0 + x1) / 2, RETURN_Y, MAIN_Z), M["duct_wrap"])
        p.box((0.04, RET_W + 0.01, RET_H + 0.01), ((x0 + x1) / 2 + 0.3, RETURN_Y, MAIN_Z), M["accent"])
        arrow(p, (x0 + x1) / 2 - 0.15, RETURN_Y - RET_W / 2 - 0.006, MAIN_Z, -1, M["arrow_light"])
        p.build(bevel=0.012, explode_sys=[(i - 1.5) * 0.4, -0.35, 0.7], delay=0.15 + i * 0.08)

    R_DUCT = 0.1
    sup_bottom = MAIN_Z - SUP_H / 2
    for i, x in enumerate(drops):
        yd = snap_y(SUPPLY_Y)
        p = Part(f"drop_{i}", origin=(x, yd, (sup_bottom + BOX_TOP) / 2))
        p.cyl(R_DUCT, sup_bottom - BOX_TOP, (x, yd, (sup_bottom + BOX_TOP) / 2), M["duct"], seg=28)
        p.helix((x, yd, BOX_TOP), (0, 0, 1), sup_bottom - BOX_TOP, R_DUCT + 0.002, M["duct"])
        p.build(explode_sys=[0.0, 0.0, 0.65], delay=0.4)
    for i, x in enumerate(branch_xs):
        y = snap_y(BRANCH_Y)
        y_start, y_end = SUPPLY_Y - SUP_W / 2, y + 0.15
        p = Part(f"branch_{i}", origin=(x, (y_start + y) / 2, MAIN_Z - 0.1))
        p.cyl(R_DUCT, y_start - y_end, (x, (y_start + y_end) / 2, MAIN_Z), M["duct"], axis="y", seg=28)
        p.helix((x, y_end, MAIN_Z), (0, 1, 0), y_start - y_end, R_DUCT + 0.002, M["duct"])
        p.cyl(R_DUCT + 0.008, 0.05, (x, y_start - 0.03, MAIN_Z), M["accent"], axis="y", seg=28)
        p.bend((x, y_end, MAIN_Z), 0.15, R_DUCT, M["duct"])
        p.cyl(R_DUCT, MAIN_Z - 0.15 - BOX_TOP, (x, y, (MAIN_Z - 0.15 + BOX_TOP) / 2), M["duct"], seg=28)
        p.build(explode_sys=[0.0, -0.2, 0.65], delay=0.45)

    if HVAC["ducted_unit"]:
        fcu = Part("ducted_unit", origin=(snap_x(FX), FY, PZ + 0.42))
        fx_ = snap_x(FX)
        fcu.box((0.9, 0.6, 0.24), (fx_, FY, PZ + 0.42), M["ahu"])
        fcu.box((0.9, 0.004, 0.02), (fx_, FY - 0.302, PZ + 0.5), M["accent"])
        fcu.box((0.5, 0.28, PZ + 0.3 - BOX_TOP), (fx_, FY, (BOX_TOP + PZ + 0.3) / 2), M["duct"])
        for z in (PZ + 0.38, PZ + 0.44):
            fcu.cyl(0.018, RX1 - (fx_ + 0.45), ((fx_ + 0.45 + RX1) / 2, FY + 0.15, z), M["insulation"], axis="x", seg=14)
            fcu.cyl(0.0095, 0.05, (fx_ + 0.47, FY + 0.15, z), M["copper"], axis="x", seg=12)
        fcu.build(bevel=0.003, explode_sys=[0.0, -0.2, 0.9], delay=0.3)

    hang = Part("hangers")
    for x in (-1.3, 0.2, 1.7):
        for y_c, w, h in ((SUPPLY_Y, SUP_W, SUP_H), (RETURN_Y, RET_W + 0.02, RET_H + 0.02)):
            z_strut = MAIN_Z - h / 2 - 0.022
            hang.box((0.04, w + 0.24, 0.04), (x, y_c, z_strut), M["black"])
            for sgn in (-1, 1):
                yy = y_c + sgn * (w / 2 + 0.08)
                hang.cyl(0.005, SLAB_Z - z_strut, (x, yy, (SLAB_Z + z_strut) / 2), M["steel"], seg=8)
    for x in (AHU_X0 + 0.1, AHU_X1 - 0.1):
        for y in (AHU_Y0 + 0.15, AHU_Y1 - 0.15):
            hang.cyl(0.007, SLAB_Z - AHU_Z1, (x, y, (SLAB_Z + AHU_Z1) / 2), M["steel"], seg=8)
    if CEIL_TYPE != "open":
        for y in (-1.9, 0.0, 1.9):
            for x in (-3.0, -1.0, 1.0, 3.0):
                if AHU_X0 - 0.05 < x < AHU_X1 + 0.05 and AHU_Y0 < y < AHU_Y1:
                    continue
                hang.cyl(0.003, SLAB_Z - PZ - 0.03, (x, y, (SLAB_Z + PZ + 0.03) / 2), M["steel"], seg=6)
    hang.build(fade_explode=1)

    if HVAC["sprinkler"]:
        spr = Part("sprinkler", origin=(0, SPR_Y, 3.86))
        spr.cyl(0.03, SX1 - SX0, (0, SPR_Y, 3.86), M["sprinkler"], axis="x", seg=16)
        for x in (snap_x(-0.3), snap_x(1.6), snap_x(2.6)):
            head_z = LOW if CEIL_TYPE != "open" else 3.86 - 0.35
            spr.cyl(0.014, 3.86 - PZ - 0.05 if CEIL_TYPE != "open" else 0.33, (x, SPR_Y, (3.86 + max(PZ + 0.05, head_z + 0.02)) / 2), M["sprinkler"], seg=10)
            if CEIL_TYPE != "open":
                spr.cyl(0.008, PZ + 0.05 - LOW, (x, SPR_Y, (PZ + 0.05 + LOW) / 2), M["chrome"], seg=10)
            spr.cyl(0.024, 0.008, (x, SPR_Y, head_z - 0.012), M["mug"], seg=16)
        spr.build(explode_sys=[0.0, 0.0, 1.9], delay=0.0)

    # air handling unit, in parts that come apart for the exploded views
    cxa, cya, cza = (AHU_X0 + AHU_X1) / 2, (AHU_Y0 + AHU_Y1) / 2, (AHU_Z0 + AHU_Z1) / 2
    W_, D_, H_ = AHU_X1 - AHU_X0, AHU_Y1 - AHU_Y0, AHU_Z1 - AHU_Z0
    th = 0.03
    DOOR_Z0, DOOR_Z1 = AHU_Z0 + 0.05, AHU_Z1 - 0.16
    base = Part("ahu_base", origin=(cxa, cya, cza))
    base.box((W_, D_, th), (cxa, cya, AHU_Z0 + th / 2), M["ahu"])
    base.box((W_ - 0.07, D_ - 0.07, 0.004), (cxa, cya, AHU_Z0 + 0.032), M["ahu_inner"])
    base.box((W_, th, AHU_Z1 - DOOR_Z1), (cxa, AHU_Y0 + th / 2, (AHU_Z1 + DOOR_Z1) / 2), M["ahu"])
    base.box((W_, th, DOOR_Z0 - AHU_Z0), (cxa, AHU_Y0 + th / 2, (AHU_Z0 + DOOR_Z0) / 2), M["ahu"])
    base.box((0.05, th, DOOR_Z1 - DOOR_Z0), (AHU_X0 + 0.025, AHU_Y0 + th / 2, (DOOR_Z0 + DOOR_Z1) / 2), M["ahu"])
    base.box((0.05, th, DOOR_Z1 - DOOR_Z0), (AHU_X1 - 0.025, AHU_Y0 + th / 2, (DOOR_Z0 + DOOR_Z1) / 2), M["ahu"])
    base.box((W_ - 0.02, 0.004, 0.012), (cxa, AHU_Y0 - 0.001, AHU_Z1 - 0.03), M["accent"])
    base.box((0.03, th, H_ - 0.04), (cxa, AHU_Y0 + D_ * 0.42, cza), M["ahu_inner"])
    base.build(bevel=0.004, explode_sys=SYS_AHU, explode_ahu=[0.0, 0.0, 0.0], delay=0.0)

    top = Part("ahu_top", origin=(cxa, cya, AHU_Z1))
    top.box((W_, D_, th), (cxa, cya, AHU_Z1 - th / 2), M["ahu"])
    for yy in (AHU_Y0 + 0.62, AHU_Y0 + 1.25, AHU_Y0 + 1.88):
        top.box((W_ + 0.004, 0.012, 0.006), (cxa, yy, AHU_Z1 + 0.001), M["accent"])
    for x in (AHU_X0 + 0.1, AHU_X1 - 0.1):
        for y in (AHU_Y0 + 0.15, AHU_Y1 - 0.15):
            top.cyl(0.03, 0.05, (x, y, AHU_Z1 + 0.025), M["black"], seg=16)
    top.build(bevel=0.004, explode_sys=SYS_AHU, explode_ahu=[0.0, 0.0, 0.65], delay=0.0)

    side = Part("ahu_side", origin=(AHU_X0, cya, cza))
    side.box((th, D_, H_), (AHU_X0 + th / 2, cya, cza), M["ahu"])
    side.build(bevel=0.004, explode_sys=SYS_AHU, explode_ahu=[-0.65, 0.0, 0.0], delay=0.1)

    outlet = Part("ahu_outlet", origin=(AHU_X1, cya, cza))
    outlet.box((th, D_, H_), (AHU_X1 - th / 2, cya, cza), M["ahu"])
    outlet.box((0.06, SUP_W + 0.04, SUP_H + 0.04), (AHU_X1 + 0.02, SUPPLY_Y, MAIN_Z), M["black"])
    outlet.box((0.06, RET_W + 0.04, RET_H + 0.04), (AHU_X1 + 0.02, RETURN_Y, MAIN_Z), M["black"])
    outlet.build(bevel=0.004, explode_sys=SYS_AHU, explode_ahu=[0.0, 0.0, 0.0], delay=0.0)

    end = Part("ahu_end", origin=(cxa, AHU_Y1, cza))
    end.box((W_, th, H_), (cxa, AHU_Y1 - th / 2, cza), M["ahu"])
    end.build(bevel=0.004, explode_sys=SYS_AHU, explode_ahu=[0.0, 0.55, 0.0], delay=0.15)

    coil = Part("ahu_coil", origin=(cxa, AHU_Y0 + 0.77, cza))
    for i in range(26):
        coil.box((W_ - 0.12, 0.004, H_ - 0.12), (cxa, AHU_Y0 + 0.62 + i * 0.012, cza), M["fins"])
    for z in (cza - 0.18, cza + 0.18):
        coil.cyl(0.012, W_ - 0.1, (cxa, AHU_Y0 + 0.6, z), M["copper"], axis="x", seg=12)
    coil.build(explode_sys=SYS_AHU, explode_ahu=[0.0, -0.1, 0.5], delay=0.25)

    filt = Part("ahu_filter", origin=(cxa, AHU_Y0 + 1.6, cza))
    for i in range(14):
        filt.box((W_ - 0.14, 0.004, H_ - 0.14), (cxa, AHU_Y0 + 1.5 + i * 0.014, cza), M["filter"], rot=Matrix.Rotation((-1) ** i * 0.12, 4, "X"))
    filt.box((W_ - 0.1, 0.24, 0.02), (cxa, AHU_Y0 + 1.6, AHU_Z0 + 0.07), M["steel"])
    filt.box((W_ - 0.1, 0.24, 0.02), (cxa, AHU_Y0 + 1.6, AHU_Z1 - 0.07), M["steel"])
    filt.build(explode_sys=SYS_AHU, explode_ahu=[0.0, 0.2, 0.85], delay=0.4)

    HINGE = (AHU_X0 + 0.05, AHU_Y0 + 0.002, (DOOR_Z0 + DOOR_Z1) / 2)
    door = Part("ahu_door", origin=HINGE)
    dw = W_ - 0.1
    door.box((dw, 0.026, DOOR_Z1 - DOOR_Z0 - 0.006), (HINGE[0] + dw / 2, HINGE[1] + 0.012, HINGE[2]), M["ahu"])
    for dz in (-0.12, 0.12):
        door.box((0.02, 0.03, 0.1), (HINGE[0] + dw - 0.06, HINGE[1] - 0.012, HINGE[2] + dz), M["accent"])
        door.cyl(0.012, 0.03, (HINGE[0] + 0.006, HINGE[1] - 0.004, HINGE[2] + dz * 1.4), M["accent"], seg=10)
    door.build(bevel=0.003, explode_sys=SYS_AHU, explode_ahu=[0.0, -0.55, 0.0], delay=0.05)

    FAN_AXIS = (cxa, AHU_Y0 + 0.3, cza)
    fan = Part("ahu_fan", origin=FAN_AXIS)
    fx, fy, fz = FAN_AXIS
    for dy in (-0.11, 0.11):
        fan.cyl(0.2, 0.012, (fx, fy + dy, fz), M["steel"], axis="y", seg=40)
    for i in range(18):
        a = 2 * math.pi * i / 18
        fan.box((0.09, 0.22, 0.008), (fx + math.cos(a) * 0.16, fy, fz + math.sin(a) * 0.16), M["steel"], rot=Matrix.Rotation(-a + 0.6, 4, "Y"))
    fan.cyl(0.05, 0.26, (fx, fy, fz), M["black"], axis="y", seg=24)
    fan.build(explode_sys=SYS_AHU, explode_ahu=[0.0, -0.85, 0.0], delay=0.3)

    motor = Part("ahu_motor", origin=(fx, fy + 0.27, fz))
    motor.cyl(0.09, 0.22, (fx, fy + 0.27, fz), M["accent"], axis="y", seg=28)
    for i in range(8):
        a = 2 * math.pi * i / 8
        motor.box((0.006, 0.2, 0.02), (fx + math.cos(a) * 0.095, fy + 0.27, fz + math.sin(a) * 0.095), M["accent"], rot=Matrix.Rotation(-a, 4, "Y"))
    motor.box((0.2, 0.22, 0.03), (fx, fy + 0.27, AHU_Z0 + 0.045), M["black"])
    motor.build(bevel=0.003, explode_sys=SYS_AHU, explode_ahu=[0.4, -0.6, 0.0], delay=0.35)

# ceiling tiles (and a few LED panels) in the cells the diffusers left free
if CEIL_TYPE == "tiles":
    panels = Part("led_panels")
    nx, ny = int(round((SX1 - SX0) / CELL)), int(round((SY1 - SY0) / CELL))
    for i in range(nx):
        for j in range(ny):
            if (i, j) in taken:
                continue
            x, y = SX0 + CELL / 2 + CELL * i, SY0 + CELL / 2 + CELL * j
            if (i % 3 == 1) and (j % 3 == 1):
                panels.box((0.59, 0.59, 0.02), (x, y, LOW + 0.01), M["white_metal"])
                panels.box((0.555, 0.555, 0.004), (x, y, LOW - 0.001), M["panel_led"])
                continue
            t = Part(f"tile_{i:02d}_{j:02d}", origin=(x, y, LOW + 0.012))
            t.box((0.582, 0.582, 0.014), (x, y, LOW + 0.012), M["plaster"], uv=uvs("plaster", "x"))
            t.build(parent=reveal)
    panels.build()

slab = Part("slab")
slab.box((RX1 - RX0 + 0.3, RY1 - RY0 + 0.3, 0.15), ((RX0 + RX1) / 2, (RY0 + RY1) / 2, SLAB_Z + 0.075), M["slab"])
# walls of the ceiling void, so no sky shows above the walls through an open or x-rayed ceiling; they fade with the slab
UP_H, UP_Z = SLAB_Z - CEIL - 0.05, (CEIL + 0.05 + SLAB_Z) / 2
slab.box((RX1 - RX0 + 0.3, 0.15, UP_H), ((RX0 + RX1) / 2, RY1 + 0.075, UP_Z), M["slab"])
for x in (RX0 - 0.075, RX1 + 0.075):
    slab.box((0.15, RY1 - RY0, UP_H), (x, (RY0 + RY1) / 2, UP_Z), M["slab"])
slab.build()

# ---------------------------------------------------------------- furniture
furniture = empty("furniture")


def task_chair(p, x, y, f):
    """Office task chair facing +x*f: five-star base on twin-wheel casters, fabric seat and back."""
    for i in range(5):
        a = 2 * math.pi * i / 5 + 0.3
        c, s = math.cos(a), math.sin(a)
        p.tube([(x + c * 0.04, y + s * 0.04, 0.105), (x + c * 0.31, y + s * 0.31, 0.072)], 0.016, M["plastic"], seg=8)
        wx, wy = x + c * 0.31, y + s * 0.31
        p.box((0.025, 0.025, 0.035), (wx, wy, 0.06), M["plastic"])
        for side in (-1, 1):
            p.cyl(0.024, 0.012, (wx - s * 0.012 * side, wy + c * 0.012 * side, 0.026), M["plastic"], seg=16, direction=(-s, c, 0))
    p.cyl(0.045, 0.05, (x, y, 0.105), M["plastic"], seg=20)
    p.cyl(0.032, 0.16, (x, y, 0.2), M["plastic"], seg=16, r2=0.026)
    p.cyl(0.021, 0.14, (x, y, 0.34), M["chrome"], seg=16)
    p.rbox((0.22, 0.2, 0.05), (x, y, 0.405), M["plastic"], 0.01)
    p.rbox((0.5, 0.49, 0.075), (x, y, 0.465), M["fabric"], 0.03, uv=uvs("fabric"))
    tilt = Matrix.Rotation(-f * 0.17, 4, "Y")
    bx = x - f * 0.27
    p.rbox((0.035, 0.48, 0.57), (bx - f * 0.012, y, 0.84), M["plastic"], 0.02, rot=tilt)
    p.rbox((0.04, 0.45, 0.53), (bx + f * 0.01, y, 0.84), M["fabric"], 0.02, rot=tilt, uv=uvs("fabric"))
    p.rbox((0.05, 0.07, 0.3), (x - f * 0.24, y, 0.56), M["plastic"], 0.015, rot=tilt)
    for side in (-1, 1):
        ys = y + side * 0.265
        p.tube([(x - f * 0.06, ys, 0.44), (x - f * 0.06, ys, 0.6), (x + f * 0.02, ys, 0.655), (x + f * 0.12, ys, 0.655)], 0.012, M["plastic"], seg=8)
        p.rbox((0.25, 0.07, 0.028), (x + f * 0.03, ys, 0.675), M["plastic"], 0.012)


def meeting_chair(p, x, y, yaw):
    c, s = math.cos(yaw), math.sin(yaw)
    for lx, ly in ((0.2, 0.2), (0.2, -0.2), (-0.2, 0.2), (-0.2, -0.2)):
        px, py = x + c * lx - s * ly, y + s * lx + c * ly
        p.tube([(px, py, 0.0), (px * 0.98 + x * 0.02, py * 0.98 + y * 0.02, 0.44)], 0.012, M["black"], seg=8)
    p.rbox((0.46, 0.46, 0.07), (x, y, 0.47), M["fabric_light"], 0.03, rot=Matrix.Rotation(yaw, 4, "Z"), uv=uvs("fabric_light"))
    p.rbox((0.06, 0.44, 0.38), (x - c * 0.22, y - s * 0.22, 0.73), M["fabric_light"], 0.025,
           rot=Matrix.Rotation(yaw, 4, "Z") @ Matrix.Rotation(-0.15, 4, "Y"), uv=uvs("fabric_light"))


def desk_things(p, x, y, side):
    k = int(rng.integers(0, 4))
    if k == 0:
        p.cyl(0.04, 0.095, (x, y - 0.38, 0.8), M["mug"], seg=20)
        p.tube([(x, y - 0.42, 0.82), (x, y - 0.45, 0.8), (x, y - 0.42, 0.78)], 0.007, M["mug"], seg=8)
    elif k == 1:
        p.rbox((0.15, 0.21, 0.014), (x + side * 0.02, y - 0.4, 0.758), M["book4"], 0.004)
        p.cyl(0.004, 0.14, (x + side * 0.02, y - 0.4, 0.768), M["black"], seg=6, axis="y")
    elif k == 2:
        p.cyl(0.045, 0.08, (x, y + 0.42, 0.79), M["pot"], seg=18)
        for j in range(8):
            p.leaf((x, y + 0.42, 0.83), rng.uniform(0.07, 0.11), 0.055, rng.uniform(0, 6.3), rng.uniform(-1.1, -0.4), M["pothos"])
    p.rbox((0.075, 0.155, 0.008), (x + side * 0.08, y - 0.22, 0.754), M["plastic"], 0.006)


def bench(name, cx, y0, y1, n):
    """Two rows of desks facing each other across a divider at x = cx."""
    p = Part(name)
    L = (y1 - y0) / n
    for side in (-1, 1):
        xc = cx + side * 0.36
        p.box((0.72, y1 - y0, 0.025), (xc, (y0 + y1) / 2, 0.7375), M["white"])
        for ye in (y0 + 0.02, y1 - 0.02):
            p.box((0.7, 0.04, 0.725), (xc, ye, 0.3625), M["white"])
        p.box((0.02, y1 - y0 - 0.1, 0.38), (cx + side * 0.03, (y0 + y1) / 2, 0.5), M["white"])
        for i in range(n):
            ym = y0 + L * (i + 0.5)
            ped_y = y0 + L * i + 0.32
            p.box((0.42, 0.5, 0.6), (cx + side * 0.48, ped_y, 0.3), M["white"])
            for h, z in ((0.14, 0.52), (0.14, 0.37), (0.26, 0.15)):
                p.box((0.004, 0.48, h - 0.006), (cx + side * 0.692, ped_y, z), M["white"])
                p.box((0.012, 0.12, 0.012), (cx + side * 0.7, ped_y, z + h / 2 - 0.03), M["black"])
            if i:
                p.rbox((0.62, 0.03, 0.3), (cx + side * 0.33, y0 + L * i, 0.9), M["white_panel"], 0.012)
            sx = cx + side * 0.13
            p.rbox((0.03, 0.63, 0.37), (sx, ym, 1.08), M["plastic"], 0.006)
            sf = sx + side * 0.0155
            p.quad([(sf, ym - 0.3, 0.915), (sf, ym + 0.3, 0.915), (sf, ym + 0.3, 1.245), (sf, ym - 0.3, 1.245)][:: -side],
                   M["screen"], uv=((0, 0), (1, 0), (1, 1), (0, 1))[:: -side])
            p.rbox((0.03, 0.07, 0.22), (sx - side * 0.04, ym, 0.86), M["plastic"], 0.008)
            p.rbox((0.2, 0.24, 0.012), (sx - side * 0.02, ym, 0.756), M["plastic"], 0.005)
            kx = cx + side * 0.45
            p.rbox((0.13, 0.43, 0.014), (kx, ym, 0.757), M["grey"], 0.004)
            p.quad([(kx - 0.062, ym - 0.21, 0.7645), (kx + 0.062, ym - 0.21, 0.7645), (kx + 0.062, ym + 0.21, 0.7645), (kx - 0.062, ym + 0.21, 0.7645)],
                   M["keyboard"], uv=((0, 1), (0, 0), (1, 0), (1, 1)) if side < 0 else ((1, 0), (1, 1), (0, 1), (0, 0)))
            p.rbox((0.22, 0.26, 0.004), (kx, ym + 0.33, 0.752), M["plastic"], 0.003)
            p.ball(0.03, (kx, ym + 0.33, 0.762), M["grey"], scale=(1.1, 0.7, 0.5))
            if FEAT["desk_items"]:
                desk_things(p, cx + side * 0.5, ym, side)
            task_chair(p, cx + side * 1.0, ym + rng.uniform(-0.06, 0.06), -side)
    p.rbox((0.035, y1 - y0, 0.4), (cx, (y0 + y1) / 2, 0.95), M["white_panel"], 0.015)
    p.build(parent=furniture, bevel=0.003)


A_CX, A_Y0, A_Y1 = -1.2, -2.1, 2.1
B_CX, B_Y0, B_Y1 = 1.75, -2.0, 0.8
bench("desks_a", A_CX, A_Y0, A_Y1, 3)
bench("desks_b", B_CX, B_Y0, B_Y1, 2)

if FEAT["planter"]:
    pl = Part("planter")
    PY = A_Y0 - 0.4
    pl.box((1.0, 0.48, 0.78), (A_CX, PY, 0.39), M["wood"], uv=uvs("wood", "x"))
    for sx in (-0.5, 0.5):
        pl.cyl(0.24, 0.78, (A_CX + sx, PY, 0.39), M["wood"], seg=28, uv=uvs("wood", "z"))
    pl.box((1.0, 0.52, 0.035), (A_CX, PY, 0.797), M["white"])
    for sx in (-0.5, 0.5):
        pl.cyl(0.26, 0.035, (A_CX + sx, PY, 0.797), M["white"], seg=28)
    pl.box((1.3, 0.4, 0.02), (A_CX, PY, 0.82), M["soil"])
    for i in range(170):
        a = rng.uniform(0, 2 * math.pi)
        d = math.sqrt(rng.random())
        pl.leaf((A_CX + math.cos(a) * d * 0.68, PY + math.sin(a) * d * 0.2, 0.83 + (1 - d) * rng.uniform(0.05, 0.3)),
                rng.uniform(0.09, 0.14), rng.uniform(0.07, 0.1), rng.uniform(0, 2 * math.pi), rng.uniform(-1.2, -0.3), M["pothos"])
    for k in range(12):
        x = A_CX + rng.uniform(-0.7, 0.7)
        yb = PY - 0.25 if k % 3 else PY + 0.25
        pts = [(x + rng.uniform(-0.02, 0.02), yb + (-1 if yb < PY else 1) * j * 0.012, 0.82 - j * 0.07) for j in range(int(rng.integers(6, 11)))]
        pl.tube(pts, 0.004, M["pothos"], seg=4)
        for pt in pts[1:]:
            pl.leaf(pt, rng.uniform(0.07, 0.1), 0.065, rng.uniform(-0.6, 0.6) + (math.pi if yb > PY else 0), rng.uniform(0.3, 1.2), M["pothos"])
    pl.build(parent=furniture)

if FEAT["fig_tree"]:
    fig = Part("fig_tree")
    TX, TY = -4.55, -3.75
    fig.cyl(0.24, 0.48, (TX, TY, 0.24), M["pot"], seg=32, r2=0.2)
    fig.cyl(0.22, 0.02, (TX, TY, 0.47), M["soil"], seg=32)
    trunk = [(TX + 0.02 * math.sin(t * 3), TY + 0.03 * math.cos(t * 2), 0.48 + t * 1.25) for t in np.linspace(0, 1, 8)]
    fig.tube(trunk, 0.022, M["soil"], seg=8)
    for i in range(46):
        t = rng.uniform(0.35, 1.0)
        cxl, cyl_, czl = trunk[min(int(t * 7), 7)]
        a = rng.uniform(0, 2 * math.pi)
        r = 0.06 + (1 - t) * 0.2
        fig.leaf((cxl + math.cos(a) * r, cyl_ + math.sin(a) * r, czl + rng.uniform(-0.05, 0.1)), rng.uniform(0.22, 0.32), rng.uniform(0.15, 0.2),
                 a - math.pi / 2, rng.uniform(-0.2, 0.6), M["fig"], fold=0.18)
    fig.build(parent=furniture)

TCX, TCY = 4.25, 2.3
if FEAT["meeting_room"]:
    MR_X0, MR_Y0 = 3.3, 0.9
    mr = Part("meeting_room")
    mglass = Part("meeting_glass")
    for (ax, a0, a1, fixed) in (("y", MR_Y0, RY1, MR_X0), ("x", MR_X0, RX1, MR_Y0)):
        L = a1 - a0
        c = (a0 + a1) / 2
        for z in (0.04, CEIL - 0.04):
            mr.box((0.05, L, 0.08) if ax == "y" else (L, 0.05, 0.08), (fixed, c, z) if ax == "y" else (c, fixed, z), M["frame"])
        for a in np.linspace(a0, a1, 4):
            mr.box((0.05, 0.05, CEIL), (fixed, a, CEIL / 2) if ax == "y" else (a, fixed, CEIL / 2), M["frame"])
        mglass.box((0.01, L - 0.05, CEIL - 0.16) if ax == "y" else (L - 0.05, 0.01, CEIL - 0.16),
                   (fixed, c, CEIL / 2) if ax == "y" else (c, fixed, CEIL / 2), M["glass"])
    mr.box((0.03, 0.03, 0.3), (MR_X0 + 0.95, MR_Y0 - 0.03, 1.05), M["chrome"])
    mr.box((0.012, 0.6, 0.012), (MR_X0 + 0.2, (MR_Y0 + RY1) / 2, 1.2), M["white_panel"])
    mr.cyl(0.62, 0.03, (TCX, TCY, 0.735), M["white"], seg=48)
    mr.cyl(0.05, 0.7, (TCX, TCY, 0.37), M["black"], seg=20)
    mr.cyl(0.28, 0.02, (TCX, TCY, 0.01), M["black"], seg=32)
    for i in range(4):
        a = math.pi / 4 + i * math.pi / 2
        meeting_chair(mr, TCX + math.cos(a) * 0.88, TCY + math.sin(a) * 0.88, a + math.pi)
    mr.box((0.03, 1.45, 0.84), (RX1 - 0.02, TCY, 1.45), M["plastic"])
    mr.box((0.004, 1.4, 0.79), (RX1 - 0.036, TCY, 1.45), M["tv"])
    mr.build(parent=furniture, bevel=0.002)
    mglass.build()

if FEAT["pendant_ring"] or FEAT["pendant_linear"]:
    pend = Part("pendants")
    top_in_zone = SLAB_Z if CEIL_TYPE == "open" else LOW
    rings = []
    if FEAT["pendant_ring"]:
        rings.append((A_CX, 0.0, 2.22, 0.62, 1.7, 0.03, top_in_zone))
        if FEAT["meeting_room"]:
            rings.append((TCX, TCY, 2.15, 0.45, 0.45, 0.02, CEIL))
    for (cxr, cyr, z, ax, ay, rt, ztop) in rings:
        ring = [(cxr + ax * math.cos(t), cyr + ay * math.sin(t), z) for t in np.linspace(0, 2 * math.pi, 80, endpoint=False)]
        pend.tube(ring, rt, M["accent"], closed=True, seg=14)
        glow = [(cxr + (ax - 0.02) * math.cos(t), cyr + (ay - 0.02) * math.sin(t), z - 0.028) for t in np.linspace(0, 2 * math.pi, 80, endpoint=False)]
        pend.tube(glow, rt * 0.4, M["warm"], closed=True, seg=8)
        for t in (0.6, 2.54, 3.74, 5.68):
            p0 = Vector((cxr + ax * math.cos(t), cyr + ay * math.sin(t), z + rt))
            pend.tube([p0, p0 + Vector((0, 0, ztop - p0.z))], 0.003, M["black"], seg=5)
    if FEAT["pendant_linear"]:
        BY = (B_Y0 + B_Y1) / 2
        pend.box((0.07, 2.2, 0.05), (B_CX, BY, 2.27), M["accent"])
        pend.box((0.045, 2.16, 0.006), (B_CX, BY, 2.243), M["warm"])
        for y in (BY - 0.9, BY + 0.9):
            p0 = Vector((B_CX, y, 2.295))
            pend.tube([p0, p0 + Vector((0, 0, top_in_zone - 2.295))], 0.003, M["black"], seg=5)
    pend.build(parent=furniture)

# ---------------------------------------------------------------- export
os.makedirs(os.path.dirname(os.path.abspath(OUT_GLB)), exist_ok=True)
bpy.ops.object.select_all(action="DESELECT")
bpy.ops.export_scene.gltf(
    filepath=OUT_GLB,
    export_format="GLB",
    export_apply=True,
    export_yup=True,
    export_extras=True,
    export_cameras=False,
    export_lights=False,
    export_image_format="WEBP",
    export_image_quality=80,
    export_draco_mesh_compression_enable=True,
    export_draco_mesh_compression_level=7,
    export_draco_position_quantization=14,
    export_draco_texcoord_quantization=12,
)
print("EXPORTED", OUT_GLB, os.path.getsize(OUT_GLB))

# ---------------------------------------------------------------- preview renders (EEVEE, for a quick look only)
if DO_RENDER:
    world = bpy.data.worlds.new("w")
    scene.world = world
    try:
        world.use_nodes = True
    except Exception:
        pass
    bg = world.node_tree.nodes.get("Background")
    bg.inputs["Color"].default_value = (*srgb("dfe6ee"), 1)
    bg.inputs["Strength"].default_value = 0.6

    def light(name, kind, loc, rot, energy, size=3, color=(1, 1, 1)):
        ld = bpy.data.lights.new(name, kind)
        ld.energy = energy
        ld.color = color
        if kind == "AREA":
            ld.size = size
        ob = bpy.data.objects.new(name, ld)
        ob.location, ob.rotation_euler = loc, rot
        root.objects.link(ob)

    light("sun", "SUN", (0, 0, 8), (math.radians(60), 0, math.radians(-110)), 4.0, color=(1, 0.95, 0.88))
    light("room", "AREA", (0, -1, 2.6), (0, 0, 0), 700, 6, (1, 0.93, 0.85))
    light("window", "AREA", (-4.9, -0.5, 1.5), (0, math.radians(-90), 0), 900, 6, (0.92, 0.95, 1.0))

    cam_data = bpy.data.cameras.new("cam")
    cam = bpy.data.objects.new("cam", cam_data)
    root.objects.link(cam)
    scene.camera = cam
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x, scene.render.resolution_y = 1600, 900
    scene.view_settings.view_transform = "AgX"

    def shoot(name, loc, target, lens=30, hide=()):
        cam.location = loc
        cam.rotation_euler = (Vector(target) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
        cam_data.lens = lens
        for ob in bpy.data.objects:
            ob.hide_render = bool(ob.name in hide or (ob.parent and ob.parent.name in hide))
        scene.render.filepath = os.path.join(RENDER_DIR, name)
        bpy.ops.render.render(write_still=True)
        print("RENDERED", name)

    os.makedirs(RENDER_DIR, exist_ok=True)
    shoot("office.png", (1.4, -6.2, 1.55), (-0.9, 1.0, 1.95), lens=24)
    shoot("xray.png", (2.2, -5.2, 1.3), (0.4, -0.5, 3.0), lens=24, hide=("ceiling_reveal",))
    shoot("plenum.png", (6.5, -8.5, 9.5), (-0.3, 0, 3.0), lens=30, hide=("slab",))
