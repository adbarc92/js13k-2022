import {
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
    Swarm,
    Ui,
    HitHighlightRender,
} from './components.js';
import {
  createEnemyFighter,
  getPlayerEntity,
} from './entities.js';
const { PhysicsBody } = require('./components.js');

/** @param {import('./ecs.js').ECS} ecs */
function Input(ecs) {
  const selector = ecs.select(Player, PhysicsBody, HitPoints);
  const playerEntity = getPlayerEntity(ecs);

    /** @type {KeyboardEvent[]} */
  let keysDown = [];
  /** @type {KeyboardEvent[]} */
  let keysUp = [];

  window.addEventListener('keydown', (ev) => {
    keysDown.push(ev);
  });

  window.addEventListener('keyup', (ev) => {
    keysUp.push(ev);
  });

    /**
   * @param {Player} player
   * @param {PhysicsBody} physics
   * @param {HitPoints} hp
   */
  const handleKeyUpdate = (player, physics, hp) => {
    // TODO: Add game end state
    // pause game

    if(playerEntity.components.Stunnable?.isStunned) {
      return;
    }

    if (player.keys.ArrowLeft || player.keys.a) {
      physics.facingLeft = true;
      // handleAnimation
      // handlePhysics - -vx
    }

    if (player.keys.ArrowRight || player.keys.d) {
      physics.facingLeft = false;
      // handleAnimation
      // handlePhysics - +vx
    }

    if (player.keys.ArrowUp || player.keys.w) {
      const jumping = playerEntity.components.Jumping;
      if (
        jumping.isJumping &&
        !jumping.hasDoubleJumped
      ) {
        jumping.intendsToJump = true;
        // handleAnimation - double jump
        // handlePhysics - +vy, -ay
      } else {
        jumping.intendsToJump = true;
        // handleAnimation - jumping
        // handlePhysics - +vy, -ay
      }
    }

    if (player.keys.ArrowDown || player.keys.s) {
      playerEntity.components.Deflecting.intendsToDeflect = true;
    }

    if (player.keys.z || player.keys.Shift) {
      playerEntity.components.Bashing.intendsToBash = true;
      // checkCollision
      // setStunned
    }

    if (player.keys.x || player.keys.Enter) {
      playerEntity.components.Striking.intendsToStrike = true;
      // strike
      // handleAnimation - strike
      // checkCollision
      // checkShards
      // calculateDamage
      // doDamage
    }
  };

  /** @param {Entity} entity */
  const iterate = (entity) => {
    /** @type {Player} */
    const player = entity.get(Player);
    /** @type {PhysicsBody} */
    const physics = entity.get(PhysicsBody);
    /** @type {HitPoints} */
    const hp = entity.get(HitPoints);

    keysDown.forEach((ev) => {
      if (!player.gameStarted) {
        player.gameStarted = true;
      }
      player.setKeyDown(ev.key);
      // handleKeyDown(ev.key, player, physics);
    });
    keysUp.forEach((ev) => {
      player.setKeyUp(ev.key);
      // reset the player's horizontal velocity
    });

    if (player.gameStarted) {
      handleKeyUpdate(player, physics, hp);
    }

    if (keysUp.length) {
      keysUp = [];
    }
    if (keysDown.length) {
      keysDown = [];
    }
  }
}

/** @param {import('./ecs.js').ECS} ecs */
function EnemySpawner(ecs) {
  const player = getPlayerEntity(ecs).get(Player);
  this.update = () => {
    if (!player.gameStarted) {
      return;
    }
    /** @type {Swarm} */
    const swarm = getSwarm(ecs).get(Swarm);

    if (swarm.waveTimer.isComplete()) {
      for(let i = 0; i < swarm.waveNumber + 5; i += 2) {
        let { x } = player.PhysicsBody;
        x = i % 2 === 0 ? x - 10 : x + 10;
        createEnemyFighter(x, 20);
      }
    }
  };
}

/** @param {import('./ecs.js').ECS} ecs */
function DistributeDeathShards(ecs) {
  const selector = ecs.select(Swarm, Shardable);

  const iterate = (entity) => {
    if (entity.Shardable.timeToNextShard.isComplete()) {
      entity.Shardable.shardCount += 1;
      entity.Shardable.hasShards = true;
    }
  };
}

/** @param {import('./ecs.js').ECS} ecs */
function Stunning(ecs) {
  const selector = ecs.select(Stunnable);

  const iterate = (entity) => {
    if (
      entity.Stunnable.isStunned &&
      entity.Stunnable.cooldown.isComplete()
    ) {
      entity.Stunnable.isStunned = false;
    }
  };
}

/** @param {import('./ecs.js').ECS} ecs */
function EnemyAI(ecs) {}

/** @param {import('./ecs.js').ECS} ecs */
function DashHandler(ecs) {
  const selector = ecs.select(Dashing);

  const iterate = (entity) => {
    const { intendsToAct, canAct, isActing, cooldown, duration } = entity.Dashing;
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
  const selector = ecs.select(Deflection);

  const iterate = (entity) => {
    const { intendsToAct, canAct, isActing, cooldown, duration } = entity.Deflection;
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

  const iterate = (entity) => {
    const { intendsToAct, canAct, isActing, cooldown, duration } = entity.Bashing;
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
function StrikeHandler(ecs) {
  const selector = ecs.select(Striking);

  const iterate = (entity) => {
    const { intendsToAct, canAct, isActing, cooldown, duration } = entity.Striking;
    if (!isActing && cooldown.isComplete()) {
      canAct = true;
    }
    if (!canAct && intendsToAct) {
      // handleAnimation - striking
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
function JumpHandler(ecs) {
  const selector = ecs.select(Jumping);

  const iterate = (entity) => {
    const { intendsToAct, actionCap, actionUses, cooldown, duration } = entity.Jumping;
    if (entity.PhysicsBody.y < 1) {
      actionCap = 0;
    }
    if (actionUses < actionCap && intendsToAct) {
      // handleAnimation - striking
      actionUses += 1;
      duration.start();
    }
    if (actionUses && duration.isComplete()) {
      actionCap = false;
      cooldown.start();
    }
  };
}

/** @param {import('./ecs.js').ECS} ecs */
function Movement(ecs) {
  const selector = ecs.select(PhysicsBody);

  const iterate = (entity) => {
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

  const iterate = (entity) => {
    const renderable = entity.get(Renderable);
    const h = entity.get(HitHighlightRender);

    renderable.highlighted = !h.sprTimer.isComplete();
  };
}

/** @param {import('./ecs.js').ECS} ecs */
function CameraMover(ecs) {
  const selector = ecs.select(Camera, Ship, PhysicsBody);

  /** @param {Entity} entity */
  const iterate = (entity) => {
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
      camera.x = maxW - camera.w;git
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
  const sprites = ecs.select(PhysicsBody, Renderable);
  const camera = ecs.select(Camera);

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
    const { x, y, angle } = entity.get(PhysicsBody);
    /** @type {Renderable} */
    const {
      spriteName,
      circle,
      rectangle,
      opacity,
      scale,
      flipped,
      highlighted,
      ship,
    } = entity.get(Renderable);

    let spritePostFix = '';
    if (flipped) {
      spritePostFix += '_f';
    }
    if (highlighted) {
      spritePostFix += '_h';
    }

    draw.setOpacity(opacity);
    if (spriteName) {
      draw.drawSprite(spriteName + spritePostFix, x, y, angle, scale);
    }
    if (circle) {
      const { r, color } = circle;
      draw.drawCircle(x, y, r * scale, color);
    }
    if (rectangle) {
      const { w, h, color } = rectangle;
      draw.drawRect(x, y, w * scale, h * scale, color);
    }
    if (ship) {
      const spriteList = ship.getHitCirclePositions(angle);
      for (const {
        offset: [eX, eY],
        spr,
      } of spriteList) {
        draw.drawSprite(spr + spritePostFix, x + eX, y + eY, angle, scale);
      }
      const turretList = ship.getTurretPositions(angle);
      for (const { spr, physics } of turretList) {
        draw.drawSprite(spr, physics.x, physics.y, physics.angle, scale);
      }
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

  /** @param {Entity} entity */
  const drawRelativeToCamera = (entity) => {
    /** @type {Camera} */
    const { x, y, w, h } = entity.get(Camera);
    const ctx = draw.getCtx();
    ctx.save();
    ctx.translate(-x, -y);
    for (const { entity } of renderList) {
      const { x: x2, y: y2 } = entity.get(PhysicsBody);
      if (
        utils.distance(x + w / 2, y + h / 2, x2, y2) <
        draw.SCREEN_WIDTH / 2 + 160
      ) {
        drawEntity(entity);
      }
    }

    // compass
    const { x: baseX, y: baseY } = getBaseEntity(ecs).get(PhysicsBody);
    const { x: playerX, y: playerY } = getPlayerEntity(ecs).get(PhysicsBody);
    const angle = utils.getAngleTowards([playerX, playerY], [baseX, baseY]);
    const [eX, eY] = utils.getVector(angle, 96);
    const [eX2, eY2] = utils.getVector(angle, 64);

    // draw.drawLine
    draw.drawCircle(playerX + eX, playerY + eY, 2, 'red');
    draw.drawLine(
      playerX + eX2,
      playerY + eY2,
      playerX + eX,
      playerY + eY,
      'red'
    );

    ctx.restore();
    renderList = [];
  };

  /** @type {any} */
  const canvas = document.getElementById('canvasDiv');

  this.update = () => {
    canvas.style.filter = getPlayerEntity(ecs).get(Player).gameOver
      ? 'grayscale(1)'
      : '';

    sprites.iterate(addToRenderList);
    camera.iterate(drawRelativeToCamera);
  };
}

/** @param {import('./ecs.js').ECS} ecs */
function RenderUI(ecs) {}

/** @param {import('./ecs.js').ECS} ecs */
function LimitedLifetimeUpdater(ecs) {}

/** @param {import('./ecs.js').ECS} ecs */
function HitPointUpdater(ecs) {}

/** @param {import('./ecs.js').ECS} ecs */
function CheckCollisions(ecs) {}

export const get = (ecs) => {
  return [
    new Input(ecs),
    new EnemySpawner(ecs),
    new DistributeDeathShards(ecs),
    new Stunning(ecs),
    new EnemyAI(ecs),
    new DashHandler(ecs),
    new DeflectionHandler(ecs),
    new BashHandler(ecs),
    new StrikeHandler(ecs),
    new JumpHandler(ecs),
    new Movement(ecs),
    new AttackingHighlightFlipper(ecs),
    new HitHightlightFlipper(ecs),
    new CameraMover(ecs),
    new RenderActors(ecs),
    new RenderUI(ecs),
    new CheckCollisions(ecs),
    new LimitedLifetimeUpdater(ecs),
    new HitPointUpdater(ecs),
  ];
};
