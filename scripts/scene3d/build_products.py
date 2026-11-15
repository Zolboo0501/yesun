"""Air duct products for the home page's product section: seven fittings joined into one run under a dark
exposed soffit, after the client's reference photo (dark grey painted ducts and a square diffuser).

  /Applications/Blender.app/Contents/MacOS/Blender -b --factory-startup --python scripts/scene3d/build_products.py -- \\
    public/models/products/ducts.glb RENDER_DIR [render]

Blender is Z-up; glTF turns it Y-up, so three.js sees (x, z, -y). components/home/ProductsScene.tsx reads one node per
product, product_<id>, whose extras.focus [x, y, z] (Blender axes) is how far it slides out of the run while its step
is on screen. Each product's origin is its centre, so it turns about itself.
"""
import bpy, bmesh, math, os, sys, urllib.request
import numpy as np
from mathutils import Matrix, Vector

argv = sys.argv[sys.argv.index("--") + 1:]
OUT_GLB, RENDER_DIR = argv[0], argv[1]
DO_RENDER = len(argv) > 2 and argv[2] == "render"
CACHE = os.path.expanduser("~/.cache/interior-3d-hero/polyhaven")

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
root = scene.collection

# Sampled from the reference photo with the interior-3d-hero skill's palette.py.
C = {
    "duct": "5c6068",
    "flange": "474b52",
    "dark": "25282d",
    "steel": "3a3d43",
    "insulation": "c4a259",
    "inner": "8e939b",
}


# ---------------------------------------------------------------- materials
def hexc(h):
    return np.array([int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)])


def srgb(h):
    return tuple(float(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4) for x in hexc(h))


def polyhaven(asset, kind):
    name = f"{asset}_{kind}_1k.jpg"
    path = os.path.join(CACHE, name)
    if not os.path.exists(path):
        os.makedirs(CACHE, exist_ok=True)
        urllib.request.urlretrieve(f"https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/{asset}/{name}", path)
    return path


def image(path, color=True, size=None, mul=None):
    img = bpy.data.images.load(path, check_existing=False)
    if not color:
        img.colorspace_settings.name = "Non-Color"
    if size and img.size[0] != size:
        img.scale(size, size)
    if mul is not None:
        px = np.empty(len(img.pixels), dtype=np.float32)
        img.pixels.foreach_get(px)
        px = px.reshape(-1, 4)
        px[:, :3] = np.clip(px[:, :3] * np.asarray(mul), 0, 1)
        img.pixels.foreach_set(px.ravel())
    img.pack()
    return img


def material(name, color=None, metal=0.0, rough=0.5, diff=None, nor=None, normal_strength=1.0):
    m = bpy.data.materials.new(name)
    try:
        m.use_nodes = True
    except Exception:
        pass
    nt = m.node_tree
    b = nt.nodes.get("Principled BSDF")
    if diff is not None:
        t = nt.nodes.new("ShaderNodeTexImage")
        t.image = diff
        nt.links.new(t.outputs["Color"], b.inputs["Base Color"])
    else:
        b.inputs["Base Color"].default_value = (*srgb(color), 1)
    if nor is not None:
        tn = nt.nodes.new("ShaderNodeTexImage")
        tn.image = nor
        nm = nt.nodes.new("ShaderNodeNormalMap")
        nm.inputs["Strength"].default_value = normal_strength
        nt.links.new(tn.outputs["Color"], nm.inputs["Color"])
        nt.links.new(nm.outputs["Normal"], b.inputs["Normal"])
    b.inputs["Metallic"].default_value = metal
    b.inputs["Roughness"].default_value = rough
    return m


paint_nor = image(polyhaven("green_metal_rust", "nor_gl"), color=False, size=512)
concrete = polyhaven("concrete_floor_worn_001", "diff")
concrete_nor = image(polyhaven("concrete_floor_worn_001", "nor_gl"), color=False, size=512)
M = {
    "duct": material("duct_paint", C["duct"], 0.35, 0.45, nor=paint_nor, normal_strength=0.3),
    "flange": material("duct_flange", C["flange"], 0.45, 0.4, nor=paint_nor, normal_strength=0.3),
    "dark": material("diffuser", C["dark"], 0.3, 0.45),
    "steel": material("steel", C["steel"], 0.8, 0.35),
    "insulation": material("insulation", C["insulation"], 0.0, 0.95),
    "inner": material("inner_liner", C["inner"], 0.7, 0.3),
    "foil": material("aluminium_foil", "a9afb7", 0.85, 0.35),
    "soffit": material("soffit", diff=image(concrete, mul=[0.62, 0.66, 0.74]), rough=0.92, nor=concrete_nor, normal_strength=0.6),
    "beam": material("beam", diff=image(concrete, mul=[0.7, 0.74, 0.82]), rough=0.9, nor=concrete_nor, normal_strength=0.6),
}


# ---------------------------------------------------------------- geometry
Z = Vector((0, 0, 1))


def frame(P, t, side=None):
    """Section frame at P: side is horizontal unless given (vertical paths need one), up is tilted with the path."""
    t = Vector(t).normalized()
    if side is None:
        side = t.cross(Z) if t.cross(Z).length > 1e-6 else Vector((1, 0, 0))
    side = Vector(side)
    side = (side - t * side.dot(t)).normalized()
    return Vector(P), side, side.cross(t), t


def frame_rot(side, up, t):
    """Box axes: local x along side, y along the path, z along up."""
    return Matrix((side, t, up)).transposed().to_4x4()


def rrect(w, h, r=0.012, corner=4, short=4, long=8):
    """Rounded rectangle, counter-clockwise in (side, up), with points along the sides for lofting."""
    pts = []
    corners = ((w / 2 - r, -h / 2 + r, -90), (w / 2 - r, h / 2 - r, 0), (-w / 2 + r, h / 2 - r, 90), (-w / 2 + r, -h / 2 + r, 180))
    for k, (cx, cy, a0) in enumerate(corners):
        for j in range(corner + 1):
            a = math.radians(a0 + 90 * j / corner)
            pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
        nx, ny, _ = corners[(k + 1) % 4]
        a_end = math.radians(a0 + 90)
        p0 = (cx + r * math.cos(a_end), cy + r * math.sin(a_end))
        p1 = (nx + r * math.cos(a_end), ny + r * math.sin(a_end))
        steps = short if k % 2 == 0 else long
        for j in range(1, steps):
            pts.append((p0[0] + (p1[0] - p0[0]) * j / steps, p0[1] + (p1[1] - p0[1]) * j / steps))
    return pts


def circle(r, n=48):
    return [(r * math.cos(2 * math.pi * k / n), r * math.sin(2 * math.pi * k / n)) for k in range(n)]


def oval(w, h, arc=12, flat=6):
    """Flat oval: semicircular sides, flat top and bottom, counter-clockwise in (side, up)."""
    rr, cx = h / 2, w / 2 - h / 2
    pts = [(cx + rr * math.cos(math.radians(-90 + 180 * k / arc)), rr * math.sin(math.radians(-90 + 180 * k / arc))) for k in range(arc + 1)]
    pts += [(cx - 2 * cx * k / flat, rr) for k in range(1, flat)]
    pts += [(-cx + rr * math.cos(math.radians(90 + 180 * k / arc)), rr * math.sin(math.radians(90 + 180 * k / arc))) for k in range(arc + 1)]
    pts += [(-cx + 2 * cx * k / flat, -rr) for k in range(1, flat)]
    return pts


class Part:
    """Accumulates geometry for one object; each material gets its own slot."""

    def __init__(self, name, origin=(0, 0, 0)):
        self.name, self.origin = name, Vector(origin)
        self.bm = bmesh.new()
        self.layer = self.bm.loops.layers.uv.verify()
        self.mats = []

    def _finish(self, before, mat, smooth=False, uv=None):
        if mat not in self.mats:
            self.mats.append(mat)
        faces = [f for f in self.bm.faces if f not in before]
        for f in faces:
            f.material_index = self.mats.index(mat)
            f.smooth = smooth
            f.normal_update()
        if uv:  # box mapping in world metres
            for f in faces:
                N = max(range(3), key=lambda a: abs(f.normal[a]))
                ua, va = [a for a in range(3) if a != N]
                for loop in f.loops:
                    p = loop.vert.co + self.origin
                    loop[self.layer].uv = (p[ua] / uv, p[va] / uv)
        return faces

    def box(self, size, loc, mat, rot=None, uv=None):
        before = set(self.bm.faces)
        mtx = Matrix.Translation(Vector(loc) - self.origin)
        if rot is not None:
            mtx = mtx @ rot
        bmesh.ops.create_cube(self.bm, size=1.0, matrix=mtx @ Matrix.Diagonal((*size, 1)))
        return self._finish(before, mat, uv=uv)

    def cyl(self, r, length, loc, mat, direction=(0, 0, 1), seg=12):
        before = set(self.bm.faces)
        rot = Vector((0, 0, 1)).rotation_difference(Vector(direction)).to_matrix().to_4x4()
        bmesh.ops.create_cone(self.bm, cap_ends=True, cap_tris=False, segments=seg, radius1=r, radius2=r, depth=length,
                              matrix=Matrix.Translation(Vector(loc) - self.origin) @ rot)
        return self._finish(before, mat, smooth=True)

    def tube(self, pts, r, mat, closed=False, seg=10):
        """A circle swept along a polyline: seams, beads, bands, rods."""
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

    def ring(self, P, t, r, wire, mat, seg=48):
        """A bead or band around a round duct."""
        P, t = Vector(P), Vector(t).normalized()
        _, side, up, _ = frame(P, t)
        self.tube([P + r * (math.cos(2 * math.pi * k / seg) * side + math.sin(2 * math.pi * k / seg) * up) for k in range(seg)], wire, mat, closed=True, seg=8)

    def helix(self, start, direction, length, r, mat, pitch=0.13, wire=0.0035):
        """The spiral lock seam of a round duct."""
        d = Vector(direction).normalized()
        _, u, v, _ = frame(start, d)
        n = max(8, int(length / pitch * 24))
        pts = [Vector(start) + d * (length * i / n) + r * (math.cos(2 * math.pi * length * i / n / pitch) * u
               + math.sin(2 * math.pi * length * i / n / pitch) * v) for i in range(n + 1)]
        return self.tube(pts, wire, mat, seg=5)

    def sweep(self, frames, profile, mat, tile=1.0):
        """Rings of profile(i) carried along the frames; UVs in metres, u around the section, v along it."""
        before = set(self.bm.faces)
        rings, profs = [], [profile(i) for i in range(len(frames))]
        for (P, side, up, _), pts in zip(frames, profs):
            rings.append([self.bm.verts.new(P - self.origin + side * u + up * v) for u, v in pts])
        n = len(rings[0])
        around = [0.0]
        for k in range(n):
            around.append(around[-1] + math.dist(profs[0][k], profs[0][(k + 1) % n]))
        along = [0.0]
        for i in range(1, len(frames)):
            along.append(along[-1] + (frames[i][0] - frames[i - 1][0]).length)
        for i in range(len(rings) - 1):
            A, B = rings[i], rings[i + 1]
            for k in range(n):
                f = self.bm.faces.new((A[k], B[k], B[(k + 1) % n], A[(k + 1) % n]))
                for loop, (uu, vv) in zip(f.loops, ((around[k], along[i]), (around[k], along[i + 1]),
                                                     (around[k + 1], along[i + 1]), (around[k + 1], along[i]))):
                    loop[self.layer].uv = (uu / tile, vv / tile)
        return self._finish(before, mat, smooth=True)

    def collar(self, fr, inner, outer, depth, mat):
        """A flange or end ring: an outer shell `depth` long, closed against the duct at both faces."""
        P, side, up, t = fr
        before = set(self.bm.faces)
        def ring(pts, d):
            return [self.bm.verts.new(P - self.origin + t * d + side * u + up * v) for u, v in pts]
        o0, o1, i0, i1 = ring(outer, -depth / 2), ring(outer, depth / 2), ring(inner, -depth / 2), ring(inner, depth / 2)
        n = len(outer)
        for k in range(n):
            j = (k + 1) % n
            self.bm.faces.new((o0[k], o1[k], o1[j], o0[j]))
            self.bm.faces.new((o1[k], i1[k], i1[j], o1[j]))
            self.bm.faces.new((o0[k], o0[j], i0[j], i0[k]))
        return self._finish(before, mat, smooth=True)

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


# ---------------------------------------------------------------- layout (metres)
CEIL = 3.0              # underside of the soffit
Z0 = 2.45               # duct centreline before the offset
DROP = 0.25             # the offset ducks the run under the beam
Z1 = Z0 - DROP
W, H = 0.6, 0.4         # rectangular section
RR, RB = 0.2, 0.1575    # Ø400 main, Ø315 branch
RI = 0.25               # outer jacket of the insulated duct
RECT = rrect(W, H)
RECT_F = rrect(W + 0.07, H + 0.07, r=0.02)
ROUND = circle(RR)
X_RUN = -1.2            # the run turns here and heads into the room along +Y
Y_FRONT = -1.6
BRANCH = Vector((math.sqrt(0.5), math.sqrt(0.5), 0))


def straight(P0, P1):
    return [frame(P0, Vector(P1) - Vector(P0)), frame(P1, Vector(P1) - Vector(P0))]


def flanges(p, frames):
    """TDC flanges with corner cleats, flush with both ends of a rectangular piece."""
    for (P, side, up, t), s in ((frames[0], 1), (frames[-1], -1)):
        c = P + t * (0.0175 * s)
        p.collar((c, side, up, t), RECT, RECT_F, 0.035, M["flange"])
        for su in (-1, 1):
            for sv in (-1, 1):
                p.box((0.05, 0.036, 0.05), c + side * su * (W / 2 + 0.03) + up * sv * (H / 2 + 0.03), M["steel"], rot=frame_rot(side, up, t))


def beads(p, P, t, r):
    p.ring(P, t, r + 0.004, 0.006, M["flange"])


def rect_run(p, P0, P1):
    fr = straight(P0, P1)
    p.sweep(fr, lambda i: RECT, M["duct"])
    flanges(p, fr)


def round_run(p, P0, P1, r=RR, seam=True):
    P0, P1 = Vector(P0), Vector(P1)
    d = P1 - P0
    p.sweep(straight(P0, P1), lambda i: circle(r), M["duct"])
    if seam:
        p.helix(P0, d, d.length, r + 0.002, M["duct"])
    beads(p, P0 + d.normalized() * 0.02, d, r)
    beads(p, P1 - d.normalized() * 0.02, d, r)


# 1  rectangular duct
A0, A1 = Vector((-3.6, Y_FRONT, Z0)), Vector((-1.8, Y_FRONT, Z0))
rect = Part("product_rect", origin=(A0 + A1) / 2)
rect_run(rect, A0, A1)
rect.build(focus=[0.0, -0.9, -0.4])

# 2  bend duct: a 90° horizontal elbow, throat radius 0.3
EC, ER = Vector((-1.8, Y_FRONT + 0.6, Z0)), 0.6
arc = []
for k in range(25):
    a = math.radians(-90 + 90 * k / 24)
    arc.append(frame(EC + ER * Vector((math.cos(a), math.sin(a), 0)), (-math.sin(a), math.cos(a), 0)))
cent = EC + ER * (2 * math.sqrt(2) / math.pi) * Vector((math.sqrt(0.5), -math.sqrt(0.5), 0))
bend = Part("product_bend", origin=cent)
bend.sweep(arc, lambda i: RECT, M["duct"])
flanges(bend, arc)
bend.build(focus=[0.35, -0.8, -0.4])

# 3  special shape duct: an S offset that ducks under the beam
Y3, LA, LC, LB = EC.y, 0.2, 0.6, 0.6


def z_at(y):
    u = min(max((y - (Y3 + LA)) / LC, 0.0), 1.0)
    return Z0 - DROP * (3 * u * u - 2 * u ** 3)


def dz_at(y):
    u = (y - (Y3 + LA)) / LC
    return 0.0 if u <= 0 or u >= 1 else -DROP * (6 * u - 6 * u * u) / LC


ys = [Y3, Y3 + LA] + [Y3 + LA + LC * k / 20 for k in range(1, 20)] + [Y3 + LA + LC, Y3 + LA + LC + LB]
sframes = [frame((X_RUN, y, z_at(y)), (0, 1, dz_at(y))) for y in ys]
offset = Part("product_offset", origin=(X_RUN, Y3 + (LA + LC + LB) / 2, (Z0 + Z1) / 2))
offset.sweep(sframes, lambda i: RECT, M["duct"])
flanges(offset, sframes)
offset.build(focus=[0.9, 0.0, -0.3])
Y4 = ys[-1]

# 4  square and round duct: rectangular flange to a round spigot
L4 = 0.5
rect_angles = [math.atan2(v, u) for u, v in RECT]
circ = [(RR * math.cos(a), RR * math.sin(a)) for a in rect_angles]
tframes = [frame((X_RUN, Y4 + L4 * k / 12, Z1), (0, 1, 0)) for k in range(13)]


def loft(i):
    s = min(max((i - 1) / 10, 0.0), 1.0)  # rings 0-1 stay rectangular, 11-12 round
    s = s * s * (3 - 2 * s)
    return [(ru + (cu - ru) * s, rv + (cv - rv) * s) for (ru, rv), (cu, cv) in zip(RECT, circ)]


trans = Part("product_transition", origin=(X_RUN, Y4 + L4 / 2, Z1))
trans.sweep(tframes, loft, M["duct"])
P, side, up, t = tframes[0]
trans.collar((P + t * 0.0175, side, up, t), RECT, RECT_F, 0.035, M["flange"])
for su in (-1, 1):
    for sv in (-1, 1):
        trans.box((0.05, 0.036, 0.05), P + t * 0.0175 + side * su * (W / 2 + 0.03) + up * sv * (H / 2 + 0.03), M["steel"], rot=frame_rot(side, up, t))
beads(trans, tframes[-1][0] - Vector((0, 0.02, 0)), (0, 1, 0), RR)
trans.build(focus=[0.9, 0.0, -0.35])
Y5 = Y4 + L4

# 5  spiral air duct
L5 = 1.6
spiral = Part("product_spiral", origin=(X_RUN, Y5 + L5 / 2, Z1))
round_run(spiral, (X_RUN, Y5, Z1), (X_RUN, Y5 + L5, Z1))
spiral.build(focus=[0.9, 0.0, -0.35])
Y6 = Y5 + L5

# 6  lateral tee: Ø400 straight through, Ø315 branch at 45°
L6, YB = 0.7, Y6 + 0.22
B0 = Vector((X_RUN, YB, Z1))
B1 = B0 + BRANCH * 0.62
lateral = Part("product_lateral", origin=(X_RUN + 0.12, Y6 + L6 / 2, Z1))
lateral.sweep(straight((X_RUN, Y6, Z1), (X_RUN, Y6 + L6, Z1)), lambda i: ROUND, M["duct"])
lateral.sweep(straight(B0, B1), lambda i: circle(RB), M["duct"])
beads(lateral, (X_RUN, Y6 + 0.02, Z1), (0, 1, 0), RR)
beads(lateral, (X_RUN, Y6 + L6 - 0.02, Z1), (0, 1, 0), RR)
beads(lateral, B1 - BRANCH * 0.02, BRANCH, RB)
lateral.build(focus=[0.7, -0.3, -0.45])
Y7 = Y6 + L6

# 7  spiral insulation duct: inner duct, insulation, outer spiral jacket
L7 = 1.6
insulated = Part("product_insulated", origin=(X_RUN, Y7 + L7 / 2, Z1))


def insulated_run(p, y0, y1, ends=True):
    p.sweep(straight((X_RUN, y0, Z1), (X_RUN, y1, Z1)), lambda i: ROUND, M["inner"])
    j0, j1 = y0 + 0.06, y1 - 0.06
    p.sweep(straight((X_RUN, j0, Z1), (X_RUN, j1, Z1)), lambda i: circle(RI), M["duct"])
    p.helix(Vector((X_RUN, j0, Z1)), (0, 1, 0), j1 - j0, RI + 0.002, M["duct"])
    if ends:  # the insulation shows at both cut ends
        for y, s in ((j0, -1), (j1, 1)):
            fr = frame((X_RUN, y + s * 0.004, Z1), (0, 1, 0))
            p.collar(fr, ROUND, circle(RI), 0.008, M["insulation"])


insulated_run(insulated, Y7, Y7 + L7)
insulated.build(focus=[0.9, -0.2, -0.5])
Y8 = Y7 + L7

# ---------------------------------------------------------------- the branch off the lateral tee
R250, R200 = 0.125, 0.1


def arc_frames(C, R, h0, h1, z, n, left=True):
    """Frames along a horizontal arc from heading h0 to h1 (degrees) round the centre C."""
    out = []
    for k in range(n + 1):
        h = math.radians(h0 + (h1 - h0) * k / n)
        rel = Vector((math.sin(h), -math.cos(h), 0)) if left else Vector((-math.sin(h), math.cos(h), 0))
        out.append(frame(Vector((C[0], C[1], z)) + R * rel, (math.cos(h), math.sin(h), 0)))
    return out


def gored(p, frames, r):
    """A segmented elbow: straight gores between the rings and a seam bead at every joint."""
    p.sweep(frames, lambda i: circle(r), M["duct"])
    for k, (P, _, _, t) in enumerate(frames):
        beads(p, P + t * (0.02 if k == 0 else -0.02 if k == len(frames) - 1 else 0.0), t, r)


def hang_down(P0, P3, drop=0.3, n=72):
    """A flexible run that leaves P0 straight down and arrives at P3 straight down (a cubic Bezier)."""
    P0, P3 = Vector(P0), Vector(P3)
    P1, P2 = P0 + Vector((0, 0, -drop)), P3 + Vector((0, 0, drop))
    out = []
    for k in range(n + 1):
        s = k / n
        P = (1 - s) ** 3 * P0 + 3 * (1 - s) ** 2 * s * P1 + 3 * (1 - s) * s * s * P2 + s ** 3 * P3
        d = 3 * (1 - s) ** 2 * (P1 - P0) + 6 * (1 - s) * s * (P2 - P1) + 3 * s * s * (P3 - P2)
        out.append(frame(P, d, (1, 0, 0)))
    return out


def corrugated(p, frames, r, mat, pitch, amp):
    """A flexible duct: the section swells and narrows along the path."""
    along = [0.0]
    for i in range(1, len(frames)):
        along.append(along[-1] + (frames[i][0] - frames[i - 1][0]).length)
    radii = [r + amp * (0.5 + 0.5 * math.cos(2 * math.pi * s / pitch)) for s in along]
    p.sweep(frames, lambda i: circle(radii[i], 24), mat)


def round_diffuser(p, top, neck_r):
    """A round multi-cone diffuser hung on its flexible duct and two wires."""
    top, down, xs = Vector(top), (0, 0, -1), (1, 0, 0)
    z = top - Vector((0, 0, 0.07))
    p.sweep([frame(top, down, xs), frame(z, down, xs)], lambda i: circle(neck_r, 32), M["dark"])
    ro = neck_r + 0.13
    for k in range(4):
        r0, r1, z0 = ro - k * 0.045, ro - k * 0.045 - 0.03, z - Vector((0, 0, 0.016 * k))
        p.sweep([frame(z0, down, xs), frame(z0 - Vector((0, 0, 0.022)), down, xs)],
                lambda i, r0=r0, r1=r1: circle(r0 if i == 0 else r1, 40), M["dark"])
    p.cyl(max(ro - 0.21, 0.02), 0.01, z - Vector((0, 0, 0.075)), M["dark"], seg=24)
    for sx in (-1, 1):
        p.cyl(0.002, CEIL - z.z, (z.x + sx * ro * 0.8, z.y, (CEIL + z.z) / 2), M["steel"], seg=6)


# 8  45° bend duct: three gores turn the Ø315 branch to run along +X
C45 = B1 + 0.47 * Vector((math.sqrt(0.5), -math.sqrt(0.5), 0))
g45 = arc_frames(C45, 0.47, 45, 0, Z1, 3, left=False)
bend45 = Part("product_bend45", origin=g45[1][0].lerp(g45[2][0], 0.5))
gored(bend45, g45, RB)
bend45.build(focus=[0.1, -0.8, -0.35])
E45 = g45[-1][0]
YT = E45.y

# 9  reducer: Ø315 to Ø250, short spigots at both ends
XR0, L9 = E45.x + 1.0, 0.4
rframes = [frame((XR0 + L9 * k / 10, YT, Z1), (1, 0, 0)) for k in range(11)]


def red_r(i):
    s = min(max((i - 1.5) / 7, 0.0), 1.0)
    return RB + (R250 - RB) * s


reducer = Part("product_reducer", origin=(XR0 + L9 / 2, YT, Z1))
reducer.sweep(rframes, lambda i: circle(red_r(i)), M["duct"])
beads(reducer, (XR0 + 0.02, YT, Z1), (1, 0, 0), RB)
beads(reducer, (XR0 + L9 - 0.02, YT, Z1), (1, 0, 0), R250)
reducer.build(focus=[0.0, -0.8, -0.35])
X10 = XR0 + L9

# 10  straight tee: Ø250 straight through, Ø200 branch straight down
L10 = 0.6
TB = Vector((X10 + L10 / 2, YT, Z1))
TB1 = TB - Vector((0, 0, 0.3))
tee = Part("product_tee", origin=TB - Vector((0, 0, 0.08)))
tee.sweep(straight((X10, YT, Z1), (X10 + L10, YT, Z1)), lambda i: circle(R250), M["duct"])
tee.sweep([frame(TB, (0, 0, -1)), frame(TB1, (0, 0, -1))], lambda i: circle(R200), M["duct"])
beads(tee, (X10 + 0.02, YT, Z1), (1, 0, 0), R250)
beads(tee, (X10 + L10 - 0.02, YT, Z1), (1, 0, 0), R250)
beads(tee, TB1 + Vector((0, 0, 0.02)), (0, 0, -1), R200)
tee.build(focus=[0.0, -0.8, -0.25])
X11 = X10 + L10

# 11  aluminium foil flexible duct: from the tee's drop to a round diffuser
D1 = Vector((TB.x + 0.3, YT - 0.25, 1.42))
flex = Part("product_flex", origin=TB1.lerp(D1, 0.5))
corrugated(flex, hang_down(TB1, D1), R200 + 0.004, M["foil"], 0.032, 0.006)
flex.build(focus=[0.15, -0.6, -0.2])

# 12  90° bend duct: four gores turn the Ø250 line from +X to +Y
g90 = arc_frames(Vector((X11, YT + 0.375, Z1)), 0.375, 0, 90, Z1, 4, left=True)
bend90 = Part("product_bend90", origin=g90[2][0])
gored(bend90, g90, R250)
bend90.build(focus=[0.3, -0.7, -0.35])
E90 = g90[-1][0]
YS0 = E90.y + 0.8

# 13  90° stamping duct: one pressed piece, no seams, turning the line down
SC = Vector((E90.x, YS0, Z1 - 0.25))
pframes = [frame(SC + 0.25 * Vector((0, math.sin(a), math.cos(a))), (0, math.cos(a), -math.sin(a)), (1, 0, 0))
           for a in np.linspace(0, math.pi / 2, 17)]
stamp = Part("product_stamp90", origin=pframes[8][0])
stamp.sweep(pframes, lambda i: circle(R250), M["duct"])
beads(stamp, pframes[0][0] + Vector((0, 0.02, 0)), (0, 1, 0), R250)
beads(stamp, pframes[-1][0] + Vector((0, 0, 0.02)), (0, 0, -1), R250)
stamp.build(focus=[0.6, -0.5, -0.3])
S1 = pframes[-1][0]

# 14  flexible insulation duct: foil jacket over insulation round a Ø250 core, to a second diffuser
D2 = Vector((S1.x - 0.3, S1.y + 0.2, 1.36))
down = Vector((0, 0, -1))
flexins = Part("product_flexins", origin=S1.lerp(D2, 0.5))
jacket = hang_down(S1 + down * 0.035, D2 - down * 0.035)
corrugated(flexins, jacket, 0.152, M["foil"], 0.05, 0.007)
for P, side, up, t in (jacket[0], jacket[-1]):
    flexins.collar((P, side, up, t), circle(R250, 24), circle(0.153, 24), 0.006, M["insulation"])
flexins.sweep([frame(S1, down), frame(S1 + down * 0.04, down)], lambda i: circle(R250 - 0.003, 24), M["foil"])
flexins.sweep([frame(D2 - down * 0.04, down), frame(D2, down)], lambda i: circle(R250 - 0.003, 24), M["foil"])
flexins.build(focus=[0.6, -0.4, -0.2])

# 15  oval duct: a flat oval line running above the round runs
OY, OZ, OW, OH = 1.6, 2.74, 0.5, 0.24
OVAL, OVAL_F = oval(OW, OH), oval(OW + 0.02, OH + 0.02)


def oval_run(p, x0, x1):
    fr = straight((x0, OY, OZ), (x1, OY, OZ))
    p.sweep(fr, lambda i: OVAL, M["duct"])
    for (P, side, up, t), s in ((fr[0], 1), (fr[-1], -1)):
        p.collar((P + t * (0.02 * s), side, up, t), OVAL, OVAL_F, 0.04, M["flange"])


ovalp = Part("product_oval", origin=(1.0, OY, OZ))
oval_run(ovalp, 0.4, 1.6)
ovalp.build(focus=[0.0, -0.9, -0.45])

# ---------------------------------------------------------------- the rest of the run (static)
run = Part("run")
for x0 in (-9.0, -7.2, -5.4):
    rect_run(run, (x0, Y_FRONT, Z0), (x0 + 1.8, Y_FRONT, Z0))
insulated_run(run, Y8, Y8 + 7.0, ends=False)
round_run(run, E45, (XR0, YT, Z1), r=RB)
round_run(run, E90, (E90.x, YS0, Z1), r=R250)
for x0, x1 in ((-9.0, -6.0), (-6.0, -3.0), (-3.0, 0.4), (1.6, 4.4), (4.4, 7.0)):
    oval_run(run, x0, x1)
run.build()

pendants = Part("pendant_diffusers")
round_diffuser(pendants, D1, R200)
round_diffuser(pendants, D2, R250)
pendants.build()

# square diffuser under the front run, as in the reference photo
DX, DB = -4.5, Z0 - H / 2
dif = Part("diffuser", origin=(DX, Y_FRONT, DB - 0.06))
dif.box((0.34, 0.34, 0.06), (DX, Y_FRONT, DB - 0.03), M["dark"])
bm, lay = dif.bm, dif.layer
before = set(bm.faces)


def square(a, z):
    return [bm.verts.new(Vector((DX + x, Y_FRONT + y, z)) - dif.origin) for x, y in ((a, -a), (a, a), (-a, a), (-a, -a))]


z = DB - 0.06
frame_o, frame_i = square(0.3, z), square(0.262, z)
for k in range(4):
    bm.faces.new((frame_i[k], frame_i[(k + 1) % 4], frame_o[(k + 1) % 4], frame_o[k]))
a = 0.255
for i in range(5):  # nested louvres stepping down to a small cone
    o, ii = square(a, z - 0.004 - 0.012 * i), square(a - 0.034, z - 0.026 - 0.012 * i)
    for k in range(4):
        bm.faces.new((ii[k], ii[(k + 1) % 4], o[(k + 1) % 4], o[k]))
    a -= 0.046
apex = bm.verts.new(Vector((DX, Y_FRONT, z - 0.12)) - dif.origin)
base = square(a, z - 0.07)
for k in range(4):
    bm.faces.new((apex, base[(k + 1) % 4], base[k]))
dif._finish(before, M["dark"])
dif.build()

# soffit, the beam the offset ducks under, a conduit, hangers
shell = Part("soffit")
shell.box((24, 22, 0.15), (-2, 4, CEIL + 0.075), M["soffit"], uv=3.0)
shell.build()
beam = Part("beam")
beam.box((16, 0.4, CEIL - (Z1 + H / 2 + 0.05)), (-2, 0.05, (CEIL + Z1 + H / 2 + 0.05) / 2), M["beam"], uv=3.0)
beam.build()

kit = Part("hangers")
kit.tube([(-12, -2.55, 2.92), (6, -2.55, 2.92)], 0.022, M["steel"], seg=12)  # conduit along the front
for x in np.arange(-11, 6, 1.5):
    kit.box((0.03, 0.06, 0.06), (x, -2.55, 2.95), M["steel"])


def trapeze(x, y, z_bottom, along_x):
    """Two threaded rods and a strut under a rectangular duct."""
    span = W + 0.2
    zs = z_bottom - 0.025
    if along_x:
        kit.box((0.045, span, 0.04), (x, y, zs), M["steel"])
        rods = [(x, y - span / 2 + 0.03), (x, y + span / 2 - 0.03)]
    else:
        kit.box((span, 0.045, 0.04), (x, y, zs), M["steel"])
        rods = [(x - span / 2 + 0.03, y), (x + span / 2 - 0.03, y)]
    for rx, ry in rods:
        kit.cyl(0.005, CEIL - zs, (rx, ry, (CEIL + zs) / 2), M["steel"], seg=8)


def band(x, y, r, d=(0, 1, 0)):
    """A clamp band round a round duct, hung from one rod."""
    kit.ring((x, y, Z1), d, r + 0.006, 0.007, M["steel"])
    kit.cyl(0.005, CEIL - (Z1 + r), (x, y, (CEIL + Z1 + r) / 2), M["steel"], seg=8)


for x in (-7.2, -5.4, -3.6, -1.8):
    trapeze(x, Y_FRONT, Z0 - H / 2, along_x=True)
trapeze(X_RUN, EC.y, Z0 - H / 2, along_x=False)
trapeze(X_RUN, Y4, Z1 - H / 2, along_x=False)
for y in (Y5 + 0.05, Y6, Y7 + 0.03, Y8, Y8 + 2.4, Y8 + 4.8):
    band(X_RUN, y, RI if y >= Y7 else RR)
band(E45.x + 0.5, YT, RB, d=(1, 0, 0))
band(E90.x, E90.y + 0.4, R250)
for x in (-6.5, -3.5, -0.4, 2.4, 5.0):
    trapeze(x, OY, OZ - OH / 2, along_x=True)
kit.build()

# ---------------------------------------------------------------- export
os.makedirs(os.path.dirname(os.path.abspath(OUT_GLB)), exist_ok=True)
bpy.ops.object.select_all(action="DESELECT")
bpy.ops.export_scene.gltf(
    filepath=OUT_GLB, export_format="GLB", export_apply=True, export_yup=True, export_extras=True,
    export_cameras=False, export_lights=False, export_image_format="WEBP", export_image_quality=80,
    export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=7,
    export_draco_position_quantization=14, export_draco_texcoord_quantization=12,
)
print("EXPORTED", OUT_GLB, os.path.getsize(OUT_GLB))

# ---------------------------------------------------------------- preview renders (EEVEE, a check on shapes and materials)
if DO_RENDER:
    world = bpy.data.worlds.new("w")
    scene.world = world
    try:
        world.use_nodes = True
    except Exception:
        pass
    bg = world.node_tree.nodes.get("Background")
    bg.inputs["Color"].default_value = (*srgb("2a2e35"), 1)
    bg.inputs["Strength"].default_value = 1.0

    def light(name, kind, loc, rot, energy, size=4, color=(1, 1, 1)):
        ld = bpy.data.lights.new(name, kind)
        ld.energy, ld.color = energy, color
        if kind == "AREA":
            ld.size = size
        ob = bpy.data.objects.new(name, ld)
        ob.location, ob.rotation_euler = loc, rot
        root.objects.link(ob)

    light("room_below", "AREA", (-1.5, 0.5, 0.0), (math.pi, 0, 0), 900, 10, (0.92, 0.95, 1.0))
    light("sun", "SUN", (0, 0, 0), (math.radians(125), 0, math.radians(25)), 2.5, color=(1.0, 0.97, 0.92))

    cam_data = bpy.data.cameras.new("cam")
    cam = bpy.data.objects.new("cam", cam_data)
    root.objects.link(cam)
    scene.camera = cam
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x, scene.render.resolution_y = 1600, 900
    scene.view_settings.view_transform = "AgX"
    os.makedirs(RENDER_DIR, exist_ok=True)

    def shoot(name, loc, target, lens, lift=None):
        moved = []
        if lift:
            ob = bpy.data.objects[lift]
            moved = [(ob, ob.location.copy())]
            ob.location += Vector(ob["focus"])
        cam.location = loc
        cam.rotation_euler = (Vector(target) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
        cam_data.lens = lens
        scene.render.filepath = os.path.join(RENDER_DIR, name)
        bpy.ops.render.render(write_still=True)
        for ob, home in moved:
            ob.location = home
        print("RENDERED", name)

    shoot("overview.png", (1.6, -6.2, 1.2), (-2.2, 0.4, 2.45), 22)
    shoot("branch.png", (2.6, 0.4, 0.9), (0.9, 3.6, 2.0), 22)
    shoot("tee_flex.png", (1.9, 1.2, 1.0), (1.3, 3.2, 1.8), 28)
    shoot("stamp.png", (3.4, 2.6, 1.1), (1.9, 4.6, 1.9), 28)
    shoot("oval.png", (1.2, -1.6, 1.3), (1.0, 1.2, 2.5), 26, lift="product_oval")
