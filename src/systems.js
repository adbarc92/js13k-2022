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
  const player = getPlayerEntity(ecs).get(Player);
  this.iterate = () => {
    if (!player.gameStarted) {
      return;
    }
    /** @type {Swarm} */
    const swarm = getSwarmEntity(ecs).get(Swarm);

    if (swarm.waveTimer.isComplete()) {
      for (let i = 0; i < swarm.waveNumber + 5; i += 2) {
        let { x } = player.PhysicsBody;
        x = i % 2 === 0 ? x - 10 : x + 10;
        createEnemyWarrior(x, 20);
      }
    }
  };
}

/** @param {import('./ecs.js').ECS} ecs */
function DistributeDeathShards(ecs) {
  const selector = ecs.select(Swarm, Shardable);

  this.iterate = (entity) => {
    if (entity.Shardable.timeToNextShard.isComplete()) {
      entity.Shardable.shardCount += 1;
      entity.Shardable.hasShards = true;
    }
  };
}

/** @param {import('./ecs.js').ECS} ecs */
function Stunning(ecs) {
  const selector = ecs.select(Stunnable);

  this.iterate = (entity) => {
    if (entity.Stunnable.isStunned && entity.Stunnable.cooldown.isComplete()) {
      entity.Stunnable.isStunned = false;
    }
  };
}

/** @param {import('./ecs.js').ECS} ecs */
function EnemyAI(ecs) {}

/** @param {import('./ecs.js').ECS} ecs */
function DashHandler(ecs) {
  const selector = ecs.select(Dashing);

  this.iterate = (entity) => {
    let { intendsToAct, canAct, isActing, cooldown, duration } = entity.Dashing;
    if (!isActing && cooldown.isComplete()) {
      canAct = true;
    }
    if (!canAct && intendsToAct) {
      // handleAnimation - dashing
      isActing = true;
      duration.start();
    }
    if (isActing && duration.isComplete()) {
      canAct = false;
      cooldown.start();
    }
  };
}

/** @param {import('./ecs.js').ECS} ecs */
function DeflectionHandler(ecs) {
  const selector = ecs.select(Deflecting);

  this.iterate = (entity) => {
    let { intendsToAct, canAct, isActing, cooldown, duration } =
      entity.Deflection;
    if (!isActing && cooldown.isComplete()) {
      canAct = true;
    }
    if (!canAct && intendsToAct) {
      // handleAnimation - deflecting
      isActing = true;
      // Collision detection
      duration.start();
    }
    if (isActing && duration.isComplete()) {
      canAct = false;
      cooldown.start();
    }
  };
}

/** @param {import('./ecs.js').ECS} ecs */
function BashHandler(ecs) {
  const selector = ecs.select(Bashing);

  this.iterate = (entity) => {
    const { intendsToAct, canAct, isActing, cooldown, duration } =
      entity.Bashing;
    if (!isActing && cooldown.isComplete()) {
      entity.Bashing.canAct = true;
    }
    if (!canAct && intendsToAct) {
      // handleAnimation - deflecting
      entity.Bashing.isActing = true;
      // Collision detection
      duration.start();
    }
    if (isActing && duration.isComplete()) {
      entity.Bashing.canAct = false;
      cooldown.start();
    }
  };
}

/** @param {import('./ecs.js').ECS} ecs */
function StrikeHandler(ecs) {
  const selector = ecs.select(Striking);

  this.iterate = (entity) => {
    const { intendsToAct, canAct, isActing, cooldown, duration } =
      entity.Striking;
    if (!isActing && cooldown.isComplete()) {
      entity.Striking.canAct = true;
    }
    if (!canAct && intendsToAct) {
      // handleAnimation - striking
      entity.Striking.isActing = true;
      // Collision detection
      duration.start();
    }
    if (isActing && duration.isComplete()) {
      entity.Striking.canAct = false;
      cooldown.start();
    }
  };
}

/** @param {import('./ecs.js').ECS} ecs */
function JumpHandler(ecs) {
  const selector = ecs.select(Jumping);

  this.iterate = (entity) => {
    const { intendsToAct, actionCap, actionUses, cooldown, duration } =
      entity.Jumping;
    if (entity.PhysicsBody.y < 1) {
      entity.actionCap = 0;
    }
    if (actionUses < actionCap && intendsToAct) {
      entity.actionUses += 1;
      duration.start();
    }
    if (actionUses && duration.isComplete()) {
      entity.actionCap = false;
      cooldown.start();
    }
  };
}

/** @param {import('./ecs.js').ECS} ecs */
function Movement(ecs) {
  const selector = ecs.select(PhysicsBody);

  this.iterate = (entity) => {
    const physics = entity.get(PhysicsBody);

    const frameRatio = draw.fm;
    physics.x += physics.vx * frameRatio;
    physics.y += physics.vy * frameRatio;

    // check ground collision
    physics.ay = 0.0;
  };
}

/** @param {import('./ecs.js').ECS} ecs */
function AttackingHighlightFlipper(ecs) {}

/** @param {import('./ecs.js').ECS} ecs */
function HitHighlightFlipper(ecs) {
  const selector = ecs.select(Renderable, HitHighlightFlipper);

  this.iterate = (entity) => {
    const renderable = entity.get(Renderable);
    const h = entity.get(HitHighlightRender);

    renderable.highlighted = !h.sprTimer.isComplete();
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
  let renderList = [];

  /**
   * @param {{entity, z}[]} arr
   * @param {{entity, z}} val
   */
  function addAndSort(arr, val) {
    arr.push(val);
    for (let i = arr.length - 1; i > 0 && arr[i].z < arr[i - 1].z; i--) {
      const tmp = arr[i];
      arr[i] = arr[i - 1];
      arr[i - 1] = tmp;
    }
  }

  /** @param {Entity} entity */
  const drawEntity = (entity) => {
    /** @type {PhysicsBody} */
    const { x, y } = entity.get(PhysicsBody);
    /** @type {Striking} */
    const { isActing: isStriking } = entity.get(Striking);
    /** @type {Renderable} */
    const renderable = entity.get(Renderable);
    console.log(`renderable: ${JSON.stringify(renderable)}`);
    const {
      spriteName,
      spriteSetName,
      timeToNextSprite,
      animation,
      currentSpriteIdx,
      opacity,
      scale,
      flipped,
      highlighted,
    } = renderable;

    const animationSprites =
      ANIMATIONS[`${spriteSetName}_ANIMATIONS`][animation][0];

    if (timeToNextSprite.isComplete()) {
      renderable.currentSpriteIdx++;
      if (renderable.currentSpriteIdx > animationSprites.length) {
        renderable.spriteName = 'STANDING';
        renderable.currentSpriteIdx = 0;
      } else {
        renderable.timeToNextSprite.start(
          ANIMATIONS[`${spriteSetName}_ANIMATIONS`][animation][1][
            currentSpriteIdx
          ]
        );
      }
    }

    let spritePostFix = '';
    if (flipped) {
      spritePostFix += '_f';
    }
    if (highlighted) {
      spritePostFix += '_h';
    }
    if (isStriking) {
      spritePostFix += '_a';
    }

    draw.setOpacity(opacity);
    if (spriteName) {
      const idx = animationSprites[renderable.currentSpriteIdx];
      const spriteId = spriteName + idx + spritePostFix;
      console.log(`spriteId: ${spriteId}`);
      draw.drawSprite(spriteName + idx + spritePostFix, x, y, 0, scale);
    }
    draw.setOpacity(1);
  };

  /** @param {Entity} entity */
  const addToRenderList = (entity) => {
    /** @type {Renderable} */
    const renderable = entity.get(Renderable);
    addAndSort(renderList, {
      entity,
      z: renderable.z,
    });
  };

  const isOffscreen = (x, y, x2, y2, w, h) => {
    distance(x + w / 2, y + h / 2, x2, y2) < draw.SCREEN_WIDTH / 2 + 160;
  };

  /** @param {Entity} entity */
  const drawRelativeToCamera = (entity) => {
    /** @type {Camera} */
    const { x, y, w, h } = entity.get(Camera);
    const ctx = draw.getCtx();
    ctx.save();
    ctx.translate(-x, -y);
    for (const { entity } of renderList) {
      const { x: x2, y: y2 } = entity.get(PhysicsBody);
      if (!isOffscreen(x, y, x2, y2, w, h)) {
        drawEntity(entity);
      } else {
        console.log('it is offscreen');
      }
    }
  };

  this.update = () => {
    const sprites = ecs.select(PhysicsBody, Renderable);
    console.log(`sprites: ${JSON.stringify(sprites)}`);
    const camera = ecs.select(Camera);
    console.log(`camera: ${camera}`);
    sprites.iterate(addToRenderList);
    camera.iterate(drawRelativeToCamera);
  };
}

/** @param {import('./ecs.js').ECS} ecs */
function RenderUI(ecs) {
  this.update = () => {};
}

function RenderWorld(ecs) {
  this.update = () => {
    console.log('Rendering world...');
    const ctx = draw.getCtx();
    const world = getWorldEntity(ecs).get(World);
    for (let i = 0; i < world.height; i++) {
      for (let j = 0; j < world.width; j++) {
        const tile = world.tiles[i * world.width + j];
        let color = tile === 1 ? colors.BLACK : colors.WHITE;
        const t = TILE_SIZE * TILE_SCALE;
        const x = j * TILE_SIZE;
        const y = i * TILE_SIZE;
        draw.drawRect(x, y, t, t, color, false, ctx);
      }
    }
  };
}

/** @param {import('./ecs.js').ECS} ecs */
function LimitedLifetimeUpdater(ecs) {}

/** @param {import('./ecs.js').ECS} ecs */
function HitPointUpdater(ecs) {}

function CheckTileCollisions(ecs) {}

/** @param {import('./ecs.js').ECS} ecs */
function CheckCollisions(ecs) {}

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
