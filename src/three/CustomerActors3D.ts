/**
 * Salon Mishima 3D - Expressive Stylized 3D Literary Cafe Patrons
 * File: src/three/CustomerActors3D.ts
 *
 * Builds individualized chibi/toy-like 3D characters for all 8 Yukio Mishima
 * literary patrons (Uiko, Kashiwagi, Mizoguchi, Shinji, Hatsue, Kiyoaki, Honda,
 * and Countess Asako Kageyama) with full procedural state animations and a 3D
 * head anchor for crisp HTML speech-bubble projection.
 */

import * as THREE from 'three';
import {
  type ActiveCustomer3D,
  type CustomerActorId,
  type CustomerAnimState,
  resolveCustomerActorId,
} from '../types/three3d';

interface PatronVisualTheme {
  actorId: CustomerActorId;
  skinColor: number;
  hairColor: number;
  primaryOutfitColor: number;
  secondaryOutfitColor: number;
  accentColor: number;
  blushColor: number;
  eyeColor: number;
}

const PATRON_THEMES: Record<CustomerActorId, PatronVisualTheme> = {
  // 有為子 (金閣寺 — 薄幸の少女): Navy sailor uniform, white collar, crimson scarf & white camellia
  uiko: {
    actorId: 'uiko',
    skinColor: 0xfde7d6,
    hairColor: 0x1e1b18,
    primaryOutfitColor: 0x1e293b,
    secondaryOutfitColor: 0xf8fafc,
    accentColor: 0xdc2626,
    blushColor: 0xfb7185,
    eyeColor: 0x1c1917,
  },
  // 柏木 (金閣寺 — 内翻足の学友): Dark Showa gakuran, brass buttons, round glasses & bamboo shakuhachi
  kashiwagi: {
    actorId: 'kashiwagi',
    skinColor: 0xf5dec9,
    hairColor: 0x18181b,
    primaryOutfitColor: 0x27272a,
    secondaryOutfitColor: 0x3f3f46,
    accentColor: 0xd97706,
    blushColor: 0xfda4af,
    eyeColor: 0x18181b,
  },
  // 溝口 (金閣寺 — 徒弟僧): Slate-indigo monk koromo, crisp white juban collar, kesa sash & juzu beads
  mizoguchi: {
    actorId: 'mizoguchi',
    skinColor: 0xf3d8c2,
    hairColor: 0x44403c,
    primaryOutfitColor: 0x334155,
    secondaryOutfitColor: 0xf8fafc,
    accentColor: 0x92400e,
    blushColor: 0xfca5a5,
    eyeColor: 0x1c1917,
  },
  // 新治 (潮騒 — 青年漁師): Sun-bronzed skin, ocean-indigo happi coat, twisted white hachimaki headband
  shinji: {
    actorId: 'shinji',
    skinColor: 0xeab896,
    hairColor: 0x1c1917,
    primaryOutfitColor: 0x0369a1,
    secondaryOutfitColor: 0xfffbeb,
    accentColor: 0x38bdf8,
    blushColor: 0xf87171,
    eyeColor: 0x0f172a,
  },
  // 初江 (潮騒 — 富豪の娘): Summer coral-crimson yukata, golden obi sash, braided hair & Utajima pearl pin
  hatsue: {
    actorId: 'hatsue',
    skinColor: 0xfbe2ce,
    hairColor: 0x231a16,
    primaryOutfitColor: 0xe11d48,
    secondaryOutfitColor: 0xfbbf24,
    accentColor: 0xfff1f2,
    blushColor: 0xfb7185,
    eyeColor: 0x1c1917,
  },
  // 松枝清顕 (春の雪 — 美貌の貴公子): Taisho Peers' School indigo uniform, draped wool cape & visored cap
  kiyoaki: {
    actorId: 'kiyoaki',
    skinColor: 0xfef0e6,
    hairColor: 0x1e1b24,
    primaryOutfitColor: 0x1e1b4b,
    secondaryOutfitColor: 0x312e81,
    accentColor: 0xfbbf24,
    blushColor: 0xfda4af,
    eyeColor: 0x1e1b4b,
  },
  // 本多繁邦 (豊饒の海 — 観察者・法曹): Espresso-charcoal jurist three-piece suit, burgundy tie & silver glasses
  honda: {
    actorId: 'honda',
    skinColor: 0xf5dcc8,
    hairColor: 0x3f3f46,
    primaryOutfitColor: 0x44403c,
    secondaryOutfitColor: 0xfafaf9,
    accentColor: 0x9f1239,
    blushColor: 0xfca5a5,
    eyeColor: 0x1c1917,
  },
  // 影山朝子 (鹿鳴館 — 伯爵夫人): Royal burgundy Rokumeikan gown, lace collar, plumed bonnet & golden folding fan
  kageyama: {
    actorId: 'kageyama',
    skinColor: 0xfeece0,
    hairColor: 0x261715,
    primaryOutfitColor: 0x881337,
    secondaryOutfitColor: 0xfef3c7,
    accentColor: 0xf59e0b,
    blushColor: 0xfb7185,
    eyeColor: 0x1c1917,
  },
  asako: {
    actorId: 'kageyama',
    skinColor: 0xfeece0,
    hairColor: 0x261715,
    primaryOutfitColor: 0x881337,
    secondaryOutfitColor: 0xfef3c7,
    accentColor: 0xf59e0b,
    blushColor: 0xfb7185,
    eyeColor: 0x1c1917,
  },
};

const CUSTOMER_Z = -0.68;
const ENTER_START_X = -5.4;
const LEAVE_END_X = 5.4;
const BASE_SCALE = 1.12;

export class CustomerActors3D {
  public readonly group: THREE.Group;
  private readonly scene: THREE.Scene;

  private bodyPivot: THREE.Group;
  private torsoGroup: THREE.Group;
  private headPivot: THREE.Group;
  private leftArmPivot: THREE.Group;
  private rightArmPivot: THREE.Group;
  private leftEyeGroup: THREE.Group;
  private rightEyeGroup: THREE.Group;
  private leftBrowMesh: THREE.Mesh | null = null;
  private rightBrowMesh: THREE.Mesh | null = null;
  private mouthMesh: THREE.Mesh | null = null;
  private leftBlushMesh: THREE.Mesh | null = null;
  private rightBlushMesh: THREE.Mesh | null = null;
  private headSkinMat: THREE.MeshStandardMaterial | null = null;
  private angerEmblemGroup: THREE.Group;
  private happyHaloGroup: THREE.Group;
  private headAnchor: THREE.Object3D;

  private currentActorId: CustomerActorId | null = null;
  private animState: CustomerAnimState = 'idle';
  private stateTime = 0;
  private totalTime = 0;
  private currentX = 0;
  private targetX = 0;
  private blinkTimer = 1.8;
  private blinkAmount = 0;

  private ownedGeometries: THREE.BufferGeometry[] = [];
  private ownedMaterials: THREE.Material[] = [];

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.name = 'CustomerActors3D';
    this.group.position.set(0, 0, CUSTOMER_Z);
    this.group.scale.setScalar(BASE_SCALE);

    this.bodyPivot = new THREE.Group();
    this.torsoGroup = new THREE.Group();
    this.headPivot = new THREE.Group();
    this.leftArmPivot = new THREE.Group();
    this.rightArmPivot = new THREE.Group();
    this.leftEyeGroup = new THREE.Group();
    this.rightEyeGroup = new THREE.Group();
    this.angerEmblemGroup = new THREE.Group();
    this.happyHaloGroup = new THREE.Group();
    this.headAnchor = new THREE.Object3D();
    this.headAnchor.position.set(0, 0.78, 0);

    this.group.add(this.bodyPivot);
    this.scene.add(this.group);

    // Build initial default patron so getHeadAnchorWorldPosition() works immediately
    this.buildCharacterRig('mizoguchi');
  }

  public setVisible(visible: boolean): void {
    this.group.visible = visible;
  }

  public setCustomer(customer: ActiveCustomer3D | string | null | undefined): void {
    if (!customer) {
      this.group.visible = false;
      return;
    }
    this.group.visible = true;
    const nextId = resolveCustomerActorId(customer);
    const canonicalId: CustomerActorId = nextId === 'asako' ? 'kageyama' : nextId;

    if (this.currentActorId !== canonicalId) {
      this.buildCharacterRig(canonicalId);
      this.currentActorId = canonicalId;
      // Start slightly off-left when a fresh patron arrives in entering state
      if (this.animState === 'entering') {
        this.currentX = ENTER_START_X;
        this.group.position.x = this.currentX;
      }
    }
  }

  /** Alias for test / external convenience */
  public spawnCustomer(customer: ActiveCustomer3D | string | null | undefined): void {
    this.setCustomer(customer);
    this.setAnimState('entering');
  }

  public setAnimState(state: CustomerAnimState): void {
    if (this.animState === state) return;
    const prevState = this.animState;
    this.animState = state;
    this.stateTime = 0;

    if (state === 'entering') {
      if (prevState === 'leaving' || Math.abs(this.currentX) < 0.25) {
        this.currentX = ENTER_START_X;
        this.group.position.x = this.currentX;
      }
      this.targetX = 0;
    } else if (state === 'leaving') {
      this.targetX = LEAVE_END_X;
    } else {
      this.targetX = 0;
    }
  }

  /** Alias for test / external convenience */
  public setAnimation(state: CustomerAnimState): void {
    this.setAnimState(state);
  }

  public getHeadAnchorWorldPosition(target = new THREE.Vector3()): THREE.Vector3 {
    this.group.updateWorldMatrix(true, true);
    this.headAnchor.getWorldPosition(target);
    return target;
  }

  public update(dt: number, patienceRatio = 1.0, elapsed?: number): void {
    const safeDt = Math.min(Math.max(dt, 0), 0.1);
    this.stateTime += safeDt;
    this.totalTime = elapsed !== undefined ? elapsed : this.totalTime + safeDt;

    // Horizontal walk damping
    const walkSpeed = this.animState === 'entering' || this.animState === 'leaving' ? 6.2 : 8.5;
    const prevX = this.currentX;
    this.currentX += (this.targetX - this.currentX) * (1 - Math.exp(-walkSpeed * safeDt));
    this.group.position.x = this.currentX;
    this.group.position.z = CUSTOMER_Z;

    const velocityX = safeDt > 0.0001 ? (this.currentX - prevX) / safeDt : 0;
    const walkActivity = Math.min(1, Math.abs(velocityX) / 2.2);

    // Natural eye blink cycle
    this.blinkTimer -= safeDt;
    if (this.blinkTimer <= 0) {
      this.blinkTimer = 2.6 + ((Math.sin(this.totalTime * 7.3) + 1) * 0.9);
      this.blinkAmount = 1.0;
    }
    if (this.blinkAmount > 0) {
      this.blinkAmount = Math.max(0, this.blinkAmount - safeDt * 9.5);
    }

    // Reset baseline transforms
    let bodyY = 0;
    let bodyPitch = 0;
    let bodyRoll = 0;
    let bodyYaw = 0;
    let bodyScaleXZ = 1;
    let bodyScaleY = 1;
    let headPitch = 0;
    let headYaw = 0;
    let headRoll = 0;
    let leftArmRotX = 0.12;
    let leftArmRotZ = 0.16;
    let rightArmRotX = 0.12;
    let rightArmRotZ = -0.16;
    let browAngle = 0.04;
    let browLift = 0;
    let eyeScaleY = 1 - Math.sin(this.blinkAmount * Math.PI) * 0.88;
    let mouthScaleX = 1;
    let mouthScaleY = 1;
    let blushOpacity = 0.48;
    let skinAngryTint = 0;

    const isImpatient =
      this.animState === 'impatient' ||
      (this.animState === 'idle' && patienceRatio < 0.35);

    if (this.animState === 'entering') {
      const stride = Math.sin(this.totalTime * 14.5);
      bodyY = Math.abs(stride) * 0.12 * Math.max(0.35, walkActivity);
      bodyYaw = Math.min(0.65, Math.max(0, (0 - this.currentX) * 0.16));
      bodyRoll = stride * 0.05 * walkActivity;
      leftArmRotX = stride * 0.45 * walkActivity;
      rightArmRotX = -stride * 0.45 * walkActivity;
      // Friendly greeting wave as they arrive at the counter
      if (Math.abs(this.currentX) < 0.9) {
        rightArmRotX = -0.95;
        rightArmRotZ = -0.45 + Math.sin(this.totalTime * 12) * 0.28;
        headRoll = 0.06;
      }
      browLift = 0.015;
    } else if (this.animState === 'leaving') {
      const stride = Math.sin(this.totalTime * 14.0);
      bodyY = Math.abs(stride) * 0.1;
      bodyYaw = 0.78;
      leftArmRotX = stride * 0.42;
      rightArmRotX = -0.85;
      rightArmRotZ = -0.4 + Math.sin(this.totalTime * 10) * 0.22;
    } else if (this.animState === 'happy') {
      // Joyful jump + polite appreciative bow as teacup/wagashi slides over
      const jumpDecay = Math.exp(-this.stateTime * 1.6);
      const bounce = Math.abs(Math.sin(this.stateTime * 9.5)) * 0.25 * jumpDecay;
      bodyY = bounce;
      bodyScaleY = 1 + Math.sin(this.stateTime * 19) * 0.04 * jumpDecay;
      bodyScaleXZ = 1 - Math.sin(this.stateTime * 19) * 0.025 * jumpDecay;
      // Polite bow settles in after initial hop
      const bowFactor = Math.min(1, Math.max(0, (this.stateTime - 0.22) * 2.5)) * Math.exp(-this.stateTime * 0.9);
      bodyPitch = 0.24 * bowFactor;
      headPitch = 0.16 * bowFactor;
      // Cheerful clapping / raised hands
      leftArmRotX = -0.95 + Math.sin(this.stateTime * 16) * 0.22;
      rightArmRotX = -0.95 - Math.sin(this.stateTime * 16) * 0.22;
      leftArmRotZ = -0.15;
      rightArmRotZ = 0.15;
      browAngle = -0.14;
      browLift = 0.028;
      eyeScaleY = 0.28; // Happy curved squint
      mouthScaleX = 1.35;
      mouthScaleY = 1.4;
      blushOpacity = 0.85;
    } else if (this.animState === 'angry') {
      // Comical katakana-cafe style angry puff + shake ("틀리면 손님이 화내 ㅋㅋ")
      const decay = Math.max(0.25, Math.exp(-this.stateTime * 0.85));
      const shake = Math.sin(this.stateTime * 34);
      const stomp = Math.abs(Math.sin(this.stateTime * 18));
      bodyY = stomp * 0.08 * decay;
      bodyScaleXZ = 1 + 0.12 * decay;
      bodyScaleY = 1 + 0.07 * decay;
      bodyYaw = shake * 0.15 * decay;
      bodyRoll = Math.cos(this.stateTime * 26) * 0.06 * decay;
      headYaw = shake * 0.18 * decay;
      headPitch = 0.08;
      // Dramatic arm slap / huff gesture
      leftArmRotX = -0.65 + stomp * 0.45;
      rightArmRotX = -0.65 + (1 - stomp) * 0.45;
      leftArmRotZ = 0.52;
      rightArmRotZ = -0.52;
      browAngle = 0.42; // Fierce \ / brows
      browLift = -0.022;
      eyeScaleY = 0.82;
      mouthScaleX = 1.25;
      mouthScaleY = 1.65;
      blushOpacity = 0.92;
      skinAngryTint = 0.55 * decay;
    } else if (isImpatient) {
      const urgency = Math.min(1, Math.max(0.25, (0.38 - Math.min(0.38, patienceRatio)) / 0.35));
      bodyPitch = 0.13 * urgency + 0.04;
      bodyY = Math.abs(Math.sin(this.totalTime * 17)) * 0.035 * urgency;
      const tremor = Math.sin(this.totalTime * 38) * 0.022 * urgency;
      bodyRoll = tremor;
      headYaw = Math.sin(this.totalTime * 8.5) * 0.08;
      // Rapid impatient counter-tap with right hand
      rightArmRotX = -0.58 + Math.sin(this.totalTime * 20) * 0.2 * urgency;
      leftArmRotZ = 0.25;
      browAngle = 0.28;
      browLift = -0.015;
      blushOpacity = 0.65;
      skinAngryTint = 0.2 * urgency;
    } else {
      // Lively cozy 'idle' breathing & sway
      const breath = Math.sin(this.totalTime * 2.5);
      bodyScaleY = 1 + breath * 0.018;
      bodyScaleXZ = 1 - breath * 0.009;
      bodyRoll = Math.sin(this.totalTime * 1.3) * 0.022;
      headRoll = Math.sin(this.totalTime * 1.7 + 0.6) * 0.04;
      headYaw = Math.sin(this.totalTime * 1.1) * 0.06;
      headPitch = Math.sin(this.totalTime * 2.2) * 0.025;
      rightArmRotX = 0.1 + Math.sin(this.totalTime * 2.1) * 0.06;
      leftArmRotX = 0.1 - Math.sin(this.totalTime * 2.1) * 0.05;
    }

    // Apply rig transforms
    this.bodyPivot.position.y = bodyY;
    this.bodyPivot.rotation.set(bodyPitch, bodyYaw, bodyRoll);
    this.bodyPivot.scale.set(bodyScaleXZ, bodyScaleY, bodyScaleXZ);

    this.headPivot.rotation.set(headPitch, headYaw, headRoll);
    this.leftArmPivot.rotation.set(leftArmRotX, 0, leftArmRotZ);
    this.rightArmPivot.rotation.set(rightArmRotX, 0, rightArmRotZ);

    this.leftEyeGroup.scale.y = Math.max(0.12, eyeScaleY);
    this.rightEyeGroup.scale.y = Math.max(0.12, eyeScaleY);

    if (this.leftBrowMesh && this.rightBrowMesh) {
      this.leftBrowMesh.rotation.z = -browAngle;
      this.rightBrowMesh.rotation.z = browAngle;
      this.leftBrowMesh.position.y = 0.13 + browLift;
      this.rightBrowMesh.position.y = 0.13 + browLift;
    }

    if (this.mouthMesh) {
      this.mouthMesh.scale.set(mouthScaleX, mouthScaleY, 1);
    }

    if (this.leftBlushMesh && this.rightBlushMesh) {
      (this.leftBlushMesh.material as THREE.MeshBasicMaterial).opacity = blushOpacity;
      (this.rightBlushMesh.material as THREE.MeshBasicMaterial).opacity = blushOpacity;
    }

    if (this.headSkinMat) {
      this.headSkinMat.emissive.setRGB(
        0.16 + skinAngryTint * 0.45,
        0.08 * (1 - skinAngryTint * 0.5),
        0.05 * (1 - skinAngryTint * 0.5)
      );
    }

    // Toggle comical anger emblem (💢) and happy halo sparkles
    this.angerEmblemGroup.visible = this.animState === 'angry' || (isImpatient && patienceRatio < 0.2);
    if (this.angerEmblemGroup.visible) {
      const pulse = 1 + Math.sin(this.totalTime * 22) * 0.22;
      this.angerEmblemGroup.scale.setScalar(pulse);
      this.angerEmblemGroup.rotation.z = Math.sin(this.totalTime * 14) * 0.12;
    }

    this.happyHaloGroup.visible = this.animState === 'happy';
    if (this.happyHaloGroup.visible) {
      this.happyHaloGroup.rotation.y = this.totalTime * 2.8;
      const haloScale = 0.9 + Math.sin(this.totalTime * 10) * 0.15;
      this.happyHaloGroup.scale.setScalar(haloScale);
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

  private clearRigResources(): void {
    this.bodyPivot.clear();
    for (const g of this.ownedGeometries) {
      g.dispose();
    }
    for (const m of this.ownedMaterials) {
      m.dispose();
    }
    this.ownedGeometries = [];
    this.ownedMaterials = [];
    this.leftBrowMesh = null;
    this.rightBrowMesh = null;
    this.mouthMesh = null;
    this.leftBlushMesh = null;
    this.rightBlushMesh = null;
    this.headSkinMat = null;
  }

  private buildCharacterRig(actorId: CustomerActorId): void {
    this.clearRigResources();
    const theme = PATRON_THEMES[actorId] || PATRON_THEMES.mizoguchi;

    const skinMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: theme.skinColor,
        roughness: 0.62,
        metalness: 0.02,
        emissive: new THREE.Color(0x28140c),
        emissiveIntensity: 0.25,
      })
    );
    this.headSkinMat = skinMat;

    const primaryMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: theme.primaryOutfitColor,
        roughness: 0.58,
        metalness: 0.06,
      })
    );
    const secondaryMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: theme.secondaryOutfitColor,
        roughness: 0.5,
        metalness: 0.05,
      })
    );
    const accentMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: theme.accentColor,
        roughness: 0.38,
        metalness: 0.22,
      })
    );
    const hairMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: theme.hairColor,
        roughness: 0.68,
        metalness: 0.04,
      })
    );
    const darkShoeMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x1c1917,
        roughness: 0.5,
      })
    );

    // 1. Legs & Shoes (y = 0 .. 0.72)
    const legGeo = this.trackGeo(new THREE.CylinderGeometry(0.1, 0.085, 0.68, 12));
    const shoeGeo = this.trackGeo(new THREE.SphereGeometry(0.11, 12, 10));
    for (const side of [-1, 1]) {
      const leg = new THREE.Mesh(legGeo, primaryMat);
      leg.position.set(side * 0.14, 0.38, 0);
      leg.castShadow = true;
      this.bodyPivot.add(leg);

      const shoe = new THREE.Mesh(shoeGeo, darkShoeMat);
      shoe.scale.set(0.95, 0.65, 1.35);
      shoe.position.set(side * 0.14, 0.07, 0.04);
      this.bodyPivot.add(shoe);
    }

    // 2. Torso & Outfit Silhouette (y = 0.72 .. 1.50)
    this.torsoGroup = new THREE.Group();
    this.torsoGroup.position.set(0, 1.08, 0);
    this.bodyPivot.add(this.torsoGroup);

    const isGownOrKimono =
      actorId === 'hatsue' || actorId === 'kageyama' || actorId === 'mizoguchi';
    const torsoTopR = 0.26;
    const torsoBotR = isGownOrKimono ? 0.36 : 0.3;
    const torsoGeo = this.trackGeo(new THREE.CylinderGeometry(torsoTopR, torsoBotR, 0.78, 18));
    const torsoMesh = new THREE.Mesh(torsoGeo, primaryMat);
    torsoMesh.castShadow = true;
    torsoMesh.receiveShadow = true;
    this.torsoGroup.add(torsoMesh);

    // Rounded shoulders cap
    const shoulderGeo = this.trackGeo(new THREE.SphereGeometry(0.265, 16, 12));
    const shoulderMesh = new THREE.Mesh(shoulderGeo, primaryMat);
    shoulderMesh.scale.set(1.18, 0.52, 0.92);
    shoulderMesh.position.set(0, 0.34, 0);
    this.torsoGroup.add(shoulderMesh);

    // Crisp collar / inner lapel
    const collarGeo = this.trackGeo(new THREE.TorusGeometry(0.18, 0.048, 10, 20));
    const collarMesh = new THREE.Mesh(collarGeo, secondaryMat);
    collarMesh.rotation.x = Math.PI / 2 + 0.18;
    collarMesh.position.set(0, 0.38, 0.04);
    this.torsoGroup.add(collarMesh);

    // Front V-placket / necktie / obi detail
    if (actorId === 'hatsue') {
      // Wide golden-ochre kimono obi + back bow
      const obiGeo = this.trackGeo(new THREE.CylinderGeometry(0.325, 0.34, 0.22, 18));
      const obi = new THREE.Mesh(obiGeo, secondaryMat);
      obi.position.set(0, -0.02, 0);
      this.torsoGroup.add(obi);
    } else if (actorId === 'uiko') {
      // Sailor scarf tie in bright crimson
      const scarfGeo = this.trackGeo(new THREE.ConeGeometry(0.085, 0.26, 8));
      const scarf = new THREE.Mesh(scarfGeo, accentMat);
      scarf.rotation.x = Math.PI;
      scarf.position.set(0, 0.2, 0.26);
      this.torsoGroup.add(scarf);
    } else if (actorId === 'mizoguchi') {
      // Monk diagonal kesa sash
      const sashGeo = this.trackGeo(new THREE.TorusGeometry(0.29, 0.045, 8, 20));
      const sash = new THREE.Mesh(sashGeo, accentMat);
      sash.rotation.set(0.7, 0.25, 0.55);
      sash.position.set(0.02, 0.08, 0.02);
      this.torsoGroup.add(sash);
    } else if (actorId === 'kiyoaki') {
      // Aristocratic Peers' School flared shoulder cape + gold buttons
      const capeGeo = this.trackGeo(new THREE.CylinderGeometry(0.28, 0.46, 0.56, 18, 1, true));
      const capeMat = this.trackMat(
        new THREE.MeshStandardMaterial({
          color: theme.secondaryOutfitColor,
          roughness: 0.55,
          side: THREE.DoubleSide,
        })
      );
      const cape = new THREE.Mesh(capeGeo, capeMat);
      cape.position.set(0, 0.12, -0.02);
      this.torsoGroup.add(cape);

      const claspGeo = this.trackGeo(new THREE.SphereGeometry(0.042, 10, 10));
      for (const side of [-1, 1]) {
        const clasp = new THREE.Mesh(claspGeo, accentMat);
        clasp.position.set(side * 0.13, 0.32, 0.25);
        this.torsoGroup.add(clasp);
      }
    } else if (actorId === 'kashiwagi') {
      // Gakuran vertical row of brass buttons + tucked bamboo shakuhachi flute
      const btnGeo = this.trackGeo(new THREE.SphereGeometry(0.032, 8, 8));
      for (let i = 0; i < 3; i++) {
        const btn = new THREE.Mesh(btnGeo, accentMat);
        btn.position.set(0, 0.26 - i * 0.14, 0.28);
        this.torsoGroup.add(btn);
      }
      const fluteGeo = this.trackGeo(new THREE.CylinderGeometry(0.026, 0.026, 0.44, 10));
      const flute = new THREE.Mesh(fluteGeo, accentMat);
      flute.rotation.z = 0.42;
      flute.position.set(0.24, 0.04, 0.22);
      this.torsoGroup.add(flute);
    } else if (actorId === 'honda') {
      // Crisp shirt triangle + burgundy jurist necktie
      const shirtGeo = this.trackGeo(new THREE.ConeGeometry(0.12, 0.28, 4));
      const shirt = new THREE.Mesh(shirtGeo, secondaryMat);
      shirt.rotation.x = Math.PI;
      shirt.position.set(0, 0.22, 0.23);
      this.torsoGroup.add(shirt);

      const tieGeo = this.trackGeo(new THREE.BoxGeometry(0.06, 0.3, 0.03));
      const tie = new THREE.Mesh(tieGeo, accentMat);
      tie.position.set(0, 0.16, 0.28);
      this.torsoGroup.add(tie);
    } else if (actorId === 'shinji') {
      // Open white cotton fisherman undershirt beneath ocean happi
      const innerGeo = this.trackGeo(new THREE.BoxGeometry(0.18, 0.46, 0.06));
      const inner = new THREE.Mesh(innerGeo, secondaryMat);
      inner.position.set(0, 0.12, 0.25);
      this.torsoGroup.add(inner);
    } else if (actorId === 'kageyama') {
      // Rokumeikan pearl necklace & ruffled champagne lace collar
      const pearlGeo = this.trackGeo(new THREE.SphereGeometry(0.028, 8, 8));
      const pearlMat = this.trackMat(
        new THREE.MeshStandardMaterial({ color: 0xfffbeb, roughness: 0.2, metalness: 0.15 })
      );
      for (let i = -3; i <= 3; i++) {
        const angle = i * 0.24;
        const pearl = new THREE.Mesh(pearlGeo, pearlMat);
        pearl.position.set(Math.sin(angle) * 0.2, 0.31 - Math.cos(angle) * 0.04, Math.cos(angle) * 0.24);
        this.torsoGroup.add(pearl);
      }
    }

    // 3. Expressive Articulated Arms & Handheld Signature Props
    this.leftArmPivot = new THREE.Group();
    this.leftArmPivot.position.set(-0.33, 1.38, 0.02);
    this.bodyPivot.add(this.leftArmPivot);

    this.rightArmPivot = new THREE.Group();
    this.rightArmPivot.position.set(0.33, 1.38, 0.02);
    this.bodyPivot.add(this.rightArmPivot);

    const sleeveGeo = this.trackGeo(new THREE.CylinderGeometry(0.085, 0.105, 0.36, 12));
    const handGeo = this.trackGeo(new THREE.SphereGeometry(0.082, 12, 10));

    for (const [idx, armPivot] of [this.leftArmPivot, this.rightArmPivot].entries()) {
      const sleeve = new THREE.Mesh(sleeveGeo, primaryMat);
      sleeve.position.set(0, -0.17, 0);
      sleeve.castShadow = true;
      armPivot.add(sleeve);

      const hand = new THREE.Mesh(handGeo, skinMat);
      hand.position.set(0, -0.37, 0.02);
      armPivot.add(hand);

      // Mizoguchi's juzu prayer beads on right wrist
      if (idx === 1 && actorId === 'mizoguchi') {
        const juzuGeo = this.trackGeo(new THREE.TorusGeometry(0.088, 0.022, 8, 16));
        const juzu = new THREE.Mesh(juzuGeo, accentMat);
        juzu.rotation.x = Math.PI / 2;
        juzu.position.set(0, -0.32, 0.01);
        armPivot.add(juzu);
      }

      // Countess Asako's golden Rokumeikan folding fan (扇子) in right hand
      if (idx === 1 && actorId === 'kageyama') {
        const fanGeo = this.trackGeo(new THREE.CircleGeometry(0.22, 12, 0.15 * Math.PI, 0.7 * Math.PI));
        const fanMat = this.trackMat(
          new THREE.MeshStandardMaterial({
            color: 0xfbbf24,
            roughness: 0.32,
            metalness: 0.35,
            side: THREE.DoubleSide,
          })
        );
        const fan = new THREE.Mesh(fanGeo, fanMat);
        fan.position.set(0.06, -0.4, 0.12);
        fan.rotation.set(-0.3, 0.2, -0.35);
        armPivot.add(fan);
      }
    }

    // 4. Head, Expressive Eyes, Brows, Blush & Character Hair/Hats (y = 1.56+)
    this.headPivot = new THREE.Group();
    this.headPivot.position.set(0, 1.56, 0.02);
    this.bodyPivot.add(this.headPivot);

    this.headAnchor = new THREE.Object3D();
    this.headAnchor.position.set(0, 0.84, 0);
    this.headPivot.add(this.headAnchor);

    const headGeo = this.trackGeo(new THREE.SphereGeometry(0.35, 24, 20));
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headMesh.scale.set(1.05, 0.98, 0.96);
    headMesh.position.set(0, 0.26, 0);
    headMesh.castShadow = true;
    this.headPivot.add(headMesh);

    // Cute side ears
    const earGeo = this.trackGeo(new THREE.SphereGeometry(0.075, 10, 10));
    for (const side of [-1, 1]) {
      const ear = new THREE.Mesh(earGeo, skinMat);
      ear.scale.set(0.55, 0.85, 0.7);
      ear.position.set(side * 0.35, 0.25, -0.02);
      this.headPivot.add(ear);
    }

    // Eyes with glossy catchlights
    const eyeWhiteMat = this.trackMat(new THREE.MeshBasicMaterial({ color: 0xffffff }));
    const pupilMat = this.trackMat(new THREE.MeshBasicMaterial({ color: theme.eyeColor }));
    const catchlightMat = this.trackMat(new THREE.MeshBasicMaterial({ color: 0xffffff }));

    const eyeWhiteGeo = this.trackGeo(new THREE.SphereGeometry(0.056, 12, 10));
    const pupilGeo = this.trackGeo(new THREE.SphereGeometry(0.042, 12, 10));
    const catchGeo = this.trackGeo(new THREE.SphereGeometry(0.016, 8, 8));

    this.leftEyeGroup = new THREE.Group();
    this.leftEyeGroup.position.set(-0.125, 0.27, 0.31);
    this.headPivot.add(this.leftEyeGroup);

    this.rightEyeGroup = new THREE.Group();
    this.rightEyeGroup.position.set(0.125, 0.27, 0.31);
    this.headPivot.add(this.rightEyeGroup);

    for (const eyeGrp of [this.leftEyeGroup, this.rightEyeGroup]) {
      const white = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat);
      white.scale.set(1.0, 1.15, 0.45);
      eyeGrp.add(white);

      const pupil = new THREE.Mesh(pupilGeo, pupilMat);
      pupil.scale.set(0.95, 1.12, 0.5);
      pupil.position.set(0, 0, 0.018);
      eyeGrp.add(pupil);

      const catchlight = new THREE.Mesh(catchGeo, catchlightMat);
      catchlight.position.set(0.016, 0.02, 0.042);
      eyeGrp.add(catchlight);
    }

    // Expressive eyebrows
    const browGeo = this.trackGeo(new THREE.BoxGeometry(0.11, 0.026, 0.03));
    this.leftBrowMesh = new THREE.Mesh(browGeo, hairMat);
    this.leftBrowMesh.position.set(-0.125, 0.13, 0.33);
    this.rightBrowMesh = new THREE.Mesh(browGeo, hairMat);
    this.rightBrowMesh.position.set(0.125, 0.13, 0.33);
    // Attach brows to a browCarrier at y=0.25 so local y=0.13 => head y=0.38
    const browCarrier = new THREE.Group();
    browCarrier.position.set(0, 0.25, 0);
    browCarrier.add(this.leftBrowMesh);
    browCarrier.add(this.rightBrowMesh);
    this.headPivot.add(browCarrier);

    // Rosy cheeks
    const blushGeo = this.trackGeo(new THREE.CircleGeometry(0.055, 12));
    const leftBlushMat = this.trackMat(
      new THREE.MeshBasicMaterial({
        color: theme.blushColor,
        transparent: true,
        opacity: 0.48,
        depthWrite: false,
      })
    );
    const rightBlushMat = this.trackMat(
      new THREE.MeshBasicMaterial({
        color: theme.blushColor,
        transparent: true,
        opacity: 0.48,
        depthWrite: false,
      })
    );
    this.leftBlushMesh = new THREE.Mesh(blushGeo, leftBlushMat);
    this.leftBlushMesh.scale.set(1.25, 0.78, 1);
    this.leftBlushMesh.position.set(-0.2, 0.21, 0.315);
    this.leftBlushMesh.rotation.y = -0.35;
    this.headPivot.add(this.leftBlushMesh);

    this.rightBlushMesh = new THREE.Mesh(blushGeo, rightBlushMat);
    this.rightBlushMesh.scale.set(1.25, 0.78, 1);
    this.rightBlushMesh.position.set(0.2, 0.21, 0.315);
    this.rightBlushMesh.rotation.y = 0.35;
    this.headPivot.add(this.rightBlushMesh);

    // Mouth
    const mouthGeo = this.trackGeo(new THREE.TorusGeometry(0.036, 0.012, 8, 14, Math.PI));
    const mouthMat = this.trackMat(new THREE.MeshBasicMaterial({ color: 0x9f1239 }));
    this.mouthMesh = new THREE.Mesh(mouthGeo, mouthMat);
    this.mouthMesh.rotation.z = Math.PI;
    this.mouthMesh.position.set(0, 0.175, 0.33);
    this.headPivot.add(this.mouthMesh);

    // 5. Patron-Specific Hair & Signature Headwear
    this.buildHairAndHeadwear(actorId, hairMat, secondaryMat, accentMat);

    // 6. Comical Anger Vein Emblem (💢) & Happy Sparkle Halo
    this.angerEmblemGroup = new THREE.Group();
    this.angerEmblemGroup.position.set(0.34, 0.52, 0.24);
    this.angerEmblemGroup.visible = false;
    const veinMat = this.trackMat(new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    const veinBarGeo = this.trackGeo(new THREE.BoxGeometry(0.09, 0.026, 0.026));
    for (let i = 0; i < 4; i++) {
      const bar = new THREE.Mesh(veinBarGeo, veinMat);
      const angle = (i * Math.PI) / 2 + Math.PI / 4;
      bar.position.set(Math.cos(angle) * 0.055, Math.sin(angle) * 0.055, 0);
      bar.rotation.z = angle;
      this.angerEmblemGroup.add(bar);
    }
    this.headPivot.add(this.angerEmblemGroup);

    this.happyHaloGroup = new THREE.Group();
    this.happyHaloGroup.position.set(0, 0.72, 0);
    this.happyHaloGroup.visible = false;
    const starMat = this.trackMat(new THREE.MeshBasicMaterial({ color: 0xfbbf24 }));
    const starGeo = this.trackGeo(new THREE.OctahedronGeometry(0.05, 0));
    for (let i = 0; i < 4; i++) {
      const star = new THREE.Mesh(starGeo, starMat);
      const a = (i * Math.PI) / 2;
      star.position.set(Math.cos(a) * 0.34, Math.sin(a * 2) * 0.04, Math.sin(a) * 0.34);
      this.happyHaloGroup.add(star);
    }
    this.headPivot.add(this.happyHaloGroup);
  }

  private buildHairAndHeadwear(
    actorId: CustomerActorId,
    hairMat: THREE.MeshStandardMaterial,
    secondaryMat: THREE.MeshStandardMaterial,
    accentMat: THREE.MeshStandardMaterial
  ): void {
    if (actorId === 'mizoguchi') {
      // Shaved monk stubble dome (closely cropped)
      const monkCapGeo = this.trackGeo(
        new THREE.SphereGeometry(0.358, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.56)
      );
      const monkCapMat = this.trackMat(
        new THREE.MeshStandardMaterial({
          color: 0x57534e,
          roughness: 0.85,
          transparent: true,
          opacity: 0.55,
        })
      );
      const monkCap = new THREE.Mesh(monkCapGeo, monkCapMat);
      monkCap.scale.set(1.05, 0.99, 0.97);
      monkCap.position.set(0, 0.27, -0.01);
      this.headPivot.add(monkCap);
      return;
    }

    // Base hair crown for non-monk patrons
    const crownGeo = this.trackGeo(
      new THREE.SphereGeometry(0.372, 22, 16, 0, Math.PI * 2, 0, Math.PI * 0.62)
    );
    const crown = new THREE.Mesh(crownGeo, hairMat);
    crown.scale.set(1.06, 1.02, 1.02);
    crown.position.set(0, 0.28, -0.02);
    crown.castShadow = true;
    this.headPivot.add(crown);

    // Forehead bangs
    const bangGeo = this.trackGeo(new THREE.SphereGeometry(0.14, 12, 10));
    for (const offset of [-0.14, 0, 0.14]) {
      const bang = new THREE.Mesh(bangGeo, hairMat);
      bang.scale.set(1.05, 0.65, 0.52);
      bang.position.set(offset, 0.45, 0.27);
      this.headPivot.add(bang);
    }

    if (actorId === 'uiko') {
      // Bobbed side locks + delicate white camellia flower ornament
      const bobGeo = this.trackGeo(new THREE.CapsuleGeometry(0.085, 0.22, 8, 12));
      for (const side of [-1, 1]) {
        const bob = new THREE.Mesh(bobGeo, hairMat);
        bob.position.set(side * 0.34, 0.2, 0.04);
        this.headPivot.add(bob);
      }
      const camelliaGeo = this.trackGeo(new THREE.SphereGeometry(0.075, 10, 10));
      const camellia = new THREE.Mesh(camelliaGeo, secondaryMat);
      camellia.scale.set(1.1, 0.65, 1.1);
      camellia.position.set(-0.32, 0.44, 0.16);
      this.headPivot.add(camellia);

      const centerGeo = this.trackGeo(new THREE.SphereGeometry(0.03, 8, 8));
      const center = new THREE.Mesh(centerGeo, accentMat);
      center.position.set(-0.35, 0.45, 0.2);
      this.headPivot.add(center);
    } else if (actorId === 'kashiwagi' || actorId === 'honda') {
      // Round intellectual spectacles (gold/brass for Kashiwagi, silver for Honda)
      const rimColor = actorId === 'kashiwagi' ? 0xd97706 : 0xe4e4e7;
      const specMat = this.trackMat(
        new THREE.MeshStandardMaterial({ color: rimColor, roughness: 0.25, metalness: 0.78 })
      );
      const lensRimGeo = this.trackGeo(new THREE.TorusGeometry(0.078, 0.012, 8, 20));
      for (const side of [-1, 1]) {
        const rim = new THREE.Mesh(lensRimGeo, specMat);
        rim.position.set(side * 0.125, 0.27, 0.345);
        this.headPivot.add(rim);
      }
      const bridgeGeo = this.trackGeo(new THREE.BoxGeometry(0.09, 0.014, 0.014));
      const bridge = new THREE.Mesh(bridgeGeo, specMat);
      bridge.position.set(0, 0.28, 0.348);
      this.headPivot.add(bridge);
    } else if (actorId === 'shinji') {
      // Twisted white fisherman hachimaki headband + forehead knot!
      const bandGeo = this.trackGeo(new THREE.TorusGeometry(0.368, 0.042, 10, 28));
      const band = new THREE.Mesh(bandGeo, secondaryMat);
      band.rotation.x = Math.PI / 2 - 0.08;
      band.position.set(0, 0.44, 0.01);
      this.headPivot.add(band);

      const knotGeo = this.trackGeo(new THREE.SphereGeometry(0.062, 10, 10));
      const knot = new THREE.Mesh(knotGeo, secondaryMat);
      knot.position.set(0.18, 0.47, 0.34);
      this.headPivot.add(knot);
    } else if (actorId === 'hatsue') {
      // Twin side braids + luminous Utajima pearl hairpin
      const braidGeo = this.trackGeo(new THREE.CapsuleGeometry(0.07, 0.28, 8, 10));
      for (const side of [-1, 1]) {
        const braid = new THREE.Mesh(braidGeo, hairMat);
        braid.position.set(side * 0.34, 0.12, 0.06);
        braid.rotation.z = side * 0.12;
        this.headPivot.add(braid);
      }
      const pearlPinGeo = this.trackGeo(new THREE.SphereGeometry(0.055, 12, 12));
      const pearlPin = new THREE.Mesh(pearlPinGeo, accentMat);
      pearlPin.position.set(0.31, 0.45, 0.16);
      this.headPivot.add(pearlPin);
    } else if (actorId === 'kiyoaki') {
      // Taisho Peers' School visored student cap with golden band
      const capCrownGeo = this.trackGeo(new THREE.CylinderGeometry(0.38, 0.35, 0.16, 20));
      const capMat = this.trackMat(
        new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.45 })
      );
      const capCrown = new THREE.Mesh(capCrownGeo, capMat);
      capCrown.position.set(0, 0.56, -0.01);
      capCrown.rotation.x = -0.08;
      this.headPivot.add(capCrown);

      const bandGeo = this.trackGeo(new THREE.CylinderGeometry(0.356, 0.356, 0.04, 20));
      const band = new THREE.Mesh(bandGeo, accentMat);
      band.position.set(0, 0.49, 0);
      this.headPivot.add(band);

      const visorGeo = this.trackGeo(new THREE.CylinderGeometry(0.28, 0.28, 0.025, 16, 1, false, -Math.PI * 0.4, Math.PI * 0.8));
      const visorMat = this.trackMat(new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.25 }));
      const visor = new THREE.Mesh(visorGeo, visorMat);
      visor.position.set(0, 0.47, 0.18);
      visor.rotation.x = 0.18;
      this.headPivot.add(visor);
    } else if (actorId === 'kageyama') {
      // Wide-brimmed Rokumeikan aristocratic bonnet with champagne ribbon & plume
      const chignonGeo = this.trackGeo(new THREE.SphereGeometry(0.16, 14, 12));
      const chignon = new THREE.Mesh(chignonGeo, hairMat);
      chignon.position.set(0, 0.42, -0.28);
      this.headPivot.add(chignon);

      const brimGeo = this.trackGeo(new THREE.CylinderGeometry(0.56, 0.58, 0.032, 24));
      const hatMat = this.trackMat(
        new THREE.MeshStandardMaterial({ color: 0x9f1239, roughness: 0.48 })
      );
      const brim = new THREE.Mesh(brimGeo, hatMat);
      brim.position.set(0, 0.54, -0.02);
      brim.rotation.set(-0.16, 0, 0.08);
      this.headPivot.add(brim);

      const hatTopGeo = this.trackGeo(new THREE.CylinderGeometry(0.28, 0.32, 0.15, 20));
      const hatTop = new THREE.Mesh(hatTopGeo, hatMat);
      hatTop.position.set(0, 0.62, -0.03);
      hatTop.rotation.set(-0.16, 0, 0.08);
      this.headPivot.add(hatTop);

      const plumeGeo = this.trackGeo(new THREE.ConeGeometry(0.065, 0.28, 10));
      const plume = new THREE.Mesh(plumeGeo, secondaryMat);
      plume.position.set(-0.26, 0.67, 0.06);
      plume.rotation.set(-0.3, 0, 0.65);
      this.headPivot.add(plume);
    }
  }

  public dispose(): void {
    this.clearRigResources();
    this.scene.remove(this.group);
  }
}

export default CustomerActors3D;
