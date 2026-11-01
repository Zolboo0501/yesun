"use client";
import { Environment, Lightformer, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer, SSAO, ToneMapping } from "@react-three/postprocessing";
import type { MotionValue } from "motion/react";
import { ToneMappingMode } from "postprocessing";
import { Suspense, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";

RectAreaLightUniformsLib.init();

// Built by scripts/office_hvac.py in Blender: an office under a walnut slat ceiling, and the HVAC above it.
const MODEL = "/models/hvac/office.glb";
const DRACO = "/draco/";

type Vec = [number, number, number];
type Shot = {
  pos: Vec;
  target: Vec;
  fov: number;
  /** how far right of the copy the subject sits on desktop, as a share of the width */
  shift: number;
  /** walnut slats in place (1) or faded out to show the ducts above (0) */
  slats: number;
  /** concrete slab shown (1) or faded out for views from above (0) */
  slab: number;
  /** whole HVAC system pulled apart into its components (1) */
  sys: number;
  /** air handling unit opened up: casing off, fan, motor, coil and filter drawn out (1) */
  ahu: number;
};
// One camera shot per story step, in the order Hero renders them. Every camera
// sits outside the room or above the slab, so moving between shots never cuts through a wall.
const shots: Shot[] = [
  { pos: [1.4, 1.55, 6.2], target: [-0.9, 2.0, -1.0], fov: 46, shift: 0.06, slats: 1, slab: 1, sys: 0, ahu: 0 },
  { pos: [7.4, 11.2, 10.4], target: [-0.6, 4.0, 0], fov: 32, shift: 0.17, slats: 1, slab: 0, sys: 1, ahu: 0 },
  { pos: [2.7, 4.4, 1.7], target: [0.75, 3.42, -0.15], fov: 34, shift: 0.15, slats: 1, slab: 0, sys: 0, ahu: 0 },
  { pos: [-1.3, 4.15, 5.6], target: [-2.75, 3.75, 0.3], fov: 40, shift: 0.17, slats: 1, slab: 0, sys: 0, ahu: 1 },
  { pos: [2.2, 1.3, 5.2], target: [0.4, 3.0, 0.5], fov: 44, shift: 0.12, slats: 0, slab: 1, sys: 0, ahu: 0 },
  { pos: [-2.6, 1.6, 6.4], target: [0.2, 1.85, -1.0], fov: 46, shift: 0.06, slats: 1, slab: 1, sys: 0, ahu: 0 },
];

type Input = { dragging: boolean; lastX: number; yaw: number; px: number; py: number };

type SceneProps = {
  progress: MotionValue<number>;
  active: boolean;
  reducedMotion: boolean;
};

export default function HeroScene({ progress, active, reducedMotion }: SceneProps) {
  // Mouse drag turns the room a little; touch is left alone so the page still scrolls.
  const input = useRef<Input>({ dragging: false, lastX: 0, yaw: 0, px: 0, py: 0 });
  // Phones and small screens skip ambient occlusion and multisampling.
  const [lite] = useState(
    () => window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768,
  );

  return (
    <div
      className="size-full cursor-grab active:cursor-grabbing"
      onPointerDown={(e) => {
        if (e.pointerType !== "mouse") return;
        input.current.dragging = true;
        input.current.lastX = e.clientX;
      }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const rect = e.currentTarget.getBoundingClientRect();
        input.current.px = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        input.current.py = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        if (!input.current.dragging) return;
        input.current.yaw += (e.clientX - input.current.lastX) * 0.003;
        input.current.lastX = e.clientX;
      }}
      onPointerUp={() => (input.current.dragging = false)}
      onPointerLeave={() => {
        input.current.dragging = false;
        input.current.px = input.current.py = 0;
      }}
    >
      <Canvas
        frameloop={active ? "always" : "never"}
        dpr={[1, lite ? 1.5 : 1.75]}
        shadows="percentage"
        flat
        camera={{ position: shots[0].pos, fov: shots[0].fov, near: 0.05, far: 80 }}
        fallback={
          <p className="flex size-full items-center justify-center text-step-small text-soft">
            Таны хөтөч 3D дүрслэлийг дэмжихгүй байна.
          </p>
        }
        aria-label="Цонхоор нар тусах оффис, модон сороот тааз, таазны дээрх агаар сэлгэлт, хөргөлтийн систем"
      >
        <Environment resolution={256} environmentIntensity={0.9}>
          <color attach="background" args={["#8f8a83"]} />
          {/* the window wall, the white ceiling and a warm floor bounce, as seen by reflections */}
          <Lightformer intensity={5} position={[-9, 1.5, 0]} rotation-y={Math.PI / 2} scale={[12, 3, 1]} color="#eef4ff" />
          <Lightformer intensity={1.2} position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[10, 8, 1]} color="#fff4e6" />
          <Lightformer intensity={0.8} position={[0, -3, 0]} rotation-x={-Math.PI / 2} scale={[10, 8, 1]} color="#c89f7a" />
          <Lightformer intensity={1} position={[9, 2, 0]} rotation-y={-Math.PI / 2} scale={[10, 3, 1]} color="#fff1e0" />
        </Environment>
        <hemisphereLight args={["#e6eef8", "#6a5544", 0.7]} />
        {/* low sun through the window wall; the ceiling and walls cast, so it lands in patches */}
        <directionalLight
          castShadow
          position={[-12, 6.5, 2.5]}
          intensity={3.8}
          color="#fff2df"
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-8}
          shadow-camera-right={8}
          shadow-camera-top={8}
          shadow-camera-bottom={-8}
          shadow-camera-near={1}
          shadow-camera-far={30}
          shadow-bias={-0.0003}
          shadow-normalBias={0.03}
          shadow-radius={4}
        />
        {/* soft daylight from the glazing */}
        <rectAreaLight position={[-5.0, 1.5, 0]} rotation={[0, -Math.PI / 2, 0]} width={8} height={2.6} intensity={2.2} color="#eaf1ff" />
        {/* warm pools under the pendants, and a work light in the plenum */}
        <pointLight position={[-1.2, 2.05, 0]} intensity={4} distance={4.5} color="#ffcf94" />
        <pointLight position={[1.75, 2.15, 0.6]} intensity={2.5} distance={3.5} color="#ffcf94" />
        <pointLight position={[0, 3.6, 1.5]} intensity={3} distance={6} color="#f4f1ec" />

        <Suspense fallback={null}>
          <Rig progress={progress} inputRef={input} animate={!reducedMotion} />
        </Suspense>

        {lite ? (
          <EffectComposer multisampling={0}>
            <Bloom mipmapBlur intensity={0.5} luminanceThreshold={0.9} luminanceSmoothing={0.2} />
            <ToneMapping mode={ToneMappingMode.AGX} />
          </EffectComposer>
        ) : (
          <EffectComposer multisampling={4} enableNormalPass>
            {/* postprocessing's own SSAO: n8ao 2.0.1 crashes on three 0.187 */}
            <SSAO
              samples={16}
              rings={4}
              radius={0.08}
              intensity={22}
              bias={0.03}
              luminanceInfluence={0.55}
              worldDistanceThreshold={1.2}
              worldDistanceFalloff={0.4}
              worldProximityThreshold={0.5}
              worldProximityFalloff={0.15}
              resolutionScale={0.5}
            />
            <Bloom mipmapBlur intensity={0.55} luminanceThreshold={0.9} luminanceSmoothing={0.2} />
            <ToneMapping mode={ToneMappingMode.AGX} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}

const targetPos = new THREE.Vector3();
const targetLook = new THREE.Vector3();
const look = new THREE.Vector3(...shots[0].target);
const tmpA = new THREE.Vector3();
const tmpB = new THREE.Vector3();
const { damp, clamp, lerp } = THREE.MathUtils;

/** Blender stores offsets Z-up; three.js is Y-up. */
const toThree = (v: unknown) =>
  Array.isArray(v) && v.length === 3
    ? new THREE.Vector3(Number(v[0]), Number(v[2]), -Number(v[1]))
    : new THREE.Vector3();

// Shadows: everything solid casts except the slats and the slab (they would black out the
// plenum); the room shell casts too, which is what keeps the sun to patches by the windows.
const NO_CAST = new Set(["slats", "slab", "glass", "meeting_glass", "city"]);
const NO_RECEIVE = new Set(["glass", "meeting_glass", "city"]);

type Parts = ReturnType<typeof findParts>;

function findParts(scene: THREE.Object3D) {
  scene.traverse((o) => {
    if (!(o instanceof THREE.Mesh)) return;
    const names = new Set<string>();
    for (let n: THREE.Object3D | null = o; n; n = n.parent) names.add(n.name);
    o.castShadow = ![...NO_CAST].some((k) => names.has(k));
    o.receiveShadow = ![...NO_RECEIVE].some((k) => names.has(k));
    for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
      if (m.name.startsWith("leaf_")) {
        m.alphaTest = 0.5;
        m.transparent = false;
        m.side = THREE.DoubleSide;
      }
      // AgX flattens emissive; lift the monitors so their dashboards read.
      if (m.name === "screen") (m as THREE.MeshStandardMaterial).emissiveIntensity = 2.4;
      if (m.name === "glass") {
        m.depthWrite = false;
        m.side = THREE.DoubleSide;
      }
    }
  });

  // Each slat gets its own material so it can fade on its own beat.
  const slats = (scene.getObjectByName("slats")?.children ?? []).map((slat) => {
    const mesh = slat as THREE.Mesh;
    const material = (mesh.material as THREE.MeshStandardMaterial).clone();
    mesh.material = material;
    return { mesh, material, home: slat.position.clone(), delay: Math.min(Math.abs(slat.position.x) / 3.3, 1) };
  });

  // Exploded-view parts carry their offsets from Blender as glTF extras.
  const exploding: { obj: THREE.Object3D; home: THREE.Vector3; sys: THREE.Vector3; ahu: THREE.Vector3; delay: number }[] = [];
  const fading: THREE.Material[] = [];
  scene.traverse((o) => {
    const d = o.userData;
    if (d.explode_sys || d.explode_ahu) {
      exploding.push({
        obj: o,
        home: o.position.clone(),
        sys: toThree(d.explode_sys),
        ahu: toThree(d.explode_ahu),
        delay: Number(d.delay ?? 0),
      });
    }
    if (d.fade_explode) {
      o.traverse((c) => {
        if (!(c instanceof THREE.Mesh)) return;
        c.material = (c.material as THREE.Material).clone();
        (c.material as THREE.Material).transparent = true;
        fading.push(c.material as THREE.Material);
      });
    }
  });

  const slab = scene.getObjectByName("slab") as THREE.Mesh | undefined;
  const slabMaterial = slab?.material as THREE.MeshStandardMaterial | undefined;
  if (slabMaterial) slabMaterial.transparent = true;
  return {
    slats,
    exploding,
    fading,
    slab,
    slabMaterial,
    door: scene.getObjectByName("ahu_door"),
    fan: scene.getObjectByName("ahu_fan"),
  };
}

/** 0..1 for one part of a staggered move: later parts start later and finish together. */
const staged = (amount: number, delay: number) => {
  const o = clamp(amount * 1.5 - delay * 0.5, 0, 1);
  return o * o * (3 - 2 * o);
};

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
  const group = useRef<THREE.Group>(null);
  const offset = useRef({ w: 0, h: 0, x: 0, y: 0 });
  const state = useRef({ slats: 1, slab: 1, sys: 0, ahu: 0 });
  // The parts the story moves, looked up on the first frame.
  const partsRef = useRef<Parts | null>(null);

  useFrame(({ camera, size }, delta) => {
    partsRef.current ??= findParts(scene);
    const parts = partsRef.current;
    const cam = camera as THREE.PerspectiveCamera;
    const k = animate ? 5 : 1000;
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
    targetPos.x += input.px * 0.12;
    targetPos.y -= input.py * 0.06;

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

    // Slats, slab and the exploded views ease towards the current step's state.
    const s = state.current;
    const slow = animate ? 2 : 1000;
    s.slats = damp(s.slats, lerp(a.slats, b.slats, t), slow, delta);
    s.slab = damp(s.slab, lerp(a.slab, b.slab, t), k, delta);
    s.sys = damp(s.sys, lerp(a.sys, b.sys, t), slow, delta);
    s.ahu = damp(s.ahu, lerp(a.ahu, b.ahu, t), slow, delta);

    const hidden = 1 - s.slats;
    for (const slat of parts.slats) {
      const e = staged(hidden, slat.delay);
      slat.mesh.position.set(slat.home.x, slat.home.y + e * 0.18, slat.home.z);
      slat.material.opacity = 1 - e;
      slat.material.transparent = e > 0.001;
      slat.material.depthWrite = e < 0.5;
      slat.mesh.visible = e < 0.99;
    }
    for (const part of parts.exploding) {
      const es = staged(s.sys, part.delay);
      const ea = staged(s.ahu, part.delay);
      part.obj.position
        .copy(part.home)
        .addScaledVector(part.sys, es)
        .addScaledVector(part.ahu, ea);
    }
    for (const m of parts.fading) m.opacity = 1 - clamp(s.sys * 2, 0, 1);
    if (parts.slab && parts.slabMaterial) {
      parts.slabMaterial.opacity = s.slab;
      parts.slab.visible = s.slab > 0.02;
    }
    if (parts.door) parts.door.rotation.y = -staged(s.ahu, 0.05) * 1.2;
    if (parts.fan && animate) parts.fan.rotation.z += delta * (1 + s.ahu * 6);

    // Released drags ease the room back so every shot frames what it should.
    if (!input.dragging) input.yaw = damp(input.yaw, 0, 2.5, delta);
    if (group.current) group.current.rotation.y = input.yaw;

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
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(MODEL, DRACO);
