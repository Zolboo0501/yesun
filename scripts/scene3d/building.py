"""A multi-storey building in section, with the ventilation that serves it: the home page's fourth scene.

build_scene.py loads the spec, the materials and the Part API, then calls build(globals()) when the
spec says "room": "building", exports the GLB and exits. Blender metres, Z up; -Y is the cut the
camera looks in through, so the building is open toward it like a section drawing.

What it holds:
  site, trees,   the street around the building: pavers, a road with its markings and curbs, lawns,
  context        street trees and lamps, two cars on the road, three neighbouring blocks in the
                 distance, and the cut earth around the parking level. All fade in the exploded view.
  slab           the concrete structure (slabs, basement walls, columns, the core and the shaft, the
                 parapet), one material, so the web template can fade it to leave the system alone
  glass, facade  a curtain wall on three faces: vision glass floor to ceiling, spandrel glass over each
                 slab, mullions, transoms and aluminium fins, the entrance canopy and doors, the coping
  furniture      floor finishes, offices with glass meeting rooms and plants, the lobby, lift doors,
                 the parking level's cars, wheel stops, column guards and lights, the roof membrane
  ceiling_reveal one suspended ceiling and one set of light fittings per floor; they fade to show the
                 branch ducts above
  HVAC           rooftop air handling unit (ahu_door, ahu_fan), condensers and an exhaust fan; three
                 risers in a shaft; on every floor a supply tree (fire damper, volume control box, a
                 main that steps down, branches to six square diffusers) and a return main over four
                 grilles, taped sky and butter; an air curtain over the entrance; jet fans and an
                 exhaust duct in the parking level. Explode extras pull each floor's network toward
                 the camera and lift the roof plant; a `floor` extra on each level's parts (0 = ground,
                 -1 = parking, 5 = roof plant) lets the web template bring one floor forward and dim the rest.
Everything but the structure and the HVAC carries fade_explode (glass included), so the web template can
fade it to leave the system, either pulled apart or in place inside a ghosted structure.
No lettering anywhere: signs, plates and markings are plain shapes.
"""
import math

import numpy as np
from mathutils import Matrix, Vector

X0, X1, Y0, Y1 = -7.0, 7.0, -5.0, 5.0      # footprint; Y0 is the cut
LEVELS = (0.0, 3.6, 7.2, 10.8, 14.4)       # floor slabs above ground (tops)
B1 = -3.6                                   # the parking floor
ROOF = 18.0
SLAB = 0.3
WALL = 0.25
CEIL_H = 2.85                               # suspended ceiling above each floor
DUCT_Z = 3.1                                # branch ducts run in the void above it
SHAFT_X0, SHAFT_X1, SHAFT_Y0 = 1.4, 3.6, 3.6
CORE_X0, CORE_Y0 = 3.6, 1.8                 # stairs and lifts, to the right of the shaft
RY = 4.3                                    # risers' y
# supply outermost, so its branch down each floor never crosses the return main along the back
RISER = {"exhaust": 1.85, "return": 2.5, "supply": 3.15}
SUPPLY_Y, RETURN_Y = -0.8, 2.9              # each floor's supply main runs down the middle, its return along the back
TAKE_OFFS = (-5.4, -1.8, 1.8)               # supply branches, clear of the columns at x -3.6 and 0
ROWS = (-2.1, 1.35)                         # diffuser rows, front and back of the main, between the light rows
GRILLES = (-5.4, -3.0, -0.6, 1.8)           # return grilles under the back main
AHU = (-3.4, 0.6, 0.2, 2.2)                 # x0, x1, y0, y1 on the roof
FAR = 40.0                                  # how far the ground runs behind and beside the building
ROAD_X0, ROAD_X1 = -17.0, -10.15            # the street along the left face, between its curbs

# preview renders (Blender axes): file, camera, target, lens, hidden objects
SHOTS = (
    ("building.png", (-14.0, -46.0, 16.0), (1.0, 2.0, 7.5), 30, ()),
    ("street.png", (-30.0, -20.0, 6.0), (-8.0, 6.0, 4.0), 30, ()),
    ("roof.png", (9.0, -11.0, 25.0), (-1.2, 1.4, 19.0), 28, ()),
    ("floor.png", (4.0, -16.0, 11.5), (-1.0, 1.0, 10.0), 26, ("ceiling_reveal",)),
    ("parking.png", (5.0, -15.0, -1.0), (-1.5, 2.0, -2.4), 26, ()),
    ("system.png", (26.0, -36.0, 17.0), (0.0, 0.0, 7.0), 32,
     ("slab", "ceiling_reveal", "furniture", "glass", "facade", "site", "trees", "context")),
)
LIGHTS = (
    ("sun", "SUN", (0, 0, 40), (math.radians(48), 0, math.radians(-125)), 4.5, 3, (1, 0.95, 0.88)),
    ("fill", "AREA", (4, -24, 14), (math.radians(68), 0, 0), 26000, 30, (0.94, 0.96, 1.0)),
    ("inside", "AREA", (0, -2, 9), (0, 0, 0), 9000, 16, (1, 0.93, 0.85)),
)


def on_face(p, axis, n, depth, a, b, z0, z1, mat, uv=None):
    """A box on a facade: `axis` is the face's normal, n its position along it, a..b its span along the face."""
    if axis == "x":
        return p.box((depth, b - a, z1 - z0), (n, (a + b) / 2, (z0 + z1) / 2), mat, uv=uv)
    return p.box((b - a, depth, z1 - z0), ((a + b) / 2, n, (z0 + z1) / 2), mat, uv=uv)


def car(p, M, body, glass, head, tail, x, y, z, yaw=0.0):
    """A hatchback facing +y at yaw 0: body, a glazed cabin under a body-coloured roof, tyres with rims,
    lamps front and back, mirrors."""
    R = Matrix.Rotation(yaw, 4, "Z")

    def at(dx, dy, dz):
        v = R @ Vector((dx, dy, dz))
        return (x + v.x, y + v.y, z + v.z)

    side = R @ Vector((1, 0, 0))
    p.rbox((1.78, 4.3, 0.55), at(0, 0, 0.6), body, 0.16, seg=4, rot=R)
    p.rbox((1.54, 2.2, 0.44), at(0, -0.2, 1.08), glass, 0.14, seg=3, rot=R)           # the glazed cabin
    p.rbox((1.5, 1.85, 0.07), at(0, -0.25, 1.31), body, 0.03, seg=2, rot=R)           # its roof
    for sx in (-1, 1):                                                                 # A, B and C pillars
        for py, tilt in ((0.78, 0.45), (-0.15, 0.0), (-1.18, -0.35)):
            p.box((0.05, 0.09, 0.46), at(sx * 0.765, py, 1.08), body, rot=R @ Matrix.Rotation(tilt, 4, "X"))
    for sx in (-1, 1):
        for sy in (-1.32, 1.36):
            p.cyl(0.33, 0.22, at(sx * 0.79, sy, 0.33), M["plastic"], seg=24, direction=side)
            p.cyl(0.2, 0.226, at(sx * 0.79, sy, 0.33), M["chrome"], seg=16, direction=side)
        p.rbox((0.34, 0.05, 0.1), at(sx * 0.58, 2.14, 0.72), head, 0.02, rot=R)
        p.rbox((0.3, 0.05, 0.1), at(sx * 0.6, -2.14, 0.8), tail, 0.02, rot=R)
        p.rbox((0.05, 0.16, 0.08), at(sx * 0.86, 0.72, 1.0), body, 0.02, rot=R)
    p.box((1.2, 0.04, 0.14), at(0, -2.16, 0.55), M["black"], rot=R)


def tree(p, M, bark, crown, rng, x, y, height=7.0, spread=2.3, leaves=420):
    """A street tree: a tapering trunk forking into limbs, a dark inner crown so the canopy reads full,
    and leaf cards over its shell for a ragged edge."""
    trunk = height * 0.36
    p.cyl(0.15, trunk, (x, y, trunk / 2), bark, seg=10, r2=0.11)
    cz, rz = trunk + (height - trunk) * 0.5, (height - trunk) * 0.5
    for k in range(4):
        a = k * 1.57 + rng.uniform(0, 0.5)
        p.ball(spread * 0.5, (x + math.cos(a) * spread * 0.35, y + math.sin(a) * spread * 0.35, cz + rng.uniform(-0.2, 0.4) * rz),
               crown, scale=(1.0, 1.0, 0.85), subdiv=2)
    for k in range(4):
        a = k * 1.6 + rng.uniform(0, 0.8)
        p.tube([(x, y, trunk - 0.3), (x + math.cos(a) * 0.35, y + math.sin(a) * 0.35, trunk + 0.5),
                (x + math.cos(a) * spread * 0.5, y + math.sin(a) * spread * 0.5, cz + rng.uniform(-0.2, 0.7))], 0.055, bark, seg=6)
    for _ in range(leaves):
        u = rng.normal(size=3)
        u /= np.linalg.norm(u)
        r = rng.uniform(0.6, 1.0) ** 0.5
        p.leaf((x + u[0] * spread * r, y + u[1] * spread * r, cz + u[2] * rz * r), rng.uniform(0.32, 0.48), rng.uniform(0.24, 0.32),
               rng.uniform(0, 6.3), rng.uniform(-1.3, 1.3), M["fig"], fold=0.15)


def build(g):
    Part, M, empty, material, uvs, rng = g["Part"], g["M"], g["empty"], g["material"], g["uvs"], g["rng"]
    scan = {k: g["scanned"](k, g["MS"][k]) for k in ("concrete", "asphalt", "pavers", "grass")}
    concrete, asphalt, pavers, grass = scan["concrete"], scan["asphalt"], scan["pavers"], scan["grass"]
    earth = material("earth_cut", "5b4c3e", 0.0, 1.0)
    curb = material("curb", "bdbab3", 0.0, 0.85)
    paint = material("road_paint", "ecebe6", 0.0, 0.6)
    bark = material("bark", "4f4237", 0.0, 0.9)
    crown = material("crown", "2f4a24", 0.0, 0.95)
    dark_metal = material("lamp_metal", "33363b", 0.6, 0.4)
    spandrel = material("spandrel", "39414b", 0.4, 0.22)
    fin_metal = material("fin_metal", "c6c9cc", 0.7, 0.35)
    neighbour = material("neighbour", "dad8d3", 0.0, 0.9)
    band_glass = material("band_glass", "5b6670", 0.3, 0.2)
    membrane = material("roof_membrane", "6c6f73", 0.0, 0.95)
    lift_steel = material("lift_steel", "b6babf", 0.85, 0.3)
    safety = material("safety_yellow", "dfae3a", 0.0, 0.5)
    head = material("headlamp", "f4efe2", 0.0, 0.3, emit=2.0)
    tail = material("taillight", "b02a2a", 0.0, 0.35, emit=1.2)
    galv = material("galvanized", "aab0b7", 0.6, 0.38)
    cars = [material(n, h, 0.45, 0.32) for n, h in (("car_white", "e6e6e3"), ("car_grey", "7f848b"), ("car_blue", "3b5878"), ("car_dark", "2b2d31"))]
    car_glass = material("car_glass", "2b3540", 0.5, 0.08)
    hvac = {"supply": galv, "return": M["duct"], "exhaust": M["duct_wrap"]}
    # In the web template's x-ray (fit-out faded, structure ghosted) each duct glows in its air's tape colour.
    for air, colour in (("supply", "9fc3e8"), ("return", "f1d482"), ("exhaust", "f2b49c")):
        hvac[air]["xray"] = colour

    # ------------------------------------------------------------ site: the street around the building, cut at the front
    site = Part("site")
    for (xa, xb, ya, yb) in ((-FAR, X0, Y0, FAR), (X1, FAR, Y0, FAR), (X0, X1, Y1, FAR)):
        site.box((xb - xa, yb - ya, 5.4), ((xa + xb) / 2, (ya + yb) / 2, -2.82), earth)
    site.box((X1 - X0, Y1 - Y0, 5.5 + B1 - SLAB), (0, 0, (-5.5 + B1 - SLAB) / 2), earth)

    def surface(xa, xb, ya, yb, mat, top=0.0, key=None):
        site.box((xb - xa, yb - ya, 0.12 + top), ((xa + xb) / 2, (ya + yb) / 2, (top - 0.12) / 2), mat,
                 uv=uvs(key, "x") if key else None)

    surface(-10.0, X0, Y0, 8.0, pavers, key="pavers")                    # pavement round the building
    surface(X1, 10.0, Y0, 8.0, pavers, key="pavers")
    surface(-10.0, 10.0, Y1, 8.0, pavers, key="pavers")
    surface(ROAD_X0, ROAD_X1, Y0, FAR, asphalt, top=-0.1, key="asphalt")  # the street, a curb lower
    surface(ROAD_X1, -10.0, Y0, FAR, curb, top=0.02)
    surface(ROAD_X0 - 0.15, ROAD_X0, Y0, FAR, curb, top=0.02)
    surface(-10.0, -7.0, 8.0, FAR, pavers, key="pavers")                 # the pavement runs on along the street
    surface(-20.0, ROAD_X0 - 0.15, Y0, FAR, pavers, key="pavers")
    surface(-FAR, -20.0, Y0, FAR, grass, key="grass")                     # lawns
    surface(-7.0, FAR, 8.0, FAR, grass, key="grass")
    surface(10.0, FAR, Y0, 8.0, grass, key="grass")
    mid = (ROAD_X0 + ROAD_X1) / 2
    for y in np.arange(Y0 + 1.0, FAR - 1.0, 3.0):                        # centre dashes and edge lines
        site.box((0.12, 1.5, 0.006), (mid, y + 0.75, -0.097), paint)
    for x in (ROAD_X0 + 0.35, ROAD_X1 - 0.35):
        site.box((0.12, FAR - Y0, 0.006), (x, (Y0 + FAR) / 2, -0.097), paint)
    for k in range(6):                                                    # a crossing behind the building
        site.box((0.5, 3.0, 0.006), (ROAD_X0 + 0.8 + k * 1.05, 12.0, -0.097), paint)
    for y in (-1.0, 11.0, 23.0):                                         # street lamps on the kerb, arms over the road
        site.cyl(0.07, 6.0, (-10.45, y, 3.0), dark_metal, seg=12, r2=0.05)
        site.box((1.2, 0.07, 0.07), (-11.0, y, 5.95), dark_metal)
        site.rbox((0.55, 0.24, 0.1), (-11.55, y, 5.9), dark_metal, 0.03)
        site.box((0.45, 0.17, 0.01), (-11.55, y, 5.845), M["downlight"])
    for y in (-3.5, -2.0, 6.5):                                           # bollards along the pavement
        site.cyl(0.08, 0.9, (-9.7, y, 0.45), dark_metal, seg=12)
    site.build(fade_explode=1)

    trees = Part("trees")
    for x, y, h in ((-9.0, 11.5, 7.5), (-2.5, 12.0, 6.8), (4.0, 11.0, 7.2), (10.5, 12.0, 6.6), (-22.5, 2.0, 7.0),
                    (-22.0, 12.0, 7.8), (-23.0, 22.0, 6.9), (13.0, -1.0, 7.1), (13.5, 5.0, 6.5), (2.0, 20.0, 8.0)):
        tree(trees, M, bark, crown, rng, x, y, h, spread=h * 0.33)
    trees.build(fade_explode=1)

    traffic = Part("street_cars")
    car(traffic, M, cars[2], car_glass, head, tail, -11.9, 4.0, -0.1)
    car(traffic, M, cars[0], car_glass, head, tail, -15.3, 17.0, -0.1, yaw=math.pi)
    traffic.build(fade_explode=1)

    # three neighbouring blocks in the distance, white massing with dark window bands
    ctx = Part("context")
    for xa, xb, ya, yb, h in ((-31.0, -17.0, 31.0, 39.0, 18.0), (4.0, 19.0, 29.0, 38.0, 14.4), (23.0, 34.0, 8.0, 20.0, 10.8)):
        ctx.box((xb - xa, yb - ya, h), ((xa + xb) / 2, (ya + yb) / 2, h / 2), neighbour)
        for z in np.arange(1.0, h - 0.8, 3.6):
            ctx.box((xb - xa + 0.06, yb - ya + 0.06, 1.7), ((xa + xb) / 2, (ya + yb) / 2, z + 0.85), band_glass)
        ctx.box((xb - xa + 0.3, yb - ya + 0.3, 0.25), ((xa + xb) / 2, (ya + yb) / 2, h + 0.12), neighbour)
    ctx.build(fade_explode=1)

    # ------------------------------------------------------------ structure, one material so it fades as one
    st = Part("slab", origin=(0, 0, ROOF / 2))
    for z in (B1, *LEVELS, ROOF):
        st.box((X1 - X0, Y1 - Y0, SLAB), (0, 0, z - SLAB / 2), concrete, uv=uvs("concrete", "x"))
    st.box((X1 - X0, WALL, 3.6 - SLAB), (0, Y1 - WALL / 2, B1 + (3.6 - SLAB) / 2), concrete, uv=uvs("concrete", "x"))
    for x in (X0 + WALL / 2, X1 - WALL / 2):
        st.box((WALL, Y1 - Y0, 3.6 - SLAB), (x, 0, B1 + (3.6 - SLAB) / 2), concrete, uv=uvs("concrete"))
    h = 3.6 - SLAB
    for z in LEVELS:                                       # solid walls behind the shaft and round the core
        st.box((X1 - SHAFT_X0, WALL, h), ((SHAFT_X0 + X1) / 2, Y1 - WALL / 2, z + h / 2), concrete, uv=uvs("concrete", "x"))
        st.box((WALL, Y1 - CORE_Y0, h), (X1 - WALL / 2, (CORE_Y0 + Y1) / 2, z + h / 2), concrete, uv=uvs("concrete"))
    for z in (B1, *LEVELS):
        for cx in (-3.6, 0.0):
            for cy in (-1.6, 2.2):
                st.box((0.45, 0.45, h), (cx, cy, z + h / 2), concrete, uv=uvs("concrete", "z"))
        st.box((X1 - CORE_X0, WALL, h), ((CORE_X0 + X1) / 2, CORE_Y0, z + h / 2), concrete, uv=uvs("concrete", "x"))
        st.box((WALL, Y1 - CORE_Y0, h), (CORE_X0, (CORE_Y0 + Y1) / 2, z + h / 2), concrete, uv=uvs("concrete"))
        st.box((WALL, Y1 - SHAFT_Y0, h), (SHAFT_X0, (SHAFT_Y0 + Y1) / 2, z + h / 2), concrete, uv=uvs("concrete"))
    st.box((X1 - X0, WALL, 1.0), (0, Y1 - WALL / 2, ROOF + 0.5), concrete, uv=uvs("concrete", "x"))
    for x in (X0 + WALL / 2, X1 - WALL / 2):
        st.box((WALL, Y1 - Y0, 1.0), (x, 0, ROOF + 0.5), concrete, uv=uvs("concrete"))
    st.box((X1 - CORE_X0, Y1 - CORE_Y0, 3.0), ((CORE_X0 + X1) / 2, (CORE_Y0 + Y1) / 2, ROOF + 1.5), concrete, uv=uvs("concrete"))
    st.build()

    # ------------------------------------------------------------ curtain wall on the left, back and right faces
    gl, fr = Part("glass"), Part("facade")
    faces = (("x", X0, -1, Y0, Y1, True), ("y", Y1, 1, X0, SHAFT_X0, True), ("x", X1, 1, Y0, CORE_Y0, False))
    for axis, c, s, a, b, fins in faces:
        plane = c + s * 0.06                               # just outside the slab edges, which the spandrels hide
        for k, z in enumerate(LEVELS):
            top = ROOF + 1.0 if k == len(LEVELS) - 1 else z + 3.6
            on_face(gl, axis, plane, 0.02, a, b, z + 0.02, z + CEIL_H, M["glass"])
            on_face(fr, axis, plane, 0.03, a, b, z + CEIL_H, top, spandrel)
            for zz in (z + 0.03, z + CEIL_H):
                on_face(fr, axis, plane + s * 0.03, 0.1, a, b, zz - 0.03, zz + 0.03, M["frame"])
        for u in (*np.arange(a + 1.5, b - 0.4, 1.5), a + 0.03, b - 0.03):
            on_face(fr, axis, plane + s * 0.04, 0.12, u - 0.03, u + 0.03, 0.0, ROOF + 1.0, M["frame"])
        if fins:                                           # dark shading fins, shallow so the glass still reads at a glance
            for u in np.arange(a + 0.75, b - 0.4, 3.0):
                on_face(fr, axis, c + s * 0.24, 0.26, u - 0.025, u + 0.025, 0.0, ROOF + 1.0, M["frame"])
    for x0, x1, y0, y1 in ((X0 - 0.12, X0 + WALL, Y0, Y1), (X1 - WALL, X1 + 0.12, Y0, Y1), (X0, X1, Y1 - WALL, Y1 + 0.12)):
        fr.box((x1 - x0, y1 - y0, 0.05), ((x0 + x1) / 2, (y0 + y1) / 2, ROOF + 1.025), fin_metal)   # parapet coping
    # the entrance on the left face: a canopy on tie rods, a pair of glass doors, a mat
    fr.box((2.3, 3.6, 0.16), (X0 - 1.15, 0.0, 3.0), M["white_metal"])
    fr.box((0.06, 3.6, 0.22), (X0 - 2.3, 0.0, 3.0), M["frame"])
    for y in (-1.6, 1.6):
        fr.tube([(X0 - 2.2, y, 3.08), (X0 - 0.1, y, 4.4)], 0.018, M["steel"], seg=8)
    for y in (-0.9, 0.0, 0.9):
        fr.box((0.07, 0.06, 2.3), (X0 - 0.09, y, 1.15), M["frame"])
    fr.box((0.07, 1.86, 0.08), (X0 - 0.09, 0.0, 2.3), M["frame"])
    for y in (-0.12, 0.12):
        fr.cyl(0.016, 0.7, (X0 - 0.16, y, 1.1), M["chrome"], seg=10)
    fr.rbox((1.0, 1.8, 0.02), (X0 - 0.7, 0.0, 0.01), M["black"], 0.006)
    fr.build(fade_explode=1)                               # the glass is built with the meeting rooms' panes below

    # ------------------------------------------------------------ suspended ceilings and their light fittings
    reveal = empty("ceiling_reveal")
    for i, z in enumerate(LEVELS):
        c = Part(f"ceiling_{i}", origin=(0, 0, z + CEIL_H))
        c.box((CORE_X0 - X0 - WALL - 0.1, SHAFT_Y0 - Y0 - 0.1, 0.03), ((X0 + CORE_X0) / 2, (Y0 + SHAFT_Y0) / 2, z + CEIL_H + 0.015), M["white_panel"])
        c.build(parent=reveal)
        lp = Part(f"lights_{i}", origin=(0, 0, z + CEIL_H))
        for x in (-4.8, -2.4, 0.0, 2.4):
            for y in (-3.3, 0.3, 2.4):
                lp.box((1.2, 0.16, 0.012), (x, y, z + CEIL_H - 0.004), M["panel_led"])
        lp.build(parent=reveal)

    # ------------------------------------------------------------ inside: finishes, offices, lobby, lifts, parking
    furniture = empty("furniture")
    fin = Part("finishes")
    for z in LEVELS:
        fin.box((X1 - X0 - 2 * WALL, Y1 - Y0 - WALL, 0.012), (0, -WALL / 2, z + 0.006), M["floor"], uv=uvs("floor"))
    fin.box((X1 - X0 - 2 * WALL, Y1 - Y0 - WALL, 0.012), (0, -WALL / 2, B1 + 0.006), asphalt, uv=uvs("asphalt", "x"))
    for x in (-6.55, -4.45, -2.85, -0.75):
        fin.box((0.1, 4.2, 0.004), (x, 2.6, B1 + 0.014), M["white_panel"])
    fin.box((X1 - X0 - 2 * WALL, Y1 - Y0 - WALL, 0.03), (0, -WALL / 2, ROOF + 0.015), membrane)
    fin.build(parent=furniture, fade_explode=1)

    def chair(p, x, y, yaw):
        c, s = math.cos(yaw), math.sin(yaw)
        p.rbox((0.48, 0.48, 0.08), (x, y, p_z + 0.46), M["fabric"], 0.02, rot=Matrix.Rotation(yaw, 4, "Z"))
        p.rbox((0.06, 0.46, 0.45), (x - c * 0.22, y - s * 0.22, p_z + 0.75), M["fabric"], 0.02, rot=Matrix.Rotation(yaw, 4, "Z"))
        p.cyl(0.025, 0.42, (x, y, p_z + 0.21), M["plastic"], seg=8)
        p.cyl(0.22, 0.03, (x, y, p_z + 0.02), M["plastic"], seg=16)

    def floor_plant(p, x, y, z, leaves=28):
        p.cyl(0.3, 0.6, (x, y, z + 0.3), M["pot"], seg=24)
        for _ in range(leaves):
            p.leaf((x + rng.uniform(-0.1, 0.1), y + rng.uniform(-0.1, 0.1), z + 0.6 + rng.uniform(0.0, 1.0)), rng.uniform(0.25, 0.35),
                   rng.uniform(0.15, 0.2), rng.uniform(0, 6.3), rng.uniform(-0.3, 0.6), M["fig"], fold=0.18)

    office = Part("offices")
    meet = Part("meeting_rooms")
    MX0, MX1, MY0, MY1 = -6.5, -3.7, -4.7, -2.5            # front left, so the view onto the shaft stays clear
    for z in LEVELS[1:]:
        p_z = z
        for cx in (-4.6, -1.3):
            for dx in (-0.72, 0.72):
                for dy in (-0.4, 0.4):
                    office.box((1.4, 0.75, 0.03), (cx + dx, 0.2 + dy, z + 0.74), M["white"])
                    if dy < 0:
                        office.box((1.36, 0.03, 0.4), (cx + dx, 0.2 + dy * 0.05, z + 0.95), M["white_panel"])
                    office.box((0.04, 0.7, 0.72), (cx + dx + (0.66 if dx > 0 else -0.66), 0.2 + dy, z + 0.36), M["white"])
                    office.rbox((0.5, 0.02, 0.3), (cx + dx, 0.2 + dy * 1.5, z + 0.95), M["plastic"], 0.006)
                    chair(office, cx + dx, 0.2 + dy * 2.6, -math.pi / 2 if dy > 0 else math.pi / 2)
        floor_plant(office, -2.9, -4.3, z)
        floor_plant(office, 5.9, -4.0, z)                    # clear of the view onto the shaft
        # a glass meeting room by the cut: frame, a table for six
        for x0, x1, y0, y1 in ((MX0, MX1, MY0, MY0), (MX0, MX1, MY1, MY1), (MX0, MX0, MY0, MY1), (MX1, MX1, MY0, MY1)):
            gl.box((max(x1 - x0, 0.012), max(y1 - y0, 0.012), CEIL_H - 0.02), ((x0 + x1) / 2, (y0 + y1) / 2, z + CEIL_H / 2), M["glass"])
            meet.box((max(x1 - x0, 0.04), max(y1 - y0, 0.04), 0.05), ((x0 + x1) / 2, (y0 + y1) / 2, z + CEIL_H - 0.03), M["frame"])
        for x, y in ((MX0, MY0), (MX0, MY1), (MX1, MY0), (MX1, MY1), ((MX0 + MX1) / 2, MY1)):
            meet.box((0.05, 0.05, CEIL_H), (x, y, z + CEIL_H / 2), M["frame"])
        meet.rbox((1.9, 0.9, 0.04), ((MX0 + MX1) / 2, (MY0 + MY1) / 2, z + 0.74), M["wood"], 0.01, uv=uvs("wood", "x"))
        meet.cyl(0.05, 0.72, ((MX0 + MX1) / 2, (MY0 + MY1) / 2, z + 0.36), M["plastic"], seg=12)
        for k in range(3):
            xx = (MX0 + MX1) / 2 + (k - 1) * 0.62
            chair(meet, xx, (MY0 + MY1) / 2 - 0.75, math.pi / 2)
            chair(meet, xx, (MY0 + MY1) / 2 + 0.75, -math.pi / 2)
    gl.build(fade_explode=1)
    office.build(parent=furniture, fade_explode=1)
    meet.build(parent=furniture, fade_explode=1)

    lobby = Part("lobby")
    p_z = 0.0
    lobby.rbox((2.6, 0.7, 1.05), (-1.5, 2.6, 0.525), M["white"], 0.04)
    lobby.box((2.7, 0.8, 0.04), (-1.5, 2.6, 1.07), M["wood"], uv=uvs("wood", "x"))
    for x in (-5.0, -3.6):
        lobby.rbox((1.6, 0.8, 0.42), (x, -1.0, 0.21), M["fabric_light"], 0.08)
        lobby.rbox((1.6, 0.18, 0.4), (x, -0.68, 0.55), M["fabric_light"], 0.06)
    lobby.cyl(0.45, 0.4, (-4.3, -2.3, 0.2), M["wood"], seg=32, uv=uvs("wood", "z"))
    for x in (-6.2, 0.9):
        floor_plant(lobby, x, 3.8, 0.0)
    lobby.build(parent=furniture, fade_explode=1)

    lifts = Part("lift_doors")
    for z in (B1, *LEVELS):
        for x in (4.55, 6.05):
            yf = CORE_Y0 - WALL / 2
            lifts.box((1.12, 0.03, 2.28), (x, yf - 0.012, z + 1.14), fin_metal)
            lifts.box((0.95, 0.03, 2.15), (x, yf - 0.025, z + 1.075), lift_steel)
            lifts.box((0.008, 0.032, 2.15), (x, yf - 0.03, z + 1.075), M["black"])
            lifts.box((0.08, 0.02, 0.16), (x + 0.68, yf - 0.012, z + 1.1), lift_steel)
    lifts.build(parent=furniture, fade_explode=1)

    park = Part("cars")
    for k, x in enumerate((-5.5, -1.8)):
        car(park, M, cars[(k + 1) % len(cars)], car_glass, head, tail, x, 2.55, B1, yaw=math.pi)
    for x in (-5.5, -3.65, -1.8):
        park.rbox((1.4, 0.15, 0.1), (x, 4.45, B1 + 0.06), concrete, 0.02, uv=uvs("concrete", "x"))
    for cx in (-3.6, 0.0):
        for cy in (-1.6, 2.2):
            park.box((0.47, 0.47, 0.9), (cx, cy, B1 + 0.45), safety)
            for zz in (0.3, 0.6):
                park.box((0.475, 0.475, 0.1), (cx, cy, B1 + zz), M["black"])
    for x in (-5.0, -1.6, 1.8):
        for y in (-2.8, 0.3):
            park.box((1.4, 0.1, 0.05), (x, y, -SLAB - 0.03), M["panel_led"])
    park.build(parent=furniture, fade_explode=1)

    # ------------------------------------------------------------ HVAC: risers in the shaft
    sizes = {"exhaust": (0.55, 0.5), "supply": (0.55, 0.5), "return": (0.55, 0.45)}
    bottoms = {"exhaust": B1 + 2.75, "supply": LEVELS[0] + DUCT_Z, "return": LEVELS[0] + DUCT_Z}
    tops = {"exhaust": ROOF + 1.2, "supply": ROOF + 1.2, "return": ROOF + 1.7}
    band = {"supply": M["skyblue"], "return": M["butter"], "exhaust": M["peach"]}   # site tape colours, as in the rooms
    for name, x in RISER.items():
        w, d = sizes[name]
        r = Part(f"riser_{name}", origin=(x, RY, (bottoms[name] + tops[name]) / 2))
        r.box((w, d, tops[name] - bottoms[name]), (x, RY, (bottoms[name] + tops[name]) / 2), hvac[name])
        for z in np.arange(bottoms[name] + 1.2, tops[name] - 0.2, 1.2):              # joint flanges
            r.box((w + 0.04, d + 0.04, 0.03), (x, RY, z), M["steel"])
        for z in (*LEVELS, ROOF):
            r.box((w + 0.06, d + 0.06, 0.05), (x, RY, z + 0.1), M["steel"])         # floor sleeves
            if z < ROOF:
                r.box((w + 0.012, d + 0.012, 0.12), (x, RY, z + 1.6), band[name])
        r.build(bevel=0.004)

    # ------------------------------------------------------------ every floor: a supply tree and a return main
    # Supply leaves its riser through a fire damper and a volume control box, runs down the floor in a main that
    # steps down after the first take-off, and branches front and back to two rows of square diffusers. Return
    # comes back along the back over a row of grilles. Diffusers and grilles belong to their floor's network, so
    # they move with it in the exploded view; tape bands mark the air on every run.
    def tape(p, colour, along, x, y, zc_, w, h):
        """A band of site tape round a rectangular duct running along x or y."""
        size = (0.1, w + 0.012, h + 0.012) if along == "x" else (w + 0.012, 0.1, h + 0.012)
        p.box(size, (x, y, zc_), colour)

    def damper(p, x, y, zc_, w, h):
        """A fire damper's collar where a branch leaves the shaft."""
        p.box((w + 0.1, 0.1, h + 0.1), (x, y, zc_), M["steel"])

    for i, z in enumerate(LEVELS):
        zc = z + DUCT_Z
        under = z + CEIL_H                                # the ceiling's face
        sx, rx = RISER["supply"], RISER["return"]

        s = Part(f"supply_floor_{i}", origin=(-1.0, SUPPLY_Y, zc))
        s.box((0.5, RY - SUPPLY_Y + 0.3, 0.3), (sx, (RY + SUPPLY_Y - 0.3) / 2, zc), galv)   # riser to the main
        damper(s, sx, SHAFT_Y0 - 0.05, zc, 0.5, 0.3)
        s.box((0.62, 0.9, 0.38), (sx, 2.25, zc), galv)                                    # volume control box
        s.box((0.06, 0.28, 0.2), (sx - 0.34, 2.25, zc), M["black"])                        # its controller
        tape(s, band["supply"], "y", sx, 0.9, zc, 0.5, 0.3)
        s.box((sx + 0.25, 0.6, 0.3), ((sx + 0.25) / 2, SUPPLY_Y, zc), galv)                # the main, then a step down
        s.box((0.15, 0.6, 0.3), (-0.075, SUPPLY_Y, zc), M["steel"])
        s.box((5.7, 0.45, 0.3), (-2.85, SUPPLY_Y, zc), galv)
        for x in (2.6, -1.0, -4.0):
            tape(s, band["supply"], "x", x, SUPPLY_Y, zc, 0.6 if x > 0 else 0.45, 0.3)
        for x in TAKE_OFFS:
            for row in ROWS:
                far = row + (0.15 if row > SUPPLY_Y else -0.15)
                s.box((0.3, abs(far - SUPPLY_Y), 0.2), (x, (far + SUPPLY_Y) / 2, zc + 0.05), galv)
                tape(s, band["supply"], "y", x, (row + SUPPLY_Y) / 2, zc + 0.05, 0.3, 0.2)
                s.box((0.24, 0.24, zc - 0.05 - (under + 0.17)), (x, row, (zc - 0.05 + under + 0.17) / 2), galv)
                s.box((0.5, 0.5, 0.15), (x, row, under + 0.1), galv)
                for k, size in enumerate((0.6, 0.44, 0.28)):
                    s.box((size, size, 0.012), (x, row, under - 0.008 - k * 0.006), M["white_metal"])
        s.build(bevel=0.003, explode_sys=[0.0, -1.6, 0.0], delay=0.1 + i * 0.1, floor=i)

        r = Part(f"return_floor_{i}", origin=(-1.8, RETURN_Y, zc))
        r.box((0.45, RY - RETURN_Y + 0.25, 0.26), (rx, (RY + RETURN_Y - 0.25) / 2, zc + 0.02), M["duct"])
        damper(r, rx, SHAFT_Y0 - 0.05, zc + 0.02, 0.45, 0.26)
        r.box((rx + 6.2 + 0.225, 0.5, 0.26), ((rx + 0.225 - 6.2) / 2, RETURN_Y, zc + 0.02), M["duct"])
        for x in (1.0, -1.8, -4.4):
            tape(r, band["return"], "x", x, RETURN_Y, zc + 0.02, 0.5, 0.26)
        for x in GRILLES:
            r.box((0.3, 0.3, zc - 0.11 - under), (x, RETURN_Y, (zc - 0.11 + under) / 2), M["duct"])
            r.box((0.62, 0.32, 0.012), (x, RETURN_Y, under - 0.008), M["white_metal"])
            for k in range(5):
                r.box((0.56, 0.012, 0.016), (x, RETURN_Y - 0.12 + k * 0.06, under - 0.016), M["black"])
        r.build(bevel=0.003, explode_sys=[0.0, -1.6, -0.3], delay=0.15 + i * 0.1, floor=i)

    # an air curtain over the entrance doors inside the lobby, so winter air stays out; it belongs to the ground floor
    ac = Part("air_curtain", origin=(X0 + 0.22, 0.0, 2.5))
    casing = material("air_curtain", "e6e8eb", 0.3, 0.35)
    casing["xray"] = "9fc3e8"                            # it blows supply air, so it glows with the supply ducts
    ac.box((0.34, 2.0, 0.26), (X0 + 0.22, 0.0, 2.5), casing)
    ac.box((0.12, 1.9, 0.012), (X0 + 0.16, 0.0, 2.364), M["black"])                  # the discharge slot
    ac.box((0.02, 2.0, 0.2), (X0 + 0.395, 0.0, 2.5), M["steel"])                       # the inner face's grille
    ac.build(bevel=0.003, explode_sys=[0.0, -1.6, 0.0], delay=0.1, floor=0)

    # ------------------------------------------------------------ parking: jet fans and an exhaust duct to the riser
    pk = Part("parking_ventilation", origin=(-2.0, 2.0, -0.8))
    for x in (-5.4, -2.2, 0.8):
        pk.cyl(0.3, 1.2, (x, -0.6, -0.95), M["ahu"], axis="x", seg=28)
        pk.cyl(0.27, 0.02, (x + 0.61, -0.6, -0.95), M["black"], axis="x", seg=28)
        pk.cyl(0.27, 0.02, (x - 0.61, -0.6, -0.95), M["black"], axis="x", seg=28)
        for dx in (-0.3, 0.3):
            pk.cyl(0.015, 0.6, (x + dx, -0.6, -0.6), M["steel"], seg=8)
    ex = RISER["exhaust"]
    pk.box((ex + 6.2, 0.6, 0.45), ((ex - 6.2) / 2, RY, B1 + 2.75), M["duct_wrap"])
    for x in (-5.0, -2.6, -0.2):
        pk.box((0.7, 0.012, 0.3), (x, RY - 0.31, B1 + 2.72), M["white_metal"])
        for k in range(4):
            pk.box((0.64, 0.016, 0.012), (x, RY - 0.318, B1 + 2.61 + k * 0.07), M["black"])
    pk.build(bevel=0.003, explode_sys=[0.0, -1.6, -0.4], delay=0.05, floor=-1)          # the parking level

    # ------------------------------------------------------------ roof: air handling unit, ducts to the risers, plant
    ax0, ax1, ay0, ay1 = AHU
    acx, acy = (ax0 + ax1) / 2, (ay0 + ay1) / 2
    az0, az1 = ROOF + 0.3, ROOF + 2.1
    acz = (az0 + az1) / 2
    lift = [0.0, 0.0, 2.2]
    # the roof plant counts as the level above the top floor (floor=len(LEVELS)), so it dims while a floor is in focus
    base = Part("ahu_base", origin=(acx, acy, ROOF + 0.15))
    for y in (ay0 + 0.1, ay1 - 0.1):
        base.box((ax1 - ax0 + 0.2, 0.12, 0.3), (acx, y, ROOF + 0.15), M["steel"])
    base.build(explode_sys=lift, floor=len(LEVELS), delay=0.0)
    casing = Part("ahu_casing", origin=(acx, acy, acz))
    casing.box((ax1 - ax0, 0.05, az1 - az0), (acx, ay1 - 0.025, acz), M["ahu"])
    casing.box((0.05, ay1 - ay0, az1 - az0), (ax0 + 0.025, acy, acz), M["ahu"])
    casing.box((0.05, ay1 - ay0, az1 - az0), (ax1 - 0.025, acy, acz), M["ahu"])
    casing.box((ax1 - ax0, ay1 - ay0, 0.05), (acx, acy, az0 + 0.025), M["ahu"])
    casing.box((ax1 - ax0 - 2.2, 0.05, az1 - az0), (ax0 + 2.2 + (ax1 - ax0 - 2.2) / 2, ay0 + 0.025, acz), M["ahu"])
    casing.build(bevel=0.004, explode_sys=lift, floor=len(LEVELS), explode_ahu=[0.0, 0.0, 0.0], delay=0.0)
    top = Part("ahu_top", origin=(acx, acy, az1))
    top.box((ax1 - ax0 + 0.08, ay1 - ay0 + 0.08, 0.08), (acx, acy, az1 + 0.04), M["ahu"])
    top.build(bevel=0.004, explode_sys=lift, floor=len(LEVELS), explode_ahu=[0.0, 0.0, 0.9], delay=0.0)
    hinge = (ax0, ay0, acz)
    door = Part("ahu_door", origin=hinge)
    door.box((2.2, 0.05, az1 - az0 - 0.02), (ax0 + 1.1, ay0 + 0.025, acz), M["ahu"])
    door.box((0.05, 0.08, 0.3), (ax0 + 2.0, ay0 - 0.03, acz), M["steel"])
    door.build(bevel=0.004, explode_sys=lift, floor=len(LEVELS), explode_ahu=[0.0, -0.6, 0.0], delay=0.05)
    fan_axis = (ax0 + 1.0, acy, acz)
    fan = Part("ahu_fan", origin=fan_axis)
    fan.cyl(0.62, 0.06, fan_axis, M["steel"], axis="y", seg=40)
    for k in range(10):
        a = 2 * math.pi * k / 10
        fan.box((0.5, 0.36, 0.03), (fan_axis[0] + math.cos(a) * 0.36, acy - 0.05, acz + math.sin(a) * 0.36), M["ahu_inner"],
                rot=Matrix.Rotation(-a, 4, "Y") @ Matrix.Rotation(0.5, 4, "X"))
    fan.cyl(0.12, 0.5, fan_axis, M["black"], axis="y", seg=20)
    fan.build(explode_sys=lift, floor=len(LEVELS), explode_ahu=[0.0, -0.9, 0.0], delay=0.3)
    coil = Part("ahu_coil", origin=(ax0 + 2.6, acy, acz))
    coil.box((0.3, ay1 - ay0 - 0.15, az1 - az0 - 0.15), (ax0 + 2.6, acy, acz), M["fins"])
    coil.build(explode_sys=lift, floor=len(LEVELS), explode_ahu=[0.0, -0.4, 0.7], delay=0.25)
    filt = Part("ahu_filter", origin=(ax0 + 3.4, acy, acz))
    filt.box((0.12, ay1 - ay0 - 0.15, az1 - az0 - 0.15), (ax0 + 3.4, acy, acz), M["filter"])
    filt.build(explode_sys=lift, floor=len(LEVELS), explode_ahu=[0.0, -0.2, 1.0], delay=0.4)

    roof = Part("roof_ducts", origin=(1.0, 2.8, ROOF + 1.4))
    sx, rx = RISER["supply"], RISER["return"]
    zs, zr = ROOF + 1.2, ROOF + 1.7
    roof.box((sx - ax1 + 0.25, 0.6, 0.45), ((ax1 + sx) / 2, acy, zs), galv)
    roof.box((0.6, RY - acy, 0.45), (sx, (acy + RY) / 2, zs), galv)
    RRY = 3.3
    roof.box((0.55, RY - RRY + 0.275, 0.4), (rx, (RY + RRY) / 2, zr), M["duct"])
    roof.box((rx + 2.6 + 0.275, 0.55, 0.4), ((rx - 2.6) / 2, RRY, zr), M["duct"])
    roof.box((0.55, RRY - ay1 + 0.275, 0.4), (-2.6, (RRY + ay1) / 2, zr), M["duct"])
    roof.build(bevel=0.003, explode_sys=lift, floor=len(LEVELS), delay=0.0)

    plant_ = Part("roof_plant", origin=(-3.0, 3.8, ROOF + 0.6))
    ex = RISER["exhaust"]
    plant_.cyl(0.42, 0.5, (ex, RY, ROOF + 1.45), M["ahu"], seg=32)
    plant_.cyl(0.5, 0.22, (ex, RY, ROOF + 1.85), M["ahu"], seg=32, r2=0.18)
    for x in (-6.0, -4.7):
        plant_.box((1.1, 0.8, 1.2), (x, 3.9, ROOF + 0.6), M["white_metal"])
        plant_.cyl(0.36, 0.02, (x, 3.9, ROOF + 1.21), M["black"], seg=32)
        plant_.box((0.04, 0.6, 0.02), (x, 3.9, ROOF + 1.225), M["steel"])
    plant_.build(bevel=0.003, explode_sys=lift, floor=len(LEVELS), delay=0.0)
