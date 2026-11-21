"""A coal preparation plant in section, with its fire protection and its automation: the home page's sixth scene.

build_scene.py loads the spec, the materials and the Part API, then calls build(globals()) when the spec says
"room": "mine", exports the GLB and exits. Blender metres, Z up; -Y is the cut the camera looks in through, so the
plant is open toward it like a section drawing. Its gable faces the camera: portal frames stand in x-z planes.

What it holds:
  site            the hardstand (gravel), the plant's floor and apron, the cut earth under them; it stays in every view
  slab            the plant's cladding (three walls and the back gable), one material, so the web template can ghost it
  ceiling_reveal  the roof sheets and rooflights, bay by bay, and the pump house's roof; they fade to show what is under
  frame           portal frames, purlins, the two grating floors (5 m and 10 m) on their beams and columns
  control_block   the electrical room on the ground and the control room over it, at the right end of the plant
  furniture       the process: raw coal conveyor in from the right, a desliming screen and two dense medium cyclones
                  on the top floor, two drain-and-rinse screens and a magnetic separator below, sumps, a water tank and
                  slurry pumps on the ground, the product conveyor out to the left
  context         outside: the dump hopper with a loaded haul truck, the product stockpile, a thickener, an
                  excavator, light towers, berms and the pit's benches in the distance
  fire (floor 0)  a fire water tank and a pump house (electric, diesel and jockey pumps on two headers), a ring main
                  round the plant with pillar hydrants, a valve station and a riser to sprinkler grids under both
                  floors and the roof, deluge lines with open nozzles over both conveyors, hose reel cabinets, a
                  gas bank for the electrical room, smoke exhaust fans on the ridge (spin_up blades)
  alarm (floor 1) heat sensing cable along the conveyors, flame detectors at the transfers, smoke detectors, call
                  points and sounder beacons on every floor, all looped to the fire alarm panel in the control room
  automation      motor control cabinets and a PLC cabinet (ahu_door, racks that slide out with explode_ahu) in the
  (floor 2)       electrical room, cable trays to every floor and out to the conveyor and the pumps, field
                  instruments (level, density, pressure, flow, a control valve, a belt scale, pull cords, sway
                  switches, local stations, cameras), operator desks and a video wall in the control room
The three systems carry `floor` 0, 1 and 2 so a shot can bring one forward, and their materials an `xray` colour
(red water, amber alarm, blue automation). Everything else but the ground and the cladding carries fade_explode.
No lettering anywhere.
"""
import math

import numpy as np
from mathutils import Matrix, Vector

from systems import pipe, rounded

HX, Y0, Y1 = 11.0, -7.0, 7.0               # half width; Y0 is the cut
EAVE, RIDGE = 15.0, 17.0
FRAMES = (-7.0, -3.5, 0.0, 3.5, 7.0)       # portal frames along y
L1, L2 = 5.0, 10.0                          # the grating floors
WALL = 0.2
FAR = 110.0
CX0, CY1 = 5.0, -1.0                        # the control block: x CX0..HX, y Y0..CY1; electrical room under, control room over
ROOM_Z = (0.0, 4.6, 5.0, 8.8)               # electrical room floor and ceiling, control room floor and ceiling
RAW = ((38.0, 0.0, 1.0), (8.5, 0.0, 12.2))  # the raw coal conveyor: tail under the hopper, head on the top floor
PRODUCT = ((2.5, 0.0, 1.3), (-11.5, 0.0, 1.3), (-33.0, 0.0, 9.5))   # the product conveyor: flat inside, then up to the stockpile
PUMP_HOUSE = (12.6, 21.0, -7.0, -2.8, 3.6)  # x0, x1, y0, y1, height; open at the cut like the plant
TANK = (26.6, -4.2, 2.5, 7.0)               # fire water tank: x, y, radius, height
RING = (13.3, 8.6, -12.6)                   # the ring main: its right leg's x, its back leg's y, its left leg's x
RISER = (-10.2, -6.2)                       # the sprinkler riser, inside the front left corner
SPRINKLER_Z = (4.3, 9.3, 14.3)              # the three grids: under each floor and under the roof
BRANCHES = (-8.5, -5.5, -2.5, 0.5, 3.5)     # sprinkler branch lines, along y
TRAY_Y = -6.6                               # cable trays run along the front, under each floor
TRAY_Z = (4.05, 9.05, 13.7)
ROOF_FANS = (-5.25, -1.75, 1.75, 5.25)    # smoke exhaust fans on the ridge, between the frames
PLC = (5.9, 6.9, -1.75, -1.15, 0.1, 2.3)    # the PLC cabinet: x0, x1, y0 (its door), y1, z0, z1

# preview renders (Blender axes): file, camera, target, lens, hidden objects
FIT_OUT = ("slab", "ceiling_reveal", "furniture", "frame", "control_block", "context", "pump_house")
SHOTS = (
    ("plant.png", (20.0, -52.0, 16.0), (4.0, 0.0, 7.0), 28, ()),
    ("floors.png", (-4.0, -30.0, 8.5), (-2.5, 0.0, 7.2), 26, ()),
    ("pumps.png", (22.0, -24.0, 6.0), (19.5, -4.5, 2.4), 30, ()),
    ("rooms.png", (9.5, -19.0, 5.2), (8.0, -2.0, 4.6), 30, ()),
    ("conveyor.png", (30.0, -26.0, 9.0), (22.0, 0.0, 6.5), 28, ()),
    ("roof_off.png", (18.0, -38.0, 34.0), (2.0, 0.0, 5.0), 28, ("ceiling_reveal",)),
    ("systems.png", (22.0, -46.0, 22.0), (3.0, 0.0, 6.0), 28, FIT_OUT),
)
LIGHTS = (
    ("sun", "SUN", (0, 0, 40), (math.radians(50), 0, math.radians(-130)), 4.5, 3, (1, 0.95, 0.88)),
    ("fill", "AREA", (4, -34, 18), (math.radians(66), 0, 0), 60000, 40, (0.94, 0.96, 1.0)),
    ("inside", "AREA", (0, -1, 14), (0, 0, 0), 22000, 18, (1, 0.94, 0.86)),
)


def roof_z(x):
    return EAVE + (RIDGE - EAVE) * (1 - abs(x) / HX)


def beam(p, a, b, lateral, depth, mat, uv=None):
    """A box from a to b: `lateral` across it horizontally, `depth` in its vertical plane."""
    a, b = Vector(a), Vector(b)
    z = (b - a).normalized()
    side = Vector((0, 0, 1)).cross(z)
    side = side.normalized() if side.length > 1e-6 else Vector((1, 0, 0))
    rot = Matrix((side, z.cross(side), z)).transposed().to_4x4()
    return p.box((lateral, depth, (b - a).length), (a + b) / 2, mat, rot=rot, uv=uv)


def placed(x, y, yaw, z=0.0):
    """Local axes for a machine facing +y at yaw 0: at() maps a local point, R turns a box."""
    R = Matrix.Rotation(yaw, 4, "Z")

    def at(dx, dy, dz):
        v = R @ Vector((dx, dy, dz))
        return (x + v.x, y + v.y, z + v.z)

    return R, at


def tyre(p, T, at, axis, lx, ly, r=1.35, w=0.9):
    """An earthmover tyre standing on the ground at (lx, ly), its axle along `axis`."""
    t = w / 2
    ring = [at(lx, ly + math.cos(a) * (r - t), r + math.sin(a) * (r - t)) for a in np.linspace(0, 2 * math.pi, 29)]
    pipe(p, ring, t, T["tyre"], seg=10)
    c = at(lx, ly, r)
    p.cyl(r - t, w * 0.8, c, T["tyre"], seg=28, direction=axis)
    p.cyl(r * 0.55, w * 0.9, c, T["rim"], seg=24, direction=axis)
    p.cyl(r * 0.2, w * 0.98, c, T["dark"], seg=12, direction=axis)


def haul_truck(p, T, x, y, yaw=0.0, load=None):
    """A rigid mining haul truck facing +y at yaw 0: frame, six tyres, engine deck with stair and rails,
    offset cab, a ribbed tray with its canopy over the cab, an exhaust outlet on the right side."""
    R, at = placed(x, y, yaw)
    axis = R @ Vector((1, 0, 0))

    def box(size, loc, mat, r=0.0, rx=0.0):
        rot = R @ Matrix.Rotation(rx, 4, "X") if rx else R
        if r:
            return p.rbox(size, at(*loc), mat, r, rot=rot)
        return p.box(size, at(*loc), mat, rot=rot)

    for sx in (-1, 1):
        tyre(p, T, at, axis, sx * 2.05, 2.7)
        for lx in (1.45, 2.4):
            tyre(p, T, at, axis, sx * lx, -2.1)
    box((1.9, 8.2, 0.8), (0, 0.2, 1.8), T["dark"])                                  # frame
    p.cyl(0.45, 3.4, at(0, -2.1, 1.35), T["dark"], seg=16, direction=axis)          # rear axle
    p.cyl(0.3, 3.4, at(0, 2.7, 1.35), T["dark"], seg=16, direction=axis)
    box((3.3, 2.3, 1.55), (0, 3.55, 2.95), T["body"], r=0.12)                       # engine hood
    box((2.9, 0.08, 1.25), (0, 4.72, 2.95), T["dark"])                              # radiator
    for k in range(6):
        box((2.8, 0.1, 0.05), (0, 4.75, 2.42 + k * 0.21), T["chrome"])
    box((4.5, 0.45, 0.6), (0, 4.85, 1.8), T["dark"], r=0.08)                        # bumper
    for sx in (-1, 1):
        box((0.55, 0.06, 0.26), (sx * 1.75, 5.09, 1.85), T["lamp"])
        box((0.9, 1.7, 1.2), (sx * 1.75, 0.3, 2.0), T["body"] if sx > 0 else T["dark"], r=0.1)   # tanks
        box((0.5, 0.08, 0.3), (sx * 2.1, -4.05, 3.3), T["tail"])
    box((5.3, 2.75, 0.14), (0, 3.55, 3.8), T["deck"])                               # deck over the front tyres
    rail = [(-2.6, 2.3, 4.85), (-2.6, 4.88, 4.85), (2.6, 4.88, 4.85), (2.6, 2.3, 4.85)]
    p.tube([at(*q) for q in rail], 0.035, T["body"], seg=8)
    p.tube([at(a, b, c - 0.5) for a, b, c in rail], 0.03, T["body"], seg=8)
    for a, b in ((-2.6, 2.3), (-2.6, 3.6), (-2.6, 4.88), (-0.9, 4.88), (0.9, 4.88), (2.6, 4.88), (2.6, 3.6), (2.6, 2.3)):
        p.cyl(0.03, 1.0, at(a, b, 4.36), T["body"], seg=8)
    beam(p, at(1.7, 5.12, 1.55), at(-0.5, 5.12, 3.85), 0.1, 0.7, T["deck"])         # the stair across the front
    p.tube([at(1.7, 5.2, 2.5), at(-0.5, 5.2, 4.8)], 0.03, T["body"], seg=8)
    box((1.75, 1.9, 1.75), (-1.55, 3.2, 4.75), T["body"], r=0.12)                   # cab
    box((1.79, 1.5, 0.85), (-1.55, 3.3, 5.0), T["glass"], r=0.06)
    box((1.55, 1.94, 0.85), (-1.55, 3.2, 5.0), T["glass"], r=0.06)
    p.cyl(0.09, 0.14, at(-1.55, 3.2, 5.7), T["amber"], seg=12)
    for sx in (-1, 1):                                                               # mirrors
        box((0.08, 0.5, 0.08), (sx * 2.75, 4.6, 4.6), T["dark"])
        box((0.06, 0.3, 0.5), (sx * 2.95, 4.75, 4.6), T["dark"])
    # the tray: a floor rising to a kicked-up tail, ribbed sides, a front wall and a canopy over the cab
    box((5.2, 5.0, 0.22), (0, -0.75, 3.62), T["body"], rx=-0.07)
    box((5.2, 1.8, 0.22), (0, -3.95, 4.12), T["body"], rx=-0.42)
    box((5.4, 0.25, 2.25), (0, 1.75, 4.62), T["body"])
    box((5.4, 3.3, 0.2), (0, 3.3, 5.85), T["body"])
    box((5.5, 0.22, 0.34), (0, 4.9, 5.78), T["body"])
    for sx in (-1, 1):
        box((0.2, 6.3, 1.55), (sx * 2.6, -1.3, 4.6), T["body"], rx=-0.05)
        box((0.32, 6.5, 0.2), (sx * 2.6, -1.3, 5.42), T["body"], rx=-0.05)
        for ly in (1.1, -0.1, -1.3, -2.5, -3.7):
            box((0.14, 0.3, 1.5), (sx * 2.76, ly, 4.6 + (1.1 - ly) * 0.05), T["body"])
        p.cyl(0.11, 2.2, at(sx * 0.95, 0.3, 2.9), T["chrome"], seg=12, direction=R @ Vector((0, 0.5, 1)))   # hoist rams
    p.cyl(0.1, 0.6, at(2.5, 1.5, 3.3), T["chrome"], seg=14, direction=axis)         # exhaust outlet, right side
    if load is not None:
        p.ball(2.3, at(0, -0.6, 5.0), load, scale=(1.0, 1.15, 0.5), subdiv=3)
        p.ball(1.5, at(0.3, -2.4, 5.2), load, scale=(1.2, 1.0, 0.45), subdiv=2)
        p.ball(1.4, at(-0.4, 0.8, 5.25), load, scale=(1.2, 0.8, 0.45), subdiv=2)


def excavator(p, T, x, y, yaw=0.0):
    """A hydraulic mining excavator facing +y at yaw 0: tracks, house, cab, boom, stick and bucket on the ground."""
    R, at = placed(x, y, yaw)
    axis = R @ Vector((1, 0, 0))

    def box(size, loc, mat, r=0.0, rx=0.0):
        rot = R @ Matrix.Rotation(rx, 4, "X") if rx else R
        if r:
            return p.rbox(size, at(*loc), mat, r, rot=rot)
        return p.box(size, at(*loc), mat, rot=rot)

    for sx in (-1, 1):
        box((0.85, 5.4, 1.1), (sx * 1.75, 0, 0.55), T["tyre"], r=0.4)               # tracks
        box((0.6, 4.6, 0.5), (sx * 1.75, 0, 0.6), T["dark"])
        for ly in (-2.15, 2.15):
            p.cyl(0.42, 0.9, at(sx * 1.75, ly, 0.56), T["dark"], seg=18, direction=axis)
    box((2.8, 2.4, 0.6), (0, 0, 0.95), T["dark"])
    p.cyl(1.25, 0.3, at(0, 0, 1.4), T["dark"], seg=32)
    box((3.5, 5.6, 0.3), (0, -0.7, 1.7), T["dark"])                                  # house deck
    box((3.3, 3.3, 1.7), (0.1, -1.5, 2.7), T["body"], r=0.12)
    box((3.5, 0.95, 1.5), (0, -3.55, 2.6), T["dark"], r=0.2)                         # counterweight
    box((1.25, 1.9, 1.95), (-1.1, 1.2, 2.83), T["body"], r=0.1)                      # cab
    box((1.29, 1.5, 1.0), (-1.1, 1.3, 3.15), T["glass"], r=0.05)
    box((1.05, 1.94, 1.25), (-1.1, 1.2, 3.05), T["glass"], r=0.05)
    p.cyl(0.1, 0.9, at(1.1, -1.9, 4.0), T["dark"], seg=12)
    rail = [(-1.6, -3.0, 4.35), (1.7, -3.0, 4.35), (1.7, 0.1, 4.35)]
    p.tube([at(*q) for q in rail], 0.03, T["body"], seg=8)
    for q in rail + [(0.0, -3.0, 4.35), (1.7, -1.5, 4.35)]:
        p.cyl(0.03, 0.8, at(q[0], q[1], 3.95), T["body"], seg=8)
    A, B, C = Vector((0.3, 0.9, 2.3)), Vector((0.3, 5.3, 6.2)), Vector((0.3, 7.7, 2.1))
    Bt = B + (B - C).normalized() * 0.9
    beam(p, at(*A), at(*B), 0.75, 0.95, T["body"])
    beam(p, at(*Bt), at(*C), 0.6, 0.75, T["body"])
    for sx in (-0.55, 0.55):
        p.cyl(0.13, 2.7, at(0.3 + sx, 2.55, 3.05), T["chrome"], seg=12, direction=R @ Vector((0, 1.5, 2.2)))
    p.cyl(0.12, 3.2, at(0.3, 4.2, 6.2), T["chrome"], seg=12, direction=R @ Vector((0, 2.4, 1.6)))
    p.cyl(0.1, 2.6, at(0.3, 7.0, 4.75), T["chrome"], seg=12, direction=R @ Vector((0, 1.3, -2.2)))
    box((1.8, 1.7, 1.35), (0.3, 7.25, 1.1), T["dark"], r=0.25, rx=0.55)              # bucket
    for k in range(5):
        box((0.14, 0.4, 0.12), (0.3 - 0.72 + k * 0.36, 6.55, 0.3), T["chrome"], rx=0.9)


def conveyor(p, K, a, b, w=1.2, walk=-1, legs=True):
    """A belt conveyor from its tail a to its head b: stringers, idlers, both belt runs with coal on the top one,
    pulleys, a drive, a walkway with a handrail on side `walk` (1 = the belt's left) and bents to the ground.
    Returns at(t, h, s): the point a share t along it, h above the belt and s to its left."""
    a, b = Vector(a), Vector(b)
    L = (b - a).length
    u = (b - a) / L
    n = Vector((-u.y, u.x, 0.0)).normalized()
    up = u.cross(n)

    def at(t, h=0.0, s=0.0):
        return a + u * (L * t) + up * h + n * s

    for s in (-1, 1):
        beam(p, at(0, -0.25, s * (w / 2 + 0.12)), at(1, -0.25, s * (w / 2 + 0.12)), 0.1, 0.3, K["truss"])
    beam(p, at(0), at(1), w, 0.04, K["belt"])
    beam(p, at(0, -0.5), at(1, -0.5), w, 0.03, K["belt"])
    beam(p, at(0.03, 0.1), at(0.985, 0.1), w * 0.55, 0.16, K["coal"])
    for t in np.arange(0.75 / L, 1.0, 1.5 / L):
        p.cyl(0.07, w + 0.16, at(t, -0.08), K["steel"], seg=10, direction=n)
    for t in (0, 1):
        p.cyl(0.3, w + 0.1, at(t, -0.25), K["steel"], seg=18, direction=n)
    p.rbox((0.9, 0.55, 0.6), at(1 - 0.6 / L, -0.3, -walk * (w / 2 + 0.55)), K["dark"], 0.06)       # the drive
    sw = walk * (w / 2 + 0.62)
    beam(p, at(0, -0.3, sw), at(1, -0.3, sw), 0.8, 0.04, K["grate"])
    p.tube([at(0, 0.75, sw + walk * 0.4), at(1, 0.75, sw + walk * 0.4)], 0.025, K["safety"], seg=8)
    for t in np.arange(0, 1.001, 3.0 / L):
        p.tube([at(t, -0.3, sw + walk * 0.4), at(t, 0.75, sw + walk * 0.4)], 0.02, K["safety"], seg=6)
    if legs:
        for t in np.arange(4.0 / L, 1.0, 6.0 / L):
            if at(t).z > 2.0:
                for s in (-1, 1):
                    top = at(t, -0.4, s * (w / 2 + 0.12))
                    p.tube([top, (top.x + n.x * s * 0.5, top.y + n.y * s * 0.5, 0.0)], 0.07, K["truss"], seg=8)
                top = at(t, -0.4)
                p.box((0.1, w + 0.5, 0.1), (top.x, top.y, top.z * 0.5), K["truss"])
    return at


def build(g):
    Part, M, empty, material, uvs, rng = g["Part"], g["M"], g["empty"], g["material"], g["uvs"], g["rng"]
    concrete = g["scanned"]("concrete", g["MS"]["concrete"])
    gravel = g["scanned"]("gravel", g["MS"]["gravel"])
    earth = material("earth_cut", "5b4c3e", 0.0, 1.0)
    rock_a = material("bench_rock", "7b6a55", 0.0, 1.0)
    rock_b = material("bench_seam", "55493c", 0.0, 1.0)
    rock_c = material("bench_rock_light", "86745e", 0.0, 1.0)
    coal = material("coal", "1c1d20", 0.0, 0.9)
    cladding = material("cladding", "d6d8da", 0.2, 0.55)
    roof_sheet = material("roof_sheet", "b3b9bf", 0.35, 0.5)
    rooflight = material("rooflight", "f3f1ea", 0.0, 0.5, emit=1.4)
    frame_steel = material("frame_steel", "7f8c9c", 0.5, 0.45)
    grate = material("grating", "3f444b", 0.6, 0.55)
    purlin = material("purlin", "b4b9bf", 0.7, 0.4)
    panel = material("room_panel", "e7e8ea", 0.0, 0.6)
    equip = material("equipment", "b6b6b0", 0.35, 0.5)
    equip_dark = material("equipment_dark", "5a5e65", 0.4, 0.5)
    belt = material("belt", "17181a", 0.0, 0.85)
    tank = material("process_tank", "c2c5c9", 0.5, 0.42)
    slurry = material("slurry_pipe", "8a8f96", 0.5, 0.45)
    water = material("thickener_water", "37444e", 0.0, 0.12)
    safety = material("safety_yellow", "e2a72a", 0.2, 0.45)
    green = material("lamp_green", "49c26b", 0.0, 0.4, emit=2.2)
    red_lamp = material("lamp_red", "ff4b3a", 0.0, 0.4, emit=2.6)
    # the three systems, each with the colour it glows in the web template's x-ray
    fire_red = material("fire_red", "c62f27", 0.3, 0.42)
    fire_tank = material("fire_tank", "c9ccd0", 0.5, 0.4)
    cowl = material("smoke_fan", "c9cdd1", 0.5, 0.4)
    alarm_red = material("alarm_red", "d23a2e", 0.1, 0.45)
    alarm_cable = material("alarm_cable", "d99a1e", 0.0, 0.5)
    detector = material("detector_white", "f1f1ee", 0.0, 0.4)
    auto_blue = material("instrument_blue", "2a6cc4", 0.3, 0.4)
    auto_cable = material("control_cable", "1f4f96", 0.0, 0.5)
    tray_m = material("cable_tray", "b9bec4", 0.7, 0.4)
    cabinet = material("cabinet", "c9cdd2", 0.4, 0.4)
    for mats, colour in (((fire_red, fire_tank), "ff7a63"), ((alarm_red, alarm_cable, detector), "f1d482"),
                         ((auto_blue, auto_cable, tray_m, cabinet), "8fc1f0")):
        for m in mats:
            m["xray"] = colour
    FIRE, ALARM, AUTO = dict(floor=0), dict(floor=1), dict(floor=2)
    T = {
        "body": material("machine_yellow", "e0a526", 0.3, 0.42),
        "dark": material("machine_dark", "2c2e32", 0.4, 0.55),
        "deck": material("machine_deck", "45484d", 0.4, 0.6),
        "tyre": material("tyre", "1b1c1e", 0.0, 0.9),
        "rim": material("rim", "d9a52b", 0.3, 0.5),
        "glass": material("cab_glass", "26323c", 0.5, 0.08),
        "lamp": material("headlamp", "f4efe2", 0.0, 0.3, emit=2.0),
        "tail": material("taillight", "b02a2a", 0.0, 0.35, emit=1.2),
        "amber": material("beacon", "f0a020", 0.0, 0.3, emit=2.5),
        "chrome": M["steel"],
    }
    K = {"truss": frame_steel, "belt": belt, "coal": coal, "steel": M["steel"], "dark": equip_dark, "grate": grate, "safety": safety}

    def run(p, pts, r, mat, bend=0.0, seg=10):
        """A pipe or cable along a path; `bend` turns its corners on that radius."""
        pipe(p, rounded(pts, bend) if bend else pts, r, mat, seg=seg)

    # ------------------------------------------------------------ site: hardstand, floor and apron, cut at the front
    site = Part("site")
    site.box((2 * FAR, FAR - Y0, 4.0), (0, (Y0 + FAR) / 2, -2.1), earth)
    site.box((2 * FAR, FAR - Y0, 0.1), (0, (Y0 + FAR) / 2, -0.1), gravel, uv=uvs("gravel", "x"))
    site.box((44.0, 22.0, 0.12), (6.0, Y0 + 11.0, -0.03), concrete, uv=uvs("concrete", "x"))            # apron
    site.box((2 * HX, Y1 - Y0, 0.3), (0, 0, -0.12), concrete, uv=uvs("concrete", "x"))                 # plant floor
    px0, px1, py0, py1, ph = PUMP_HOUSE
    site.box((px1 - px0, py1 - py0, 0.2), ((px0 + px1) / 2, (py0 + py1) / 2, 0.02), concrete, uv=uvs("concrete", "x"))
    tx, ty, tr, th = TANK
    site.cyl(tr + 0.35, 0.3, (tx, ty, 0.05), concrete, seg=32)
    site.build()

    # ------------------------------------------------------------ slab: the cladding, one material
    slab = Part("slab")
    for sx in (-1, 1):
        slab.box((WALL, Y1 - Y0, EAVE), (sx * HX, 0, EAVE / 2), cladding)
        for y in np.arange(Y0 + 0.2, Y1, 0.5):
            slab.box((WALL + 0.06, 0.14, EAVE), (sx * HX, y, EAVE / 2), cladding)
    slab.box((2 * HX + WALL, WALL, EAVE), (0, Y1, EAVE / 2), cladding)
    for x in np.arange(-HX + 0.25, HX, 0.5):
        slab.box((0.14, WALL + 0.06, EAVE), (x, Y1, EAVE / 2), cladding)
    for sx in (-1, 1):
        slab.quad([(sx * HX, Y1, EAVE), (0, Y1, EAVE), (0, Y1, RIDGE), (sx * HX, Y1, EAVE + 0.02)], cladding)
    slab.build()

    # ------------------------------------------------------------ roof: sheets and rooflights that fade, bay by bay
    reveal = empty("ceiling_reveal")
    span = math.hypot(HX, RIDGE - EAVE)
    ux, uz = HX / span, (RIDGE - EAVE) / span
    for sx in (-1, 1):
        for ya, yb in zip(FRAMES, FRAMES[1:]):
            yc = (ya + yb) / 2

            def on_slope(s, lift=0.0, sx=sx, yc=yc):
                return (sx * (HX + 0.5 - s * ux) - sx * lift * uz, yc, EAVE - 0.5 * uz / ux + s * uz + lift * ux)

            tag = f"{'l' if sx < 0 else 'r'}_{int(ya * 10)}"
            sheet = Part(f"roof_{tag}", origin=on_slope(span / 2, 0.36))
            beam(sheet, on_slope(0, 0.36), on_slope(span + 0.5, 0.36), yb - ya, 0.08, roof_sheet)
            sheet.build(parent=reveal)
            light = Part(f"rooflight_{tag}", origin=on_slope(span * 0.55, 0.36))
            beam(light, on_slope(span * 0.3, 0.36), on_slope(span * 0.8, 0.36), 1.0, 0.1, rooflight)
            light.build(parent=reveal)
    proof = Part("pump_roof", origin=((px0 + px1) / 2, (py0 + py1) / 2, ph + 0.1))
    proof.box((px1 - px0 + 0.4, py1 - py0 + 0.2, 0.2), ((px0 + px1) / 2, (py0 + py1) / 2 + 0.1, ph + 0.1), roof_sheet)
    proof.build(parent=reveal)

    # ------------------------------------------------------------ frame: portals, purlins, the two grating floors
    frame = Part("frame")
    for y in FRAMES:
        for sx in (-1, 1):
            cx = sx * (HX - 0.4)
            frame.box((0.55, 0.3, EAVE - 0.2), (cx, y, (EAVE - 0.2) / 2), frame_steel)
            beam(frame, (cx, y, EAVE - 0.35), (0, y, RIDGE - 0.4), 0.3, 0.55, frame_steel)
    for sx in (-1, 1):
        for s in np.linspace(0.8, span - 0.4, 6):
            frame.box((0.09, Y1 - Y0, 0.2), (sx * (HX - s * ux), 0, EAVE + s * uz + 0.12), purlin,
                      rot=Matrix.Rotation(-sx * math.atan2(uz, ux), 4, "Y"))
        for z in (3.0, 7.5, 12.0):
            frame.box((0.1, Y1 - Y0, 0.2), (sx * (HX - 0.16), 0, z), purlin)
    for level, x1 in ((L1, CX0), (L2, HX - 0.1)):
        xa = -HX + 0.1
        frame.box((x1 - xa, Y1 - Y0 - 0.2, 0.07), ((xa + x1) / 2, 0, level - 0.035), grate)
        for y in (Y0 + 0.15, 0.0, Y1 - 0.25):
            frame.box((x1 - xa, 0.22, 0.42), ((xa + x1) / 2, y, level - 0.28), frame_steel)
        for x in np.arange(xa + 0.4, x1, 2.75):
            frame.box((0.16, Y1 - Y0 - 0.4, 0.3), (x, 0, level - 0.22), frame_steel)
    for x in (-5.5, 0.0):
        for y in (Y0 + 0.15, 0.0, Y1 - 0.25):
            frame.box((0.3, 0.3, L2 - 0.5), (x, y, (L2 - 0.5) / 2), frame_steel)
    for level in (L1, L2):                                                # a stair up the back wall to each floor
        za = level - 5.0
        for dy in (-0.45, 0.45):
            beam(frame, (-10.2, 5.9 + dy, za + 0.05), (-4.2, 5.9 + dy, level - 0.05), 0.06, 0.25, frame_steel)
        for k in range(1, 14):
            frame.box((0.28, 0.9, 0.04), (-10.2 + k * 0.43, 5.9, za + k * 0.357), grate)
        frame.tube([(-10.2, 5.4, za + 1.0), (-4.2, 5.4, level + 0.95)], 0.025, safety, seg=6)
    for level in (L1, L2):                                                # handrails where a floor ends in the open
        x1 = CX0 if level == L1 else HX - 0.2
        for y in (Y1 - 0.5,):
            frame.tube([(-HX + 0.3, y, level + 1.0), (x1 - 0.1, y, level + 1.0)], 0.025, safety, seg=6)
    frame.build(fade_explode=1)

    lamps = Part("lamps")
    lamp_housings = Part("lamp_housings")
    for z in (L1 - 0.6, L2 - 0.6, EAVE - 0.4):
        for x in (-8.0, -2.5, 3.0):
            for y in (-3.5, 3.5):
                lamp_housings.box((1.3, 0.16, 0.07), (x, y, z + 0.04), M["black"])
                lamps.box((1.2, 0.1, 0.02), (x, y, z - 0.005), M["panel_led"])
    lamp_housings.build(fade_explode=1)
    lamps.build(fade_explode=1)

    # ------------------------------------------------------------ the control block: electrical room under, control room over
    e0, e1, c0, c1 = ROOM_Z
    block = Part("control_block")
    block.box((HX - CX0, 0.14, c1 + 0.2), ((CX0 + HX) / 2, CY1 + 0.07, (c1 + 0.2) / 2), panel)           # back wall
    block.box((0.14, CY1 - Y0, e1), (CX0, (Y0 + CY1) / 2, e1 / 2), panel)                                # electrical room's side
    block.box((HX - CX0 + 0.14, CY1 - Y0 + 0.14, c0 - e1), ((CX0 + HX) / 2, (Y0 + CY1) / 2 + 0.07, (e1 + c0) / 2), concrete,
              uv=uvs("concrete", "x"))                                                                    # the floor between
    block.box((HX - CX0 + 0.14, CY1 - Y0 + 0.14, 0.2), ((CX0 + HX) / 2, (Y0 + CY1) / 2 + 0.07, c1 + 0.1), panel)
    block.box((0.14, CY1 - Y0, 0.9), (CX0, (Y0 + CY1) / 2, c0 + 0.45), panel)                            # sill under the window
    block.box((0.14, CY1 - Y0, 0.5), (CX0, (Y0 + CY1) / 2, c1 - 0.25), panel)
    for y in np.linspace(Y0 + 0.05, CY1, 5):
        block.box((0.1, 0.08, c1 - c0 - 1.4), (CX0, y, c0 + 0.9 + (c1 - c0 - 1.4) / 2), M["frame"])
    for x in (6.5, 9.5):                                                  # ceiling lights in both rooms
        for y in (-5.2, -2.8):
            block.box((1.2, 0.3, 0.02), (x, y, e1 - 0.012), M["panel_led"])
            block.box((1.2, 0.3, 0.02), (x, y, c1 - 0.012), M["panel_led"])
    block.build(fade_explode=1)
    glass = Part("glass")
    glass.box((0.02, CY1 - Y0, c1 - c0 - 1.4), (CX0, (Y0 + CY1) / 2, c0 + 0.9 + (c1 - c0 - 1.4) / 2), M["glass"])
    glass.build(fade_explode=1)

    # ------------------------------------------------------------ furniture: the process, top floor down
    furniture = empty("furniture")
    pr = Part("process")
    raw_at = conveyor(pr, K, *RAW)
    pr.box((1.5, 1.7, 1.7), (7.5, 0.0, 11.35), equip)                                                    # head chute
    # the desliming screen, sloping from the chute down the floor
    sa, sb = Vector((6.9, 0.0, 11.45)), Vector((1.2, 0.0, 10.75))
    beam(pr, sa, sb, 2.3, 0.1, equip_dark)
    beam(pr, sa + Vector((0, 0, 0.12)), sb + Vector((0, 0, 0.12)), 1.9, 0.14, coal)
    for dy in (-1.2, 1.2):
        beam(pr, sa + Vector((0, dy, 0.25)), sb + Vector((0, dy, 0.25)), 0.08, 0.9, equip)
    pr.cyl(0.28, 2.7, (4.0, 0.0, 11.75), equip_dark, axis="y", seg=16)                                   # its exciter
    for x, z in ((6.4, 11.2), (1.8, 10.5)):
        for dy in (-1.2, 1.2):
            pr.cyl(0.11, z - L2 - 0.3, (x, dy, (z - 0.3 + L2) / 2), safety, seg=10)
    pr.box((4.6, 2.0, 0.5), (4.0, 0.0, 10.28), equip)                                                    # underpan
    # two dense medium cyclones on a frame, sloping toward their underflow
    cd = Vector((-math.cos(0.38), 0.0, -math.sin(0.38)))
    for x in (-3.2, -7.4):
        c = Vector((x, -1.5, 12.0))
        pr.cyl(0.52, 1.3, c, equip, seg=22, direction=cd)
        pr.cyl(0.52, 2.0, c + cd * 1.65, equip, seg=22, r2=0.15, direction=cd)
        pr.cyl(0.2, 0.7, c - cd * 0.95, equip_dark, seg=14, direction=cd)                               # overflow
        pr.box((0.5, 0.45, 0.4), c + Vector((0.35, 0.0, 0.62)), equip_dark)                             # feed inlet
        for dx in (0.6, -1.9):
            for dy in (-0.55, 0.55):
                pr.box((0.1, 0.1, 1.45 + dx * 0.36), (x + dx, -1.5 + dy, L2 + (1.45 + dx * 0.36) / 2), frame_steel)
    # two drain-and-rinse screens on the middle floor, each with its spray bars
    for xa, xb in ((0.6, -4.0), (-5.4, -10.0)):
        a, b = Vector((xa, -1.5, 6.55)), Vector((xb, -1.5, 6.15))
        beam(pr, a, b, 2.2, 0.1, equip_dark)
        beam(pr, a + Vector((0, 0, 0.1)), b + Vector((0, 0, 0.1)), 1.8, 0.1, coal)
        for dy in (-1.15, 1.15):
            beam(pr, a + Vector((0, dy, 0.22)), b + Vector((0, dy, 0.22)), 0.08, 0.8, equip)
        for t in (0.25, 0.5, 0.75):
            q = a.lerp(b, t)
            pr.cyl(0.035, 2.3, (q.x, q.y, q.z + 0.75), slurry, axis="y", seg=8)
        for q in (a.lerp(b, 0.1), a.lerp(b, 0.9)):
            for dy in (-1.15, 1.15):
                pr.cyl(0.1, q.z - L1 - 0.25, (q.x, q.y + dy, (q.z - 0.25 + L1) / 2), safety, seg=10)
        pr.box((abs(xa - xb), 1.9, 0.45), ((xa + xb) / 2, -1.5, 5.6), equip)
        beam(pr, (xb - 0.2, -1.2, 6.0), (xb - 0.2, 0.0, 2.0), 0.9, 0.9, equip)                           # chute to the product belt
    # a magnetic separator at the back of the middle floor
    pr.box((2.2, 1.5, 0.9), (2.6, 3.6, 5.45), equip)
    pr.cyl(0.5, 1.9, (2.6, 3.6, 6.2), M["steel"], axis="x", seg=22)
    pr.box((2.4, 0.3, 0.5), (2.6, 2.9, 6.1), equip_dark)
    # the ground floor: two medium sumps, a process water tank, three slurry pumps and their pipes
    tanks = ((-7.5, 3.9, 1.3), (-4.0, 3.9, 1.3))
    for x, y, r in tanks:
        pr.cyl(r, 2.2, (x, y, 2.9), tank, seg=26)
        pr.cyl(0.25, 1.3, (x, y, 1.15), tank, seg=26, r2=r)
        for k in range(3):
            t = k * 2.094 + 0.5
            pr.box((0.12, 0.12, 1.9), (x + math.cos(t) * (r - 0.1), y + math.sin(t) * (r - 0.1), 0.95), frame_steel)
    pr.cyl(1.7, 4.1, (0.6, 4.3, 2.08), tank, seg=30)
    for z in (1.4, 2.8):
        pr.cyl(1.72, 0.05, (0.6, 4.3, z), M["steel"], seg=30)
    pumps = (-8.5, -5.0, -1.5)
    for k, x in enumerate(pumps):
        y = -3.2
        pr.box((2.1, 0.85, 0.22), (x, y, 0.14), equip_dark)
        pr.cyl(0.5, 0.42, (x - 0.55, y, 0.85), equip, axis="y", seg=22)                                  # volute
        pr.cyl(0.2, 0.3, (x - 0.55, y - 0.3, 0.85), equip, axis="y", seg=14)
        pr.cyl(0.32, 1.0, (x + 0.5, y, 0.82), equip_dark, axis="x", seg=18)                              # motor
        pr.cyl(0.36, 0.1, (x + 1.02, y, 0.82), equip_dark, axis="x", seg=18)
        pr.box((0.3, 0.3, 0.2), (x - 0.05, y, 0.85), safety)                                             # coupling guard
        vx = x - 0.55
        top = (12.6, 12.6, 7.3)[k]
        tgt = (-7.05, -2.85, None)[k]
        if tgt is not None:                                               # up to a cyclone's feed inlet
            run(pr, [(vx, y, 1.3), (vx, y, top), (tgt, y, top), (tgt, -1.5, top)], 0.12, slurry, bend=0.35, seg=14)
        else:                                                             # rinse water to the spray bars
            run(pr, [(vx, y, 1.3), (vx, y, top), (vx, -1.5, top)], 0.09, slurry, bend=0.3, seg=12)
        sx_, sy_ = (tanks[k][0], tanks[k][1] - 1.0) if k < 2 else (0.6, 2.7)
        run(pr, [(sx_, sy_, 0.5), (sx_, -1.6, 0.5), (vx, -1.6, 0.5), (vx, -2.7, 0.5), (vx, -2.7, 0.85)], 0.12, slurry, bend=0.3, seg=12)
    prod_at = conveyor(pr, K, PRODUCT[0], PRODUCT[1], legs=False)
    for x in (-9.0, -5.0, -1.0, 2.0):
        for dy in (-0.72, 0.72):
            pr.box((0.1, 0.1, 1.0), (x, dy, 0.5), frame_steel)
    pr.build(parent=furniture, fade_explode=1)

    # ------------------------------------------------------------ context: the mine round the plant
    context = empty("context")
    out = Part("yard_process")
    stack_at = conveyor(out, K, PRODUCT[1], PRODUCT[2])
    out.cyl(8.5, 7.4, (-34.0, 0.4, 3.6), coal, seg=24, r2=0.5)                                           # the product stockpile
    hx = RAW[0][0] - 0.2                                                                                  # the dump hopper over the raw belt's tail
    out.cyl(2.6, 1.9, (hx, 0.0, 2.6), equip, seg=4, r2=0.9)
    for dx in (-1.9, 1.9):
        for dy in (-1.9, 1.9):
            out.box((0.2, 0.2, 3.5), (hx + dx, dy, 1.75), frame_steel)
    out.box((4.2, 4.2, 0.2), (hx, 0.0, 3.55), frame_steel)
    out.box((0.3, 4.6, 0.5), (hx + 2.2, 0.0, 0.25), concrete)                                            # wheel stop
    # a thickener behind the stockpile: a low round tank with its bridge, rake drive and feed well
    kx, ky, kr = -22.0, 16.0, 6.5
    out.cyl(kr, 2.6, (kx, ky, 1.3), tank, seg=40)
    out.cyl(kr - 0.2, 0.04, (kx, ky, 2.5), water, seg=40)
    out.box((2 * kr + 0.8, 0.9, 0.3), (kx, ky, 3.0), frame_steel)
    out.tube([(kx - kr - 0.4, ky - 0.45, 4.0), (kx + kr + 0.4, ky - 0.45, 4.0)], 0.03, safety, seg=6)
    out.cyl(1.2, 0.9, (kx, ky, 2.5), tank, seg=24)
    out.box((1.0, 1.0, 0.9), (kx, ky, 3.6), equip_dark)
    out.build(parent=context, fade_explode=1)

    machines = Part("machines")
    haul_truck(machines, T, hx + 7.3, 0.0, yaw=-math.pi / 2, load=coal)
    excavator(machines, T, -24.0, -3.4, yaw=math.pi / 2 + 0.25)
    machines.build(parent=context, fade_explode=1)

    yard = Part("yard")
    for (x, y) in ((30.0, 13.0), (-14.0, 13.5)):                                                          # light towers
        yard.rbox((1.3, 2.2, 0.9), (x, y, 0.85), safety, 0.08)
        for dx in (-0.7, 0.7):
            yard.cyl(0.33, 0.2, (x + dx, y, 0.33), T["tyre"], axis="x", seg=16)
        yard.cyl(0.07, 7.0, (x, y + 0.6, 4.6), M["steel"], seg=10)
        yard.box((1.9, 0.1, 0.1), (x, y + 0.6, 8.1), M["black"])
        for dx in (-0.75, -0.25, 0.25, 0.75):
            yard.box((0.42, 0.14, 0.32), (x + dx, y + 0.52, 8.35), M["black"], rot=Matrix.Rotation(0.5, 4, "X"))
            yard.box((0.36, 0.02, 0.26), (x + dx, y + 0.44, 8.32), M["downlight"], rot=Matrix.Rotation(0.5, 4, "X"))
    for x in np.arange(px0 - 0.6, tx + tr + 1.5, 2.4):                                                    # bollards before the fire station
        if not px0 < x < px1:
            yard.cyl(0.09, 1.0, (x, Y0 + 0.4, 0.5), safety, seg=10)
    yard.build(parent=context, fade_explode=1)

    land = Part("land")
    land.cyl(1.2, 70.0, (-10.0, 34.0, -0.25), rock_a, axis="x", seg=8)                                    # berms
    land.cyl(1.1, 30.0, (44.0, 30.0, -0.2), rock_a, axis="x", seg=8)
    cx, cy = 0.0, 16.0                                                                                    # the pit's benches, an arc behind
    for k in range(5):
        r = 50.0 + k * 8.0
        n = 11
        for i in range(n):
            a = math.radians(8 + (164 / (n - 1)) * i)
            chord = 2 * (r + 12) * math.tan(math.radians(164 / (n - 1)) / 2) + 1.5
            jitter = rng.uniform(-0.8, 0.8)
            rot = Matrix.Rotation(a - math.pi / 2, 4, "Z")
            land.box((chord, 13.0, 5.0 + rng.uniform(0.0, 0.5)),
                     (cx + math.cos(a) * (r + 6.5 + jitter), cy + math.sin(a) * (r + 6.5 + jitter), k * 5.0 + 2.5),
                     rock_a if k % 2 else rock_c, rot=rot)
            land.box((chord, 13.0, 0.5), (cx + math.cos(a) * (r + 6.6 + jitter), cy + math.sin(a) * (r + 6.6 + jitter), k * 5.0 + 1.8),
                     rock_b, rot=rot)
    land.build(parent=context, fade_explode=1)

    # ------------------------------------------------------------ fire: the water tank and the pump house
    house = Part("pump_house")
    house.box((px1 - px0, 0.16, ph), ((px0 + px1) / 2, py1 - 0.08, ph / 2), panel)
    for x in (px0 + 0.08, px1 - 0.08):
        house.box((0.16, py1 - py0, ph), (x, (py0 + py1) / 2, ph / 2), panel)
    house.box((px1 - px0, 0.2, 0.5), ((px0 + px1) / 2, py1 - 0.1, 0.25), fire_red)                        # a red band, as on a fire station
    for x in (14.8, 18.3):
        house.box((1.2, 0.18, 0.04), (x, py1 - 0.2, ph - 0.25), M["panel_led"])
    house.build(fade_explode=1)

    ft = Part("fire_tank", origin=(tx, ty, th / 2))
    ft.cyl(tr, th, (tx, ty, th / 2 + 0.2), fire_tank, seg=40)
    ft.cyl(tr + 0.06, 0.5, (tx, ty, th + 0.45), fire_tank, seg=40, r2=0.4)
    for z in np.arange(1.4, th, 1.2):
        ft.cyl(tr + 0.03, 0.06, (tx, ty, z + 0.2), M["steel"], seg=40)
    ft.cyl(tr + 0.02, 0.45, (tx, ty, th - 0.6), fire_red, seg=40)                                         # the tank's band
    for dx in (-0.25, 0.25):                                                                              # ladder, on the camera's side
        ft.cyl(0.025, th, (tx - 1.2 + dx, ty - math.sqrt(tr ** 2 - 1.2 ** 2) - 0.12, th / 2 + 0.2), M["steel"], seg=6)
    for z in np.arange(0.6, th, 0.4):
        ft.box((0.5, 0.03, 0.03), (tx - 1.2, ty - math.sqrt(tr ** 2 - 1.2 ** 2) - 0.12, z), M["steel"])
    ft.build(**FIRE)

    fp = Part("fire_pumps", origin=((px0 + px1) / 2, -5.0, 1.0))
    py, hy = -5.3, -3.5                                                    # the pump sets' line, the headers' line
    sz, dz = 0.55, 2.4                                                     # suction header, discharge header
    for x, kind in ((14.6, "electric"), (17.8, "diesel")):
        fp.box((2.9, 1.0, 0.25), (x, py, 0.25), equip_dark)
        fp.cyl(0.42, 0.7, (x + 0.75, py, 0.95), fire_red, axis="x", seg=22)                              # pump casing
        fp.cyl(0.55, 0.12, (x + 0.75, py, 0.95), fire_red, axis="x", seg=22)
        fp.box((0.35, 0.3, 0.3), (x + 0.2, py, 0.95), safety)                                             # coupling guard
        if kind == "electric":
            fp.cyl(0.4, 1.15, (x - 0.65, py, 0.95), equip_dark, axis="x", seg=20)
            fp.cyl(0.44, 0.12, (x - 1.25, py, 0.95), equip_dark, axis="x", seg=20)
            fp.box((0.3, 0.3, 0.25), (x - 0.65, py, 1.45), equip_dark)
        else:
            fp.box((1.5, 0.75, 0.95), (x - 0.75, py, 1.0), equip_dark)                                    # engine block
            fp.box((0.12, 0.85, 1.0), (x - 1.55, py, 1.0), M["black"])                                    # radiator
            fp.box((1.2, 0.5, 0.2), (x - 0.75, py, 1.55), equip)
            run(fp, [(x - 0.4, py + 0.2, 1.6), (x - 0.4, py + 0.2, ph + 0.9)], 0.07, M["steel"], seg=10)   # exhaust through the roof
            fp.rbox((0.9, 0.5, 0.7), (x - 0.6, hy + 0.2, 1.75), fire_red, 0.05)                           # day tank
        run(fp, [(x + 0.75, py, 0.95), (x + 0.75, hy, 0.95), (x + 0.75, hy, sz)], 0.1, fire_red, bend=0.25, seg=12)
        run(fp, [(x + 1.15, py, 1.35), (x + 1.15, py, dz), (x + 1.15, hy, dz)], 0.1, fire_red, bend=0.25, seg=12)
        fp.cyl(0.16, 0.05, (x + 1.15, py, 1.9), M["steel"], seg=14)                                       # check valve, isolating valve
        fp.cyl(0.14, 0.04, (x + 1.15, py + 0.9, dz + 0.22), fire_red, seg=14)
        fp.cyl(0.02, 0.22, (x + 1.15, py + 0.9, dz + 0.11), M["steel"], seg=6)
    jx = 20.2                                                              # the jockey pump: small, upright, holds the pressure
    fp.cyl(0.14, 1.0, (jx, py, 0.75), fire_red, seg=14)
    fp.cyl(0.17, 0.45, (jx, py, 1.5), equip_dark, seg=14)
    fp.box((0.5, 0.5, 0.25), (jx, py, 0.2), equip_dark)
    run(fp, [(jx, py, 0.45), (jx, hy, 0.45), (jx, hy, sz)], 0.05, fire_red, seg=8)
    run(fp, [(jx, py, 1.05), (jx - 0.5, py, 1.05), (jx - 0.5, py, dz), (jx - 0.5, hy, dz)], 0.05, fire_red, seg=8)
    run(fp, [(tx - tr + 0.1, hy, sz), (px0 + 0.9, hy, sz)], 0.16, fire_red, seg=16)                       # suction header, from the tank
    run(fp, [(px1 - 0.5, hy, dz), (RING[0], hy, dz), (RING[0], hy, 0.4)], 0.16, fire_red, bend=0.4, seg=16)   # discharge header
    for x in (px0 + 0.95, px1 - 0.55):
        fp.cyl(0.19, 0.06, (x, hy, sz if x < 14 else dz), M["steel"], axis="x", seg=16)
    for k, x in enumerate((13.25, 16.4)):                                 # the pumps' controllers, on the back wall
        fp.box((0.7, 0.3, 1.3), (x, py1 - 0.32, 1.9), fire_red)
        fp.box((0.2, 0.02, 0.14), (x, py1 - 0.48, 2.25), M["tv"])
        fp.box((0.06, 0.02, 0.06), (x - 0.15, py1 - 0.48, 1.95), green)
        fp.box((0.06, 0.02, 0.06), (x + 0.15, py1 - 0.48, 1.95), red_lamp)
    fp.build(**FIRE)

    # ------------------------------------------------------------ fire: the ring main, its hydrants, the riser and the grids
    rx, rb, rl = RING
    fm = Part("fire_main", origin=(0.0, rb, 0.4))
    run(fm, [(rx, hy, 0.4), (rx, rb, 0.4), (rl, rb, 0.4), (rl, RISER[1], 0.4), (RISER[0], RISER[1], 0.4)], 0.13, fire_red, bend=0.5, seg=16)
    for q in ((rx, 1.0), (rx, 6.0), (6.0, rb), (0.0, rb), (-6.0, rb), (rl, 4.0), (rl, -2.0)):
        fm.box((0.5, 0.5, 0.3), (q[0], q[1], 0.15), concrete)                                             # sleepers
    for (x, y, dx, dy) in ((rx, 5.0, 1.3, 0.0), (0.0, rb, 0.0, 1.3), (rl, 2.0, -1.3, 0.0)):               # pillar hydrants
        run(fm, [(x, y, 0.4), (x + dx, y + dy, 0.4)], 0.08, fire_red, seg=10)
        hxx, hyy = x + dx, y + dy
        fm.cyl(0.11, 1.0, (hxx, hyy, 0.65), fire_red, seg=14)
        fm.ball(0.14, (hxx, hyy, 1.18), fire_red, subdiv=2)
        fm.cyl(0.07, 0.42, (hxx, hyy, 0.85), fire_red, axis="x" if dy else "y", seg=10)
        fm.cyl(0.09, 0.05, (hxx, hyy, 1.33), M["steel"], seg=8)
    fm.build(**FIRE)

    spr = Part("fire_sprinklers", origin=(0.0, RISER[1], 8.0))
    rxx, ryy = RISER
    run(spr, [(rxx, ryy, 0.4), (rxx, ryy, SPRINKLER_Z[2]), (HX - 0.6, ryy, SPRINKLER_Z[2])], 0.1, fire_red, bend=0.3, seg=14)
    spr.cyl(0.19, 0.5, (rxx, ryy, 1.3), fire_red, seg=16)                                                 # the alarm valve and its trim
    spr.cyl(0.16, 0.06, (rxx, ryy - 0.24, 1.75), fire_red, axis="y", seg=16)                              # water motor gong
    spr.cyl(0.07, 0.03, (rxx + 0.24, ryy - 0.1, 1.45), M["white_metal"], axis="y", seg=12)
    spr.cyl(0.11, 0.05, (rxx, ryy - 0.26, 0.9), M["steel"], axis="y", seg=12)                             # handwheel
    for k, z in enumerate(SPRINKLER_Z):
        x1 = CX0 - 0.6 if k < 2 else HX - 0.6
        if k < 2:
            run(spr, [(rxx, ryy, z), (x1, ryy, z)], 0.08, fire_red, seg=12)
        for x in BRANCHES + ((6.5, 9.5) if k == 2 else ()):
            run(spr, [(x, ryy, z), (x, Y1 - 0.8, z)], 0.04, fire_red, seg=8)
            for y in (-4.5, -1.5, 1.5, 4.5):
                spr.cyl(0.03, 0.1, (x, y, z - 0.08), M["chrome"], seg=8)
                spr.cyl(0.07, 0.012, (x, y, z - 0.14), M["chrome"], seg=10)
    spr.build(**FIRE)

    dl = Part("fire_deluge", origin=(10.0, 0.0, 6.0))
    # the raw coal conveyor: a feed from the ring main to a deluge valve at the tail, then open nozzles over the belt
    tail = raw_at(0.0, 1.15)
    run(dl, [(rx, 2.6, 0.4), (RAW[0][0] + 0.9, 2.6, 0.4), (RAW[0][0] + 0.9, 0.0, 0.4), (RAW[0][0] + 0.9, 0.0, tail.z + 0.2)],
        0.09, fire_red, bend=0.35, seg=12)
    dl.cyl(0.17, 0.45, (RAW[0][0] + 0.9, 0.0, 1.1), fire_red, seg=16)                                     # deluge valve
    run(dl, [(RAW[0][0] + 0.9, 0.0, tail.z + 0.2), tuple(raw_at(0.0, 1.15)), tuple(raw_at(0.985, 1.15))], 0.06, fire_red, seg=10)
    for t in np.arange(0.04, 0.99, 2.0 / 31.5):
        q = raw_at(t, 1.02)
        dl.cyl(0.05, 0.16, q, M["chrome"], seg=8, r2=0.1)
    # the product conveyor: a second valve at the riser, a line over the belt inside the plant and up the stacker
    run(dl, [(rxx, ryy + 0.5, 0.4), (rxx, ryy + 0.5, 2.5), (rxx, 0.0, 2.5), (PRODUCT[0][0] - 0.3, 0.0, 2.5)], 0.06, fire_red, bend=0.3, seg=10)
    dl.cyl(0.15, 0.4, (rxx, ryy + 0.5, 1.3), fire_red, seg=16)
    run(dl, [tuple(stack_at(0.0, 1.2)), tuple(stack_at(0.97, 1.2))], 0.06, fire_red, seg=10)
    for x in np.arange(-10.0, 2.0, 2.0):
        dl.cyl(0.05, 0.16, (x, 0.0, 2.38), M["chrome"], seg=8, r2=0.1)
    for t in np.arange(0.05, 0.97, 2.0 / 23.0):
        dl.cyl(0.05, 0.16, stack_at(t, 1.07), M["chrome"], seg=8, r2=0.1)
    dl.build(**FIRE)

    fx = Part("fire_points", origin=(0.0, 0.0, 6.0))
    for z in (0.0, L1, L2):                                                # a hose reel cabinet and an extinguisher on every floor
        fx.box((0.2, 0.8, 0.9), (-HX + 0.42, 1.5, z + 1.25), fire_red)
        fx.box((0.02, 0.5, 0.5), (-HX + 0.53, 1.5, z + 1.25), M["tv"])
        fx.cyl(0.08, 0.5, (-HX + 0.45, 0.6, z + 0.9), fire_red, seg=12)
        fx.cyl(0.08, 0.5, (CX0 - 0.35 if z < L2 else HX - 0.45, Y0 + 0.5, z + 0.9), fire_red, seg=12)
    # the electrical room is put out with gas, not water: a cylinder bank and two nozzles under its ceiling
    for dy in (0.0, 0.42, 0.84):
        fx.cyl(0.17, 1.55, (CX0 + 0.42, -4.6 + dy, 0.9), fire_red, seg=16)
        fx.cyl(0.05, 0.14, (CX0 + 0.42, -4.6 + dy, 1.74), M["steel"], seg=8)
    fx.box((0.1, 1.1, 0.06), (CX0 + 0.3, -4.18, 1.2), M["steel"])
    run(fx, [(CX0 + 0.42, -4.6, 1.8), (CX0 + 0.42, -4.6, e1 - 0.3), (CX0 + 0.42, -3.4, e1 - 0.3), (HX - 1.5, -3.4, e1 - 0.3)],
        0.04, fire_red, bend=0.2, seg=10)
    for x in (7.2, 9.5):
        fx.cyl(0.04, 0.12, (x, -3.4, e1 - 0.4), M["chrome"], seg=8, r2=0.09)
    fx.build(**FIRE)

    for k, y in enumerate(ROOF_FANS):                                       # smoke exhaust fans astride the ridge
        rf = Part(f"smoke_fan_{k}", origin=(0.0, y, RIDGE + 0.6))
        rf.box((1.6, 1.4, 0.5), (0.0, y, RIDGE + 0.2), M["steel"])
        rf.cyl(0.66, 0.55, (0.0, y, RIDGE + 0.72), cowl, seg=26)
        rf.cyl(0.95, 0.35, (0.0, y, RIDGE + 1.3), cowl, seg=26, r2=0.25)
        rf.cyl(0.74, 0.4, (0.0, y, RIDGE - 0.6), cowl, seg=26, r2=0.6)
        rf.build(**FIRE)
        blades = Part(f"smoke_fan_blades_{k}", origin=(0.0, y, RIDGE - 0.4))
        blades.cyl(0.13, 0.2, (0.0, y, RIDGE - 0.4), M["black"], seg=14)
        for a in range(6):
            t = a * math.pi / 3
            blades.box((0.42, 0.2, 0.02), (math.cos(t) * 0.34, y + math.sin(t) * 0.34, RIDGE - 0.4), M["steel"],
                       rot=Matrix.Rotation(t, 4, "Z") @ Matrix.Rotation(0.5, 4, "X"))
        blades.build(spin_up=1, **FIRE)

    # ------------------------------------------------------------ alarm: detection on the belts, devices on every floor, one panel
    al = Part("alarm", origin=(0.0, Y0, 8.0))
    fy = Y0 - 0.12                                                          # the front face of the columns at the cut
    for at_, t1 in ((raw_at, 0.985), (stack_at, 0.97)):                    # heat sensing cable over each belt
        run(al, [tuple(at_(0.01, 0.75, 0.45)), tuple(at_(t1, 0.75, 0.45))], 0.035, alarm_cable, seg=6)
    run(al, [(PRODUCT[0][0], -0.45, 2.05), (PRODUCT[1][0], -0.45, 2.05)], 0.035, alarm_cable, seg=6)
    for q, look in ((raw_at(0.93, 1.9, 0.9), (0.4, 0.3, -1)), (raw_at(0.06, 1.9, 0.9), (-0.4, 0.3, -1)),
                    (Vector((-9.6, -1.0, 3.4)), (0, 0.5, -1)), (stack_at(0.9, 1.9, 0.9), (0.4, 0.3, -1))):   # flame detectors at the transfers
        al.rbox((0.22, 0.22, 0.3), q, alarm_red, 0.03)
        al.cyl(0.08, 0.1, q + Vector(look).normalized() * 0.18, M["black"], seg=12, direction=Vector(look))
        al.cyl(0.02, 0.8, q - Vector((0, 0, 0.5)), M["steel"], seg=6)
    trunk = CX0 - 0.16
    for k, z in enumerate((3.85, 8.85, 13.5)):                             # a loop under each floor, devices on the columns
        run(al, [(-HX + 0.5, fy, z), (trunk, fy, z)], 0.035, alarm_cable, seg=6)
        base = (0.0, L1, L2)[k]
        for x in (-10.6, -5.5, 0.0):
            run(al, [(x, fy, z), (x, fy, base + 1.45)], 0.025, alarm_cable, seg=6)
            al.box((0.16, 0.06, 0.16), (x, fy - 0.02, base + 1.4), alarm_red)                             # call point
            al.box((0.18, 0.1, 0.2), (x, fy - 0.03, base + 2.5), alarm_red)                               # sounder beacon
            al.cyl(0.07, 0.1, (x, fy - 0.05, base + 2.68), red_lamp, seg=12)
        for x in (-8.5, -2.5, 3.5):                                        # smoke detectors under the floor above
            for y in (-3.0, 3.0):
                al.cyl(0.12, 0.06, (x, y, (L1, L2, EAVE - 0.35)[k] - (0.52 if k < 2 else 0.0)), detector, seg=14)
    run(al, [(trunk, fy, 2.0), (trunk, fy, 13.5)], 0.04, alarm_cable, seg=6)
    for z in (e1 - 0.04, c1 - 0.04):                                       # the two rooms
        for x in (6.8, 9.4):
            al.cyl(0.12, 0.06, (x, -4.0, z), detector, seg=14)
    al.box((0.16, 0.06, 0.16), (CX0 + 0.15, fy + 0.2, 1.4), alarm_red)
    # the fire alarm panel on the control room's back wall, the loop brought to it along the ceiling
    ax_, ay_ = CX0 + 0.75, CY1 - 0.1
    al.box((0.8, 0.16, 1.0), (ax_, ay_, c0 + 1.75), alarm_red)
    al.box((0.4, 0.02, 0.24), (ax_, ay_ - 0.09, c0 + 2.0), M["tv"])
    for k in range(5):
        al.box((0.05, 0.02, 0.05), (ax_ - 0.26 + k * 0.13, ay_ - 0.09, c0 + 1.6), green if k else red_lamp)
    run(al, [(trunk, fy, c1 - 0.25), (CX0 + 0.3, fy + 0.3, c1 - 0.25), (CX0 + 0.3, ay_ - 0.1, c1 - 0.25), (ax_, ay_ - 0.1, c1 - 0.25),
             (ax_, ay_ - 0.1, c0 + 2.25)], 0.035, alarm_cable, seg=6)
    al.build(**ALARM)

    # ------------------------------------------------------------ automation: the electrical room's cabinets
    x0, x1, dy0, dy1, z0, z1 = PLC
    mcc = Part("mcc", origin=(8.8, dy1, 1.2))
    for k in range(4):                                                     # motor control cabinets, a row beside the PLC
        x = 7.5 + k * 0.92
        mcc.box((0.9, dy1 - dy0, z1 - z0), (x, (dy0 + dy1) / 2, (z0 + z1) / 2), cabinet)
        mcc.box((0.84, 0.02, z1 - z0 - 0.3), (x, dy0 - 0.01, (z0 + z1) / 2 - 0.05), M["grey"])
        for r in range(4):
            for c in range(2):
                mcc.box((0.3, 0.02, 0.36), (x - 0.19 + c * 0.38, dy0 - 0.025, z0 + 0.45 + r * 0.46), cabinet)
                mcc.box((0.05, 0.02, 0.05), (x - 0.27 + c * 0.38, dy0 - 0.04, z0 + 0.56 + r * 0.46), green if (r + c + k) % 4 else red_lamp)
                mcc.box((0.08, 0.03, 0.04), (x - 0.12 + c * 0.38, dy0 - 0.04, z0 + 0.42 + r * 0.46), M["black"])
    mcc.box((4.7, dy1 - dy0, 0.1), (8.4, (dy0 + dy1) / 2, 0.05), M["black"])                              # plinth
    mcc.build(**AUTO)
    case = Part("ahu_casing", origin=((x0 + x1) / 2, (dy0 + dy1) / 2, (z0 + z1) / 2))
    case.box((x1 - x0, 0.03, z1 - z0), ((x0 + x1) / 2, dy1 - 0.015, (z0 + z1) / 2), cabinet)
    for x in (x0 + 0.015, x1 - 0.015):
        case.box((0.03, dy1 - dy0, z1 - z0), (x, (dy0 + dy1) / 2, (z0 + z1) / 2), cabinet)
    for z in (z0 + 0.015, z1 - 0.015):
        case.box((x1 - x0, dy1 - dy0, 0.03), ((x0 + x1) / 2, (dy0 + dy1) / 2, z), cabinet)
    case.box((x1 - x0 - 0.1, 0.02, z1 - z0 - 0.1), ((x0 + x1) / 2, dy1 - 0.05, (z0 + z1) / 2), M["grey"])   # mounting plate
    for dx in (-0.4, 0.4):                                                 # wiring ducts
        case.box((0.06, 0.06, z1 - z0 - 0.3), ((x0 + x1) / 2 + dx, dy1 - 0.09, (z0 + z1) / 2), M["white"])
    case.build(explode_ahu=[0.0, 0.0, 0.0], delay=0.0, **AUTO)
    door = Part("ahu_door", origin=(x0, dy0, (z0 + z1) / 2))
    door.box((x1 - x0, 0.03, z1 - z0), ((x0 + x1) / 2, dy0 + 0.015, (z0 + z1) / 2), cabinet)
    door.box((0.04, 0.05, 0.2), (x1 - 0.1, dy0 - 0.02, (z0 + z1) / 2), M["black"])
    door.box((0.3, 0.02, 0.2), ((x0 + x1) / 2, dy0 - 0.005, z1 - 0.5), M["tv"])                           # its operator panel
    door.build(explode_ahu=[0.0, 0.0, 0.0], delay=0.05, **AUTO)
    for k, z in enumerate((1.75, 1.3, 0.85)):                              # the racks: a controller and two rows of I/O
        rack = Part(f"plc_rack_{k}", origin=((x0 + x1) / 2, dy1 - 0.2, z))
        rack.box((0.8, 0.04, 0.3), ((x0 + x1) / 2, dy1 - 0.1, z), M["black"])
        for i in range(9):
            wide = 0.14 if (k == 0 and i < 2) else 0.075
            xm = x0 + 0.14 + i * 0.085 + (0.03 if k == 0 and i < 2 else 0.06 if k == 0 else 0.0)
            rack.box((wide, 0.16, 0.26), (xm, dy1 - 0.2, z), auto_blue if (k == 0 and i < 2) else M["grey"])
            rack.box((0.03, 0.012, 0.03), (xm, dy1 - 0.285, z + 0.08), green if (i + k) % 5 else red_lamp)
        rack.build(explode_ahu=[0.0, -0.55 - k * 0.3, 0.0], delay=0.25 + k * 0.12, **AUTO)
    term = Part("plc_terminals", origin=((x0 + x1) / 2, dy1 - 0.15, 0.4))
    term.box((0.8, 0.08, 0.1), ((x0 + x1) / 2, dy1 - 0.12, 0.42), M["white"])
    for i in range(12):
        term.box((0.012, 0.085, 0.1), (x0 + 0.14 + i * 0.065, dy1 - 0.12, 0.42), M["black"])
    term.build(explode_ahu=[0.0, -0.4, 0.0], delay=0.6, **AUTO)

    # ------------------------------------------------------------ automation: the control room
    cr = Part("control_room", origin=(8.0, -4.0, c0 + 1.0))
    wy = CY1 - 0.02                                                        # a video wall on the back wall: the plant at a glance
    for r in range(2):
        for c in range(3):
            xa = 6.75 + c * 1.38
            za = c0 + 1.45 + r * 0.84
            cr.box((1.34, 0.06, 0.8), (xa + 0.65, wy - 0.04, za + 0.38), M["black"])
            cr.quad([(xa + 0.03, wy - 0.075, za + 0.03), (xa + 1.27, wy - 0.075, za + 0.03), (xa + 1.27, wy - 0.075, za + 0.73),
                     (xa + 0.03, wy - 0.075, za + 0.73)], M["screen"])
    cr.rbox((4.6, 0.9, 0.05), (8.3, -4.1, c0 + 0.76), M["white"], 0.015)                                  # the operators' desk
    for x in (6.2, 8.3, 10.4):
        cr.box((0.06, 0.8, 0.74), (x, -4.1, c0 + 0.37), M["grey"])
    for x in (6.9, 7.8, 8.8, 9.7):
        cr.box((0.74, 0.04, 0.46), (x, -3.9, c0 + 1.2), M["black"])
        cr.quad([(x - 0.35, -3.925, c0 + 0.99), (x + 0.35, -3.925, c0 + 0.99), (x + 0.35, -3.925, c0 + 1.41), (x - 0.35, -3.925, c0 + 1.41)], M["screen"])
        cr.box((0.06, 0.06, 0.2), (x, -3.87, c0 + 0.88), M["black"])
        cr.box((0.4, 0.14, 0.015), (x, -4.25, c0 + 0.795), M["black"])
    for x in (7.3, 9.3):                                                   # two chairs
        cr.rbox((0.5, 0.5, 0.08), (x, -5.0, c0 + 0.48), M["fabric"], 0.03, uv=uvs("fabric"))
        cr.rbox((0.46, 0.07, 0.55), (x, -5.26, c0 + 0.85), M["fabric"], 0.03, uv=uvs("fabric"))
        cr.cyl(0.03, 0.42, (x, -5.0, c0 + 0.24), M["chrome"], seg=8)
        cr.cyl(0.26, 0.04, (x, -5.0, c0 + 0.03), M["black"], seg=5)
    cr.box((0.7, 0.9, 2.0), (HX - 0.55, -1.7, c0 + 1.0), M["black"])                                      # the server rack
    for z in np.arange(c0 + 0.3, c0 + 1.9, 0.2):
        cr.box((0.02, 0.8, 0.03), (HX - 0.91, -1.7, z), auto_blue)
    cr.build(**AUTO)

    # ------------------------------------------------------------ automation: trays, cables and the instruments in the field
    def tray(p, a, b, cables=3):
        """A ladder tray from a to b (along x, y or z) with its cables."""
        a, b = Vector(a), Vector(b)
        d = b - a
        axis = max(range(3), key=lambda i: abs(d[i]))
        mid = (a + b) / 2
        size = [0.34, 0.34, 0.34]
        size[axis] = d.length
        flat = 2 if axis != 2 else 1                                       # a riser lies against the wall behind it
        size[flat] = 0.02
        p.box(size, mid, tray_m)
        side = [i for i in range(3) if i not in (axis, flat)][0]
        for s in (-1, 1):
            rail = [0.02, 0.02, 0.02]
            rail[axis] = d.length
            rail[flat] = 0.09
            o = Vector((0, 0, 0))
            o[side] = s * 0.17
            o[flat] = 0.04 if axis != 2 else -0.04
            p.box(rail, mid + o, tray_m)
        for k in range(cables):
            o = Vector((0, 0, 0))
            o[side] = (k - (cables - 1) / 2) * 0.08
            o[flat] = 0.035 if axis != 2 else -0.035
            run(p, [tuple(a + o), tuple(b + o)], 0.03, auto_cable, seg=6)

    tr_ = Part("cable_trays", origin=(0.0, TRAY_Y, 8.0))
    tray(tr_, (CX0 - 0.35, TRAY_Y + 0.25, 0.4), (CX0 - 0.35, TRAY_Y + 0.25, TRAY_Z[2]))                   # the riser beside the rooms
    for k, z in enumerate(TRAY_Z):
        tray(tr_, (-HX + 0.5, TRAY_Y, z), ((CX0 - 0.2) if k < 2 else HX - 0.5, TRAY_Y, z))
    tray(tr_, (CX0 - 0.2, TRAY_Y, e1 - 0.45), (HX - 0.3, TRAY_Y, e1 - 0.45))                              # over the cabinets
    tray(tr_, (9.8, TRAY_Y, e1 - 0.45), (9.8, dy0 + 0.3, e1 - 0.45), cables=4)
    for x in (6.4, 7.9, 9.3):
        run(tr_, [(x, (dy0 + dy1) / 2, e1 - 0.42), (x, (dy0 + dy1) / 2, z1)], 0.03, auto_cable, seg=6)
    run(tr_, [(6.4, (dy0 + dy1) / 2, e1 - 0.42), (9.8, (dy0 + dy1) / 2, e1 - 0.42)], 0.03, auto_cable, seg=6)
    tray(tr_, (HX + 0.1, py1 + 0.35, 3.9), (px1 - 0.3, py1 + 0.35, 3.9))                                   # out to the fire pumps
    run(tr_, [(HX - 0.3, TRAY_Y, e1 - 0.45), (HX - 0.3, py1 + 0.35, e1 - 0.45), (HX + 0.1, py1 + 0.35, 3.9)], 0.03, auto_cable, seg=6)
    for x in (13.25, 16.4):
        run(tr_, [(x, py1 + 0.35, 3.9), (x, py1 - 0.32, 3.9), (x, py1 - 0.32, 2.55)], 0.025, auto_cable, seg=6)
    run(tr_, [(CX0 - 0.35, TRAY_Y + 0.25, c0 + 0.35), (CX0 + 0.4, TRAY_Y + 0.25, c0 + 0.35), (CX0 + 0.4, -4.1, c0 + 0.35),
              (8.3, -4.1, c0 + 0.35)], 0.03, auto_cable, seg=6)                                           # up to the operators' desk
    tr_.build(**AUTO)

    fi = Part("field_instruments", origin=(0.0, 0.0, 6.0))

    def wired(q, z, drop=True):
        """A cable from an instrument at q out to the front and along it to the tray at height z."""
        q = Vector(q)
        run(fi, [tuple(q), (q.x, TRAY_Y, q.z), (q.x, TRAY_Y, z)], 0.024, auto_cable, seg=6)

    def head(q, body=0.09):
        """A transmitter's head: a blue housing with its round cover."""
        q = Vector(q)
        fi.rbox((0.2, 0.16, 0.2), q, auto_blue, 0.03)
        fi.cyl(body, 0.05, q + Vector((0, -0.1, 0)), M["white_metal"], axis="y", seg=14)

    for x, y, r in tanks:                                                  # level on each sump and on the water tank
        fi.cyl(0.06, 0.3, (x, y - r + 0.35, 4.15), M["steel"], seg=10)
        head((x, y - r + 0.35, 4.38))
        wired((x, y - r + 0.35, 4.38), TRAY_Z[0])
    head((0.6, 2.75, 4.32))
    wired((0.6, 2.75, 4.32), TRAY_Z[0])
    for k, x in enumerate(pumps):
        vx, y = x - 0.55, -3.2
        fi.cyl(0.03, 0.2, (vx, y - 0.2, 1.9), M["steel"], axis="y", seg=8)                               # pressure on each discharge
        head((vx, y - 0.36, 1.9), body=0.07)
        wired((vx, y - 0.36, 1.9), TRAY_Z[0])
        fi.box((0.08, 0.08, 1.1), (x + 0.9, y - 0.7, 0.55), frame_steel)                                 # a local station by each motor
        fi.box((0.26, 0.14, 0.34), (x + 0.9, y - 0.72, 1.2), cabinet)
        fi.cyl(0.035, 0.03, (x + 0.84, y - 0.8, 1.27), green, axis="y", seg=10)
        fi.cyl(0.035, 0.03, (x + 0.96, y - 0.8, 1.27), red_lamp, axis="y", seg=10)
        wired((x + 0.9, y - 0.72, 1.4), TRAY_Z[0])
        if k < 2:                                                          # a density gauge on each cyclone feed
            fi.box((0.2, 0.3, 0.3), (vx - 0.3, y, 7.3), safety)
            fi.rbox((0.22, 0.22, 0.34), (vx + 0.32, y, 7.3), auto_blue, 0.03)
            fi.box((0.9, 0.05, 0.05), (vx, y - 0.14, 7.3), M["steel"])
            wired((vx + 0.32, y - 0.1, 7.3), TRAY_Z[1])
        else:                                                              # a flow meter and a control valve on the rinse water
            fi.cyl(0.19, 0.4, (vx, y, 2.6), auto_blue, seg=18)
            head((vx, y - 0.24, 2.6), body=0.08)
            wired((vx, y - 0.3, 2.6), TRAY_Z[0])
            fi.ball(0.17, (vx, y, 3.6), slurry, subdiv=2)
            fi.cyl(0.03, 0.4, (vx, y - 0.3, 3.6), M["steel"], axis="y", seg=8)
            fi.cyl(0.24, 0.16, (vx, y - 0.55, 3.6), auto_blue, axis="y", seg=18)
            wired((vx, y - 0.62, 3.6), TRAY_Z[0])
    for x in (-3.2, -7.4):                                                 # pressure at each cyclone's inlet
        head((x + 0.35, -1.85, 12.75), body=0.07)
        wired((x + 0.35, -1.9, 12.75), TRAY_Z[2])
    for x in (-1.7, -7.7, 4.0):                                            # local stations by the screens
        z = L1 if x < 0 else L2
        fi.box((0.08, 0.08, 1.1), (x, -5.2, z + 0.55), frame_steel)
        fi.box((0.26, 0.14, 0.34), (x, -5.22, z + 1.2), cabinet)
        fi.cyl(0.035, 0.03, (x - 0.06, -5.3, z + 1.27), green, axis="y", seg=10)
        fi.cyl(0.035, 0.03, (x + 0.06, -5.3, z + 1.27), red_lamp, axis="y", seg=10)
        wired((x, -5.22, z + 1.4), TRAY_Z[1] if x < 0 else TRAY_Z[2])
    # the raw coal belt: a pull cord along it, a belt scale, sway switches, a speed sensor, one cable back to the trays
    run(fi, [tuple(raw_at(0.02, 0.25, 0.86)), tuple(raw_at(0.97, 0.25, 0.86))], 0.012, T["amber"], seg=5)
    for t in np.arange(0.06, 0.97, 0.15):
        fi.box((0.16, 0.12, 0.22), raw_at(t, 0.2, 0.9), safety)
    for t in (0.05, 0.94):
        fi.box((0.14, 0.14, 0.2), raw_at(t, 0.0, 0.92), auto_blue)
        fi.cyl(0.035, 0.3, raw_at(t, 0.22, 0.86), M["steel"], seg=8)
    q = raw_at(0.4, -0.75)
    fi.box((1.4, 1.5, 0.12), q, auto_blue)                                 # the belt scale's weigh frame
    head(raw_at(0.4, -0.75, 0.95))
    run(fi, [tuple(raw_at(0.985, -0.45, 0.8)), tuple(raw_at(0.02, -0.45, 0.8))], 0.035, auto_cable, seg=6)
    run(fi, [tuple(raw_at(0.985, -0.45, 0.8)), (HX - 0.5, TRAY_Y, raw_at(0.985, -0.45).z), (HX - 0.5, TRAY_Y, TRAY_Z[2])], 0.035, auto_cable, seg=6)
    run(fi, [(PRODUCT[0][0], -0.85, 1.55), (PRODUCT[1][0], -0.85, 1.55)], 0.012, T["amber"], seg=5)       # the product belt's cord
    for x in (-9.0, -5.0, -1.0):
        fi.box((0.16, 0.12, 0.22), (x, -0.9, 1.5), safety)
    for q in ((-HX + 0.5, Y0 + 0.3, 13.8), (CX0 - 0.5, Y0 + 0.3, 13.8), (HX - 0.5, Y0 + 0.3, 8.4)):       # cameras
        fi.box((0.12, 0.3, 0.12), q, M["white_metal"], rot=Matrix.Rotation(-0.4, 4, "X"))
        fi.cyl(0.02, 0.25, (q[0], q[1], q[2] + 0.18), M["steel"], seg=6)
    fi.build(**AUTO)
