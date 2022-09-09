import { SCREEN_HEIGHT, SCREEN_WIDTH } from './draw';
import { Timer } from './utils';

export const TILE_SCALE = 4;
export const TILE_SIZE = 16;
export const SPRITE_SIZE = 16;

const WORLD_WIDTH_TILES = 32;
const WORLD_HEIGHT_TILES = 32;

export const WORLD_WIDTH = WORLD_WIDTH_TILES * TILE_SIZE * TILE_SCALE;
export const WORLD_HEIGHT = WORLD_HEIGHT_TILES * TILE_SIZE * TILE_SCALE;

export class PhysicsBody {
  vx = 0;
  vy = 0;
  ax = 0;
  ay = 0;
  mass = 1;
  acc = false;
  accRate = 0.3;
  facingLeft = true;

  /**
   * @param {number} x
   * @param {number} y
   */

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

export class Map {
  tiles = [];
  width = 32; // WORLD_WIDTH
  height = 32; // WORLD_HEIGHT
}

export class Stunnable {
  isStunned = false;

  constructor(cooldown) {
    this.cooldown = new Timer(cooldown || 500);
  }
}

// export class Action {
//   intendsToAct: false;
//   canAct: false;
//   isActing: false;

//   constructor(type, duration, cooldown) {
//     this.cooldown = new Timer(cooldown || 500);
//     this.duration = new Timer(500);
//     this.type = type;
//   }
// }

export class Jumping {
  intendsToAct = false;
  actionCap = 2;
  actionUses = 0;

  constructor(duration) {
    this.duration = new Timer(duration || 1000);
  }
}

export class Bashing {
  intendsToAct = false;
  canAct = false;
  isActing = false;

  constructor(duration, cooldown) {
    this.cooldown = new Timer(cooldown || 500);
    this.duration = new Timer(500);
  }
}

export class Dashing {
  intendsToAct = false;
  canAct = false;
  isActing = false;
  distance = 5;

  constructor(duration, cooldown) {
    this.cooldown = new Timer(cooldown || 750);
    this.duration = new Timer(500);
  }
}

export class Deflecting {
  intendsToAct = false;
  canAct = false;
  isActing = false;

  constructor(duration, cooldown) {
    this.cooldown = new Timer(cooldown || 250);
    this.duration = new Timer(1500);
  }
}

export class Striking {
  intendsToAct = false;
  canAct = false;
  isActing = false;

  constructor(duration, cooldown) {
    this.cooldown = new Timer(cooldown || 500);
    this.duration = new Timer(1500);
  }
}

export class Shardable {
  hasShards = false;
  shardCount = 0;
  timeToNextShard = 250;
  // timeToLive = 3000;

  constructor(duration) {
    // this.timeToLive = new Timer(duration || 3000)
    this.timeToNextShard = new Timer(duration || 250);
  }
}

export class Comboable {
  comboCount = 0;
}

export class Renderable {
  flipped = false;
  highlighted = false;

  constructor({ spriteName, z, scale }) {
    this.spriteName = spriteName ?? '';
    this.z = z ?? 0;
    this.scale = scale ?? 1;
  }
}

export class LimitedLifetime {
  timer = 0;
  opacity = {
    start: 1,
    end: 1,
  };
  scale = {
    start: 1,
    end: 1,
  };
}

export class Player {
  /** @type {Record<string, boolean>} */
  keys = {};
  score = 0;
  crates = 0;
  gameOver = false;

  /** @param {string} key */
  setKeyDown(key) {
    this.keys[key] = true;
  }
  /** @param {string} key */
  setKeyUp(key) {
    this.keys[key] = false;
  }
}

export class Ai {}

export class Camera {
  x = 0;
  y = 0;
  w = SCREEN_WIDTH;
  h = SCREEN_HEIGHT;
}

export class HitHighlightRender {
  /** */
  constructor(duration) {
    this.sprTimer = new Timer(duration);
  }
}

export class AttackingHighlightRender {
  /** */
  constructor(duration) {
    this.sprTimer = new Timer(duration);
  }
}

export class Projectile {
  /**
   * @param {number} dmg
   * @param {string} allegiance
   */
  constructor(dmg, allegiance) {
    this.dmg = dmg;
    this.allegiance = allegiance;
  }
}

export class HitPoints {
  constructor(maxHp) {
    this.maxHp = this.hp = maxHp;
  }
}

export class HitBody {
  constructor(spots) {
    this.spots = spots;
  }
}

export class Fighter {
  constructor(x, y) {
    this.sprites = {};
    this.x = 0;
    this.y = 0;
  }
}

export class Swarm {
  waveNumber = 0;
  numEnemies = 0;
  waveTimer = new Timer(30000);

  /** */
  constructor() {
    this.waveTimer.timestampStart = -this.waveTimer.duration;
  }
}

export class Ui {
  beginTimer = new Timer(5000);
  endTimer = new Timer(5000);

  /** */
  constructor() {
    this.endTimer.timestampStart = -9999;
  }
}

export const get = () => {
  return [
    PhysicsBody,
    Stunnable,
    Jumping,
    Bashing,
    Dashing,
    Deflecting,
    Striking,
    Shardable,
    Comboable,
    Renderable,
    LimitedLifetime,
    Player,
    Ai,
    Camera,
    HitHighlightRender,
    AttackingHighlightRender,
    Projectile,
    HitPoints,
    HitBody,
    Fighter,
    Swarm,
    Ui,
  ];
};
