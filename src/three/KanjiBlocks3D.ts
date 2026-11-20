/**
 * Salon Mishima 3D - Tactile High-Contrast 3D Kanji Blocks & Lacquer Serving Tray
 * File: src/three/KanjiBlocks3D.ts
 *
 * Renders ultra-readable 512x512 ivory-faced 3D wooden Kanji/Kana blocks on a
 * brass-trimmed counter rail alongside an interactive 3D Urushi lacquer serving
 * tray, frothy Matcha Chawan teacup, and seasonal sakura Wagashi sweet.
 */

import * as THREE from 'three';
import type { TaskMode } from '../types/game';
import type { KanjiBlock3DItem } from '../types/three3d';

const COUNTER_TOP_Y = 0.98;
const RAIL_Z = 1.04;
const RAIL_Y = COUNTER_TOP_Y + 0.12;
const BLOCK_TILT_X = 0.56; // ~32 deg tilt toward camera for near-perpendicular glyph readability

const TRAY_REST_Z = 0.28;
const TRAY_SERVE_Z = -0.1;
const TRAY_Y = COUNTER_TOP_Y + 0.02;

interface BlockSlotRuntime {
  root: THREE.Group;
  bodyGroup: THREE.Group;
  faceMesh: THREE.Mesh;
  casingMesh: THREE.Mesh;
  bevelFrameMesh: THREE.Mesh;
  haloMesh: THREE.Mesh;
  hitMesh: THREE.Mesh;
  faceMat: THREE.MeshBasicMaterial;
  casingMat: THREE.MeshStandardMaterial;
  haloMat: THREE.MeshBasicMaterial;
  item: KanjiBlock3DItem | null;
  restPos: THREE.Vector3;
  slideOffset: number;
  hoverAmount: number;
  correctAnimTime: number;
  wrongAnimTime: number;
  wasCorrectFlash: boolean;
  wasWrongFlash: boolean;
}

interface TrayPlacedTileRuntime {
  group: THREE.Group;
  recessMesh: THREE.Mesh;
  tileGroup: THREE.Group;
  faceMesh: THREE.Mesh;
  faceMat: THREE.MeshBasicMaterial;
  currentChar: string | null;
  popProgress: number;
}

export class KanjiBlocks3D {
  public readonly group: THREE.Group;
  private readonly scene: THREE.Scene;

  private railStandGroup: THREE.Group;
  private blocksContainer: THREE.Group;
  private trayGroup: THREE.Group;
  private traySlotsContainer: THREE.Group;
  private teaSetGroup: THREE.Group;

  private blockSlots: BlockSlotRuntime[] = [];
  private trayTiles: TrayPlacedTileRuntime[] = [];
  private pickableMeshes: THREE.Object3D[] = [];
  private raycaster = new THREE.Raycaster();
  private pointerNdc = new THREE.Vector2();

  private textureCache = new Map<string, THREE.CanvasTexture>();
  private ownedGeometries: THREE.BufferGeometry[] = [];
  private ownedMaterials: THREE.Material[] = [];

  private maxAnisotropy: number;
  private hoveredIndex = -1;
  private taskMode: TaskMode = 'pick';
  private activeBlockCount = 0;
  private lastOptionsSignature = '';
  private serveAnimTime = -1;
  private totalTime = 0;

  constructor(scene: THREE.Scene, maxAnisotropy = 8) {
    this.scene = scene;
    this.maxAnisotropy = Math.max(1, maxAnisotropy);

    this.group = new THREE.Group();
    this.group.name = 'KanjiBlocks3D';

    this.railStandGroup = new THREE.Group();
    this.blocksContainer = new THREE.Group();
    this.trayGroup = new THREE.Group();
    this.traySlotsContainer = new THREE.Group();
    this.teaSetGroup = new THREE.Group();

    this.group.add(this.railStandGroup);
    this.group.add(this.trayGroup);
    this.group.add(this.blocksContainer);
    this.scene.add(this.group);

    this.buildCounterRailStand();
    this.buildLacquerServingTray();
    this.ensureBlockPool(6);
    this.ensureTraySlotPool(4);
    this.layoutTraySlots([], 1);
  }

  public setVisible(visible: boolean): void {
    this.group.visible = visible;
    if (!visible) {
      this.hoveredIndex = -1;
    }
  }

  public setMaxAnisotropy(anisotropy: number): void {
    this.maxAnisotropy = Math.max(1, anisotropy);
    for (const tex of this.textureCache.values()) {
      tex.anisotropy = this.maxAnisotropy;
      tex.needsUpdate = true;
    }
  }

  public setTaskMode(mode?: TaskMode): void {
    if (mode && this.taskMode !== mode) {
      this.taskMode = mode;
    }
  }

  public setBlocks(items: KanjiBlock3DItem[]): void {
    const safeItems = Array.isArray(items) ? items : [];
    this.ensureBlockPool(Math.max(6, safeItems.length));
    this.activeBlockCount = safeItems.length;

    const sig = safeItems.map((b) => `${b.id}:${b.label}`).join('|');
    const isFreshConveyorSet = sig !== this.lastOptionsSignature && safeItems.length > 0;
    this.lastOptionsSignature = sig;

    const count = safeItems.length;
    const spacing = count <= 4 ? 0.84 : Math.min(0.84, 2.75 / Math.max(1, count - 1));
    const unitScale = count <= 4 ? 1.0 : Math.max(0.76, 3.6 / count);

    this.pickableMeshes = [];

    for (let i = 0; i < this.blockSlots.length; i++) {
      const slot = this.blockSlots[i];
      if (i >= count) {
        slot.root.visible = false;
        slot.item = null;
        continue;
      }

      const item = safeItems[i];
      slot.root.visible = true;
      slot.root.scale.setScalar(unitScale);

      const xPos = (i - (count - 1) / 2) * spacing;
      slot.restPos.set(xPos, RAIL_Y, RAIL_Z);

      if (isFreshConveyorSet) {
        slot.slideOffset = 2.4 + i * 0.38;
        slot.correctAnimTime = -1;
        slot.wrongAnimTime = -1;
        slot.wasCorrectFlash = false;
        slot.wasWrongFlash = false;
      }

      // Trigger rising edge animations on flash flags
      if (item.isCorrectFlash && !slot.wasCorrectFlash) {
        slot.correctAnimTime = 0;
        this.serveAnimTime = 0;
      }
      if (item.isWrongFlash && !slot.wasWrongFlash) {
        slot.wrongAnimTime = 0;
      }
      slot.wasCorrectFlash = Boolean(item.isCorrectFlash);
      slot.wasWrongFlash = Boolean(item.isWrongFlash);
      slot.item = item;

      // Update high-DPI 512x512 ivory face texture
      const badge = item.sublabel ? String(item.sublabel).replace(/[\[\]]/g, '') : String(i + 1);
      const variant: 'normal' | 'selected' | 'correct' | 'wrong' = item.isCorrectFlash
        ? 'correct'
        : item.isWrongFlash
          ? 'wrong'
          : item.isSelected
            ? 'selected'
            : 'normal';

      const tex = this.getOrCreateGlyphTexture(item.label, badge, variant);
      if (tex) {
        slot.faceMat.map = tex;
        slot.faceMat.color.setHex(0xffffff);
        slot.faceMat.needsUpdate = true;
      } else {
        slot.faceMat.color.setHex(
          variant === 'correct'
            ? 0xd1fae5
            : variant === 'wrong'
              ? 0xfee2e2
              : 0xfffdf7
        );
      }

      slot.hitMesh.userData.blockIndex = i;
      slot.faceMesh.userData.blockIndex = i;
      slot.casingMesh.userData.blockIndex = i;
      this.pickableMeshes.push(slot.hitMesh, slot.faceMesh, slot.casingMesh);
    }

    if (this.hoveredIndex >= count) {
      this.hoveredIndex = -1;
    }
  }

  /** Alias for test / external convenience */
  public updateBlocks(items: KanjiBlock3DItem[]): void {
    this.setBlocks(items);
  }

  public setTray(traySlots: (string | null)[], targetWordLength = 1): void {
    const safeSlots = Array.isArray(traySlots) ? traySlots : [];
    const effectiveLen = Math.max(safeSlots.length, targetWordLength || 0, 1);
    this.ensureTraySlotPool(Math.max(4, effectiveLen));
    this.layoutTraySlots(safeSlots, effectiveLen);

    // Trigger celebratory tray slide when all compound slots in build mode fill up
    if (
      safeSlots.length >= 2 &&
      safeSlots.every((ch) => typeof ch === 'string' && ch.length > 0) &&
      this.serveAnimTime < 0
    ) {
      this.serveAnimTime = 0;
    }
  }

  /** Alias for test / external convenience */
  public updateTray(traySlots: (string | null)[], targetWordLength = 1): void {
    this.setTray(traySlots, targetWordLength);
  }

  public triggerServeAnimation(): void {
    this.serveAnimTime = 0;
  }

  public setHoveredIndex(index: number): void {
    this.hoveredIndex = index >= 0 && index < this.activeBlockCount ? index : -1;
  }

  public updateHoverAtNDC(ndcX: number, ndcY: number, camera: THREE.Camera): number {
    if (!this.group.visible || this.activeBlockCount === 0) {
      this.hoveredIndex = -1;
      return -1;
    }
    const hit = this.raycastBlockIndex(ndcX, ndcY, camera);
    this.hoveredIndex = hit;
    return hit;
  }

  public pickBlockAtNDC(
    ndcX: number,
    ndcY: number,
    camera: THREE.Camera
  ): { index: number; label: string } | null {
    if (!this.group.visible || this.activeBlockCount === 0) return null;
    const hitIdx = this.raycastBlockIndex(ndcX, ndcY, camera);
    if (hitIdx < 0 || hitIdx >= this.activeBlockCount) return null;
    const item = this.blockSlots[hitIdx]?.item;
    if (!item) return null;
    return { index: hitIdx, label: item.label };
  }

  private raycastBlockIndex(ndcX: number, ndcY: number, camera: THREE.Camera): number {
    this.pointerNdc.set(ndcX, ndcY);
    this.raycaster.setFromCamera(this.pointerNdc, camera);
    const hits = this.raycaster.intersectObjects(this.pickableMeshes, false);
    for (const hit of hits) {
      const idx = hit.object.userData?.blockIndex;
      if (typeof idx === 'number' && idx >= 0 && idx < this.activeBlockCount) {
        return idx;
      }
    }
    return -1;
  }

  public update(dt: number, elapsed?: number): void {
    const safeDt = Math.min(Math.max(dt, 0), 0.1);
    this.totalTime = elapsed !== undefined ? elapsed : this.totalTime + safeDt;

    // 1. Animate Lacquer Serving Tray + Matcha Set slide across the counter
    let trayZ = TRAY_REST_Z;
    if (this.serveAnimTime >= 0) {
      this.serveAnimTime += safeDt;
      const duration = 0.85;
      if (this.serveAnimTime <= duration) {
        const p = this.serveAnimTime / duration;
        // Smooth forward slide toward customer and gentle return
        const forwardCurve = Math.sin(p * Math.PI);
        trayZ = TRAY_REST_Z + (TRAY_SERVE_Z - TRAY_REST_Z) * forwardCurve;
      } else {
        this.serveAnimTime = -1;
      }
    }
    this.trayGroup.position.set(0, TRAY_Y, trayZ);

    // Subtle floating steam/foam shimmer on matcha cup
    this.teaSetGroup.rotation.y = Math.sin(this.totalTime * 1.2) * 0.04;

    // 2. Animate placed compound tiles inside the serving tray
    for (const tile of this.trayTiles) {
      if (tile.tileGroup.visible && tile.popProgress < 1) {
        tile.popProgress = Math.min(1, tile.popProgress + safeDt * 6.5);
        const p = tile.popProgress;
        const arcY = Math.sin(p * Math.PI) * 0.24;
        const bounceScale = 0.75 + 0.25 * p + Math.sin(p * Math.PI) * 0.08;
        tile.tileGroup.position.y = 0.045 + arcY;
        tile.tileGroup.scale.setScalar(bounceScale);
      }
    }

    // 3. Animate foreground 3D Kanji Blocks (conveyor slide, hover lift, pick arc, wrong wobble)
    for (let i = 0; i < this.activeBlockCount; i++) {
      const slot = this.blockSlots[i];
      const item = slot.item;
      if (!slot.root.visible || !item) continue;

      // Smooth conveyor slide-in decay
      if (Math.abs(slot.slideOffset) > 0.001) {
        slot.slideOffset *= Math.exp(-10.5 * safeDt);
        if (Math.abs(slot.slideOffset) < 0.002) slot.slideOffset = 0;
      }

      const isHovered = this.hoveredIndex === i;
      const targetHover = isHovered ? 1 : 0;
      slot.hoverAmount += (targetHover - slot.hoverAmount) * (1 - Math.exp(-16 * safeDt));

      let posX = slot.restPos.x + slot.slideOffset;
      let posY = slot.restPos.y + slot.hoverAmount * 0.13 + (item.isSelected ? 0.06 : 0);
      let posZ = slot.restPos.z - slot.hoverAmount * 0.05;
      let rotX = BLOCK_TILT_X - slot.hoverAmount * 0.1;
      let rotY = 0;
      let rotZ = 0;
      let scaleBoost = 1 + slot.hoverAmount * 0.075;

      // Gentle idle alive micro-float
      posY += Math.sin(this.totalTime * 2.6 + i * 0.9) * 0.008;

      // Correct pick spring-arc onto the serving tray!
      if (slot.correctAnimTime >= 0) {
        slot.correctAnimTime += safeDt;
        const p = Math.min(1, slot.correctAnimTime / 0.48);
        if (this.taskMode !== 'build') {
          // Parabolic arc onto the serving tray center pad alongside matcha set
          const targetTrayX = -0.18;
          const targetTrayY = TRAY_Y + 0.11;
          const targetTrayZ = trayZ + 0.02;
          posX = THREE.MathUtils.lerp(posX, targetTrayX, p * 0.88);
          posZ = THREE.MathUtils.lerp(posZ, targetTrayZ, p * 0.88);
          posY = THREE.MathUtils.lerp(posY, targetTrayY, p * 0.88) + Math.sin(p * Math.PI) * 0.48;
          rotX = THREE.MathUtils.lerp(rotX, 0.18, p);
          scaleBoost = 1 + Math.sin(p * Math.PI) * 0.14;
        } else {
          // Joyful spring hop when contributing to compound tray
          posY += Math.sin(p * Math.PI) * 0.28;
          scaleBoost = 1 + Math.sin(p * Math.PI) * 0.12;
        }
        if (slot.correctAnimTime > 0.65 && !item.isCorrectFlash) {
          slot.correctAnimTime = -1;
        }
      }

      // Wrong pick vermilion wobble-recoil!
      if (slot.wrongAnimTime >= 0) {
        slot.wrongAnimTime += safeDt;
        const t = slot.wrongAnimTime;
        const decay = Math.exp(-t * 6.5);
        const wobble = Math.sin(t * 38) * decay;
        posX += wobble * 0.12;
        posZ += decay * 0.08;
        rotZ = wobble * 0.18;
        rotY = wobble * 0.12;
        if (t > 0.6 && !item.isWrongFlash) {
          slot.wrongAnimTime = -1;
        }
      }

      slot.root.position.set(posX, posY, posZ);
      slot.bodyGroup.rotation.set(rotX, rotY, rotZ);
      slot.bodyGroup.scale.setScalar(scaleBoost);

      // Update glowing halo & wooden casing tint
      if (item.isCorrectFlash) {
        slot.haloMesh.visible = true;
        slot.haloMat.color.setHex(0x10b981);
        slot.haloMat.opacity = 0.78;
        slot.casingMat.color.setHex(0x059669);
      } else if (item.isWrongFlash) {
        slot.haloMesh.visible = true;
        slot.haloMat.color.setHex(0xef4444);
        slot.haloMat.opacity = 0.82;
        slot.casingMat.color.setHex(0xb91c1c);
      } else if (item.isSelected || slot.hoverAmount > 0.04) {
        slot.haloMesh.visible = true;
        slot.haloMat.color.setHex(0xfbbf24);
        slot.haloMat.opacity = Math.max(item.isSelected ? 0.65 : 0, slot.hoverAmount * 0.72);
        slot.casingMat.color.setHex(0xd97706);
      } else {
        slot.haloMesh.visible = false;
        slot.casingMat.color.setHex(0x9a5220);
      }
    }
  }

  private trackGeo<T extends THREE.BufferGeometry>(geo: T): T {
    this.ownedGeometries.push(geo);
    return geo;
  }

  private trackMat<T extends THREE.Material>(mat: T): T {
    this.ownedMaterials.push(mat);
    return mat;
  }

  private buildCounterRailStand(): void {
    // Rich mahogany & polished brass sloped rack supporting the 4 kanji blocks
    const rackWoodMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x4a2511,
        roughness: 0.42,
        metalness: 0.08,
      })
    );
    const brassMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xd99b26,
        roughness: 0.26,
        metalness: 0.78,
      })
    );

    const basePlinthGeo = this.trackGeo(new THREE.BoxGeometry(3.56, 0.055, 0.62));
    const basePlinth = new THREE.Mesh(basePlinthGeo, rackWoodMat);
    basePlinth.position.set(0, COUNTER_TOP_Y + 0.028, RAIL_Z);
    basePlinth.receiveShadow = true;
    this.railStandGroup.add(basePlinth);

    // Front brass lip rail catching the bottom of the tilted blocks
    const lipGeo = this.trackGeo(new THREE.CylinderGeometry(0.022, 0.022, 3.52, 14));
    const lip = new THREE.Mesh(lipGeo, brassMat);
    lip.rotation.z = Math.PI / 2;
    lip.position.set(0, COUNTER_TOP_Y + 0.068, RAIL_Z + 0.28);
    this.railStandGroup.add(lip);

    // Back wooden easel bar propping the blocks at BLOCK_TILT_X
    const backBarGeo = this.trackGeo(new THREE.BoxGeometry(3.48, 0.16, 0.08));
    const backBar = new THREE.Mesh(backBarGeo, rackWoodMat);
    backBar.position.set(0, COUNTER_TOP_Y + 0.1, RAIL_Z - 0.16);
    this.railStandGroup.add(backBar);
  }

  private buildLacquerServingTray(): void {
    this.trayGroup.position.set(0, TRAY_Y, TRAY_REST_Z);

    const urushiBlackMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x1f0d0b,
        roughness: 0.22,
        metalness: 0.18,
      })
    );
    const urushiVermilionMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x991b1b,
        roughness: 0.28,
        metalness: 0.12,
      })
    );
    const goldTrimMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xeab308,
        roughness: 0.3,
        metalness: 0.72,
      })
    );
    const bambooMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xfef0c7,
        roughness: 0.75,
        metalness: 0.02,
      })
    );

    // Tray slab & vermilion inner bed
    const trayWidth = 1.92;
    const trayDepth = 0.66;
    const baseGeo = this.trackGeo(new THREE.BoxGeometry(trayWidth, 0.04, trayDepth));
    const baseMesh = new THREE.Mesh(baseGeo, urushiBlackMat);
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    this.trayGroup.add(baseMesh);

    const innerBedGeo = this.trackGeo(new THREE.BoxGeometry(trayWidth - 0.08, 0.044, trayDepth - 0.08));
    const innerBed = new THREE.Mesh(innerBedGeo, urushiVermilionMat);
    innerBed.position.y = 0.004;
    this.trayGroup.add(innerBed);

    // Woven cream bamboo coaster mat on left/center for kanji blocks
    const matGeo = this.trackGeo(new THREE.BoxGeometry(1.16, 0.048, trayDepth - 0.14));
    const matMesh = new THREE.Mesh(matGeo, bambooMat);
    matMesh.position.set(-0.28, 0.006, 0);
    this.trayGroup.add(matMesh);

    // Raised lacquer rims with gold top trim
    const longRimGeo = this.trackGeo(new THREE.BoxGeometry(trayWidth, 0.075, 0.045));
    for (const side of [-1, 1]) {
      const rim = new THREE.Mesh(longRimGeo, urushiBlackMat);
      rim.position.set(0, 0.025, side * (trayDepth / 2 - 0.022));
      this.trayGroup.add(rim);
    }
    const shortRimGeo = this.trackGeo(new THREE.BoxGeometry(0.045, 0.075, trayDepth));
    for (const side of [-1, 1]) {
      const rim = new THREE.Mesh(shortRimGeo, urushiBlackMat);
      rim.position.set(side * (trayWidth / 2 - 0.022), 0.025, 0);
      this.trayGroup.add(rim);
    }
    const goldInlayGeo = this.trackGeo(new THREE.BoxGeometry(trayWidth - 0.03, 0.01, trayDepth - 0.03));
    const goldInlay = new THREE.Mesh(goldInlayGeo, goldTrimMat);
    goldInlay.position.y = 0.026;
    this.trayGroup.add(goldInlay);

    // Dynamic compound slots container
    this.traySlotsContainer.position.set(-0.28, 0.03, 0);
    this.trayGroup.add(this.traySlotsContainer);

    // Cute 3D Matcha Chawan & Sakura Wagashi on right side of tray
    this.teaSetGroup.position.set(0.58, 0.03, 0);
    this.trayGroup.add(this.teaSetGroup);

    // 1) Ceramic Matcha Chawan
    const ceramicMat = this.trackMat(
      new THREE.MeshStandardMaterial({ color: 0x292524, roughness: 0.42, metalness: 0.08 })
    );
    const matchaMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x22c55e,
        roughness: 0.35,
        emissive: new THREE.Color(0x14532d),
        emissiveIntensity: 0.28,
      })
    );
    const foamMat = this.trackMat(
      new THREE.MeshStandardMaterial({ color: 0xdcfce7, roughness: 0.55 })
    );

    const bowlGeo = this.trackGeo(new THREE.CylinderGeometry(0.145, 0.095, 0.16, 18));
    const bowl = new THREE.Mesh(bowlGeo, ceramicMat);
    bowl.position.set(-0.08, 0.085, -0.06);
    bowl.castShadow = true;
    this.teaSetGroup.add(bowl);

    const teaLiquidGeo = this.trackGeo(new THREE.CircleGeometry(0.132, 18));
    const teaLiquid = new THREE.Mesh(teaLiquidGeo, matchaMat);
    teaLiquid.rotation.x = -Math.PI / 2;
    teaLiquid.position.set(-0.08, 0.166, -0.06);
    this.teaSetGroup.add(teaLiquid);

    const foamRingGeo = this.trackGeo(new THREE.TorusGeometry(0.095, 0.018, 8, 18));
    const foamRing = new THREE.Mesh(foamRingGeo, foamMat);
    foamRing.rotation.x = Math.PI / 2;
    foamRing.position.set(-0.08, 0.168, -0.06);
    this.teaSetGroup.add(foamRing);

    // 2) Dainty Wagashi Dish + Sakura Nerikiri Sweet with Gold Leaf
    const dishMat = this.trackMat(
      new THREE.MeshStandardMaterial({ color: 0xfffbeb, roughness: 0.25 })
    );
    const sakuraSweetMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xfb7185,
        roughness: 0.48,
        emissive: new THREE.Color(0x4c0519),
        emissiveIntensity: 0.16,
      })
    );

    const dishGeo = this.trackGeo(new THREE.CylinderGeometry(0.12, 0.09, 0.024, 16));
    const dish = new THREE.Mesh(dishGeo, dishMat);
    dish.position.set(0.12, 0.014, 0.12);
    this.teaSetGroup.add(dish);

    const sweetGeo = this.trackGeo(new THREE.SphereGeometry(0.072, 14, 12));
    const sweet = new THREE.Mesh(sweetGeo, sakuraSweetMat);
    sweet.scale.set(1.08, 0.72, 1.08);
    sweet.position.set(0.12, 0.062, 0.12);
    sweet.castShadow = true;
    this.teaSetGroup.add(sweet);

    const goldLeafGeo = this.trackGeo(new THREE.OctahedronGeometry(0.022, 0));
    const goldLeaf = new THREE.Mesh(goldLeafGeo, goldTrimMat);
    goldLeaf.scale.set(1.2, 0.35, 1.2);
    goldLeaf.position.set(0.12, 0.115, 0.12);
    this.teaSetGroup.add(goldLeaf);
  }

  private ensureBlockPool(targetSize: number): void {
    if (this.blockSlots.length >= targetSize) return;

    const casingGeo = this.trackGeo(new THREE.BoxGeometry(0.72, 0.18, 0.76));
    const bevelFrameGeo = this.trackGeo(new THREE.BoxGeometry(0.745, 0.14, 0.785));
    const faceGeo = this.trackGeo(new THREE.PlaneGeometry(0.66, 0.7));
    const haloGeo = this.trackGeo(new THREE.PlaneGeometry(0.86, 0.9));
    const hitGeo = this.trackGeo(new THREE.BoxGeometry(0.82, 0.32, 0.86));

    const goldBevelMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.32,
        metalness: 0.58,
      })
    );
    const invisibleHitMat = this.trackMat(
      new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthWrite: false,
      })
    );

    while (this.blockSlots.length < targetSize) {
      const root = new THREE.Group();
      root.visible = false;

      const bodyGroup = new THREE.Group();
      bodyGroup.rotation.x = BLOCK_TILT_X;
      root.add(bodyGroup);

      const casingMat = this.trackMat(
        new THREE.MeshStandardMaterial({
          color: 0x9a5220,
          roughness: 0.46,
          metalness: 0.08,
        })
      );
      const casingMesh = new THREE.Mesh(casingGeo, casingMat);
      casingMesh.castShadow = true;
      casingMesh.receiveShadow = true;
      bodyGroup.add(casingMesh);

      const bevelFrameMesh = new THREE.Mesh(bevelFrameGeo, goldBevelMat);
      bevelFrameMesh.position.y = -0.01;
      bodyGroup.add(bevelFrameMesh);

      // Unlit toneMapped:false ivory face guarantees 100% razor-sharp contrast in all lighting!
      const faceMat = this.trackMat(
        new THREE.MeshBasicMaterial({
          color: 0xfffdf7,
          toneMapped: false,
        })
      );
      const faceMesh = new THREE.Mesh(faceGeo, faceMat);
      faceMesh.rotation.x = -Math.PI / 2;
      faceMesh.position.y = 0.092;
      bodyGroup.add(faceMesh);

      const haloMat = this.trackMat(
        new THREE.MeshBasicMaterial({
          color: 0xfbbf24,
          transparent: true,
          opacity: 0,
          depthWrite: false,
          toneMapped: false,
        })
      );
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      haloMesh.rotation.x = -Math.PI / 2;
      haloMesh.position.y = -0.092;
      haloMesh.visible = false;
      bodyGroup.add(haloMesh);

      const hitMesh = new THREE.Mesh(hitGeo, invisibleHitMat);
      bodyGroup.add(hitMesh);

      this.blocksContainer.add(root);

      this.blockSlots.push({
        root,
        bodyGroup,
        faceMesh,
        casingMesh,
        bevelFrameMesh,
        haloMesh,
        hitMesh,
        faceMat,
        casingMat,
        haloMat,
        item: null,
        restPos: new THREE.Vector3(),
        slideOffset: 0,
        hoverAmount: 0,
        correctAnimTime: -1,
        wrongAnimTime: -1,
        wasCorrectFlash: false,
        wasWrongFlash: false,
      });
    }
  }

  private ensureTraySlotPool(targetSize: number): void {
    if (this.trayTiles.length >= targetSize) return;

    const recessGeo = this.trackGeo(new THREE.BoxGeometry(0.34, 0.016, 0.36));
    const recessMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x78350f,
        roughness: 0.55,
      })
    );
    const miniTileGeo = this.trackGeo(new THREE.BoxGeometry(0.31, 0.075, 0.33));
    const miniWoodMat = this.trackMat(
      new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.4 })
    );
    const miniFaceGeo = this.trackGeo(new THREE.PlaneGeometry(0.285, 0.305));

    while (this.trayTiles.length < targetSize) {
      const group = new THREE.Group();
      group.visible = false;

      const recessMesh = new THREE.Mesh(recessGeo, recessMat);
      recessMesh.position.y = 0.008;
      group.add(recessMesh);

      const tileGroup = new THREE.Group();
      tileGroup.position.y = 0.045;
      tileGroup.visible = false;
      group.add(tileGroup);

      const miniBody = new THREE.Mesh(miniTileGeo, miniWoodMat);
      miniBody.castShadow = true;
      tileGroup.add(miniBody);

      const faceMat = this.trackMat(
        new THREE.MeshBasicMaterial({ color: 0xfffdf7, toneMapped: false })
      );
      const faceMesh = new THREE.Mesh(miniFaceGeo, faceMat);
      faceMesh.rotation.x = -Math.PI / 2;
      faceMesh.position.y = 0.039;
      tileGroup.add(faceMesh);

      this.traySlotsContainer.add(group);
      this.trayTiles.push({
        group,
        recessMesh,
        tileGroup,
        faceMesh,
        faceMat,
        currentChar: null,
        popProgress: 1,
      });
    }
  }

  private layoutTraySlots(traySlots: (string | null)[], slotCount: number): void {
    const count = Math.max(1, slotCount);
    const spacing = count <= 2 ? 0.42 : Math.min(0.38, 1.04 / Math.max(1, count - 1));
    const scale = count <= 3 ? 1.0 : Math.max(0.75, 2.8 / count);

    for (let i = 0; i < this.trayTiles.length; i++) {
      const slot = this.trayTiles[i];
      if (i >= count) {
        slot.group.visible = false;
        slot.currentChar = null;
        continue;
      }

      slot.group.visible = true;
      slot.group.scale.setScalar(scale);
      slot.group.position.set((i - (count - 1) / 2) * spacing, 0, 0);

      const placed = traySlots[i] ?? null;
      if (placed) {
        if (slot.currentChar !== placed) {
          slot.currentChar = placed;
          slot.popProgress = 0;
          const tex = this.getOrCreateGlyphTexture(placed, '', 'selected');
          if (tex) {
            slot.faceMat.map = tex;
            slot.faceMat.needsUpdate = true;
          }
        }
        slot.tileGroup.visible = true;
      } else {
        slot.currentChar = null;
        slot.tileGroup.visible = false;
      }
    }
  }

  /**
   * Paints a crystal-clear 512x512 ivory face texture with >= 18:1 WCAG AAA contrast:
   * - Warm ivory #FFFDF7 face
   * - Double gold/wood bevel border
   * - High-contrast top-left [1]..[4] key badge
   * - Jet-black #111111 Kanji or Kana glyph
   */
  private getOrCreateGlyphTexture(
    label: string,
    keyBadge: string,
    variant: 'normal' | 'selected' | 'correct' | 'wrong'
  ): THREE.CanvasTexture | null {
    const cacheKey = `${label}__${keyBadge}__${variant}`;
    const existing = this.textureCache.get(cacheKey);
    if (existing) return existing;

    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // 1. Warm ivory card face (tinted subtly on flash states while preserving dark ink contrast)
    const bgHex =
      variant === 'correct'
        ? '#ecfdf5'
        : variant === 'wrong'
          ? '#fef2f2'
          : variant === 'selected'
            ? '#fffbeb'
            : '#FFFDF7';
    const outerBorderHex =
      variant === 'correct'
        ? '#059669'
        : variant === 'wrong'
          ? '#dc2626'
          : variant === 'selected'
            ? '#d97706'
            : '#c2812d';
    const innerBorderHex =
      variant === 'correct'
        ? '#10b981'
        : variant === 'wrong'
          ? '#ef4444'
          : '#78350f';

    ctx.fillStyle = bgHex;
    ctx.fillRect(0, 0, 512, 512);

    // 2. Crisp beveled gold & dark wood frame border
    ctx.strokeStyle = outerBorderHex;
    ctx.lineWidth = 22;
    ctx.strokeRect(14, 14, 484, 484);

    ctx.strokeStyle = innerBorderHex;
    ctx.lineWidth = 5;
    ctx.strokeRect(34, 34, 444, 444);

    // Subtle corner ornaments
    ctx.fillStyle = outerBorderHex;
    const corners = [
      [34, 34],
      [464, 34],
      [34, 464],
      [464, 464],
    ];
    for (const [cx, cy] of corners) {
      ctx.fillRect(cx - 7, cy - 7, 14, 14);
    }

    // 3. Clear [1]..[4] hotkey badge in top-left corner
    if (keyBadge) {
      ctx.fillStyle = variant === 'correct' ? '#065f46' : variant === 'wrong' ? '#991b1b' : '#1c1917';
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(46, 46, 86, 62, 14);
      } else {
        ctx.rect(46, 46, 86, 62);
      }
      ctx.fill();

      ctx.fillStyle = '#FFFDF7';
      ctx.font = "800 38px 'Pretendard Variable', 'Pretendard', 'Noto Sans KR', sans-serif";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(keyBadge, 89, 78);
    }

    // 4. Ultra-crisp jet-black #111111 Kanji or Kana glyph
    const cleanLabel = String(label || '').trim();
    const charLen = Array.from(cleanLabel).length;

    let fontSize = 276;
    let fontFamily = "'Noto Serif JP', 'Yu Mincho', 'Hiragino Mincho ProN', serif";
    if (charLen === 2) {
      fontSize = 186;
      fontFamily = "'Noto Serif JP', 'Pretendard Variable', 'Noto Sans JP', serif";
    } else if (charLen === 3) {
      fontSize = 138;
      fontFamily = "'Pretendard Variable', 'Noto Sans JP', 'Noto Serif JP', sans-serif";
    } else if (charLen >= 4) {
      fontSize = Math.max(82, Math.floor(420 / charLen));
      fontFamily = "'Pretendard Variable', 'Noto Sans JP', sans-serif";
    }

    ctx.font = `900 ${fontSize}px ${fontFamily}`;
    const measured = ctx.measureText(cleanLabel);
    if (measured && measured.width > 420 && measured.width > 0) {
      fontSize = Math.max(72, Math.floor((fontSize * 420) / measured.width));
      ctx.font = `900 ${fontSize}px ${fontFamily}`;
    }

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Subtle crisp paper emboss highlight for depth, then jet-black #111111 ink
    ctx.fillStyle = 'rgba(180, 120, 40, 0.16)';
    ctx.fillText(cleanLabel, 259, keyBadge ? 290 : 268);

    ctx.fillStyle = '#111111';
    ctx.fillText(cleanLabel, 256, keyBadge ? 286 : 264);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = this.maxAnisotropy;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;

    this.textureCache.set(cacheKey, texture);
    return texture;
  }

  public dispose(): void {
    for (const tex of this.textureCache.values()) {
      tex.dispose();
    }
    this.textureCache.clear();

    for (const g of this.ownedGeometries) {
      g.dispose();
    }
    for (const m of this.ownedMaterials) {
      m.dispose();
    }
    this.ownedGeometries = [];
    this.ownedMaterials = [];
    this.pickableMeshes = [];
    this.scene.remove(this.group);
  }
}

export default KanjiBlocks3D;
