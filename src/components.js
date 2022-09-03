
export class PhysicsBody {
  vx = 0;
  vy = 0;
  ax = 0;
  ay = 0;
  mass = 1;
  acc = false;
  accRate = 0.3;
  facingLeft = true;
}

export class Stunnable {
  isStunned: false;
  duration: 500;
}

export class Jumping {
  isJumping: false;
  // canDoubleJump: false;
  hasDoubleJumped: false;
}

export class Bashing {
  hasBashed: false;
  isBashing: false;
  cooldown: 500;
}

export class Dashing {
  distance: 0;
  canDash: false;
  isDashing: false;
  cooldown: 750;
}

export class Deflecting {
  canDeflect: false;
  isDeflecting: false;
  cooldown: 250;
}

export class Striking {
  canStrike: false;
  isStriking: false;
  cooldown: 500;
}

export class Shardable {
  hasShards = false;
  shardCount = 0;
  timeToLive = 3000;
  timeToNextShard = 250;
}

export class Comboable {
  comboCount: 0;
}

export class Renderable {
  spriteName = '';
  flipped = false;
  highlighted = false;
  z = 0;
  scale = 1;
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

export class Ai {
  
}

export class Camera {
  x = 0;
  y = 0;
  w = draw.SCREEN_WIDTH;
  h = draw.SCREEN_HEIGHT;
}

export class HitHighlightRender {
  /** */
  constructor(duration) {
    this.sprTimer = new utils.Timer(duration);
    this.sprTimer.timestampStart = 0;
  }
}

export class AttackingHighlightRender {
  /** */
  constructor(duration) {
    this.sprTimer = new utils.Timer(duration);
    this.sprTimer.timestampStart = 0;
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

export class HitBody {}

export class Fighter {
  constructor(x, y) {
    this.sprites = {};
    this.x = 0;
    this.y = 0;
    this.scale = scale ?? 1;
  }
};

export class Ui {}

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
    HighlightRender,
    Projectile,
    HitPoints,
    HitBody,
    Fighter,
    Ui,
  ];
};


