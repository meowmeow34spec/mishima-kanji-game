/**
 * Salon Mishima 3D - Responsive Damped Camera Rig Controller
 * File: src/three/CameraRig3D.ts
 *
 * Frame-rate-independent Three.js camera controller supporting all 7 CameraMode3D
 * states, responsive aspect-ratio compensation (16:9 desktop through 9:16 mobile
 * portrait 375x667 / 390x844), trauma shake, zoom punch, and 2D anchor projection.
 */

import * as THREE from 'three';
import type { CameraMode3D, SpeechBubbleAnchor2D } from '../types/three3d';

export interface CameraPreset {
  /** Base vertical FOV in degrees on wide/desktop viewports */
  baseFov: number;
  /** Base distance from lookAt target on standard 16:10 / 16:9 desktop */
  baseDistance: number;
  /** Minimum horizontal world half-width that MUST stay visible at target depth */
  minHorizontalHalfSpan: number;
  /** Downward pitch angle in degrees on desktop */
  pitchDegDesktop: number;
  /** Downward pitch angle in degrees on narrow portrait (< 0.9 aspect) */
  pitchDegPortrait: number;
  /** Horizontal yaw angle in degrees (0 = straight across counter along -Z) */
  yawDeg: number;
  /** Look-at target on desktop */
  targetDesktop: THREE.Vector3;
  /** Look-at target on narrow portrait (lifted slightly so speech bubble + blocks both breathe) */
  targetPortrait: THREE.Vector3;
  /** Exponential smoothing speed (higher = snappier transition) */
  damping: number;
}

const DEG2RAD = Math.PI / 180;

const MODE_PRESETS: Record<CameraMode3D, CameraPreset> = {
  title: {
    baseFov: 42,
    baseDistance: 9.4,
    minHorizontalHalfSpan: 3.1,
    pitchDegDesktop: 22,
    pitchDegPortrait: 26,
    yawDeg: 0,
    targetDesktop: new THREE.Vector3(0, 1.48, -0.85),
    targetPortrait: new THREE.Vector3(0, 1.65, -0.85),
    damping: 3.6,
  },
  map: {
    baseFov: 44,
    baseDistance: 10.6,
    minHorizontalHalfSpan: 3.4,
    pitchDegDesktop: 35,
    pitchDegPortrait: 38,
    yawDeg: 8,
    targetDesktop: new THREE.Vector3(0, 1.25, -0.75),
    targetPortrait: new THREE.Vector3(0, 1.45, -0.75),
    damping: 4.2,
  },
  counter: {
    baseFov: 41,
    baseDistance: 8.65,
    minHorizontalHalfSpan: 2.65,
    pitchDegDesktop: 23.0,
    pitchDegPortrait: 26.0,
    yawDeg: 0,
    targetDesktop: new THREE.Vector3(0, 1.80, -0.14),
    targetPortrait: new THREE.Vector3(0, 1.96, -0.14),
    damping: 6.5,
  },
  build: {
    baseFov: 40,
    baseDistance: 8.35,
    minHorizontalHalfSpan: 2.65,
    pitchDegDesktop: 24.5,
    pitchDegPortrait: 27.0,
    yawDeg: 0,
    targetDesktop: new THREE.Vector3(0, 1.72, 0.04),
    targetPortrait: new THREE.Vector3(0, 1.90, 0.02),
    damping: 6.8,
  },
  rush: {
    baseFov: 43,
    baseDistance: 8.15,
    minHorizontalHalfSpan: 2.65,
    pitchDegDesktop: 22.8,
    pitchDegPortrait: 25.8,
    yawDeg: 0,
    targetDesktop: new THREE.Vector3(0, 1.78, -0.15),
    targetPortrait: new THREE.Vector3(0, 1.95, -0.15),
    damping: 8.5,
  },
  boss: {
    baseFov: 43,
    baseDistance: 8.65,
    minHorizontalHalfSpan: 2.7,
    pitchDegDesktop: 19.0,
    pitchDegPortrait: 22.5,
    yawDeg: 0,
    targetDesktop: new THREE.Vector3(0, 1.76, -0.35),
    targetPortrait: new THREE.Vector3(0, 1.92, -0.35),
    damping: 6.2,
  },
  shop: {
    baseFov: 43,
    baseDistance: 8.9,
    minHorizontalHalfSpan: 2.9,
    pitchDegDesktop: 23.5,
    pitchDegPortrait: 27.0,
    yawDeg: 0,
    targetDesktop: new THREE.Vector3(0, 1.38, -0.65),
    targetPortrait: new THREE.Vector3(0, 1.56, -0.65),
    damping: 4.5,
  },
};

export class CameraRig3D {
  public readonly camera: THREE.PerspectiveCamera;

  private mode: CameraMode3D = 'title';
  private aspect = 16 / 9;
  private elapsed = 0;

  private readonly currentPosition = new THREE.Vector3(0, 5.1, 7.2);
  private readonly currentTarget = new THREE.Vector3(0, 1.36, -0.32);
  private currentFov = 40;

  private readonly desiredPosition = new THREE.Vector3();
  private readonly desiredTarget = new THREE.Vector3();
  private desiredFov = 40;

  // Pointer subtle parallax in [-1, 1]
  private pointerX = 0;
  private pointerY = 0;
  private smoothPointerX = 0;
  private smoothPointerY = 0;

  // Camera shake state
  private shakeIntensity = 0;
  private shakeDuration = 0;
  private shakeTimer = 0;
  private shakeSeed = 0;

  // Zoom / dolly punch spring state
  private zoomPunchOffset = 0;
  private zoomPunchVelocity = 0;

  // Scratch vectors to avoid per-frame allocations
  private readonly scratchLookTarget = new THREE.Vector3();
  private readonly scratchProjected = new THREE.Vector3();

  constructor(camera?: THREE.PerspectiveCamera, initialAspect = 16 / 9) {
    this.aspect = Number.isFinite(initialAspect) && initialAspect > 0.1 ? initialAspect : 16 / 9;
    this.camera =
      camera ?? new THREE.PerspectiveCamera(40, this.aspect, 0.1, 80);
    this.camera.aspect = this.aspect;

    this.computeDesiredGoal(0);
    this.currentPosition.copy(this.desiredPosition);
    this.currentTarget.copy(this.desiredTarget);
    this.currentFov = this.desiredFov;
    this.applyToCamera(0, 0, 0);
  }

  /**
   * Switches active 3D framing mode. Pass `immediate = true` to snap without damping.
   */
  public setMode(mode: CameraMode3D, immediate = false): void {
    const validMode: CameraMode3D = MODE_PRESETS[mode] ? mode : 'counter';
    this.mode = validMode;
    if (immediate) {
      this.computeDesiredGoal(this.elapsed);
      this.currentPosition.copy(this.desiredPosition);
      this.currentTarget.copy(this.desiredTarget);
      this.currentFov = this.desiredFov;
      this.applyToCamera(0, 0, 0);
    }
  }

  public getMode(): CameraMode3D {
    return this.mode;
  }

  /**
   * Updates viewport dimensions and recalculates responsive portrait/landscape framing.
   */
  public resize(width: number, height: number): void {
    if (width <= 0 || height <= 0) return;
    this.setAspect(width / height);
  }

  /**
   * Directly sets viewport aspect ratio (`width / height`).
   */
  public setAspect(aspect: number): void {
    if (!Number.isFinite(aspect) || aspect <= 0.05) return;
    this.aspect = THREE.MathUtils.clamp(aspect, 0.35, 3.6);
    this.camera.aspect = this.aspect;
    this.camera.updateProjectionMatrix();
  }

  /**
   * Sets normalized pointer coordinates `[-1..1]` for gentle cozy parallax.
   */
  public setPointerOffset(ndcX: number, ndcY: number): void {
    this.pointerX = THREE.MathUtils.clamp(ndcX, -1, 1);
    this.pointerY = THREE.MathUtils.clamp(ndcY, -1, 1);
  }

  /**
   * Triggers a decaying multi-frequency shake (e.g. wrong block recoil or boss strike).
   */
  public triggerShake(intensity = 0.16, duration = 0.36): void {
    const clampedIntensity = THREE.MathUtils.clamp(intensity, 0.01, 0.85);
    const clampedDuration = THREE.MathUtils.clamp(duration, 0.05, 1.5);
    this.shakeIntensity = Math.max(this.shakeIntensity, clampedIntensity);
    this.shakeDuration = Math.max(this.shakeDuration, clampedDuration);
    this.shakeTimer = clampedDuration;
    this.shakeSeed = (this.shakeSeed + 17.37) % 1000;
  }

  /**
   * Triggers an energetic zoom/dolly punch (positive = punch inward on hit/combo).
   */
  public triggerZoomPunch(strength = 3.2): void {
    const clamped = THREE.MathUtils.clamp(
      Number.isFinite(strength) ? strength : 0,
      -8,
      8
    );
    this.zoomPunchOffset = THREE.MathUtils.clamp(
      this.zoomPunchOffset - clamped,
      -8,
      8
    );
    this.zoomPunchVelocity = THREE.MathUtils.clamp(
      this.zoomPunchVelocity + clamped * 6.0,
      -50,
      50
    );
  }

  /**
   * Frame-rate-independent update step. Call once per animation frame.
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

    const preset = MODE_PRESETS[this.mode];
    this.computeDesiredGoal(this.elapsed);

    // Frame-rate-independent exponential smoothing
    const alpha = 1 - Math.exp(-preset.damping * dt);
    const pointerAlpha = 1 - Math.exp(-5.0 * dt);

    this.smoothPointerX = THREE.MathUtils.lerp(
      this.smoothPointerX,
      this.pointerX,
      pointerAlpha
    );
    this.smoothPointerY = THREE.MathUtils.lerp(
      this.smoothPointerY,
      this.pointerY,
      pointerAlpha
    );

    this.currentPosition.lerp(this.desiredPosition, alpha);
    this.currentTarget.lerp(this.desiredTarget, alpha);
    this.currentFov = THREE.MathUtils.lerp(this.currentFov, this.desiredFov, alpha);

    // Substepped underdamped spring integration (unconditionally stable even at 10 FPS / dt = 0.1s)
    const springK = 155;
    const springDamp = 18;
    const steps = Math.max(1, Math.ceil(dt / 0.008));
    const subDt = dt / steps;
    for (let s = 0; s < steps; s++) {
      const accel =
        -springK * this.zoomPunchOffset - springDamp * this.zoomPunchVelocity;
      this.zoomPunchVelocity = THREE.MathUtils.clamp(
        this.zoomPunchVelocity + accel * subDt,
        -50,
        50
      );
      this.zoomPunchOffset = THREE.MathUtils.clamp(
        this.zoomPunchOffset + this.zoomPunchVelocity * subDt,
        -8,
        8
      );
    }
    if (
      !Number.isFinite(this.zoomPunchOffset) ||
      !Number.isFinite(this.zoomPunchVelocity) ||
      (Math.abs(this.zoomPunchOffset) < 0.001 &&
        Math.abs(this.zoomPunchVelocity) < 0.001)
    ) {
      this.zoomPunchOffset = 0;
      this.zoomPunchVelocity = 0;
    }

    // Trauma shake decay
    let shakeX = 0;
    let shakeY = 0;
    let shakeRoll = 0;
    if (this.shakeTimer > 0 && this.shakeDuration > 0) {
      this.shakeTimer = Math.max(0, this.shakeTimer - dt);
      const progress = this.shakeTimer / this.shakeDuration;
      const envelope = progress * progress * this.shakeIntensity;
      const t = this.elapsed * 44 + this.shakeSeed;
      shakeX = (Math.sin(t * 1.13) + 0.5 * Math.cos(t * 2.41)) * envelope;
      shakeY = (Math.cos(t * 1.37) + 0.5 * Math.sin(t * 2.19)) * envelope * 0.85;
      shakeRoll = Math.sin(t * 1.79) * envelope * 0.045;
      if (this.shakeTimer === 0) {
        this.shakeIntensity = 0;
      }
    }

    this.applyToCamera(shakeX, shakeY, shakeRoll);
  }

  /**
   * Projects a 3D world position (such as customer head anchor) into 2D viewport pixels
   * and normalized [0..1] coordinates for high-contrast HTML speech bubbles.
   */
  public projectWorldToScreen(
    worldPosition: THREE.Vector3,
    viewportWidth: number,
    viewportHeight: number
  ): SpeechBubbleAnchor2D {
    const safeW = Math.max(1, viewportWidth);
    const safeH = Math.max(1, viewportHeight);

    this.camera.updateMatrixWorld();
    this.scratchProjected.copy(worldPosition).project(this.camera);

    const visible =
      this.scratchProjected.z >= -1 &&
      this.scratchProjected.z <= 1 &&
      Number.isFinite(this.scratchProjected.x) &&
      Number.isFinite(this.scratchProjected.y);

    const nx = THREE.MathUtils.clamp((this.scratchProjected.x + 1) * 0.5, 0.04, 0.96);
    const ny = THREE.MathUtils.clamp((1 - this.scratchProjected.y) * 0.5, 0.04, 0.92);

    return {
      x: nx * safeW,
      y: ny * safeH,
      nx,
      ny,
      visible,
    };
  }

  public dispose(): void {
    this.shakeTimer = 0;
    this.shakeIntensity = 0;
    this.zoomPunchOffset = 0;
    this.zoomPunchVelocity = 0;
  }

  private computeDesiredGoal(t: number): void {
    const preset = MODE_PRESETS[this.mode];

    // Portrait blend factor: 0 on landscape (>= 1.05), 1 on narrow mobile (<= 0.52)
    const portraitBlend = THREE.MathUtils.clamp(
      (1.05 - this.aspect) / (1.05 - 0.52),
      0,
      1
    );

    // Slightly widen vertical FOV on narrow portrait viewports so pullback stays natural
    const responsiveFov = preset.baseFov + portraitBlend * 6.5;
    const halfVRad = responsiveFov * 0.5 * DEG2RAD;
    const tanHalfH = Math.max(0.12, Math.tan(halfVRad) * this.aspect);

    // Ensure minHorizontalHalfSpan (and katakana-cafe 4.9 span rule) fits cleanly inside viewport
    const requiredDistance = preset.minHorizontalHalfSpan / tanHalfH;
    const distance = THREE.MathUtils.clamp(
      Math.max(preset.baseDistance, requiredDistance),
      preset.baseDistance * 0.92,
      15.2
    );

    const pitchDeg = THREE.MathUtils.lerp(
      preset.pitchDegDesktop,
      preset.pitchDegPortrait,
      portraitBlend
    );
    let yawRad = preset.yawDeg * DEG2RAD;
    let pitchRad = pitchDeg * DEG2RAD;

    this.desiredTarget.lerpVectors(
      preset.targetDesktop,
      preset.targetPortrait,
      portraitBlend
    );

    // Mode-specific living camera motion
    if (this.mode === 'title') {
      yawRad += Math.sin(t * 0.32) * 0.28;
      pitchRad += Math.cos(t * 0.24) * 0.03;
      this.desiredTarget.x += Math.sin(t * 0.32) * 0.45;
    } else if (this.mode === 'map') {
      yawRad += Math.sin(t * 0.25) * 0.14;
      this.desiredTarget.x += Math.cos(t * 0.22) * 0.25;
    } else if (this.mode === 'shop') {
      // Smooth showcase pan across counter & wall upgrade props
      const panWave = Math.sin(t * 0.55);
      yawRad += panWave * 0.26;
      this.desiredTarget.x += panWave * 1.45;
      this.desiredTarget.y += Math.cos(t * 0.55 * 2) * 0.08;
    } else if (this.mode === 'boss') {
      // Subtle tense duel breathing across the counter
      yawRad += Math.sin(t * 0.85) * 0.035;
      pitchRad += Math.cos(t * 0.7) * 0.015;
    } else if (this.mode === 'rush') {
      // Energetic subtle pulse
      pitchRad += Math.sin(t * 2.6) * 0.008;
    }

    // Subtle pointer parallax (stronger on title/shop, restrained during active block clicking)
    const parallaxScale =
      this.mode === 'counter' || this.mode === 'build' || this.mode === 'rush'
        ? 0.14
        : 0.32;
    yawRad += this.smoothPointerX * 0.06 * parallaxScale * 3;
    pitchRad = THREE.MathUtils.clamp(
      pitchRad - this.smoothPointerY * 0.04 * parallaxScale * 3,
      8 * DEG2RAD,
      55 * DEG2RAD
    );

    const horizontalDist = distance * Math.cos(pitchRad);
    this.desiredPosition.set(
      this.desiredTarget.x + Math.sin(yawRad) * horizontalDist,
      this.desiredTarget.y + distance * Math.sin(pitchRad),
      this.desiredTarget.z + Math.cos(yawRad) * horizontalDist
    );
    this.desiredFov = responsiveFov;
  }

  private applyToCamera(shakeX: number, shakeY: number, shakeRoll: number): void {
    const effectiveFov = THREE.MathUtils.clamp(
      this.currentFov + this.zoomPunchOffset,
      26,
      68
    );

    this.camera.position.set(
      this.currentPosition.x + shakeX,
      this.currentPosition.y + shakeY,
      this.currentPosition.z + this.zoomPunchOffset * 0.06
    );

    this.scratchLookTarget.set(
      this.currentTarget.x + shakeX * 0.35,
      this.currentTarget.y + shakeY * 0.35,
      this.currentTarget.z
    );

    this.camera.up.set(Math.sin(shakeRoll), Math.cos(shakeRoll), 0);
    this.camera.lookAt(this.scratchLookTarget);

    if (Math.abs(this.camera.fov - effectiveFov) > 0.001) {
      this.camera.fov = effectiveFov;
      this.camera.updateProjectionMatrix();
    }
  }
}
