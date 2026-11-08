"use client";
import {
  DRACO,
  Effects,
  findParts,
  isLite,
  MODEL,
  PRODUCTS,
  Stage,
  type Parts,
} from "@/components/factory/ProductsScene";
import { useGLTF } from "@react-three/drei";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { TURN_LIMIT, type Turn } from "./ProductTile";

// The run from its side and below, so its length lies across the tile, turning about its middle. Three.js axes, as
// in ProductsScene: the run spans x -2.7…2, z -4.8…2.5 and hangs at y 1.6-2.7 under the soffit (y 3.0); the camera
// stays 6 m out at y 0.6, so no turn brings it near a duct.
const PIVOT = new THREE.Vector3(-0.4, 2.1, -1.1);
const FROM = new THREE.Vector3(6.2, -1.5, 0.8); // pivot to camera, at rest
const UP = new THREE.Vector3(0, 1, 0);
const SWAY = 0.3; // how far the view drifts either way by itself
const ACROSS = Math.tan(THREE.MathUtils.degToRad(54) / 2); // half the view's width, as far as a tall tile allows
const { clamp, damp, radToDeg } = THREE.MathUtils;
const lightAt = new THREE.Vector3();

type Props = {
  active: boolean;
  reducedMotion: boolean;
  /** index into PRODUCTS of the product slid out of the run, or -1 */
  featured: number;
  turn: RefObject<Turn>;
  /** a product the mouse is on (`sticky`) or that was tapped; -1 when the mouse leaves the products */
  onPoint: (index: number, sticky: boolean) => void;
};

/** The factory page's run of fifteen duct products under the soffit, in the same room and light, for a tile: it
 *  drifts slowly from side to side, a drag turns it, and the product featured slides out of the run. */
export default function ProductModel({ active, reducedMotion, featured, turn, onPoint }: Props) {
  const [lite] = useState(isLite);
  const [ready, setReady] = useState(false);
  return (
    <div className="size-full transition-opacity duration-700" style={{ opacity: ready ? 1 : 0 }}>
      <Canvas
        frameloop={active ? "always" : "never"}
        dpr={[1, lite ? 1.5 : 1.75]}
        shadows="percentage"
        flat
        camera={{ position: PIVOT.clone().add(FROM).toArray(), fov: 50, near: 0.05, far: 60 }}
        aria-label="Агаарын суваг, фасон эдлэлийн 3D загвар"
      >
        <Stage />
        <Suspense fallback={null}>
          <Rig featured={featured} turn={turn} onPoint={onPoint} animate={!reducedMotion} onReady={setReady} />
        </Suspense>
        <Effects lite={lite} />
      </Canvas>
    </div>
  );
}

/** The index in PRODUCTS of the product a mesh belongs to, or -1 (the soffit, a hanger). */
function productOf(o: THREE.Object3D | null) {
  for (; o; o = o.parent) if (o.name.startsWith("product_")) return PRODUCTS.indexOf(o.name.slice(8));
  return -1;
}

function Rig({
  featured,
  turn,
  onPoint,
  animate,
  onReady,
}: Omit<Props, "active" | "reducedMotion"> & { animate: boolean; onReady: (ready: boolean) => void }) {
  const { scene } = useGLTF(MODEL, DRACO);
  const parts = useRef<Parts | null>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);
  const spot = useRef<THREE.PointLight>(null);
  const view = useRef({ yaw: 0, phase: 0, w: 0, h: 0 });
  useEffect(() => onReady(true), [onReady]);

  useFrame(({ camera, size, scene: root }, delta) => {
    parts.current ??= findParts(scene);
    const cam = camera as THREE.PerspectiveCamera;
    const v = view.current;
    const t = turn.current;

    // It drifts either way by itself, and holds its drift while the visitor turns it.
    if (animate && !t.dragging) v.phase += delta * 0.22;
    const want = clamp(t.yaw + (animate ? Math.sin(v.phase) * SWAY : 0), -TURN_LIMIT, TURN_LIMIT);
    v.yaw = animate ? damp(v.yaw, want, 5, delta) : want;
    cam.position.copy(FROM).applyAxisAngle(UP, v.yaw).add(PIVOT);
    cam.lookAt(PIVOT);

    // The whole run across a wide tile; a tall one (phones) crops its ends rather than shrink it. Lifted a little
    // above the words at the foot.
    if (v.w !== size.width || v.h !== size.height) {
      v.w = size.width;
      v.h = size.height;
      cam.fov = clamp(radToDeg(2 * Math.atan(ACROSS / (size.width / size.height))), 30, 55);
      cam.setViewOffset(size.width, size.height, 0, Math.round(size.height * 0.05), size.width, size.height);
    }

    // The product featured slides out of the run and turns a little; a soft light follows it while the rest of the
    // run steps back into the dark.
    const k = animate ? 4 : 1000;
    let lit = 0;
    parts.current.products.forEach((part, n) => {
      part.f = damp(part.f, n === featured ? 1 : 0, k, delta);
      const e = part.f * part.f * (3 - 2 * part.f);
      part.obj.position.copy(part.home).addScaledVector(part.focus, e);
      part.obj.rotation.y = part.turn + e * 0.22;
      if (e > lit) {
        lit = e;
        lightAt.copy(part.obj.position);
      }
    });
    // a little brighter than the factory page's full-screen stage, to read at a tile's size on a white page
    root.environmentIntensity = 0.75 * (1 - 0.4 * lit);
    if (hemi.current) hemi.current.intensity = 0.9 * (1 - 0.4 * lit);
    if (spot.current) {
      spot.current.position.lerpVectors(lightAt, cam.position, 0.4);
      spot.current.position.y += 0.5;
      spot.current.intensity = 6 * lit;
    }
  });

  return (
    <>
      <hemisphereLight ref={hemi} args={["#22262d", "#7d848f", 0.7]} />
      <pointLight ref={spot} intensity={0} distance={5} decay={2} color="#f4f6fa" />
      <primitive
        object={scene}
        onPointerMove={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation(); // only the nearest mesh counts, not the soffit behind it
          if (e.nativeEvent.pointerType === "mouse") onPoint(productOf(e.object), true);
        }}
        onPointerOut={(e: ThreeEvent<PointerEvent>) => {
          if (e.nativeEvent.pointerType === "mouse") onPoint(-1, true);
        }}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onPoint(productOf(e.object), false);
        }}
      />
    </>
  );
}
