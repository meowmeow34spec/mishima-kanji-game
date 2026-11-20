/**
 * Salon Mishima 3D - Theatrical Phantom Mishima Boss & Orbiting Kanji Tablets
 * File: src/three/BossAvatar3D.ts
 *
 * Renders an imposing crimson-haori & golden-mask Boss Avatar behind the counter
 * during 'boss' duels, flanked by orbiting 3D Kanji Stone/Wood Tablets that
 * crack/recoil when damaged and lunge forward when attacking.
 */

import * as THREE from 'three';
import type { BossKanjiPair } from '../types/curriculum';
import type { BossBattleState } from '../types/game';

const BOSS_BASE_Z = -0.96;
const BOSS_BASE_Y = 0.08;

interface BossTabletRuntime {
  group: THREE.Group;
  stoneMesh: THREE.Mesh;
  faceMesh: THREE.Mesh;
  faceMat: THREE.MeshBasicMaterial;
  stoneMat: THREE.MeshStandardMaterial;
  character: string;
  crackStage: number;
  recoilOffset: THREE.Vector3;
  recoilRotZ: number;
}

export class BossAvatar3D {
  public readonly group: THREE.Group;
  private readonly scene: THREE.Scene;

  private figurePivot: THREE.Group;
  private maskGroup: THREE.Group;
  private sunHaloGroup: THREE.Group;
  private rightSwordArm: THREE.Group;
  private leftSleeveArm: THREE.Group;
  private tabletsGroup: THREE.Group;
  private haoriMat: THREE.MeshStandardMaterial | null = null;
  private maskMat: THREE.MeshStandardMaterial | null = null;
  private eyeGlowMat: THREE.MeshBasicMaterial | null = null;

  private tablets: BossTabletRuntime[] = [];
  private textureCache = new Map<string, THREE.CanvasTexture>();
  private ownedGeometries: THREE.BufferGeometry[] = [];
  private ownedMaterials: THREE.Material[] = [];

  private maxAnisotropy: number;
  private currentPairId: string | null = null;
  private lastBossHp: number | null = null;
  private lastPlayerHearts: number | null = null;
  private damageRatio = 0;
  private isDefeated = false;

  private hitAnimTime = -1;
  private attackAnimTime = -1;
  private totalTime = 0;

  constructor(scene: THREE.Scene, maxAnisotropy = 8) {
    this.scene = scene;
    this.maxAnisotropy = Math.max(1, maxAnisotropy);

    this.group = new THREE.Group();
    this.group.name = 'BossAvatar3D';
    this.group.position.set(0, BOSS_BASE_Y, BOSS_BASE_Z);
    this.group.visible = false;

    this.figurePivot = new THREE.Group();
    this.maskGroup = new THREE.Group();
    this.sunHaloGroup = new THREE.Group();
    this.rightSwordArm = new THREE.Group();
    this.leftSleeveArm = new THREE.Group();
    this.tabletsGroup = new THREE.Group();

    this.group.add(this.figurePivot);
    this.group.add(this.tabletsGroup);
    this.scene.add(this.group);

    this.buildPhantomFigure();
    this.ensureTabletPool(6);
  }

  public setVisible(visible: boolean): void {
    this.group.visible = visible;
  }

  public setMaxAnisotropy(anisotropy: number): void {
    this.maxAnisotropy = Math.max(1, anisotropy);
    for (const tex of this.textureCache.values()) {
      tex.anisotropy = this.maxAnisotropy;
      tex.needsUpdate = true;
    }
  }

  public setBoss(
    bossPair: BossKanjiPair | null | undefined,
    bossHp = 10,
    maxBossHp = 10,
    isDefeated = false
  ): void {
    if (!bossPair) {
      this.group.visible = false;
      this.currentPairId = null;
      this.lastBossHp = null;
      return;
    }

    this.group.visible = true;
    const safeMax = Math.max(1, maxBossHp);
    const clampedHp = Math.max(0, Math.min(safeMax, bossHp));
    this.damageRatio = 1 - clampedHp / safeMax;
    this.isDefeated = isDefeated || clampedHp <= 0;

    if (this.currentPairId === bossPair.id && this.lastBossHp !== null && clampedHp < this.lastBossHp) {
      this.triggerHit();
    }
    this.currentPairId = bossPair.id;
    this.lastBossHp = clampedHp;

    const chars = [
      bossPair.characterA,
      bossPair.characterB,
      ...(bossPair.additionalCharacters ?? []),
    ].filter(Boolean);

    this.syncTablets(chars, this.damageRatio);
  }

  public setBossState(bossState: Partial<BossBattleState> | null | undefined): void {
    if (!bossState || !bossState.bossPair) {
      this.setBoss(null);
      this.lastPlayerHearts = null;
      return;
    }

    if (
      this.lastPlayerHearts !== null &&
      typeof bossState.playerHearts === 'number' &&
      bossState.playerHearts < this.lastPlayerHearts
    ) {
      this.triggerAttack();
    }
    if (typeof bossState.playerHearts === 'number') {
      this.lastPlayerHearts = bossState.playerHearts;
    }

    this.setBoss(
      bossState.bossPair,
      bossState.bossHp ?? bossState.bossPair.bossHp ?? 10,
      bossState.maxBossHp ?? bossState.bossPair.bossHp ?? 10,
      Boolean(bossState.isDefeated)
    );
  }

  public triggerHit(): void {
    this.hitAnimTime = 0;
    for (let i = 0; i < this.tablets.length; i++) {
      const tab = this.tablets[i];
      const dir = i % 2 === 0 ? -1 : 1;
      tab.recoilOffset.set(dir * 0.28, 0.16, -0.22);
      tab.recoilRotZ = dir * 0.36;
    }
  }

  public triggerAttack(): void {
    this.attackAnimTime = 0;
  }

  public update(dt: number, elapsed?: number): void {
    if (!this.group.visible) return;
    const safeDt = Math.min(Math.max(dt, 0), 0.1);
    this.totalTime = elapsed !== undefined ? elapsed : this.totalTime + safeDt;

    // 1. Phantom hover, hit stagger, and attack lunge
    let figX = 0;
    let figY = Math.sin(this.totalTime * 2.2) * 0.075;
    let figZ = 0;
    let figPitch = 0;
    let figYaw = Math.sin(this.totalTime * 1.1) * 0.06;
    let swordRotX = -0.38 + Math.sin(this.totalTime * 2.2) * 0.08;
    let swordRotZ = -0.35;
    let hitFlash = 0;

    if (this.hitAnimTime >= 0) {
      this.hitAnimTime += safeDt;
      const t = this.hitAnimTime;
      const decay = Math.exp(-t * 5.8);
      figX = Math.sin(t * 46) * 0.18 * decay;
      figZ = -0.32 * decay;
      figPitch = -0.22 * decay;
      hitFlash = decay;
      if (t > 0.65) {
        this.hitAnimTime = -1;
      }
    }

    if (this.attackAnimTime >= 0) {
      this.attackAnimTime += safeDt;
      const dur = 0.58;
      if (this.attackAnimTime <= dur) {
        const p = this.attackAnimTime / dur;
        const lunge = Math.sin(p * Math.PI);
        figZ += lunge * 0.92;
        figY += lunge * 0.18;
        figPitch += lunge * 0.26;
        swordRotX = -1.45 + p * 2.1;
        swordRotZ = -0.8 + p * 1.35;
      } else {
        this.attackAnimTime = -1;
      }
    }

    if (this.isDefeated) {
      figY = -0.35;
      figPitch = 0.42;
    }

    this.figurePivot.position.set(figX, figY, figZ);
    this.figurePivot.rotation.set(figPitch, figYaw, 0);
    this.maskGroup.rotation.z = Math.sin(this.totalTime * 1.7) * 0.04;
    this.sunHaloGroup.rotation.z = this.totalTime * 0.65;
    this.rightSwordArm.rotation.set(swordRotX, 0, swordRotZ);
    this.leftSleeveArm.rotation.set(-0.22 + Math.cos(this.totalTime * 2.2) * 0.08, 0, 0.32);

    if (this.haoriMat) {
      this.haoriMat.emissive.setRGB(0.22 + hitFlash * 0.7, hitFlash * 0.28, hitFlash * 0.15);
    }
    if (this.maskMat) {
      this.maskMat.emissive.setRGB(0.18 + hitFlash * 0.6, 0.1 + hitFlash * 0.45, hitFlash * 0.2);
    }
    if (this.eyeGlowMat) {
      const pulse = 0.78 + Math.sin(this.totalTime * 8) * 0.22;
      this.eyeGlowMat.color.setRGB(1.0, 0.18 * pulse, 0.12 * pulse);
    }

    // 2. Orbiting 3D Kanji Stone/Wood Tablets
    const activeTabs = this.tablets.filter((t) => t.group.visible);
    const count = activeTabs.length;
    for (let i = 0; i < count; i++) {
      const tab = activeTabs[i];
      // Decay damage recoil smoothly
      const damp = Math.exp(-7.5 * safeDt);
      tab.recoilOffset.multiplyScalar(damp);
      tab.recoilRotZ *= damp;

      let baseX = 0;
      let baseY = 1.92;
      let baseZ = 0.18;

      if (count === 2) {
        // Classic 1v1 Kanji Duel flanking the Phantom Boss cleanly inside camera view
        const side = i === 0 ? -1 : 1;
        baseX = side * 1.18;
        baseY = 1.88 + Math.sin(this.totalTime * 2.4 + i * Math.PI) * 0.09;
        baseZ = 0.22 + Math.cos(this.totalTime * 1.8 + i) * 0.08;
      } else {
        // Multi-glyph semi-circular arc crown around the Boss (4-Blade or 5-Glyph Grand Master)
        const tNorm = count > 1 ? i / (count - 1) : 0.5;
        const arcAngle = (tNorm - 0.5) * Math.PI * 0.88;
        baseX = Math.sin(arcAngle) * 1.48;
        baseY = 1.65 + Math.cos(arcAngle) * 0.68 + Math.sin(this.totalTime * 2.5 + i) * 0.06;
        baseZ = 0.24 - Math.abs(tNorm - 0.5) * 0.25;
      }

      const crackTilt = this.damageRatio * (i % 2 === 0 ? -0.14 : 0.14);

      tab.group.position.set(
        baseX + tab.recoilOffset.x,
        baseY + tab.recoilOffset.y,
        baseZ + tab.recoilOffset.z
      );
      tab.group.rotation.set(
        0.06,
        -baseX * 0.14 + Math.sin(this.totalTime * 1.6 + i) * 0.06,
        crackTilt + tab.recoilRotZ
      );
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

  private buildPhantomFigure(): void {
    const obsidianMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x18181b,
        roughness: 0.48,
        metalness: 0.25,
      })
    );
    const haoriMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x991b1b,
        roughness: 0.42,
        metalness: 0.15,
        emissive: new THREE.Color(0x280505),
        emissiveIntensity: 0.45,
      })
    );
    this.haoriMat = haoriMat;

    const goldMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        roughness: 0.24,
        metalness: 0.78,
        emissive: new THREE.Color(0x3b2004),
        emissiveIntensity: 0.35,
      })
    );
    this.maskMat = goldMat;

    // 1. Hakama & Crimson Haori Torso (y = 0 .. 1.78)
    const hakamaGeo = this.trackGeo(new THREE.CylinderGeometry(0.34, 0.54, 1.05, 18));
    const hakama = new THREE.Mesh(hakamaGeo, obsidianMat);
    hakama.position.set(0, 0.55, 0);
    this.figurePivot.add(hakama);

    const torsoGeo = this.trackGeo(new THREE.CylinderGeometry(0.38, 0.46, 0.88, 18));
    const torso = new THREE.Mesh(torsoGeo, haoriMat);
    torso.position.set(0, 1.36, 0);
    torso.castShadow = true;
    this.figurePivot.add(torso);

    // Wide theatrical shoulder pauldrons (肩衣)
    const pauldronGeo = this.trackGeo(new THREE.BoxGeometry(1.08, 0.11, 0.42));
    const pauldron = new THREE.Mesh(pauldronGeo, haoriMat);
    pauldron.position.set(0, 1.74, -0.02);
    this.figurePivot.add(pauldron);

    const goldTrimGeo = this.trackGeo(new THREE.BoxGeometry(1.12, 0.035, 0.44));
    const goldTrim = new THREE.Mesh(goldTrimGeo, goldMat);
    goldTrim.position.set(0, 1.8, -0.02);
    this.figurePivot.add(goldTrim);

    // Inner crossed kimono lapels in gold
    for (const side of [-1, 1]) {
      const lapelGeo = this.trackGeo(new THREE.BoxGeometry(0.08, 0.56, 0.04));
      const lapel = new THREE.Mesh(lapelGeo, goldMat);
      lapel.position.set(side * 0.09, 1.5, 0.38);
      lapel.rotation.z = side * 0.28;
      this.figurePivot.add(lapel);
    }

    // 2. Radiant Golden Sun-Disc Halo (太陽と鉄 motif) behind shoulders
    this.sunHaloGroup.position.set(0, 1.98, -0.28);
    this.figurePivot.add(this.sunHaloGroup);

    const haloRingGeo = this.trackGeo(new THREE.TorusGeometry(0.66, 0.032, 10, 32));
    const haloRing = new THREE.Mesh(haloRingGeo, goldMat);
    this.sunHaloGroup.add(haloRing);

    const rayGeo = this.trackGeo(new THREE.ConeGeometry(0.045, 0.22, 6));
    for (let r = 0; r < 8; r++) {
      const a = (r * Math.PI) / 4;
      const ray = new THREE.Mesh(rayGeo, goldMat);
      ray.position.set(Math.cos(a) * 0.78, Math.sin(a) * 0.78, 0);
      ray.rotation.z = a - Math.PI / 2;
      this.sunHaloGroup.add(ray);
    }

    // 3. Arms & Sculpted Katana
    this.leftSleeveArm.position.set(-0.48, 1.66, 0.04);
    this.figurePivot.add(this.leftSleeveArm);

    this.rightSwordArm.position.set(0.48, 1.66, 0.04);
    this.figurePivot.add(this.rightSwordArm);

    const haoriSleeveGeo = this.trackGeo(new THREE.ConeGeometry(0.22, 0.56, 12));
    for (const arm of [this.leftSleeveArm, this.rightSleeveArmGetter()]) {
      const sleeve = new THREE.Mesh(haoriSleeveGeo, haoriMat);
      sleeve.position.set(0, -0.26, 0);
      arm.add(sleeve);
    }

    // Katana in right hand
    const hiltGeo = this.trackGeo(new THREE.CylinderGeometry(0.028, 0.028, 0.26, 10));
    const hilt = new THREE.Mesh(hiltGeo, obsidianMat);
    hilt.position.set(0, -0.5, 0.14);
    hilt.rotation.x = Math.PI / 3;
    this.rightSwordArm.add(hilt);

    const tsubaGeo = this.trackGeo(new THREE.CylinderGeometry(0.075, 0.075, 0.018, 14));
    const tsuba = new THREE.Mesh(tsubaGeo, goldMat);
    tsuba.position.set(0, -0.43, 0.25);
    tsuba.rotation.x = Math.PI / 3;
    this.rightSwordArm.add(tsuba);

    const bladeMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.14,
        metalness: 0.92,
        emissive: new THREE.Color(0x7f1d1d),
        emissiveIntensity: 0.25,
      })
    );
    const bladeGeo = this.trackGeo(new THREE.BoxGeometry(0.026, 0.92, 0.055));
    const blade = new THREE.Mesh(bladeGeo, bladeMat);
    blade.position.set(0, -0.18, 0.64);
    blade.rotation.x = Math.PI / 3;
    this.rightSwordArm.add(blade);

    // 4. Dark Hood & Golden Phantom Noh Mask (y = 2.08)
    this.maskGroup.position.set(0, 2.06, 0.05);
    this.figurePivot.add(this.maskGroup);

    const hoodGeo = this.trackGeo(new THREE.SphereGeometry(0.36, 20, 16));
    const hood = new THREE.Mesh(hoodGeo, obsidianMat);
    hood.scale.set(1.05, 1.12, 1.05);
    this.maskGroup.add(hood);

    const maskFaceGeo = this.trackGeo(new THREE.SphereGeometry(0.32, 20, 16));
    const maskFace = new THREE.Mesh(maskFaceGeo, goldMat);
    maskFace.scale.set(0.92, 1.08, 0.58);
    maskFace.position.set(0, -0.01, 0.22);
    this.maskGroup.add(maskFace);

    // Twin golden kabuto horns
    const hornGeo = this.trackGeo(new THREE.ConeGeometry(0.055, 0.34, 10));
    for (const side of [-1, 1]) {
      const horn = new THREE.Mesh(hornGeo, goldMat);
      horn.position.set(side * 0.24, 0.34, 0.14);
      horn.rotation.set(0.18, 0, -side * 0.42);
      this.maskGroup.add(horn);
    }

    // Glowing crimson mask eyes
    const eyeGlowMat = this.trackMat(
      new THREE.MeshBasicMaterial({ color: 0xff2a2a, toneMapped: false })
    );
    this.eyeGlowMat = eyeGlowMat;
    const eyeSlitGeo = this.trackGeo(new THREE.BoxGeometry(0.1, 0.032, 0.03));
    for (const side of [-1, 1]) {
      const eye = new THREE.Mesh(eyeSlitGeo, eyeGlowMat);
      eye.position.set(side * 0.105, 0.04, 0.39);
      eye.rotation.z = side * 0.22;
      this.maskGroup.add(eye);
    }
  }

  private rightSleeveArmGetter(): THREE.Group {
    return this.rightSwordArm;
  }

  private ensureTabletPool(targetSize: number): void {
    if (this.tablets.length >= targetSize) return;

    const stoneGeo = this.trackGeo(new THREE.BoxGeometry(0.56, 0.74, 0.12));
    const capGeo = this.trackGeo(new THREE.BoxGeometry(0.62, 0.06, 0.15));
    const faceGeo = this.trackGeo(new THREE.PlaneGeometry(0.5, 0.64));
    const goldCapMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.28,
        metalness: 0.7,
      })
    );

    while (this.tablets.length < targetSize) {
      const group = new THREE.Group();
      group.visible = false;

      const stoneMat = this.trackMat(
        new THREE.MeshStandardMaterial({
          color: 0x292524,
          roughness: 0.62,
          metalness: 0.12,
        })
      );
      const stoneMesh = new THREE.Mesh(stoneGeo, stoneMat);
      stoneMesh.castShadow = true;
      group.add(stoneMesh);

      const topCap = new THREE.Mesh(capGeo, goldCapMat);
      topCap.position.y = 0.39;
      group.add(topCap);

      const botCap = new THREE.Mesh(capGeo, goldCapMat);
      botCap.position.y = -0.39;
      group.add(botCap);

      const faceMat = this.trackMat(
        new THREE.MeshBasicMaterial({
          color: 0xfffdf7,
          toneMapped: false,
        })
      );
      const faceMesh = new THREE.Mesh(faceGeo, faceMat);
      faceMesh.position.z = 0.064;
      group.add(faceMesh);

      this.tabletsGroup.add(group);
      this.tablets.push({
        group,
        stoneMesh,
        faceMesh,
        faceMat,
        stoneMat,
        character: '',
        crackStage: 0,
        recoilOffset: new THREE.Vector3(),
        recoilRotZ: 0,
      });
    }
  }

  private syncTablets(characters: string[], damageRatio: number): void {
    this.ensureTabletPool(Math.max(6, characters.length));
    const crackStage =
      damageRatio >= 0.75 ? 3 : damageRatio >= 0.45 ? 2 : damageRatio >= 0.15 ? 1 : 0;
    const scale = characters.length <= 2 ? 1.0 : characters.length <= 4 ? 0.82 : 0.72;

    for (let i = 0; i < this.tablets.length; i++) {
      const tab = this.tablets[i];
      if (i >= characters.length) {
        tab.group.visible = false;
        continue;
      }

      const ch = characters[i];
      tab.group.visible = true;
      tab.group.scale.setScalar(scale);

      if (tab.character !== ch || tab.crackStage !== crackStage) {
        tab.character = ch;
        tab.crackStage = crackStage;
        const tex = this.getOrCreateTabletTexture(ch, crackStage);
        if (tex) {
          tab.faceMat.map = tex;
          tab.faceMat.needsUpdate = true;
        }
      }
    }
  }

  private getOrCreateTabletTexture(
    character: string,
    crackStage: number
  ): THREE.CanvasTexture | null {
    const key = `tablet_${character}_${crackStage}`;
    const cached = this.textureCache.get(key);
    if (cached) return cached;

    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Sacred warm ivory tablet parchment + bold vermilion shrine border
    ctx.fillStyle = '#FFFDF7';
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = '#991b1b';
    ctx.lineWidth = 24;
    ctx.strokeRect(16, 16, 480, 480);

    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 6;
    ctx.strokeRect(38, 38, 436, 436);

    // Bold ultra-readable #111111 Kanji glyph
    ctx.fillStyle = '#111111';
    ctx.font = "900 288px 'Noto Serif JP', 'Yu Mincho', serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(character, 256, 268);

    // Progressive jagged crimson/obsidian crack lines as the Boss takes HP damage!
    if (crackStage > 0) {
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 7 + crackStage * 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(42, 74);
      ctx.lineTo(132, 148);
      ctx.lineTo(108, 198);
      ctx.lineTo(188, 246);
      ctx.stroke();

      if (crackStage >= 2) {
        ctx.beginPath();
        ctx.moveTo(470, 118);
        ctx.lineTo(378, 192);
        ctx.lineTo(404, 248);
        ctx.lineTo(318, 314);
        ctx.stroke();
      }

      if (crackStage >= 3) {
        ctx.strokeStyle = '#7f1d1d';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(192, 488);
        ctx.lineTo(244, 382);
        ctx.lineTo(286, 344);
        ctx.lineTo(348, 468);
        ctx.stroke();
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = this.maxAnisotropy;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.needsUpdate = true;

    this.textureCache.set(key, tex);
    return tex;
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
    this.scene.remove(this.group);
  }
}

export default BossAvatar3D;
