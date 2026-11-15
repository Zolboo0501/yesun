"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

// The air as an object: bands of fine white filaments, as in a product film's airflow. Beside each part the air
// draws a figure that fits it: the skyline of the buildings the company has fitted, the elbow of a duct it makes,
// the fan of the equipment it supplies, and the shield of its warranty. The vertex shader bends the bands, so the
// CPU only sets a few uniforms a frame and the flow never stutters. Between parts the bands run as one current
// downhill, side to side, to the next part's free half, and draw themselves into its figure as they arrive.
const STREAMS = 7;
const ALONG = 200;
const ACROSS = 4;
const SAMPLES = 256; // points along each figure's path
const OUTLINE = 192; // of the shield row's points; its check mark takes the rest
const EXTENT = [3.3, 2.4]; // a figure's footprint in its own units, to fit it to its half

type SceneProps = {
  /** the part in view, 0 to last, scrubbed by the scroll */
  part: MotionValue<number>;
  last: number;
  active: boolean;
  reducedMotion: boolean;
};

type Pt = [number, number, number];

/** mulberry32, so the bands are the same on every visit */
function random(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Rounds a polyline's corners (Chaikin), keeping the ends of an open one, so air turns instead of snapping. */
function rounded(points: Pt[], closed: boolean, passes = 3): Pt[] {
  let pts = points;
  for (let k = 0; k < passes; k++) {
    const n = pts.length;
    const next: Pt[] = closed ? [] : [pts[0]];
    for (let i = 0; i < (closed ? n : n - 1); i++) {
      const a = pts[i];
      const b = pts[(i + 1) % n];
      next.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25, a[2] * 0.75 + b[2] * 0.25]);
      next.push([a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75, a[2] * 0.25 + b[2] * 0.75]);
    }
    if (!closed) next.push(pts[n - 1]);
    pts = next;
  }
  return pts;
}

/** Even steps by length along a path (a closed one comes back to its start). */
function evenly(points: Pt[], count: number, closed = false): Pt[] {
  const pts = closed ? [...points, points[0]] : points;
  const at = [0];
  for (let i = 1; i < pts.length; i++)
    at.push(at[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1], pts[i][2] - pts[i - 1][2]));
  const total = at[at.length - 1];
  const out: Pt[] = [];
  let j = 1;
  for (let k = 0; k < count; k++) {
    const d = (k / (count - 1)) * total;
    while (j < pts.length - 1 && at[j] < d) j++;
    const f = (d - at[j - 1]) / Math.max(at[j] - at[j - 1], 1e-9);
    const a = pts[j - 1];
    const b = pts[j];
    out.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f]);
  }
  return out;
}

// The four figures, each about 3 x 2.3 units and centred.
const skyline: Pt[] = [
  [-1.5, -1.05, 0], [-1.5, 0.1, 0], [-0.95, 0.1, 0], [-0.95, 0.75, 0], [-0.4, 0.75, 0], [-0.4, -0.2, 0], [-0.15, -0.2, 0],
  [-0.15, 1.15, 0], [0.45, 1.15, 0], [0.45, 0.35, 0], [0.95, 0.35, 0], [0.95, -0.35, 0], [1.45, -0.35, 0], [1.45, -1.05, 0],
];
const shield: Pt[] = [
  [0, 1.2, 0], [0.95, 1.02, 0], [0.95, 0.15, 0], [0.72, -0.5, 0], [0, -1.15, 0], [-0.72, -0.5, 0], [-0.95, 0.15, 0], [-0.95, 1.02, 0],
];
const check: Pt[] = [[-0.42, 0.02, 0], [-0.1, -0.32, 0], [0.48, 0.4, 0]];

/** A rectangular duct's elbow: in level from the left, a 90° bend, out downward. */
function elbow(): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i <= 20; i++) pts.push([-1.1 + (1.4 * i) / 20, 0.85, 0]);
  for (let i = 1; i <= 24; i++) {
    const a = Math.PI / 2 - (Math.PI / 2) * (i / 24);
    pts.push([0.3 + 0.75 * Math.cos(a), 0.1 + 0.75 * Math.sin(a), 0]);
  }
  for (let i = 1; i <= 16; i++) pts.push([1.05, 0.1 - (0.95 * i) / 16, 0]);
  return pts;
}

/** One arm of a fan's swirl, from the hub outward; the shader turns a copy for each band. */
function fanArm(): Pt[] {
  return Array.from({ length: 61 }, (_, i): Pt => {
    const r = 0.1 + 1.05 * (i / 60);
    return [r * Math.cos(2.4 * r), r * Math.sin(2.4 * r), 0];
  });
}

/** The figures as a float texture: one row of path points per part. */
function buildFigures() {
  const rows = [
    // one rounding pass: roofs and corners stay square enough to read as buildings
    evenly(rounded(skyline, false, 1), SAMPLES),
    evenly(elbow(), SAMPLES),
    evenly(fanArm(), SAMPLES),
    [...evenly(rounded(shield, true, 2), OUTLINE, true), ...evenly(rounded(check, false, 1), SAMPLES - OUTLINE)],
  ];
  console.assert(
    rows.every((row) => row.length === SAMPLES && row.every((p) => p.every(Number.isFinite))),
    "every figure row holds SAMPLES finite points",
  );
  const data = new Float32Array(SAMPLES * rows.length * 4);
  rows.forEach((row, r) => row.forEach((p, i) => data.set([p[0], p[1], p[2], 1], (r * SAMPLES + i) * 4)));
  const texture = new THREE.DataTexture(data, SAMPLES, rows.length, THREE.RGBAFormat, THREE.FloatType);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Which stretch of each figure each band draws: start and end along its path, an offset (across the path, or a fan
 * arm's angle) and a depth.
 */
const BANDS = (() => {
  const bands: THREE.Vector4[] = [];
  const outlineEnd = (OUTLINE - 1) / (SAMPLES - 1);
  const checkStart = OUTLINE / (SAMPLES - 1);
  const checkTurn = checkStart + (1 - checkStart) * 0.34;
  // skyline: the bands share the silhouette, end to end
  for (let i = 0; i < STREAMS; i++)
    bands.push(new THREE.Vector4(Math.max(0, i / STREAMS - 0.012), Math.min(1, (i + 1) / STREAMS + 0.012), 0, (i - 3) * 0.04));
  // duct: the bands run side by side through the elbow, as air fills a duct
  for (let i = 0; i < STREAMS; i++) bands.push(new THREE.Vector4(0, 1, (i - 3) * 0.11, i % 2 ? 0.05 : -0.05));
  // fan: one arm each
  for (let i = 0; i < STREAMS; i++) bands.push(new THREE.Vector4(0, 1, (i / STREAMS) * Math.PI * 2, 0));
  // shield: five share the outline, two draw the check
  for (let i = 0; i < 5; i++)
    bands.push(new THREE.Vector4(Math.max(0, (i / 5) * outlineEnd - 0.01), Math.min(outlineEnd, ((i + 1) / 5) * outlineEnd + 0.01), 0, 0));
  bands.push(new THREE.Vector4(checkStart, checkTurn + 0.01, 0, 0.04), new THREE.Vector4(checkTurn - 0.01, 1, 0, 0.04));
  return bands;
})();

/** Every vertex carries its band's own look and its way across between parts. */
function buildStreams() {
  const rng = random(2011);
  const between = (a: number, b: number) => a + (b - a) * rng();
  const perStream = (ALONG + 1) * (ACROSS + 1);
  const count = STREAMS * perStream;
  const along = new Float32Array(count * 2);
  const look = new Float32Array(count * 4);
  const way = new Float32Array(count * 4);
  let v = 0;
  for (let l = 0; l < STREAMS; l++) {
    // half-width (wide enough for a dozen filaments a few pixels apart), speed, twist frequency, phase
    const own = [between(0.11, 0.21), between(0.8, 1.8), between(0.8, 1.8), (l / STREAMS) * Math.PI * 2 + between(-0.2, 0.2)];
    // departure delay (spread over a third of the crossing, so the bands follow one another), spread, index
    const path = [between(0, 0.3), between(-1, 1), between(-1, 1), l];
    for (let a = 0; a <= ALONG; a++)
      for (let c = 0; c <= ACROSS; c++) {
        along[v * 2] = a / ALONG;
        along[v * 2 + 1] = (c / ACROSS) * 2 - 1;
        look.set(own, v * 4);
        way.set(path, v * 4);
        v++;
      }
  }
  const geometry = new THREE.BufferGeometry();
  // placed by the vertex shader; the attribute only sets the vertex count
  geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  geometry.setAttribute("aAlong", new THREE.BufferAttribute(along, 2));
  geometry.setAttribute("aLook", new THREE.BufferAttribute(look, 4));
  geometry.setAttribute("aWay", new THREE.BufferAttribute(way, 4));
  const index: number[] = [];
  for (let l = 0; l < STREAMS; l++)
    for (let a = 0; a < ALONG; a++)
      for (let c = 0; c < ACROSS; c++) {
        const i = l * perStream + a * (ACROSS + 1) + c;
        const j = i + ACROSS + 1;
        index.push(i, j, i + 1, i + 1, j, j + 1);
      }
  geometry.setIndex(index);
  return geometry;
}

const streamVertex = /* glsl */ `
#define AIR_TAU 6.283185307
#define AIR_PI 3.141592653
attribute vec2 aAlong;
attribute vec4 aLook; // half-width, speed, twist frequency, phase
attribute vec4 aWay; // departure delay, spread across the current, spread in depth, band index
uniform sampler2D uFigures;
uniform vec4 uBands[${STREAMS * 4}];
uniform float uTime;
uniform float uTravel;
uniform float uFormFrom; // the figure of the part the bands leave
uniform float uFormTo; // and of the part they gather beside
uniform float uScale;
uniform float uArc;
uniform vec3 uFromAt;
uniform vec3 uToAt;
uniform mat3 uDrift;

// A point on a figure's path, between the texture's even steps.
vec3 airFigureAt(float row, float t) {
  float x = clamp(t, 0.0, 1.0) * ${SAMPLES - 1}.0;
  float i0 = floor(x);
  float i1 = min(i0 + 1.0, ${SAMPLES - 1}.0);
  vec3 p0 = texture2D(uFigures, vec2((i0 + 0.5) / ${SAMPLES}.0, row)).xyz;
  vec3 p1 = texture2D(uFigures, vec2((i1 + 0.5) / ${SAMPLES}.0, row)).xyz;
  return mix(p0, p1, x - i0);
}

// One point of this band in one of the four figures (s runs 0..1 along it), how far it twists, and how wide it is.
vec3 airForm(int form, float s, out float twist, out float widthK) {
  vec4 band = uBands[form * ${STREAMS} + int(aWay.w + 0.5)];
  float t = mix(band.x, band.y, s);
  float row = (float(form) + 0.5) / 4.0;
  vec3 p = airFigureAt(row, t);
  float time = uTime;
  if (form == 2) {
    // the fan: each band is one arm, and the whole fan turns
    float a = band.z - 0.5 * time;
    twist = 0.25;
    widthK = 0.9;
    return vec3(p.x * cos(a) - p.y * sin(a), p.x * sin(a) + p.y * cos(a), 0.05 * sin(3.0 * t + time));
  }
  vec2 dir = normalize((airFigureAt(row, t + 0.004) - airFigureAt(row, t - 0.004)).xy + vec2(0.00001, 0.0));
  vec3 normal = vec3(-dir.y, dir.x, 0.0);
  // the air breathes as it runs: a small ripple across the figure, moving with the flow
  float ripple = 0.035 * sin(AIR_TAU * 3.0 * t - aLook.y * time + aLook.w);
  // outlines are drawn with thinner bands than the fan, so the figure stays crisp
  twist = form == 1 ? 0.2 : 0.1;
  widthK = form == 1 ? 0.5 : 0.42;
  return p + normal * (band.z + ripple) + vec3(0.0, 0.0, band.w + 0.05 * cos(AIR_TAU * 2.0 * t - 0.7 * time + aLook.w));
}

// The current's path from the part the air leaves to the part below it on the other side: it sets off level,
// sweeps down across the screen and arrives level, like air turning out of one opening into another.
vec3 airPathAt(float t, out vec3 tangent) {
  vec3 a = uFromAt;
  vec3 b = uToAt;
  vec3 c1 = a + vec3((b.x - a.x) * 0.55, 0.0, 0.0);
  vec3 c2 = b - vec3((b.x - a.x) * 0.55, 0.0, 0.0);
  float u = 1.0 - t;
  tangent = normalize(3.0 * u * u * (c1 - a) + 6.0 * u * t * (c2 - c1) + 3.0 * t * t * (b - c2) + vec3(0.00001, 0.0, 0.0));
  return u * u * u * a + 3.0 * u * u * t * c1 + 3.0 * u * t * t * c2 + t * t * t * b;
}

// One point of this band on its way from one figure to the next.
vec3 airCentre(float s, float go, float lift, out vec3 face, out float twist, out float widthK) {
  float twistA;
  float twistB;
  float widthA;
  float widthB;
  vec3 p = mix(
    airForm(int(uFormFrom + 0.5), s, twistA, widthA),
    airForm(int(uFormTo + 0.5), s, twistB, widthB),
    go
  );
  // under way the band draws out into a gust and turns to lie along its path
  p.x *= 1.0 + 0.8 * lift;
  p.yz *= 1.0 - 0.35 * lift;
  vec3 tangent;
  vec3 along = airPathAt(go, tangent);
  float turn = atan(tangent.y, tangent.x);
  turn = (turn - AIR_PI * floor((turn + AIR_PI * 0.5) / AIR_PI)) * lift; // the smaller way round
  mat3 spin = mat3(cos(turn), sin(turn), 0.0, -sin(turn), cos(turn), 0.0, 0.0, 0.0, 1.0);
  face = spin * (uDrift * vec3(0.0, 0.0, 1.0));
  twist = mix(twistA, twistB, go);
  widthK = mix(widthA, widthB, go);
  // the bands spread across the current mid-way and close up again as they arrive
  vec3 across = vec3(-tangent.y, tangent.x, 0.0) * aWay.y * 0.5 * uArc + vec3(0.0, 0.0, aWay.z * 0.6);
  return along + across * lift + spin * (uDrift * p) * uScale;
}

void airStream(out vec3 airPos, out vec3 airNor) {
  float go = smoothstep(0.0, 1.0, clamp((uTravel - 0.1 - aWay.x) / 0.55, 0.0, 1.0));
  float lift = sin(AIR_PI * go);
  float s = aAlong.x;
  float ds = 1.0 / ${ALONG}.0;
  vec3 face;
  float twist;
  float widthK;
  vec3 faceN;
  float twistN;
  float widthN;
  vec3 c0 = airCentre(s, go, lift, face, twist, widthK);
  vec3 t = normalize(
    airCentre(min(s + ds, 1.0), go, lift, faceN, twistN, widthN)
      - airCentre(max(s - ds, 0.0), go, lift, faceN, twistN, widthN)
  );
  vec3 b = cross(face, t);
  b = length(b) > 0.0001 ? normalize(b) : normalize(cross(vec3(0.0, 1.0, 0.0), t));
  vec3 n = cross(t, b);
  float angle = twist * sin(AIR_TAU * aLook.z * s - aLook.y * uTime + aLook.w);
  vec3 w = cos(angle) * b + sin(angle) * n;
  vec3 up = cross(t, w);
  float width = aLook.x * widthK * uScale * (0.08 + 0.92 * pow(sin(AIR_PI * s), 0.6));
  float across = aAlong.y;
  airPos = c0 + w * (across * width) + up * ((1.0 - across * across) * width * 0.22);
  airNor = normalize(up + w * (0.44 * across));
}

varying float vAcross;
varying float vAlong;
varying float vSeed;
varying float vSpeed;
varying vec3 vNormal;
varying vec3 vView;

void main() {
  vec3 airPos;
  vec3 airNor;
  airStream(airPos, airNor);
  vec4 mv = modelViewMatrix * vec4(airPos, 1.0);
  vView = -mv.xyz;
  vNormal = normalize(normalMatrix * airNor);
  vAcross = aAlong.y;
  vAlong = aAlong.x;
  vSeed = aLook.w;
  vSpeed = aLook.y;
  gl_Position = projectionMatrix * mv;
}
`;

// Air as in a product film: each band is a sheaf of fine white filaments, each filament its own brightness and
// softness (some crisp, some out of focus), drifting a little against its neighbours, with light running along it
// with the flow. Where a band turns edge-on its filaments close up and it brightens. Colours are sRGB.
const airFragment = /* glsl */ `
#define AIR_FILAMENTS 14.0
uniform float uTime;
varying float vAcross;
varying float vAlong;
varying float vSeed;
varying float vSpeed;
varying vec3 vNormal;
varying vec3 vView;

float airHash(float n) {
  return fract(sin(n * 127.1 + 311.7) * 43758.5453);
}

void main() {
  float x = vAcross * 0.5 + 0.5;
  // filaments slide a little against each other along the band
  float f = x * AIR_FILAMENTS + 0.6 * sin(vAlong * 5.0 + vSeed * 3.0 - uTime * 0.3);
  float id = floor(f);
  float d = fract(f) - 0.5 - (airHash(id + vSeed * 13.0) - 0.5) * 0.4;
  float soft = mix(0.09, 0.26, airHash(vSeed * 7.3 + id * 0.37));
  float line = exp(-d * d / (soft * soft));
  float bright = 0.45 + 0.55 * airHash(id * 1.7 + vSeed * 5.1);
  // light runs along each filament with the flow
  float run = 0.55 + 0.45 * sin(vAlong * 14.0 - uTime * (1.2 + vSpeed) + id * 2.3 + vSeed);
  float sides = smoothstep(0.0, 0.18, x) * smoothstep(1.0, 0.82, x);
  float ends = pow(sin(3.14159265 * clamp(vAlong, 0.0, 1.0)), 0.7);
  float edgeOn = 1.0 - abs(dot(normalize(vNormal), normalize(vView)));
  float alpha = (line * bright * run + 0.08) * sides * ends * (1.0 + 0.6 * edgeOn);
  gl_FragColor = vec4(vec3(1.0), min(alpha, 0.95));
}
`;

type StreamUniforms = {
  uTime: { value: number };
  uTravel: { value: number };
  uFormFrom: { value: number };
  uFormTo: { value: number };
  uScale: { value: number };
  uArc: { value: number };
  uFromAt: { value: THREE.Vector3 };
  uToAt: { value: THREE.Vector3 };
  uDrift: { value: THREE.Matrix3 };
  uBands: { value: THREE.Vector4[] };
};

export default function AirFlowScene({ part, last, active, reducedMotion }: SceneProps) {
  return (
    <Canvas
      frameloop={!active ? "never" : reducedMotion ? "demand" : "always"}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [0, 0, 6.2], fov: 30, near: 0.1, far: 40 }}
      style={{ pointerEvents: "none" }}
    >
      <Streams part={part} last={last} reducedMotion={reducedMotion} />
    </Canvas>
  );
}

function Streams({ part, last, reducedMotion }: { part: MotionValue<number>; last: number; reducedMotion: boolean }) {
  const size = useThree((s) => s.size);
  const viewport = useThree((s) => s.viewport);
  const invalidate = useThree((s) => s.invalidate);

  const uniforms = useRef<StreamUniforms>({
    uTime: { value: 0 },
    uTravel: { value: 0 },
    uFormFrom: { value: 0 },
    uFormTo: { value: 1 },
    uScale: { value: 1 },
    uArc: { value: 1 },
    uFromAt: { value: new THREE.Vector3() },
    uToAt: { value: new THREE.Vector3() },
    uDrift: { value: new THREE.Matrix3() },
    uBands: { value: BANDS },
  });
  const geometry = useMemo(() => buildStreams(), []);
  const figures = useMemo(() => buildFigures(), []);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: streamVertex,
        fragmentShader: airFragment,
        transparent: true,
        depthWrite: false, // overlapping air thickens instead of hiding what is behind it
        side: THREE.DoubleSide,
      }),
    [],
  );
  // before the first frame compiles the shader, so the program finds every uniform
  useLayoutEffect(() => {
    Object.assign(material.uniforms, uniforms.current, { uFigures: { value: figures } });
  }, [material, figures]);
  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
      figures.dispose();
    },
    [geometry, material, figures],
  );

  // The pointer leans the figure a little, as it tilts the orbit.
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  // With reduced motion the flow is one still frame, redrawn only when the part changes.
  useEffect(() => {
    if (!reducedMotion) return;
    invalidate();
    return part.on("change", () => invalidate());
  }, [part, reducedMotion, invalidate]);

  const motionState = useRef({ time: 0, part: part.get(), yaw: 0, pitch: 0 });
  const euler = useMemo(() => new THREE.Euler(), []);
  const rotation = useMemo(() => new THREE.Matrix4(), []);

  useFrame((_, delta) => {
    const m = motionState.current;
    const u = uniforms.current;
    // capped, so a frame after a hidden tab never jumps the flow
    const dt = Math.min(delta, 1 / 30);
    if (!reducedMotion) m.time += dt;
    // the scroll is eased, so a wheel notch glides instead of stepping; reduced motion switches at the midpoint
    m.part = reducedMotion ? Math.round(part.get()) : THREE.MathUtils.damp(m.part, part.get(), 4, dt);
    const step = Math.min(Math.floor(m.part), last - 1);
    const travel = THREE.MathUtils.clamp(m.part - step, 0, 1);

    // Desktop: the figure stands in the half the copy leaves free. Phones: above the copy, swaying a little.
    // Each part is one stage tall, so a part's air rides up with it as it scrolls: the part being left sits above
    // the stage centre and the next one below it, and the current between them runs downhill, side to side.
    const vw = viewport.width;
    const vh = viewport.height;
    const side = step % 2 === 0 ? -1 : 1;
    const ride = (m.part - step) * vh;
    if (size.width >= 1024) {
      u.uFromAt.value.set((side * vw) / 4, ride, 0);
      u.uScale.value = Math.min(vw / 2 / EXTENT[0], vh / EXTENT[1]) * 0.85;
      u.uArc.value = vh * 0.2;
    } else {
      u.uFromAt.value.set(side * vw * 0.12, vh * 0.28 + ride, 0);
      u.uScale.value = Math.min(vw / EXTENT[0], (vh * 0.4) / EXTENT[1]) * 0.95;
      u.uArc.value = vh * 0.1;
    }
    u.uToAt.value.set(-u.uFromAt.value.x, u.uFromAt.value.y - vh, 0);
    // each part has its own figure: skyline, duct elbow, fan, shield
    u.uFormFrom.value = step;
    u.uFormTo.value = step + 1;
    u.uTravel.value = travel;
    u.uTime.value = reducedMotion ? 2.4 : m.time;

    // the figures stand upright and only turn a little, so they stay readable
    const yaw = 0.22 * Math.sin(m.time * 0.21) + pointer.current.x * 0.25;
    const pitch = 0.12 * Math.sin(m.time * 0.17) + pointer.current.y * 0.12;
    m.yaw = reducedMotion ? yaw : THREE.MathUtils.damp(m.yaw, yaw, 3, dt);
    m.pitch = reducedMotion ? pitch : THREE.MathUtils.damp(m.pitch, pitch, 3, dt);
    u.uDrift.value.setFromMatrix4(rotation.makeRotationFromEuler(euler.set(m.pitch, m.yaw, 0)));
  });

  return <mesh geometry={geometry} material={material} frustumCulled={false} />;
}
