


export const get = (ecs) => {
  return [
    new Input(ecs),
    new EnemySpawner(ecs),
    new DistributeDeathShards(ecs),
    new Stunning(ecs),
    new EnemyAI(ecs), //swordsman AI
    // new Dashing(ecs),
    // new Deflection(ecs),
    // new Bashing(ecs),
    // new Striking(ecs),
    // new Jumping(ecs),
    // new Movement(ecs),
    new AttackingHighlightFlipper(ecs),
    new ActionResolver(ecs),
    new HitHightlightFlipper(ecs),
    new RenderActors(ecs),
    new RenderUi(ecs),
    new LimitedLifetimeUpdater(ecs),
    new HitPointUpdater(ecs),
  ];
};
