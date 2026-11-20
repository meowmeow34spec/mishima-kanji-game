/**
 * Salon Mishima 3D - Pooled WebGL Particle & Ambient Steam System
 * File: src/three/ParticleSystem3D.ts
 *
 * Lightweight zero-GC pooled 3D particle system for:
 * - 'coin': Spinning 3D gold coins arcing from counter/customer into the brass tip jar
 * - 'sakura': Fluttering sakura petals & gold sparkles on combos
 * - 'fever': Festive golden-vermilion overdrive celebration burst
 * - 'angry': Comical red steam puffs & sparks when a customer gets angry
 * - 'slash': Dramatic crimson & gold katana slash sparks in Boss Duels
 * Plus continuous gentle ambient coffee/tea steam rising from counter cups.
 */

import * as THREE from 'three';
import type {
  ParticleBurstEvent,
  ParticleBurstKind,
  QualityLevel3D,
} from '../types/three3d';

export type PositionLike3D =
  | THREE.Vector3
  | readonly [number, number, number]
  | { x: number; y: number; z: number };

export interface ParticleSystemOptions {
  tipJarPosition?: PositionLike3D;
  steamSources?: PositionLike3D[];
  quality?: QualityLevel3D;
  ambientSteam?: boolean;
}

type ParticleShapeKind = 'coin' | 'petal' | 'puff' | 'slash' | 'spark' | 'steam';

interface PooledParticle {
  mesh: THREE.Mesh;
  material: THREE.MeshStandardMaterial | THREE.MeshBasicMaterial;
  active: boolean;
  shape: ParticleShapeKind;
  age: number;
  lifetime: number;
  // Linear / ballistic physics
  velocity: THREE.Vector3;
  gravity: number;
  drag: number;
  // Optional Bezier arc mode (used for coins arcing into the tip jar)
  useArc: boolean;
  arcStart: THREE.Vector3;
  arcControl: THREE.Vector3;
  arcEnd: THREE.Vector3;
  // Scale & rotation
  startScale: THREE.Vector3;
  endScale: THREE.Vector3;
  spinVelocity: THREE.Vector3;
  alignToVelocity: boolean;
  swirlPhase: number;
  swirlAmplitude: number;
  baseOpacity: number;
}

const POOL_SIZE = 120;

function toVector3(input: PositionLike3D | undefined, fallback: THREE.Vector3): THREE.Vector3 {
  if (!input) return fallback.clone();
  if (input instanceof THREE.Vector3) return input.clone();
  if (Array.isArray(input)) {
    return new THREE.Vector3(
      Number(input[0]) || 0,
      Number(input[1]) || 0,
      Number(input[2]) || 0
    );
  }
  const obj = input as { x: number; y: number; z: number };
  return new THREE.Vector3(
    Number(obj.x) || 0,
    Number(obj.y) || 0,
    Number(obj.z) || 0
  );
}

export class ParticleSystem3D {
  public readonly root: THREE.Group;

  private readonly pool: PooledParticle[] = [];
  private readonly sharedGeometries: Record<ParticleShapeKind, THREE.BufferGeometry>;
  private readonly tipJarPos = new THREE.Vector3(2.55, 1.24, 0.92);
  private steamSources: THREE.Vector3[] = [
    new THREE.Vector3(-2.15, 1.14, 0.42),
    new THREE.Vector3(2.65, 1.44, 0.32),
  ];

  private quality: QualityLevel3D = 'high';
  private ambientSteamEnabled = true;
  private steamSpawnAccumulator = 0;
  private steamSourceCursor = 0;
  private lastHandledEventId: string | number | null = null;
  private poolCursor = 0;
  private elapsed = 0;

  // Scratch vectors to avoid GC churn in update loop
  private readonly scratchA = new THREE.Vector3();
  private readonly scratchB = new THREE.Vector3();
  private readonly scratchDir = new THREE.Vector3();
  private readonly scratchUp = new THREE.Vector3(0, 1, 0);

  constructor(
    parentScene?: THREE.Scene | THREE.Object3D,
    options?: ParticleSystemOptions
  ) {
    this.root = new THREE.Group();
    this.root.name = 'SalonParticleSystem3D';

    if (options?.tipJarPosition) {
      this.tipJarPos.copy(toVector3(options.tipJarPosition, this.tipJarPos));
    }
    if (options?.steamSources && options.steamSources.length > 0) {
      this.steamSources = options.steamSources.map((s) =>
        toVector3(s, new THREE.Vector3(0, 1.1, 0))
      );
    }
    if (options?.quality) {
      this.quality = options.quality;
    }
    if (options?.ambientSteam !== undefined) {
      this.ambientSteamEnabled = options.ambientSteam;
    }

    this.sharedGeometries = this.createSharedGeometries();
    this.initializePool();

    if (parentScene) {
      parentScene.add(this.root);
    }
  }

  /**
   * Deduplicated handler for `SalonCanvas3DProps.particleEvent`.
   */
  public triggerBurst(event: ParticleBurstEvent | null | undefined): void {
    if (!event) return;
    if (this.lastHandledEventId === event.id) return;
    this.lastHandledEventId = event.id;
    this.emit(event.kind, event.origin);
  }

  /**
   * Alias for `triggerBurst` for ergonomic integration.
   */
  public handleBurstEvent(event: ParticleBurstEvent | null | undefined): void {
    this.triggerBurst(event);
  }

  /**
   * Emits a 3D particle burst at `origin` (or the canonical stage anchor for that kind).
   */
  public emit(kind: ParticleBurstKind, origin?: PositionLike3D): void {
    const density =
      this.quality === 'low' ? 0.55 : this.quality === 'medium' ? 0.8 : 1.0;

    switch (kind) {
      case 'coin': {
        const start = toVector3(origin, new THREE.Vector3(0, 1.32, 0.12));
        const coinCount = Math.max(4, Math.round(9 * density));
        for (let i = 0; i < coinCount; i++) {
          const p = this.acquireSlot('coin', 0xffcf40, true);
          const spreadX = (Math.random() - 0.5) * 0.75;
          const spreadZ = (Math.random() - 0.5) * 0.45;
          const apexHeight = 2.25 + Math.random() * 0.95;

          p.useArc = true;
          p.arcStart.set(
            start.x + (Math.random() - 0.5) * 0.28,
            start.y + Math.random() * 0.12,
            start.z + (Math.random() - 0.5) * 0.2
          );
          p.arcControl.set(
            THREE.MathUtils.lerp(p.arcStart.x, this.tipJarPos.x, 0.45) + spreadX,
            apexHeight,
            THREE.MathUtils.lerp(p.arcStart.z, this.tipJarPos.z, 0.45) + spreadZ
          );
          p.arcEnd.set(
            this.tipJarPos.x + (Math.random() - 0.5) * 0.1,
            this.tipJarPos.y + 0.04,
            this.tipJarPos.z + (Math.random() - 0.5) * 0.1
          );

          p.lifetime = 0.62 + i * 0.045 + Math.random() * 0.12;
          p.startScale.setScalar(0.95 + Math.random() * 0.25);
          p.endScale.setScalar(0.55);
          p.spinVelocity.set(
            8 + Math.random() * 8,
            14 + Math.random() * 10,
            4 + Math.random() * 6
          );
          p.baseOpacity = 1.0;
          p.mesh.position.copy(p.arcStart);
        }

        // Golden celebration sparkles around serve point & tip jar
        const sparkCount = Math.max(4, Math.round(8 * density));
        for (let i = 0; i < sparkCount; i++) {
          const s = this.acquireSlot('spark', i % 2 === 0 ? 0xffe57f : 0xffb300, false);
          s.mesh.position.copy(start);
          const angle = (i / sparkCount) * Math.PI * 2 + Math.random() * 0.5;
          const speed = 1.4 + Math.random() * 1.6;
          s.velocity.set(
            Math.cos(angle) * speed,
            1.6 + Math.random() * 1.8,
            Math.sin(angle) * speed
          );
          s.gravity = 4.2;
          s.drag = 1.8;
          s.lifetime = 0.48 + Math.random() * 0.22;
          s.startScale.setScalar(0.9 + Math.random() * 0.4);
          s.endScale.setScalar(0.05);
          s.spinVelocity.set(3, 7, 5);
          s.baseOpacity = 0.95;
        }
        break;
      }

      case 'sakura': {
        const center = toVector3(origin, new THREE.Vector3(0, 1.55, -0.25));
        const petalCount = Math.max(8, Math.round(18 * density));
        const palette = [0xffb7c5, 0xffd1dc, 0xffe082, 0xff9eb5];
        for (let i = 0; i < petalCount; i++) {
          const isGold = i % 4 === 2;
          const p = this.acquireSlot(
            isGold ? 'spark' : 'petal',
            palette[i % palette.length],
            false
          );
          const angle = Math.random() * Math.PI * 2;
          const radial = 0.6 + Math.random() * 1.9;
          p.mesh.position.set(
            center.x + (Math.random() - 0.5) * 0.5,
            center.y + (Math.random() - 0.5) * 0.3,
            center.z + (Math.random() - 0.5) * 0.4
          );
          p.velocity.set(
            Math.cos(angle) * radial,
            1.35 + Math.random() * 2.1,
            Math.sin(angle) * radial * 0.8
          );
          p.gravity = 1.65;
          p.drag = 1.4;
          p.swirlPhase = Math.random() * Math.PI * 2;
          p.swirlAmplitude = 0.9 + Math.random() * 0.8;
          p.lifetime = 0.95 + Math.random() * 0.55;
          p.startScale.setScalar(0.85 + Math.random() * 0.45);
          p.endScale.setScalar(0.15);
          p.spinVelocity.set(
            3 + Math.random() * 5,
            4 + Math.random() * 6,
            2 + Math.random() * 5
          );
          p.baseOpacity = 0.95;
        }
        break;
      }

      case 'fever': {
        const center = toVector3(origin, new THREE.Vector3(0, 1.5, -0.3));
        const count = Math.max(12, Math.round(28 * density));
        const feverColors = [0xffd54f, 0xff8f00, 0xffb7c5, 0xfff59d, 0xff5252];
        for (let i = 0; i < count; i++) {
          const shape: ParticleShapeKind = i % 3 === 0 ? 'spark' : 'petal';
          const p = this.acquireSlot(
            shape,
            feverColors[i % feverColors.length],
            false
          );
          p.mesh.position.set(
            center.x + (Math.random() - 0.5) * 3.4,
            center.y + (Math.random() - 0.3) * 0.8,
            center.z + (Math.random() - 0.5) * 1.2
          );
          p.velocity.set(
            (Math.random() - 0.5) * 2.6,
            2.1 + Math.random() * 2.8,
            (Math.random() - 0.5) * 1.8
          );
          p.gravity = 1.9;
          p.drag = 1.1;
          p.swirlPhase = Math.random() * Math.PI * 2;
          p.swirlAmplitude = 1.2;
          p.lifetime = 1.05 + Math.random() * 0.6;
          p.startScale.setScalar(1.05 + Math.random() * 0.5);
          p.endScale.setScalar(0.1);
          p.spinVelocity.set(5, 8, 6);
          p.baseOpacity = 1.0;
        }
        break;
      }

      case 'angry': {
        const head = toVector3(origin, new THREE.Vector3(0, 2.08, -0.68));
        const puffCount = Math.max(6, Math.round(11 * density));
        for (let i = 0; i < puffCount; i++) {
          const side = i % 2 === 0 ? 1 : -1;
          const p = this.acquireSlot(
            'puff',
            i % 3 === 0 ? 0xff3b30 : 0xff6b57,
            false
          );
          p.mesh.position.set(
            head.x + side * (0.22 + Math.random() * 0.18),
            head.y + (Math.random() - 0.3) * 0.22,
            head.z + (Math.random() - 0.5) * 0.2
          );
          p.velocity.set(
            side * (1.1 + Math.random() * 1.2),
            1.15 + Math.random() * 1.45,
            (Math.random() - 0.5) * 0.9
          );
          p.gravity = -0.6; // Steam rises!
          p.drag = 2.4;
          p.lifetime = 0.58 + Math.random() * 0.28;
          p.startScale.setScalar(0.55 + Math.random() * 0.3);
          p.endScale.setScalar(1.65 + Math.random() * 0.45);
          p.spinVelocity.set(2, 3, 2);
          p.baseOpacity = 0.88;
        }

        // Sharp comical anger cross-sparks
        const sparkCount = Math.max(4, Math.round(7 * density));
        for (let i = 0; i < sparkCount; i++) {
          const s = this.acquireSlot('slash', 0xff1744, false);
          s.mesh.position.copy(head);
          const angle = (i / sparkCount) * Math.PI * 2;
          const speed = 2.2 + Math.random() * 1.4;
          s.velocity.set(
            Math.cos(angle) * speed,
            0.8 + Math.sin(angle) * speed * 0.7,
            (Math.random() - 0.5) * 1.2
          );
          s.gravity = 2.5;
          s.drag = 3.0;
          s.alignToVelocity = true;
          s.lifetime = 0.34 + Math.random() * 0.14;
          s.startScale.set(0.6, 0.9, 0.6);
          s.endScale.setScalar(0.05);
          s.baseOpacity = 1.0;
        }
        break;
      }

      case 'slash': {
        const target = toVector3(origin, new THREE.Vector3(0, 1.85, -0.88));
        const streakCount = Math.max(10, Math.round(20 * density));
        for (let i = 0; i < streakCount; i++) {
          const isCrimson = i % 2 === 0;
          const p = this.acquireSlot(
            i % 4 === 0 ? 'spark' : 'slash',
            isCrimson ? 0xe51c23 : 0xffd54f,
            false
          );
          // Diagonal katana cleave axis + radial burst
          const diagT = (i / streakCount - 0.5) * 2;
          p.mesh.position.set(
            target.x + diagT * 0.85 + (Math.random() - 0.5) * 0.15,
            target.y + diagT * 0.55 + (Math.random() - 0.5) * 0.15,
            target.z + (Math.random() - 0.5) * 0.25
          );
          p.velocity.set(
            diagT * 3.4 + (Math.random() - 0.5) * 2.4,
            diagT * 2.1 + (Math.random() - 0.3) * 2.2,
            1.2 + Math.random() * 2.2
          );
          p.gravity = 3.8;
          p.drag = 2.2;
          p.alignToVelocity = p.shape === 'slash';
          p.lifetime = 0.36 + Math.random() * 0.24;
          p.startScale.set(
            0.85,
            p.shape === 'slash' ? 1.55 + Math.random() * 0.7 : 1.0,
            0.85
          );
          p.endScale.setScalar(0.05);
          p.spinVelocity.set(6, 10, 8);
          p.baseOpacity = 1.0;
        }
        break;
      }
    }
  }

  public setTipJarPosition(position: PositionLike3D): void {
    this.tipJarPos.copy(toVector3(position, this.tipJarPos));
  }

  public setSteamSources(sources: PositionLike3D[]): void {
    this.steamSources = sources.map((s) =>
      toVector3(s, new THREE.Vector3(0, 1.1, 0))
    );
  }

  public setAmbientSteamEnabled(enabled: boolean): void {
    this.ambientSteamEnabled = enabled;
  }

  public setQuality(quality: QualityLevel3D): void {
    this.quality = quality;
  }

  /**
   * Advances all active pooled particles and spawns gentle ambient coffee steam.
   */
  public update(deltaSeconds: number, elapsedSeconds?: number): void {
    const dt = THREE.MathUtils.clamp(
      Number.isFinite(deltaSeconds) ? deltaSeconds : 1 / 60,
      0.0005,
      0.1
    );
    this.elapsed =
      elapsedSeconds !== undefined && Number.isFinite(elapsedSeconds)
        ? elapsedSeconds
        : this.elapsed + dt;

    // Gentle continuous coffee/matcha steam from counter cups
    if (this.ambientSteamEnabled && this.steamSources.length > 0) {
      const steamInterval =
        this.quality === 'low' ? 0.55 : this.quality === 'medium' ? 0.34 : 0.22;
      this.steamSpawnAccumulator += dt;
      while (this.steamSpawnAccumulator >= steamInterval) {
        this.steamSpawnAccumulator -= steamInterval;
        this.spawnAmbientSteamWisp();
      }
    }

    for (let i = 0; i < this.pool.length; i++) {
      const p = this.pool[i];
      if (!p.active) continue;

      p.age += dt;
      if (p.age >= p.lifetime) {
        p.active = false;
        p.mesh.visible = false;
        continue;
      }

      const t = p.age / p.lifetime;

      if (p.useArc) {
        // Quadratic Bezier trajectory: (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
        const inv = 1 - t;
        this.scratchA
          .copy(p.arcStart)
          .multiplyScalar(inv * inv)
          .addScaledVector(p.arcControl, 2 * inv * t)
          .addScaledVector(p.arcEnd, t * t);
        p.mesh.position.copy(this.scratchA);
      } else {
        // Semi-implicit Euler with drag, gravity, and optional petal swirl
        const dampFactor = Math.max(0, 1 - p.drag * dt);
        p.velocity.multiplyScalar(dampFactor);
        p.velocity.y -= p.gravity * dt;

        p.mesh.position.addScaledVector(p.velocity, dt);
        if (p.swirlAmplitude > 0) {
          const wave = this.elapsed * 4.2 + p.swirlPhase;
          p.mesh.position.x += Math.sin(wave) * p.swirlAmplitude * dt;
          p.mesh.position.z += Math.cos(wave * 0.85) * p.swirlAmplitude * 0.6 * dt;
        }
      }

      // Scale interpolation (quick pop-in during first 12%, smooth taper afterward)
      const popIn = t < 0.12 ? t / 0.12 : 1.0;
      this.scratchB.lerpVectors(p.startScale, p.endScale, t).multiplyScalar(popIn);
      p.mesh.scale.copy(this.scratchB);

      // Orientation
      if (p.alignToVelocity && p.velocity.lengthSq() > 0.001) {
        this.scratchDir.copy(p.velocity).normalize();
        p.mesh.quaternion.setFromUnitVectors(this.scratchUp, this.scratchDir);
      } else {
        p.mesh.rotation.x += p.spinVelocity.x * dt;
        p.mesh.rotation.y += p.spinVelocity.y * dt;
        p.mesh.rotation.z += p.spinVelocity.z * dt;
      }

      // Smooth fade out
      let alpha = p.baseOpacity;
      if (p.shape === 'steam') {
        alpha = p.baseOpacity * Math.sin(t * Math.PI);
      } else if (t > 0.68) {
        alpha = p.baseOpacity * (1 - (t - 0.68) / 0.32);
      }
      p.material.opacity = THREE.MathUtils.clamp(alpha, 0, 1);
    }
  }

  public clear(): void {
    for (const p of this.pool) {
      p.active = false;
      p.mesh.visible = false;
    }
  }

  public dispose(): void {
    this.clear();
    if (this.root.parent) {
      this.root.parent.remove(this.root);
    }
    for (const p of this.pool) {
      p.material.dispose();
    }
    for (const key of Object.keys(this.sharedGeometries) as ParticleShapeKind[]) {
      this.sharedGeometries[key].dispose();
    }
  }

  private spawnAmbientSteamWisp(): void {
    const source =
      this.steamSources[this.steamSourceCursor % this.steamSources.length];
    this.steamSourceCursor = (this.steamSourceCursor + 1) % this.steamSources.length;

    const p = this.acquireSlot('steam', 0xfffaf2, false);
    p.mesh.position.set(
      source.x + (Math.random() - 0.5) * 0.08,
      source.y + 0.02,
      source.z + (Math.random() - 0.5) * 0.08
    );
    p.velocity.set(
      (Math.random() - 0.5) * 0.08,
      0.28 + Math.random() * 0.16,
      (Math.random() - 0.5) * 0.08
    );
    p.gravity = -0.05;
    p.drag = 0.35;
    p.swirlPhase = Math.random() * Math.PI * 2;
    p.swirlAmplitude = 0.18;
    p.lifetime = 1.8 + Math.random() * 0.8;
    p.startScale.setScalar(0.32);
    p.endScale.setScalar(1.15);
    p.spinVelocity.set(0.4, 0.9, 0.3);
    p.baseOpacity = 0.26;
  }

  private createSharedGeometries(): Record<ParticleShapeKind, THREE.BufferGeometry> {
    // 1. Gleaming 3D gold coin disc
    const coin = new THREE.CylinderGeometry(0.11, 0.11, 0.028, 14);

    // 2. Curved sakura petal diamond
    const petal = new THREE.CircleGeometry(0.085, 6);
    petal.scale(0.75, 1.25, 1.0);

    // 3. Soft low-poly steam/anger cloud puff
    const puff = new THREE.IcosahedronGeometry(0.14, 1);

    // 4. Elongated katana slash shard
    const slash = new THREE.OctahedronGeometry(0.065, 0);
    slash.scale(0.42, 3.4, 0.42);

    // 5. Starry golden sparkle octahedron
    const spark = new THREE.OctahedronGeometry(0.075, 0);

    // 6. Gentle rising coffee steam puff
    const steam = new THREE.DodecahedronGeometry(0.095, 0);

    return { coin, petal, puff, slash, spark, steam };
  }

  private initializePool(): void {
    for (let i = 0; i < POOL_SIZE; i++) {
      // Reserve first 24 slots with metallic StandardMaterial for shiny 3D coins,
      // remaining slots with crisp unlit BasicMaterial for vivid glowing sparks/petals/steam
      const isMetallicSlot = i < 24;
      const material = isMetallicSlot
        ? new THREE.MeshStandardMaterial({
            color: 0xffcf40,
            emissive: 0x8c5a00,
            emissiveIntensity: 0.35,
            roughness: 0.22,
            metalness: 0.85,
            transparent: true,
            opacity: 1,
          })
        : new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 1,
            side: THREE.DoubleSide,
            depthWrite: false,
          });

      const mesh = new THREE.Mesh(
        isMetallicSlot ? this.sharedGeometries.coin : this.sharedGeometries.petal,
        material
      );
      mesh.visible = false;
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      this.root.add(mesh);

      this.pool.push({
        mesh,
        material,
        active: false,
        shape: isMetallicSlot ? 'coin' : 'petal',
        age: 0,
        lifetime: 1,
        velocity: new THREE.Vector3(),
        gravity: 0,
        drag: 0,
        useArc: false,
        arcStart: new THREE.Vector3(),
        arcControl: new THREE.Vector3(),
        arcEnd: new THREE.Vector3(),
        startScale: new THREE.Vector3(1, 1, 1),
        endScale: new THREE.Vector3(1, 1, 1),
        spinVelocity: new THREE.Vector3(),
        alignToVelocity: false,
        swirlPhase: 0,
        swirlAmplitude: 0,
        baseOpacity: 1,
      });
    }
  }

  private acquireSlot(
    shape: ParticleShapeKind,
    colorHex: number,
    preferMetallic: boolean
  ): PooledParticle {
    const startIndex = preferMetallic ? 0 : 24;
    const endIndex = preferMetallic ? 24 : POOL_SIZE;
    let chosen: PooledParticle | null = null;

    for (let offset = 0; offset < endIndex - startIndex; offset++) {
      const idx =
        startIndex + ((this.poolCursor + offset) % (endIndex - startIndex));
      if (!this.pool[idx].active) {
        chosen = this.pool[idx];
        this.poolCursor = idx + 1;
        break;
      }
    }

    if (!chosen) {
      const fallbackIdx =
        startIndex + (this.poolCursor % (endIndex - startIndex));
      this.poolCursor++;
      chosen = this.pool[fallbackIdx];
    }

    chosen.active = true;
    chosen.shape = shape;
    chosen.age = 0;
    chosen.lifetime = 1;
    chosen.velocity.set(0, 0, 0);
    chosen.gravity = 0;
    chosen.drag = 0;
    chosen.useArc = false;
    chosen.startScale.set(1, 1, 1);
    chosen.endScale.set(1, 1, 1);
    chosen.spinVelocity.set(0, 0, 0);
    chosen.alignToVelocity = false;
    chosen.swirlPhase = 0;
    chosen.swirlAmplitude = 0;
    chosen.baseOpacity = 1;

    chosen.mesh.geometry = this.sharedGeometries[shape];
    chosen.material.color.setHex(colorHex);
    chosen.material.opacity = 1;
    chosen.mesh.rotation.set(0, 0, 0);
    chosen.mesh.scale.set(1, 1, 1);
    chosen.mesh.visible = true;

    return chosen;
  }
}
