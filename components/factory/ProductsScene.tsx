"use client";
import { Environment, Lightformer, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer, SSAO, ToneMapping } from "@react-three/postprocessing";
import type { MotionValue } from "motion/react";
import { ToneMappingMode } from "postprocessing";
import { Suspense, useRef, useState, type RefObject } from "react";
import * as THREE from "three";

// Built by scripts/scene3d/build_products.py: fifteen duct fittings joined into one run under a dark soffit.
// The about page's product tile (components/about/ProductModel.tsx) shows the same run in the same room.
export const MODEL = "/models/products/ducts.glb";
export const DRACO = "/draco/";
const BG = "#1f2226";

/** Phones and small screens skip ambient occlusion and multisampling. */
export const isLite = () => window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;

/** Product nodes in the GLB (`product_<id>`), in the order Products lists them. */
export const PRODUCTS = [
  "rect", "bend", "offset", "transition", "spiral", "lateral", "insulated",
  "bend45", "reducer", "tee", "flex", "bend90", "stamp90", "flexins", "oval",
];

type Vec = [number, number, number];
type Shot = {
  pos: Vec;
  target: Vec;
  fov: number;
  /** how far right of the copy the subject sits on desktop, as a share of the width */
  shift: number;
  /** index into PRODUCTS of the product slid out of the run for this step; -1 shows the whole run */
  focus: number;
};
// One shot per step in Products, same order: the run, each product in turn, the run again.
// Three.js axes: x = Blender x, y = Blender z (up), z = -Blender y. The soffit is at y 3.0 and
// the ducts hang at y 2.2-2.45; every camera stays below them, so moves never cut through metal.
const shots: Shot[] = [
  { pos: [2.2, 0.9, 4.4], target: [-2.0, 2.75, -0.6], fov: 52, shift: 0.12, focus: -1 },
  { pos: [0.09, 0.81, 7.89], target: [-2.7, 2.05, 2.5], fov: 34, shift: 0.18, focus: 0 },
  { pos: [0.53, 1.25, 4.84], target: [-1.07, 2.05, 2.18], fov: 34, shift: 0.18, focus: 1 },
  { pos: [3.79, 1.06, 2.32], target: [-0.3, 2.03, 0.3], fov: 34, shift: 0.18, focus: 2 },
  { pos: [1.62, 1.32, 0.69], target: [-0.3, 1.85, -0.65], fov: 34, shift: 0.18, focus: 3 },
  { pos: [3.79, 1.06, -0.25], target: [-0.3, 1.85, -1.7], fov: 34, shift: 0.18, focus: 4 },
  { pos: [1.6, 0.58, -0.63], target: [-0.38, 1.75, -2.55], fov: 36, shift: 0.18, focus: 5 },
  { pos: [3.45, 0.85, -0.55], target: [-0.3, 1.7, -3.8], fov: 34, shift: 0.18, focus: 6 },
  { pos: [0.4, 0.94, -0.2], target: [-0.51, 1.85, -2.46], fov: 34, shift: 0.18, focus: 7 },
  { pos: [1.57, 1.05, -0.5], target: [0.77, 1.85, -2.5], fov: 34, shift: 0.18, focus: 8 },
  { pos: [2.11, 1.15, -0.36], target: [1.27, 1.87, -2.5], fov: 34, shift: 0.18, focus: 9 },
  { pos: [2.79, 1.05, -0.19], target: [1.57, 1.46, -2.57], fov: 36, shift: 0.18, focus: 10 },
  { pos: [3.21, 0.91, -0.42], target: [2.14, 1.85, -2.71], fov: 34, shift: 0.18, focus: 11 },
  { pos: [4.33, 1.11, -2.72], target: [2.55, 1.83, -4.15], fov: 34, shift: 0.18, focus: 12 },
  { pos: [4.49, 1.04, -2.61], target: [2.4, 1.45, -4.42], fov: 36, shift: 0.18, focus: 13 },
  { pos: [1.34, 0.76, 2.32], target: [1.0, 2.29, -0.7], fov: 34, shift: 0.18, focus: 14 },
  { pos: [-4.0, 1.0, 3.2], target: [-4.5, 2.5, 1.5], fov: 50, shift: 0.16, focus: -1 },
];

type Input = { px: number; py: number };

type SceneProps = {
  progress: MotionValue<number>;
  active: boolean;
  reducedMotion: boolean;
};

export default function ProductsScene({ progress, active, reducedMotion }: SceneProps) {
  const input = useRef<Input>({ px: 0, py: 0 });
  const [lite] = useState(isLite);

  return (
    <div
      className="size-full"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const rect = e.currentTarget.getBoundingClientRect();
        input.current.px = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        input.current.py = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      }}
      onPointerLeave={() => (input.current.px = input.current.py = 0)}
    >
      <Canvas
        frameloop={active ? "always" : "never"}
        dpr={[1, lite ? 1.5 : 1.75]}
        shadows="percentage"
        flat
        camera={{ position: shots[0].pos, fov: shots[0].fov, near: 0.05, far: 60 }}
        fallback={
          <p className="flex size-full items-center justify-center text-step-small text-white/60">
            Таны хөтөч 3D дүрслэлийг дэмжихгүй байна.
          </p>
        }
        aria-label="Таазны доор угсарсан агаарын суваг, фасон эдлэлийн 3D дүрслэл"
      >
        <Stage />
        <Suspense fallback={null}>
          <Rig progress={progress} inputRef={input} animate={!reducedMotion} />
        </Suspense>
        <Effects lite={lite} />
      </Canvas>
    </div>
  );
}

/** The room the run hangs in: a dark plant room whose far ends sink into fog, lit softly from below and by a key
 *  that throws the ducts' shadows up onto the soffit. */
export function Stage() {
  return (
    <>
      <color attach="background" args={[BG]} />
      {/* the far ends of the run sink into the dark, as in an unlit plant room */}
      <fog attach="fog" args={[BG, 9, 22]} />
      <Environment resolution={256} environmentIntensity={0.5}>
        {/* the room below: a broad soft glow that lights the undersides, as in the reference photo */}
        <Lightformer intensity={1.2} position={[0, -4, 0]} rotation-x={-Math.PI / 2} scale={[20, 20, 1]} color="#dfe5ee" />
        <Lightformer intensity={1.2} position={[8, 1, 2]} rotation-y={-Math.PI / 2} scale={[10, 4, 1]} color="#eef1f6" />
        <Lightformer intensity={0.6} position={[-8, 1.5, 4]} rotation-y={Math.PI / 2} scale={[10, 4, 1]} color="#cfd6e2" />
      </Environment>
      {/* key from the front, side and below: the ducts throw their shadows up onto the soffit */}
      <directionalLight
        castShadow
        position={[7, -0.5, 7]}
        intensity={1.4}
        color="#f3f5f9"
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
        shadow-camera-near={0.5}
        shadow-camera-far={30}
        shadow-bias={-0.0003}
        shadow-normalBias={0.03}
        shadow-radius={4}
      />
    </>
  );
}

/** Ambient occlusion, a faint bloom and AgX tone mapping; the lite path keeps only the bloom and tone mapping. */
export function Effects({ lite }: { lite: boolean }) {
  return lite ? (
    <EffectComposer multisampling={0}>
      <Bloom mipmapBlur intensity={0.3} luminanceThreshold={0.9} luminanceSmoothing={0.2} />
      <ToneMapping mode={ToneMappingMode.AGX} />
    </EffectComposer>
  ) : (
    <EffectComposer multisampling={4} enableNormalPass>
      <SSAO
        samples={16}
        rings={4}
        radius={0.08}
        intensity={18}
        bias={0.03}
        luminanceInfluence={0.55}
        worldDistanceThreshold={1.2}
        worldDistanceFalloff={0.4}
        worldProximityThreshold={0.5}
        worldProximityFalloff={0.15}
        resolutionScale={0.5}
      />
      <Bloom mipmapBlur intensity={0.3} luminanceThreshold={0.9} luminanceSmoothing={0.2} />
      <ToneMapping mode={ToneMappingMode.AGX} />
    </EffectComposer>
  );
}

const targetPos = new THREE.Vector3();
const targetLook = new THREE.Vector3();
const look = new THREE.Vector3(...shots[0].target);
const tmpA = new THREE.Vector3();
const tmpB = new THREE.Vector3();
const spotAt = new THREE.Vector3();
const { damp, clamp, lerp } = THREE.MathUtils;

/** Blender stores offsets Z-up; three.js is Y-up. */
const toThree = (v: unknown) =>
  Array.isArray(v) && v.length === 3
    ? new THREE.Vector3(Number(v[0]), Number(v[2]), -Number(v[1]))
    : new THREE.Vector3();

export type Parts = ReturnType<typeof findParts>;

export function findParts(scene: THREE.Object3D) {
  // Everything casts onto the soffit; the soffit itself would only shade the ducts from a light below.
  scene.traverse((o) => {
    if (!(o instanceof THREE.Mesh)) return;
    let soffit = false;
    for (let n: THREE.Object3D | null = o; n; n = n.parent) soffit ||= n.name === "soffit";
    o.castShadow = !soffit;
    o.receiveShadow = true;
  });
  const products = PRODUCTS.map((id) => {
    const obj = scene.getObjectByName(`product_${id}`) ?? new THREE.Object3D();
    // useGLTF caches one scene for both pages, so a product's resting place is taken once, before anything moves it.
    obj.userData.home ??= obj.position.clone();
    obj.userData.turn ??= obj.rotation.y;
    const home: THREE.Vector3 = obj.userData.home;
    const turn: number = obj.userData.turn;
    return { obj, home, turn, focus: toThree(obj.userData.focus), f: 0 };
  });
  return { products };
}

function Rig({
  progress,
  inputRef,
  animate,
}: {
  progress: MotionValue<number>;
  inputRef: RefObject<Input>;
  animate: boolean;
}) {
  const { scene } = useGLTF(MODEL, DRACO);
  const offset = useRef({ w: 0, h: 0, x: 0, y: 0 });
  const hemi = useRef<THREE.HemisphereLight>(null);
  const spot = useRef<THREE.PointLight>(null);
  // The products the story moves, looked up on the first frame.
  const partsRef = useRef<Parts | null>(null);

  useFrame(({ camera, size, clock, scene: root }, delta) => {
    partsRef.current ??= findParts(scene);
    const parts = partsRef.current;
    const cam = camera as THREE.PerspectiveCamera;
    const k = animate ? 4 : 1000;
    const input = inputRef.current;

    // Scroll scrubs between neighbouring shots with an ease-in-out.
    const p = clamp(progress.get(), 0, shots.length - 1);
    const i = Math.min(Math.floor(p), shots.length - 2);
    const f = p - i;
    const t = f * f * (3 - 2 * f);
    const a = shots[i];
    const b = shots[i + 1];
    targetPos.lerpVectors(tmpA.fromArray(a.pos), tmpB.fromArray(b.pos), t);
    targetLook.lerpVectors(tmpA.fromArray(a.target), tmpB.fromArray(b.target), t);
    targetPos.x += input.px * 0.1;
    targetPos.y -= input.py * 0.05;

    cam.position.set(
      damp(cam.position.x, targetPos.x, k, delta),
      damp(cam.position.y, targetPos.y, k, delta),
      damp(cam.position.z, targetPos.z, k, delta),
    );
    look.set(
      damp(look.x, targetLook.x, k, delta),
      damp(look.y, targetLook.y, k, delta),
      damp(look.z, targetLook.z, k, delta),
    );
    cam.lookAt(look);

    // The step's product slides out of the run and turns a little to face the camera.
    const slow = animate ? 3 : 1000;
    const sway = animate ? Math.sin(clock.elapsedTime * 0.7) * 0.04 : 0;
    let lit = 0;
    parts.products.forEach((part, n) => {
      const want = (a.focus === n ? 1 - t : 0) + (b.focus === n ? t : 0);
      part.f = damp(part.f, want, slow, delta);
      const e = part.f * part.f * (3 - 2 * part.f);
      part.obj.position.copy(part.home).addScaledVector(part.focus, e);
      part.obj.rotation.y = part.turn + e * (0.22 + sway);
      if (e > lit) {
        lit = e;
        spotAt.copy(part.obj.position);
      }
    });
    // The run steps back into the dark while a product is out; a soft light follows the product.
    root.environmentIntensity = 0.5 * (1 - 0.45 * lit);
    if (hemi.current) hemi.current.intensity = 0.7 * (1 - 0.45 * lit);
    if (spot.current) {
      spot.current.position.lerpVectors(spotAt, cam.position, 0.4);
      spot.current.position.y += 0.5;
      spot.current.intensity = 6 * lit;
    }

    // Lens follows the shot; desktop keeps the subject right of the copy, phones keep it above.
    const wide = size.width >= 1024;
    const fov = lerp(a.fov, b.fov, t) / (wide ? 1 : 0.8);
    const ox = wide ? Math.round(-size.width * lerp(a.shift, b.shift, t)) : 0;
    const oy = wide ? 0 : Math.round(size.height * 0.15);
    const o = offset.current;
    if (o.w !== size.width || o.h !== size.height || o.x !== ox || o.y !== oy) {
      Object.assign(o, { w: size.width, h: size.height, x: ox, y: oy });
      cam.setViewOffset(size.width, size.height, ox, oy, size.width, size.height);
    }
    if (Math.abs(cam.fov - fov) > 1e-3 || cam.zoom !== 1) {
      cam.fov = fov;
      cam.zoom = 1;
      cam.updateProjectionMatrix();
    }
  });

  return (
    <>
      <hemisphereLight ref={hemi} args={["#22262d", "#7d848f", 0.7]} />
      <pointLight ref={spot} intensity={0} distance={5} decay={2} color="#f4f6fa" />
      <primitive object={scene} />
    </>
  );
}

useGLTF.preload(MODEL, DRACO);
