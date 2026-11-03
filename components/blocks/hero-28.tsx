"use client";

import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import * as THREE from "three";

type Kind = "ficus" | "olive" | "palm" | "fern";

const PLANTS: {
  kind: Kind;
  name: string;
  common: string;
  species: string;
  height: string;
  light: string;
  price: string;
}[] = [
  {
    kind: "ficus",
    name: "Fig",
    common: "Fiddle-leaf fig",
    species: "Ficus lyrata",
    height: "120 cm",
    light: "Bright, indirect light",
    price: "$128",
  },
  {
    kind: "olive",
    name: "Olive",
    common: "Olive tree",
    species: "Olea europaea",
    height: "140 cm",
    light: "Full sun, south facing",
    price: "$164",
  },
  {
    kind: "palm",
    name: "Palm",
    common: "Kentia palm",
    species: "Howea forsteriana",
    height: "160 cm",
    light: "Happy in low light",
    price: "$146",
  },
  {
    kind: "fern",
    name: "Fern",
    common: "Boston fern",
    species: "Nephrolepis exaltata",
    height: "60 cm",
    light: "Soft light, humid rooms",
    price: "$58",
  },
];

const GAIN: [number, number, number] = [0.25, 0.23, 0.17];
const LAMP: [number, number, number] = [1, 0.78, 0.52];
const SCALES: Record<Kind, number> = { ficus: 1.08, olive: 1.14, palm: 1.2, fern: 1 };
const MAX_LEAVES = 480;
const MAX_STEMS = 220;
const TAU = Math.PI * 2;

interface Garden {
  show: (kind: Kind) => void;
  destroy: () => void;
}

interface Leaf {
  at: number;
  side: number;
  length: number;
  width: number;
  tilt: number;
  droop: number;
  flutter: number;
  rate: number;
}

interface Branch {
  base: [number, number];
  angle: number;
  length: number;
  segments: number;
  curl: number;
  droop: number;
  depth: number;
  phase: number;
  thickness: number;
  leaves: Leaf[];
  bend: number;
  velocity: number;
  kick: number;
  kickAt: number;
}

interface Layer {
  kind: Kind;
  branches: Branch[];
  anchor: [number, number];
  progress: number;
  target: number;
}

interface Template {
  offset: number;
  length: number;
  segments: number;
  curl: number;
  droop: number;
  depth: number;
  spread: number;
}

const TEMPLATES: Record<Kind, Template[]> = {
  ficus: [
    { offset: 0, length: 0.95, segments: 6, curl: 0.16, droop: 0.05, depth: 0.12, spread: 0 },
    { offset: -0.44, length: 0.74, segments: 5, curl: -0.1, droop: 0.06, depth: 0.55, spread: -0.12 },
    { offset: 0.42, length: 0.66, segments: 5, curl: 0.2, droop: 0.04, depth: 0.95, spread: 0.1 },
    { offset: 0.88, length: 0.52, segments: 4, curl: -0.14, droop: 0.07, depth: 0.35, spread: 0.2 },
  ],
  olive: [
    { offset: 0.02, length: 1.15, segments: 10, curl: 0.1, droop: 0.035, depth: 0.18, spread: 0 },
    { offset: -0.36, length: 0.92, segments: 8, curl: -0.07, droop: 0.04, depth: 0.6, spread: -0.1 },
    { offset: 0.4, length: 0.86, segments: 8, curl: 0.14, droop: 0.03, depth: 1, spread: 0.12 },
  ],
  palm: [
    { offset: 0.04, length: 1.28, segments: 14, curl: 0.02, droop: 0.05, depth: 0.14, spread: 0 },
    { offset: -0.5, length: 1.05, segments: 12, curl: -0.02, droop: 0.06, depth: 0.6, spread: -0.08 },
    { offset: 0.56, length: 1, segments: 12, curl: 0.03, droop: 0.065, depth: 0.95, spread: 0.1 },
  ],
  fern: [
    { offset: 0, length: 1.1, segments: 18, curl: 0.22, droop: 0.06, depth: 0.15, spread: 0 },
    { offset: -0.42, length: 0.88, segments: 15, curl: 0.12, droop: 0.07, depth: 0.55, spread: -0.1 },
    { offset: 0.45, length: 0.82, segments: 14, curl: 0.3, droop: 0.06, depth: 0.95, spread: 0.12 },
    { offset: 0.9, length: 0.62, segments: 11, curl: 0.18, droop: 0.08, depth: 0.4, spread: 0.2 },
  ],
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const wrapAngle = (angle: number) => {
  let x = (angle + Math.PI) % TAU;
  if (x < 0) x += TAU;
  return x - Math.PI;
};

const toLinear = (value: number) =>
  value <= 0.04045 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);

const random = (seed: number) => {
  let state = (Math.floor(Math.abs(seed)) % 2147483646) + 1;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
};

const turbulence = (t: number, phase: number) =>
  0.55 * Math.sin(0.71 * t + phase) +
  0.3 * Math.sin(1.37 * t + phase * 2.1) +
  0.15 * Math.sin(2.93 * t + phase * 0.7);

const buildPlant = (kind: Kind, aspect: number, scale: number) => {
  const rng = random(7919 + kind.length * 131 + 153);
  const angle = -2.42;
  const baseX = aspect / 2 + 0.05;
  const baseY = 0.56;
  const branches = TEMPLATES[kind].map((template, index) => {
    const along = angle + Math.PI / 2;
    const offset = template.spread * scale;
    const branch: Branch = {
      base: [baseX + Math.cos(along) * offset * 0.6, baseY + Math.sin(along) * offset * 0.24],
      angle: angle + template.offset,
      length: template.length * scale * (0.92 + rng() * 0.16),
      segments: template.segments,
      curl: template.curl,
      droop: template.droop,
      depth: template.depth,
      phase: rng() * TAU + index,
      thickness: kind === "palm" ? 0.0036 : kind === "fern" ? 0.0028 : 0.0042,
      leaves: [],
      bend: 0,
      velocity: 0,
      kick: 0,
      kickAt: 0,
    };
    for (let k = 1; k <= template.segments; k++) {
      const progress = k / template.segments;
      const sides = k === template.segments ? [0] : [-1, 1];
      for (const side of sides) {
        const flutter = rng() * TAU;
        if (kind === "ficus") {
          if (side !== 0 && (k + (side > 0 ? 1 : 0)) % 2 === 0 && rng() < 0.35) continue;
          branch.leaves.push({
            at: k,
            side,
            length: (0.13 + rng() * 0.08) * scale * (side === 0 ? 1.12 : 1),
            width: 0.4 + rng() * 0.14,
            tilt: side === 0 ? 0 : 0.62 + rng() * 0.45,
            droop: 0.22,
            flutter,
            rate: 1.1 + rng() * 1.1,
          });
        } else if (kind === "olive") {
          branch.leaves.push({
            at: k,
            side,
            length: (0.095 + rng() * 0.05) * scale,
            width: 0.15 + rng() * 0.06,
            tilt: side === 0 ? 0 : 0.42 + rng() * 0.32,
            droop: 0.12,
            flutter,
            rate: 1.6 + rng() * 1.4,
          });
        } else if (kind === "fern") {
          const taper =
            Math.pow(Math.sin(Math.PI * clamp(progress * 0.9 + 0.08, 0, 1)), 0.85) *
            (1 - 0.35 * progress);
          branch.leaves.push({
            at: k,
            side,
            length: (0.03 + 0.11 * taper) * scale * (0.92 + rng() * 0.16),
            width: 0.3 + rng() * 0.08,
            tilt: side === 0 ? 0 : 1.05 + rng() * 0.12,
            droop: 0.18,
            flutter,
            rate: 1.6 + rng() * 1.4,
          });
        } else {
          const taper = Math.pow(Math.sin(Math.PI * clamp(progress * 0.94 + 0.04, 0, 1)), 0.7);
          branch.leaves.push({
            at: k,
            side,
            length: (0.06 + 0.2 * taper) * scale * (0.92 + rng() * 0.16),
            width: 0.11 + rng() * 0.04,
            tilt: side === 0 ? 0 : 0.92 + rng() * 0.18,
            droop: 0.38,
            flutter,
            rate: 1.8 + rng() * 1.6,
          });
        }
      }
    }
    return branch;
  });
  return { branches, anchor: [baseX, baseY] as [number, number] };
};

const passVertex = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const leafVertex = `
attribute vec4 iLeaf;
attribute vec4 iShape;
uniform vec2 uHalf;
varying vec2 vLocal;
varying vec4 vShape;
varying float vLength;
void main() {
  float r = iLeaf.w * 0.5;
  vec2 extent = vec2(r, r * iShape.x) + iShape.y * 2.4 + 0.003;
  vec2 local = position.xy * extent;
  float c = cos(iLeaf.z);
  float s = sin(iLeaf.z);
  vec2 world = iLeaf.xy + vec2(c * local.x - s * local.y, s * local.x + c * local.y);
  gl_Position = vec4(world / uHalf, 0.0, 1.0);
  vLocal = local;
  vShape = iShape;
  vLength = iLeaf.w;
}
`;

const leafFragment = `
varying vec2 vLocal;
varying vec4 vShape;
varying float vLength;
float leaf(vec2 p, float len, float ratio) {
  float r = len * 0.5;
  float w = max(r * ratio, 1e-4);
  float R = (r * r + w * w) / (2.0 * w);
  vec2 q = abs(p);
  return max(length(vec2(q.x, q.y + R - w)) - R, q.x - r);
}
void main() {
  float d = leaf(vLocal, vLength, vShape.x);
  gl_FragColor = vec4((1.0 - smoothstep(-vShape.y, vShape.y, d)) * vShape.z);
}
`;

const stemVertex = `
attribute vec4 iStem;
attribute vec4 iStemShape;
uniform vec2 uHalf;
varying vec2 vWorld;
varying vec4 vSegment;
varying vec4 vShape;
void main() {
  vec2 axis = iStem.zw - iStem.xy;
  float len = max(length(axis), 1e-5);
  vec2 dir = axis / len;
  vec2 perp = vec2(-dir.y, dir.x);
  float pad = iStemShape.x + iStemShape.y * 2.4 + 0.003;
  vec2 world = (iStem.xy + iStem.zw) * 0.5 + dir * position.x * (len * 0.5 + pad) + perp * position.y * pad;
  gl_Position = vec4(world / uHalf, 0.0, 1.0);
  vWorld = world;
  vSegment = iStem;
  vShape = iStemShape;
}
`;

const stemFragment = `
varying vec2 vWorld;
varying vec4 vSegment;
varying vec4 vShape;
void main() {
  vec2 pa = vWorld - vSegment.xy;
  vec2 ba = vSegment.zw - vSegment.xy;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-8), 0.0, 1.0);
  float d = length(pa - ba * h) - vShape.x;
  gl_FragColor = vec4((1.0 - smoothstep(-vShape.y, vShape.y, d)) * vShape.z);
}
`;

const hashChunk = `
float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
`;

const windowChunk = `
uniform vec4 uWindow;
uniform float uAngle;
float sunlight(vec2 p) {
  vec2 d = p - uWindow.xy;
  float c = cos(uAngle);
  float s = sin(uAngle);
  vec2 r = vec2(c * d.x + s * d.y, -s * d.x + c * d.y);
  float size = uWindow.z;
  float soft = uWindow.w;
  float halfLen = size * 1.3;
  float y = r.y / (1.0 + 0.3 * clamp(r.x / halfLen, -1.0, 1.0));
  float halfW = size * 0.5;
  float across = smoothstep(-halfW - soft, -halfW + soft, y) * (1.0 - smoothstep(halfW - soft, halfW + soft, y));
  float along = smoothstep(-halfLen - soft * 2.0, -halfLen + soft * 2.0, r.x) * (1.0 - smoothstep(halfLen - soft * 2.0, halfLen + soft * 2.0, r.x));
  float bar = size * 0.016;
  float mullion = 1.0 - (1.0 - smoothstep(bar, bar + soft * 0.8, abs(y))) * 0.94;
  float transom = 1.0 - (1.0 - smoothstep(bar, bar + soft * 0.8, abs(r.x + halfLen * 0.28))) * 0.9;
  float falloff = mix(0.5, 1.0, 1.0 - smoothstep(-halfLen, halfLen, r.x)) * mix(0.8, 1.0, 1.0 - smoothstep(0.0, halfW, abs(y)));
  return across * along * mullion * transom * falloff;
}
`;

const emissionFragment = `
uniform sampler2D uMask;
uniform vec3 uLamp;
uniform vec2 uHalf;
uniform float uSun;
varying vec2 vUv;
${windowChunk}
void main() {
  vec2 p = (vUv * 2.0 - 1.0) * uHalf;
  float shade = texture2D(uMask, vUv).r;
  gl_FragColor = vec4(uLamp * (1.0 - shade) * sunlight(p) * uSun, 1.0);
}
`;

const sunFragment = `
uniform sampler2D uMask;
uniform vec3 uGain;
uniform vec2 uHalf;
uniform float uSun;
uniform float uGrain;
uniform float uTime;
varying vec2 vUv;
${windowChunk}
${hashChunk}
void main() {
  vec2 p = (vUv * 2.0 - 1.0) * uHalf;
  float shade = texture2D(uMask, vUv).r;
  float lit = sunlight(p) * (1.0 - shade) * uSun;
  float n = hash(gl_FragCoord.xy + fract(uTime * 17.0) * 911.0) - 0.5;
  lit = max(lit + n * uGrain * 0.1 * smoothstep(0.0, 0.1, lit), 0.0);
  vec3 gain = 1.0 + uGain * lit;
  gl_FragColor = vec4(1.0 - 1.0 / gain, 1.0);
}
`;

const downFragment = `
uniform sampler2D uSource;
uniform vec2 uTexel;
varying vec2 vUv;
vec3 tap(vec2 d) { return texture2D(uSource, vUv + d * uTexel).rgb; }
void main() {
  vec3 color = tap(vec2(0.0)) * 0.125
    + (tap(vec2(-2.0, 2.0)) + tap(vec2(2.0, 2.0)) + tap(vec2(-2.0, -2.0)) + tap(vec2(2.0, -2.0))) * 0.03125
    + (tap(vec2(0.0, 2.0)) + tap(vec2(-2.0, 0.0)) + tap(vec2(2.0, 0.0)) + tap(vec2(0.0, -2.0))) * 0.0625
    + (tap(vec2(-1.0, 1.0)) + tap(vec2(1.0, 1.0)) + tap(vec2(-1.0, -1.0)) + tap(vec2(1.0, -1.0))) * 0.125;
  gl_FragColor = vec4(color, 1.0);
}
`;

const upFragment = `
uniform sampler2D uSource;
uniform vec2 uTexel;
varying vec2 vUv;
vec3 tap(vec2 d) { return texture2D(uSource, vUv + d * uTexel).rgb; }
void main() {
  vec3 color = tap(vec2(0.0)) * 4.0
    + (tap(vec2(-1.0, 0.0)) + tap(vec2(1.0, 0.0)) + tap(vec2(0.0, -1.0)) + tap(vec2(0.0, 1.0))) * 2.0
    + tap(vec2(-1.0, -1.0)) + tap(vec2(1.0, -1.0)) + tap(vec2(-1.0, 1.0)) + tap(vec2(1.0, 1.0));
  gl_FragColor = vec4(color / 16.0, 1.0);
}
`;

const glowFragment = `
uniform sampler2D uEmission;
uniform sampler2D uBloom;
uniform vec2 uResolution;
uniform float uGrain;
uniform float uTime;
varying vec2 vUv;
${hashChunk}
vec3 neutral(vec3 color) {
  float x = min(color.r, min(color.g, color.b));
  color -= x < 0.08 ? x - 6.25 * x * x : 0.04;
  float peak = max(color.r, max(color.g, color.b));
  if (peak < 0.76) return color;
  float next = 1.0 - 0.0576 / (peak - 0.52);
  color *= next / peak;
  return mix(color, vec3(next), 1.0 - 1.0 / (0.15 * (peak - next) + 1.0));
}
void main() {
  vec2 shift = (vUv - 0.5) * 1.4 / uResolution.y;
  vec3 emission = vec3(
    texture2D(uEmission, vUv + shift).r,
    texture2D(uEmission, vUv).g,
    texture2D(uEmission, vUv - shift).b
  ) + texture2D(uBloom, vUv).rgb * 0.36;
  vec3 light = pow(neutral(max(emission, 0.0)), vec3(1.0 / 2.2));
  float mask = smoothstep(0.0, 0.04, max(light.r, max(light.g, light.b)));
  light += (hash(gl_FragCoord.xy + fract(uTime * 17.0) * 911.0) - 0.5) * uGrain * 0.1 * mask;
  gl_FragColor = vec4(clamp(light, 0.0, 1.0), 1.0);
}
`;

function createGarden(root: HTMLElement, stage: HTMLElement, wall: HTMLElement, initial: Kind): Garden | null {
  const doc = root.ownerDocument;
  const view = doc.defaultView ?? window;
  const canvas = doc.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: false, antialias: false, powerPreference: "high-performance" });
  } catch {
    return null;
  }
  stage.appendChild(canvas);
  renderer.autoClear = false;

  const motionQuery = view.matchMedia("(prefers-reduced-motion: reduce)");
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
  const plane = new THREE.PlaneGeometry(2, 2);
  const quad = new THREE.Mesh(plane);
  quad.frustumCulled = false;
  const quadScene = new THREE.Scene();
  quadScene.add(quad);
  const half = new THREE.Vector2(1, 0.5);

  const instanced = (name: string, shape: string, count: number) => {
    const geometry = new THREE.InstancedBufferGeometry();
    geometry.index = plane.index;
    geometry.setAttribute("position", plane.getAttribute("position"));
    const data = new THREE.InstancedBufferAttribute(new Float32Array(count * 4), 4);
    const form = new THREE.InstancedBufferAttribute(new Float32Array(count * 4), 4);
    data.setUsage(THREE.DynamicDrawUsage);
    form.setUsage(THREE.DynamicDrawUsage);
    geometry.setAttribute(name, data);
    geometry.setAttribute(shape, form);
    geometry.instanceCount = 0;
    return { geometry, data, form };
  };
  const leaves = instanced("iLeaf", "iShape", MAX_LEAVES);
  const stems = instanced("iStem", "iStemShape", MAX_STEMS);
  const maxBlend = {
    transparent: true,
    blending: THREE.CustomBlending,
    blendEquation: THREE.AddEquation,
    blendSrc: THREE.OneFactor,
    blendDst: THREE.OneMinusSrcColorFactor,
    depthTest: false,
    depthWrite: false,
  };
  const leafMaterial = new THREE.ShaderMaterial({
    uniforms: { uHalf: { value: half } },
    vertexShader: leafVertex,
    fragmentShader: leafFragment,
    ...maxBlend,
  });
  const stemMaterial = new THREE.ShaderMaterial({
    uniforms: { uHalf: { value: half } },
    vertexShader: stemVertex,
    fragmentShader: stemFragment,
    ...maxBlend,
  });
  const leafMesh = new THREE.Mesh(leaves.geometry, leafMaterial);
  const stemMesh = new THREE.Mesh(stems.geometry, stemMaterial);
  leafMesh.frustumCulled = false;
  stemMesh.frustumCulled = false;
  const maskScene = new THREE.Scene();
  maskScene.add(stemMesh, leafMesh);

  const target = (hdr: boolean) =>
    new THREE.WebGLRenderTarget(1, 1, {
      type: hdr ? THREE.HalfFloatType : THREE.UnsignedByteType,
      depthBuffer: false,
      stencilBuffer: false,
      generateMipmaps: false,
    });
  const maskTarget = target(false);
  const emissionTarget = target(true);
  const bloomTargets = Array.from({ length: 5 }, () => target(true));

  const windowUniforms = {
    uWindow: { value: new THREE.Vector4(0, 0, 0.5, 0.05) },
    uAngle: { value: 0.49 },
  };
  const sunMaterial = new THREE.ShaderMaterial({
    uniforms: {
      ...windowUniforms,
      uMask: { value: maskTarget.texture },
      uGain: { value: new THREE.Vector3(...GAIN) },
      uHalf: { value: half },
      uSun: { value: 0 },
      uGrain: { value: 0.22 },
      uTime: { value: 0 },
    },
    vertexShader: passVertex,
    fragmentShader: sunFragment,
    depthTest: false,
    depthWrite: false,
  });
  const emissionMaterial = new THREE.ShaderMaterial({
    uniforms: {
      ...windowUniforms,
      uMask: { value: maskTarget.texture },
      uLamp: { value: new THREE.Vector3(...LAMP.map(toLinear)) },
      uHalf: { value: half },
      uSun: { value: 0 },
    },
    vertexShader: passVertex,
    fragmentShader: emissionFragment,
    depthTest: false,
    depthWrite: false,
  });
  const downMaterial = new THREE.ShaderMaterial({
    uniforms: { uSource: { value: null }, uTexel: { value: new THREE.Vector2() } },
    vertexShader: passVertex,
    fragmentShader: downFragment,
    depthTest: false,
    depthWrite: false,
  });
  const upMaterial = new THREE.ShaderMaterial({
    uniforms: { uSource: { value: null }, uTexel: { value: new THREE.Vector2() } },
    vertexShader: passVertex,
    fragmentShader: upFragment,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });
  const glowMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uEmission: { value: emissionTarget.texture },
      uBloom: { value: bloomTargets[0].texture },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uGrain: { value: 0.22 },
      uTime: { value: 0 },
    },
    vertexShader: passVertex,
    fragmentShader: glowFragment,
    depthTest: false,
    depthWrite: false,
  });

  const probe = doc.createElement("canvas").getContext("2d", { willReadFrequently: true });
  const layers: Layer[] = [];
  const breeze = { x: 0, y: 0 };
  let pointer: { x: number; y: number; t: number } | null = null;
  let reduced = motionQuery.matches;
  let lightMode = true;
  let colorKey = "";
  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let time = 0;
  let windClock = 0;
  let windBoost = 0;
  let sun = 0;
  let raf = 0;
  let last = 0;
  let visible = false;
  let destroyed = false;
  let lost = false;

  const clock = () => view.performance.now() / 1000;

  const draw = (material: THREE.ShaderMaterial, output: THREE.WebGLRenderTarget | null) => {
    quad.material = material;
    renderer.setRenderTarget(output);
    renderer.render(quadScene, camera);
  };

  const fit = () => Math.min(clamp(width / height / 1.5, 0.48, 1), (width / height) * 1.05);

  const rebuild = (layer: Layer) => {
    const plant = buildPlant(layer.kind, width / height, SCALES[layer.kind] * fit());
    layer.branches = plant.branches;
    layer.anchor = plant.anchor;
  };

  const syncColors = () => {
    if (!probe) return false;
    probe.clearRect(0, 0, 1, 1);
    probe.fillStyle = "#ffffff";
    probe.fillStyle = view.getComputedStyle(root).backgroundColor;
    probe.fillRect(0, 0, 1, 1);
    const [r, g, b] = probe.getImageData(0, 0, 1, 1).data;
    const key = `${r},${g},${b}`;
    if (key === colorKey) return false;
    colorKey = key;
    lightMode = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.5;
    stage.style.mixBlendMode = lightMode ? "color-dodge" : "screen";
    return true;
  };

  const place = () => {
    if (wall.offsetHeight > 0) {
      const top = wall.getBoundingClientRect().top - root.getBoundingClientRect().top;
      const span = wall.offsetHeight / height;
      windowUniforms.uWindow.value.set(half.x * 0.3, 0.5 - top / height - span / 2, span * (width >= 640 ? 0.52 : 0.45), 0.04);
      return;
    }
    const size = 0.58 * fit();
    windowUniforms.uWindow.value.set(clamp(half.x * 0.5, 0, half.x - size * 0.4), 0.2, size, 0.05);
  };

  const resize = () => {
    const nextWidth = Math.round(root.clientWidth);
    const nextHeight = Math.round(root.clientHeight);
    const nextRatio = Math.min(view.devicePixelRatio || 1, 2);
    if (nextWidth < 2 || nextHeight < 2) return false;
    if (nextWidth === width && nextHeight === height && nextRatio === pixelRatio) return false;
    width = nextWidth;
    height = nextHeight;
    pixelRatio = nextRatio;
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    const w = Math.round(width * pixelRatio);
    const h = Math.round(height * pixelRatio);
    maskTarget.setSize(w, h);
    emissionTarget.setSize(w, h);
    let bw = w;
    let bh = h;
    for (const bloom of bloomTargets) {
      bw = Math.max(1, Math.round(bw / 2));
      bh = Math.max(1, Math.round(bh / 2));
      bloom.setSize(bw, bh);
    }
    glowMaterial.uniforms.uResolution.value.set(w, h);
    half.set(width / height / 2, 0.5);
    place();
    layers.forEach(rebuild);
    return true;
  };

  const writeLayers = (dt: number) => {
    const wind = reduced ? 0 : 0.6;
    const envelope = 0.55 + 0.45 * Math.sin(windClock * 0.21) * Math.sin(windClock * 0.13 + 1.1);
    const now = clock();
    const leafData = leaves.data.array as Float32Array;
    const leafForm = leaves.form.array as Float32Array;
    const stemData = stems.data.array as Float32Array;
    const stemForm = stems.form.array as Float32Array;
    const thickness = fit();
    let leafIndex = 0;
    let stemIndex = 0;
    for (const layer of layers) {
      const level = 1 - (1 - layer.progress) * (1 - layer.progress);
      if (level < 0.002) continue;
      const grow = 1 + 0.16 * (1 - level);
      const [ax, ay] = layer.anchor;
      for (const branch of layer.branches) {
        const push = breeze.x * -Math.sin(branch.angle) + breeze.y * Math.cos(branch.angle);
        const torque = wind * turbulence(windClock, branch.phase) * envelope * 0.16 + push * 0.3;
        if (branch.kick > 0 && now >= branch.kickAt && !reduced) {
          branch.velocity += branch.kick * (Math.abs(branch.angle) < Math.PI / 2 ? 1 : -1) * 0.55;
          branch.kick = 0;
        }
        if (reduced) {
          branch.bend = 0;
          branch.velocity = 0;
        } else {
          const omega = TAU / (1.5 + branch.depth * 0.9 + branch.length * 0.4);
          const steps = Math.max(1, Math.ceil(dt * 120));
          const h = dt / steps;
          for (let s = 0; s < steps; s++) {
            branch.velocity += (omega * omega * (torque - branch.bend) - 0.6 * omega * branch.velocity) * h;
            branch.bend += branch.velocity * h;
          }
        }
        const depth = branch.depth * 0.7;
        const blur = (0.0016 + 0.028 * depth * depth + 0.004 * depth) * (1 + 3.2 * (1 - level));
        const opacity = clamp(0.98 - 0.36 * depth, 0.3, 1) * level;
        const segment = branch.length / branch.segments;
        let x = branch.base[0];
        let y = branch.base[1];
        let angle = branch.angle;
        const joints: [number, number, number][] = [[x, y, angle]];
        for (let k = 1; k <= branch.segments; k++) {
          const flex = Math.pow(k / branch.segments, 1.4);
          angle += (branch.curl / branch.segments) * 2;
          angle += wrapAngle(-Math.PI / 2 - angle) * branch.droop * 0.5;
          const local = angle + branch.bend * flex * 0.9 + 0.012 * wind * Math.sin(3.1 * windClock + k + branch.phase);
          const nx = x + Math.cos(local) * segment;
          const ny = y + Math.sin(local) * segment;
          if (stemIndex < MAX_STEMS) {
            stemData.set(
              [ax + (x - ax) * grow, ay + (y - ay) * grow, ax + (nx - ax) * grow, ay + (ny - ay) * grow],
              stemIndex * 4,
            );
            stemForm.set([branch.thickness * (1.25 - (k / branch.segments) * 0.8) * thickness * grow, blur, opacity, 0], stemIndex * 4);
            stemIndex++;
          }
          x = nx;
          y = ny;
          joints.push([x, y, local]);
        }
        for (const leaf of branch.leaves) {
          if (leafIndex >= MAX_LEAVES) break;
          const joint = joints[Math.min(leaf.at, joints.length - 1)];
          const flutter = Math.sin(windClock * leaf.rate + leaf.flutter) * (0.05 + 1.32 * Math.abs(torque)) * wind;
          let leafAngle = joint[2] + (leaf.side === 0 ? leaf.tilt + flutter * 0.6 : leaf.side * (leaf.tilt + flutter));
          leafAngle += wrapAngle(-Math.PI / 2 - leafAngle) * leaf.droop * 0.35;
          const cx = joint[0] + Math.cos(leafAngle) * leaf.length * 0.55;
          const cy = joint[1] + Math.sin(leafAngle) * leaf.length * 0.55;
          leafData.set([ax + (cx - ax) * grow, ay + (cy - ay) * grow, leafAngle, leaf.length * grow], leafIndex * 4);
          leafForm.set([leaf.width, blur, opacity, 0], leafIndex * 4);
          leafIndex++;
        }
      }
    }
    leaves.geometry.instanceCount = leafIndex;
    stems.geometry.instanceCount = stemIndex;
    leaves.data.needsUpdate = true;
    leaves.form.needsUpdate = true;
    stems.data.needsUpdate = true;
    stems.form.needsUpdate = true;
  };

  const render = () => {
    renderer.setRenderTarget(maskTarget);
    renderer.setClearColor(0x000000, 0);
    renderer.clear();
    renderer.render(maskScene, camera);
    if (lightMode) {
      sunMaterial.uniforms.uSun.value = sun;
      sunMaterial.uniforms.uTime.value = time;
      draw(sunMaterial, null);
      return;
    }
    emissionMaterial.uniforms.uSun.value = sun;
    draw(emissionMaterial, emissionTarget);
    let from: THREE.WebGLRenderTarget = emissionTarget;
    for (const bloom of bloomTargets) {
      downMaterial.uniforms.uSource.value = from.texture;
      downMaterial.uniforms.uTexel.value.set(1 / from.width, 1 / from.height);
      draw(downMaterial, bloom);
      from = bloom;
    }
    for (let i = bloomTargets.length - 1; i > 0; i--) {
      upMaterial.uniforms.uSource.value = bloomTargets[i].texture;
      upMaterial.uniforms.uTexel.value.set(1 / bloomTargets[i].width, 1 / bloomTargets[i].height);
      draw(upMaterial, bloomTargets[i - 1]);
    }
    glowMaterial.uniforms.uTime.value = time;
    draw(glowMaterial, null);
  };

  const schedule = () => {
    if (destroyed || lost || !visible || raf) return;
    raf = view.requestAnimationFrame(frame);
  };

  function frame(now: number) {
    raf = 0;
    if (destroyed || lost) return;
    const dt = last && now - last < 100 ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
    last = now;
    if (!width) resize();
    if (!width) return;
    if (!reduced) {
      time += dt;
      windClock += dt * (1 + 0.8 * Math.min(Math.hypot(breeze.x, breeze.y), 1.5) + windBoost);
    }
    const decay = Math.exp(-dt / 1.3);
    breeze.x *= decay;
    breeze.y *= decay;
    windBoost = windBoost * Math.exp(-dt / 1.6);
    if (windBoost < 1e-3) windBoost = 0;
    sun = reduced ? 1 : Math.min(1, sun + dt / 1.6);
    for (const layer of layers) {
      const rate = layer.target > layer.progress ? 1.05 : 0.65;
      layer.progress = reduced
        ? layer.target
        : layer.target > layer.progress
          ? Math.min(layer.target, layer.progress + dt / rate)
          : Math.max(layer.target, layer.progress - dt / rate);
    }
    for (let i = layers.length - 1; i >= 0; i--) {
      if (layers[i].target === 0 && layers[i].progress <= 0) layers.splice(i, 1);
    }
    writeLayers(dt);
    render();
    const settling =
      Math.abs(breeze.x) + Math.abs(breeze.y) > 1e-3 ||
      windBoost > 0 ||
      sun < 1 ||
      layers.some((layer) => layer.progress !== layer.target);
    if (!reduced || settling) schedule();
  }

  const gust = (strength: number) => {
    if (reduced) return;
    const now = clock();
    const top = layers[layers.length - 1];
    top?.branches.forEach((branch, index) => {
      branch.kick = Math.min(branch.kick + strength * (0.75 + 0.2 * Math.sin(index * 2.3)), 2.2);
      branch.kickAt = now + 0.05 + 0.09 * index + branch.depth * 0.08;
    });
    windBoost = Math.min(windBoost + 0.6 * strength, 1.5);
    schedule();
  };

  const show = (kind: Kind) => {
    const top = layers[layers.length - 1];
    if (top && top.kind === kind && top.target === 1) return;
    layers.forEach((layer) => {
      layer.target = 0;
    });
    const existing = layers.findIndex((layer) => layer.kind === kind);
    let layer: Layer;
    if (existing >= 0) {
      layer = layers.splice(existing, 1)[0];
    } else {
      layer = { kind, branches: [], anchor: [0, 0], progress: 0, target: 1 };
      if (width) rebuild(layer);
    }
    layer.target = 1;
    layers.push(layer);
    while (layers.length > 3) layers.shift();
    if (top) {
      const now = clock();
      layer.branches.forEach((branch, index) => {
        branch.kick = Math.min(branch.kick + 0.45, 2.2);
        branch.kickAt = now + 0.35 + 0.08 * index;
      });
    }
    schedule();
  };

  const onMove = (event: PointerEvent) => {
    if (reduced || event.pointerType === "touch") return;
    const rect = root.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const t = view.performance.now();
    if (pointer) {
      const elapsed = Math.max((t - pointer.t) / 1000, 1 / 240);
      const vx = (x - pointer.x) / Math.max(height, 1) / elapsed;
      const vy = -(y - pointer.y) / Math.max(height, 1) / elapsed;
      const gain = clamp(elapsed / 0.12, 0, 1) * 0.35;
      breeze.x += (clamp(vx, -4, 4) - breeze.x) * gain;
      breeze.y += (clamp(vy, -4, 4) - breeze.y) * gain;
      const magnitude = Math.hypot(breeze.x, breeze.y);
      if (magnitude > 2) {
        breeze.x *= 2 / magnitude;
        breeze.y *= 2 / magnitude;
      }
    }
    pointer = { x, y, t };
    schedule();
  };

  const onLeave = () => {
    pointer = null;
  };

  const onDown = (event: PointerEvent) => {
    if (!event.isPrimary || event.button > 0) return;
    const element = event.target as Element | null;
    if (element?.closest?.("a,button,input,select,textarea,label")) return;
    gust(0.9);
  };

  const refresh = () => {
    if (syncColors()) {
      last = 0;
      if (raf) return;
      if (visible) render();
      schedule();
    }
  };

  const onMotion = () => {
    reduced = motionQuery.matches;
    last = 0;
    schedule();
  };

  const onLost = (event: Event) => {
    event.preventDefault();
    lost = true;
    view.cancelAnimationFrame(raf);
    raf = 0;
  };

  const onRestored = () => {
    lost = false;
    colorKey = "";
    syncColors();
    schedule();
  };

  const resizeObserver = new ResizeObserver(() => {
    if (resize()) {
      last = 0;
      if (!raf && visible) {
        writeLayers(0);
        render();
      }
      schedule();
    }
  });
  const intersection = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        last = 0;
        schedule();
      } else {
        view.cancelAnimationFrame(raf);
        raf = 0;
      }
    },
    { rootMargin: "80px" },
  );
  const themes = new MutationObserver(refresh);
  const scheme = view.matchMedia("(prefers-color-scheme: dark)");
  root.addEventListener("pointermove", onMove);
  root.addEventListener("pointerleave", onLeave);
  root.addEventListener("pointerdown", onDown);
  canvas.addEventListener("webglcontextlost", onLost);
  canvas.addEventListener("webglcontextrestored", onRestored);
  motionQuery.addEventListener("change", onMotion);
  scheme.addEventListener("change", refresh);
  themes.observe(doc.documentElement, { attributes: true, attributeFilter: ["class", "style", "data-theme"] });
  resizeObserver.observe(root);
  resizeObserver.observe(wall);
  intersection.observe(root);
  syncColors();
  resize();
  show(initial);

  return {
    show,
    destroy: () => {
      destroyed = true;
      view.cancelAnimationFrame(raf);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      motionQuery.removeEventListener("change", onMotion);
      scheme.removeEventListener("change", refresh);
      themes.disconnect();
      resizeObserver.disconnect();
      intersection.disconnect();
      maskTarget.dispose();
      emissionTarget.dispose();
      bloomTargets.forEach((bloom) => bloom.dispose());
      [leafMaterial, stemMaterial, sunMaterial, emissionMaterial, downMaterial, upMaterial, glowMaterial].forEach(
        (material) => material.dispose(),
      );
      leaves.geometry.dispose();
      stems.geometry.dispose();
      plane.dispose();
      renderer.dispose();
      canvas.remove();
    },
  };
}

const sequence: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

export function Hero28() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const wallRef = useRef<HTMLDivElement>(null);
  const gardenRef = useRef<Garden | null>(null);
  const optionsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const intentRef = useRef(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const wall = wallRef.current;
    if (!section || !stage || !wall) return;
    const garden = createGarden(section, stage, wall, PLANTS[0].kind);
    gardenRef.current = garden;
    return () => {
      window.clearTimeout(intentRef.current);
      garden?.destroy();
      gardenRef.current = null;
    };
  }, []);

  useEffect(() => {
    gardenRef.current?.show(PLANTS[active].kind);
  }, [active]);

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    let next = -1;
    if (event.key in keys) next = (active + keys[event.key] + PLANTS.length) % PLANTS.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = PLANTS.length - 1;
    if (next < 0) return;
    event.preventDefault();
    setActive(next);
    optionsRef.current[next]?.focus();
  };

  const plant = PLANTS[active];

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex min-h-screen w-full flex-col overflow-hidden bg-[#d8d1c5] px-4 pb-10 pt-8 text-[#1d1b17] dark:bg-[#0f0e0c] dark:text-[#f3eee5] sm:px-6 lg:px-8 lg:pb-12 lg:pt-24"
    >
      <motion.div
        variants={sequence}
        initial={reduceMotion ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col"
      >
        <div ref={wallRef} aria-hidden="true" className="h-[min(21rem,82vw)] shrink-0 lg:hidden" />
        <div className="max-w-[34rem]">
          <motion.h1
            variants={rise}
            className="text-pretty text-[2rem] font-medium leading-[1.06] tracking-[-0.035em] sm:text-[2.75rem] lg:text-[3.25rem]"
          >
            Plants for the light you already have.
          </motion.h1>
          <motion.p
            variants={rise}
            className="mt-5 max-w-[38ch] text-pretty text-base leading-relaxed text-[#1d1b17]/70 dark:text-[#f3eee5]/65"
          >
            Tell us which way your windows face. We&apos;ll send a plant that thrives in that light, potted, with care notes
            written for your room.
          </motion.p>
        </div>

        <div className="mt-auto flex flex-col gap-10 pt-16 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div role="radiogroup" aria-label="Choose a plant" className="flex flex-col items-start">
            {PLANTS.map((item, index) => {
              const selected = index === active;
              return (
                <motion.button
                  key={item.kind}
                  variants={rise}
                  ref={(element: HTMLButtonElement | null) => {
                    optionsRef.current[index] = element;
                  }}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(index)}
                  onKeyDown={onKeyDown}
                  onPointerEnter={(event) => {
                    if (event.pointerType !== "mouse") return;
                    window.clearTimeout(intentRef.current);
                    intentRef.current = window.setTimeout(() => setActive(index), 70);
                  }}
                  onPointerLeave={() => window.clearTimeout(intentRef.current)}
                  className={`cursor-pointer rounded-md text-left text-[clamp(3.5rem,8.2vw,8rem)] font-medium leading-[0.92] tracking-[-0.045em] outline-none transition-colors duration-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current ${
                    selected
                      ? "text-[#1d1b17] dark:text-[#f3eee5]"
                      : "text-[#1d1b17]/45 hover:text-[#1d1b17]/70 dark:text-[#f3eee5]/40 dark:hover:text-[#f3eee5]/70"
                  }`}
                >
                  {item.name}
                </motion.button>
              );
            })}
          </div>

          <motion.div variants={rise} className="w-full max-w-[24rem] lg:mb-3">
            <div aria-live="polite">
              <motion.div
                key={plant.kind}
                initial={reduceMotion ? false : { opacity: 0, y: 6, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-baseline justify-between gap-6">
                  <p className="text-lg font-medium tracking-[-0.01em]">{plant.common}</p>
                  <p className="text-lg font-medium tabular-nums">{plant.price}</p>
                </div>
                <p className="mt-1 text-sm italic text-[#1d1b17]/60 dark:text-[#f3eee5]/55">{plant.species}</p>
                <p className="mt-4 text-sm text-[#1d1b17]/75 dark:text-[#f3eee5]/70">
                  {plant.height} tall · {plant.light}
                </p>
              </motion.div>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
              <button
                type="button"
                className="inline-flex h-12 cursor-pointer items-center justify-center rounded-full bg-[#1d1b17] px-7 text-sm font-medium text-[#d8d1c5] transition-colors duration-200 hover:bg-[#33302a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d1b17] dark:bg-[#f3eee5] dark:text-[#0f0e0c] dark:hover:bg-white dark:focus-visible:outline-[#f3eee5]"
              >
                Add to cart
              </button>
              <a
                href="#"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full text-sm font-medium text-[#1d1b17]/80 transition-colors duration-200 hover:text-[#1d1b17] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current dark:text-[#f3eee5]/80 dark:hover:text-[#f3eee5] sm:justify-start"
              >
                Take the light quiz
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div ref={stageRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-10" />
    </section>
  );
}

export default Hero28;
