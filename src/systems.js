import {
  PhysicsBody,
  Stunnable,
  Jumping,
  Bashing,
  Dashing,
  Deflecting,
  Striking,
  Shardable,
  Renderable,
  LimitedLifetime,
  Player,
  Ai,
  Camera,
  Projectile,
  HitPoints,
  HitBody,
  Warrior,
  Swarm,
  Ui,
  World,
  HitHighlightRender,
  WORLD_WIDTH,
  TILE_SCALE,
  WORLD_HEIGHT,
  TILE_SIZE,
} from './components.js';
import {
  createEnemyWarrior,
  getWorldEntity,
  getPlayerEntity,
  getSwarmEntity,
} from './entities.js';
import { colors, draw, ANIMATIONS } from './draw.js';
import { distance } from './utils.js';

const WALKING_SPEED = 2;

/** @param {import('./ecs.js').ECS} ecs */
function Input(ecs) {
  /** @type {KeyboardEvent[]} */
  let keysDown = [];
  /** @type {KeyboardEvent[]} */
  let keysUp = [];

  window.addEventListener('keydown', (ev) => {
    keysDown.push(ev.key);
  });

  window.addEventListener('keyup', (ev) => {
    keysUp.push(ev.key);
  });

  /**
   * @param {Player} player
   * @param {PhysicsBody} physics
   * @param {HitPoints} hp
   */
  const handleKeyUpdate = (player, physics, hp) => {
    const playerEntity = getPlayerEntity(ecs);

    if (playerEntity.components.Stunnable?.isStunned || hp) {
      return;
    }

    if (player.keys.ArrowLeft || player.keys.a) {
      physics.facingLeft = true;
      physics.vx = WALKING_SPEED;
    }

    if (player.keys.ArrowRight || player.keys.d) {
      physics.facingLeft = false;
      physics.vx = -WALKING_SPEED;
    }

    if (player.keys.ArrowUp || player.keys.w) {
      playerEntity.get(Jumping).intendsToJump = true;
    }

    if (player.keys.ArrowDown || player.keys.s) {
      playerEntity.get(Deflecting).intendsToDeflect = true;
    }

    if (player.keys.z || player.keys.Shift) {
      playerEntity.get(Bashing).intendsToBash = true;
    }

    if (player.keys.x || player.keys.Enter) {
      playerEntity.get(Striking).intendsToStrike = true;
    }
  };

  /** @param {Entity} entity */
  this.iterate = (entity) => {
    /** @type {Player} */
    const player = entity.get(Player);
    /** @type {PhysicsBody} */
    const physics = entity.get(PhysicsBody);
    /** @type {HitPoints} */
    const hp = entity.get(HitPoints);

    keysDown.forEach((key) => {
      if (!player.gameStarted) {
        player.gameStarted = true;
      }
      player.keys[key] = true;
    });

    keysUp.forEach((key) => {
      player.keys[key] = false;
    });

    if (player.gameStarted) {
      handleKeyUpdate(player, physics, hp);
    }

    console.log(`keysDown: ${keysDown}`);

    if (keysUp.length) {
      keysUp = [];
    }
    if (keysDown.length) {
      keysDown = [];
    }
  };

  const selector = ecs.select(Player, PhysicsBody);
  this.update = () => selector.iterate(this.iterate);
}

/** @param {import('./ecs.js').ECS} ecs */
function EnemySpawner(ecs) {
  this.update = () => {
    // Get the Enemy Group Id
    // Based on the wave
  };
}

/** @param {import('./ecs.js').ECS} ecs */
function DistributeDeathShards(ecs) {
  this.update = () => {
    // Select all entities that can receive death shards
    // If the timer is up, increment their shard count by one.
  };
}

/** @param {import('./ecs.js').ECS} ecs */
function Stunning(ecs) {
  this.update = () => {
    // Select all entities that can be stunned.
    // If the timer is up, reset their stun status
    // If they are to be stunned, set their status and set a timer
  };
}

/** @param {import('./ecs.js').ECS} ecs */
function EnemyAI(ecs) {
  this.update = () => {
    // Select all with AI
    // For those that are outside of attacking distance, move toward the player
    // For those within attacking distance, choose an attack
    // Try to strike - 75%
    // Try to deflect - 25%
  };
}

/** @param {import('./ecs.js').ECS} ecs */
function DashHandler(ecs) {
  this.update = () => {
    // Select all units which can dash
    // If they intend to dash, change the animation and add X velocity and opposing X acceleration
  };
}

/** @param {import('./ecs.js').ECS} ecs */
function DeflectionHandler(ecs) {
  this.update = () => {
    // Select all units which can deflect
    // If they intend to deflect, change animation and set deflecting
  };
}

/** @param {import('./ecs.js').ECS} ecs */
function BashHandler(ecs) {
  this.update = () => {};
}

/** @param {import('./ecs.js').ECS} ecs */
function StrikeHandler(ecs) {
  this.update = () => {};
}

/** @param {import('./ecs.js').ECS} ecs */
function JumpHandler(ecs) {
  this.update = () => {};
}

/** @param {import('./ecs.js').ECS} ecs */
function Movement(ecs) {
  this.update = () => {};
}

/** @param {import('./ecs.js').ECS} ecs */
function AttackingHighlightFlipper(ecs) {
  this.update = () => {};
}

/** @param {import('./ecs.js').ECS} ecs */
function HitHighlightFlipper(ecs) {
  this.update = () => {};
}

/** @param {import('./ecs.js').ECS} ecs */
function CameraMover(ecs) {
  const selector = ecs.select(Camera, Warrior, PhysicsBody);

  /** @param {Entity} entity */
  this.iterate = (entity) => {
    /** @type {Camera} */
    const camera = entity.get(Camera);
    /** @type {PhysicsBody} */
    const physics = entity.get(PhysicsBody);

    camera.x = physics.x - camera.w / 2;
    camera.y = physics.y - camera.h / 2;

    const minSize = (-16 * TILE_SCALE) / 2;
    const maxW = WORLD_WIDTH - (16 * TILE_SCALE) / 2;
    const maxH = WORLD_HEIGHT - (16 * TILE_SCALE) / 2;

    if (camera.x < minSize) {
      camera.x = minSize;
    }
    if (camera.x + camera.w > maxW) {
      camera.x = maxW - camera.w;
    }
    if (camera.y < minSize) {
      camera.y = minSize;
    }
    if (camera.y + camera.h > maxH) {
      camera.y = maxH - camera.h;
    }

    camera.x = Math.floor(camera.x);
    camera.y = Math.round(camera.y);
  };
}

/** @param {import('./ecs.js').ECS} ecs */
function RenderActors(ecs) {
  this.update = () => {};
}

/** @param {import('./ecs.js').ECS} ecs */
function RenderUI(ecs) {
  this.update = () => {};
}

function RenderWorld(ecs) {
  this.update = () => {};
}

/** @param {import('./ecs.js').ECS} ecs */
function LimitedLifetimeUpdater(ecs) {
  this.update = () => {};
}

/** @param {import('./ecs.js').ECS} ecs */
function HitPointUpdater(ecs) {
  this.update = () => {};
}

function CheckTileCollisions(ecs) {
  this.update = () => {};
}

/** @param {import('./ecs.js').ECS} ecs */
function CheckCollisions(ecs) {
  this.update = () => {};
}

export const getSystems = (ecs) => {
  return [
    new Input(ecs),
    // new EnemySpawner(ecs),
    // new DistributeDeathShards(ecs),
    // new Stunning(ecs),
    // new EnemyAI(ecs),
    // new DashHandler(ecs),
    // new DeflectionHandler(ecs),
    // new BashHandler(ecs),
    // new StrikeHandler(ecs),
    // new JumpHandler(ecs),
    // new Movement(ecs),
    // new AttackingHighlightFlipper(ecs),
    // new HitHighlightFlipper(ecs),
    // new CameraMover(ecs),
    new RenderActors(ecs),
    // new RenderUI(ecs),
    new RenderWorld(ecs),
    // new CheckCollisions(ecs),
    // new LimitedLifetimeUpdater(ecs),
    // new HitPointUpdater(ecs),
  ];
};
