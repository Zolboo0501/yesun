"""The kindergarten's and the school's ventilation, each built to a structure of its own.

build_scene.py builds the shell and the 600 grid ceiling for every room, and the office's system: an
air handling unit in the plenum, two rectangular mains along the room, flex drops and square
diffusers. These two functions build the other rooms' systems in its place:

- kindergarten: a heat recovery unit at the front left (a diamond plate core between two filters and
  two fans), insulated outdoor air and exhaust ducts out through the window wall, round spiral ducts
  with a silencer on the supply, a spine down the middle of the room with ribs to round swirl
  diffusers, and an extract duct over disc valves.
- school: a sectional air handling unit at the back (mixing box, bag filters, coil, plug fan) fed by
  an outdoor air duct from the window wall and an egg-crate return grille under its mixing box, a VAV
  box, a rectangular trunk down the room and three branches across it over linear slot diffusers.

Both keep the node contract HeroScene.tsx reads: ahu_door (origin on its hinge, opening towards the
camera), ahu_fan (origin on its axis, which runs along y), the explode_sys / explode_ahu / delay
extras, and fade_explode on the hangers; a second fan carries spin=1 so it turns too. Colour bands
mark each duct's air the way site tape does, with no lettering: mint outdoor air, sky supply, butter
extract, peach exhaust. Blender metres, Z up; -Y is the open front the camera looks in from.
"""
import math

import numpy as np
from mathutils import Matrix, Vector


# ---------------------------------------------------------------- shared pieces
def rounded(pts, R, steps=8):
    """An orthogonal polyline with every corner turned on radius R: a duct's path with its bends.
    Each straight run must be longer than R (2R between two bends)."""
    P = [Vector(p) for p in pts]
    out = [P[0]]
    for a, b, c in zip(P, P[1:], P[2:]):
        u, v = (b - a).normalized(), (c - b).normalized()
        centre = b - u * R + v * R
        out += [centre - v * R * math.cos(t) + u * R * math.sin(t) for t in np.linspace(0, math.pi / 2, steps + 1)]
    out.append(P[-1])
    return out


def pipe(p, pts, r, mat, seg=28):
    """A round duct swept along a path. Each ring's frame is carried over from the last, so a bend
    that turns vertical doesn't twist the way Part.tube's fixed reference does."""
    before = set(p.bm.faces)
    P = [Vector(q) - p.origin for q in pts]
    n = len(P)
    T = [(P[min(i + 1, n - 1)] - P[max(i - 1, 0)]).normalized() for i in range(n)]
    ref = Vector((0, 0, 1)) if abs(T[0].z) < 0.9 else Vector((1, 0, 0))
    u = (ref - T[0] * ref.dot(T[0])).normalized()
    rings = []
    for i in range(n):
        if i:
            u = T[i - 1].rotation_difference(T[i]) @ u
            u = (u - T[i] * u.dot(T[i])).normalized()
        v = T[i].cross(u)
        rings.append([p.bm.verts.new(P[i] + r * (math.cos(2 * math.pi * j / seg) * u + math.sin(2 * math.pi * j / seg) * v))
                      for j in range(seg)])
    for A, B in zip(rings, rings[1:]):
        for j in range(seg):
            p.bm.faces.new((A[j], A[(j + 1) % seg], B[(j + 1) % seg], B[j]))
    return p._finish(before, mat, smooth=True)


def band(p, M, x, y, z, r, along, top):
    """A band clamp round a round duct running along x or y, hung on a threaded rod from the slab."""
    R = r + 0.012
    ring = [(x, y + R * math.cos(t), z + R * math.sin(t)) if along == "x" else (x + R * math.cos(t), y, z + R * math.sin(t))
            for t in np.linspace(0, 2 * math.pi, 20, endpoint=False)]
    p.tube(ring, 0.006, M["steel"], closed=True, seg=6)
    p.cyl(0.005, top - z - R, (x, y, (top + z + R) / 2), M["steel"], seg=8)


def trapeze(p, M, x, y, z_under, span, along, top):
    """A strut under a rectangular duct that runs along x or y, on two rods from the slab."""
    z = z_under - 0.022
    if along == "x":
        p.box((0.04, span + 0.24, 0.04), (x, y, z), M["black"])
        rods = [(x, y + s * (span / 2 + 0.08)) for s in (-1, 1)]
    else:
        p.box((span + 0.24, 0.04, 0.04), (x, y, z), M["black"])
        rods = [(x + s * (span / 2 + 0.08), y) for s in (-1, 1)]
    for rx, ry in rods:
        p.cyl(0.005, top - z, (rx, ry, (top + z) / 2), M["steel"], seg=8)


def grid_wires(p, M, xs, ys, bottom, top, skip=lambda x, y: False):
    """The tile grid's own hanger wires."""
    for x in xs:
        for y in ys:
            if not skip(x, y):
                p.cyl(0.003, top - bottom, (x, y, (top + bottom) / 2), M["steel"], seg=6)


def sprinkler(g, y, heads):
    """A sprinkler main along the room under the slab, with drops to heads in the tiles."""
    Part, M, LOW, PZ = g["Part"], g["M"], g["LOW"], g["PZ"]
    z = 3.86
    s = Part("sprinkler", origin=(0, y, z))
    s.cyl(0.03, g["SX1"] - g["SX0"], (0, y, z), M["sprinkler"], axis="x", seg=16)
    for x in heads:
        s.cyl(0.014, z - PZ - 0.05, (x, y, (z + PZ + 0.05) / 2), M["sprinkler"], seg=10)
        s.cyl(0.008, PZ + 0.05 - LOW, (x, y, (PZ + 0.05 + LOW) / 2), M["chrome"], seg=10)
        s.cyl(0.024, 0.008, (x, y, LOW - 0.012), M["mug"], seg=16)
    s.build(explode_sys=[0.0, 0.0, 1.9], delay=0.0)


def fan(Part, M, name, axis_pt, r, depth, blades, **extras):
    """A plug fan facing the door: two shrouds, raked blades, a hub; its axis runs along y."""
    x, y, z = axis_pt
    f = Part(name, origin=axis_pt)
    for dy in (-depth / 2, depth / 2):
        f.cyl(r, 0.01, (x, y + dy, z), M["steel"], axis="y", seg=40)
    for i in range(blades):
        a = 2 * math.pi * i / blades
        f.box((r * 0.45, depth, 0.007), (x + math.cos(a) * r * 0.75, y, z + math.sin(a) * r * 0.75), M["steel"],
              rot=Matrix.Rotation(-a + 0.6, 4, "Y"))
    f.cyl(r * 0.25, depth + 0.04, (x, y, z), M["black"], axis="y", seg=24)
    f.build(**extras)


def arrow_y(p, x_face, y, z, direction, mat):
    """A flow arrow on a duct side that faces +x, pointing along y."""
    p.box((0.003, 0.22, 0.03), (x_face + 0.0015, y, z), mat)
    for i in range(6):
        p.box((0.003, 0.012, 0.09 * (1 - i / 6)), (x_face + 0.0015, y + direction * (0.11 + i * 0.012), z), mat)


# ---------------------------------------------------------------- ceiling faces
def swirl_face(p, M, x, y, z):
    """A round swirl diffuser in a 600 metal tile: slots set at an angle round a disc."""
    p.box((0.595, 0.595, 0.012), (x, y, z + 0.006), M["white_metal"])
    p.cyl(0.25, 0.004, (x, y, z - 0.002), M["white_metal"], seg=48)
    for i in range(24):
        a = 2 * math.pi * i / 24
        p.box((0.1, 0.013, 0.004), (x + 0.165 * math.cos(a), y + 0.165 * math.sin(a), z - 0.005), M["black"],
              rot=Matrix.Rotation(a + 0.5, 4, "Z"))
    p.cyl(0.075, 0.006, (x, y, z - 0.006), M["white_metal"], seg=36)


def valve_face(p, M, x, y, z):
    """An extract disc valve in a 600 metal tile: a collar, a dark gap, the disc on its spindle."""
    p.box((0.595, 0.595, 0.012), (x, y, z + 0.006), M["white_metal"])
    p.cyl(0.11, 0.008, (x, y, z - 0.004), M["white_metal"], seg=40)
    p.cyl(0.088, 0.004, (x, y, z - 0.009), M["black"], seg=40)
    p.cyl(0.014, 0.012, (x, y, z - 0.012), M["white_metal"], seg=16)
    p.cyl(0.074, 0.01, (x, y, z - 0.022), M["white_metal"], seg=40)


def slot_face(p, M, x, y, z):
    """A two-tile metal panel with a two-slot linear diffuser down its middle."""
    p.box((1.195, 0.595, 0.012), (x, y, z + 0.006), M["white_metal"])
    p.box((1.12, 0.1, 0.004), (x, y, z - 0.002), M["white_metal"])
    for dy in (-0.022, 0.022):
        p.box((1.08, 0.016, 0.004), (x, y + dy, z - 0.004), M["black"])


def egg_crate(p, M, x, y, z, w=1.195, d=0.595):
    """A return grille: a fine square lattice in a frame, over a dark plenum."""
    for dx, dy, sx, sy in ((0, -d / 2 + 0.015, w, 0.03), (0, d / 2 - 0.015, w, 0.03),
                           (-w / 2 + 0.015, 0, 0.03, d), (w / 2 - 0.015, 0, 0.03, d)):
        p.box((sx, sy, 0.012), (x + dx, y + dy, z + 0.006), M["white_metal"])
    for yy in np.arange(y - d / 2 + 0.07, y + d / 2 - 0.05, 0.04):
        p.box((w - 0.06, 0.004, 0.02), (x, yy, z + 0.01), M["white_metal"])
    for xx in np.arange(x - w / 2 + 0.07, x + w / 2 - 0.05, 0.04):
        p.box((0.004, d - 0.06, 0.02), (xx, y, z + 0.01), M["white_metal"])
    p.box((w - 0.06, d - 0.06, 0.004), (x, y, z + 0.035), M["insulation"])


# ---------------------------------------------------------------- kindergarten
def kindergarten(g):
    """Heat recovery ventilation: quiet, and the outgoing air warms the incoming air."""
    Part, M, taken, cell_of = g["Part"], g["M"], g["taken"], g["cell_of"]
    PZ, LOW, SLAB_Z, RX0 = g["PZ"], g["LOW"], g["SLAB_Z"], g["RX0"]
    BOX_TOP = PZ + 0.23
    Z = PZ + 0.52                                      # centre line of the unit's spigots and the round ducts
    X0, X1, Y0, Y1 = -3.05, -1.35, -1.95, -1.05        # heat recovery unit
    Z0, Z1 = Z - 0.27, Z + 0.27
    CX, CY = (X0 + X1) / 2, (Y0 + Y1) / 2
    L, D, H, th = X1 - X0, Y1 - Y0, Z1 - Z0, 0.03
    YF, YB = -1.73, -1.27                              # spigot rows: outdoor air and extract in front
    SYS = [0.0, 0.0, 1.3]                              # the unit rises as one in the exploded view
    SPINE_X, SPINE_END = 0.0, 1.5
    RIBS, DIFF_X = (-0.6, 1.2), (-1.8, 1.8)
    VALVE_Y, VALVES, EXT_END = -1.8, (0.0, 1.8), 2.1

    # on the ceiling: round swirl diffusers and disc valves, each in a metal tile
    faces = Part("diffusers")
    swirls = [(x, y) for y in RIBS for x in DIFF_X]
    for x, y in swirls:
        swirl_face(faces, M, x, y, LOW)
        taken.add(cell_of(x, y))
    for x in VALVES:
        valve_face(faces, M, x, VALVE_Y, LOW)
        taken.add(cell_of(x, VALVE_Y))
    faces.build()
    for i, (x, y) in enumerate(swirls):
        b = Part(f"box_swirl_{i}", origin=(x, y, (PZ + BOX_TOP) / 2))
        b.box((0.5, 0.5, BOX_TOP - PZ - 0.01), (x, y, (PZ + 0.01 + BOX_TOP) / 2), M["duct"])
        b.cyl(0.09, 0.05, (x, y, BOX_TOP + 0.025), M["duct"], seg=28)
        b.build(bevel=0.002, explode_sys=[0.0, 0.0, 0.3], delay=0.55)

    # heat recovery unit: casing with a spigot pair at each end, a door across its front
    base = Part("hrv_base", origin=(CX, CY, Z))
    base.box((L, D, th), (CX, CY, Z0 + th / 2), M["ahu"])
    base.box((L - 0.07, D - 0.07, 0.004), (CX, CY, Z0 + th + 0.002), M["ahu_inner"])
    base.box((L, th, H), (CX, Y1 - th / 2, Z), M["ahu"])
    for zz in (Z0 + 0.025, Z1 - 0.025):
        base.box((L, th, 0.05), (CX, Y0 + th / 2, zz), M["ahu"])
    for xx in (X0 + 0.025, X1 - 0.025):
        base.box((0.05, th, H - 0.1), (xx, Y0 + th / 2, Z), M["ahu"])
    base.box((L - 0.02, 0.004, 0.012), (CX, Y0 - 0.001, Z1 - 0.03), M["accent"])
    for xx, s in ((X0, -1), (X1, 1)):
        base.box((th, D, H), (xx - s * th / 2, CY, Z), M["ahu"])
        for yy, r in ((YF, 0.1), (YB, 0.125 if s > 0 else 0.1)):
            base.cyl(r, 0.1, (xx + s * 0.05, yy, Z), M["duct"], axis="x", seg=28)
            base.cyl(r + 0.014, 0.025, (xx + s * 0.0125, yy, Z), M["black"], axis="x", seg=28)
    base.build(bevel=0.004, explode_sys=SYS, explode_ahu=[0.0, 0.0, 0.0], delay=0.0)

    top = Part("hrv_top", origin=(CX, CY, Z1))
    top.box((L, D, th), (CX, CY, Z1 - th / 2), M["ahu"])
    for xx in (X0 + 0.42, CX, X1 - 0.42):
        top.box((0.012, D + 0.004, 0.006), (xx, CY, Z1 + 0.001), M["accent"])
    for xx in (X0 + 0.1, X1 - 0.1):
        for yy in (Y0 + 0.12, Y1 - 0.12):
            top.cyl(0.03, 0.05, (xx, yy, Z1 + 0.025), M["black"], seg=16)
    top.build(bevel=0.004, explode_sys=SYS, explode_ahu=[0.0, 0.0, 0.5], delay=0.0)

    HINGE = (X0 + 0.05, Y0 + 0.002, Z)
    door = Part("ahu_door", origin=HINGE)
    dw, dh = L - 0.1, H - 0.106
    door.box((dw, 0.026, dh), (HINGE[0] + dw / 2, HINGE[1] + 0.012, Z), M["ahu"])
    door.box((dw - 0.06, 0.004, 0.012), (HINGE[0] + dw / 2, HINGE[1] - 0.002, Z + dh / 2 - 0.04), M["accent"])
    for dz in (-0.1, 0.1):
        door.box((0.02, 0.03, 0.08), (HINGE[0] + dw - 0.06, HINGE[1] - 0.012, Z + dz), M["accent"])
        door.cyl(0.012, 0.03, (HINGE[0] + 0.006, HINGE[1] - 0.004, Z + dz * 1.6), M["accent"], seg=10)
    door.build(bevel=0.003, explode_sys=SYS, explode_ahu=[0.0, -0.3, 0.0], delay=0.05)

    # inside, left to right: exhaust fan, filter, the diamond plate core, filter, supply fan
    core = Part("hrv_core", origin=(CX, CY, Z))
    E, n = 0.32, 18
    diamond = Matrix.Rotation(math.pi / 4, 4, "Y")
    for i in range(n):
        core.box((E, 0.008, E), (CX, Y0 + 0.13 + i * (D - 0.26) / (n - 1), Z), M["fins"] if i % 2 else M["ahu_inner"], rot=diamond)
    hd = E / math.sqrt(2)
    for dx, dz in ((hd, 0), (-hd, 0), (0, hd), (0, -hd)):
        core.box((0.03, D - 0.22, 0.03), (CX + dx, CY, Z + dz), M["black"], rot=diamond)
    core.build(explode_sys=SYS, explode_ahu=[0.0, -0.95, 0.0], delay=0.3)

    for name, x, delay in (("hrv_filter_in", -2.55, 0.4), ("hrv_filter_out", -1.85, 0.45)):
        f = Part(name, origin=(x, CY, Z))
        f.box((0.05, D - 0.12, H - 0.1), (x, CY, Z), M["filter"])
        for k in range(16):
            f.box((0.054, 0.006, H - 0.12), (x, Y0 + 0.08 + k * (D - 0.16) / 15, Z), M["arrow_light"])
        for zz in (Z0 + 0.06, Z1 - 0.06):
            f.box((0.06, D - 0.1, 0.02), (x, CY, zz), M["steel"])
        f.build(explode_sys=SYS, explode_ahu=[0.0, -0.55, 0.2], delay=delay)

    for name, x, delay, extra in (("ahu_fan", -1.6, 0.35, {}), ("hrv_fan_exhaust", -2.8, 0.4, {"spin": 1})):
        fy = Y0 + 0.32
        fan(Part, M, name, (x, fy, Z), 0.15, 0.14, 14, explode_sys=SYS, explode_ahu=[0.0, -0.7, 0.0], delay=delay, **extra)
        motor = Part(f"{name}_motor", origin=(x, fy + 0.2, Z))
        motor.cyl(0.07, 0.14, (x, fy + 0.2, Z), M["accent"], axis="y", seg=24)
        motor.build(bevel=0.002, explode_sys=SYS, explode_ahu=[0.0, -0.45, 0.0], delay=delay + 0.05)

    # outdoor air in and exhaust out, insulated, through the window wall
    for name, y, colour, delay in (("outdoor_air", YF, "mint", 0.15), ("exhaust_air", YB, "peach", 0.2)):
        x0, x1 = RX0, X0 - 0.1
        p = Part(name, origin=((x0 + x1) / 2, y, Z))
        p.cyl(0.125, x1 - x0, ((x0 + x1) / 2, y, Z), M["insulation"], axis="x", seg=32)
        p.cyl(0.16, 0.02, (x0 + 0.01, y, Z), M["black"], axis="x", seg=32)
        for xx in (x1 - 0.22, x0 + 0.35):
            p.cyl(0.128, 0.05, (xx, y, Z), M[colour], axis="x", seg=32)
        p.build(explode_sys=[-0.35, 0.0, 1.3], delay=delay)

    # supply: a silencer, then a spiral duct that turns down the middle of the room
    s0, s1 = X1 + 0.1, X1 + 0.9
    sil = Part("supply_silencer", origin=((s0 + s1) / 2, YB, Z))
    sil.cyl(0.125, 0.08, (s0 + 0.04, YB, Z), M["duct"], axis="x", seg=32, r2=0.17)
    sil.cyl(0.17, s1 - s0 - 0.16, ((s0 + s1) / 2, YB, Z), M["duct"], axis="x", seg=32)
    sil.cyl(0.17, 0.08, (s1 - 0.04, YB, Z), M["duct"], axis="x", seg=32, r2=0.125)
    for xx in (s0 + 0.08, s1 - 0.08):
        sil.cyl(0.176, 0.02, (xx, YB, Z), M["accent"], axis="x", seg=32)
    sil.cyl(0.173, 0.05, ((s0 + s1) / 2, YB, Z), M["skyblue"], axis="x", seg=32)
    sil.build(explode_sys=[0.25, 0.0, 1.0], delay=0.25)

    sp = Part("supply_main", origin=(SPINE_X, (YB + SPINE_END) / 2, Z))
    pipe(sp, rounded([(s1, YB, Z), (SPINE_X, YB, Z), (SPINE_X, SPINE_END, Z)], 0.3), 0.125, M["duct"], seg=32)
    sp.helix((SPINE_X, YB + 0.3, Z), (0, 1, 0), SPINE_END - YB - 0.32, 0.127, M["duct"])
    sp.cyl(0.125, 0.012, (SPINE_X, SPINE_END + 0.006, Z), M["duct"], axis="y", seg=32)
    for yy in (YB + 0.4, 0.3):
        sp.cyl(0.131, 0.025, (SPINE_X, yy, Z), M["accent"], axis="y", seg=32)
    sp.build(explode_sys=[0.0, 0.0, 0.95], delay=0.2)

    # ribs across the spine, each turning down into a swirl diffuser's plenum at both ends
    for i, y in enumerate(RIBS):
        xa, xb = DIFF_X
        rib = Part(f"supply_rib_{i}", origin=(0.0, y, Z))
        pipe(rib, rounded([(xa, y, BOX_TOP + 0.05), (xa, y, Z), (xb, y, Z), (xb, y, BOX_TOP + 0.05)], 0.15), 0.08, M["duct"])
        rib.helix((xa + 0.15, y, Z), (1, 0, 0), xb - xa - 0.3, 0.082, M["duct"], pitch=0.1)
        for xx in (xa + 0.45, xb - 0.45):
            rib.cyl(0.086, 0.03, (xx, y, Z), M["accent"], axis="x", seg=24)       # volume damper
            rib.box((0.012, 0.012, 0.07), (xx, y, Z + 0.115), M["black"])          # its lever
        rib.build(explode_sys=[0.0, 0.0, 0.7], delay=0.35 + 0.05 * i)

    # extract: a spiral duct along the front, over the disc valves
    e0 = X1 + 0.1
    ex = Part("extract_main", origin=((e0 + EXT_END) / 2, YF, Z))
    ex.cyl(0.1, EXT_END - e0, ((e0 + EXT_END) / 2, YF, Z), M["duct"], axis="x", seg=28)
    ex.helix((e0 + 0.05, YF, Z), (1, 0, 0), EXT_END - e0 - 0.1, 0.102, M["duct"], pitch=0.11)
    ex.cyl(0.1, 0.012, (EXT_END + 0.006, YF, Z), M["duct"], axis="x", seg=28)
    ex.cyl(0.104, 0.05, (e0 + 0.22, YF, Z), M["butter"], axis="x", seg=28)
    for x in VALVES:
        z0 = LOW + 0.012
        ex.cyl(0.07, Z - 0.09 - z0, (x, VALVE_Y, (Z - 0.09 + z0) / 2), M["duct"], seg=24)
    ex.build(explode_sys=[0.0, -0.3, 0.5], delay=0.15)

    if g["HVAC"]["sprinkler"]:
        sprinkler(g, 0.6, (-2.4, -0.6, 1.2))

    hang = Part("hangers")
    for xx in (X0 + 0.1, X1 - 0.1):
        for yy in (Y0 + 0.12, Y1 - 0.12):
            hang.cyl(0.007, SLAB_Z - Z1 - 0.05, (xx, yy, (SLAB_Z + Z1 + 0.05) / 2), M["steel"], seg=8)
    for x, y, r, along in ((-4.4, YF, 0.125, "x"), (-4.4, YB, 0.125, "x"),
                           (SPINE_X, -0.2, 0.125, "y"), (SPINE_X, 0.9, 0.125, "y"),
                           (-0.9, YF, 0.1, "x"), (1.0, YF, 0.1, "x"),
                           (-1.0, RIBS[0], 0.08, "x"), (1.0, RIBS[0], 0.08, "x"),
                           (-1.0, RIBS[1], 0.08, "x"), (1.0, RIBS[1], 0.08, "x")):
        band(hang, M, x, y, Z, r, along, SLAB_Z)
    grid_wires(hang, M, (-3.0, -1.0, 1.0, 3.0), (-1.9, 0.0, 1.9), PZ + 0.03, SLAB_Z,
               skip=lambda x, y: X0 - 0.05 < x < X1 + 0.05 and Y0 < y < Y1)
    hang.build(fade_explode=1)


# ---------------------------------------------------------------- school
def school(g):
    """A sectional air handling unit feeding a trunk down the room and branches across it."""
    Part, M, taken, cell_of = g["Part"], g["M"], g["taken"], g["cell_of"]
    PZ, LOW, SLAB_Z, RX0 = g["PZ"], g["LOW"], g["SLAB_Z"], g["RX0"]
    BOX_TOP = PZ + 0.19                                # top of the slot diffusers' plenums
    ZC = PZ + 0.54                                     # centre line of the unit, the VAV box and the trunk
    X0, X1, Y0, Y1 = -3.0, -0.25, 2.05, 2.95           # sectional air handling unit, its front to the room
    Z0, Z1 = ZC - 0.325, ZC + 0.325
    MIX, FIL, COIL, FAN = -2.4, -1.8, -1.4, -0.55      # where the mixing, filter, coil and fan sections end
    CX, CY = (X0 + X1) / 2, (Y0 + Y1) / 2
    L, D, H, th = X1 - X0, Y1 - Y0, Z1 - Z0, 0.03
    SYS = [0.0, 0.0, 1.35]
    TW, TH, TX = 0.5, 0.3, 1.05                        # trunk: width, height, the x it runs down the room at
    BW, BH = 0.35, 0.2                                 # branches
    ZB = BOX_TOP + BH / 2                              # a branch sits on its diffusers' plenums, under the trunk
    ROWS, SLOTS = (1.2, -0.6, -2.4), (-2.1, -0.3, 2.1)
    T_END = ROWS[-1] - BW / 2
    V0, V1 = X1 + 0.05, X1 + 0.7                       # VAV box

    # on the ceiling: two-tile slot diffuser panels in three rows, a return grille under the unit
    faces = Part("diffusers")
    for y in ROWS:
        for x in SLOTS:
            slot_face(faces, M, x, y, LOW)
            taken.update((cell_of(x - 0.3, y), cell_of(x + 0.3, y)))
    egg_crate(faces, M, -2.7, 2.4, LOW)
    taken.update((cell_of(-3.0, 2.4), cell_of(-2.4, 2.4)))
    faces.build()
    for i, y in enumerate(ROWS):
        for j, x in enumerate(SLOTS):
            b = Part(f"box_slot_{i}_{j}", origin=(x, y, (PZ + BOX_TOP) / 2))
            b.box((1.1, 0.24, BOX_TOP - PZ - 0.01), (x, y, (PZ + 0.01 + BOX_TOP) / 2), M["duct"])
            b.build(bevel=0.002, explode_sys=[0.0, 0.0, 0.3], delay=0.55)
    rb = Part("return_box", origin=(-2.7, 2.4, (PZ + Z0) / 2))
    rb.box((0.6, 0.5, Z0 - PZ - 0.04), (-2.7, 2.4, (PZ + 0.04 + Z0) / 2), M["duct_wrap"])
    rb.build(bevel=0.002, explode_sys=[0.0, 0.0, 0.3], delay=0.5)

    # the unit's casing: fixed panels on the mixing and outlet sections, frames between sections,
    # dampers for the return air (over the grille) and the outdoor air (at the inlet)
    base = Part("ahu_base", origin=(CX, CY, ZC))
    base.box((L, D, th), (CX, CY, Z0 + th / 2), M["ahu"])
    base.box((L - 0.07, D - 0.07, 0.004), (CX, CY, Z0 + th + 0.002), M["ahu_inner"])
    base.box((L, th, H), (CX, Y1 - th / 2, ZC), M["ahu"])
    for xx, s in ((X0, -1), (X1, 1)):
        base.box((th, D, H), (xx - s * th / 2, CY, ZC), M["ahu"])
    for zz in (Z0 + 0.025, Z1 - 0.025):
        base.box((L, th, 0.05), (CX, Y0 + th / 2, zz), M["ahu"])
    for x0, x1 in ((X0, MIX), (FAN, X1)):
        base.box((x1 - x0 - 0.04, th, H - 0.1), ((x0 + x1) / 2, Y0 + th / 2, ZC), M["ahu"])
    for xx in (X0 + 0.02, MIX, FIL, COIL, FAN, X1 - 0.02):
        base.box((0.04, th + 0.01, H + 0.004), (xx, Y0 + th / 2 - 0.005, ZC), M["accent"])
    for yy in np.linspace(Y0 + 0.16, Y1 - 0.16, 5):
        base.box((MIX - X0 - 0.1, 0.012, 0.1), ((X0 + MIX) / 2, yy, Z0 + 0.1), M["black"], rot=Matrix.Rotation(0.6, 4, "X"))
    for zz in np.linspace(Z0 + 0.12, Z1 - 0.12, 4):
        base.box((0.1, D - 0.2, 0.012), (X0 + 0.09, CY, zz), M["black"], rot=Matrix.Rotation(0.6, 4, "Y"))
    base.box((0.06, 0.49, 0.34), (X0 - 0.02, CY, ZC), M["black"])
    base.box((0.06, TW + 0.04, TH + 0.04), (X1 + 0.02, CY, ZC), M["black"])
    base.build(bevel=0.004, explode_sys=SYS, explode_ahu=[0.0, 0.0, 0.0], delay=0.0)

    top = Part("ahu_top", origin=(CX, CY, Z1))
    top.box((L, D, th), (CX, CY, Z1 - th / 2), M["ahu"])
    for xx in (MIX, FIL, COIL, FAN):
        top.box((0.04, D + 0.004, 0.006), (xx, CY, Z1 + 0.001), M["accent"])
    for xx in (X0 + 0.1, X1 - 0.1):
        for yy in (Y0 + 0.12, Y1 - 0.12):
            top.cyl(0.03, 0.05, (xx, yy, Z1 + 0.025), M["black"], seg=16)
    top.build(bevel=0.004, explode_sys=SYS, explode_ahu=[0.0, 0.0, 0.6], delay=0.0)

    # the filter and coil sections' panels lift off; the fan section has the hinged door
    for name, x0, x1, delay in (("ahu_panel_filter", MIX, FIL, 0.1), ("ahu_panel_coil", FIL, COIL, 0.15)):
        pn = Part(name, origin=((x0 + x1) / 2, Y0, ZC))
        pn.box((x1 - x0 - 0.04, th, H - 0.1), ((x0 + x1) / 2, Y0 + th / 2, ZC), M["ahu"])
        for dz in (-0.16, 0.16):
            pn.box((0.08, 0.025, 0.02), ((x0 + x1) / 2, Y0 - 0.012, ZC + dz), M["accent"])
        pn.build(bevel=0.003, explode_sys=SYS, explode_ahu=[0.0, -0.55, 0.0], delay=delay)

    HINGE = (COIL + 0.03, Y0 + 0.002, ZC)
    door = Part("ahu_door", origin=HINGE)
    dw, dh = FAN - COIL - 0.06, H - 0.106
    door.box((dw, 0.026, dh), (HINGE[0] + dw / 2, HINGE[1] + 0.012, ZC), M["ahu"])
    for dz in (-0.12, 0.12):
        door.box((0.02, 0.03, 0.1), (HINGE[0] + dw - 0.06, HINGE[1] - 0.012, ZC + dz), M["accent"])
        door.cyl(0.012, 0.03, (HINGE[0] + 0.006, HINGE[1] - 0.004, ZC + dz * 1.5), M["accent"], seg=10)
    door.build(bevel=0.003, explode_sys=SYS, explode_ahu=[0.0, -0.4, 0.0], delay=0.05)

    # bag filters behind a frame, a finned coil with its headers, a plug fan and its motor
    fb = Part("ahu_filter", origin=((MIX + FIL) / 2, CY, ZC))
    for zz in (Z0 + 0.06, Z1 - 0.06):
        fb.box((0.04, D - 0.1, 0.03), (MIX + 0.05, CY, zz), M["steel"])
    for yy in (Y0 + 0.06, Y1 - 0.06):
        fb.box((0.04, 0.03, H - 0.1), (MIX + 0.05, yy, ZC), M["steel"])
    for k, yy in enumerate(np.linspace(Y0 + 0.13, Y1 - 0.13, 6)):
        fb.rbox((0.46, 0.05, H - 0.17), (MIX + 0.3, yy, ZC), M["filter"], 0.018, rot=Matrix.Rotation((-1) ** k * 0.035, 4, "Z"))
    fb.build(explode_sys=SYS, explode_ahu=[0.0, -0.8, 0.12], delay=0.35)

    xc = (FIL + COIL) / 2
    coil = Part("ahu_coil", origin=(xc, CY, ZC))
    for k in range(36):
        coil.box((0.12, 0.004, H - 0.14), (xc, Y0 + 0.07 + k * (D - 0.14) / 35, ZC), M["fins"])
    for zz in np.linspace(Z0 + 0.12, Z1 - 0.12, 4):
        coil.cyl(0.011, D - 0.1, (xc - 0.03, CY, zz), M["copper"], axis="y", seg=12)
    for xx in (xc - 0.03, xc + 0.03):
        coil.cyl(0.02, H - 0.12, (xx, Y0 + 0.05, ZC), M["copper"], seg=14)
    coil.build(explode_sys=SYS, explode_ahu=[0.0, -0.6, 0.35], delay=0.25)

    fx, fy, fz = (COIL + FAN) / 2, Y0 + 0.32, ZC
    fan(Part, M, "ahu_fan", (fx, fy, fz), 0.22, 0.2, 18, explode_sys=SYS, explode_ahu=[0.0, -0.85, 0.0], delay=0.3)
    motor = Part("ahu_motor", origin=(fx, fy + 0.27, fz))
    motor.cyl(0.09, 0.22, (fx, fy + 0.27, fz), M["accent"], axis="y", seg=28)
    for i in range(8):
        a = 2 * math.pi * i / 8
        motor.box((0.006, 0.2, 0.02), (fx + math.cos(a) * 0.095, fy + 0.27, fz + math.sin(a) * 0.095), M["accent"],
                  rot=Matrix.Rotation(-a, 4, "Y"))
    foot = fz - 0.09 - (Z0 + th)
    motor.box((0.16, 0.2, foot), (fx, fy + 0.27, Z0 + th + foot / 2), M["black"])
    motor.build(bevel=0.003, explode_sys=SYS, explode_ahu=[0.35, -0.6, 0.0], delay=0.35)

    # outdoor air from the window wall, insulated, with the inlet damper's actuator
    oa = Part("outdoor_air", origin=((RX0 + X0) / 2, CY, ZC))
    oa.box((X0 - 0.05 - RX0, 0.45, 0.3), ((RX0 + X0 - 0.05) / 2, CY, ZC), M["duct_wrap"])
    oa.box((0.04, 0.5, 0.35), (RX0 + 0.02, CY, ZC), M["black"])
    oa.box((0.03, 0.47, 0.32), (X0 - 0.45, CY, ZC), M["accent"])
    oa.box((0.06, 0.456, 0.306), (X0 - 0.8, CY, ZC), M["mint"])
    oa.box((0.14, 0.08, 0.1), (X0 - 0.22, CY - 0.265, ZC), M["black"])
    oa.build(bevel=0.006, explode_sys=[-0.35, 0.0, 1.35], delay=0.2)

    # VAV box: a damper with its actuator, so each room takes the air it needs
    vav = Part("vav_box", origin=((V0 + V1) / 2, CY, ZC))
    vm = (V0 + V1) / 2
    vav.box((V1 - V0, TW, TH), (vm, CY, ZC), M["duct"])
    for xx in (V0 + 0.015, V1 - 0.015):
        vav.box((0.03, TW + 0.05, TH + 0.05), (xx, CY, ZC), M["accent"])
    vav.box((0.06, TW + 0.008, TH + 0.008), (vm + 0.2, CY, ZC), M["skyblue"])
    vav.cyl(0.02, 0.06, (vm - 0.05, CY - TW / 2 - 0.03, ZC), M["steel"], axis="y", seg=12)
    vav.box((0.18, 0.09, 0.13), (vm - 0.05, CY - TW / 2 - 0.075, ZC), M["black"])
    vav.box((0.05, 0.01, 0.03), (vm - 0.05, CY - TW / 2 - 0.123, ZC + 0.03), M["accent"])
    vav.build(bevel=0.004, explode_sys=[0.0, 0.0, 1.15], delay=0.15)

    # the trunk: along to the turn, then down the room in four lengths with flow arrows
    tx1 = TX + TW / 2
    t0 = Part("trunk_0", origin=((V1 + tx1) / 2, CY, ZC))
    t0.box((tx1 - V1, TW, TH), ((V1 + tx1) / 2, CY, ZC), M["duct"])
    t0.box((0.03, TW + 0.05, TH + 0.05), (V1 + 0.015, CY, ZC), M["accent"])
    t0.build(bevel=0.004, explode_sys=[0.0, 0.0, 1.0], delay=0.2)
    ys = np.linspace(CY - TW / 2, T_END, 5)
    for k in range(4):
        ya, yb = ys[k], ys[k + 1]
        t = Part(f"trunk_{k + 1}", origin=(TX, (ya + yb) / 2, ZC))
        t.box((TW, ya - yb - 0.004, TH), (TX, (ya + yb) / 2, ZC), M["duct"])
        t.box((TW + 0.05, 0.03, TH + 0.05), (TX, ya - 0.015, ZC), M["accent"])
        arrow_y(t, tx1, (ya + yb) / 2, ZC, -1, M["accent"])
        t.build(bevel=0.004, explode_sys=[0.0, (1.5 - k) * 0.3, 1.0], delay=0.2 + k * 0.06)

    # three branches across the room, under the trunk and over their slot diffusers
    for i, y in enumerate(ROWS):
        b = Part(f"branch_{i}", origin=(0.0, y, ZB))
        b.box((5.4, BW, BH), (0.0, y, ZB), M["duct"])
        for xx in (-1.2, 1.4):
            b.box((0.025, BW + 0.04, BH + 0.04), (xx, y, ZB), M["accent"])
        b.box((0.06, BW + 0.008, BH + 0.008), (-2.35, y, ZB), M["skyblue"])
        b.build(bevel=0.003, explode_sys=[0.0, 0.0, 0.6], delay=0.35 + 0.05 * i)

    if g["HVAC"]["sprinkler"]:
        sprinkler(g, -1.2, (-1.8, 0.0, 2.4))      # in front of the trunk's hangers, clear of the view onto the unit

    hang = Part("hangers")
    for xx in (X0 + 0.1, X1 - 0.1):
        for yy in (Y0 + 0.12, Y1 - 0.12):
            hang.cyl(0.007, SLAB_Z - Z1 - 0.05, (xx, yy, (SLAB_Z + Z1 + 0.05) / 2), M["steel"], seg=8)
    for y in (1.8, 0.3, -1.5):
        trapeze(hang, M, TX, y, ZC - TH / 2, TW, "y", SLAB_Z)
    for y in ROWS:
        for x in (-1.2, 0.5):
            trapeze(hang, M, x, y, BOX_TOP, BW, "x", SLAB_Z)
    trapeze(hang, M, -4.2, CY, ZC - 0.15, 0.45, "x", SLAB_Z)
    grid_wires(hang, M, (-3.0, -1.0, 0.5, 2.8), (-1.5, 0.3, 1.8), PZ + 0.03, SLAB_Z)
    hang.build(fade_explode=1)
