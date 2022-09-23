import { draw } from '../draw';

const testShapes = (draw) => {
  // document.getElementById('div').appendChild(canvas);
  draw.drawRect(100, 100, 25, 25, 'red', true);
  draw.drawRect(250, 100, 25, 25, 'blue', true);

  draw.drawRect(175, 175, 25, 25, 'black', true);

  draw.drawCircle(50, 50, 5, 'green', false, 100);
  draw.drawCircle(200, 200, 5, 'blue', false, 100);
  draw.drawCircle(250, 250, 5, 'black', true, 75);
  draw.drawCircle(300, 300, 5, 'gray', true, 750);

  for (let i = 0; i < 100; i++) {
    draw.drawCircle(20 + i * 10, 125, 5, 'brown', false, i);
  }
};

const testLines = (draw) => {
  draw.drawLine(200, 100, 300, 400, 'blue', 5);
};

const testText = (draw) => {
  draw.drawText('Hello World', 100, 100, {});
  draw.drawText('Hello World', 100, 100, { font: 'Helvetica', size: '48' });
};

export const testDraw = async () => {
  console.log('Testing draw...');
  // Test constructor values
  await draw.init();
  // Test init - canvas size, image loading, sprite loading
  // Draw images
  for (const imgName in draw.images) {
    const img = draw.images[imgName];
    const [x, y] = draw.centerImageCoords(img);
    draw.ctx?.drawImage(img, x, y);
    await new Promise((resolve) => {
      setTimeout(() => {
        draw.clear();
        resolve();
      }, 3000);
    });
  }

  for (const spriteName in draw.sprites) {
    const sprite = draw.getSprite(spriteName);
    const [x, y] = draw.centerSpriteCoords(sprite);
    draw.drawSprite(sprite, x, y, 5);
    await new Promise((resolve) => {
      setTimeout(() => {
        draw.clear();
        resolve();
      }, 1500);
    });
  }

  testShapes(draw);
  draw.clear();
  testLines(draw);
  draw.clear();
  testText(draw);
  draw.clear();

  // Change opacity
  // Draw sprites with varying opacity.
  // Draw sprites with varying rotation.

  console.log('Draw test complete.');
};
