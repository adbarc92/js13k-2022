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
    Ui,
} from './components.js';
import {
  getPlayerEntity,
} from './entities.js';
const { PhysicsBody } = require('./components.js');

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
        // handleAnimation - double jump
        // handlePhysics - +vy, -ay
      } else {
        jumping.isJumping = true;
        // handleAnimation - jumping
        // handlePhysics - +vy, -ay
      }
    }

    if (player.keys.ArrowDown || player.keys.s) {
      // deflect
    }

    if (player.keys.z || player.keys.Shift) {
      // bash
      // handleAnimation - bash
      // checkCollision
      // setStunned
    }

    if (player.keys.x || player.keys.Enter) {
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

function Movement(ecs) {
  const selector = ecs.select(PhysicsBody);

  const iterate = (entity) => {
    const physics = entity.get(PhysicsBody);

    physics.x += physics.vx * frameRatio;
    physics.y += physics.vy * frameRatio;

    // check ground collision
    physics.ay = 0.0;
  };
}

function Ai(ecs) {
  const select = ecs.select(Ai);

  const iterate = (entity) => {
    // if within player x-range, check y-range
    //  if within y-range, 75% strike, 25% bash
    //  else jump
    //    if jump apex is too low, double jump
    // else move within player x-range
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

  createSystem.bind(this)(selector, iterate);
}

export const get = (ecs) => {
  return [
    // new Input(ecs),
    // new EnemySpawner(ecs),
    // new DistributeDeathShards(ecs),
    // new Stunning(ecs),
    // new EnemyAI(ecs), //swordsman AI
    // new Dashing(ecs),
    // new Deflection(ecs),
    // new Bashing(ecs),
    // new Striking(ecs),
    // new Jumping(ecs),
    // new Movement(ecs),
    // new AttackingHighlightFlipper(ecs),
    // new ActionResolver(ecs),
    // new HitHightlightFlipper(ecs),
    // new CameraMover(ecs),
    // new RenderActors(ecs),
    // new RenderUi(ecs),
    // new LimitedLifetimeUpdater(ecs),
    // new HitPointUpdater(ecs),
  ];
};
