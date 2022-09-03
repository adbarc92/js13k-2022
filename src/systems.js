
const { PhysicsBody } = require('./components.js');

function Input(ecs) {
  const selector = ecs.select(Player, PhysicsBody, HitPoints);
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
    // new RenderActors(ecs),
    // new RenderUi(ecs),
    // new LimitedLifetimeUpdater(ecs),
    // new HitPointUpdater(ecs),
  ];
};
