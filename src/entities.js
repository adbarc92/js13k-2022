const PLAYER_ENTITY = {};
const SWARM_ENTITY = {};
const WORLD_ENTITY = {};
const UI_ENTITY = {};

export const createEnemyWarrior = () => {
  return {};
};

export const getPlayerEntity = () => {
  return PLAYER_ENTITY;
};

export const getSwarmEntity = () => {
  return SWARM_ENTITY;
};

export const getWorldEntity = () => {
  return WORLD_ENTITY;
};

export const getUiEntity = () => {
  return UI_ENTITY;
};

/**
 * @param {import('./ecs.js').ECS} ecs
 */
export const newGame = (ecs) => {
  ecs.reset();
};
