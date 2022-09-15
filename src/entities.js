import {
  World,
  Ai,
  AttackingHighlightRender,
  Bashing,
  Dashing,
  Deflecting,
  Warrior,
  HitBody,
  HitHighlightRender,
  HitPoints,
  Jumping,
  LimitedLifetime,
  PhysicsBody,
  Player,
  Renderable,
  Shardable,
  Striking,
  Stunnable,
  Ui,
  WORLD_HEIGHT,
  WORLD_WIDTH,
  Camera,
} from './components.js';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from './draw.js';

let uiId = '';
export const getUiEntity = (ecs) => ecs.get(uiId);
let playerWarriorId = '';
/**
 * @returns {Entity}
 */
export const getPlayerEntity = (ecs) => ecs.get(playerWarriorId);
export const isPlayerEntity = (entity) => entity.id === playerWarriorId;
let swarmId = '';
export const getSwarmEntity = (ecs) => ecs.get(swarmId);

let worldId = '';
export const getWorldId = () => worldId;
export const getWorldEntity = (ecs) => ecs.get(worldId);

let cameraId = '';
export const getCameraId = () => cameraId;
export const getCameraEntity = (ecs) => ecs.get(getCameraId);

export const createPlayer = (ecs) => {
  const ent = ecs.create();
  ent.add(
    new Player(),
    new Warrior(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2),
    new PhysicsBody(0, 0),
    new Stunnable(),
    new Jumping(),
    new Bashing(),
    new Dashing(),
    new Deflecting(),
    new Striking(),
    new Shardable(),
    new Renderable({
      spriteName: 'spr_',
      z: 1,
      scale: 1,
      spriteSetName: 'SWORD',
    }),
    new Ai(),
    new HitHighlightRender(),
    new HitPoints(20)
  );
  playerWarriorId = ent.id;
};

export const createCamera = (ecs) => {
  const ent = ecs.create();
  ent.add(new Camera());
  cameraId = ent.id;
};

export const createWorld = (ecs) => {
  const ent = ecs.create();
  ent.add(new World(new Array(WORLD_HEIGHT * WORLD_WIDTH).fill(0)));
  worldId = ent.id;
};

export const createEnemyWarrior = (ecs) => {
  const ent = ecs.create();
  ent.add(
    new PhysicsBody(),
    new Stunnable(),
    new Jumping(),
    new Bashing(),
    new Dashing(),
    new Deflecting(),
    new Striking(),
    new Shardable(),
    new Renderable({
      spriteName: 'spr_e_',
      z: 1,
      scale: 1,
      spriteSetName: 'SWORD',
    }),
    new LimitedLifetime(),
    new Ai(),
    new HitBody(),
    new HitHighlightRender(),
    new AttackingHighlightRender(),
    new HitPoints(5)
  );
};

export const createUi = (ecs) => {
  const ent = ecs.create();
  ent.add(new Ui());
  uiId = ent.id;
};

export const newGame = (ecs) => {
  ecs.reset();
  createPlayer(ecs);
  createWorld(ecs);
};

function EnemyWarriorSpawner() {}
