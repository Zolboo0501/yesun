"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";

export type PortalMode = "streaks" | "tunnel" | "vortex";

export interface PortalHandle {
  boost: (strength?: number) => void;
}

export interface PortalProps {
  className?: string;
  style?: CSSProperties;
  primaryColor?: string;
  secondaryColor?: string;
  centerColor?: string;
  ballBgColor?: string;
  mode?: PortalMode;
  speed?: number;
  density?: number;
  layerCount?: number;
  particleSize?: number;
  streakLength?: number;
  flowAngle?: number;
  colorVariety?: number;
  waveAmplitude?: number;
  waveFrequency?: number;
  verticalDistortion?: number;
  depthIntensity?: number;
  brightness?: number;
  scale?: number;
  rimWidth?: number;
  rimGlow?: number;
  hoverTilt?: number;
  interactive?: boolean;
  boostStrength?: number;
  intro?: boolean;
  paused?: boolean;
  dpr?: number;
}

interface Settings {
  primaryColor: string;
  secondaryColor: string;
  centerColor: string;
  ballBgColor: string;
  mode: PortalMode;
  speed: number;
  density: number;
  layerCount: number;
  particleSize: number;
  streakLength: number;
  flowAngle: number;
  colorVariety: number;
  waveAmplitude: number;
  waveFrequency: number;
  verticalDistortion: number;
  depthIntensity: number;
  brightness: number;
  scale: number;
  rimWidth: number;
  rimGlow: number;
  hoverTilt: number;
  interactive: boolean;
  boostStrength: number;
  intro: boolean;
  paused: boolean;
  dpr: number;
  reduced: boolean;
}

interface Controller {
  sync: () => void;
  boost: (strength?: number) => void;
  destroy: () => void;
}

const MODES: Record<PortalMode, number> = { streaks: 0, tunnel: 1, vortex: 2 };

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
const finite = (value: number, fallback: number) =>
  Number.isFinite(value) ? value : fallback;

const scratchColor = new THREE.Color();

const readColor = (value: string, fallback: string): [THREE.Vector3, number] => {
  const text = value.trim().toLowerCase();
  if (!text || text === "transparent" || text === "none") return [new THREE.Vector3(), 0];
  const rgba = /^rgba?\(([^)]+)\)$/i.exec(text);
  if (rgba) {
    const parts = rgba[1].split(",").map((part) => Number.parseFloat(part));
    return [
      new THREE.Vector3((parts[0] ?? 0) / 255, (parts[1] ?? 0) / 255, (parts[2] ?? 0) / 255),
      parts.length > 3 && Number.isFinite(parts[3]) ? clamp(parts[3], 0, 1) : 1,
    ];
  }
  try {
    scratchColor.setStyle(text, THREE.NoColorSpace);
  } catch {
    scratchColor.setStyle(fallback, THREE.NoColorSpace);
  }
  return [new THREE.Vector3(scratchColor.r, scratchColor.g, scratchColor.b), 1];
};

const subscribeToMotion = (notify: () => void) => {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
};

const readMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uPrimaryColor;
uniform vec3 uSecondaryColor;
uniform vec3 uCenterColor;
uniform float uDensity;
uniform float uLayerCount;
uniform float uWaveAmplitude;
uniform float uWaveFrequency;
uniform float uVerticalDistortion;
uniform float uDepthIntensity;
uniform float uBrightness;
uniform float uScale;
uniform vec3 uBallBgColor;
uniform float uBallBgAlpha;
uniform float uMode;
uniform float uFlowAngle;
uniform float uStretch;
uniform float uSize;
uniform float uVariety;
uniform float uRimWidth;
uniform float uRimGlow;
uniform float uBoost;
uniform vec2 uLook;
uniform float uOpen;
uniform float uPixel;

varying vec2 vUv;

const float TAU = 6.28318530718;

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453);
}

vec2 particles(vec2 coord, float cells, float layer, float drift, float period) {
  coord.x *= cells;
  coord.y *= period > 0.0 ? period : cells;
  coord.x += drift;
  vec2 id = floor(coord);
  vec2 local = fract(coord);
  if (period > 0.0) id.y = mod(id.y, period);
  float light = 0.0;
  float tint = 0.0;
  for (int i = -1; i <= 1; i++) {
    vec2 cell = id + vec2(float(i), 0.0);
    vec2 h = hash2(cell + layer * 17.31);
    vec2 h2 = hash2(cell * 1.7 + layer * 3.1 + 9.2);
    vec2 center = vec2(float(i) + 0.15 + 0.7 * h.x, 0.15 + 0.7 * h.y);
    vec2 offset = local - center;
    float size = uSize * (0.045 + 0.06 * h2.x);
    float spot = exp(-dot(offset, offset) / (size * size));
    float alive = smoothstep(0.08, 0.22, h2.y);
    float energy = spot * alive * (0.45 + 0.55 * h2.y);
    light += energy;
    tint += energy * h.x;
  }
  return vec2(light, tint / max(light, 0.0001));
}

vec2 field(vec2 p) {
  if (uMode < 0.5) {
    float c = cos(uFlowAngle);
    float s = sin(uFlowAngle);
    p = vec2(c * p.x + s * p.y, -s * p.x + c * p.y);
    p.x += sin(uTime * uWaveFrequency) * uWaveAmplitude;
    p.y += sin(p.x * 1.4) * uVerticalDistortion;
    p.x *= 0.1 / uStretch;
    return p;
  }
  float r = max(length(p), 0.0001);
  float a = atan(p.y, p.x);
  float depth = -log(r) * 0.12 / uStretch;
  if (uMode > 1.5) a += log(r) * 1.4 + uTime * 0.1;
  a += sin(uTime * uWaveFrequency) * uWaveAmplitude * 0.15;
  depth += sin(a * 3.0) * uVerticalDistortion * 0.02;
  return vec2(depth, fract(a / TAU));
}

vec3 portal(vec2 coord, float radius, out float tintMix) {
  float depthGradient = max(radius - length(coord), 0.0);
  vec2 p = field(coord);
  float flow = uTime * 2.3;
  float sum = 0.0;
  float tint = 0.0;
  float scales[7];
  scales[0] = 30.0;
  scales[1] = 20.0;
  scales[2] = 15.0;
  scales[3] = 10.0;
  scales[4] = 8.0;
  scales[5] = 6.0;
  scales[6] = 5.0;
  float weights[7];
  weights[0] = 0.3;
  weights[1] = 0.5;
  weights[2] = 0.8;
  weights[3] = 1.0;
  weights[4] = 1.0;
  weights[5] = 1.0;
  weights[6] = 1.0;
  for (int i = 0; i < 7; i++) {
    if (float(i) >= uLayerCount) break;
    float cells = scales[i] * uDensity;
    float period = uMode < 0.5 ? 0.0 : floor(cells * 2.0 + 0.5);
    vec2 part = particles(p, cells, float(i), flow, period);
    sum += part.x * weights[i];
    tint += part.y * part.x * weights[i];
  }
  tintMix = tint / max(sum, 0.0001);
  sum *= uDepthIntensity / max(depthGradient, 0.012 * uRimWidth);
  vec3 streak = mix(uPrimaryColor, uSecondaryColor, mix(0.5, tintMix, uVariety));
  return streak * sum * 0.9 * uBrightness * (1.0 + uBoost * 0.6);
}

void main() {
  vec2 coord = (vUv - 0.5) * 2.0;
  coord.x *= uResolution.x / uResolution.y;
  coord /= uScale;
  float radius = 0.5 * uOpen;
  vec2 lens = coord - uLook * 0.06 * smoothstep(radius, 0.0, length(coord));
  float r = length(coord);
  float tintMix;
  vec3 color = portal(lens, max(radius, 0.001), tintMix);
  float depthGradient = max(radius - r, 0.0);
  vec3 rim = uCenterColor * 0.02 / max(depthGradient + 0.008 * uRimWidth, 0.0005) * uRimGlow;
  color += rim;
  color = 1.0 - exp(-color * 1.15);

  float edge = max(uPixel * 1.5, 0.0015);
  float ball = smoothstep(radius + edge, radius - edge, r);
  float light = max(color.r, max(color.g, color.b));
  float show = smoothstep(0.08, 0.6, light) * ball;

  float outside = max(r - radius, 0.0);
  float halo = exp(-outside / max(0.035 * uRimGlow, 0.002)) * (1.0 - ball) * min(uRimGlow, 2.0) * (radius > 0.002 ? 1.0 : 0.0);
  vec3 haloColor = mix(uCenterColor, mix(uPrimaryColor, uSecondaryColor, 0.5), 0.35);

  vec3 inner;
  float innerAlpha;
  if (uBallBgAlpha > 0.0) {
    inner = mix(uBallBgColor, color, show);
    innerAlpha = ball * max(uBallBgAlpha, show);
  } else {
    inner = color;
    innerAlpha = show;
  }
  float haloAlpha = clamp(halo * 0.55, 0.0, 1.0);
  float total = innerAlpha + haloAlpha * (1.0 - innerAlpha);
  vec3 mixed = (inner * innerAlpha + haloColor * haloAlpha * (1.0 - innerAlpha)) / max(total, 0.0001);
  gl_FragColor = vec4(mixed, clamp(total, 0.0, 1.0));
}
`;

function createPortal(
  root: HTMLDivElement,
  settingsRef: { current: Settings },
): Controller | null {
  const doc = root.ownerDocument;
  const view = doc.defaultView ?? window;
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      premultipliedAlpha: false,
      powerPreference: "high-performance",
    });
  } catch {
    return null;
  }
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
  root.appendChild(canvas);

  const settings = () => settingsRef.current;
  const uniforms = {
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uPrimaryColor: { value: new THREE.Vector3() },
    uSecondaryColor: { value: new THREE.Vector3() },
    uCenterColor: { value: new THREE.Vector3() },
    uDensity: { value: 1 },
    uLayerCount: { value: 7 },
    uWaveAmplitude: { value: 1 },
    uWaveFrequency: { value: 0.75 },
    uVerticalDistortion: { value: 0.5 },
    uDepthIntensity: { value: 0.75 },
    uBrightness: { value: 1 },
    uScale: { value: 1.5 },
    uBallBgColor: { value: new THREE.Vector3() },
    uBallBgAlpha: { value: 0 },
    uMode: { value: 0 },
    uFlowAngle: { value: 0 },
    uStretch: { value: 1 },
    uSize: { value: 1 },
    uVariety: { value: 0.6 },
    uRimWidth: { value: 1 },
    uRimGlow: { value: 1 },
    uBoost: { value: 0 },
    uLook: { value: new THREE.Vector2() },
    uOpen: { value: 1 },
    uPixel: { value: 0.002 },
  };
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    transparent: false,
    blending: THREE.NoBlending,
    depthTest: false,
    depthWrite: false,
  });
  const geometry = new THREE.PlaneGeometry(2, 2);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.frustumCulled = false;
  const scene = new THREE.Scene();
  scene.add(mesh);
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  let width = 0;
  let height = 0;
  let sized = false;
  let colorKey = "";
  let backgroundAt = -10;
  let clock = 0;
  let boost = 0;
  let lookX = 0;
  let lookY = 0;
  let lookTargetX = 0;
  let lookTargetY = 0;
  let introStart = -1;
  let open = 1;
  let openVelocity = 0;
  let raf = 0;
  let last = 0;
  let visible = false;
  let destroyed = false;
  let lost = false;
  let press: { id: number; x: number; y: number; time: number } | null = null;

  const pageIsLight = () => {
    let node: HTMLElement | null = root.parentElement;
    while (node) {
      const match = view.getComputedStyle(node).backgroundColor.match(/rgba?\(([^)]+)\)/);
      if (match) {
        const parts = match[1].split(",").map((part) => Number.parseFloat(part));
        if (parts.length < 4 || parts[3] > 0.05)
          return 0.2126 * parts[0] + 0.7152 * parts[1] + 0.0722 * parts[2] > 140;
      }
      node = node.parentElement;
    }
    return !view.matchMedia("(prefers-color-scheme: dark)").matches;
  };

  const syncColors = () => {
    const s = settings();
    const light = s.ballBgColor.trim().toLowerCase() === "auto" ? pageIsLight() : false;
    const key = [s.primaryColor, s.secondaryColor, s.centerColor, s.ballBgColor, light].join("|");
    if (key === colorKey) return;
    colorKey = key;
    const [primary] = readColor(s.primaryColor, "#C084FC");
    const [secondary] = readColor(s.secondaryColor, "#E879F9");
    const [center] = readColor(s.centerColor, "#F0ABFC");
    uniforms.uPrimaryColor.value.copy(primary);
    uniforms.uSecondaryColor.value.copy(secondary);
    uniforms.uCenterColor.value.copy(center);
    if (s.ballBgColor.trim().toLowerCase() === "auto") {
      if (light) {
        uniforms.uBallBgColor.value.set(
          0.035 + primary.x * 0.04,
          0.03 + primary.y * 0.03,
          0.06 + primary.z * 0.06,
        );
        uniforms.uBallBgAlpha.value = 1;
      } else {
        uniforms.uBallBgAlpha.value = 0;
      }
    } else {
      const [ball, alpha] = readColor(s.ballBgColor, "#000000");
      uniforms.uBallBgColor.value.copy(ball);
      uniforms.uBallBgAlpha.value = alpha;
    }
  };

  const readSize = () => {
    const s = settings();
    const nextWidth = Math.round(root.clientWidth);
    const nextHeight = Math.round(root.clientHeight);
    if (nextWidth < 2 || nextHeight < 2) {
      sized = false;
      return false;
    }
    const ratio = Math.min(view.devicePixelRatio || 1, clamp(finite(s.dpr, 2), 0.5, 3));
    if (sized && nextWidth === width && nextHeight === height && renderer.getPixelRatio() === ratio)
      return false;
    sized = true;
    width = nextWidth;
    height = nextHeight;
    renderer.setPixelRatio(ratio);
    renderer.setSize(width, height, false);
    uniforms.uResolution.value.set(width, height);
    return true;
  };

  const render = () => {
    if (!sized) return;
    const s = settings();
    if (performance.now() - backgroundAt > 1000) {
      backgroundAt = performance.now();
      syncColors();
    }
    const scale = clamp(finite(s.scale, 1.5), 0.2, 5);
    uniforms.uTime.value = clock;
    uniforms.uDensity.value = clamp(finite(s.density, 1), 0.2, 4);
    uniforms.uLayerCount.value = clamp(Math.round(finite(s.layerCount, 7)), 1, 7);
    uniforms.uWaveAmplitude.value = clamp(finite(s.waveAmplitude, 1), 0, 4);
    uniforms.uWaveFrequency.value = clamp(finite(s.waveFrequency, 0.75), 0, 4);
    uniforms.uVerticalDistortion.value = clamp(finite(s.verticalDistortion, 0.5), 0, 3);
    uniforms.uDepthIntensity.value = clamp(finite(s.depthIntensity, 0.75), 0, 3);
    uniforms.uBrightness.value = clamp(finite(s.brightness, 1), 0, 4);
    uniforms.uScale.value = scale;
    uniforms.uMode.value = MODES[s.mode] ?? 0;
    uniforms.uFlowAngle.value = (finite(s.flowAngle, 0) * Math.PI) / 180 + lookY * 0.35;
    uniforms.uStretch.value = clamp(finite(s.streakLength, 1), 0.2, 4) * (1 + boost * 0.8);
    uniforms.uSize.value = clamp(finite(s.particleSize, 1), 0.2, 4);
    uniforms.uVariety.value = clamp(finite(s.colorVariety, 0.6), 0, 1);
    uniforms.uRimWidth.value = clamp(finite(s.rimWidth, 1), 0.2, 6);
    uniforms.uRimGlow.value = clamp(finite(s.rimGlow, 1), 0, 4);
    uniforms.uBoost.value = boost;
    uniforms.uLook.value.set(lookX, lookY);
    uniforms.uOpen.value = open;
    uniforms.uPixel.value = 2 / Math.max(height * scale, 1);
    renderer.render(scene, camera);
  };

  const schedule = () => {
    if (destroyed || lost || !visible || raf) return;
    raf = requestAnimationFrame(frame);
  };

  const frame = (now: number) => {
    raf = 0;
    if (destroyed || lost) return;
    const s = settings();
    const dt =
      last && now - last < 100 ? Math.min(Math.max((now - last) / 1000, 0), 0.05) : 1 / 60;
    last = now;
    const moving = !s.reduced && !s.paused;
    if (moving) {
      clock += dt * clamp(finite(s.speed, 0.25), 0, 5) * (1 + boost * 4);
      boost *= Math.exp(-dt / 0.9);
      if (boost < 0.001) boost = 0;
    }
    const follow = s.reduced ? 1 : 1 - Math.exp(-dt / 0.4);
    lookX += (lookTargetX - lookX) * follow;
    lookY += (lookTargetY - lookY) * follow;
    if (s.intro && !s.reduced) {
      if (introStart < 0) introStart = now;
      openVelocity += (-55 * (open - 1) - 8.5 * openVelocity) * dt;
      open += openVelocity * dt;
    } else {
      open = 1;
      openVelocity = 0;
    }
    render();
    const settling =
      Math.abs(lookTargetX - lookX) + Math.abs(lookTargetY - lookY) > 0.0005 ||
      Math.abs(open - 1) + Math.abs(openVelocity) > 0.0005 ||
      boost > 0;
    if ((moving || settling) && !doc.hidden) raf = requestAnimationFrame(frame);
    else last = 0;
  };

  const addBoost = (strength: number) => {
    boost = Math.min(boost + strength, 3);
  };

  const onPointerDown = (event: PointerEvent) => {
    if (!event.isPrimary) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    press = { id: event.pointerId, x: event.clientX, y: event.clientY, time: performance.now() };
  };

  const onPointerUp = (event: PointerEvent) => {
    const current = press;
    press = null;
    if (!current || current.id !== event.pointerId) return;
    if (Math.hypot(event.clientX - current.x, event.clientY - current.y) > 10) return;
    if (performance.now() - current.time > 600) return;
    const s = settings();
    if (!s.interactive || s.reduced || s.paused) return;
    addBoost(clamp(finite(s.boostStrength, 1), 0, 3));
    schedule();
  };

  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    const s = settings();
    const box = root.getBoundingClientRect();
    if (box.width <= 0 || box.height <= 0) return;
    const amount = clamp(finite(s.hoverTilt, 1), 0, 3);
    lookTargetX = clamp(((event.clientX - box.left) / box.width - 0.5) * 2, -1, 1) * amount;
    lookTargetY = clamp((0.5 - (event.clientY - box.top) / box.height) * 2, -1, 1) * amount;
    schedule();
  };

  const onPointerLeave = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    lookTargetX = 0;
    lookTargetY = 0;
    schedule();
  };

  const onPointerCancel = () => {
    press = null;
  };

  const onVisibility = () => {
    last = 0;
    schedule();
  };

  const onLost = (event: Event) => {
    event.preventDefault();
    lost = true;
    cancelAnimationFrame(raf);
    raf = 0;
  };

  const onRestored = () => {
    lost = false;
    colorKey = "";
    schedule();
  };

  const resizeObserver = new ResizeObserver(() => {
    if (readSize()) {
      render();
      schedule();
    }
  });

  const intersection = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      last = 0;
      schedule();
    },
    { rootMargin: "120px" },
  );

  root.addEventListener("pointerdown", onPointerDown);
  root.addEventListener("pointerup", onPointerUp);
  root.addEventListener("pointermove", onPointerMove);
  root.addEventListener("pointerleave", onPointerLeave);
  root.addEventListener("pointercancel", onPointerCancel);
  doc.addEventListener("visibilitychange", onVisibility);
  canvas.addEventListener("webglcontextlost", onLost);
  canvas.addEventListener("webglcontextrestored", onRestored);
  resizeObserver.observe(root);
  intersection.observe(root);
  if (settings().intro && !settings().reduced) open = 0.02;
  clock = settings().reduced ? 4 : 0;
  readSize();

  return {
    sync: () => {
      backgroundAt = -10;
      readSize();
      last = 0;
      if (!raf && visible) {
        render();
        schedule();
      }
    },
    boost: (strength) => {
      const s = settings();
      if (s.reduced) return;
      addBoost(clamp(finite(strength ?? s.boostStrength, 1), 0, 3));
      schedule();
    },
    destroy: () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersection.disconnect();
      root.removeEventListener("pointerdown", onPointerDown);
      root.removeEventListener("pointerup", onPointerUp);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerleave", onPointerLeave);
      root.removeEventListener("pointercancel", onPointerCancel);
      doc.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      scene.remove(mesh);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      canvas.remove();
    },
  };
}

export const Portal = forwardRef<PortalHandle, PortalProps>(function Portal(
  {
    className,
    style,
    primaryColor = "#C084FC",
    secondaryColor = "#E879F9",
    centerColor = "#F0ABFC",
    ballBgColor = "auto",
    mode = "streaks",
    speed = 0.25,
    density = 1,
    layerCount = 7,
    particleSize = 1,
    streakLength = 1,
    flowAngle = 0,
    colorVariety = 0.6,
    waveAmplitude = 1,
    waveFrequency = 0.75,
    verticalDistortion = 0.5,
    depthIntensity = 0.75,
    brightness = 1,
    scale = 1.5,
    rimWidth = 1,
    rimGlow = 1,
    hoverTilt = 1,
    interactive = true,
    boostStrength = 1,
    intro = true,
    paused = false,
    dpr = 2,
  },
  ref,
) {
  const rootRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<Controller | null>(null);
  const reduced = useSyncExternalStore(subscribeToMotion, readMotion, () => false);

  const settings: Settings = {
    primaryColor,
    secondaryColor,
    centerColor,
    ballBgColor,
    mode,
    speed,
    density,
    layerCount,
    particleSize,
    streakLength,
    flowAngle,
    colorVariety,
    waveAmplitude,
    waveFrequency,
    verticalDistortion,
    depthIntensity,
    brightness,
    scale,
    rimWidth,
    rimGlow,
    hoverTilt,
    interactive,
    boostStrength,
    intro,
    paused,
    dpr,
    reduced,
  };
  const settingsRef = useRef(settings);

  useEffect(() => {
    settingsRef.current = settings;
    controllerRef.current?.sync();
  });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const controller = createPortal(root, settingsRef);
    controllerRef.current = controller;
    return () => {
      controller?.destroy();
      controllerRef.current = null;
    };
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      boost: (strength?: number) => controllerRef.current?.boost(strength),
    }),
    [],
  );

  return <div ref={rootRef} className={cn("absolute inset-0", className)} style={style} />;
});

Portal.displayName = "Portal";

export default Portal;
