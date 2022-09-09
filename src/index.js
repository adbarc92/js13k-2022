import { get as getComponents } from './components';
import ecs from './ecs';
import { newGame } from './entities';
import { get as getSystems } from './systems';

const loop = () => {
  const startTime = performance.now();
  let prevNow = startTime;

  const _loop = () => {};
};

export const start = () => {
  ecs.register(...getComponents());
  ecs.process(...getSystems());

  newGame(ecs);
  loop();
};
