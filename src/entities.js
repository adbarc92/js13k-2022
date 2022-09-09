import {
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
} from './components';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from './draw';
import { createMap } from './utils';

let uiId = '';
export const getUiEntity = (ecs) => ecs.get(uiId);
let playerFighterId = '';
export const getPlayerEntity = (ecs) => ecs.get(playerFighterId);
export const isPlayerEntity = (entity) => entity.id === playerFighterId;
let swarmId = '';
export const getSwarmEntity = (ecs) => ecs.get(swarmId);

let mapId = '';
export const getMapId = () => mapId;
export const getMapEntity = (ecs) => ecs.get(mapId);

export const createPlayer = (ecs) => {
  const ent = ecs.create();
  ent.add(
    new Player(),
    new Fighter(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2),
    new PhysicsBody(),
    new Stunnable(),
    new Jumping(),
    new Bashing(),
    new Dashing(),
    new Deflecting(),
    new Striking(),
    new Shardable(),
    new Comboable(),
    new Renderable(),
    new Ai(),
    new HitHighlightRender(),
    new HitPoints(20)
  );
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
    new Renderable(),
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

  const map = createMap();

  createPlayer(ecs);
};

function EnemyFighterSpawner() {}
