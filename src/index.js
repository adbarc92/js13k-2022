import { getComponents } from './components.js';
import { newGame } from './entities.js';
import { getSystems } from './systems.js';
import { ecs } from './ecs.js';
import { draw } from './draw.js';

console.debug('index.js loaded');
const EXPECTED_FS = 10;
const LOOP_INTERVAL = 16;

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

  setInterval(_loop, LOOP_INTERVAL);
};

export const start = () => {
  console.debug('App start!');
  ecs.register(...getComponents(ecs));
  ecs.process(...getSystems(ecs));

  // newGame(ecs);
  // loop();
};

window.addEventListener('load', async () => {
  // await draw.init();

  window.addEventListener('resize', () => {
    // draw.handleResize();
  });
  window.draw = draw;
  console.debug('App loaded.');

  start();
});
