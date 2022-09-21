import { draw } from '../draw';

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

  // Change opacity
  // Draw sprites with varying opacity.
  // Draw sprites with varying rotation.

  console.log('Draw test complete.');
};
