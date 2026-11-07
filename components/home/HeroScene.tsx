"use client";
import { Environment, Lightformer, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer, SSAO, ToneMapping } from "@react-three/postprocessing";
import type { MotionValue } from "motion/react";
import { ToneMappingMode } from "postprocessing";
import { Suspense, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { heroScenes, type HeroSceneConfig } from "./heroScenes";

RectAreaLightUniformsLib.init();

// Each scene's model, light and shots live in heroScenes.ts; this component draws whichever it is given.
const DRACO = "/draco/"; // three's Draco decoder, copied into public/draco/

type Input = { dragging: boolean; lastX: number; yaw: number; px: number; py: number };

type SceneProps = {
  config: HeroSceneConfig;
  progress: MotionValue<number>;
  active: boolean;
  reducedMotion: boolean;
};

export default function HeroScene({ config, progress, active, reducedMotion }: SceneProps) {
  const { mood, sun, shots } = config;
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
        camera={{ position: shots[0].pos, fov: shots[0].fov, near: 0.05, far: 160 }}
        fallback={
          <p className="flex size-full items-center justify-center text-step-small text-soft">
            Таны хөтөч 3D дүрслэлийг дэмжихгүй байна.
          </p>
        }
        aria-label={config.label}
      >
        <Environment resolution={256} environmentIntensity={0.9}>
          <color attach="background" args={[mood.background]} />
          {/* the window wall, the white ceiling and a warm floor bounce, as seen by reflections */}
          <Lightformer intensity={5} position={[-9, 1.5, 0]} rotation-y={Math.PI / 2} scale={[12, 3, 1]} color={mood.daylight} />
          <Lightformer intensity={1.2} position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[10, 8, 1]} color="#fff4e6" />
          <Lightformer intensity={0.8} position={[0, -3, 0]} rotation-x={-Math.PI / 2} scale={[10, 8, 1]} color="#c89f7a" />
          <Lightformer intensity={1} position={[9, 2, 0]} rotation-y={-Math.PI / 2} scale={[10, 3, 1]} color="#fff1e0" />
        </Environment>
        {config.fog && <fog attach="fog" args={[config.fog.color, config.fog.near, config.fog.far]} />}
        <hemisphereLight args={["#e6eef8", "#6a5544", 0.7]} />
        {/* low sun through the window wall; the ceiling and walls cast, so it lands in patches */}
        <directionalLight
          castShadow
          position={sun.position}
          intensity={mood.sunIntensity}
          color={mood.sun}
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-sun.extent}
          shadow-camera-right={sun.extent}
          shadow-camera-top={sun.extent}
          shadow-camera-bottom={-sun.extent}
          shadow-camera-near={1}
          shadow-camera-far={sun.far}
          shadow-bias={-0.0003}
          shadow-normalBias={0.03}
          shadow-radius={4}
        />
        {config.interior && (
          <>
            {/* soft daylight from the glazing */}
            <rectAreaLight position={[-5.0, 1.5, 0]} rotation={[0, -Math.PI / 2, 0]} width={8} height={2.6} intensity={2.2} color={mood.daylight} />
            {/* pools under the lamps, and a work light in the plenum */}
            <pointLight position={[-1.2, 2.05, 0]} intensity={4} distance={4.5} color={mood.pendant} />
            <pointLight position={[1.75, 2.15, 0.6]} intensity={2.5} distance={3.5} color={mood.pendant} />
            <pointLight position={[0, 3.6, 1.5]} intensity={3} distance={6} color="#f4f1ec" />
          </>
        )}

        <Suspense fallback={null}>
          <Rig model={config.model} shots={shots} progress={progress} inputRef={input} animate={!reducedMotion} />
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

// scratch vectors, rewritten every frame; each Rig keeps its own look target
const targetPos = new THREE.Vector3();
const targetLook = new THREE.Vector3();
const tmpA = new THREE.Vector3();
const tmpB = new THREE.Vector3();
const { damp, clamp, lerp } = THREE.MathUtils;

/** Blender stores offsets Z-up; three.js is Y-up. */
const toThree = (v: unknown) =>
  Array.isArray(v) && v.length === 3
    ? new THREE.Vector3(Number(v[0]), Number(v[2]), -Number(v[1]))
    : new THREE.Vector3();

// Shadows: everything solid casts except the feature ceiling and the slab (they would black out
// the plenum); the room shell casts too, which is what keeps the sun to patches by the windows.
const NO_CAST = new Set(["ceiling_reveal", "slab", "glass", "meeting_glass", "city"]);
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

  // Each slat or ceiling tile gets its own material so it can fade on its own beat, centre out.
  const ceiling = (scene.getObjectByName("ceiling_reveal")?.children ?? []).map((piece) => {
    const mesh = piece as THREE.Mesh;
    const material = (mesh.material as THREE.MeshStandardMaterial).clone();
    mesh.material = material;
    return { mesh, material, home: piece.position.clone(), delay: Math.min(Math.abs(piece.position.x) / 3.3, 1) };
  });

  // Exploded-view parts carry their offsets from Blender as glTF extras.
  const exploding: { obj: THREE.Object3D; home: THREE.Vector3; sys: THREE.Vector3; ahu: THREE.Vector3; delay: number }[] = [];
  const fading: THREE.Material[] = [];
  // the AHU's fan, plus any other fan the model marks to spin (the kindergarten's unit has two)
  const fans: THREE.Object3D[] = [];
  scene.traverse((o) => {
    const d = o.userData;
    if (o.name === "ahu_fan" || d.spin) fans.push(o);
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
    ceiling,
    exploding,
    fading,
    slab,
    slabMaterial,
    door: scene.getObjectByName("ahu_door"),
    fans,
  };
}

/** 0..1 for one part of a staggered move: later parts start later and finish together. */
const staged = (amount: number, delay: number) => {
  const o = clamp(amount * 1.5 - delay * 0.5, 0, 1);
  return o * o * (3 - 2 * o);
};

function Rig({
  model,
  shots,
  progress,
  inputRef,
  animate,
}: {
  model: string;
  shots: HeroSceneConfig["shots"];
  progress: MotionValue<number>;
  inputRef: RefObject<Input>;
  animate: boolean;
}) {
  const { scene } = useGLTF(model, DRACO);
  const lookRef = useRef(new THREE.Vector3().fromArray(shots[0].target));
  const group = useRef<THREE.Group>(null);
  const offset = useRef({ w: 0, h: 0, x: 0, y: 0 });
  const state = useRef({ ceiling: 1, slab: 1, sys: 0, ahu: 0 });
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
    const look = lookRef.current;
    look.set(
      damp(look.x, targetLook.x, k, delta),
      damp(look.y, targetLook.y, k, delta),
      damp(look.z, targetLook.z, k, delta),
    );
    cam.lookAt(look);

    // Ceiling, slab and the exploded views ease towards the current step's state.
    const s = state.current;
    const slow = animate ? 2 : 1000;
    s.ceiling = damp(s.ceiling, lerp(a.ceiling, b.ceiling, t), slow, delta);
    s.slab = damp(s.slab, lerp(a.slab, b.slab, t), k, delta);
    s.sys = damp(s.sys, lerp(a.sys, b.sys, t), slow, delta);
    s.ahu = damp(s.ahu, lerp(a.ahu, b.ahu, t), slow, delta);

    const hidden = 1 - s.ceiling;
    for (const piece of parts.ceiling) {
      const e = staged(hidden, piece.delay);
      piece.mesh.position.set(piece.home.x, piece.home.y + e * 0.18, piece.home.z);
      piece.material.opacity = 1 - e;
      piece.material.transparent = e > 0.001;
      piece.material.depthWrite = e < 0.5;
      piece.mesh.visible = e < 0.99;
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
    if (animate) for (const fan of parts.fans) fan.rotation.z += delta * (1 + s.ahu * 6);

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

// the first scene loads with the page; the others are mounted (and so fetched) a scene ahead of being seen
useGLTF.preload(heroScenes[0].model, DRACO);
