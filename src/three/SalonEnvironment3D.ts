/**
 * Salon Mishima 3D - Procedural Showa Literary Kissaten Environment
 * File: src/three/SalonEnvironment3D.ts
 *
 * Builds a warm, bright, high-readability 3D Japanese literary cafe featuring:
 * - Warm cream plaster walls, polished mahogany counter (y = 0.98), checkered tiles,
 *   brass rails, wagashi display vitrine, espresso bar, and dynamic green chalkboard
 * - Panoramic shoji window framing a dynamic 4-Tier Mishima Literary Backdrop:
 *   Tier 1 (金閣寺), Tier 2 (潮騒), Tier 3 (仮面の告白 / 鹿鳴館), Tier 4 (憂国 / 太陽と鉄)
 * - 6 real-time unlockable 3D Cafe Upgrade Props ('siphon', 'kinkaku', 'velvet',
 *   'gramophone', 'bookshelf', 'wagashi')
 * - Fever / Rush Overdrive golden rim lighting & festive lantern pulse
 */

import * as THREE from 'three';
import type { CurriculumTierNumber } from '../types/curriculum';
import type { CafeUpgradeId, QualityLevel3D } from '../types/three3d';

export const SALON_STAGE_COORDS = {
  FLOOR_Y: 0,
  COUNTER_TOP_Y: 0.98,
  COUNTER_Z_MIN: -0.18,
  COUNTER_Z_MAX: 1.6,
  CUSTOMER_Z: -0.68,
  BOSS_Z: -0.95,
  TRAY_Z: 0.28,
  BLOCKS_Z: 1.05,
  TIP_JAR_POS: new THREE.Vector3(2.55, 1.22, 0.92),
  STEAM_SOURCES: [
    new THREE.Vector3(-2.15, 1.12, 0.42),
    new THREE.Vector3(2.65, 1.44, 0.32),
  ],
} as const;

export interface SalonEnvironmentOptions {
  tier?: CurriculumTierNumber;
  unlockedUpgrades?: readonly CafeUpgradeId[];
  quality?: QualityLevel3D;
  chalkboardTitle?: string;
  chalkboardSubtitle?: string;
}

const ALL_UPGRADE_IDS: readonly CafeUpgradeId[] = [
  'siphon',
  'kinkaku',
  'velvet',
  'gramophone',
  'bookshelf',
  'wagashi',
];

export class SalonEnvironment3D {
  public readonly root: THREE.Group;

  private readonly hostScene: THREE.Scene | null;
  private readonly ownedTextures: THREE.Texture[] = [];

  // Lighting
  private hemiLight!: THREE.HemisphereLight;
  private keyDirLight!: THREE.DirectionalLight;
  private windowRimLight!: THREE.DirectionalLight;
  private feverRimLeft!: THREE.PointLight;
  private feverRimRight!: THREE.PointLight;
  private readonly pendantGroups: THREE.Group[] = [];
  private readonly pendantLights: THREE.PointLight[] = [];
  private readonly pendantShadeMats: THREE.MeshStandardMaterial[] = [];
  private readonly feverLanternGroup = new THREE.Group();
  private readonly feverLanternMats: THREE.MeshStandardMaterial[] = [];

  // Dynamic Chalkboard
  private chalkboardMesh: THREE.Mesh | null = null;
  private chalkboardTitle = '珈琲サロン三島';
  private chalkboardSubtitle = '오늘의 문학 한자 블렌드';

  // 4-Tier Literary Backdrops
  private currentTier: CurriculumTierNumber = 1;
  private readonly tierGroups: Record<CurriculumTierNumber, THREE.Group> = {
    1: new THREE.Group(),
    2: new THREE.Group(),
    3: new THREE.Group(),
    4: new THREE.Group(),
  };
  private windowSkyMat!: THREE.MeshBasicMaterial;

  // Tier animated actors
  private readonly tier1Embers: THREE.Mesh[] = [];
  private tier1PavilionRefl!: THREE.Group;
  private readonly tier2Waves: THREE.Mesh[] = [];
  private tier2LighthouseBeam!: THREE.Group;
  private tier2BrazierFlame!: THREE.Mesh;
  private tier3MaskGroup!: THREE.Group;
  private tier3CurtainL!: THREE.Group;
  private tier3CurtainR!: THREE.Group;
  private tier3Chandelier!: THREE.Group;
  private tier4SunHalo!: THREE.Mesh;
  private tier4BladeGlint!: THREE.Mesh;

  // 6 Unlockable Cafe Upgrades
  private readonly upgradeGroups: Record<CafeUpgradeId, THREE.Group> = {
    siphon: new THREE.Group(),
    kinkaku: new THREE.Group(),
    velvet: new THREE.Group(),
    gramophone: new THREE.Group(),
    bookshelf: new THREE.Group(),
    wagashi: new THREE.Group(),
  };
  private readonly upgradeUnlocked: Record<CafeUpgradeId, boolean> = {
    siphon: false,
    kinkaku: false,
    velvet: false,
    gramophone: false,
    bookshelf: false,
    wagashi: false,
  };
  private readonly upgradeScaleProgress: Record<CafeUpgradeId, number> = {
    siphon: 0,
    kinkaku: 0,
    velvet: 0,
    gramophone: 0,
    bookshelf: 0,
    wagashi: 0,
  };

  // Upgrade animated sub-parts
  private readonly siphonBubbles: THREE.Mesh[] = [];
  private siphonFlame!: THREE.Mesh;
  private kinkakuPhoenix!: THREE.Group;
  private gramophoneDisc!: THREE.Group;
  private readonly gramophoneNotes: THREE.Mesh[] = [];
  private wagashiTopper!: THREE.Group;

  // Fever / Rush state
  private feverActive = false;
  private rushActive = false;
  private feverBlend = 0;
  private quality: QualityLevel3D = 'high';
  private elapsed = 0;

  /**
   * Applies warm, crisp ACESFilmic tone mapping and soft shadows to a WebGLRenderer.
   */
  public static configureRenderer(
    renderer: THREE.WebGLRenderer,
    quality: QualityLevel3D = 'high'
  ): void {
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = quality !== 'low';
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  constructor(
    parentScene?: THREE.Scene | THREE.Object3D,
    options?: SalonEnvironmentOptions
  ) {
    this.root = new THREE.Group();
    this.root.name = 'SalonEnvironment3D';
    this.hostScene = parentScene instanceof THREE.Scene ? parentScene : null;

    if (options?.quality) {
      this.quality = options.quality;
    }
    if (options?.chalkboardTitle) {
      this.chalkboardTitle = options.chalkboardTitle;
    }
    if (options?.chalkboardSubtitle) {
      this.chalkboardSubtitle = options.chalkboardSubtitle;
    }

    if (this.hostScene) {
      this.hostScene.background = new THREE.Color(0xffe8d2);
      this.hostScene.fog = new THREE.Fog(0xffe8d2, 15, 32);
    }

    this.buildLighting();
    this.buildArchitectureAndCounter();
    this.buildBackBarFixtures();
    this.buildFourTierBackdrops();
    this.buildSixUpgradeProps();
    this.buildFeverLanterns();

    this.setTier(options?.tier ?? 1);
    if (options?.unlockedUpgrades) {
      this.updateUpgrades(options.unlockedUpgrades, true);
    }

    if (parentScene) {
      parentScene.add(this.root);
    }
  }

  /**
   * Switches the 4-Tier Mishima Literary Backdrop outside the panoramic window.
   */
  public setTier(tier: CurriculumTierNumber | number): void {
    const validTier: CurriculumTierNumber =
      tier === 1 || tier === 2 || tier === 3 || tier === 4 ? tier : 1;
    this.currentTier = validTier;

    const skyColors: Record<CurriculumTierNumber, number> = {
      1: 0x3b2d4a, // Golden Pavilion twilight-gold contrast
      2: 0x1e5c8a, // Sound of Waves luminous coastal azure
      3: 0x4a1c30, // Rokumeikan & Mask warm burgundy theater
      4: 0xf5e2c8, // Patriotism / Sun & Steel bright washi dawn
    };
    const rimColors: Record<CurriculumTierNumber, number> = {
      1: 0xffcf6b,
      2: 0x9be2ff,
      3: 0xffb2c9,
      4: 0xff8a65,
    };

    for (const t of [1, 2, 3, 4] as CurriculumTierNumber[]) {
      this.tierGroups[t].visible = t === validTier;
    }
    this.windowSkyMat.color.setHex(skyColors[validTier]);
    this.windowRimLight.color.setHex(rimColors[validTier]);
  }

  /**
   * Toggles the 6 unlockable 3D cafe interior props in real time.
   */
  public updateUpgrades(
    unlocked: readonly (CafeUpgradeId | string)[],
    immediate = false
  ): void {
    const set = new Set<string>(unlocked);
    for (const id of ALL_UPGRADE_IDS) {
      const isUnlocked = set.has(id);
      this.upgradeUnlocked[id] = isUnlocked;
      if (immediate) {
        this.upgradeScaleProgress[id] = isUnlocked ? 1 : 0;
        this.upgradeGroups[id].visible = isUnlocked;
        this.upgradeGroups[id].scale.setScalar(isUnlocked ? 1 : 0.001);
      } else if (isUnlocked && !this.upgradeGroups[id].visible) {
        this.upgradeGroups[id].visible = true;
        this.upgradeGroups[id].scale.setScalar(0.05);
      }
    }
  }

  /**
   * Activates or deactivates Fever Overdrive / Rush golden rim lighting & lantern pulse.
   */
  public setFeverMode(feverActive: boolean, rushActive = false): void {
    this.feverActive = Boolean(feverActive);
    this.rushActive = Boolean(rushActive);
  }

  /**
   * Updates the 3D menu chalkboard text dynamically when stage or tier changes.
   */
  public setChalkboardText(title?: string, subtitle?: string): void {
    const nextTitle = title?.trim() || '珈琲サロン三島';
    const nextSubtitle = subtitle?.trim() || '오늘의 문학 한자 블렌드';
    if (
      nextTitle === this.chalkboardTitle &&
      nextSubtitle === this.chalkboardSubtitle
    ) {
      return;
    }
    this.chalkboardTitle = nextTitle;
    this.chalkboardSubtitle = nextSubtitle;
    if (this.chalkboardMesh) {
      const mat = this.chalkboardMesh.material as THREE.MeshStandardMaterial;
      const newTex = this.createChalkboardTexture(nextTitle, nextSubtitle);
      mat.map = newTex;
      mat.needsUpdate = true;
    }
  }

  public setQuality(quality: QualityLevel3D): void {
    this.quality = quality;
    const cast = quality !== 'low';
    this.keyDirLight.castShadow = cast;
    const mapRes = quality === 'high' ? 1536 : 1024;
    if (
      cast &&
      (this.keyDirLight.shadow.mapSize.width !== mapRes ||
        this.keyDirLight.shadow.mapSize.height !== mapRes)
    ) {
      this.keyDirLight.shadow.mapSize.set(mapRes, mapRes);
      this.keyDirLight.shadow.map?.dispose();
      this.keyDirLight.shadow.map = null;
    }
  }

  public getTipJarWorldPosition(target = new THREE.Vector3()): THREE.Vector3 {
    return target.copy(SALON_STAGE_COORDS.TIP_JAR_POS);
  }

  public getCoffeeCupPositions(): THREE.Vector3[] {
    const list = SALON_STAGE_COORDS.STEAM_SOURCES.map((v) => v.clone());
    if (this.upgradeUnlocked.siphon) {
      list.push(new THREE.Vector3(2.65, 1.56, 0.32));
    }
    return list;
  }

  /**
   * Animates backdrop tiers, unlocked 3D cafe props, pendant sway, and Fever rim pulse.
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
    const t = this.elapsed;

    // 1. Pendant lamps gentle sway
    for (let i = 0; i < this.pendantGroups.length; i++) {
      this.pendantGroups[i].rotation.z = Math.sin(t * 0.9 + i * 1.4) * 0.018;
    }

    // 2. Fever / Rush Overdrive golden rim & festive lantern pulse
    const overdriveTarget = this.feverActive ? 1.0 : this.rushActive ? 0.65 : 0.0;
    const feverAlpha = 1 - Math.exp(-5.0 * dt);
    this.feverBlend = THREE.MathUtils.lerp(
      this.feverBlend,
      overdriveTarget,
      feverAlpha
    );

    const pulse = 0.8 + 0.2 * Math.sin(t * 7.5);
    this.feverRimLeft.intensity = this.feverBlend * 14.0 * pulse;
    this.feverRimRight.intensity = this.feverBlend * 14.0 * pulse;
    this.feverLanternGroup.visible = this.feverBlend > 0.02;
    this.feverLanternGroup.position.y = (1 - this.feverBlend) * 0.35;

    for (let i = 0; i < this.feverLanternMats.length; i++) {
      this.feverLanternMats[i].emissiveIntensity =
        this.feverBlend * (0.85 + 0.35 * Math.sin(t * 6.5 + i));
    }
    for (let i = 0; i < this.pendantShadeMats.length; i++) {
      this.pendantShadeMats[i].emissiveIntensity =
        0.75 + this.feverBlend * 0.45 * pulse;
    }

    // 3. Upgrade pop-in transitions & prop animations
    for (const id of ALL_UPGRADE_IDS) {
      const target = this.upgradeUnlocked[id] ? 1 : 0;
      const cur = this.upgradeScaleProgress[id];
      if (Math.abs(target - cur) > 0.002) {
        const next = THREE.MathUtils.lerp(cur, target, 1 - Math.exp(-9.0 * dt));
        this.upgradeScaleProgress[id] = next;
        // Overshoot bounce feel on unlock
        const eased =
          target === 1
            ? next + Math.sin(next * Math.PI) * 0.12
            : Math.max(0.001, next);
        this.upgradeGroups[id].scale.setScalar(eased);
        if (target === 0 && next < 0.02) {
          this.upgradeGroups[id].visible = false;
        }
      }
    }

    if (this.upgradeGroups.siphon.visible) {
      this.siphonFlame.scale.set(
        1 + Math.sin(t * 14) * 0.12,
        1 + Math.cos(t * 17) * 0.18,
        1 + Math.sin(t * 13) * 0.12
      );
      for (let i = 0; i < this.siphonBubbles.length; i++) {
        const b = this.siphonBubbles[i];
        const cycle = (t * 0.85 + i * 0.23) % 1;
        b.position.y = 0.28 + cycle * 0.24;
        b.scale.setScalar(Math.sin(cycle * Math.PI) * 1.1);
      }
    }

    if (this.upgradeGroups.kinkaku.visible) {
      this.kinkakuPhoenix.rotation.y = Math.sin(t * 0.8) * 0.35;
      this.kinkakuPhoenix.position.y = 0.42 + Math.sin(t * 1.8) * 0.012;
    }

    if (this.upgradeGroups.gramophone.visible) {
      this.gramophoneDisc.rotation.y = t * 2.4;
      for (let i = 0; i < this.gramophoneNotes.length; i++) {
        const note = this.gramophoneNotes[i];
        const phase = (t * 0.55 + i * 0.33) % 1;
        note.position.set(
          -0.18 - phase * 0.35 + Math.sin(phase * 6 + i) * 0.08,
          1.42 + phase * 0.52,
          0.12 + Math.cos(phase * 5 + i) * 0.08
        );
        note.rotation.z = Math.sin(t * 3 + i) * 0.25;
        note.scale.setScalar(Math.sin(phase * Math.PI) * 1.05);
      }
    }

    if (this.upgradeGroups.wagashi.visible) {
      this.wagashiTopper.rotation.y = t * 0.45;
    }

    // 4. Active Literary Tier Backdrop animation
    if (this.currentTier === 1) {
      this.tier1PavilionRefl.position.x = Math.sin(t * 2.1) * 0.025;
      for (let i = 0; i < this.tier1Embers.length; i++) {
        const ember = this.tier1Embers[i];
        const cycle = (t * 0.22 + i * 0.073) % 1;
        ember.position.y = 1.05 + cycle * 2.55;
        ember.position.x =
          ((i % 7) - 3) * 0.58 + Math.sin(t * 1.4 + i * 1.7) * 0.22;
        ember.rotation.y = t * 2.2 + i;
        ember.rotation.x = t * 1.5 + i;
      }
    } else if (this.currentTier === 2) {
      for (let i = 0; i < this.tier2Waves.length; i++) {
        const w = this.tier2Waves[i];
        w.position.x = Math.sin(t * (1.2 + i * 0.3) + i) * 0.28;
        w.position.y = 1.12 + i * 0.08 + Math.cos(t * 1.8 + i) * 0.035;
      }
      this.tier2LighthouseBeam.rotation.y = Math.sin(t * 0.75) * 0.65;
      this.tier2BrazierFlame.scale.set(
        1 + Math.sin(t * 12) * 0.16,
        1 + Math.cos(t * 15) * 0.22,
        1 + Math.sin(t * 11) * 0.16
      );
    } else if (this.currentTier === 3) {
      this.tier3MaskGroup.position.y = 2.32 + Math.sin(t * 1.35) * 0.09;
      this.tier3MaskGroup.rotation.y = Math.sin(t * 0.7) * 0.22;
      this.tier3MaskGroup.rotation.z = Math.cos(t * 0.9) * 0.05;
      this.tier3CurtainL.scale.x = 1 + Math.sin(t * 1.1) * 0.03;
      this.tier3CurtainR.scale.x = 1 + Math.sin(t * 1.1 + 0.8) * 0.03;
      this.tier3Chandelier.rotation.y = t * 0.25;
    } else if (this.currentTier === 4) {
      this.tier4SunHalo.rotation.z = t * 0.35;
      const haloScale = 1 + Math.sin(t * 1.9) * 0.045;
      this.tier4SunHalo.scale.setScalar(haloScale);
      this.tier4BladeGlint.position.x = Math.sin(t * 1.6) * 0.52;
    }
  }

  /**
   * Frees all Three.js geometries, materials, and procedural textures owned by this environment.
   */
  public dispose(): void {
    if (this.root.parent) {
      this.root.parent.remove(this.root);
    }
    const disposedGeos = new Set<THREE.BufferGeometry>();
    const disposedMats = new Set<THREE.Material>();

    this.root.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        if (obj.geometry && !disposedGeos.has(obj.geometry)) {
          disposedGeos.add(obj.geometry);
          obj.geometry.dispose();
        }
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        for (const m of mats) {
          if (m && !disposedMats.has(m)) {
            disposedMats.add(m);
            m.dispose();
          }
        }
      }
    });

    for (const tex of this.ownedTextures) {
      tex.dispose();
    }
    this.ownedTextures.length = 0;

    if (this.keyDirLight?.shadow?.map) {
      this.keyDirLight.shadow.map.dispose();
    }
  }

  // ============================================================================
  // 1. WARM SHOWA KISSATEN LIGHTING
  // ============================================================================

  private buildLighting(): void {
    // Bright cozy warm-ivory sky + honey-wood bounce (never dark-on-dark!)
    this.hemiLight = new THREE.HemisphereLight(0xfff6ea, 0xe8c3a5, 1.65);
    this.hemiLight.position.set(0, 8, 0);
    this.root.add(this.hemiLight);

    const ambientFill = new THREE.AmbientLight(0xfff2df, 0.48);
    this.root.add(ambientFill);

    // Main sunlit Showa cafe directional light
    this.keyDirLight = new THREE.DirectionalLight(0xfffcf5, 1.95);
    this.keyDirLight.position.set(4.2, 8.8, 6.0);
    this.keyDirLight.castShadow = this.quality !== 'low';
    const shadowRes = this.quality === 'high' ? 1536 : 1024;
    this.keyDirLight.shadow.mapSize.set(shadowRes, shadowRes);
    this.keyDirLight.shadow.camera.near = 1.0;
    this.keyDirLight.shadow.camera.far = 22.0;
    this.keyDirLight.shadow.camera.left = -5.5;
    this.keyDirLight.shadow.camera.right = 5.5;
    this.keyDirLight.shadow.camera.top = 5.5;
    this.keyDirLight.shadow.camera.bottom = -3.5;
    this.keyDirLight.shadow.bias = -0.0005;
    this.keyDirLight.shadow.normalBias = 0.02;
    this.root.add(this.keyDirLight);

    // Panoramic window literary rim light
    this.windowRimLight = new THREE.DirectionalLight(0xffcf6b, 0.85);
    this.windowRimLight.position.set(-1.5, 4.2, -6.5);
    this.root.add(this.windowRimLight);

    // 3 Warm Amber Stained-Glass Pendant Lamps over the counter
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd4a445,
      roughness: 0.28,
      metalness: 0.78,
    });
    const cordGeo = new THREE.CylinderGeometry(0.015, 0.015, 1.25, 8);
    const shadeGeo = new THREE.ConeGeometry(0.28, 0.24, 16, 1, true);
    const bulbGeo = new THREE.SphereGeometry(0.085, 12, 10);

    for (const xPos of [-2.25, 0, 2.25]) {
      const group = new THREE.Group();
      group.position.set(xPos, 4.15, 0.35);

      const cord = new THREE.Mesh(cordGeo, brassMat);
      cord.position.y = -0.62;
      group.add(cord);

      const shadeMat = new THREE.MeshStandardMaterial({
        color: 0xffd27d,
        emissive: 0xffa733,
        emissiveIntensity: 0.75,
        roughness: 0.32,
        side: THREE.DoubleSide,
      });
      this.pendantShadeMats.push(shadeMat);

      const shade = new THREE.Mesh(shadeGeo, shadeMat);
      shade.position.y = -1.24;
      group.add(shade);

      const bulb = new THREE.Mesh(
        bulbGeo,
        new THREE.MeshBasicMaterial({ color: 0xfff8e1 })
      );
      bulb.position.y = -1.3;
      group.add(bulb);

      const pLight = new THREE.PointLight(0xffbe66, 4.2, 7.5, 1.5);
      pLight.position.y = -1.36;
      group.add(pLight);

      this.pendantGroups.push(group);
      this.pendantLights.push(pLight);
      this.root.add(group);
    }

    // Fever Overdrive golden rim lights (intensity 0 until fever/rush)
    this.feverRimLeft = new THREE.PointLight(0xffaa1d, 0, 11, 1.4);
    this.feverRimLeft.position.set(-3.2, 2.5, 0.2);
    this.feverRimRight = new THREE.PointLight(0xff6f00, 0, 11, 1.4);
    this.feverRimRight.position.set(3.2, 2.5, 0.2);
    this.root.add(this.feverRimLeft, this.feverRimRight);
  }

  // ============================================================================
  // 2. KISSATEN ARCHITECTURE, CHECKERED FLOOR, POLISHED COUNTER & SHOJI WINDOW
  // ============================================================================

  private buildArchitectureAndCounter(): void {
    const arch = new THREE.Group();

    // Checkered vintage Showa kissaten tile floor (y = 0)
    const floorTex = this.createCheckeredTileTexture();
    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTex,
      roughness: 0.42,
      metalness: 0.04,
    });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 12), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, -0.8);
    floor.receiveShadow = true;
    arch.add(floor);

    // Shared architectural materials
    const creamPlasterMat = new THREE.MeshStandardMaterial({
      color: 0xfaefe0,
      roughness: 0.82,
    });
    const walnutWoodMat = new THREE.MeshStandardMaterial({
      color: 0x6b3822,
      roughness: 0.36,
      metalness: 0.06,
    });
    const mahoganyPolishMat = new THREE.MeshStandardMaterial({
      color: 0x7a3b1e,
      roughness: 0.22,
      metalness: 0.08,
    });
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd9a843,
      roughness: 0.24,
      metalness: 0.82,
    });
    const shojiPaperMat = new THREE.MeshStandardMaterial({
      color: 0xfffaf0,
      emissive: 0xffe8bd,
      emissiveIntensity: 0.32,
      roughness: 0.65,
    });

    // Back wall surrounding panoramic window (z = -3.85)
    // Lower wainscoting across full width
    const backWainscot = new THREE.Mesh(
      new THREE.BoxGeometry(12.4, 1.08, 0.18),
      walnutWoodMat
    );
    backWainscot.position.set(0, 0.54, -3.85);
    backWainscot.receiveShadow = true;
    arch.add(backWainscot);

    // Left & Right upper cream plaster wall segments flanking window (x ∈ [-6.2, -2.15] and [2.15, 6.2])
    const sideWallSpan = 4.05;
    for (const dir of [-1, 1]) {
      const plaster = new THREE.Mesh(
        new THREE.BoxGeometry(sideWallSpan, 3.3, 0.16),
        creamPlasterMat
      );
      plaster.position.set(dir * (2.15 + sideWallSpan / 2), 2.73, -3.86);
      plaster.receiveShadow = true;
      arch.add(plaster);

      // Vertical timber pillar framing window
      const pillar = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 4.35, 0.24),
        walnutWoodMat
      );
      pillar.position.set(dir * 2.18, 2.175, -3.82);
      arch.add(pillar);
    }

    // Upper header plaster & timber beam above window
    const topHeader = new THREE.Mesh(
      new THREE.BoxGeometry(4.5, 0.72, 0.18),
      creamPlasterMat
    );
    topHeader.position.set(0, 4.02, -3.86);
    arch.add(topHeader);

    const windowSill = new THREE.Mesh(
      new THREE.BoxGeometry(4.56, 0.1, 0.32),
      mahoganyPolishMat
    );
    windowSill.position.set(0, 1.08, -3.8);
    arch.add(windowSill);

    const windowTopBeam = new THREE.Mesh(
      new THREE.BoxGeometry(4.56, 0.14, 0.28),
      walnutWoodMat
    );
    windowTopBeam.position.set(0, 3.65, -3.8);
    arch.add(windowTopBeam);

    // Sliding Shoji lattice side panels inside window edges (leaving wide central vista clear!)
    for (const dir of [-1, 1]) {
      const shojiPanel = new THREE.Group();
      shojiPanel.position.set(dir * 1.88, 2.36, -3.8);
      const frame = new THREE.Mesh(
        new THREE.BoxGeometry(0.42, 2.46, 0.05),
        shojiPaperMat
      );
      shojiPanel.add(frame);
      for (let r = -2; r <= 2; r++) {
        const muntin = new THREE.Mesh(
          new THREE.BoxGeometry(0.44, 0.025, 0.06),
          walnutWoodMat
        );
        muntin.position.y = r * 0.45;
        shojiPanel.add(muntin);
      }
      arch.add(shojiPanel);
    }

    // Ceiling timber beams
    for (const zBeam of [-3.6, -1.7, 0.35]) {
      const beam = new THREE.Mesh(
        new THREE.BoxGeometry(12.4, 0.22, 0.24),
        walnutWoodMat
      );
      beam.position.set(0, 4.25, zBeam);
      arch.add(beam);
    }

    // Left Noren Entrance Archway along customer walk-in path (x = -5.4, z = -0.68)
    // Positioned high (y = 2.55..3.35) so walking customers at y = 0..2.25 pass cleanly underneath!
    const norenRod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 1.7, 10),
      walnutWoodMat
    );
    norenRod.rotation.x = Math.PI / 2;
    norenRod.position.set(-5.2, 3.15, -0.68);
    arch.add(norenRod);

    const norenMat = new THREE.MeshStandardMaterial({
      color: 0x223a5e,
      roughness: 0.75,
    });
    for (let i = 0; i < 3; i++) {
      const flap = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.56, 0.46),
        norenMat
      );
      flap.position.set(-5.2, 2.84, -1.18 + i * 0.5);
      arch.add(flap);
    }

    // =========================================================================
    // FOREGROUND POLISHED MAHOGANY COUNTER (Top surface y = 0.98, z ∈ [-0.18, +1.60])
    // =========================================================================
    const counterGroup = new THREE.Group();

    // Main cabinet base
    const counterBase = new THREE.Mesh(
      new THREE.BoxGeometry(8.2, 0.89, 1.66),
      creamPlasterMat
    );
    counterBase.position.set(0, 0.445, 0.71);
    counterBase.castShadow = true;
    counterBase.receiveShadow = true;
    counterGroup.add(counterBase);

    // Rich walnut paneling trim on customer & barista faces
    const frontApron = new THREE.Mesh(
      new THREE.BoxGeometry(8.26, 0.89, 0.08),
      walnutWoodMat
    );
    frontApron.position.set(0, 0.445, -0.12);
    counterGroup.add(frontApron);

    // Polished mahogany counter top slab (top surface EXACTLY at y = 0.98!)
    const counterTop = new THREE.Mesh(
      new THREE.BoxGeometry(8.5, 0.09, 1.78),
      mahoganyPolishMat
    );
    counterTop.position.set(0, 0.935, 0.71);
    counterTop.castShadow = true;
    counterTop.receiveShadow = true;
    counterGroup.add(counterTop);

    // Subtle warm ivory inlay runner along block rack (z = 1.05) for extra block framing contrast
    const blockMatRunner = new THREE.Mesh(
      new THREE.BoxGeometry(3.95, 0.008, 0.54),
      new THREE.MeshStandardMaterial({
        color: 0x5c2a14,
        roughness: 0.35,
      })
    );
    blockMatRunner.position.set(0, 0.982, 1.05);
    blockMatRunner.receiveShadow = true;
    counterGroup.add(blockMatRunner);

    // Gleaming Brass Handrail & Footrail along customer side of counter
    const handRail = new THREE.Mesh(
      new THREE.CylinderGeometry(0.022, 0.022, 8.46, 12),
      brassMat
    );
    handRail.rotation.z = Math.PI / 2;
    handRail.position.set(0, 0.94, -0.2);
    counterGroup.add(handRail);

    const footRail = new THREE.Mesh(
      new THREE.CylinderGeometry(0.026, 0.026, 8.2, 12),
      brassMat
    );
    footRail.rotation.z = Math.PI / 2;
    footRail.position.set(0, 0.16, -0.26);
    counterGroup.add(footRail);

    // Foreground Brass & Glass Tip Jar ('銭') on right wing (2.55, 0.98, 0.92)
    const tipJar = new THREE.Group();
    tipJar.position.set(2.55, 0.98, 0.92);
    const jarGlass = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.18, 0.28, 16),
      new THREE.MeshStandardMaterial({
        color: 0xfff8e7,
        transparent: true,
        opacity: 0.48,
        roughness: 0.12,
      })
    );
    jarGlass.position.y = 0.14;
    const jarRim = new THREE.Mesh(
      new THREE.TorusGeometry(0.16, 0.018, 8, 18),
      brassMat
    );
    jarRim.rotation.x = Math.PI / 2;
    jarRim.position.y = 0.28;
    const coinPile = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.16, 0.1, 14),
      new THREE.MeshStandardMaterial({
        color: 0xffca28,
        roughness: 0.25,
        metalness: 0.85,
      })
    );
    coinPile.position.y = 0.06;
    tipJar.add(jarGlass, jarRim, coinPile);
    counterGroup.add(tipJar);

    // Foreground Warm Ceramic Teacup on left wing (-2.15, 0.98, 0.42) — ambient steam source
    const cupGroup = new THREE.Group();
    cupGroup.position.set(-2.15, 0.98, 0.42);
    const coaster = new THREE.Mesh(
      new THREE.CylinderGeometry(0.13, 0.14, 0.02, 14),
      walnutWoodMat
    );
    coaster.position.y = 0.01;
    const cupBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.085, 0.065, 0.13, 14),
      new THREE.MeshStandardMaterial({ color: 0xf7f1e3, roughness: 0.3 })
    );
    cupBody.position.y = 0.085;
    const matchaSurface = new THREE.Mesh(
      new THREE.CircleGeometry(0.076, 14),
      new THREE.MeshStandardMaterial({ color: 0x558b2f, roughness: 0.25 })
    );
    matchaSurface.rotation.x = -Math.PI / 2;
    matchaSurface.position.y = 0.146;
    cupGroup.add(coaster, cupBody, matchaSurface);
    counterGroup.add(cupGroup);

    arch.add(counterGroup);
    this.root.add(arch);
  }

  // ============================================================================
  // 3. BACK BAR FIXTURES: WAGASHI VITRINE, CHALKBOARD & ESPRESSO BAR
  // ============================================================================

  private buildBackBarFixtures(): void {
    const fixtures = new THREE.Group();
    const walnutMat = new THREE.MeshStandardMaterial({
      color: 0x5d301c,
      roughness: 0.36,
    });
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd9a843,
      roughness: 0.24,
      metalness: 0.82,
    });
    const copperMat = new THREE.MeshStandardMaterial({
      color: 0xc86d44,
      roughness: 0.24,
      metalness: 0.78,
    });

    // Left Back Bar: Wagashi Glass Display Case (-3.45, 0, -3.18)
    const wagashiCase = new THREE.Group();
    wagashiCase.position.set(-3.45, 0, -3.18);

    const caseBase = new THREE.Mesh(
      new THREE.BoxGeometry(1.75, 0.95, 0.78),
      walnutMat
    );
    caseBase.position.y = 0.475;
    wagashiCase.add(caseBase);

    const vitrineGlass = new THREE.Mesh(
      new THREE.BoxGeometry(1.68, 0.62, 0.7),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.32,
        roughness: 0.08,
      })
    );
    vitrineGlass.position.y = 1.26;
    wagashiCase.add(vitrineGlass);

    // Colorful handmade sweets inside display vitrine
    const sweetColors = [0xffb7c5, 0x7cb342, 0xffca28, 0xd84315, 0xf3e5f5];
    for (let i = 0; i < 5; i++) {
      const sweet = new THREE.Mesh(
        new THREE.SphereGeometry(0.075, 12, 10),
        new THREE.MeshStandardMaterial({
          color: sweetColors[i],
          roughness: 0.35,
        })
      );
      sweet.scale.y = 0.72;
      sweet.position.set(-0.56 + i * 0.28, 1.06, 0.05);
      wagashiCase.add(sweet);
    }
    fixtures.add(wagashiCase);

    // Vintage Green Kissaten Menu Chalkboard (-3.45, 2.45, -3.75)
    const boardFrame = new THREE.Mesh(
      new THREE.BoxGeometry(1.88, 1.22, 0.08),
      walnutMat
    );
    boardFrame.position.set(-3.45, 2.45, -3.75);
    fixtures.add(boardFrame);

    const chalkTex = this.createChalkboardTexture(
      this.chalkboardTitle,
      this.chalkboardSubtitle
    );
    this.chalkboardMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1.72, 1.06),
      new THREE.MeshStandardMaterial({
        map: chalkTex,
        roughness: 0.78,
      })
    );
    this.chalkboardMesh.position.set(-3.45, 2.45, -3.7);
    fixtures.add(this.chalkboardMesh);

    // Right Back Bar: Vintage Copper Lever Espresso Machine & Canister Shelf (+3.45, 0, -3.18)
    const coffeeBar = new THREE.Group();
    coffeeBar.position.set(3.45, 0, -3.18);

    const barCounter = new THREE.Mesh(
      new THREE.BoxGeometry(1.85, 1.02, 0.82),
      walnutMat
    );
    barCounter.position.y = 0.51;
    coffeeBar.add(barCounter);

    // Showa copper boiler espresso machine
    const boiler = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.26, 0.54, 16),
      copperMat
    );
    boiler.position.set(-0.25, 1.29, 0);
    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(0.24, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2),
      brassMat
    );
    dome.position.set(-0.25, 1.56, 0);
    coffeeBar.add(boiler, dome);

    // Backlit coffee tin canisters on upper wall shelf
    const shelf = new THREE.Mesh(
      new THREE.BoxGeometry(1.75, 0.06, 0.34),
      walnutMat
    );
    shelf.position.set(0, 2.25, -0.35);
    coffeeBar.add(shelf);

    const tinColors = [0xc62828, 0x1b5e20, 0xf9a825, 0x283593];
    for (let i = 0; i < 4; i++) {
      const tin = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 0.28, 12),
        new THREE.MeshStandardMaterial({
          color: tinColors[i],
          roughness: 0.35,
          metalness: 0.3,
        })
      );
      tin.position.set(-0.54 + i * 0.36, 2.42, -0.35);
      coffeeBar.add(tin);
    }

    fixtures.add(coffeeBar);
    this.root.add(fixtures);
  }

  // ============================================================================
  // 4. DYNAMIC 4-TIER MISHIMA LITERARY BACKDROP (THROUGH PANORAMIC WINDOW)
  // ============================================================================

  private buildFourTierBackdrops(): void {
    const backdropRoot = new THREE.Group();
    backdropRoot.name = 'MishimaLiteraryBackdrop';

    // Shared luminous sky canvas behind window (z = -9.6)
    this.windowSkyMat = new THREE.MeshBasicMaterial({ color: 0x3b2d4a });
    const skyBackdrop = new THREE.Mesh(
      new THREE.PlaneGeometry(14, 8),
      this.windowSkyMat
    );
    skyBackdrop.position.set(0, 2.6, -9.6);
    backdropRoot.add(skyBackdrop);

    // ---- TIER 1: 金閣寺 (Golden Pavilion on Mirror Pond + Drifting Gold Embers) ----
    const t1 = this.tierGroups[1];
    // Warm golden horizon glow disc
    const t1Glow = new THREE.Mesh(
      new THREE.CircleGeometry(2.6, 28),
      new THREE.MeshBasicMaterial({
        color: 0xffca62,
        transparent: true,
        opacity: 0.42,
      })
    );
    t1Glow.position.set(0, 2.25, -9.2);
    t1.add(t1Glow);

    // Mirror Pond (鏡湖池)
    const pond = new THREE.Mesh(
      new THREE.PlaneGeometry(9.5, 4.5),
      new THREE.MeshStandardMaterial({
        color: 0x194558,
        emissive: 0x243b4a,
        emissiveIntensity: 0.4,
        roughness: 0.14,
        metalness: 0.55,
      })
    );
    pond.rotation.x = -Math.PI / 2;
    pond.position.set(0, 1.18, -6.8);
    t1.add(pond);

    const buildPavilion = (isReflection: boolean): THREE.Group => {
      const g = new THREE.Group();
      const goldMat = new THREE.MeshStandardMaterial({
        color: 0xffd54f,
        emissive: 0xd48806,
        emissiveIntensity: isReflection ? 0.35 : 0.65,
        roughness: 0.22,
        metalness: 0.85,
        transparent: isReflection,
        opacity: isReflection ? 0.42 : 1.0,
      });
      const roofMat = new THREE.MeshStandardMaterial({
        color: 0x5c3c24,
        emissive: 0x6e471b,
        emissiveIntensity: 0.25,
        roughness: 0.45,
        transparent: isReflection,
        opacity: isReflection ? 0.35 : 1.0,
      });

      const levels = [
        { w: 1.45, h: 0.42, roofR: 1.25, y: 0.21 },
        { w: 1.12, h: 0.38, roofR: 1.0, y: 0.66 },
        { w: 0.76, h: 0.34, roofR: 0.72, y: 1.08 },
      ];
      for (const lv of levels) {
        const body = new THREE.Mesh(
          new THREE.BoxGeometry(lv.w, lv.h, lv.w * 0.75),
          goldMat
        );
        body.position.y = lv.y;
        const roof = new THREE.Mesh(
          new THREE.ConeGeometry(lv.roofR, 0.22, 4),
          roofMat
        );
        roof.rotation.y = Math.PI / 4;
        roof.position.y = lv.y + lv.h * 0.5 + 0.08;
        g.add(body, roof);
      }
      // Golden Phoenix finial on apex
      const finial = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.14, 0),
        goldMat
      );
      finial.scale.set(1.2, 1.6, 0.7);
      finial.position.y = 1.48;
      g.add(finial);
      return g;
    };

    const mainPavilion = buildPavilion(false);
    mainPavilion.position.set(0, 1.2, -7.1);
    t1.add(mainPavilion);

    this.tier1PavilionRefl = buildPavilion(true);
    this.tier1PavilionRefl.scale.y = -0.55;
    this.tier1PavilionRefl.position.set(0, 1.17, -7.1);
    t1.add(this.tier1PavilionRefl);

    // 22 Drifting Gold Leaf Embers
    const emberGeo = new THREE.OctahedronGeometry(0.045, 0);
    const emberMat = new THREE.MeshBasicMaterial({ color: 0xffe082 });
    for (let i = 0; i < 22; i++) {
      const ember = new THREE.Mesh(emberGeo, emberMat);
      ember.position.set(((i % 7) - 3) * 0.55, 1.3 + (i % 5) * 0.4, -5.8 - (i % 3) * 0.7);
      this.tier1Embers.push(ember);
      t1.add(ember);
    }
    backdropRoot.add(t1);

    // ---- TIER 2: 潮騒 (Sparkling Ocean Waves, Utajima Lighthouse & Glowing Brazier 篝火) ----
    const t2 = this.tierGroups[2];
    const waveColors = [0x1565c0, 0x1e88e5, 0x4fc3f7];
    for (let i = 0; i < 3; i++) {
      const wave = new THREE.Mesh(
        new THREE.BoxGeometry(8.5, 0.28, 0.55),
        new THREE.MeshStandardMaterial({
          color: waveColors[i],
          emissive: 0x0d47a1,
          emissiveIntensity: 0.25,
          roughness: 0.22,
        })
      );
      wave.position.set(0, 1.14 + i * 0.08, -5.8 - i * 1.0);
      this.tier2Waves.push(wave);
      t2.add(wave);
    }

    // Utajima rocky headland + white Lighthouse on right
    const islandRock = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.95, 1),
      new THREE.MeshStandardMaterial({ color: 0x455a64, roughness: 0.8 })
    );
    islandRock.scale.set(1.3, 0.85, 1.0);
    islandRock.position.set(1.15, 1.45, -7.6);
    t2.add(islandRock);

    const lighthouseTower = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.22, 1.05, 14),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xfff8e1,
        emissiveIntensity: 0.25,
      })
    );
    lighthouseTower.position.set(1.15, 2.35, -7.6);
    t2.add(lighthouseTower);

    this.tier2LighthouseBeam = new THREE.Group();
    this.tier2LighthouseBeam.position.set(1.15, 2.92, -7.6);
    const beamCone = new THREE.Mesh(
      new THREE.ConeGeometry(0.48, 2.6, 16, 1, true),
      new THREE.MeshBasicMaterial({
        color: 0xfff3b0,
        transparent: true,
        opacity: 0.28,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
    );
    beamCone.rotation.z = Math.PI / 2;
    beamCone.position.x = -1.3;
    this.tier2LighthouseBeam.add(beamCone);
    t2.add(this.tier2LighthouseBeam);

    // Glowing Fishermen's Brazier (篝火) on left rocky outcrop
    const brazierStand = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.12, 0.45, 8),
      new THREE.MeshStandardMaterial({ color: 0x263238, metalness: 0.6 })
    );
    brazierStand.position.set(-1.05, 1.48, -5.9);
    this.tier2BrazierFlame = new THREE.Mesh(
      new THREE.ConeGeometry(0.22, 0.52, 8),
      new THREE.MeshBasicMaterial({ color: 0xff7043 })
    );
    this.tier2BrazierFlame.position.set(-1.05, 1.92, -5.9);
    t2.add(brazierStand, this.tier2BrazierFlame);
    backdropRoot.add(t2);

    // ---- TIER 3: 仮面の告白 / 鹿鳴館 (Velvet Curtains, Venetian Mask & Chandelier) ----
    const t3 = this.tierGroups[3];
    const velvetMat = new THREE.MeshStandardMaterial({
      color: 0x9b1b30,
      emissive: 0x4a0e17,
      emissiveIntensity: 0.35,
      roughness: 0.65,
    });
    const buildCurtain = (dir: number): THREE.Group => {
      const cg = new THREE.Group();
      cg.position.set(dir * 1.42, 2.4, -5.6);
      for (let p = 0; p < 4; p++) {
        const pleat = new THREE.Mesh(
          new THREE.CylinderGeometry(0.14, 0.18, 2.6, 12),
          velvetMat
        );
        pleat.position.x = -dir * p * 0.18;
        cg.add(pleat);
      }
      return cg;
    };
    this.tier3CurtainL = buildCurtain(-1);
    this.tier3CurtainR = buildCurtain(1);
    t3.add(this.tier3CurtainL, this.tier3CurtainR);

    // Sculpted Alabaster & Gold Venetian Mask centerpiece
    this.tier3MaskGroup = new THREE.Group();
    this.tier3MaskGroup.position.set(0, 2.32, -6.9);
    const maskFace = new THREE.Mesh(
      new THREE.SphereGeometry(0.56, 20, 18),
      new THREE.MeshStandardMaterial({
        color: 0xfffaf2,
        emissive: 0xffecb3,
        emissiveIntensity: 0.22,
        roughness: 0.25,
      })
    );
    maskFace.scale.set(0.82, 1.08, 0.42);
    const maskGoldHalf = new THREE.Mesh(
      new THREE.SphereGeometry(0.57, 16, 16, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({
        color: 0xffd54f,
        roughness: 0.22,
        metalness: 0.85,
      })
    );
    maskGoldHalf.scale.set(0.83, 1.09, 0.43);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1a0f14 });
    const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.07, 0.1), eyeMat);
    eyeL.position.set(-0.18, 0.08, 0.22);
    eyeL.rotation.z = -0.14;
    const eyeR = eyeL.clone();
    eyeR.position.x = 0.18;
    eyeR.rotation.z = 0.14;
    this.tier3MaskGroup.add(maskFace, maskGoldHalf, eyeL, eyeR);
    t3.add(this.tier3MaskGroup);

    // Rokumeikan Crystal Chandelier
    this.tier3Chandelier = new THREE.Group();
    this.tier3Chandelier.position.set(0, 3.28, -6.2);
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.52, 0.03, 8, 24),
      new THREE.MeshStandardMaterial({
        color: 0xffd54f,
        metalness: 0.85,
        roughness: 0.2,
      })
    );
    ring.rotation.x = Math.PI / 2;
    this.tier3Chandelier.add(ring);
    for (let c = 0; c < 8; c++) {
      const ang = (c / 8) * Math.PI * 2;
      const crystal = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.065, 0),
        new THREE.MeshBasicMaterial({ color: 0xfff9c4 })
      );
      crystal.position.set(Math.cos(ang) * 0.52, -0.1, Math.sin(ang) * 0.52);
      this.tier3Chandelier.add(crystal);
    }
    t3.add(this.tier3Chandelier);
    backdropRoot.add(t3);

    // ---- TIER 4: 憂国 / 太陽と鉄 (Crimson Sun Disc & Sculpted Iron/Katana Stand) ----
    const t4 = this.tierGroups[4];
    const crimsonSun = new THREE.Mesh(
      new THREE.CircleGeometry(1.05, 32),
      new THREE.MeshBasicMaterial({ color: 0xd32f2f })
    );
    crimsonSun.position.set(0, 2.48, -7.8);
    t4.add(crimsonSun);

    this.tier4SunHalo = new THREE.Mesh(
      new THREE.RingGeometry(1.12, 1.38, 28),
      new THREE.MeshBasicMaterial({
        color: 0xffab40,
        transparent: true,
        opacity: 0.55,
        side: THREE.DoubleSide,
      })
    );
    this.tier4SunHalo.position.set(0, 2.48, -7.82);
    t4.add(this.tier4SunHalo);

    // Tokonoma dais & sculpted black-iron twin Katana stand (太陽と鉄)
    const dais = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 0.22, 0.9),
      new THREE.MeshStandardMaterial({ color: 0x2c1b18, roughness: 0.35 })
    );
    dais.position.set(0, 1.25, -6.0);
    t4.add(dais);

    const standMat = new THREE.MeshStandardMaterial({
      color: 0x1c1c1c,
      roughness: 0.3,
      metalness: 0.75,
    });
    for (const sx of [-0.38, 0.38]) {
      const horn = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.58, 0.22),
        standMat
      );
      horn.position.set(sx, 1.62, -6.0);
      t4.add(horn);
    }

    const bladeSteelMat = new THREE.MeshStandardMaterial({
      color: 0xeceff1,
      emissive: 0x90a4ae,
      emissiveIntensity: 0.25,
      roughness: 0.12,
      metalness: 0.95,
    });
    const katanaUpper = new THREE.Mesh(
      new THREE.BoxGeometry(1.65, 0.055, 0.03),
      bladeSteelMat
    );
    katanaUpper.position.set(0, 1.82, -5.96);
    katanaUpper.rotation.z = 0.04;
    const wakizashiLower = new THREE.Mesh(
      new THREE.BoxGeometry(1.18, 0.05, 0.03),
      bladeSteelMat
    );
    wakizashiLower.position.set(0, 1.56, -5.96);
    wakizashiLower.rotation.z = 0.03;
    t4.add(katanaUpper, wakizashiLower);

    this.tier4BladeGlint = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.09, 0),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    this.tier4BladeGlint.position.set(0, 1.84, -5.9);
    t4.add(this.tier4BladeGlint);

    backdropRoot.add(t4);
    this.root.add(backdropRoot);
  }

  // ============================================================================
  // 5. SIX REAL-TIME UNLOCKABLE 3D CAFE UPGRADE PROPS
  // ============================================================================

  private buildSixUpgradeProps(): void {
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd9a843,
      roughness: 0.22,
      metalness: 0.85,
    });
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.44,
      roughness: 0.08,
    });
    const walnutMat = new THREE.MeshStandardMaterial({
      color: 0x5c2f1b,
      roughness: 0.34,
    });

    // 1. 'siphon': Glass Siphon Brewer bubbling with warm glow on right counter (2.65, 0.98, 0.32)
    const siphon = this.upgradeGroups.siphon;
    siphon.position.set(2.65, 0.98, 0.32);
    const siphonBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.19, 0.05, 16),
      brassMat
    );
    siphonBase.position.y = 0.025;
    this.siphonFlame = new THREE.Mesh(
      new THREE.ConeGeometry(0.045, 0.1, 10),
      new THREE.MeshBasicMaterial({ color: 0xff9800 })
    );
    this.siphonFlame.position.y = 0.1;
    const lowerBulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 16, 14),
      glassMat
    );
    lowerBulb.position.y = 0.25;
    const amberBrew = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 14, 12),
      new THREE.MeshStandardMaterial({
        color: 0x8d4004,
        emissive: 0xb25900,
        emissiveIntensity: 0.45,
        roughness: 0.2,
      })
    );
    amberBrew.position.y = 0.24;
    const upperChamber = new THREE.Mesh(
      new THREE.CylinderGeometry(0.13, 0.1, 0.28, 16),
      glassMat
    );
    upperChamber.position.y = 0.52;
    const siphonGlow = new THREE.PointLight(0xffa726, 2.2, 2.5, 1.6);
    siphonGlow.position.set(0, 0.22, 0);
    siphon.add(siphonBase, this.siphonFlame, lowerBulb, amberBrew, upperChamber, siphonGlow);

    const bubbleGeo = new THREE.SphereGeometry(0.022, 8, 8);
    const bubbleMat = new THREE.MeshBasicMaterial({ color: 0xffecb3 });
    for (let i = 0; i < 4; i++) {
      const b = new THREE.Mesh(bubbleGeo, bubbleMat);
      b.position.set((i - 1.5) * 0.03, 0.35, 0);
      this.siphonBubbles.push(b);
      siphon.add(b);
    }

    // 2. 'kinkaku': Golden Phoenix / Kinkaku miniature ornament on left counter (-2.68, 0.98, 0.25)
    const kinkaku = this.upgradeGroups.kinkaku;
    kinkaku.position.set(-2.68, 0.98, 0.25);
    const lacquerPedestal = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.07, 0.42),
      new THREE.MeshStandardMaterial({ color: 0x1a1210, roughness: 0.18 })
    );
    lacquerPedestal.position.y = 0.035;
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xffd740,
      emissive: 0xc68400,
      emissiveIntensity: 0.4,
      roughness: 0.18,
      metalness: 0.9,
    });
    const miniPagoda = new THREE.Mesh(
      new THREE.BoxGeometry(0.26, 0.2, 0.26),
      goldMat
    );
    miniPagoda.position.y = 0.17;
    const miniRoof = new THREE.Mesh(
      new THREE.ConeGeometry(0.25, 0.12, 4),
      goldMat
    );
    miniRoof.rotation.y = Math.PI / 4;
    miniRoof.position.y = 0.32;

    this.kinkakuPhoenix = new THREE.Group();
    this.kinkakuPhoenix.position.y = 0.42;
    const phoenixBody = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.065, 0),
      goldMat
    );
    const wingL = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.02, 0.08),
      goldMat
    );
    wingL.position.set(-0.09, 0.03, 0);
    wingL.rotation.z = 0.38;
    const wingR = wingL.clone();
    wingR.position.x = 0.09;
    wingR.rotation.z = -0.38;
    this.kinkakuPhoenix.add(phoenixBody, wingL, wingR);
    kinkaku.add(lacquerPedestal, miniPagoda, miniRoof, this.kinkakuPhoenix);

    // 3. 'velvet': Crimson Velvet Cushioned Counter Stools + VIP Carpet Runner
    // Flanking x = ±1.85 and ±2.95 at z = -0.68 so center x = 0 stays open for patrons!
    const velvet = this.upgradeGroups.velvet;
    const crimsonVelvetMat = new THREE.MeshStandardMaterial({
      color: 0xa3162a,
      roughness: 0.58,
    });
    for (const sx of [-2.95, -1.85, 1.85, 2.95]) {
      const stool = new THREE.Group();
      stool.position.set(sx, 0, -0.68);
      const post = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.07, 0.62, 12),
        walnutMat
      );
      post.position.y = 0.31;
      const footRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.16, 0.016, 8, 18),
        brassMat
      );
      footRing.rotation.x = Math.PI / 2;
      footRing.position.y = 0.22;
      const cushion = new THREE.Mesh(
        new THREE.CylinderGeometry(0.24, 0.22, 0.13, 18),
        crimsonVelvetMat
      );
      cushion.position.y = 0.66;
      cushion.castShadow = true;
      stool.add(post, footRing, cushion);
      velvet.add(stool);
    }
    const vipRunner = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 0.012, 0.72),
      crimsonVelvetMat
    );
    vipRunner.position.set(0, 0.006, -0.68);
    vipRunner.receiveShadow = true;
    velvet.add(vipRunner);

    // 4. 'gramophone': Brass Horn Vintage Gramophone with spinning vinyl & floating notes (3.25, 0, -2.05)
    const gramophone = this.upgradeGroups.gramophone;
    gramophone.position.set(3.25, 0, -2.05);
    const gramPedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.38, 0.92, 16),
      walnutMat
    );
    gramPedestal.position.y = 0.46;
    const gramBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.52, 0.2, 0.52),
      walnutMat
    );
    gramBox.position.y = 1.02;

    this.gramophoneDisc = new THREE.Group();
    this.gramophoneDisc.position.y = 1.13;
    const vinyl = new THREE.Mesh(
      new THREE.CylinderGeometry(0.21, 0.21, 0.015, 20),
      new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.2 })
    );
    const label = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.07, 0.018, 16),
      new THREE.MeshBasicMaterial({ color: 0xd32f2f })
    );
    this.gramophoneDisc.add(vinyl, label);

    const hornNeck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.03, 0.34, 10),
      brassMat
    );
    hornNeck.position.set(0.14, 1.28, -0.1);
    const hornBell = new THREE.Mesh(
      new THREE.ConeGeometry(0.34, 0.52, 18, 1, true),
      new THREE.MeshStandardMaterial({
        color: 0xe0b145,
        roughness: 0.2,
        metalness: 0.86,
        side: THREE.DoubleSide,
      })
    );
    hornBell.position.set(-0.08, 1.48, 0.05);
    hornBell.rotation.z = -1.05;
    hornBell.rotation.y = 0.35;
    gramophone.add(gramPedestal, gramBox, this.gramophoneDisc, hornNeck, hornBell);

    const noteGeo = new THREE.OctahedronGeometry(0.055, 0);
    const noteMat = new THREE.MeshBasicMaterial({ color: 0xffd54f });
    for (let i = 0; i < 3; i++) {
      const note = new THREE.Mesh(noteGeo, noteMat);
      this.gramophoneNotes.push(note);
      gramophone.add(note);
    }

    // 5. 'bookshelf': Illuminated Mishima First-Edition Bookshelf (-4.25, 0, -2.15)
    const bookshelf = this.upgradeGroups.bookshelf;
    bookshelf.position.set(-4.25, 0, -2.15);
    bookshelf.rotation.y = 0.38;
    const caseFrame = new THREE.Mesh(
      new THREE.BoxGeometry(1.35, 2.65, 0.38),
      walnutMat
    );
    caseFrame.position.y = 1.325;
    bookshelf.add(caseFrame);

    const spinePalette = [
      0xb71c1c, 0x1a237e, 0xf57f17, 0x1b5e20, 0x4a148c, 0xd84315,
    ];
    for (let row = 0; row < 3; row++) {
      const shelfY = 0.72 + row * 0.68;
      const stripGlow = new THREE.Mesh(
        new THREE.BoxGeometry(1.18, 0.03, 0.08),
        new THREE.MeshBasicMaterial({ color: 0xffe082 })
      );
      stripGlow.position.set(0, shelfY + 0.52, 0.16);
      bookshelf.add(stripGlow);

      for (let b = 0; b < 9; b++) {
        const bookH = 0.34 + ((row + b) % 3) * 0.05;
        const book = new THREE.Mesh(
          new THREE.BoxGeometry(0.1, bookH, 0.24),
          new THREE.MeshStandardMaterial({
            color: spinePalette[(row * 3 + b) % spinePalette.length],
            roughness: 0.45,
          })
        );
        book.position.set(-0.48 + b * 0.12, shelfY + bookH * 0.5, 0.08);
        bookshelf.add(book);
      }
    }
    const shelfLight = new THREE.PointLight(0xffca62, 3.0, 3.5, 1.5);
    shelfLight.position.set(0, 2.1, 0.45);
    bookshelf.add(shelfLight);

    // 6. 'wagashi': Deluxe 3-Tier Wagashi Cake Stand (-2.55, 0.98, 0.95)
    const wagashi = this.upgradeGroups.wagashi;
    wagashi.position.set(-2.55, 0.98, 0.95);
    const spindle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.03, 0.56, 12),
      brassMat
    );
    spindle.position.y = 0.28;
    wagashi.add(spindle);

    this.wagashiTopper = new THREE.Group();
    const plateRadii = [0.28, 0.21, 0.14];
    const plateHeights = [0.12, 0.31, 0.48];
    const dangoColors = [0xff80ab, 0x66bb6a, 0xffca28, 0xab47bc];

    for (let tierIdx = 0; tierIdx < 3; tierIdx++) {
      const r = plateRadii[tierIdx];
      const py = plateHeights[tierIdx];
      const plate = new THREE.Mesh(
        new THREE.CylinderGeometry(r, r * 0.9, 0.024, 18),
        new THREE.MeshStandardMaterial({ color: 0xfffdf7, roughness: 0.2 })
      );
      plate.position.y = py;
      this.wagashiTopper.add(plate);

      const sweetCount = 5 - tierIdx;
      for (let s = 0; s < sweetCount; s++) {
        const ang = (s / sweetCount) * Math.PI * 2;
        const morsel = new THREE.Mesh(
          new THREE.SphereGeometry(0.045, 10, 10),
          new THREE.MeshStandardMaterial({
            color: dangoColors[(tierIdx + s) % dangoColors.length],
            roughness: 0.32,
          })
        );
        morsel.scale.y = 0.78;
        morsel.position.set(
          Math.cos(ang) * (r * 0.58),
          py + 0.04,
          Math.sin(ang) * (r * 0.58)
        );
        this.wagashiTopper.add(morsel);
      }
    }
    wagashi.add(this.wagashiTopper);

    for (const id of ALL_UPGRADE_IDS) {
      this.upgradeGroups[id].visible = false;
      this.upgradeGroups[id].scale.setScalar(0.001);
      this.root.add(this.upgradeGroups[id]);
    }
  }

  // ============================================================================
  // 6. FEVER / RUSH FESTIVE CHOCHIN LANTERNS
  // ============================================================================

  private buildFeverLanterns(): void {
    this.feverLanternGroup.name = 'FeverOverdriveLanterns';
    this.feverLanternGroup.visible = false;

    const capMat = new THREE.MeshStandardMaterial({
      color: 0x211814,
      roughness: 0.4,
    });
    const lanternX = [-1.85, -0.62, 0.62, 1.85];

    for (let i = 0; i < lanternX.length; i++) {
      const lg = new THREE.Group();
      lg.position.set(lanternX[i], 3.38, -2.2);

      const paperMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0xffca28 : 0xff5252,
        emissive: i % 2 === 0 ? 0xff8f00 : 0xd50000,
        emissiveIntensity: 0.9,
        roughness: 0.45,
      });
      this.feverLanternMats.push(paperMat);

      const body = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 14, 12),
        paperMat
      );
      body.scale.y = 1.32;
      const capTop = new THREE.Mesh(
        new THREE.CylinderGeometry(0.09, 0.1, 0.04, 12),
        capMat
      );
      capTop.position.y = 0.23;
      const capBot = capTop.clone();
      capBot.position.y = -0.23;

      lg.add(body, capTop, capBot);
      this.feverLanternGroup.add(lg);
    }

    this.root.add(this.feverLanternGroup);
  }

  // ============================================================================
  // 7. PROCEDURAL TEXTURES (WITH JSDOM HEADLESS DATATEXTURE FALLBACK)
  // ============================================================================

  private createCheckeredTileTexture(): THREE.Texture {
    const cells = 16;
    const data = new Uint8Array(cells * cells * 4);
    for (let y = 0; y < cells; y++) {
      for (let x = 0; x < cells; x++) {
        const isCream = (x + y) % 2 === 0;
        const idx = (y * cells + x) * 4;
        data[idx] = isCream ? 248 : 164;
        data[idx + 1] = isCream ? 236 : 102;
        data[idx + 2] = isCream ? 216 : 70;
        data[idx + 3] = 255;
      }
    }
    const tex = new THREE.DataTexture(data, cells, cells, THREE.RGBAFormat);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3.5, 2.2);
    tex.magFilter = THREE.NearestFilter;
    tex.needsUpdate = true;
    this.ownedTextures.push(tex);
    return tex;
  }

  private createChalkboardTexture(
    title: string,
    subtitle: string
  ): THREE.Texture {
    if (typeof document !== 'undefined') {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 320;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#2f5d50';
        ctx.fillRect(0, 0, 512, 320);

        ctx.strokeStyle = '#e8d8b0';
        ctx.lineWidth = 5;
        ctx.strokeRect(16, 16, 480, 288);

        ctx.fillStyle = '#fffbe6';
        ctx.textAlign = 'center';
        ctx.font = '700 34px "Noto Serif JP", "Pretendard", serif';
        ctx.fillText(title.slice(0, 18), 256, 86);

        ctx.fillStyle = '#ffd97d';
        ctx.font = '600 24px "Pretendard", "Noto Sans KR", sans-serif';
        ctx.fillText(subtitle.slice(0, 22), 256, 142);

        ctx.fillStyle = '#fffbe6';
        ctx.font = '500 21px "Pretendard", "Noto Serif JP", sans-serif';
        ctx.fillText('☕ 金箔抹茶パフェ · 琥珀羹 · サイフォン珈琲', 256, 208);
        ctx.fillStyle = '#cfe8dc';
        ctx.font = '600 20px "Pretendard", "Noto Sans KR", sans-serif';
        ctx.fillText('미시마 문학 한자 80選 특선 블렌드', 256, 260);

        const canvasTex = new THREE.CanvasTexture(canvas);
        canvasTex.colorSpace = THREE.SRGBColorSpace;
        canvasTex.needsUpdate = true;
        this.ownedTextures.push(canvasTex);
        return canvasTex;
      }
    }

    // Headless jsdom fallback (pure RGBA DataTexture)
    const fallbackData = new Uint8Array([47, 93, 80, 255]);
    const fallbackTex = new THREE.DataTexture(
      fallbackData,
      1,
      1,
      THREE.RGBAFormat
    );
    fallbackTex.colorSpace = THREE.SRGBColorSpace;
    fallbackTex.needsUpdate = true;
    this.ownedTextures.push(fallbackTex);
    return fallbackTex;
  }
}
