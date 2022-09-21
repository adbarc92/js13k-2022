/**
 * @typedef {object} DrawTextParams
 * @property {string} [font]
 * @property {string} [color]
 * @property {number} [size]
 * @property {string} [align]
 * @property {string} [strokeColor]
 */

/*
A sprite consists of its sheet, its X location on that sheet, its Y location on
the sheet, its width, and its height.
*/
/** @typedef {[HTMLCanvasElement, number, number, number, number]} Sprite */

const IMAGE_FILES = ['sprites-1.png'];

export const colors = {
  WHITE: '#F8F8F8',
  BLACK: '#111',
  GREY: '#8D87A2',
  //   BLUE: '#42CAFD',
  RED: '#E1534A',
  //   YELLOW: '#FFCE00',
  GREEN: '#71AA34',
  //   PURPLE: '#8E478C',
};

/** @type {DrawTextParams} */
const DEFAULT_TEXT_PARAMS = {
  font: 'monospace',
  color: colors.WHITE,
  size: 14,
  align: 'center',
  strokeColor: colors.BLACK,
};

export const SCREEN_HEIGHT = 512 * 1.5;
export const SCREEN_WIDTH = 683 * 1.5;
const SPRITE_SIZE = 16;

export const ANIMATIONS = {
  /* Animations consist of tuples with the first corresponding to the spritesheet index
  and the second corresponding to how long it should be on screen.
  */
  SWORD_ANIMATIONS: {
    STANDING: [[0], [Infinity]],
    WALKING: [
      [1, 500],
      [2, 500],
    ],
    DASHING: [
      [3, 250],
      [8, 500],
    ],
    DEFLECTING: [
      [9, 250],
      [10, 500],
      [11, 500],
    ],
    SLASH_DOWN: [
      [24, 250],
      [25, 250],
      [26, 250],
      [27, 250],
    ],
    SLASH_UP: [
      [16, 250],
      [17, 250],
      [18, 250],
      [19, 250],
    ],
    JUMP: [[32, Infinity]],
    JUMP_DOUBLE: [[33, Infinity]],
    LAND: [
      [34, 250],
      [35, 250],
    ],
  },
};

class Draw {
  /** @type {HTMLCanvasElement | null} */
  constructor() {
    this.sprites = {};
    this.images = {};
    this.height = 0;
    this.width = 0;
    [this.canvas, this.ctx] = this.createCanvas(
      'canv',
      this.width,
      this.height
    );
    this.fm = 1;
  }

  /** */
  createCanvas(id, w, h) {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('id', id);
    canvas.setAttribute('width', w);
    canvas.setAttribute('height', h);
    return [canvas, canvas.getContext('2d')];
  }

  /** */
  handleResize() {
    this.canvas.height = SCREEN_HEIGHT;
    this.canvas.width = SCREEN_WIDTH;
  }

  /**
   * Resizes the canvas, loads the images, and creates sprites.
   */
  async init() {
    this.handleResize();
    document.getElementById('canvasDiv')?.appendChild(this.canvas);
    // const imgs = await this.loadImages();
    const imgName = 'sprites';
    const img = (this.images[imgName] = await this.loadImage(
      imgName,
      'res/sprites-1.png'
    ));
    this.loadSprites(img, SPRITE_SIZE, SPRITE_SIZE);
  }

  /**
   * @param {number} n
   */
  setOpacity(n) {
    this.ctx.globalAlpha = n;
  }

  /**
   * @param {CanvasRenderingContext2D} [ctx]
   */
  clear(ctx) {
    ctx = ctx ?? this.ctx;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  /**
   * @param {string} spriteName
   * @returns {Sprite}
   */
  getSprite(spriteName) {
    return this.sprites[spriteName];
  }

  /**
   * @param {string} sprite
   * @param {number} x
   * @param {number} y
   * @param {number} [rotation]
   * @param {number} [scale]
   * @param {CanvasRenderingContext2D} [ctx]
   */
  drawSprite(sprite, x, y, rotation, scale) {
    scale = scale || 1;
    rotation = rotation || 0;
    const [sprImg, sprX, sprY, sprW, sprH] = sprite;
    this.ctx?.save();
    // this.ctx.translate(x, y);
    // this.ctx?.rotate((rotation * Math.PI) / 180);
    // this.ctx?.scale(scale, scale);

    this.ctx?.drawImage(sprImg, sprX, sprY, sprW, sprH, x, y, sprW, sprH);
    this.ctx?.restore();
  }

  /**
   * @param {HTMLImageElement | HTMLCanvasElement} img
   * @param {number} x
   * @param {number} y
   * @param {number} w
   * @param {number} h
   * @returns {Sprite}
   */
  createSprite(img, x, y, w, h) {
    const [canvas, ctx] = this.createCanvas('', w, h);
    ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
    return [canvas, 0, 0, w, h];
  }

  /**
   * @param {Sprite} sprite
   * @returns {Sprite}
   */
  createFlippedSprite(sprite) {
    const [i, , , w, h] = sprite;
    const [canvas, ctx] = this.createCanvas('', w, h);
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(i, 0, 0);
    return [canvas, 0, 0, w, h];
  }

  /**
   * @param {Sprite} sprite
   * @param {number} inversion
   * @returns {Sprite}
   */
  createInvertedSprite(sprite, inversion) {
    const [i, x, y, w, h] = sprite;
    const [canvas, ctx] = this.createCanvas('', w, h);
    ctx.filter = `invert(${inversion.toString()}%)`;
    ctx.drawImage(i, x, y, w, h, 0, 0, w, h);
    return [canvas, 0, 0, w, h];
  }

  /**
   * Creates flipped and inverted variants for a given sprite.
   */
  createSpriteVariants(sprite, n) {
    const newSpriteF = (this.sprites[`spr_${n}_f`] =
      this.createFlippedSprite(sprite));
    ['_h', '_e_h', '_e_a', '_e'].forEach((prefix, i) => {
      this.sprites[`spr_${n}${prefix}`] = this.createInvertedSprite(
        sprite,
        (i + 1) * 25
      );
      this.sprites[`spr_${n}${prefix}_f`] = this.createInvertedSprite(
        newSpriteF,
        (i + 1) * 25
      );
    });

    // this.sprites[`spr_${n}_e`] = this.createInvertedSprite(newSprite, 100);
    // this.sprites[`spr_${n}_e_f`] = this.createInvertedSprite(newSpriteF, 100);
    // this.sprites[`spr_${n}_e_a`] = this.createInvertedSprite(newSprite, 75);
    // this.sprites[`spr_${n}_e_f_a`] = this.createInvertedSprite(newSpriteF, 75);
    // this.sprites[`spr_${n}_e_h`] = this.createInvertedSprite(newSprite, 50);
    // this.sprites[`spr_${n}_e_f_h`] = this.createInvertedSprite(newSpriteF, 50);
    // this.sprites[`spr_${n}_h`] = this.createInvertedSprite(newSprite, 25);
    // this.sprites[`spr_${n}_f_h`] = this.createInvertedSprite(newSpriteF, 25);
  }

  /**
   * @returns Promise<HTMLImageElement[]>
   */
  loadImages() {
    const imgPromises = [];
    for (const imgFile of IMAGE_FILES) {
      imgPromises.push(this.loadImage(imgFile, `res/${imgFile}`));
    }
    return Promise.all(imgPromises);
  }

  /**
   * @returns Promise<HTMLImageElement>
   */
  loadImage(imageName, imagePath) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        this.images[imageName] = img;
        resolve(img);
      };
      img.src = imagePath;
    });
  }

  /**
   * @returns {Sprite}
   */
  loadSprites(img, spriteHeight, spriteWidth) {
    let n = 0;
    for (let y = 0; y < img.height; y += spriteHeight) {
      for (let x = 0; x < img.width; x += spriteWidth) {
        const newSprite = (this.sprites[`spr_${n}`] = this.createSprite(
          img,
          x,
          y,
          spriteWidth,
          spriteHeight
        ));
        this.createSpriteVariants(newSprite, n);
        n += 1;
      }
    }
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} w
   * @param {number} h
   * @param {string} color
   * @param {string} [stroke]
   * @param {CanvasRenderingContext2D} [ctx]
   */
  drawRect(x, y, w, h, color, stroke, ctx) {}

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} r
   * @param {string} color
   * @param {number} [pct]
   * @param {CanvasRenderingContext2D} [ctx]
   */
  drawCircle(x, y, r, color, pct, ctx) {}

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} x2
   * @param {number} y2
   * @param {string} color
   * @param {number} [width]
   * @param {CanvasRenderingContext2D} [ctx]
   */
  drawLine(x, y, x2, y2, color, width, ctx) {}

  /**
   * @param {string} text
   * @param {number} x
   * @param {number} y
   * @param {Partial<DrawTextParams>} [textParams]
   * @param {CanvasRenderingContext2D} [ctx]
   */
  drawText(text, x, y, textParams, ctx) {}

  centerImageCoords(img) {
    return [
      Math.floor(this.canvas.width / 2) - Math.floor(img.width / 2),
      Math.floor(this.canvas.height / 2) - Math.floor(img.height / 2),
    ];
  }

  centerSpriteCoords(sprite) {
    const [, , , width, height] = sprite;
    return this.centerImageCoords({ width, height });
  }

  // scaleSprite(sprite, scale) {
  //   const [img, sprX, sprY, sprW, sprH] = sprite;
  //   const w = sprW * scale;
  //   const h = sprH * scale;
  // }
}

export const draw = new Draw();
