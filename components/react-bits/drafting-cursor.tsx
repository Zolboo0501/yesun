"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

export type DraftingCursorMarker = "dot" | "ring" | "square" | "cross" | "none";
export type DraftingCursorLineStyle = "solid" | "dashed" | "dotted";
export type DraftingCursorUnits = "px" | "percent" | "normalized";
export type DraftingCursorOrigin = "top-left" | "center" | "bottom-left";
export type DraftingCursorChip = "ink" | "accent" | "subtle";
export type DraftingCursorRulers = "hover" | "always" | "none";

export interface DraftingCursorMeasurement {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  dx: number;
  dy: number;
  length: number;
  angle: number;
}

export interface DraftingCursorPin {
  x: number;
  y: number;
}

export interface DraftingCursorProps {
  color?: string;
  accentColor?: string;
  lineWidth?: number;
  lineStyle?: DraftingCursorLineStyle;
  lineOpacity?: number;
  gap?: number;
  edgeFade?: number;
  marker?: DraftingCursorMarker;
  markerSize?: number;
  showCoordinates?: boolean;
  label?: string;
  units?: DraftingCursorUnits;
  origin?: DraftingCursorOrigin;
  chip?: DraftingCursorChip;
  fontFamily?: string;
  rulers?: DraftingCursorRulers;
  rulerSize?: number;
  tickSpacing?: number;
  grid?: number;
  snap?: boolean;
  smoothing?: number;
  measure?: boolean;
  measureHold?: number;
  pins?: boolean;
  maxPins?: number;
  pinLife?: number;
  intro?: boolean;
  introDuration?: number;
  autoplay?: boolean;
  autoplaySpeed?: number;
  idleDelay?: number;
  hideCursor?: boolean;
  interactive?: boolean;
  disabled?: boolean;
  formatCoordinates?: (x: number, y: number) => string;
  onMeasure?: (measurement: DraftingCursorMeasurement) => void;
  onPin?: (pin: DraftingCursorPin) => void;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export interface DraftingCursorHandle {
  measure: (x1: number, y1: number, x2: number, y2: number) => void;
  pin: (x: number, y: number) => void;
  clearPins: () => void;
  replay: () => void;
}

type Callbacks = "formatCoordinates" | "onMeasure" | "onPin";

type Settings = Required<Omit<DraftingCursorProps, "className" | "style" | "children" | Callbacks>> &
  Pick<DraftingCursorProps, Callbacks> & { reduced: boolean };

interface Rgb {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface Measure {
  ax: number;
  ay: number;
  bx: number;
  by: number;
  born: number;
  grow: number;
  released: number;
  hold: number;
}

interface Pin {
  x: number;
  y: number;
  text: string;
  born: number;
  dieAt: number;
}

interface Part {
  text: string;
  dim: boolean;
  width: number;
}

interface Box {
  w: number;
  h: number;
  pad: number;
}

interface Controller {
  sync: () => void;
  measure: (x1: number, y1: number, x2: number, y2: number) => void;
  pin: (x: number, y: number) => void;
  clearPins: () => void;
  replay: () => void;
  destroy: () => void;
}

type Mode = "none" | "pointer" | "ghost";
type Channel = "presence" | "marker" | "press" | "hover" | "chip" | "sideX" | "sideY";

const TAU = Math.PI * 2;
const SUBSTEP = 1 / 240;
const CHIP_TEXT = 11;
const NOTE_TEXT = 10;
const RULER_TEXT = 9;
const MONO = 'ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace';
const INTERACTIVE =
  'a[href],button:not(:disabled),[role="button"],[role="link"],[role="tab"],[role="menuitem"],[role="option"],[role="switch"],[role="checkbox"],input[type="button"],input[type="submit"],input[type="reset"],input[type="checkbox"],input[type="radio"],input[type="range"],input[type="color"],input[type="file"],label[for],select,summary,[data-cursor="pointer"]';
const TEXTUAL =
  'input:not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="color"]):not([type="file"]):not([type="image"]):not([type="hidden"]),textarea,[contenteditable]:not([contenteditable="false"]),[data-cursor="native"]';
const ACTIONS = ["measure", "pin", "none", "measure", "pin", "pin"] as const;
const DARK: Rgb = { r: 10, g: 10, b: 10, a: 1 };
const LIGHT: Rgb = { r: 255, g: 255, b: 255, a: 1 };

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const finite = (value: number, fallback: number) => (Number.isFinite(value) ? value : fallback);

const smooth = (t: number) => {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
};

const easeOut = (t: number) => 1 - Math.pow(1 - clamp(t, 0, 1), 4);

const easeIn = (t: number) => Math.pow(clamp(t, 0, 1), 3);

const easeInOut = (t: number) => {
  const x = clamp(t, 0, 1);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(2 - 2 * x, 3) / 2;
};

const backOut = (t: number) => {
  const x = clamp(t, 0, 1) - 1;
  return 1 + 2.2 * x * x * x + 1.2 * x * x;
};

const createRandom = (seed: number) => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const formatNumber = (value: number, digits: number) => {
  const text = value.toFixed(digits);
  return /^-0(\.0+)?$/.test(text) ? text.slice(1) : text;
};

const spring = new Float64Array(2);

const step = (value: number, velocity: number, target: number, omega: number, zeta: number, dt: number) => {
  let v = velocity;
  let x = value;
  let remaining = dt;
  while (remaining > 1e-6) {
    const h = Math.min(SUBSTEP, remaining);
    remaining -= h;
    v += (omega * omega * (target - x) - 2 * zeta * omega * v) * h;
    x += v * h;
  }
  spring[0] = x;
  spring[1] = v;
};

let probe: CanvasRenderingContext2D | null = null;

const readColor = (value: string, fallback: Rgb): Rgb => {
  if (typeof document === "undefined" || !value) return fallback;
  if (typeof CSS !== "undefined" && typeof CSS.supports === "function" && !CSS.supports("color", value)) return fallback;
  if (!probe) {
    const surface = document.createElement("canvas");
    surface.width = 1;
    surface.height = 1;
    probe = surface.getContext("2d", { willReadFrequently: true });
  }
  if (!probe) return fallback;
  probe.clearRect(0, 0, 1, 1);
  probe.fillStyle = "#000";
  probe.fillStyle = value;
  probe.fillRect(0, 0, 1, 1);
  const data = probe.getImageData(0, 0, 1, 1).data;
  return { r: data[0], g: data[1], b: data[2], a: data[3] / 255 };
};

const rgba = (color: Rgb, alpha = 1) =>
  `rgba(${color.r},${color.g},${color.b},${clamp(color.a * alpha, 0, 1).toFixed(3)})`;

const channel = (value: number) => {
  const s = value / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
};

const legible = (color: Rgb) =>
  0.2126 * channel(color.r) + 0.7152 * channel(color.g) + 0.0722 * channel(color.b) > 0.36 ? DARK : LIGHT;

const roundedRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  const radius = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
};

const scopeStyles = (scope: string) => {
  const base = `[data-drafting-cursor="${scope}"]`;
  const active = `${base}[data-active]`;
  return `${active},${active} *{cursor:none!important}${active} :is(${TEXTUAL}),${active} :is(${TEXTUAL}) *{cursor:auto!important}${base}[data-measuring],${base}[data-measuring] *{-webkit-user-select:none!important;user-select:none!important}`;
};

const subscribeToMotion = (notify: () => void) => {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
};

const readMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const createDraftingCursor = (
  root: HTMLElement,
  canvas: HTMLCanvasElement,
  settingsRef: { current: Settings },
): Controller => {
  const surface = canvas.getContext("2d");
  if (!surface) {
    const idle = () => undefined;
    return { sync: idle, measure: idle, pin: idle, clearPins: idle, replay: idle, destroy: idle };
  }
  const ctx = surface;
  const doc = root.ownerDocument;
  const view = doc.defaultView ?? window;
  const fine = view.matchMedia("(pointer: fine)");
  const random = createRandom(0x51ab3d);
  const now = () => performance.now() / 1000;
  const S = () => settingsRef.current;

  let raf = 0;
  let timer = 0;
  let last = 0;
  let destroyed = false;
  let visible = true;
  let blank = true;
  let mode: Mode = "none";
  let entries = 0;
  let width = 1;
  let height = 1;
  let wx = 0;
  let wy = 0;
  let ww = 0;
  let wh = 0;
  let dpr = 1;
  let inkSource = "";
  let accentSource = "";
  let ink: Rgb = { r: 23, g: 23, b: 23, a: 1 };
  let accent: Rgb = { r: 123, g: 92, b: 255, a: 1 };
  let tint = 0;
  let textual = false;
  let hovering = false;
  let tagText = "";
  let introAt = -1;
  let live: Measure | null = null;
  let activeState = false;
  let pressed = false;
  let wantX = 1;
  let wantY = 1;
  let freshChip = true;
  let catching = false;
  let gradientKey = "";
  let fadeX: CanvasGradient | null = null;
  let fadeY: CanvasGradient | null = null;

  const pointer = { x: 0, y: 0, clientX: 0, clientY: 0, inside: false, seen: false, leftAt: -1e9 };
  const cursor = { x: 0, y: 0, vx: 0, vy: 0 };
  const ghost = { x: 0, y: 0, placed: false };
  const look: Record<Channel | `${Channel}V`, number> = {
    presence: 0,
    presenceV: 0,
    marker: 0,
    markerV: 0,
    press: 0,
    pressV: 0,
    hover: 0,
    hoverV: 0,
    chip: 1,
    chipV: 0,
    sideX: 1,
    sideXV: 0,
    sideY: 1,
    sideYV: 0,
  };
  const reach = { from: 0, to: 0, t0: 0, duration: 0, value: 0 };
  const drag = { pressing: false, armed: false, captured: false, x: 0, y: 0, at: 0, id: -1, shift: false };
  const measures: Measure[] = [];
  const pins: Pin[] = [];
  const agent = {
    phase: "idle" as "idle" | "travel" | "dwell" | "press",
    t0: 0,
    duration: 1,
    from: { x: 0, y: 0 },
    c1: { x: 0, y: 0 },
    c2: { x: 0, y: 0 },
    to: { x: 0, y: 0 },
    until: 0,
    releaseAt: 0,
    turn: 0,
    action: 0,
    drawing: null as Measure | null,
    pinning: false,
  };

  const devX = (x: number) => Math.round((x - wx) * dpr) / dpr + wx;
  const devY = (y: number) => Math.round((y - wy) * dpr) / dpr + wy;
  const startX = (x: number, thick: number) => Math.round((x - wx) * dpr - thick / 2) / dpr + wx;
  const startY = (y: number, thick: number) => Math.round((y - wy) * dpr - thick / 2) / dpr + wy;
  const hairline = (scale = 1) => Math.max(1, Math.round(clamp(finite(S().lineWidth, 1), 0.5, 6) * scale * dpr));
  const band = () => (S().rulers === "none" ? 0 : clamp(finite(S().rulerSize, 20), 12, 48));
  const font = (size: number, weight = 500) => `${weight} ${size}px ${S().fontFamily?.trim() || MONO}`;
  const holdTime = () => {
    const hold = S().measureHold;
    return typeof hold !== "number" || Number.isNaN(hold) ? 2.5 : Math.max(0, hold);
  };

  const layout = () => {
    const rect = root.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    const nextW = Math.max(1, Math.ceil(Math.min(width, Math.max(1, view.innerWidth))));
    const nextH = Math.max(1, Math.ceil(Math.min(height, Math.max(1, view.innerHeight))));
    const nextX = Math.floor(clamp(-rect.left, 0, Math.max(0, width - nextW)));
    const nextY = Math.floor(clamp(-rect.top, 0, Math.max(0, height - nextH)));
    const nextDpr = clamp(view.devicePixelRatio || 1, 1, 2);
    const resized = nextW !== ww || nextH !== wh || nextDpr !== dpr;
    const moved = nextX !== wx || nextY !== wy;
    ww = nextW;
    wh = nextH;
    wx = nextX;
    wy = nextY;
    dpr = nextDpr;
    if (resized) {
      canvas.width = Math.max(1, Math.round(ww * dpr));
      canvas.height = Math.max(1, Math.round(wh * dpr));
      canvas.style.width = `${ww}px`;
      canvas.style.height = `${wh}px`;
      gradientKey = "";
      blank = true;
    }
    if (resized || moved) canvas.style.transform = `translate3d(${wx}px, ${wy}px, 0)`;
    return resized || moved;
  };

  const colours = () => {
    const s = S();
    let computed = "";
    const pick = (value: string) => {
      const trimmed = (value ?? "").trim();
      if (trimmed && trimmed.toLowerCase() !== "currentcolor") return trimmed;
      if (!computed) computed = view.getComputedStyle(root).color;
      return computed;
    };
    const inkValue = pick(s.color);
    if (inkValue !== inkSource) {
      inkSource = inkValue;
      ink = readColor(inkValue, ink);
      gradientKey = "";
    }
    const accentValue = pick(s.accentColor);
    if (accentValue !== accentSource) {
      accentSource = accentValue;
      accent = readColor(accentValue, accent);
    }
  };

  const followable = () => {
    const s = S();
    return s.interactive && !s.disabled && fine.matches;
  };

  const setActive = (active: boolean) => {
    if (active === activeState) return;
    activeState = active;
    if (active) root.setAttribute("data-active", "");
    else root.removeAttribute("data-active");
  };

  const refreshActive = () => setActive(followable() && pointer.inside && S().hideCursor);

  const inspect = (target: EventTarget | null) => {
    const element = target && (target as Node).nodeType === 1 ? (target as Element) : null;
    const text = element?.closest(TEXTUAL);
    textual = !!text && root.contains(text);
    const hit = element?.closest(INTERACTIVE);
    hovering = !!hit && root.contains(hit);
    const tagged = element?.closest("[data-cursor-label]");
    tagText = tagged && root.contains(tagged) ? (tagged.getAttribute("data-cursor-label") ?? "") : "";
  };

  const frameOrigin = () => {
    const origin = S().origin;
    return {
      ox: origin === "center" ? width / 2 : 0,
      oy: origin === "center" ? height / 2 : origin === "bottom-left" ? height : 0,
      up: origin === "center" || origin === "bottom-left",
    };
  };

  const convert = (x: number, y: number): [number, number] => {
    const { ox, oy, up } = frameOrigin();
    let cx = x - ox;
    let cy = up ? oy - y : y - oy;
    const units = S().units;
    if (units === "percent") {
      cx = (cx / width) * 100;
      cy = (cy / height) * 100;
    } else if (units === "normalized") {
      cx /= width;
      cy /= height;
    }
    return [cx, cy];
  };

  const places = () => (S().units === "percent" ? 1 : S().units === "normalized" ? 3 : 0);

  const suffix = () => (S().units === "percent" ? "%" : "");

  const custom = (x: number, y: number) => {
    const format = S().formatCoordinates;
    if (!format) return null;
    try {
      return String(format(x, y));
    } catch {
      return null;
    }
  };

  const pinText = (x: number, y: number) => {
    const [cx, cy] = convert(x, y);
    const text = custom(cx, cy);
    if (text !== null) return text;
    const digits = places();
    const unit = suffix();
    return `${formatNumber(cx, digits)}${unit}, ${formatNumber(cy, digits)}${unit}`;
  };

  const rulerScale = (extent: number) => {
    const s = S();
    if (s.units !== "percent" && s.units !== "normalized") {
      const spacing = clamp(finite(s.tickSpacing, 10), 4, 400);
      return { spacing, value: spacing };
    }
    let percent = 1;
    while ((extent * percent) / 100 < 5 && percent < 50) percent = percent === 1 ? 2 : percent === 2 ? 5 : percent * 2;
    return { spacing: (extent * percent) / 100, value: percent };
  };

  const rulerText = (amount: number) =>
    S().units === "normalized"
      ? formatNumber(amount / 100, Math.abs(amount) % 10 === 0 ? 1 : 2)
      : formatNumber(amount, 0);

  const snapped = (x: number, y: number): [number, number] => {
    const s = S();
    if (!s.snap) return [x, y];
    const { ox, oy } = frameOrigin();
    const grid = finite(s.grid, 0);
    const sx = grid >= 4 ? grid : rulerScale(width).spacing;
    const sy = grid >= 4 ? grid : rulerScale(height).spacing;
    return [
      clamp(ox + Math.round((x - ox) / sx) * sx, 0, width),
      clamp(oy + Math.round((y - oy) / sy) * sy, 0, height),
    ];
  };

  const aim = (): [number, number] => {
    const x = clamp(pointer.x, 0, width);
    const y = clamp(pointer.y, 0, height);
    if (live && drag.shift) {
      const dx = x - live.ax;
      const dy = y - live.ay;
      const angle = Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) * (Math.PI / 4);
      const along = dx * Math.cos(angle) + dy * Math.sin(angle);
      return [
        clamp(live.ax + Math.cos(angle) * along, 0, width),
        clamp(live.ay + Math.sin(angle) * along, 0, height),
      ];
    }
    return snapped(x, y);
  };

  const zone = () => {
    const size = band();
    const mx = Math.min(ww / 2, Math.max(size + 40, ww * 0.14));
    const my = Math.min(wh / 2, Math.max(size + 40, wh * 0.16));
    return { x0: wx + mx, x1: wx + Math.max(mx, ww - mx), y0: wy + my, y1: wy + Math.max(my, wh - my) };
  };

  const summarize = (m: Measure): DraftingCursorMeasurement => {
    const dx = m.bx - m.ax;
    const dy = m.by - m.ay;
    return {
      x1: m.ax,
      y1: m.ay,
      x2: m.bx,
      y2: m.by,
      dx,
      dy,
      length: Math.hypot(dx, dy),
      angle: (Math.atan2(dy, dx) * 180) / Math.PI,
    };
  };

  const beginMeasure = (m: Measure, time: number) => {
    for (const other of measures) {
      if (other.released < 0 || other.released > time) other.released = time;
      other.hold = Math.min(other.hold, Math.max(0, time - other.released));
    }
    measures.push(m);
    while (measures.length > 4) measures.shift();
  };

  const dropPin = (x: number, y: number, time: number, notify: boolean) => {
    const s = S();
    const life = s.pinLife;
    pins.push({
      x,
      y,
      text: pinText(x, y),
      born: time,
      dieAt: typeof life === "number" && Number.isFinite(life) && life > 0 ? time + life : 0,
    });
    const limit = Math.max(1, Math.round(finite(s.maxPins, 4)));
    const alive = pins.filter((pin) => pin.dieAt === 0 || pin.dieAt > time);
    for (let i = 0; i < alive.length - limit; i++) alive[i].dieAt = time;
    if (notify) s.onPin?.({ x, y });
  };

  const animate = (key: Channel, target: number, omega: number, zeta: number, dt: number, instant: boolean) => {
    const velocity = `${key}V` as const;
    if (instant) {
      look[key] = target;
      look[velocity] = 0;
      return true;
    }
    step(look[key], look[velocity], target, omega, zeta, dt);
    look[key] = spring[0];
    look[velocity] = spring[1];
    if (Math.abs(look[key] - target) < 1e-3 && Math.abs(look[velocity]) < 1e-3) {
      look[key] = target;
      look[velocity] = 0;
      return true;
    }
    return false;
  };

  const extend = (x: number, y: number, time: number) => {
    const s = S();
    if (reach.value < 0.02 || look.presence < 0.05) {
      cursor.x = x;
      cursor.y = y;
      cursor.vx = 0;
      cursor.vy = 0;
      reach.value = 0;
      look.marker = 0;
      look.markerV = 0;
      wantX = 1;
      wantY = 1;
      freshChip = true;
      catching = false;
    } else {
      catching = true;
    }
    const quick = s.reduced || !s.intro;
    reach.from = reach.value;
    reach.to = 1;
    reach.t0 = time;
    reach.duration = quick
      ? 0
      : Math.max(0.05, finite(s.introDuration, 0.7)) * (entries === 0 ? 1 : 0.62) * (1 - reach.value);
    entries += 1;
  };

  const retract = (time: number) => {
    const s = S();
    reach.from = reach.value;
    reach.t0 = time;
    if (s.reduced || !s.intro) {
      reach.to = reach.value;
      reach.duration = 0;
      return;
    }
    reach.to = 0;
    reach.duration = 0.36 * Math.max(0.25, reach.value);
  };

  const releaseGhost = (time: number) => {
    if (agent.drawing) {
      agent.drawing.released = time;
      agent.drawing = null;
    }
    agent.pinning = false;
    agent.phase = "idle";
    pressed = drag.pressing;
  };

  const decide = (time: number): Mode => {
    const s = S();
    if (s.disabled) return "none";
    if (followable() && pointer.inside) return "pointer";
    if (!s.autoplay || s.reduced) return "none";
    if (followable() && pointer.seen && time - pointer.leftAt < Math.max(0, finite(s.idleDelay, 1.5))) return "none";
    return "ghost";
  };

  const switchMode = (next: Mode, time: number) => {
    const s = S();
    const previous = mode;
    mode = next;
    if (previous === "ghost") releaseGhost(time);
    if (next === "none") {
      retract(time);
      return;
    }
    if (next === "pointer") {
      const [x, y] = aim();
      extend(x, y, time);
      return;
    }
    const area = zone();
    const start = ghost.placed || entries > 0
      ? { x: clamp(cursor.x, area.x0, area.x1), y: clamp(cursor.y, area.y0, area.y1) }
      : { x: area.x0 + (area.x1 - area.x0) * 0.34, y: area.y0 + (area.y1 - area.y0) * 0.38 };
    ghost.x = start.x;
    ghost.y = start.y;
    ghost.placed = true;
    agent.phase = "dwell";
    agent.until = time + (s.intro ? Math.max(0.3, finite(s.introDuration, 0.7) * 0.9) : 0.3);
    agent.drawing = null;
    agent.pinning = false;
    const [x, y] = snapped(start.x, start.y);
    extend(x, y, time);
  };

  const travel = (x: number, y: number, duration: number, bendScale: number) => {
    const fx = ghost.x;
    const fy = ghost.y;
    const dx = x - fx;
    const dy = y - fy;
    const distance = Math.hypot(dx, dy);
    agent.from = { x: fx, y: fy };
    agent.to = { x, y };
    if (distance < 1) {
      agent.c1 = { x: fx, y: fy };
      agent.c2 = { x, y };
    } else {
      const nx = -dy / distance;
      const ny = dx / distance;
      const bend = (random() - 0.5) * bendScale * distance;
      agent.c1 = { x: fx + dx * 0.3 + nx * bend, y: fy + dy * 0.3 + ny * bend };
      agent.c2 = { x: fx + dx * 0.74 + nx * bend * 0.55, y: fy + dy * 0.74 + ny * bend * 0.55 };
    }
    agent.t0 = now();
    agent.duration = Math.max(0.05, duration);
    agent.phase = "travel";
  };

  const bezier = (t: number) => {
    const u = 1 - t;
    const a = u * u * u;
    const b = 3 * u * u * t;
    const c = 3 * u * t * t;
    const d = t * t * t;
    return {
      x: a * agent.from.x + b * agent.c1.x + c * agent.c2.x + d * agent.to.x,
      y: a * agent.from.y + b * agent.c1.y + c * agent.c2.y + d * agent.to.y,
    };
  };

  const chooseTravel = () => {
    const area = zone();
    const reachMin = 0.24 * Math.min(ww, wh);
    let best = { x: (area.x0 + area.x1) / 2, y: (area.y0 + area.y1) / 2 };
    let bestDistance = -1;
    for (let i = 0; i < 10; i++) {
      const x = area.x0 + (area.x1 - area.x0) * random();
      const y = area.y0 + (area.y1 - area.y0) * random();
      const distance = Math.hypot(x - ghost.x, y - ghost.y);
      if (distance >= reachMin && distance <= reachMin * 3.4) return { x, y };
      if (distance > bestDistance) {
        bestDistance = distance;
        best = { x, y };
      }
    }
    return best;
  };

  const startGhostMeasure = (time: number, speed: number) => {
    const area = zone();
    const [ax, ay] = snapped(ghost.x, ghost.y);
    const length = (0.42 + random() * 0.24) * Math.min(ww, wh);
    const angle = ((24 + random() * 34) * Math.PI) / 180;
    const first = Math.floor(random() * 4);
    let bx = ax;
    let by = ay;
    let found = false;
    for (let i = 0; i < 4 && !found; i++) {
      const quadrant = (first + i) % 4;
      const sx = quadrant % 2 === 0 ? 1 : -1;
      const sy = quadrant < 2 ? 1 : -1;
      const x = ax + sx * Math.cos(angle) * length;
      const y = ay + sy * Math.sin(angle) * length;
      if (x >= area.x0 && x <= area.x1 && y >= area.y0 && y <= area.y1) {
        bx = x;
        by = y;
        found = true;
      }
    }
    if (!found) {
      const sx = ax < (area.x0 + area.x1) / 2 ? 1 : -1;
      const sy = ay < (area.y0 + area.y1) / 2 ? 1 : -1;
      bx = clamp(ax + sx * Math.cos(angle) * length, area.x0, area.x1);
      by = clamp(ay + sy * Math.sin(angle) * length, area.y0, area.y1);
    }
    const m: Measure = { ax, ay, bx: ax, by: ay, born: time, grow: 0, released: -1, hold: holdTime() };
    beginMeasure(m, time);
    agent.drawing = m;
    pressed = true;
    travel(bx, by, clamp(0.8 + Math.hypot(bx - ax, by - ay) / 650, 0.9, 1.6) / speed, 0.12);
  };

  const runAgent = (time: number) => {
    const s = S();
    const speed = clamp(finite(s.autoplaySpeed, 1), 0.2, 4);
    if (agent.phase === "travel") {
      const u = clamp((time - agent.t0) / agent.duration, 0, 1);
      const point = bezier(easeInOut(u));
      ghost.x = point.x;
      ghost.y = point.y;
      if (u < 1) return;
      if (agent.drawing) {
        [agent.drawing.bx, agent.drawing.by] = snapped(ghost.x, ghost.y);
        agent.drawing.released = time;
        agent.drawing = null;
        pressed = false;
        agent.until = time + 1.2 / speed;
      } else {
        agent.until = time + (0.28 + random() * 0.42) / speed;
      }
      agent.phase = "dwell";
      return;
    }
    if (agent.phase === "press") {
      if (time < agent.releaseAt) return;
      pressed = false;
      if (agent.pinning) {
        agent.pinning = false;
        const [px, py] = snapped(ghost.x, ghost.y);
        dropPin(px, py, time, false);
      }
      agent.phase = "dwell";
      agent.until = time + 0.6 / speed;
      return;
    }
    if (time < agent.until) return;
    agent.turn += 1;
    if (agent.turn % 2 === 0) {
      const action = ACTIONS[agent.action % ACTIONS.length];
      agent.action += 1;
      if (action === "measure" && s.measure) {
        startGhostMeasure(time, speed);
        return;
      }
      if (action === "pin" && s.pins) {
        pressed = true;
        agent.pinning = true;
        agent.phase = "press";
        agent.releaseAt = time + 0.14 / speed;
        return;
      }
    }
    const next = chooseTravel();
    const distance = Math.hypot(next.x - ghost.x, next.y - ghost.y);
    travel(next.x, next.y, clamp(0.5 + distance / 820, 0.65, 1.6) / speed, 0.34);
  };

  const follow = (tx: number, ty: number, dt: number) => {
    const s = S();
    const smoothing = clamp(finite(s.smoothing, 0), 0, 1);
    let omega = smoothing > 0 ? 1 / (0.01 + 0.12 * smoothing) : 0;
    if (s.snap) omega = omega > 0 ? Math.min(omega, 40) : 40;
    if (catching) omega = omega > 0 ? Math.min(omega, 26) : 26;
    if (omega <= 0 || s.reduced) {
      cursor.x = tx;
      cursor.y = ty;
      cursor.vx = 0;
      cursor.vy = 0;
      catching = false;
      return;
    }
    step(cursor.x, cursor.vx, tx, omega, 1, dt);
    cursor.x = spring[0];
    cursor.vx = spring[1];
    step(cursor.y, cursor.vy, ty, omega, 1, dt);
    cursor.y = spring[0];
    cursor.vy = spring[1];
    if (catching && Math.hypot(tx - cursor.x, ty - cursor.y) < 0.5) catching = false;
  };

  const readout = (): Part[] => {
    const s = S();
    if (tagText && mode === "pointer") return [{ text: tagText, dim: false, width: 0 }];
    const parts: Part[] = [];
    const label = (s.label ?? "").trim();
    if (label) parts.push({ text: label, dim: false, width: 0 });
    if (!s.showCoordinates) return parts;
    const lead = label ? "   " : "";
    const [cx, cy] = convert(clamp(cursor.x, 0, width), clamp(cursor.y, 0, height));
    const text = custom(cx, cy);
    if (text !== null) {
      parts.push({ text: `${lead}${text}`, dim: !!label, width: 0 });
      return parts;
    }
    const digits = places();
    const unit = suffix();
    const [x0, y0] = convert(0, 0);
    const [x1, y1] = convert(width, height);
    const padX = Math.max(formatNumber(x0, digits).length, formatNumber(x1, digits).length);
    const padY = Math.max(formatNumber(y0, digits).length, formatNumber(y1, digits).length);
    parts.push({ text: `${lead}X`, dim: true, width: 0 });
    parts.push({ text: ` ${formatNumber(cx, digits).padStart(padX)}${unit}`, dim: false, width: 0 });
    parts.push({ text: "  Y", dim: true, width: 0 });
    parts.push({ text: ` ${formatNumber(cy, digits).padStart(padY)}${unit}`, dim: false, width: 0 });
    return parts;
  };

  const measureChip = (parts: Part[], size: number): Box => {
    ctx.font = font(size);
    let total = 0;
    for (const part of parts) {
      part.width = ctx.measureText(part.text).width;
      total += part.width;
    }
    const pad = Math.round(size * 0.64);
    return { w: Math.ceil(total + pad * 2), h: Math.round(size * 1.82), pad };
  };

  const drawChip = (left: number, top: number, box: Box, parts: Part[], size: number, fill: string, text: Rgb, alpha: number) => {
    if (alpha <= 0.002) return;
    const x = devX(left);
    const y = devY(top);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = fill;
    roundedRect(ctx, x, y, box.w, box.h, Math.min(4, box.h / 2));
    ctx.fill();
    ctx.font = font(size);
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    let cx = x + box.pad;
    const cy = devY(y + box.h / 2 + 0.5);
    for (const part of parts) {
      ctx.fillStyle = rgba(text, part.dim ? 0.55 : 1);
      ctx.fillText(part.text, devX(cx), cy);
      cx += part.width;
    }
  };

  const palette = (style: DraftingCursorChip) => {
    if (style === "accent") return { fill: rgba(accent), text: legible(accent) };
    if (style === "subtle") return { fill: rgba(ink, 0.12), text: ink };
    return { fill: rgba(ink), text: legible(ink) };
  };

  const chipOffset = () => {
    const s = S();
    return Math.max(Math.max(0, finite(s.gap, 9)), clamp(finite(s.markerSize, 6), 2, 32) / 2) + 7;
  };

  const chooseSides = (box: Box) => {
    const off = chipOffset();
    if (wantX > 0 && cursor.x + off + box.w + 8 > wx + ww) wantX = -1;
    else if (wantX < 0 && cursor.x + off + box.w + 48 < wx + ww) wantX = 1;
    if (wantY > 0 && cursor.y + off + box.h + 8 > wy + wh) wantY = -1;
    else if (wantY < 0 && cursor.y + off + box.h + 40 < wy + wh) wantY = 1;
  };

  const ensureGradients = () => {
    const fade = clamp(finite(S().edgeFade, 0), 0, 1);
    if (fade <= 0) {
      fadeX = null;
      fadeY = null;
      return;
    }
    const key = `${fade}:${wx}:${wy}:${ww}:${wh}:${inkSource}`;
    if (key === gradientKey && fadeX && fadeY) return;
    gradientKey = key;
    const stop = fade * 0.42;
    const make = (x0: number, y0: number, x1: number, y1: number) => {
      const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
      gradient.addColorStop(0, rgba(ink, 0));
      gradient.addColorStop(stop, rgba(ink));
      gradient.addColorStop(1 - stop, rgba(ink));
      gradient.addColorStop(1, rgba(ink, 0));
      return gradient;
    };
    fadeX = make(wx, 0, wx + ww, 0);
    fadeY = make(0, wy, 0, wy + wh);
  };

  const run = (horizontal: boolean, from: number, to: number, at: number, thick: number, style: DraftingCursorLineStyle) => {
    if (to - from < 0.5) return;
    const unit = thick / dpr;
    const across = horizontal ? startY(at, thick) : startX(at, thick);
    const along = horizontal ? devX : devY;
    const rect = (a: number, b: number) => {
      const sa = along(a);
      const length = Math.max(1 / dpr, along(b) - sa);
      if (horizontal) ctx.rect(sa, across, length, unit);
      else ctx.rect(across, sa, unit, length);
    };
    ctx.beginPath();
    if (style === "dashed" || style === "dotted") {
      const on = style === "dashed" ? Math.max(3, unit * 6) : unit;
      const period = style === "dashed" ? on + Math.max(3, unit * 4) : Math.max(3, unit * 3);
      for (let k = Math.floor(from / period) * period; k < to; k += period) {
        const a = Math.max(from, k);
        const b = Math.min(to, k + on);
        if (b - a > 0.05) rect(a, b);
      }
    } else {
      rect(from, to);
    }
    ctx.fill();
  };

  const drawGrid = (alpha: number) => {
    const spacing = finite(S().grid, 0);
    if (spacing < 4 || alpha <= 0.002) return;
    const radius = Math.max(96, spacing * 4.5);
    const { ox, oy } = frameOrigin();
    const arm = clamp(spacing * 0.1, 1.5, 3);
    const thick = Math.max(1, Math.round(dpr));
    const cx = cursor.x;
    const cy = cursor.y;
    ctx.fillStyle = rgba(ink);
    const gx0 = Math.ceil((cx - radius - ox) / spacing);
    const gx1 = Math.floor((cx + radius - ox) / spacing);
    const gy0 = Math.ceil((cy - radius - oy) / spacing);
    const gy1 = Math.floor((cy + radius - oy) / spacing);
    for (let gx = gx0; gx <= gx1; gx++) {
      const px = ox + gx * spacing;
      for (let gy = gy0; gy <= gy1; gy++) {
        const py = oy + gy * spacing;
        const d = Math.hypot(px - cx, py - cy) / radius;
        if (d >= 1 || Math.abs(px - cx) < 1 || Math.abs(py - cy) < 1) continue;
        ctx.globalAlpha = alpha * 0.5 * (1 - d) * (1 - d);
        ctx.fillRect(devX(px - arm), startY(py, thick), devX(px + arm) - devX(px - arm), thick / dpr);
        ctx.fillRect(startX(px, thick), devY(py - arm), thick / dpr, devY(py + arm) - devY(py - arm));
      }
    }
  };

  const drawRulers = (time: number) => {
    const s = S();
    const size = band();
    if (!size) return;
    const always = s.rulers === "always";
    const presence = clamp(look.presence, 0, 1);
    const animated = s.intro && !s.reduced;
    const sweep = !always
      ? 1
      : introAt < 0
        ? animated
          ? 0
          : 1
        : animated
          ? easeOut((time - introAt) / Math.max(0.05, finite(s.introDuration, 0.7) * 1.6))
          : 1;
    const base = always ? 1 : presence;
    if (base <= 0.002 || sweep <= 0) return;
    const r = clamp(reach.value, 0, 1);
    const cx = cursor.x;
    const cy = cursor.y;
    const reveal = (p: number, center: number, low: number, high: number) => {
      if (always) return clamp((sweep * (high - low + 90) - (p - low)) / 90, 0, 1);
      const lo = center - (center - low) * r;
      const hi = center + (high - center) * r;
      return clamp(1 - Math.max(lo - p, p - hi, 0) / 28, 0, 1);
    };
    const { ox, oy, up } = frameOrigin();
    const thick = Math.max(1, Math.round(dpr));
    const top = wy;
    const left = wx;
    ctx.fillStyle = rgba(ink);
    ctx.font = font(RULER_TEXT);
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";

    const horizontal = rulerScale(width);
    const fromX = Math.ceil((left + size - ox) / horizontal.spacing);
    const toX = Math.floor((left + ww - ox) / horizontal.spacing);
    for (let i = fromX; i <= toX; i++) {
      const p = ox + i * horizontal.spacing;
      const shown = reveal(p, cx, left + size, left + ww);
      if (shown <= 0.002) continue;
      const major = i % 10 === 0;
      const mid = !major && i % 5 === 0;
      const focus = presence * Math.exp(-(((p - cx) / 44) ** 2));
      const length = size * (major ? 0.5 : mid ? 0.34 : 0.2);
      ctx.globalAlpha = base * shown * Math.min(0.95, (major ? 0.5 : mid ? 0.36 : 0.24) * (1 + 1.4 * focus));
      ctx.fillRect(startX(p, thick), devY(top), thick / dpr, devY(top + length) - devY(top));
      if (major) {
        const text = rulerText(i * horizontal.value);
        const extent = ctx.measureText(text).width;
        if (p + 3 + extent < left + ww - 2) {
          const crossed = presence * (1 - smooth(Math.max(p + 1 - cx, cx - p - 5 - extent, 0) / 4));
          ctx.globalAlpha = base * shown * Math.min(0.95, 0.46 + 0.4 * focus) * (1 - crossed);
          ctx.fillText(text, devX(p + 3), devY(top + size * 0.52));
        }
      }
    }

    const vertical = rulerScale(height);
    const dir = up ? -1 : 1;
    const a = (top + size - oy) / (dir * vertical.spacing);
    const b = (top + wh - oy) / (dir * vertical.spacing);
    for (let i = Math.ceil(Math.min(a, b)); i <= Math.floor(Math.max(a, b)); i++) {
      const p = oy + dir * i * vertical.spacing;
      const shown = reveal(p, cy, top + size, top + wh);
      if (shown <= 0.002) continue;
      const major = i % 10 === 0;
      const mid = !major && i % 5 === 0;
      const focus = presence * Math.exp(-(((p - cy) / 44) ** 2));
      const length = size * (major ? 0.5 : mid ? 0.34 : 0.2);
      ctx.globalAlpha = base * shown * Math.min(0.95, (major ? 0.5 : mid ? 0.36 : 0.24) * (1 + 1.4 * focus));
      ctx.fillRect(devX(left), startY(p, thick), devX(left + length) - devX(left), thick / dpr);
      if (major) {
        const text = rulerText(i * vertical.value);
        const extent = ctx.measureText(text).width;
        if (p + 3 + extent < top + wh - 2) {
          const crossed = presence * (1 - smooth(Math.max(p + 1 - cy, cy - p - 5 - extent, 0) / 4));
          ctx.globalAlpha = base * shown * Math.min(0.95, 0.46 + 0.4 * focus) * (1 - crossed);
          ctx.save();
          ctx.translate(devX(left + size * 0.52), devY(p + 3));
          ctx.rotate(-Math.PI / 2);
          ctx.textAlign = "right";
          ctx.fillText(text, 0, 0);
          ctx.restore();
        }
      }
    }

    if (presence > 0.002) {
      const notch = hairline(1.5);
      ctx.globalAlpha = presence * clamp(r * 4, 0, 1);
      ctx.fillStyle = rgba(accent);
      if (cx > left + size && cx < left + ww) {
        ctx.fillRect(startX(cx, notch), devY(top), notch / dpr, devY(top + size) - devY(top));
      }
      if (cy > top + size && cy < top + wh) {
        ctx.fillRect(devX(left), startY(cy, notch), devX(left + size) - devX(left), notch / dpr);
      }
    }
  };

  const drawMeasure = (m: Measure, time: number) => {
    const s = S();
    let alpha = 1;
    if (m.released >= 0) {
      const t = time - m.released - m.hold;
      if (t > 0) alpha = 1 - smooth(t / 0.6);
    }
    if (alpha <= 0.002) return;
    const grown = m.grow > 0 ? easeOut((time - m.born) / m.grow) : 1;
    const ax = m.ax;
    const ay = m.ay;
    const bx = ax + (m.bx - ax) * grown;
    const by = ay + (m.by - ay) * grown;
    const dx = bx - ax;
    const dy = by - ay;
    const length = Math.hypot(dx, dy);
    if (length < 1) return;
    const thick = hairline();
    const ux = dx / length;
    const uy = dy / length;
    const guide = clamp(finite(s.lineOpacity, 0.35) * 1.5, 0.25, 0.9);

    ctx.globalAlpha = alpha * guide;
    ctx.fillStyle = rgba(ink);
    run(true, Math.min(ax, bx), Math.max(ax, bx), ay, thick, "dashed");
    run(false, Math.min(ay, by), Math.max(ay, by), bx, thick, "dashed");

    const stroke = hairline(1.25) / dpr;
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = rgba(accent);
    ctx.lineWidth = stroke;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    const sx = (ux - uy) * Math.SQRT1_2;
    const sy = (ux + uy) * Math.SQRT1_2;
    const half = 4.5;
    ctx.moveTo(ax - sx * half, ay - sy * half);
    ctx.lineTo(ax + sx * half, ay + sy * half);
    ctx.moveTo(bx - sx * half, by - sy * half);
    ctx.lineTo(bx + sx * half, by + sy * half);
    ctx.stroke();

    if (length > 56 && Math.abs(dx) > 14 && Math.abs(dy) > 14) {
      const radius = Math.min(28, length * 0.3);
      const start = dx >= 0 ? 0 : Math.PI;
      let delta = Math.atan2(dy, dx) - start;
      while (delta > Math.PI) delta -= TAU;
      while (delta < -Math.PI) delta += TAU;
      ctx.globalAlpha = alpha * guide;
      ctx.strokeStyle = rgba(ink);
      ctx.lineWidth = thick / dpr;
      ctx.beginPath();
      ctx.arc(ax, ay, radius, start, start + delta, delta < 0);
      ctx.stroke();
    }

    ctx.font = font(NOTE_TEXT);
    ctx.fillStyle = rgba(ink);
    ctx.textBaseline = "middle";
    ctx.globalAlpha = alpha * clamp(guide * 1.25, 0.4, 1);
    if (Math.abs(dx) > 48) {
      ctx.textAlign = "center";
      ctx.fillText(formatNumber(Math.abs(dx), 0), devX((ax + bx) / 2), devY(by > ay ? ay - 9 : ay + 9));
    }
    if (Math.abs(dy) > 36) {
      ctx.textAlign = bx >= ax ? "left" : "right";
      ctx.fillText(formatNumber(Math.abs(dy), 0), devX(bx >= ax ? bx + 8 : bx - 8), devY((ay + by) / 2));
    }
    ctx.textAlign = "left";

    const degrees = Math.round((Math.atan2(Math.abs(dy), Math.abs(dx)) * 180) / Math.PI);
    const parts: Part[] = [
      { text: formatNumber(length, 0), dim: false, width: 0 },
      { text: " px", dim: true, width: 0 },
      { text: `  ${degrees}°`, dim: false, width: 0 },
    ];
    const box = measureChip(parts, CHIP_TEXT);
    const mx = (ax + bx) / 2;
    const my = (ay + by) / 2;
    let nx = -uy;
    let ny = ux;
    if (nx * (bx - mx) + ny * (ay - my) > 0) {
      nx = -nx;
      ny = -ny;
    }
    const distance = 10 + Math.abs(nx) * (box.w / 2) + Math.abs(ny) * (box.h / 2);
    const chipLeft = clamp(mx + nx * distance - box.w / 2, wx + 4, wx + ww - box.w - 4);
    const chipTop = clamp(my + ny * distance - box.h / 2, wy + 4, wy + wh - box.h - 4);
    const colors = palette("accent");
    drawChip(chipLeft, chipTop, box, parts, CHIP_TEXT, colors.fill, colors.text, alpha * smooth(length / 24));
  };

  const drawPins = (time: number) => {
    if (!pins.length) return;
    const s = S();
    const stroke = hairline(1.25);
    const unit = stroke / dpr;
    const presence = clamp(look.presence, 0, 1);
    const ceiling = wy + band() + 4;
    ctx.font = font(NOTE_TEXT);
    ctx.textBaseline = "alphabetic";
    ctx.textAlign = "left";
    for (const pin of pins) {
      const age = time - pin.born;
      let alpha = s.reduced ? 1 : smooth(age / 0.14);
      if (pin.dieAt > 0 && time > pin.dieAt) alpha *= 1 - smooth((time - pin.dieAt) / 0.5);
      if (alpha <= 0.002) continue;
      const settle = s.reduced ? 1 : backOut(age / 0.42);
      const arm = 5 * (1.7 - 0.7 * settle);
      const turn = s.reduced ? 0 : (1 - easeOut(age / 0.42)) * (Math.PI / 4);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = rgba(accent);
      if (turn < 0.002) {
        ctx.fillRect(devX(pin.x - arm), startY(pin.y, stroke), devX(pin.x + arm) - devX(pin.x - arm), unit);
        ctx.fillRect(startX(pin.x, stroke), devY(pin.y - arm), unit, devY(pin.y + arm) - devY(pin.y - arm));
      } else {
        ctx.save();
        ctx.translate(pin.x, pin.y);
        ctx.rotate(turn);
        ctx.fillRect(-arm, -unit / 2, arm * 2, unit);
        ctx.fillRect(-unit / 2, -arm, unit, arm * 2);
        ctx.restore();
      }
      const w = ctx.measureText(pin.text).width;
      const lx = pin.x + 8 + w > wx + ww - 4 ? pin.x - 8 - w : pin.x + 8;
      const ly = pin.y - 7 - NOTE_TEXT < ceiling ? pin.y + 7 + NOTE_TEXT : pin.y - 7;
      const near = Math.hypot(cursor.x - pin.x, cursor.y - pin.y);
      const yielding = presence * (1 - smooth((near - 28) / 44));
      ctx.globalAlpha = alpha * 0.72 * smooth((age - 0.1) / 0.25) * (1 - yielding);
      ctx.fillStyle = rgba(ink);
      ctx.fillText(pin.text, devX(lx), devY(ly));
    }
  };

  const drawCrosshair = (alpha: number) => {
    const s = S();
    const r = clamp(reach.value, 0, 1);
    if (alpha <= 0.002 || r <= 0.0005) return;
    const thick = hairline();
    const size = band();
    const cx = cursor.x;
    const cy = cursor.y;
    const gap =
      Math.max(0, finite(s.gap, 9)) *
      (1 - 0.22 * clamp(look.press, -0.5, 1.5)) *
      (0.5 + 0.5 * clamp(look.marker, 0, 1.25));
    const minX = wx + size;
    const maxX = wx + ww;
    const minY = wy + size;
    const maxY = wy + wh;
    const left = cx - gap - Math.max(0, cx - gap - minX) * r;
    const right = cx + gap + Math.max(0, maxX - cx - gap) * r;
    const upper = cy - gap - Math.max(0, cy - gap - minY) * r;
    const lower = cy + gap + Math.max(0, maxY - cy - gap) * r;
    ensureGradients();
    ctx.globalAlpha = clamp(alpha * (s.lineStyle === "dotted" ? 1.7 : s.lineStyle === "dashed" ? 1.2 : 1), 0, 1);
    ctx.fillStyle = fadeX ?? rgba(ink);
    run(true, left, cx - gap, cy, thick, s.lineStyle);
    run(true, cx + gap, right, cy, thick, s.lineStyle);
    ctx.fillStyle = fadeY ?? rgba(ink);
    run(false, upper, cy - gap, cx, thick, s.lineStyle);
    run(false, cy + gap, lower, cx, thick, s.lineStyle);
  };

  const drawMarker = (alpha: number) => {
    const s = S();
    if (alpha <= 0.002 || s.marker === "none") return;
    const size = clamp(finite(s.markerSize, 6), 2, 32);
    const scale = Math.max(0, look.marker) * (1 - 0.3 * clamp(look.press, -0.5, 1.5));
    const hover = clamp(look.hover, 0, 1);
    const stroke = hairline(1.25);
    const unit = stroke / dpr;
    const x = devX(cursor.x);
    const y = devY(cursor.y);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = rgba(accent);
    ctx.strokeStyle = rgba(accent);
    ctx.lineWidth = unit;
    if (s.marker === "dot") {
      ctx.beginPath();
      ctx.arc(x, y, Math.max(0, (size / 2) * scale * (1 - 0.45 * hover)), 0, TAU);
      ctx.fill();
    } else if (s.marker === "ring") {
      ctx.beginPath();
      ctx.arc(x, y, Math.max(0.5, (size / 2) * scale), 0, TAU);
      ctx.stroke();
    } else if (s.marker === "square") {
      const half = (size / 2) * scale;
      const odd = stroke % 2 === 1 ? 0.5 / dpr : 0;
      ctx.save();
      ctx.translate(x + odd, y + odd);
      ctx.rotate((hover * Math.PI) / 4);
      ctx.strokeRect(-half, -half, half * 2, half * 2);
      ctx.restore();
    } else if (s.marker === "cross") {
      const arm = (size / 2) * scale;
      ctx.fillRect(devX(cursor.x - arm), startY(cursor.y, stroke), devX(cursor.x + arm) - devX(cursor.x - arm), unit);
      ctx.fillRect(startX(cursor.x, stroke), devY(cursor.y - arm), unit, devY(cursor.y + arm) - devY(cursor.y - arm));
    }
    if (hover > 0.01) {
      ctx.globalAlpha = alpha * hover;
      ctx.beginPath();
      ctx.arc(x, y, size / 2 + 3 + 3 * hover, 0, TAU);
      ctx.stroke();
    }
  };

  const render = (time: number, parts: Part[], box: Box) => {
    const s = S();
    const presence = clamp(look.presence, 0, 1);
    const framed = s.rulers === "always" && band() > 0;
    if (presence <= 0.002 && !measures.length && !pins.length && !framed) {
      if (!blank) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        blank = true;
      }
      return;
    }
    blank = false;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, -wx * dpr, -wy * dpr);
    drawGrid(presence);
    drawRulers(time);
    for (const m of measures) drawMeasure(m, time);
    drawPins(time);
    drawCrosshair(presence * clamp(finite(s.lineOpacity, 0.35), 0, 1));
    drawMarker(presence);
    if (parts.length && box.w > 0) {
      const appear = smooth((clamp(reach.value, 0, 1) - 0.12) / 0.5) * clamp(look.chip, 0, 1);
      const off = chipOffset();
      const size = band();
      const t = (look.sideX + 1) / 2;
      const u = (look.sideY + 1) / 2;
      const drift = (1 - appear) * 5;
      const left = clamp(
        cursor.x - off - box.w + t * (2 * off + box.w) + look.sideX * drift,
        wx + size + 4,
        wx + ww - box.w - 4,
      );
      const top = clamp(
        cursor.y - off - box.h + u * (2 * off + box.h) + look.sideY * drift,
        wy + size + 4,
        wy + wh - box.h - 4,
      );
      const colors = palette(s.chip);
      drawChip(left, top, box, parts, CHIP_TEXT, colors.fill, colors.text, presence * appear);
    }
    ctx.globalAlpha = 1;
  };

  const prune = (time: number) => {
    for (let i = measures.length - 1; i >= 0; i--) {
      const m = measures[i];
      if (m !== live && m !== agent.drawing && m.released >= 0 && time > m.released + m.hold + 0.6) measures.splice(i, 1);
    }
    for (let i = pins.length - 1; i >= 0; i--) {
      const pin = pins[i];
      if (pin.dieAt > 0 && time > pin.dieAt + 0.5) pins.splice(i, 1);
    }
  };

  const plan = (time: number) => {
    const s = S();
    let wake = Infinity;
    for (const m of measures) if (m.released >= 0) wake = Math.min(wake, m.released + m.hold);
    for (const pin of pins) if (pin.dieAt > 0) wake = Math.min(wake, pin.dieAt);
    if (s.autoplay && !s.reduced && !s.disabled && mode === "none" && pointer.seen && !pointer.inside) {
      wake = Math.min(wake, pointer.leftAt + Math.max(0, finite(s.idleDelay, 1.5)));
    }
    if (timer) {
      view.clearTimeout(timer);
      timer = 0;
    }
    if (!Number.isFinite(wake) || wake <= time) return;
    timer = view.setTimeout(
      () => {
        timer = 0;
        schedule();
      },
      Math.min(2147483000, (wake - time) * 1000 + 20),
    );
  };

  const schedule = () => {
    if (destroyed || !visible || raf) return;
    raf = view.requestAnimationFrame(frame);
  };

  function frame(stamp: number) {
    raf = 0;
    if (destroyed) return;
    const s = S();
    const dt = last ? clamp((stamp - last) / 1000, 0, 1 / 20) : 1 / 60;
    last = stamp;
    const time = now();
    if (tint <= 0) {
      colours();
      tint = 24;
    } else {
      tint -= 1;
    }

    const next = decide(time);
    if (next !== mode) switchMode(next, time);

    let tx = cursor.x;
    let ty = cursor.y;
    if (mode === "pointer") {
      [tx, ty] = aim();
    } else if (mode === "ghost") {
      runAgent(time);
      [tx, ty] = snapped(ghost.x, ghost.y);
    }
    follow(tx, ty, dt);
    if (live) {
      live.bx = cursor.x;
      live.by = cursor.y;
    }
    if (agent.drawing) {
      agent.drawing.bx = cursor.x;
      agent.drawing.by = cursor.y;
    }

    const span = reach.duration > 0 ? clamp((time - reach.t0) / reach.duration, 0, 1) : 1;
    reach.value = reach.from + (reach.to - reach.from) * (reach.to >= reach.from ? easeOut(span) : easeIn(span));

    const instant = s.reduced;
    const showing = mode !== "none" && !(mode === "pointer" && textual) ? 1 : 0;
    let settled = animate("presence", showing, 16, 1, dt, instant);
    settled = animate("marker", showing, 20, 0.55, dt, instant) && settled;
    settled = animate("press", pressed ? 1 : 0, 38, 0.5, dt, instant) && settled;
    settled = animate("hover", mode === "pointer" && hovering ? 1 : 0, 26, 0.85, dt, instant) && settled;
    settled = animate("chip", live || agent.drawing ? 0 : 1, 20, 1, dt, instant) && settled;

    let parts: Part[] = [];
    let box: Box = { w: 0, h: 0, pad: 0 };
    if (look.presence > 0.002) {
      parts = readout();
      if (parts.length) {
        box = measureChip(parts, CHIP_TEXT);
        chooseSides(box);
      }
    }
    if (freshChip) {
      look.sideX = wantX;
      look.sideY = wantY;
      look.sideXV = 0;
      look.sideYV = 0;
      freshChip = false;
    }
    settled = animate("sideX", wantX, 24, 0.9, dt, instant) && settled;
    settled = animate("sideY", wantY, 24, 0.9, dt, instant) && settled;

    prune(time);
    render(time, parts, box);

    const tweening = time < reach.t0 + reach.duration;
    const sweeping =
      s.rulers === "always" &&
      s.intro &&
      !s.reduced &&
      introAt >= 0 &&
      time < introAt + Math.max(0.05, finite(s.introDuration, 0.7) * 1.6);
    const following =
      catching ||
      Math.abs(cursor.vx) + Math.abs(cursor.vy) > 0.5 ||
      Math.abs(cursor.x - tx) + Math.abs(cursor.y - ty) > 0.05;
    const busy =
      measures.some(
        (m) =>
          (m.grow > 0 && time < m.born + m.grow + 0.05) ||
          (m.released >= 0 && time >= m.released + m.hold && time < m.released + m.hold + 0.65),
      ) || pins.some((pin) => time - pin.born < 0.6 || (pin.dieAt > 0 && time >= pin.dieAt && time < pin.dieAt + 0.55));
    if (mode === "ghost" || !settled || tweening || sweeping || following || busy) {
      schedule();
      return;
    }
    plan(time);
  }

  const locate = (clientX: number, clientY: number) => {
    const rect = root.getBoundingClientRect();
    pointer.clientX = clientX;
    pointer.clientY = clientY;
    pointer.x = clientX - rect.left;
    pointer.y = clientY - rect.top;
  };

  const beginLive = (event: PointerEvent) => {
    const time = now();
    const [x, y] = aim();
    const m: Measure = { ax: drag.x, ay: drag.y, bx: x, by: y, born: time, grow: 0, released: -1, hold: holdTime() };
    beginMeasure(m, time);
    live = m;
    root.setAttribute("data-measuring", "");
    try {
      root.setPointerCapture(event.pointerId);
      drag.captured = true;
    } catch {
      drag.captured = false;
    }
    view.getSelection?.()?.removeAllRanges();
  };

  const endLive = (time: number) => {
    if (!live) return null;
    const m = live;
    live = null;
    m.released = time;
    root.removeAttribute("data-measuring");
    if (drag.captured && drag.id >= 0 && root.hasPointerCapture(drag.id)) root.releasePointerCapture(drag.id);
    drag.captured = false;
    return m;
  };

  const resetDrag = () => {
    drag.pressing = false;
    drag.armed = false;
    drag.captured = false;
    drag.id = -1;
    pressed = false;
  };

  const track = (event: PointerEvent) => {
    if (event.pointerType === "touch" || !followable()) return;
    locate(event.clientX, event.clientY);
    pointer.inside = true;
    pointer.seen = true;
    drag.shift = event.shiftKey;
    if (!drag.captured) inspect(event.target);
    if (
      drag.pressing &&
      drag.armed &&
      !live &&
      S().measure &&
      Math.hypot(pointer.x - drag.x, pointer.y - drag.y) > 5
    ) {
      beginLive(event);
    }
    refreshActive();
    schedule();
  };

  const onLeave = () => {
    if (!pointer.inside || drag.captured) return;
    pointer.inside = false;
    pointer.leftAt = now();
    textual = false;
    hovering = false;
    tagText = "";
    if (drag.pressing) {
      endLive(now());
      resetDrag();
    }
    refreshActive();
    schedule();
  };

  const onDown = (event: PointerEvent) => {
    if (event.pointerType === "touch" || !followable() || event.button !== 0) return;
    track(event);
    pressed = true;
    drag.pressing = true;
    drag.armed = !textual && !hovering;
    const [x, y] = aim();
    drag.x = x;
    drag.y = y;
    drag.at = now();
    drag.id = event.pointerId;
    schedule();
  };

  const onUp = (event: PointerEvent) => {
    if (!drag.pressing || event.pointerId !== drag.id) return;
    const s = S();
    const time = now();
    if (live) {
      locate(event.clientX, event.clientY);
      [live.bx, live.by] = aim();
    }
    const finished = endLive(time);
    if (finished) {
      const summary = summarize(finished);
      if (summary.length > 0.5) s.onMeasure?.(summary);
    } else if (drag.armed && s.pins && time - drag.at < 0.6) {
      dropPin(drag.x, drag.y, time, true);
    }
    resetDrag();
    const rect = root.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    ) {
      onLeave();
    }
    schedule();
  };

  const onBlur = () => {
    endLive(now());
    resetDrag();
    onLeave();
  };

  const onKey = (event: KeyboardEvent) => {
    if (event.key === "Shift") {
      drag.shift = event.type === "keydown";
      if (live) schedule();
      return;
    }
    if (event.key === "Escape" && event.type === "keydown" && live) {
      const index = measures.indexOf(live);
      if (index >= 0) measures.splice(index, 1);
      endLive(now());
      drag.armed = false;
      schedule();
    }
  };

  const onSelect = (event: Event) => {
    if (drag.pressing && drag.armed && S().measure) event.preventDefault();
  };

  const onScroll = () => {
    const moved = layout();
    if (pointer.inside) {
      locate(pointer.clientX, pointer.clientY);
      if (!drag.captured) inspect(doc.elementFromPoint(pointer.clientX, pointer.clientY));
    }
    if (moved || pointer.inside) schedule();
  };

  const onResize = () => {
    layout();
    schedule();
  };

  const onPreference = () => {
    if (!fine.matches) onBlur();
    schedule();
  };

  const onFonts = () => schedule();

  root.addEventListener("pointermove", track, { passive: true });
  root.addEventListener("pointerover", track, { passive: true });
  root.addEventListener("pointerdown", onDown, { passive: true });
  root.addEventListener("pointerleave", onLeave);
  root.addEventListener("pointercancel", onBlur);
  root.addEventListener("selectstart", onSelect);
  view.addEventListener("pointerup", onUp, { passive: true });
  view.addEventListener("blur", onBlur);
  view.addEventListener("keydown", onKey);
  view.addEventListener("keyup", onKey);
  view.addEventListener("resize", onResize, { passive: true });
  view.addEventListener("scroll", onScroll, { passive: true, capture: true });
  fine.addEventListener("change", onPreference);
  doc.fonts?.addEventListener?.("loadingdone", onFonts);

  const resizer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(onResize);
  resizer?.observe(root);

  const observer =
    typeof IntersectionObserver === "undefined"
      ? null
      : new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          if (visible) {
            last = 0;
            if (introAt < 0) introAt = now();
            if (agent.phase === "travel" || agent.phase === "dwell") {
              agent.phase = "dwell";
              agent.until = now() + 0.3;
            }
            layout();
            schedule();
          } else if (raf) {
            view.cancelAnimationFrame(raf);
            raf = 0;
          }
        });
  observer?.observe(root);
  if (!observer) introAt = now();

  layout();
  colours();
  schedule();

  return {
    sync: () => {
      colours();
      tint = 24;
      gradientKey = "";
      if (!followable()) {
        endLive(now());
        if (drag.pressing) resetDrag();
      }
      refreshActive();
      layout();
      schedule();
    },
    measure: (x1: number, y1: number, x2: number, y2: number) => {
      if (destroyed || ![x1, y1, x2, y2].every(Number.isFinite)) return;
      const time = now();
      const grow = S().reduced ? 0 : 0.6;
      beginMeasure({ ax: x1, ay: y1, bx: x2, by: y2, born: time, grow, released: time + grow, hold: holdTime() }, time);
      schedule();
    },
    pin: (x: number, y: number) => {
      if (destroyed || !Number.isFinite(x) || !Number.isFinite(y)) return;
      dropPin(x, y, now(), false);
      schedule();
    },
    clearPins: () => {
      const time = now();
      for (const pin of pins) if (pin.dieAt === 0 || pin.dieAt > time) pin.dieAt = time;
      schedule();
    },
    replay: () => {
      const s = S();
      const time = now();
      introAt = time;
      if (mode !== "none") {
        reach.from = 0;
        reach.value = 0;
        reach.to = 1;
        reach.t0 = time;
        reach.duration = s.reduced || !s.intro ? 0 : Math.max(0.05, finite(s.introDuration, 0.7));
        look.marker = 0;
        look.markerV = 0;
      }
      schedule();
    },
    destroy: () => {
      destroyed = true;
      if (raf) view.cancelAnimationFrame(raf);
      if (timer) view.clearTimeout(timer);
      observer?.disconnect();
      resizer?.disconnect();
      root.removeEventListener("pointermove", track);
      root.removeEventListener("pointerover", track);
      root.removeEventListener("pointerdown", onDown);
      root.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("pointercancel", onBlur);
      root.removeEventListener("selectstart", onSelect);
      view.removeEventListener("pointerup", onUp);
      view.removeEventListener("blur", onBlur);
      view.removeEventListener("keydown", onKey);
      view.removeEventListener("keyup", onKey);
      view.removeEventListener("resize", onResize);
      view.removeEventListener("scroll", onScroll, { capture: true });
      fine.removeEventListener("change", onPreference);
      doc.fonts?.removeEventListener?.("loadingdone", onFonts);
      root.removeAttribute("data-measuring");
      setActive(false);
    },
  };
};

export const DraftingCursor = forwardRef<DraftingCursorHandle, DraftingCursorProps>(function DraftingCursor(
  {
    color = "currentColor",
    accentColor = "#7B5CFF",
    lineWidth = 1,
    lineStyle = "solid",
    lineOpacity = 0.35,
    gap = 9,
    edgeFade = 0,
    marker = "dot",
    markerSize = 6,
    showCoordinates = true,
    label = "",
    units = "px",
    origin = "top-left",
    chip = "ink",
    fontFamily = MONO,
    rulers = "hover",
    rulerSize = 20,
    tickSpacing = 10,
    grid = 0,
    snap = false,
    smoothing = 0,
    measure = true,
    measureHold = 2.5,
    pins = true,
    maxPins = 4,
    pinLife = 8,
    intro = true,
    introDuration = 0.7,
    autoplay = false,
    autoplaySpeed = 1,
    idleDelay = 1.5,
    hideCursor = true,
    interactive = true,
    disabled = false,
    formatCoordinates,
    onMeasure,
    onPin,
    className,
    style,
    children,
  },
  ref,
) {
  const scope = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<Controller | null>(null);
  const reduced = useSyncExternalStore(subscribeToMotion, readMotion, () => false);

  const settings: Settings = {
    color,
    accentColor,
    lineWidth,
    lineStyle,
    lineOpacity,
    gap,
    edgeFade,
    marker,
    markerSize,
    showCoordinates,
    label,
    units,
    origin,
    chip,
    fontFamily,
    rulers,
    rulerSize,
    tickSpacing,
    grid,
    snap,
    smoothing,
    measure,
    measureHold,
    pins,
    maxPins,
    pinLife,
    intro,
    introDuration,
    autoplay,
    autoplaySpeed,
    idleDelay,
    hideCursor,
    interactive,
    disabled,
    formatCoordinates,
    onMeasure,
    onPin,
    reduced,
  };
  const settingsRef = useRef(settings);

  useEffect(() => {
    settingsRef.current = settings;
    controllerRef.current?.sync();
  });

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    const controller = createDraftingCursor(root, canvas, settingsRef);
    controllerRef.current = controller;
    return () => {
      controller.destroy();
      controllerRef.current = null;
    };
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      measure: (x1: number, y1: number, x2: number, y2: number) => controllerRef.current?.measure(x1, y1, x2, y2),
      pin: (x: number, y: number) => controllerRef.current?.pin(x, y),
      clearPins: () => controllerRef.current?.clearPins(),
      replay: () => controllerRef.current?.replay(),
    }),
    [],
  );

  return (
    <div
      ref={rootRef}
      data-drafting-cursor={scope}
      className={cn("relative isolate h-full min-h-[240px] w-full", className)}
      style={style}
    >
      <style>{scopeStyles(scope)}</style>
      {children}
      <div
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 2147483000 }}
      >
        <canvas
          ref={canvasRef}
          style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, display: "block" }}
        />
      </div>
    </div>
  );
});

DraftingCursor.displayName = "DraftingCursor";

export default DraftingCursor;
