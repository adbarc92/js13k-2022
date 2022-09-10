import {
  World,
  Ai,
  AttackingHighlightRender,
  Bashing,
  Comboable,
  Dashing,
  Deflecting,
  Fighter,
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
} from './components.js';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from './draw.js';

let uiId = '';
export const getUiEntity = (ecs) => ecs.get(uiId);
let playerFighterId = '';
export const getPlayerEntity = (ecs) => ecs.get(playerFighterId);
export const isPlayerEntity = (entity) => entity.id === playerFighterId;
let swarmId = '';
export const getSwarmEntity = (ecs) => ecs.get(swarmId);

let worldId = '';
export const getWorldId = () => worldId;
export const getWorldEntity = (ecs) => ecs.get(worldId);

export const createPlayer = (ecs) => {
  const ent = ecs.create();
  ent.add(
    new Player(),
    new Fighter(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2),
    new PhysicsBody(0, 0),
    new Stunnable(),
    new Jumping(),
    new Bashing(),
    new Dashing(),
    new Deflecting(),
    new Striking(),
    new Shardable(),
    new Comboable(),
    new Renderable({ spriteName: '', z: 1, scale: 1 }),
    new Ai(),
    new HitHighlightRender(),
    new HitPoints(20)
  );
  playerFighterId = ent.id;
};

export const createWorld = (ecs) => {
  const ent = ecs.create();
  ent.add(new World(new Array(WORLD_HEIGHT * WORLD_WIDTH).fill(0)));
  worldId = ent.id;
};

export const createEnemyFighter = (ecs) => {
  const physics = new PhysicsBody();

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
    new Comboable(),
    new Renderable({ spriteName: '', z: 1, scale: 1 }),
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

function EnemyFighterSpawner() {}
