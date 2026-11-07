"""Furniture for the rooms other than the office.

build_scene.py builds the shell and the ceiling for every room (systems.py builds these rooms' HVAC);
these functions add a room's furniture under the `furniture` empty, so it casts and receives shadows
like the office's. Blender metres, Z up; the room spans x -5.2..5.2, y -4.6..3.6, and -Y is the open front
the camera looks in from. No lettering anywhere: words belong to the page, not the model.
"""
import math

import numpy as np
from mathutils import Matrix


def _ctx(g):
    return g["Part"], g["M"], g["furniture"], g["uvs"], g["rng"]


def plant(p, M, rng, x, y, z, r=0.07, leaves=9):
    """A small pot with trailing leaves, for shelf tops."""
    p.cyl(r, r * 1.3, (x, y, z + r * 0.65), M["pot"], seg=18)
    for _ in range(leaves):
        p.leaf((x, y, z + r * 1.3), rng.uniform(0.08, 0.12), 0.06, rng.uniform(0, 6.3), rng.uniform(-1.1, -0.3), M["pothos"])


def crayons(g):
    """Saturated colours for what children and pupils bring in: crayons, books, bags, drawings."""
    mat = g["material"]
    return [mat("crayon_red", "c8453b", 0.0, 0.45), mat("crayon_blue", "3c6fc2", 0.0, 0.45),
            mat("crayon_yellow", "efbe2e", 0.0, 0.45), mat("crayon_green", "4b9a52", 0.0, 0.45),
            mat("crayon_orange", "e57c32", 0.0, 0.45)]


def radiators(p, M, g):
    """A panel radiator under each window bay, on its pipes: how rooms are heated here."""
    RX0, RY0, RY1 = g["RX0"], g["RY0"], g["RY1"]
    bays = np.linspace(RY0, RY1, 7)
    x = RX0 + 0.27
    for y0, y1 in zip(bays, bays[1:]):
        yc = (y0 + y1) / 2
        p.rbox((0.1, 1.0, 0.5), (x, yc, 0.43), M["white_metal"], 0.012)
        for k in range(20):
            p.box((0.106, 0.012, 0.44), (x, yc - 0.475 + k * 0.05, 0.43), M["white_metal"])
        p.box((0.112, 0.98, 0.012), (x, yc, 0.68), M["grey"])
        for dy in (-0.54, 0.54):
            p.cyl(0.011, 0.2, (x - 0.03, yc + dy, 0.1), M["chrome"], seg=8)
        p.cyl(0.022, 0.06, (x - 0.03, yc + 0.54, 0.23), M["white_metal"], seg=12)


def wall_board(p, M, cork, colours, rng, wall, plane, u0, u1, z0, z1, kind):
    """A cork board with sheets pinned to it, on the back wall (plane is its y, facing -y) or the right
    wall (plane is its x, facing -x). kind "drawings": crayon suns, houses and scribbles; "charts":
    bar charts, a pie and photographs. Shapes only, never lettering."""
    turn = "Y" if wall == "back" else "X"

    def put(su, sz, u, z, mat, d, depth=0.003, angle=0.0):
        rot = Matrix.Rotation(angle, 4, turn) if angle else None
        if wall == "back":
            p.box((su, depth, sz), (u, plane - d, z), mat, rot=rot)
        else:
            p.box((depth, su, sz), (plane - d, u, z), mat, rot=rot)

    def disc(r, u, z, mat, d):
        if wall == "back":
            p.cyl(r, 0.003, (u, plane - d, z), mat, axis="y", seg=24)
        else:
            p.cyl(r, 0.003, (plane - d, u, z), mat, axis="x", seg=24)

    put(u1 - u0, z1 - z0, (u0 + u1) / 2, (z0 + z1) / 2, cork, 0.008, depth=0.016)
    for (su, sz, u, z) in ((u1 - u0 + 0.04, 0.03, (u0 + u1) / 2, z0), (u1 - u0 + 0.04, 0.03, (u0 + u1) / 2, z1),
                           (0.03, z1 - z0, u0, (z0 + z1) / 2), (0.03, z1 - z0, u1, (z0 + z1) / 2)):
        put(su, sz, u, z, M["wood"], 0.012, depth=0.024)
    cols = int((u1 - u0) / 0.36)
    for c in range(cols):
        for r in range(2):
            u = u0 + (c + 0.5) * (u1 - u0) / cols + rng.uniform(-0.03, 0.03)
            z = z0 + (r + 0.5) * (z1 - z0) / 2 + rng.uniform(-0.03, 0.03)
            tilt = rng.uniform(-0.06, 0.06)
            w, h = (0.297, 0.21) if (c + r) % 3 == 0 else (0.21, 0.297)
            put(w, h, u, z, M["board"], 0.018, angle=tilt)
            disc(0.006, u, z + h / 2 - 0.02, colours[(c + r) % len(colours)], 0.022)          # the pin
            pick = colours[int(rng.integers(0, len(colours)))]
            if kind == "drawings":
                disc(0.03, u + w * 0.25, z + h * 0.28, colours[2], 0.021)                     # sun
                put(0.07, 0.06, u - w * 0.12, z - h * 0.12, pick, 0.021)                      # house
                put(0.06, 0.06, u - w * 0.12, z - h * 0.12 + 0.05, colours[0], 0.0205, angle=math.pi / 4)  # its roof, behind it
                put(w * 0.8, 0.015, u, z - h * 0.36, colours[3], 0.021)                       # ground
            else:
                if (c + r) % 2:
                    for k in range(4):
                        bh = rng.uniform(0.04, 0.14)
                        put(0.03, bh, u - 0.06 + k * 0.04, z - h * 0.3 + bh / 2, colours[k % len(colours)], 0.021)
                else:
                    disc(0.06, u, z + 0.02, pick, 0.021)
                    put(w * 0.7, 0.05, u, z - h * 0.3, M["grey"], 0.021)


def backpack(p, M, x, y, z, yaw, mat, lean=0.0, k=1.0):
    """A school bag standing on the floor (or hanging, with z its bottom), its front pocket towards yaw + 90°;
    k scales it (0.75 for a child's)."""
    R = Matrix.Rotation(yaw, 4, "Z") @ Matrix.Rotation(lean, 4, "X")
    c, s = math.cos(yaw), math.sin(yaw)
    p.rbox((0.3 * k, 0.17 * k, 0.38 * k), (x, y, z + 0.19 * k), mat, 0.05 * k, rot=R)
    p.rbox((0.24 * k, 0.06 * k, 0.17 * k), (x - s * 0.1 * k, y + c * 0.1 * k, z + 0.12 * k), mat, 0.03 * k, rot=R)
    p.tube([(x - c * 0.06 * k, y - s * 0.06 * k, z + 0.37 * k), (x, y, z + 0.43 * k), (x + c * 0.06 * k, y + s * 0.06 * k, z + 0.37 * k)],
           0.012, M["plastic"], seg=6)


def floor_plant(p, M, rng, x, y, r=0.22, h=0.45, leaves=34):
    """A big pot on the floor with a leafy plant."""
    p.cyl(r, h, (x, y, h / 2), M["pot"], seg=24, r2=r * 0.85)
    for _ in range(leaves):
        p.leaf((x + rng.uniform(-0.08, 0.08), y + rng.uniform(-0.08, 0.08), h + rng.uniform(0.0, 0.9)), rng.uniform(0.24, 0.34),
               rng.uniform(0.15, 0.2), rng.uniform(0, 6.3), rng.uniform(-0.3, 0.6), M["fig"], fold=0.18)


# ---------------------------------------------------------------- kindergarten
def kid_chair(p, M, x, y, yaw, mat):
    """A small stacking chair (seat at 0.30 m) whose sitter faces the direction yaw."""
    c, s = math.cos(yaw), math.sin(yaw)
    for lx, ly in ((0.11, 0.11), (0.11, -0.11), (-0.11, 0.11), (-0.11, -0.11)):
        p.cyl(0.011, 0.285, (x + c * lx - s * ly, y + s * lx + c * ly, 0.1425), M["chrome"], seg=8)
    rot = Matrix.Rotation(yaw, 4, "Z")
    p.rbox((0.29, 0.29, 0.03), (x, y, 0.3), mat, 0.012, rot=rot)
    p.rbox((0.03, 0.28, 0.2), (x - c * 0.14, y - s * 0.14, 0.45), mat, 0.012, rot=rot @ Matrix.Rotation(-0.12, 4, "Y"))


def kid_table(p, M, uvs, x, y, w, d, round_=False):
    """A table at a child's height (0.52 m), oak top on white legs."""
    h = 0.52
    if round_:
        p.cyl(w / 2, 0.03, (x, y, h - 0.015), M["wood"], seg=48, uv=uvs("wood", "x"))
        for a in (0.4, 2.5, 4.6):
            p.cyl(0.02, h - 0.03, (x + math.cos(a) * w * 0.3, y + math.sin(a) * w * 0.3, (h - 0.03) / 2), M["white"], seg=10)
        return
    p.rbox((w, d, 0.03), (x, y, h - 0.015), M["wood"], 0.01, uv=uvs("wood", "x"))
    for sx in (-1, 1):
        for sy in (-1, 1):
            p.cyl(0.02, h - 0.03, (x + sx * (w / 2 - 0.07), y + sy * (d / 2 - 0.07), (h - 0.03) / 2), M["white"], seg=10)


def kindergarten(g):
    """A kindergarten group room: low tables by the window, a play rug with soft blocks and a slide,
    toy cubbies along the back wall, coat lockers along the right wall."""
    Part, M, furniture, uvs, rng = _ctx(g)
    pastel = [M["mint"], M["peach"], M["butter"], M["skyblue"], M["lilac"]]

    t = Part("kids_tables")
    for n, (x, y) in enumerate(((-2.75, -1.25), (-2.75, 1.05))):
        kid_table(t, M, uvs, x, y, 1.3, 0.62)
        for k, (cx, cy, yaw) in enumerate((
            (x - 0.33, y - 0.52, math.pi / 2), (x + 0.33, y - 0.52, math.pi / 2),
            (x - 0.33, y + 0.52, -math.pi / 2), (x + 0.33, y + 0.52, -math.pi / 2),
        )):
            kid_chair(t, M, cx, cy, yaw, pastel[(k + 2 * n) % 5])
    kid_table(t, M, uvs, 0.25, 0.2, 1.1, 1.1, round_=True)
    for k in range(5):
        a = 2 * math.pi * k / 5 + 0.3
        kid_chair(t, M, 0.25 + math.cos(a) * 0.78, 0.2 + math.sin(a) * 0.78, a + math.pi, pastel[k])
    t.build(parent=furniture, bevel=0.002)

    # the play corner: a rug with a border and play spots, soft blocks, bean bags and a toddler slide
    r = Part("play_corner")
    RCX, RCY, RW, RD = 3.2, -0.9, 3.0, 2.8
    r.box((RW, RD, 0.012), (RCX, RCY, 0.008), M["rug"])
    for dy in (-1, 1):
        r.box((RW - 0.24, 0.07, 0.004), (RCX, RCY + dy * (RD / 2 - 0.12), 0.016), M["mint"])
    for dx in (-1, 1):
        r.box((0.07, RD - 0.24, 0.004), (RCX + dx * (RW / 2 - 0.12), RCY, 0.016), M["mint"])
    for k, (x, y) in enumerate(((2.35, -1.7), (3.25, -1.1), (4.1, -1.75))):
        r.cyl(0.3, 0.004, (x, y, 0.017), pastel[(k + 1) % 5], seg=40)
    for k, (x, y, z) in enumerate(((2.5, -0.2, 0.15), (2.85, -0.05, 0.15), (2.68, -0.12, 0.45), (3.6, -1.5, 0.15), (2.3, -2.05, 0.15))):
        r.rbox((0.3, 0.3, 0.3), (x, y, z), pastel[k % 5], 0.05, rot=Matrix.Rotation(rng.uniform(-0.4, 0.4), 4, "Z"))
    r.ball(0.36, (4.05, -0.35, 0.2), M["peach"], scale=(1.0, 1.0, 0.55), subdiv=3)
    r.ball(0.33, (4.25, -1.05, 0.18), M["lilac"], scale=(1.0, 1.0, 0.55), subdiv=3)
    # slide: platform on four posts, three steps behind, a ramp down towards the front
    SX, SY = 3.55, 1.55
    for dx in (-0.25, 0.25):
        for dy in (-0.25, 0.25):
            r.cyl(0.03, 0.72, (SX + dx, SY + dy, 0.36), M["white"], seg=12)
    r.box((0.56, 0.56, 0.05), (SX, SY, 0.72), M["butter"])
    for k in range(3):
        r.box((0.5, 0.16, 0.035), (SX, SY + 0.36 + k * 0.17, 0.18 + k * 0.18), M["skyblue"])
    tilt = Matrix.Rotation(-math.atan2(0.68, 1.25), 4, "X")
    r.box((0.46, 1.42, 0.04), (SX, SY - 0.9, 0.39), M["skyblue"], rot=tilt)
    for dx in (-0.25, 0.25):
        r.box((0.04, 1.42, 0.1), (SX + dx, SY - 0.9, 0.44), M["skyblue"], rot=tilt)
        r.tube([(SX + dx, SY + 0.28, 0.75), (SX + dx, SY + 0.28, 1.05), (SX + dx, SY - 0.28, 1.05), (SX + dx, SY - 0.28, 0.75)], 0.018, M["white"], seg=8)
    r.build(parent=furniture, bevel=0.002)

    # toy cubbies along the back wall, pastel bins in most of them, discs on the wall above
    c = Part("cubbies")
    X0, X1, Y0, Y1, H = -4.8, -0.4, 3.24, 3.58, 0.92
    COLS, ROWS = 8, 3
    cw = (X1 - X0) / COLS
    c.box((X1 - X0, Y1 - Y0, 0.035), ((X0 + X1) / 2, (Y0 + Y1) / 2, H - 0.0175), M["wood"], uv=uvs("wood", "x"))
    c.box((X1 - X0, Y1 - Y0, 0.06), ((X0 + X1) / 2, (Y0 + Y1) / 2, 0.03), M["white"])
    for k in range(1, ROWS):
        c.box((X1 - X0, Y1 - Y0, 0.022), ((X0 + X1) / 2, (Y0 + Y1) / 2, 0.06 + k * (H - 0.06) / ROWS), M["white"])
    for k in range(COLS + 1):
        c.box((0.022, Y1 - Y0, H - 0.035), (X0 + k * cw, (Y0 + Y1) / 2, (H - 0.035) / 2), M["white"])
    for col in range(COLS):
        for row in range(ROWS):
            if rng.random() < 0.7:
                z0 = 0.06 + row * (H - 0.06) / ROWS
                c.rbox((cw - 0.07, 0.28, 0.2), (X0 + (col + 0.5) * cw, (Y0 + Y1) / 2 - 0.02, z0 + 0.12), pastel[int(rng.integers(0, 5))], 0.015)
    for k, (x, z, rr) in enumerate(((-4.2, 1.55, 0.32), (-3.3, 2.05, 0.42), (-2.25, 1.5, 0.28), (-1.35, 1.95, 0.36), (-0.6, 1.45, 0.22))):
        c.cyl(rr, 0.012, (x, 3.585, z), pastel[(k + 3) % 5], axis="y", seg=48)
    plant(c, M, rng, -4.55, 3.41, H)
    plant(c, M, rng, -0.75, 3.41, H)
    c.build(parent=furniture, bevel=0.002)

    # coat lockers along the right wall: an open shelf above each pastel door, a hook between
    lk = Part("lockers")
    LX0, LX1 = 4.86, 5.19
    edges = np.linspace(-3.4, 2.6, 13)
    lk.box((LX1 - LX0, edges[-1] - edges[0], 0.04), ((LX0 + LX1) / 2, (edges[0] + edges[-1]) / 2, 1.3), M["wood"], uv=uvs("wood"))
    lk.box((LX1 - LX0, edges[-1] - edges[0], 0.06), ((LX0 + LX1) / 2, (edges[0] + edges[-1]) / 2, 0.03), M["white"])
    lk.box((LX1 - LX0, edges[-1] - edges[0], 0.02), ((LX0 + LX1) / 2, (edges[0] + edges[-1]) / 2, 0.95), M["white"])
    for y in edges:
        lk.box((LX1 - LX0, 0.02, 1.28), ((LX0 + LX1) / 2, y, 0.65), M["white"])
    for k in range(12):
        y0, y1 = edges[k] + 0.012, edges[k + 1] - 0.012
        lk.box((0.015, y1 - y0, 0.84), (LX0 - 0.008, (y0 + y1) / 2, 0.5), pastel[k % 5])
        lk.cyl(0.012, 0.06, (LX0 - 0.02, (y0 + y1) / 2, 1.12), M["chrome"], axis="x", seg=8)
    lk.build(parent=furniture, bevel=0.002)

    # what makes it lived in: radiators, the children's drawings, their bags, crayons, toys and books
    colours = crayons(g)
    cork = g["material"]("cork", "b88d5f", 0.0, 0.9)
    rad = Part("radiators")
    radiators(rad, M, g)
    rad.build(parent=furniture, bevel=0.002)

    wb = Part("drawings_board")
    wall_board(wb, M, cork, colours, rng, "back", g["RY1"], 0.3, 2.7, 1.0, 1.8, "drawings")
    wb.build(parent=furniture)

    bags = Part("kids_bags")
    for k in (1, 4, 6, 9, 11):
        backpack(bags, M, LX0 - 0.1, (edges[k] + edges[k + 1]) / 2, 0.66, math.pi / 2, colours[k % 5], k=0.7)
    bags.build(parent=furniture, bevel=0.002)

    tt = Part("table_things")
    for x, y in ((-2.75, -1.25), (-2.75, 1.05)):
        for k in range(3):
            sx, sy = x + (k - 1) * 0.42 + rng.uniform(-0.04, 0.04), y + rng.uniform(-0.1, 0.1)
            rot = Matrix.Rotation(rng.uniform(-0.5, 0.5), 4, "Z")
            tt.box((0.21, 0.297, 0.002), (sx, sy, 0.521), M["board"], rot=rot)
            tt.cyl(0.03, 0.002, (sx + 0.04, sy + 0.08, 0.523), colours[2], seg=20)
            tt.box((0.08, 0.06, 0.002), (sx - 0.03, sy - 0.03, 0.523), colours[int(rng.integers(0, 5))], rot=rot)
            tt.box((0.17, 0.012, 0.002), (sx, sy - 0.1, 0.523), colours[3], rot=rot)
        cx, cy = x + 0.5, y + 0.18                                            # a cup of crayons
        tt.cyl(0.04, 0.09, (cx, cy, 0.565), M["mint"], seg=16)
        for k in range(6):
            a = k * 1.05
            tt.cyl(0.005, 0.11, (cx + math.cos(a) * 0.018, cy + math.sin(a) * 0.018, 0.6), colours[k % 5], seg=6,
                   direction=(math.cos(a) * 0.15, math.sin(a) * 0.15, 1.0))
        for k in range(3):                                                    # and a few loose ones
            tt.cyl(0.005, 0.09, (x + rng.uniform(-0.5, 0.3), y + rng.uniform(-0.2, 0.2), 0.526), colours[int(rng.integers(0, 5))], seg=6,
                   direction=(math.cos(k * 2.1), math.sin(k * 2.1), 0.0))
    tt.box((0.42, 0.32, 0.006), (0.25, 0.2, 0.523), M["white"])               # a puzzle on the round table
    for i in range(4):
        for j in range(3):
            tt.box((0.095, 0.095, 0.008), (0.1 + i * 0.1, 0.1 + j * 0.1, 0.528), colours[(i + 2 * j) % 5])
    x = -3.45                                                                  # picture books on the cubbies
    for k in range(int(rng.integers(10, 14))):
        w, hgt = rng.uniform(0.018, 0.035), rng.uniform(0.2, 0.28)
        tt.box((w, 0.2, hgt), (x + w / 2, 3.42, 0.92 + hgt / 2), colours[int(rng.integers(0, 5))] if k % 3 else pastel[k % 5])
        x += w + 0.004
    for k in range(3):
        tt.box((0.26, 0.2, 0.025), (-1.75, 3.42, 0.9325 + k * 0.026), (colours + pastel)[k * 3 % 10], rot=Matrix.Rotation(0.1 * k, 4, "Z"))
    tt.build(parent=furniture, bevel=0.001)

    ty = Part("toys")
    TX, TY = 2.55, -1.35                                                       # a stacking ring tower
    ty.cyl(0.09, 0.03, (TX, TY, 0.03), colours[1], seg=24)
    ty.cyl(0.012, 0.3, (TX, TY, 0.18), M["wood"], seg=8)
    for k, rr in enumerate((0.085, 0.075, 0.065, 0.055, 0.045)):
        ty.cyl(rr, 0.044, (TX, TY, 0.07 + k * 0.047), colours[k % 5], seg=24)
    CX, CY, yaw = 3.7, -2.0, 0.6                                               # a toy car
    car_rot = Matrix.Rotation(yaw, 4, "Z")
    ty.rbox((0.22, 0.11, 0.06), (CX, CY, 0.06), colours[0], 0.02, rot=car_rot)
    ty.rbox((0.1, 0.09, 0.05), (CX - 0.02 * math.cos(yaw), CY - 0.02 * math.sin(yaw), 0.105), colours[0], 0.02, rot=car_rot)
    for fx in (-0.07, 0.07):
        for fy in (-0.06, 0.06):
            ty.cyl(0.025, 0.02, (CX + fx * math.cos(yaw) - fy * math.sin(yaw), CY + fx * math.sin(yaw) + fy * math.cos(yaw), 0.04), M["plastic"],
                   seg=12, direction=(-math.sin(yaw), math.cos(yaw), 0.0))
    ty.ball(0.09, (2.3, -0.75, 0.1), colours[0], subdiv=3)
    ty.ball(0.11, (4.3, -2.05, 0.12), colours[1], subdiv=3)
    taken = [(2.5, -0.2), (2.85, -0.05), (2.68, -0.12), (3.6, -1.5), (2.3, -2.05), (4.05, -0.35), (4.25, -1.05), (TX, TY), (CX, CY),
             (2.3, -0.75), (4.3, -2.05)]
    placed = 0
    while placed < 12:                                                         # small blocks, clear of everything else
        bx, by = rng.uniform(2.1, 4.3), rng.uniform(-2.1, -0.3)
        if min(math.hypot(bx - ox, by - oy) for ox, oy in taken) < 0.3:
            continue
        taken.append((bx, by))
        ty.box((0.06, 0.06, 0.06), (bx, by, 0.046), colours[placed % 5], rot=Matrix.Rotation(rng.uniform(0, 1.5), 4, "Z"))
        placed += 1
    ty.build(parent=furniture, bevel=0.003)


# ---------------------------------------------------------------- school
def school_chair(p, M, x, y, yaw):
    """A classroom chair (seat at 0.45 m) on a black steel frame, facing the direction yaw."""
    c, s = math.cos(yaw), math.sin(yaw)
    for lx, ly in ((0.17, 0.17), (0.17, -0.17), (-0.17, 0.17), (-0.17, -0.17)):
        p.cyl(0.011, 0.44, (x + c * lx - s * ly, y + s * lx + c * ly, 0.22), M["black"], seg=8)
    rot = Matrix.Rotation(yaw, 4, "Z")
    p.rbox((0.4, 0.4, 0.03), (x, y, 0.455), M["seat"], 0.012, rot=rot)
    bx, by = x - c * 0.2, y - s * 0.2
    p.rbox((0.03, 0.38, 0.27), (bx, by, 0.72), M["seat"], 0.012, rot=rot @ Matrix.Rotation(-0.1, 4, "Y"))
    for side in (-1, 1):
        p.cyl(0.01, 0.3, (bx - s * side * 0.17, by + c * side * 0.17, 0.6), M["black"], seg=8)


def school_desk(p, M, uvs, x, y):
    """A two-seat classroom desk (1.2 x 0.5 m, top at 0.75 m): oak top, black frame, a book shelf below."""
    p.rbox((1.2, 0.5, 0.025), (x, y, 0.7375), M["wood"], 0.006, uv=uvs("wood", "x"))
    for sx in (-1, 1):
        p.box((0.04, 0.46, 0.04), (x + sx * 0.55, y, 0.02), M["black"])
        p.box((0.04, 0.04, 0.7), (x + sx * 0.55, y, 0.375), M["black"])
    p.box((1.06, 0.36, 0.012), (x, y + 0.03, 0.6), M["black"])


def school(g):
    """A classroom: twelve two-seat desks facing a whiteboard on the back wall, the teacher's desk
    beside it, low cabinets along the right wall, a projector under the ceiling."""
    Part, M, furniture, uvs, rng = _ctx(g)
    LOW = g["LOW"]

    d = Part("classroom_desks")
    for x in (-3.0, -0.3, 2.4):
        for y in (1.3, -0.1, -1.5, -2.9):
            school_desk(d, M, uvs, x, y + rng.uniform(-0.03, 0.03))
            for sx in (-0.3, 0.3):
                school_chair(d, M, x + sx, y - 0.5 + rng.uniform(-0.06, 0.04), math.pi / 2 + rng.uniform(-0.12, 0.12))
    d.build(parent=furniture, bevel=0.002)

    # whiteboard with a duct sketched in blue marker: the system's shape, no words
    b = Part("whiteboard")
    BX = 0.3
    b.box((3.8, 0.035, 1.37), (BX, 3.575, 1.535), M["grey"])
    b.box((3.7, 0.01, 1.27), (BX, 3.553, 1.535), M["board"])
    b.box((3.0, 0.09, 0.03), (BX, 3.53, 0.86), M["grey"])
    # the sketch is the plan of systems.school() above it: the unit, the trunk, three branches and their slots
    Y, S, ink = 3.546, 0.45, M["ink_blue"]

    def hline(x0, x1, z):
        b.box((x1 - x0, 0.004, 0.012), ((x0 + x1) / 2, Y, z), ink)

    def vline(x, z0, z1):
        b.box((0.012, 0.004, z1 - z0), (x, Y, (z0 + z1) / 2), ink)

    ux0, ux1, tx = BX - 3.0 * S, BX - 0.25 * S, BX + 1.05 * S
    for z in (1.93, 2.05):
        hline(ux0, ux1, z)
    for x in (ux0, ux1):
        vline(x, 1.93, 2.05)
    for z in (1.965, 2.015):
        hline(ux1, tx + 0.03, z)
    for dx in (-0.03, 0.03):
        vline(tx + dx, 1.295, 2.015 if dx > 0 else 1.965)
    for z in (1.80, 1.56, 1.32):
        for dz in (-0.025, 0.025):
            hline(BX - 2.7 * S, BX + 2.7 * S, z + dz)
        for x in (-2.1, -0.3, 2.1):
            b.box((0.48, 0.004, 0.022), (BX + x * S, Y, z - 0.065), ink)
    b.build(parent=furniture)

    # teacher's desk beside the board, a laptop on it, the chair behind
    td = Part("teacher_desk")
    TX, TY = 3.05, 2.45
    td.box((1.4, 0.7, 0.03), (TX, TY, 0.745), M["white"])
    for sx in (-1, 1):
        td.box((0.03, 0.66, 0.73), (TX + sx * 0.68, TY, 0.365), M["white"])
    td.box((1.34, 0.02, 0.5), (TX, TY - 0.32, 0.45), M["white_panel"])
    td.rbox((0.32, 0.22, 0.012), (TX - 0.2, TY + 0.05, 0.766), M["grey"], 0.004)
    td.rbox((0.32, 0.012, 0.21), (TX - 0.2, TY + 0.16, 0.87), M["plastic"], 0.004, rot=Matrix.Rotation(-0.25, 4, "X"))
    school_chair(td, M, TX + 0.1, TY + 0.6, -math.pi / 2)
    td.build(parent=furniture, bevel=0.002)

    # low cabinets along the right wall, with books, a globe and a plant on top
    cb = Part("cabinets")
    CX0, CX1, CY0, CY1, CH = 4.78, 5.18, -3.6, 1.8, 0.9
    cb.box((CX1 - CX0, CY1 - CY0, CH), ((CX0 + CX1) / 2, (CY0 + CY1) / 2, CH / 2), M["white_panel"])
    cb.box((CX1 - CX0 + 0.03, CY1 - CY0 + 0.03, 0.03), ((CX0 + CX1) / 2, (CY0 + CY1) / 2, CH + 0.015), M["wood"], uv=uvs("wood"))
    for k, y in enumerate(np.linspace(CY0, CY1, 10)[:-1]):
        y1 = y + (CY1 - CY0) / 9
        cb.box((0.006, 0.004, CH - 0.08), (CX0 - 0.003, y1, CH / 2), M["grey"])
        cb.box((0.012, 0.012, 0.12), (CX0 - 0.012, y1 - 0.06 if k % 2 else y + 0.06, CH - 0.15), M["grey"])
    x = CX0 + 0.2
    y = CY0 + 0.25
    for k in range(int(rng.integers(9, 14))):
        w, h = rng.uniform(0.02, 0.045), rng.uniform(0.2, 0.3)
        cb.box((0.22, w, h), (x, y + w / 2, CH + 0.03 + h / 2), M[("book1", "book2", "book3", "book4")[int(rng.integers(0, 4))]])
        y += w + 0.004
    GX, GY = CX0 + 0.2, -0.6
    cb.cyl(0.07, 0.02, (GX, GY, CH + 0.04), M["black"], seg=24)
    cb.cyl(0.012, 0.16, (GX, GY, CH + 0.13), M["black"], seg=8)
    cb.ball(0.15, (GX, GY, CH + 0.37), M["globe"], subdiv=3)
    for k in range(5):
        a, e = rng.uniform(0, 6.3), rng.uniform(-0.6, 0.7)
        cb.ball(0.06, (GX + math.cos(a) * math.cos(e) * 0.13, GY + math.sin(a) * math.cos(e) * 0.13, CH + 0.37 + math.sin(e) * 0.13),
                M["globe_land"], scale=(1.0, 0.8, 0.45))
    cb.tube([(GX + 0.17 * math.cos(t), GY, CH + 0.37 + 0.17 * math.sin(t)) for t in np.linspace(-1.9, 1.9, 16)], 0.006, M["black"], seg=6)
    plant(cb, M, rng, CX0 + 0.2, 1.4, CH + 0.03, r=0.09, leaves=12)
    cb.build(parent=furniture, bevel=0.002)

    # wall clock (no numerals) and the projector hanging from the ceiling grid
    misc = Part("clock_projector")
    misc.cyl(0.2, 0.04, (-3.4, 3.575, 2.3), M["black"], axis="y", seg=48)
    misc.cyl(0.18, 0.01, (-3.4, 3.553, 2.3), M["board"], axis="y", seg=48)
    misc.box((0.012, 0.004, 0.12), (-3.4, 3.545, 2.35), M["black"])
    misc.box((0.09, 0.004, 0.012), (-3.36, 3.545, 2.3), M["black"])
    PX, PY = BX, 0.4
    misc.cyl(0.015, LOW - 2.55, (PX, PY, (LOW + 2.55) / 2), M["grey"], seg=8)
    misc.rbox((0.32, 0.28, 0.1), (PX, PY, 2.5), M["white"], 0.02)
    misc.cyl(0.04, 0.03, (PX, PY + 0.15, 2.5), M["plastic"], axis="y", seg=20)
    misc.cyl(0.15, 0.36, (3.95, 2.0, 0.18), M["grey"], seg=24, r2=0.16)       # waste bin by the teacher's desk
    misc.cyl(0.14, 0.004, (3.95, 2.0, 0.357), M["black"], seg=24)
    misc.build(parent=furniture, bevel=0.002)

    # what makes it lived in: radiators, books and bags, a pin board, a map, the door, a plant
    colours = crayons(g)
    material = g["material"]
    cork = material("cork", "b88d5f", 0.0, 0.9)
    sea, land = material("map_sea", "a8c6e0", 0.0, 0.6), material("map_land", "d8c690", 0.0, 0.7)
    rad = Part("radiators")
    radiators(rad, M, g)
    rad.build(parent=furniture, bevel=0.002)

    dt = Part("desk_things")
    bags = Part("school_bags")
    for x in (-3.0, -0.3, 2.4):
        for y in (1.3, -0.1, -1.5, -2.9):
            for sx in (-0.3, 0.3):
                px = x + sx + rng.uniform(-0.05, 0.05)
                roll = rng.random()
                if roll < 0.45:                                                  # an open book on its cover
                    cover = colours[int(rng.integers(0, 5))]
                    dt.box((0.36, 0.25, 0.004), (px, y + 0.03, 0.752), cover)
                    for side in (-1, 1):
                        dt.box((0.17, 0.24, 0.012), (px + side * 0.088, y + 0.03, 0.759), M["board"], rot=Matrix.Rotation(side * 0.05, 4, "Y"))
                elif roll < 0.8:                                                 # a closed exercise book and a pen
                    yaw = rng.uniform(-0.4, 0.4)
                    dt.box((0.17, 0.24, 0.008), (px, y + 0.02, 0.754), colours[int(rng.integers(0, 5))], rot=Matrix.Rotation(yaw, 4, "Z"))
                    dt.cyl(0.004, 0.14, (px + 0.12, y + 0.02, 0.755), M["ink_blue"], seg=6, direction=(math.sin(yaw), math.cos(yaw), 0.0))
                if rng.random() < 0.4:                                           # a pencil case
                    dt.rbox((0.2, 0.07, 0.05), (px + rng.uniform(-0.05, 0.05), y - 0.17, 0.775), colours[int(rng.integers(0, 5))], 0.02,
                            rot=Matrix.Rotation(rng.uniform(-0.2, 0.2), 4, "Z"))
                if rng.random() < 0.2:                                           # a water bottle
                    dt.cyl(0.034, 0.22, (px + 0.22 * (1 if sx < 0 else -1), y + 0.15, 0.86), M["skyblue"], seg=16)
                    dt.cyl(0.02, 0.03, (px + 0.22 * (1 if sx < 0 else -1), y + 0.15, 0.985), M["plastic"], seg=12)
                if rng.random() < 0.42:                                          # a bag by the desk, in the aisle
                    side = 1 if sx > 0 else -1
                    backpack(bags, M, x + side * 0.72, y + rng.uniform(-0.15, 0.1), 0.0, side * math.pi / 2 + rng.uniform(-0.3, 0.3),
                             colours[int(rng.integers(0, 5))] if rng.random() < 0.7 else M["seat"], lean=rng.uniform(0.0, 0.2))
    dt.build(parent=furniture, bevel=0.001)
    bags.build(parent=furniture, bevel=0.002)

    wb = Part("pin_board")
    wall_board(wb, M, cork, colours, rng, "right", g["RX1"], -3.3, -0.95, 1.15, 1.95, "charts")
    wb.build(parent=furniture)

    # a world map under the clock: a sea panel and flat land shapes, no names
    wm = Part("world_map")
    MX, MZ, MW, MH = -3.4, 1.45, 2.3, 1.0
    wm.box((MW + 0.05, 0.02, MH + 0.05), (MX, 3.59, MZ), M["black"])
    wm.box((MW, 0.012, MH), (MX, 3.574, MZ), sea)
    for u, z, su, sz in ((-0.75, 0.2, 0.2, 0.17), (-0.6, -0.2, 0.1, 0.24), (-0.05, 0.25, 0.1, 0.08), (0.0, -0.08, 0.13, 0.22),
                         (0.42, 0.18, 0.38, 0.18), (0.68, -0.28, 0.13, 0.08), (-0.35, 0.38, 0.08, 0.06)):
        wm.ball(1.0, (MX + u, 3.566, MZ + z), land, scale=(su, 0.004, sz), subdiv=3)
    wm.build(parent=furniture)

    # the door on the right wall: architrave, an oak leaf with a vision panel, lever and kick plate
    dr = Part("door")
    DY0, DY1, DH, xw = 2.4, 3.3, 2.1, g["RX1"]
    dr.box((0.03, DY1 - DY0 + 0.16, DH + 0.08), (xw - 0.015, (DY0 + DY1) / 2, (DH + 0.08) / 2), M["white_panel"])
    dr.box((0.045, DY1 - DY0, DH), (xw - 0.04, (DY0 + DY1) / 2, DH / 2), M["wood"], uv=uvs("wood", "z"))
    dr.box((0.012, 0.18, 0.62), (xw - 0.066, DY0 + 0.25, 1.45), M["tv"])
    dr.box((0.03, 0.14, 0.02), (xw - 0.085, DY1 - 0.12, 1.0), M["chrome"])
    dr.cyl(0.022, 0.025, (xw - 0.072, DY1 - 0.06, 1.0), M["chrome"], axis="x", seg=12)
    dr.box((0.006, DY1 - DY0 - 0.04, 0.1), (xw - 0.065, (DY0 + DY1) / 2, 0.07), M["chrome"])
    dr.build(parent=furniture, bevel=0.002)

    fp = Part("floor_plant")
    floor_plant(fp, M, rng, -4.45, -4.15)
    fp.build(parent=furniture)
