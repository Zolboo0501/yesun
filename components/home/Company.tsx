"use client";

import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import * as THREE from "three";

// The company section: daylight from a window lands on the wall and the air coming in through it is
// drawn in that light. Built from components/blocks/hero-28.tsx, with air streams in place of plants.

type Mode = "vent" | "cool" | "filter";

const SYSTEMS: { mode: Mode; word: string; name: string; text: string; meta: string }[] = [
  {
    mode: "vent",
    word: "Сэлгэлт",
    name: "Агаар сэлгэлт",
    text: "Гаднаас цэвэр агаар оруулж, хэрэглэсэн агаарыг гаргана. Агаарын солилцоог өрөө бүрээр тооцоолж зохионо.",
    meta: "Брэнд · BALLU · SHUFT",
  },
  {
    mode: "cool",
    word: "Хөргөлт",
    name: "Хөргөлтийн систем",
    text: "Сэрүүцүүлсэн агаарыг өрөөнд жигд тарааж, халуун өдөр ч ажлын орчныг тогтвортой барина.",
    meta: "Брэнд · KANION · AUX",
  },
  {
    mode: "filter",
    word: "Шүүлт",
    name: "Агаар шүүлт, боловсруулалт",
    text: "Агаар боловсруулах төхөөрөмж гаднах агаарыг шүүж, тоосыг барьж, цэвэр агаараар өрөөг хангана.",
    meta: "Үүрэг · Шүүлт · Халаалт · Хөргөлт",
  },
];

const FACTS = [
  { value: "2011", label: "Байгуулагдсан" },
  { value: "150+", label: "Угсралт хийсэн объект" },
  { value: "1 800 м²", label: "Үйлдвэрийн талбай" },
  { value: "12", label: "Үйлдвэрийн тоног төхөөрөмж" },
  { value: "1–3 жил", label: "Чанарын баталгаа" },
  { value: "24/7", label: "Яаралтай үйлчилгээ" },
];

/** How the air moves for each system: fresh air spreads, cool air sinks, filtered air runs in clean lanes. */
type Flow = { dx: number; dy: number; speed: number; swirl: number; sink: number; width: number; tint: [number, number, number] };
const FLOW: Record<Mode, Flow> = {
  vent: { dx: 1, dy: -0.12, speed: 0.2, swirl: 0.22, sink: 0, width: 0.0034, tint: [1, 1, 1] },
  cool: { dx: 0.9, dy: -0.38, speed: 0.13, swirl: 0.06, sink: 0.012, width: 0.0038, tint: [0.78, 0.92, 1.16] },
  filter: { dx: 1, dy: -0.06, speed: 0.24, swirl: 0.02, sink: 0, width: 0.0026, tint: [1, 1, 1] },
};
const LANES = 15;
const STREAMS = 110;
const MOTES = 40; // dust motes glinting in the beam
const TRAIL = 34;
const MAX_SEGMENTS = STREAMS * (TRAIL - 1) + MOTES;
const GAIN: [number, number, number] = [0.16, 0.16, 0.155];
const TAU = Math.PI * 2;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

const random = (seed: number) => {
  let state = (Math.floor(Math.abs(seed)) % 2147483646) + 1;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
};

const passVertex = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

// One soft capsule per trail segment of an air stream.
const streakVertex = `
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

const streakFragment = `
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
uniform float uLen;
float sunlight(vec2 p) {
  vec2 d = p - uWindow.xy;
  float c = cos(uAngle);
  float s = sin(uAngle);
  vec2 r = vec2(c * d.x + s * d.y, -s * d.x + c * d.y);
  float size = uWindow.z;
  float soft = uWindow.w;
  float halfLen = size * uLen;
  float y = r.y / (1.0 + 0.3 * clamp(r.x / halfLen, -1.0, 1.0));
  float halfW = size * 0.5;
  float across = smoothstep(-halfW - soft, -halfW + soft, y) * (1.0 - smoothstep(halfW - soft, halfW + soft, y));
  float along = smoothstep(-halfLen - soft * 2.0, -halfLen + soft * 2.0, r.x) * (1.0 - smoothstep(halfLen - soft * 2.0, halfLen + soft * 2.0, r.x));
  float bar = size * 0.028;
  float mullion = 1.0 - (1.0 - smoothstep(bar, bar + soft * 0.5, abs(y))) * 0.94;
  float transom = 1.0 - (1.0 - smoothstep(bar, bar + soft * 0.5, abs(r.x + halfLen * 0.28))) * 0.94;
  float falloff = mix(0.5, 1.0, 1.0 - smoothstep(-halfLen, halfLen, r.x)) * mix(0.8, 1.0, 1.0 - smoothstep(0.0, halfW, abs(y)));
  return across * along * mullion * transom * falloff;
}
`;

// The beam lands on the wall below white, so the air and the motes it carries can glint brighter inside it and on the wall around it.
const sunFragment = `
uniform sampler2D uMask;
uniform vec3 uGain;
uniform vec3 uTint;
uniform vec2 uHalf;
uniform float uSun;
uniform float uBeam;
uniform float uAirBeam;
uniform float uCeil;
uniform float uGrain;
uniform float uTime;
varying vec2 vUv;
${windowChunk}
${hashChunk}
void main() {
  vec2 p = (vUv * 2.0 - 1.0) * uHalf;
  float air = texture2D(uMask, vUv).r;
  float beam = sunlight(p);
  float lit = min((beam * uBeam + air * mix(0.8, uAirBeam, beam)) * uSun, uCeil);
  float n = hash(gl_FragCoord.xy + fract(uTime * 17.0) * 911.0) - 0.5;
  lit = max(lit + n * uGrain * 0.1 * smoothstep(0.0, 0.1, lit), 0.0);
  vec3 gain = 1.0 + uGain * uTint * lit;
  gl_FragColor = vec4(1.0 - 1.0 / gain, 1.0);
}
`;

interface Air {
  show: (mode: Mode) => void;
  destroy: () => void;
}

interface Stream {
  x: number;
  y: number;
  age: number;
  life: number;
  seed: number;
  lane: number;
  mote: boolean;
  trail: Float32Array;
  count: number;
}

function createAir(root: HTMLElement, stage: HTMLElement, wall: HTMLElement, initial: Mode): Air | null {
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
  stage.style.mixBlendMode = "color-dodge";
  renderer.autoClear = false;

  const motionQuery = view.matchMedia("(prefers-reduced-motion: reduce)");
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
  const plane = new THREE.PlaneGeometry(2, 2);
  const quad = new THREE.Mesh(plane);
  quad.frustumCulled = false;
  const quadScene = new THREE.Scene();
  quadScene.add(quad);
  const half = new THREE.Vector2(1, 0.5);

  const geometry = new THREE.InstancedBufferGeometry();
  geometry.index = plane.index;
  geometry.setAttribute("position", plane.getAttribute("position"));
  const segData = new THREE.InstancedBufferAttribute(new Float32Array(MAX_SEGMENTS * 4), 4);
  const segForm = new THREE.InstancedBufferAttribute(new Float32Array(MAX_SEGMENTS * 4), 4);
  segData.setUsage(THREE.DynamicDrawUsage);
  segForm.setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute("iStem", segData);
  geometry.setAttribute("iStemShape", segForm);
  geometry.instanceCount = 0;
  const streakMaterial = new THREE.ShaderMaterial({
    uniforms: { uHalf: { value: half } },
    vertexShader: streakVertex,
    fragmentShader: streakFragment,
    transparent: true,
    blending: THREE.CustomBlending,
    blendEquation: THREE.AddEquation,
    blendSrc: THREE.OneFactor,
    blendDst: THREE.OneMinusSrcColorFactor,
    depthTest: false,
    depthWrite: false,
  });
  const streakMesh = new THREE.Mesh(geometry, streakMaterial);
  streakMesh.frustumCulled = false;
  const maskScene = new THREE.Scene();
  maskScene.add(streakMesh);
  const maskTarget = new THREE.WebGLRenderTarget(1, 1, {
    type: THREE.UnsignedByteType,
    depthBuffer: false,
    stencilBuffer: false,
    generateMipmaps: false,
  });

  const windowUniforms = {
    uWindow: { value: new THREE.Vector4(0, 0, 0.5, 0.05) },
    uAngle: { value: 0.49 },
    uLen: { value: 1.3 },
  };
  const sunMaterial = new THREE.ShaderMaterial({
    uniforms: {
      ...windowUniforms,
      uMask: { value: maskTarget.texture },
      uGain: { value: new THREE.Vector3(...GAIN) },
      uTint: { value: new THREE.Vector3(1, 1, 1) },
      uHalf: { value: half },
      uSun: { value: 0 },
      uBeam: { value: 0.8 },
      uAirBeam: { value: 1.2 },
      uCeil: { value: 4 },
      uGrain: { value: 0.2 },
      uTime: { value: 0 },
    },
    vertexShader: passVertex,
    fragmentShader: sunFragment,
    depthTest: false,
    depthWrite: false,
  });

  const rng = random(4219);
  const flow: Flow = { ...FLOW[initial], tint: [...FLOW[initial].tint] };
  let mode = initial;
  const streams: Stream[] = Array.from({ length: STREAMS + MOTES }, (_, i) => ({
    x: 0,
    y: 0,
    age: 0,
    life: 1,
    seed: 0,
    lane: i % LANES,
    mote: i >= STREAMS,
    trail: new Float32Array(TRAIL * 2),
    count: 0,
  }));
  const breeze = { x: 0, y: 0 };
  let pointer: { x: number; y: number; t: number } | null = null;
  let reduced = motionQuery.matches;
  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let scale = 1;
  let time = 0;
  let windClock = 0;
  let windBoost = 0;
  let sun = 0;
  let sunStart = 0;
  let raf = 0;
  let last = 0;
  let visible = false;
  let destroyed = false;
  let lost = false;

  const fit = () => Math.min(clamp(width / height / 1.5, 0.48, 1), (width / height) * 1.05);

  const place = () => {
    if (wall.offsetHeight > 0) {
      const top = wall.getBoundingClientRect().top - root.getBoundingClientRect().top;
      const span = wall.offsetHeight / height;
      const size = span * (width >= 640 ? 0.6 : 0.7);
      // softness scales with the patch and stays under the bar width, so the frame bars read on a phone too
      windowUniforms.uWindow.value.set(half.x * 0.1, 0.5 - top / height - span / 2, size, size * 0.035);
      // a squarer pane so the cross reads as a window; beam plus air stays under the dodge's white (lit ≈ 0.59 on this wall)
      windowUniforms.uLen.value = 0.75;
      // flow sizes are in section heights, and a phone section is about twice a laptop's, so scale them back to laptop pixels
      scale = Math.min(1, 860 / height);
      sunMaterial.uniforms.uBeam.value = 0.34;
      sunMaterial.uniforms.uAirBeam.value = 0.3;
      sunMaterial.uniforms.uCeil.value = 0.48;
      return;
    }
    const size = 0.5 * fit();
    windowUniforms.uWindow.value.set(clamp(half.x * 0.28, 0, half.x - size * 0.4), 0.16, size, 0.022);
    windowUniforms.uLen.value = 1.3;
    scale = 1;
    sunMaterial.uniforms.uBeam.value = 0.8;
    sunMaterial.uniforms.uAirBeam.value = 1.2;
    sunMaterial.uniforms.uCeil.value = 4;
  };

  /** A stream enters through the window and flows out of it into the room. */
  const spawn = (s: Stream, scatter: boolean) => {
    const [cx, cy, size] = windowUniforms.uWindow.value.toArray();
    const lanes = mode === "filter";
    s.seed = rng() * TAU;
    s.count = 0;
    if (s.mote) {
      s.x = cx + (rng() - 0.5) * Math.max(size, 0.12) * 2.2;
      s.y = cy + (rng() - 0.5) * Math.max(size, 0.12) * 0.9;
      s.age = scatter ? rng() * 2 : 0;
      s.life = 2 + rng() * 2.5;
      return;
    }
    // a wide band entering on the window side, so the streams run long and nearly parallel
    // a small phone patch would crowd every stream into it and wash it out, so the band never shrinks below the wall
    const reachX = Math.max(size, 0.3);
    const reachY = Math.max(size, 0.12);
    s.x = cx - reachX * (1.4 - rng()) + (scatter ? rng() * reachX * 3 : 0);
    s.y = cy + (lanes ? (s.lane / (LANES - 1) - 0.5) * reachY * 1.3 + (rng() - 0.5) * 0.004 : (rng() - 0.5) * reachY * 1.4);
    s.age = scatter ? rng() * 3 : 0;
    s.life = 5 + rng() * 4;
  };

  const advance = (s: Stream, dt: number) => {
    let vx = flow.dx * flow.speed;
    let vy = flow.dy * flow.speed - flow.sink * s.age;
    // broad, slow undulation: wind through a window, not leaves
    const n1 = Math.sin(s.y * 4 + windClock * 0.7 + s.seed) + 0.5 * Math.sin(s.x * 2.4 - windClock * 0.5 + s.seed * 1.7);
    const n2 = Math.cos(s.x * 3 - windClock * 0.6 + s.seed) + 0.5 * Math.sin(s.y * 2 + windClock * 0.8);
    vx += flow.swirl * flow.speed * 0.45 * n2;
    vy += flow.swirl * flow.speed * 0.7 * n1;
    if (pointer) {
      // the pointer stirs the air around it
      const px = (pointer.x - width / 2) / height;
      const py = (height / 2 - pointer.y) / height;
      const d = Math.hypot(s.x - px, s.y - py);
      if (d < 0.22) {
        const w = 1 - d / 0.22;
        vx += breeze.x * w * 0.3;
        vy += breeze.y * w * 0.3;
      }
    }
    if (s.mote) {
      vx *= 0.25;
      vy = vy * 0.25 + Math.sin(windClock * 0.6 + s.seed) * 0.008;
    }
    const boost = (1 + windBoost) * scale;
    s.x += vx * boost * dt;
    s.y += vy * boost * dt;
    s.age += dt;
  };

  const sample = (s: Stream) => {
    const t = s.trail;
    const cap = s.mote ? 2 : TRAIL;
    if (s.count > 0 && !s.mote) {
      const dx = s.x - t[(s.count - 1) * 2];
      const dy = s.y - t[(s.count - 1) * 2 + 1];
      if (dx * dx + dy * dy < (0.012 * scale) ** 2) return;
    }
    if (s.count === cap) {
      t.copyWithin(0, 2);
      s.count--;
    }
    t[s.count * 2] = s.x;
    t[s.count * 2 + 1] = s.y;
    s.count++;
  };

  const blend = (dt: number) => {
    const target = FLOW[mode];
    const k = reduced ? 1 : 1 - Math.exp(-dt / 0.6);
    flow.dx += (target.dx - flow.dx) * k;
    flow.dy += (target.dy - flow.dy) * k;
    flow.speed += (target.speed - flow.speed) * k;
    flow.swirl += (target.swirl - flow.swirl) * k;
    flow.sink += (target.sink - flow.sink) * k;
    flow.width += (target.width - flow.width) * k;
    for (let c = 0; c < 3; c++) flow.tint[c] += (target.tint[c] - flow.tint[c]) * k;
    sunMaterial.uniforms.uTint.value.set(...flow.tint);
  };

  const step = (dt: number) => {
    for (const s of streams) {
      advance(s, dt);
      sample(s);
      if (s.age > s.life || s.x > half.x + 0.15 || s.y < -0.65 || s.y > 0.65) spawn(s, false);
    }
  };

  /** With reduced motion the streams are drawn once, as still streamlines. */
  const bake = () => {
    blend(1);
    for (const s of streams) {
      spawn(s, true);
      s.age = 1.5;
      for (let k = 0; k < TRAIL * 4 && s.count < TRAIL; k++) {
        advance(s, 1 / 30);
        sample(s);
      }
    }
  };

  const write = () => {
    const data = segData.array as Float32Array;
    const form = segForm.array as Float32Array;
    let n = 0;
    const sparse = width < 640; // the phone wall is a small strip; every stream on it would wash it white
    for (let i = 0; i < streams.length; i++) {
      const s = streams[i];
      if (sparse && i % 3 !== 0) continue;
      const fade = smooth(0, 0.8, s.age) * (1 - smooth(s.life - 1.4, s.life, s.age));
      if (fade < 0.01 || s.count < 2) continue;
      for (let j = 1; j < s.count; j++) {
        const along = j / (s.count - 1);
        data.set([s.trail[(j - 1) * 2], s.trail[(j - 1) * 2 + 1], s.trail[j * 2], s.trail[j * 2 + 1]], n * 4);
        form.set(
          s.mote
            ? [0.0017 * scale, 0.0014 * scale, fade * 0.9, 0]
            : [flow.width * scale * (0.5 + 0.7 * along), flow.width * scale * 1.6, fade * Math.sin(Math.PI * along) * 0.95, 0],
          n * 4,
        );
        n++;
      }
    }
    geometry.instanceCount = n;
    segData.needsUpdate = true;
    segForm.needsUpdate = true;
  };

  const render = () => {
    renderer.setRenderTarget(maskTarget);
    renderer.setClearColor(0x000000, 0);
    renderer.clear();
    renderer.render(maskScene, camera);
    sunMaterial.uniforms.uSun.value = sun;
    sunMaterial.uniforms.uTime.value = time;
    quad.material = sunMaterial;
    renderer.setRenderTarget(null);
    renderer.render(quadScene, camera);
  };

  const resize = () => {
    const nextWidth = Math.round(root.clientWidth);
    const nextHeight = Math.round(root.clientHeight);
    const nextRatio = Math.min(view.devicePixelRatio || 1, 1.5);
    if (nextWidth < 2 || nextHeight < 2) return false;
    if (nextWidth === width && nextHeight === height && nextRatio === pixelRatio) return false;
    width = nextWidth;
    height = nextHeight;
    pixelRatio = nextRatio;
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    maskTarget.setSize(Math.round(width * pixelRatio), Math.round(height * pixelRatio));
    half.set(width / height / 2, 0.5);
    place();
    if (reduced) bake();
    else streams.forEach((s) => spawn(s, true));
    return true;
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
    // the daylight fades in over 1.6 s of real time, however few frames a background tab gets
    if (!sunStart) sunStart = now;
    sun = reduced ? 1 : Math.min(1, (now - sunStart) / 1600);
    if (!reduced) {
      time += dt;
      windClock += dt * (1 + 0.6 * Math.min(Math.hypot(breeze.x, breeze.y), 1.5) + windBoost);
      blend(dt);
      step(dt);
    }
    const decay = Math.exp(-dt / 1.3);
    breeze.x *= decay;
    breeze.y *= decay;
    windBoost *= Math.exp(-dt / 1.6);
    if (windBoost < 1e-3) windBoost = 0;
    write();
    render();
    if (!reduced || sun < 1) schedule();
  }

  const show = (next: Mode) => {
    if (next === mode) return;
    mode = next;
    if (reduced) bake();
    else windBoost = Math.min(windBoost + 0.35, 1.5); // the new air arrives with a breath
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
    if (reduced || !event.isPrimary || event.button > 0) return;
    const element = event.target as Element | null;
    if (element?.closest?.("a,button,input,select,textarea,label")) return;
    windBoost = Math.min(windBoost + 0.9, 1.8); // a click sends a gust through the window
    schedule();
  };

  const onMotion = () => {
    reduced = motionQuery.matches;
    last = 0;
    if (reduced) bake();
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
    schedule();
  };

  const resizeObserver = new ResizeObserver(() => {
    if (resize()) {
      last = 0;
      if (!raf && visible) {
        write();
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
  root.addEventListener("pointermove", onMove);
  root.addEventListener("pointerleave", onLeave);
  root.addEventListener("pointerdown", onDown);
  canvas.addEventListener("webglcontextlost", onLost);
  canvas.addEventListener("webglcontextrestored", onRestored);
  motionQuery.addEventListener("change", onMotion);
  resizeObserver.observe(root);
  resizeObserver.observe(wall);
  intersection.observe(root);
  resize();

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
      resizeObserver.disconnect();
      intersection.disconnect();
      maskTarget.dispose();
      streakMaterial.dispose();
      sunMaterial.dispose();
      geometry.dispose();
      plane.dispose();
      renderer.dispose();
      canvas.remove();
    },
  };
}

export function Company() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const wallRef = useRef<HTMLDivElement>(null);
  const airRef = useRef<Air | null>(null);
  const optionsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const intentRef = useRef(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const wall = wallRef.current;
    if (!section || !stage || !wall) return;
    const air = createAir(section, stage, wall, SYSTEMS[0].mode);
    airRef.current = air;
    return () => {
      window.clearTimeout(intentRef.current);
      air?.destroy();
      airRef.current = null;
    };
  }, []);

  useEffect(() => {
    airRef.current?.show(SYSTEMS[active].mode);
  }, [active]);

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    let next = -1;
    if (event.key in keys) next = (active + keys[event.key] + SYSTEMS.length) % SYSTEMS.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = SYSTEMS.length - 1;
    if (next < 0) return;
    event.preventDefault();
    setActive(next);
    optionsRef.current[next]?.focus();
  };

  const system = SYSTEMS[active];

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-label="Бидний тухай"
      className="relative isolate flex min-h-[89svh] w-full flex-col overflow-hidden bg-panel px-4 pb-12 pt-10 text-ink selection:bg-brand selection:text-white sm:px-6 lg:px-8 lg:pb-16 lg:pt-14"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <h2 className="max-w-[26ch] text-balance text-[clamp(2rem,1.2rem+2.4vw,3.5rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
              2011 оноос хойш 150 гаруй объектын агаарыг хариуцаж ирлээ.
            </h2>
            <p className="mt-6 max-w-[56ch] text-step-body leading-relaxed text-ink/80">
              Барилга, хот байгуулалтын яамнаас олгосон тусгай зөвшөөрлийн дагуу 2011 онд байгуулагдсан. Агаар сэлгэх
              болон хөргөлтийн системийн тооцоолол, зураг төсөл, зөвлөгөө, тоног төхөөрөмж нийлүүлэлт, угсралтын
              чиглэлээр нийслэл болон орон нутагт 150 гаруй объектод ажилласан.
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-x-8 self-start lg:col-span-4 lg:col-start-9">
            {FACTS.map((fact) => (
              <div key={fact.label} className="flex flex-col-reverse justify-end border-t border-ink/15 py-4">
                <dt className="mt-1 text-sm text-soft">{fact.label}</dt>
                <dd className="text-2xl font-semibold tracking-[-0.03em] tabular-nums">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-auto flex flex-col gap-12 pt-12 lg:flex-row lg:items-end lg:justify-between lg:gap-16 lg:pt-10">
          <div>
            {/* on phones the window light lands here, right above the choice it answers */}
            <div ref={wallRef} aria-hidden="true" className="mb-6 h-[min(17rem,70vw)] lg:hidden" />
            <p id="system-label" className="mb-4 text-sm text-soft">
              Агаар юу хийх вэ? Сонгоод хананаас хараарай.
            </p>
            <div role="radiogroup" aria-labelledby="system-label" className="flex flex-col items-start">
              {SYSTEMS.map((item, index) => {
                const selected = index === active;
                return (
                  <button
                    key={item.mode}
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
                    className={`cursor-pointer text-left text-[clamp(3rem,min(1.6rem+5.6vw,10svh),6rem)] font-semibold leading-[0.95] tracking-[-0.04em] outline-none transition-colors duration-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand ${
                      selected ? "text-ink" : "text-ink/55 hover:text-ink/80"
                    }`}
                  >
                    {item.word}
                    {selected && <span aria-hidden className="ml-[0.1em] inline-block size-[0.14em] bg-brand" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="w-full max-w-[26rem] lg:mb-3">
            <div aria-live="polite">
              <motion.div
                key={system.mode}
                initial={reduceMotion ? false : { opacity: 0, y: 6, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="text-lg font-semibold tracking-[-0.01em]">{system.name}</p>
                <p className="mt-3 text-step-body leading-relaxed text-ink/80">{system.text}</p>
                <p className="mt-4 font-mono text-xs uppercase tracking-[0.16em] text-soft">{system.meta}</p>
              </motion.div>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                href="/contact"
                className="group inline-flex h-12 items-center justify-center gap-3 whitespace-nowrap bg-ink px-6 font-mono text-xs uppercase tracking-[0.16em] text-white transition-colors hover:bg-brand active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
              >
                Инженертэй холбогдох
                <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/about"
                className="whitespace-nowrap font-mono text-xs uppercase tracking-[0.16em] underline decoration-1 underline-offset-[6px] transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
              >
                Компанийн танилцуулга
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div ref={stageRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-10" />
    </section>
  );
}
