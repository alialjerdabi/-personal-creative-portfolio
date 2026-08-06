"use client";

import { Suspense, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Canvas, extend, useFrame, type ThreeElement } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import * as THREE from "three";

extend({ MeshLineGeometry, MeshLineMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    meshLineGeometry: ThreeElement<typeof MeshLineGeometry>;
    meshLineMaterial: ThreeElement<typeof MeshLineMaterial>;
  }
}

export interface LanyardIdentity {
  name: string;
  role: string;
  location: string;
  /** Optional headshot for the front face. */
  photo?: string;
  /** Optional mark for the reverse. */
  mark?: string;
}

const CARD_W = 1024;
const CARD_H = 1440;

/**
 * The card faces, drawn on a canvas rather than loaded from a GLB.
 *
 * React Bits' Lanyard ships a `card.glb` and paints custom images into its
 * baked texture atlas. That model isn't in this repo and can't be
 * fabricated — and drawing the faces instead turns out to be the better
 * trade anyway: the card is Ali's proportions rather than a demo model's,
 * the type is set in the site's own typeface at full resolution, and a
 * photo or mark drops in later without touching the geometry.
 */
function useCardTextures(identity: LanyardIdentity, ground: string, ink: string) {
  const [textures, setTextures] = useState<{
    front: THREE.CanvasTexture;
    back: THREE.CanvasTexture;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;

    const draw = async () => {
      const load = (src?: string) =>
        new Promise<HTMLImageElement | null>((resolve) => {
          if (!src) return resolve(null);
          const image = new window.Image();
          image.crossOrigin = "anonymous";
          image.onload = () => resolve(image);
          image.onerror = () => resolve(null);
          image.src = src;
        });

      const [photo, mark] = await Promise.all([load(identity.photo), load(identity.mark)]);
      if (cancelled) return;

      const face = (paint: (ctx: CanvasRenderingContext2D) => void) => {
        const canvas = document.createElement("canvas");
        canvas.width = CARD_W;
        canvas.height = CARD_H;
        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = ground;
        ctx.fillRect(0, 0, CARD_W, CARD_H);
        paint(ctx);
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = 16;
        texture.needsUpdate = true;
        return texture;
      };

      const front = face((ctx) => {
        // Punch hole, like a real badge.
        ctx.fillStyle = "rgba(0,0,0,0.14)";
        ctx.beginPath();
        ctx.roundRect(CARD_W / 2 - 90, 70, 180, 46, 23);
        ctx.fill();

        const top = 190;
        const size = 620;
        if (photo) {
          const scale = Math.max(size / photo.width, size / photo.height);
          const w = photo.width * scale;
          const h = photo.height * scale;
          ctx.save();
          ctx.beginPath();
          ctx.roundRect((CARD_W - size) / 2, top, size, size, 28);
          ctx.clip();
          ctx.drawImage(photo, (CARD_W - w) / 2, top + (size - h) / 2, w, h);
          ctx.restore();
        } else {
          // No headshot supplied. A labelled empty frame rather than a
          // stock face — the card says what is missing instead of faking it.
          ctx.strokeStyle = "rgba(0,0,0,0.18)";
          ctx.lineWidth = 3;
          ctx.setLineDash([12, 10]);
          ctx.beginPath();
          ctx.roundRect((CARD_W - size) / 2, top, size, size, 28);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillStyle = "rgba(0,0,0,0.32)";
          ctx.font = "500 34px system-ui, sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("photo", CARD_W / 2, top + size / 2 + 12);
        }

        ctx.textAlign = "center";
        ctx.fillStyle = ink;
        ctx.font = "800 84px system-ui, sans-serif";
        ctx.fillText(identity.name, CARD_W / 2, top + size + 130);

        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.font = "500 42px system-ui, sans-serif";
        ctx.fillText(identity.role, CARD_W / 2, top + size + 200);
        ctx.fillText(identity.location, CARD_W / 2, top + size + 262);
      });

      const back = face((ctx) => {
        if (mark) {
          const size = 460;
          const scale = Math.min(size / mark.width, size / mark.height);
          ctx.drawImage(
            mark,
            (CARD_W - mark.width * scale) / 2,
            (CARD_H - mark.height * scale) / 2,
            mark.width * scale,
            mark.height * scale
          );
          return;
        }
        // The mark drawn in code — the same rising-sun rule as the nav, so
        // the reverse is never blank while the real file is outstanding.
        const cx = CARD_W / 2;
        const cy = CARD_H / 2;
        ctx.strokeStyle = ink;
        ctx.lineWidth = 16;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(cx - 210, cy + 90);
        ctx.lineTo(cx + 210, cy + 90);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy + 90, 150, Math.PI, 0);
        ctx.stroke();
        for (let i = -2; i <= 2; i += 1) {
          const angle = (Math.PI / 2) + (i * Math.PI) / 7;
          ctx.beginPath();
          ctx.moveTo(cx - Math.cos(angle) * 185, cy + 90 - Math.sin(angle) * 185);
          ctx.lineTo(cx - Math.cos(angle) * 245, cy + 90 - Math.sin(angle) * 245);
          ctx.stroke();
        }
      });

      setTextures({ front, back });
    };

    draw();
    return () => {
      cancelled = true;
    };
  }, [identity, ground, ink]);

  return textures;
}

/** The strap: the name repeated along it, the way a real lanyard prints. */
function useBandTexture(label: string, ground: string, ink: string) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 64;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = ground;
    ctx.fillRect(0, 0, 512, 64);
    ctx.fillStyle = ink;
    ctx.font = "700 26px system-ui, sans-serif";
    ctx.textBaseline = "middle";
    ctx.fillText(label.toUpperCase(), 26, 34);
    ctx.fillText("—", 330, 34);
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, [label, ground, ink]);
}

function Band({
  identity,
  ground,
  ink,
  bandGround,
}: {
  identity: LanyardIdentity;
  ground: string;
  ink: string;
  bandGround: string;
}) {
  const maxSpeed = 50;
  const minSpeed = 0;

  const band = useRef<THREE.Mesh>(null);
  const fixed = useRef<RapierRigidBody>(null);
  const j1 = useRef<RapierRigidBody>(null);
  const j2 = useRef<RapierRigidBody>(null);
  const j3 = useRef<RapierRigidBody>(null);
  const card = useRef<RapierRigidBody>(null);

  const vec = useMemo(() => new THREE.Vector3(), []);
  const ang = useMemo(() => new THREE.Vector3(), []);
  const rot = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);
  const lerped = useRef(new Map<number, THREE.Vector3>());

  const segment = {
    type: "dynamic" as const,
    canSleep: true,
    colliders: false as const,
    angularDamping: 4,
    linearDamping: 4,
  };

  const textures = useCardTextures(identity, ground, ink);
  const bandTexture = useBandTexture(identity.name, bandGround, ground);

  const [curve] = useState(() => {
    const created = new THREE.CatmullRomCurve3([
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
    ]);
    created.curveType = "chordal";
    return created;
  });
  const [dragged, drag] = useState<THREE.Vector3 | false>(false);
  const [hovered, hover] = useState(false);

  // Rapier's joint hooks take non-null ref objects; React refs start null.
  // Cast at the call sites rather than loosening the ref types everywhere —
  // the joints are created after mount, when the bodies do exist.
  type BodyRef = React.RefObject<RapierRigidBody>;
  useRopeJoint(fixed as BodyRef, j1 as BodyRef, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1 as BodyRef, j2 as BodyRef, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2 as BodyRef, j3 as BodyRef, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3 as BodyRef, card as BodyRef, [
    [0, 0, 0],
    [0, 1.5, 0],
  ]);

  useEffect(() => {
    if (!hovered) return;
    document.body.style.cursor = dragged ? "grabbing" : "grab";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged && card.current) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }

    if (!fixed.current || !j1.current || !j2.current || !j3.current || !card.current) return;

    [j1, j2].forEach((ref, index) => {
      const body = ref.current!;
      const current = lerped.current.get(index) ?? new THREE.Vector3().copy(body.translation());
      const clamped = Math.max(0.1, Math.min(1, current.distanceTo(body.translation())));
      current.lerp(body.translation(), delta * (minSpeed + clamped * (maxSpeed - minSpeed)));
      lerped.current.set(index, current);
    });

    curve.points[0].copy(j3.current.translation());
    curve.points[1].copy(lerped.current.get(1)!);
    curve.points[2].copy(lerped.current.get(0)!);
    curve.points[3].copy(fixed.current.translation());

    const geometry = band.current?.geometry as unknown as {
      setPoints: (points: THREE.Vector3[]) => void;
    };
    geometry?.setPoints(curve.getPoints(32));

    ang.copy(card.current.angvel() as THREE.Vector3);
    rot.copy(card.current.rotation() as unknown as THREE.Vector3);
    card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true);
  });

  return (
    <>
      {/*
        The anchor sits at y=2.7, not y=4. At fov 25 from z=19 the visible
        height at the origin is about 8.4 units; anchored at 4 the card
        hung above the top of that frustum, which is why it was cropped
        out of frame however large the container got.
      */}
      <group position={[0, 2.7, 0]}>
        <RigidBody ref={fixed} {...segment} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segment}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segment}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segment}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segment}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={1.8}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(event) => {
              (event.target as Element).releasePointerCapture(event.pointerId);
              drag(false);
            }}
            onPointerDown={(event) => {
              (event.target as Element).setPointerCapture(event.pointerId);
              drag(
                new THREE.Vector3()
                  .copy(event.point)
                  .sub(vec.copy(card.current!.translation()))
              );
            }}
          >
            {/* Front face */}
            <RoundedBox args={[1.6, 2.25, 0.04]} radius={0.07} smoothness={4}>
              <meshStandardMaterial
                map={textures?.front ?? null}
                color={textures ? "#ffffff" : ground}
                roughness={0.62}
                metalness={0.05}
              />
            </RoundedBox>
            {/* Reverse, a hair behind so both faces read while it spins */}
            <mesh position={[0, 0, -0.023]} rotation={[0, Math.PI, 0]}>
              <planeGeometry args={[1.6, 2.25]} />
              <meshStandardMaterial
                map={textures?.back ?? null}
                color={textures ? "#ffffff" : ground}
                roughness={0.66}
              />
            </mesh>
            {/* The clip */}
            <mesh position={[0, 1.22, 0]}>
              <torusGeometry args={[0.12, 0.035, 12, 24, Math.PI]} />
              <meshStandardMaterial color="#b9b2a4" metalness={0.9} roughness={0.3} />
            </mesh>
          </group>
        </RigidBody>
      </group>

      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          args={[{ resolution: new THREE.Vector2(1000, 1000) }]}
          color="white"
          depthTest={false}
          resolution={[1000, 1000]}
          useMap={1}
          map={bandTexture}
          repeat={[-4, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  );
}

const FINE = "(hover: hover) and (pointer: fine)";
const REDUCED = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const still = window.matchMedia(REDUCED);
  still.addEventListener("change", onChange);
  return () => still.removeEventListener("change", onChange);
}

/**
 * A hanging ID badge you can pick up and swing.
 *
 * Real rope physics (Rapier) on a real 3D card, per Ali's call. The
 * information on it is duplicated as DOM text by whatever renders this —
 * a name painted onto a texture is invisible to search engines and to
 * assistive technology, so the badge is the delight and never the only
 * place the facts live.
 *
 * Never mounted under reduced motion: the whole component is a physics
 * toy. Touch devices still get it — dragging works with a finger — but
 * the grab cursor only applies to a fine pointer.
 */
export default function Lanyard({
  identity,
  ground = "#fcf9f4",
  ink = "#1a1713",
  bandGround = "#945d00",
  className = "",
  onReady,
}: {
  identity: LanyardIdentity;
  ground?: string;
  ink?: string;
  bandGround?: string;
  className?: string;
  /** Fired once WebGL is up, so a caller can retire a static fallback. */
  onReady?: () => void;
}) {
  const [generation, setGeneration] = useState(0);
  const allowed = useSyncExternalStore(
    subscribe,
    () => !window.matchMedia(REDUCED).matches,
    () => false
  );

  if (!allowed) return null;

  return (
    /* h-full matters: R3F sizes its canvas to this element, and with no
       height it collapsed to the canvas default of 150px inside a 558px
       stage — which is why the badge looked blank. */
    <div className={`relative h-full w-full ${className}`.trim()}>
      <Canvas
        key={generation}
        camera={{ position: [0, 0, 19], fov: 25 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: "default" }}
        onCreated={({ gl }) => {
          /*
           * WebGL contexts are a finite, shared resource — the browser
           * evicts the oldest when it runs short, and a lost context
           * renders nothing at all while throwing no error a component
           * can catch. Measured on this page: `isContextLost()` true and
           * zero painted pixels. Remounting on loss is the only reliable
           * recovery; `preventDefault` on the loss event is what makes
           * the browser willing to restore one.
           */
          onReady?.();
          const canvas = gl.domElement;
          const onLost = (event: Event) => {
            event.preventDefault();
            setGeneration((value) => value + 1);
          };
          canvas.addEventListener("webglcontextlost", onLost);
        }}
      >
        {/*
          Plain lights instead of drei's <Environment> with lightformers.
          That rig renders a cube map into its own targets every frame to
          light one card — memory and GPU work this scene does not need,
          on a page already asking the browser for a context it was
          reluctant to give.
        */}
        <ambientLight intensity={1.6} />
        <directionalLight position={[3, 6, 8]} intensity={2.2} />
        <directionalLight position={[-5, -2, 4]} intensity={0.8} />
        {/*
          <Physics> loads Rapier's WASM asynchronously and SUSPENDS while
          it does. Without a boundary the suspension propagates up through
          the Canvas and the whole subtree renders nothing at all — which
          looks identical to a broken component and is almost certainly
          why the badge appeared dead rather than merely mis-sized.
        */}
        <Suspense fallback={null}>
          <Physics gravity={[0, -40, 0]} timeStep={1 / 60}>
            <Band identity={identity} ground={ground} ink={ink} bandGround={bandGround} />
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  );
}

export { FINE };
