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
  StrikeHighlightRender,
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
const SHARD_DURATION = 2000;
const STUN_DURATION = 2500;

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

    /* If the player is stunned, accept no inputs (except pause) */
    if (playerEntity.get(Stunnable)?.isStunned || hp) {
      return;
    }

    if (player.keys.ArrowLeft || player.keys.a) {
      // physics.facingLeft = true;
      // physics.vx = WALKING_SPEED;
      const physics = playerEntity.get(PhysicsBody);
      physics.facingLeft = true;
      playerEntity.get(Movement).intendsToMove = true;
    }

    if (player.keys.ArrowRight || player.keys.d) {
      // physics.facingLeft = false;
      // physics.vx = -WALKING_SPEED;
      const physics = playerEntity.get(PhysicsBody);
      physics.facingLeft = false;
      playerEntity.get(Movement).intendsToMove = true;
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
    const swarm = getSwarmEntity(ecs).get(Swarm);
    // If the wave timer is complete, add new enemies based on the swarm.
    if (swarm.waveTimer.isComplete()) {
      for (let i = 0; i < swarm.waveCount + 5; i++) {
        swarm.enemies.push(createEnemyWarrior());
      }
    }
    // Based on the wave, add new entities to the swarm.
  };
}

/** @param {import('./ecs.js').ECS} ecs */
function DistributeDeathShards(ecs) {
  this.update = () => {
    ecs.select(Shardable).iterate((entity) => {
      const shardable = entity.get(Shardable);
      if (shardable.shardTimer.isComplete()) {
        shardable.count += 1;
        shardable.shardTimer.start(SHARD_DURATION);
      }
    });
  };
}

/** @param {import('./ecs.js').ECS} ecs */
function Stunning(ecs) {
  this.update = () => {
    ecs.select(Stunnable).iterate((entity) => {
      const stunnable = entity.get(Stunnable);
      if (!stunnable.isStunned && stunnable.shouldBeStunned) {
        stunnable.isStunned = true;
        stunnable.stunTimer.start(STUN_DURATION);
      }
      if (stunnable.isStunned && stunnable.stunTimer.isComplete()) {
        stunnable.isStunned = false;
      }
    });
  };
}

/** @param {import('./ecs.js').ECS} ecs */
function EnemyAI(ecs) {
  this.update = () => {
    const playerFighter = getPlayerFighter();
    ecs.select(Ai).iterate((entity) => {});
    // Select all with AI
    // For those that are outside of attacking distance, move toward the player
    // For those within attacking distance, choose an attack
    // Try to strike - 75%
    // Try to deflect - 25%
    // Fleeing?
  };
}

/** @param {import('./ecs.js').ECS} ecs */
function DashHandler(ecs) {
  this.update = () => {
    ecs.select(Dashing).iterate((entity) => {});
    // Select all units which can dash
    // If they intend to dash, change the animation state and add X velocity and opposing X acceleration
  };
}

/** @param {import('./ecs.js').ECS} ecs */
function DeflectionHandler(ecs) {
  this.update = () => {
    ecs.select(Deflecting).iterate((entity) => {});
    // Select all units which can deflect
    // If they intend to deflect, change animation state and set deflecting
  };
}

/** @param {import('./ecs.js').ECS} ecs */
function BashHandler(ecs) {
  this.update = () => {
    ecs.select(Bashing).iterate((entity) => {});
    // Select all entities that can bash
    // If they intend to bash, set animState and set bashing
  };
}

/** @param {import('./ecs.js').ECS} ecs */
function StrikeHandler(ecs) {
  this.update = () => {
    ecs.select(Striking).iterate((entity) => {});
    // Select all entities that can strike
    // If they intend to strike, set animState and set striking
  };
}

/** @param {import('./ecs.js').ECS} ecs */
function JumpHandler(ecs) {
  this.update = () => {
    ecs.select(Jumping).iterate((entity) => {});
    // Select all entities that can strike
    // If they intend to strike, set animState and set striking
  };
}

/** @param {import('./ecs.js').ECS} ecs */
function Movement(ecs) {
  this.update = () => {
    ecs.select(PhysicsBody).iterate((entity) => {});
    // Select all entities with physicsBody
    // If an entity is not moving and intends to move, set animState and velocity
    // If the entity is moving and does not intend to move, reset animState and velocity
    // If the entity is moving and intends to move, do nothing
  };
}

/** @param {import('./ecs.js').ECS} ecs */
function AttackingHighlightFlipper(ecs) {
  this.update = () => {
    ecs.select(Striking, StrikeHighlightRender).iterate((entity) => {});
    // Select all entities that can be highlighted and attack
    // If the entity is attacking, flip their color scheme to the corresponding inversion
  };
}

/** @param {import('./ecs.js').ECS} ecs */
function HitHighlightFlipper(ecs) {
  this.update = () => {
    ecs.select(HitHighlightRender).iterate((entity) => {});
    // Select all entities that can be highlighted and hit
    // If the entity is hit, flip their color scheme to the corresponding inversion
  };
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
  this.update = () => {
    // Select all renderables
    ecs.select(Renderable).iterate((entity) => {});
    // Draw all renderables according to their animation state and position
  };
}

/** @param {import('./ecs.js').ECS} ecs */
function RenderUI(ecs) {
  this.update = () => {
    const ui = getUi();
    renderUi(ui);
    // Get the UI
    // Render it
  };
}

function RenderWorld(ecs) {
  this.update = () => {
    const world = getWorld();
    renderWorld(world);
    // Get the world
    // Render it
  };
}

/** @param {import('./ecs.js').ECS} ecs */
function LimitedLifetimeUpdater(ecs) {
  this.update = () => {
    ecs.select(LimitedLifetime).iterate(() => {});
    // Select all entities with limitedLifetime
    // If the lifetime has expired, delete it.
  };
}

/** @param {import('./ecs.js').ECS} ecs */
function HitPointUpdater(ecs) {
  this.update = () => {
    ecs.select(HP).iterate(() => {});
    // Select all entities with HP
    // If the entity has taken damage, subtract that from their HP
  };
}

function CheckTileCollisions(ecs) {
  this.update = () => {
    ecs.select(Tile, Collision).iterate(() => {});
    // Select all tiles with collisions
    // Select all entities with physics
    // If the physicsEntities overlap with any of the tiles, set their positions to be outside of the tiles
  };
}

/** @param {import('./ecs.js').ECS} ecs */
function CheckDamageCollisions(ecs) {
  this.update = () => {
    ecs.select(Damage, Collision).iterate(() => {});
    // Select all entities that can deal damage.
    // Select all entities with physicsBodies.
    // If there is any overlap between either group, deal damage to the physicsBody entities.
  };
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
    // new CheckDamageCollisions(ecs),
    // new LimitedLifetimeUpdater(ecs),
    // new HitPointUpdater(ecs),
  ];
};
