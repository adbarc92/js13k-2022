import { getComponents } from './components.js';
import { ecs } from './ecs.js';
import { newGame } from './entities.js';
import { getSystems } from './systems.js';
import { draw } from './draw.js';

console.log('index.js loaded');
const EXPECTED_FS = 10;

const integrate = (frameTime) => {
  draw.clear();
  ecs.update(frameTime / 1000);
};

const loop = () => {
  const startTime = performance.now();
  let prevNow = startTime;

  const _loop = () => {
    const now = performance.now();
    let frameTime = now - prevNow;
    let prevFrameTime = Math.floor(frameTime);
    prevNow = now;

    if (frameTime > 4) {
      frameTime = 4;
    }
    // while (frameTime > 0.0) {
    // const deltaTime = Math.min(frameTime, EXPECTED_FS);
    const deltaTime = frameTime;
    frameTime -= deltaTime;
    const fm = deltaTime / EXPECTED_FS;
    draw.fm = fm;
    draw.enabled = frameTime <= 0;
    integrate(deltaTime);

    // }
    draw.drawText('FS: ' + prevFrameTime, 20, 50, {
      align: 'left',
    });
    // requestAnimationFrame(_loop);
    // setTimeout(_loop, 16);
  };
  setInterval(_loop, 16);
};

export const start = () => {
  console.log('App start!');
  ecs.register(...getComponents(ecs));
  ecs.process(...getSystems(ecs));

  newGame(ecs);
  loop();
};

window.addEventListener('load', async () => {
  await draw.init();
  // await game.init();
  // db.init();

  window.addEventListener('resize', () => {
    draw.handleResize();
  });

  // window.game = game;
  //@ts-ignore
  window.draw = draw;
  console.log('app loaded');
  // game.showMenu();

  start();
});
