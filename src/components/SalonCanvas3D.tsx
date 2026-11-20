/**
 * Salon Mishima 3D - Persistent Interactive Full-Viewport WebGL Stage
 * File: src/components/SalonCanvas3D.tsx
 *
 * Wraps Three.js WebGLRenderer, SalonEnvironment3D, CameraRig3D, ParticleSystem3D,
 * CustomerActors3D, KanjiBlocks3D, and BossAvatar3D with direct 3D pointer
 * raycasting, 2D speech-bubble anchor projection, tab-hidden loop suspension,
 * ResizeObserver responsiveness, and graceful headless/jsdom fallback.
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type { SalonCanvas3DProps, SpeechBubbleAnchor2D, QualityLevel3D } from '../types/three3d';
import { SalonEnvironment3D } from '../three/SalonEnvironment3D';
import { CameraRig3D } from '../three/CameraRig3D';
import { ParticleSystem3D } from '../three/ParticleSystem3D';
import { CustomerActors3D } from '../three/CustomerActors3D';
import { KanjiBlocks3D } from '../three/KanjiBlocks3D';
import { BossAvatar3D } from '../three/BossAvatar3D';
import { playSound, isAudioMuted } from '../audio/soundSynthesizer';

const AMBIENT_TITLE_CUSTOMER = {
  id: 'hatsue',
  name: '初江',
  avatar: 'avatar-hatsue',
  work: '潮騒',
  role: '富豪の娘',
} as const;

function canCreateWebGLContext(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }
  if (
    typeof WebGLRenderingContext === 'undefined' &&
    typeof WebGL2RenderingContext === 'undefined'
  ) {
    return false;
  }
  try {
    const probe = document.createElement('canvas');
    const gl =
      probe.getContext('webgl2') ||
      probe.getContext('webgl') ||
      probe.getContext('experimental-webgl');
    return Boolean(gl);
  } catch {
    return false;
  }
}

function getTargetPixelRatio(quality: QualityLevel3D): number {
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
  if (quality === 'low') return 1;
  if (quality === 'medium') return Math.min(dpr, 1.5);
  return Math.min(dpr, 2);
}

interface StageRuntime {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  environment: SalonEnvironment3D;
  cameraRig: CameraRig3D;
  particles: ParticleSystem3D;
  customerActors: CustomerActors3D;
  kanjiBlocks: KanjiBlocks3D;
  bossAvatar: BossAvatar3D;
}

export const SalonCanvas3D: React.FC<SalonCanvas3DProps> = (props) => {
  const {
    mode,
    tier,
    activeCustomer,
    customerAnim,
    patienceRatio,
    blocks,
    onBlockPick,
    traySlots,
    targetWordLength,
    bossState,
    rushActive,
    feverActive,
    unlockedUpgrades,
    particleEvent,
    qualityLevel,
    onAnchorUpdate,
    taskMode,
    chalkboardTitle,
    chalkboardSubtitle,
  } = props;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const runtimeRef = useRef<StageRuntime | null>(null);

  const [webglAvailable, setWebglAvailable] = useState<boolean>(() => canCreateWebGLContext());

  // Latest callbacks & volatile values kept in refs for the rAF loop & pointer handlers
  const onBlockPickRef = useRef(onBlockPick);
  onBlockPickRef.current = onBlockPick;

  const onAnchorUpdateRef = useRef(onAnchorUpdate);
  onAnchorUpdateRef.current = onAnchorUpdate;

  const patienceRatioRef = useRef(patienceRatio);
  patienceRatioRef.current = Number.isFinite(patienceRatio) ? patienceRatio : 1;

  const prevCustomerAnimRef = useRef(customerAnim);
  const prevBossHpRef = useRef<number | null>(null);
  const prevWrongSigRef = useRef('');

  // 1. Mount WebGLRenderer, 3D Scene, Actors, ResizeObserver & rAF Loop
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas || !webglAvailable) {
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: qualityLevel !== 'low',
        alpha: false,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglAvailable(false);
      return;
    }

    const initW = Math.max(1, container.clientWidth || window.innerWidth || 1280);
    const initH = Math.max(1, container.clientHeight || window.innerHeight || 800);

    SalonEnvironment3D.configureRenderer(renderer, qualityLevel);
    renderer.setPixelRatio(getTargetPixelRatio(qualityLevel));
    renderer.setSize(initW, initH, false);

    const scene = new THREE.Scene();
    const environment = new SalonEnvironment3D(scene, { quality: qualityLevel });
    const cameraRig = new CameraRig3D(undefined, initW / initH);
    cameraRig.setMode(mode, true);

    const particles = new ParticleSystem3D(scene, {
      quality: qualityLevel,
      tipJarPosition: environment.getTipJarWorldPosition(),
      steamSources: environment.getCoffeeCupPositions(),
    });

    const maxAniso = renderer.capabilities.getMaxAnisotropy?.() || 8;
    const customerActors = new CustomerActors3D(scene);
    const kanjiBlocks = new KanjiBlocks3D(scene, maxAniso);
    const bossAvatar = new BossAvatar3D(scene, maxAniso);

    const runtime: StageRuntime = {
      renderer,
      scene,
      environment,
      cameraRig,
      particles,
      customerActors,
      kanjiBlocks,
      bossAvatar,
    };
    runtimeRef.current = runtime;

    // Responsive sizing via ResizeObserver + window fallback
    let viewportW = initW;
    let viewportH = initH;

    const handleResize = () => {
      if (!containerRef.current) return;
      const nextW = Math.max(1, containerRef.current.clientWidth || window.innerWidth || 1280);
      const nextH = Math.max(1, containerRef.current.clientHeight || window.innerHeight || 800);
      viewportW = nextW;
      viewportH = nextH;
      renderer.setSize(nextW, nextH, false);
      cameraRig.resize(nextW, nextH);
    };

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => handleResize());
      resizeObserver.observe(container);
    }
    window.addEventListener('resize', handleResize);

    // Direct 3D pointer raycasting for tactile block hover & clicking
    let lastHoverIdx = -1;

    const computeNDC = (clientX: number, clientY: number): [number, number] => {
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, rect.width);
      const h = Math.max(1, rect.height);
      const ndcX = ((clientX - rect.left) / w) * 2 - 1;
      const ndcY = -((clientY - rect.top) / h) * 2 + 1;
      return [ndcX, ndcY];
    };

    const onPointerMove = (e: PointerEvent) => {
      const [ndcX, ndcY] = computeNDC(e.clientX, e.clientY);
      cameraRig.setPointerOffset(ndcX, ndcY);

      const hitIdx = kanjiBlocks.updateHoverAtNDC(ndcX, ndcY, cameraRig.camera);
      canvas.style.cursor = hitIdx >= 0 ? 'pointer' : 'default';

      if (hitIdx >= 0 && hitIdx !== lastHoverIdx && !isAudioMuted()) {
        try {
          playSound('hover');
        } catch {
          // Safe ignore in isolated environments
        }
      }
      lastHoverIdx = hitIdx;
    };

    const onPointerLeave = () => {
      cameraRig.setPointerOffset(0, 0);
      kanjiBlocks.setHoveredIndex(-1);
      lastHoverIdx = -1;
      canvas.style.cursor = 'default';
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      const [ndcX, ndcY] = computeNDC(e.clientX, e.clientY);
      const picked = kanjiBlocks.pickBlockAtNDC(ndcX, ndcY, cameraRig.camera);
      if (picked && onBlockPickRef.current) {
        onBlockPickRef.current(picked.label, picked.index);
      }
    };

    canvas.addEventListener('pointermove', onPointerMove, { passive: true });
    canvas.addEventListener('pointerleave', onPointerLeave, { passive: true });
    canvas.addEventListener('pointerdown', onPointerDown);

    // Frame-rate-independent rAF loop paused cleanly when tab is hidden
    let rafId: number | null = null;
    let isTabHidden = typeof document !== 'undefined' ? Boolean(document.hidden) : false;
    let lastTimestamp = performance.now();
    let elapsedSeconds = 0;

    const scratchHeadWorld = new THREE.Vector3();
    let lastEmittedAnchor: SpeechBubbleAnchor2D | null = null;

    const tick = (now: number) => {
      if (isTabHidden) {
        rafId = null;
        return;
      }

      const rawDt = (now - lastTimestamp) / 1000;
      lastTimestamp = now;
      const dt = Math.min(Math.max(rawDt, 0.001), 0.1);
      elapsedSeconds += dt;

      environment.update(dt, elapsedSeconds);
      customerActors.update(dt, patienceRatioRef.current, elapsedSeconds);
      kanjiBlocks.update(dt, elapsedSeconds);
      bossAvatar.update(dt, elapsedSeconds);
      particles.update(dt, elapsedSeconds);
      cameraRig.update(dt, elapsedSeconds);

      if (onAnchorUpdateRef.current && customerActors.group.visible) {
        customerActors.getHeadAnchorWorldPosition(scratchHeadWorld);
        const anchor = cameraRig.projectWorldToScreen(scratchHeadWorld, viewportW, viewportH);
        const movedSignificantly =
          !lastEmittedAnchor ||
          Math.abs(anchor.x - lastEmittedAnchor.x) > 1.5 ||
          Math.abs(anchor.y - lastEmittedAnchor.y) > 1.5 ||
          anchor.visible !== lastEmittedAnchor.visible;

        if (movedSignificantly) {
          lastEmittedAnchor = anchor;
          onAnchorUpdateRef.current(anchor);
        }
      }

      renderer.render(scene, cameraRig.camera);
      rafId = window.requestAnimationFrame(tick);
    };

    const onVisibilityChange = () => {
      if (typeof document === 'undefined') return;
      isTabHidden = Boolean(document.hidden);
      if (isTabHidden) {
        if (rafId !== null) {
          window.cancelAnimationFrame(rafId);
          rafId = null;
        }
      } else if (rafId === null) {
        lastTimestamp = performance.now();
        rafId = window.requestAnimationFrame(tick);
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    if (!isTabHidden) {
      rafId = window.requestAnimationFrame(tick);
    }

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      canvas.removeEventListener('pointerdown', onPointerDown);

      runtimeRef.current = null;
      kanjiBlocks.dispose();
      customerActors.dispose();
      bossAvatar.dispose();
      particles.dispose();
      environment.dispose();
      cameraRig.dispose();
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webglAvailable]);

  // 2. Sync Camera Mode, Tier, Upgrades, Fever, and Quality Preset
  useEffect(() => {
    const rt = runtimeRef.current;
    if (!rt) return;

    rt.cameraRig.setMode(mode, false);
    rt.environment.setTier(tier);
    rt.environment.updateUpgrades(unlockedUpgrades || []);
    rt.environment.setFeverMode(Boolean(feverActive), Boolean(rushActive));
    rt.environment.setChalkboardText(chalkboardTitle, chalkboardSubtitle);
    rt.environment.setQuality(qualityLevel);
    rt.particles.setQuality(qualityLevel);

    SalonEnvironment3D.configureRenderer(rt.renderer, qualityLevel);
    rt.renderer.setPixelRatio(getTargetPixelRatio(qualityLevel));
  }, [
    mode,
    tier,
    unlockedUpgrades,
    feverActive,
    rushActive,
    chalkboardTitle,
    chalkboardSubtitle,
    qualityLevel,
  ]);

  // 3. Sync 3D Literary Patron & Procedural Animations + Camera Juice
  useEffect(() => {
    const rt = runtimeRef.current;
    if (!rt) return;

    if (mode === 'boss') {
      rt.customerActors.setVisible(false);
    } else if (mode === 'title' || mode === 'map' || mode === 'shop') {
      rt.customerActors.setCustomer(activeCustomer || AMBIENT_TITLE_CUSTOMER);
      rt.customerActors.setAnimState('idle');
    } else {
      rt.customerActors.setCustomer(activeCustomer || AMBIENT_TITLE_CUSTOMER);
      rt.customerActors.setAnimState(customerAnim);
    }

    if (customerAnim !== prevCustomerAnimRef.current) {
      if (customerAnim === 'angry') {
        rt.cameraRig.triggerShake(0.18, 0.34);
      } else if (customerAnim === 'happy') {
        rt.cameraRig.triggerZoomPunch(2.4);
      }
      prevCustomerAnimRef.current = customerAnim;
    }
  }, [mode, activeCustomer, customerAnim]);

  // 4. Sync Tactile 3D Kanji Blocks & Lacquer Serving Tray
  useEffect(() => {
    const rt = runtimeRef.current;
    if (!rt) return;

    const showCounterBlocks = mode !== 'boss';
    rt.kanjiBlocks.setVisible(showCounterBlocks);
    rt.kanjiBlocks.setTaskMode(taskMode);

    const activeBlocks =
      mode === 'counter' || mode === 'build' || mode === 'rush' ? blocks : [];
    rt.kanjiBlocks.setBlocks(activeBlocks);
    rt.kanjiBlocks.setTray(traySlots || [], targetWordLength || 1);

    const wrongSig = activeBlocks
      .filter((b) => b.isWrongFlash)
      .map((b) => b.id)
      .join(',');
    if (wrongSig && wrongSig !== prevWrongSigRef.current) {
      rt.cameraRig.triggerShake(0.16, 0.28);
    }
    prevWrongSigRef.current = wrongSig;
  }, [mode, blocks, traySlots, targetWordLength, taskMode]);

  // 5. Sync Theatrical 3D Boss Avatar & Orbiting Kanji Tablets
  useEffect(() => {
    const rt = runtimeRef.current;
    if (!rt) return;

    if (mode === 'boss' && bossState?.bossPair) {
      rt.bossAvatar.setBossState(bossState);

      if (
        prevBossHpRef.current !== null &&
        typeof bossState.bossHp === 'number' &&
        bossState.bossHp < prevBossHpRef.current
      ) {
        rt.cameraRig.triggerZoomPunch(3.0);
        rt.cameraRig.triggerShake(0.14, 0.26);
        if (particleEvent?.kind !== 'slash') {
          rt.particles.emit('slash', [0, 1.85, -0.88]);
        }
      }
      prevBossHpRef.current = bossState.bossHp;
    } else {
      rt.bossAvatar.setVisible(false);
      prevBossHpRef.current = null;
    }
  }, [mode, bossState, particleEvent]);

  // 6. Sync Pooled 3D Particle Burst Events
  useEffect(() => {
    const rt = runtimeRef.current;
    if (!rt || !particleEvent) return;

    rt.particles.triggerBurst(particleEvent);
    if (particleEvent.kind === 'slash' || particleEvent.kind === 'angry') {
      rt.cameraRig.triggerShake(0.15, 0.28);
    } else if (particleEvent.kind === 'fever') {
      rt.cameraRig.triggerZoomPunch(3.2);
    }
  }, [particleEvent]);

  // Accessible DOM fallback when WebGL context is unavailable (e.g. headless jsdom unit tests)
  if (!webglAvailable) {
    const showFallbackButtons =
      Array.isArray(blocks) &&
      blocks.length > 0 &&
      (mode === 'counter' || mode === 'build' || mode === 'rush');

    return (
      <div
        ref={containerRef}
        className="salon-canvas-3d salon-canvas-3d--fallback"
        data-testid="salon-canvas-3d"
        data-camera-mode={mode}
        data-tier={tier}
        aria-label="살롱 미시마 3D 카페 스테이지"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        {showFallbackButtons && (
          <div
            data-testid="salon-canvas-3d-fallback-blocks"
            style={{
              position: 'absolute',
              bottom: '0.5rem',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '0.5rem',
              opacity: 0.01,
              pointerEvents: 'auto',
            }}
          >
            {blocks.map((b, idx) => (
              <button
                key={b.id || `${b.label}-${idx}`}
                type="button"
                data-testid={`canvas3d-block-${idx}`}
                aria-label={`3D 한자 블록 ${idx + 1}: ${b.label}`}
                onClick={() => onBlockPick(b.label, idx)}
              >
                {`[${b.sublabel || idx + 1}] ${b.label}`}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="salon-canvas-3d"
      data-testid="salon-canvas-3d"
      data-camera-mode={mode}
      data-tier={tier}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        data-testid="salon-webgl-canvas"
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          touchAction: 'manipulation',
        }}
      />
    </div>
  );
};

export default SalonCanvas3D;
