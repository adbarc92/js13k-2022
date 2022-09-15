// TODO: check usage of semicolons after functions

// @ts-check

/**
 * @typedef {object} DrawTextParams
 * @property {string} [font]
 * @property {string} [color]
 * @property {number} [size]
 * @property {string} [align]
 * @property {string} [strokeColor]
 */

/** @typedef {[HTMLCanvasElement, number, number, number, number]} Sprite */

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

const SWORD_RED = 0;
const SWORD_GREEN = 0;
const SWORD_BLUE = 0;

export const SCREEN_HEIGHT = 512 * 1.5;
export const SCREEN_WIDTH = 683 * 1.5;

// const enum FighterAnimations {
//   STANDING = 'STANDING',
//   WALKING = 'WALKING',
//   DASHING = 'DASHING',
//   DEFLECTING = 'DEFLECTING',
//   SLASH_UP = 'SLASH_UP',
//   SLASH_DOWN = 'SLASH_DOWN',
//   JUMP = 'JUMP',
//   JUMP_DOUBLE = 'JUMP_DOUBLE',
//   LAND = 'LAND',
// }

// Hitbox requires X, Y, width, height
// Animations require the sprite, its duration, the sound to be played, the associated hitboxes

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

/** @type {HTMLCanvasElement | null} */
let canvas;
const images = {};
const sprites = {};

/**
 * @param {string} spriteName
 * @returns {Sprite}
 */
const getSprite = (spriteName) => sprites[spriteName];

class Draw {
  /** @type {HTMLCanvasElement | null} */
  canvas;
  images = {};
  sprites = {};
  width = 0;
  height = 0;
  fm = 1; // frame multiplier, updated every frame
  colors = colors;
  enabled = true;

  createCanvas = (id, w, h) => {
    const canvas = document.createElement('canvas');
    canvas.id = id;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    //@ts-ignore
    ctx.imageSmoothingEnabled = false;
    //@ts-ignore
    return [canvas, ctx];
  };

  /**
   * @returns {CanvasRenderingContext2D}
   */
  getCtx() {
    //@ts-ignore
    return canvas.getContext('2d');
  }

  handleResize() {
    if (canvas) {
      canvas.width = this.width = SCREEN_WIDTH;
      canvas.height = this.height = SCREEN_HEIGHT;
      this.getCtx().imageSmoothingEnabled = false;
    }
  }

  async init() {
    const [c] = this.createCanvas('canv', this.width, this.height);
    canvas = c;
    this.handleResize();
    document.getElementById('canvasDiv')?.appendChild(canvas);
    const img = await this.loadImage('sprites', 'res/packed.png');
    const imgSize = img.width;
    const spriteSize = 16;
    this.sprites = this.loadSprites(img, spriteSize);
  }

  /**
   * @param {number} n
   */
  setOpacity(n) {
    this.getCtx().globalAlpha = n;
  }

  /**
   * @param {CanvasRenderingContext2D} [ctx]
   */
  clear(ctx) {
    ctx = ctx ?? this.getCtx();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  /**
   * @param {string} spriteName
   * @returns {Sprite}
   */
  getSprite = (spriteName) => sprites[spriteName];

  /**
   * @param {string} sprite
   * @param {number} x
   * @param {number} y
   * @param {number} [rotation]
   * @param {number} [scale]
   * @param {CanvasRenderingContext2D} [ctx]
   */
  drawSprite(sprite, x, y, rotation, scale, ctx) {
    if (!this.enabled) {
      return;
    }

    scale = scale || 1;
    ctx = ctx ?? this.getCtx();
    ctx.save();
    const spriteObj = getSprite(sprite);
    rotation = rotation || 0;
    const [image, sprX, sprY, sprW, sprH] = spriteObj;
    const w = sprW * scale;
    const h = sprH * scale;

    x -= w / 2;
    y -= w / 2;
    ctx.translate(x, y);
    ctx.translate(w / 2, h / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    x = -w / 2;
    y = -h / 2;

    ctx.drawImage(
      image,
      sprX,
      sprY,
      sprW,
      sprH,
      x,
      y,
      sprW * scale,
      sprH * scale
    );
    ctx.restore();
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
    const [c, , , w, h] = sprite;
    const [canvas, ctx] = this.createCanvas('', w, h);
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(c, 0, 0);
    return [canvas, 0, 0, w, h];
  }

  /**
   * @param {Sprite} sprite
   * @param {number} inversion
   * @returns {Sprite}
   */
  createInvertedSprite(sprite, inversion) {
    const [c, , , w, h] = sprite;
    const [canvas, ctx] = this.createCanvas('', w, h);
    ctx.filter = `invert(${inversion.toString()}%)`;
    // ctx.filter = 'invert(' + inversion.toString() + ')';
    ctx.drawImage(c, 0, 0);
    return [canvas, 0, 0, w, h];
  }

  /**
   * @returns Promise<HTMLImageElement>
   */
  loadImage = (imageName, imagePath) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        images[imageName] = img;
        resolve(img);
      };
      img.src = imagePath;
    });
  };

  /**
   * @returns {Sprite}
   */
  loadSprites(img, spriteSize) {
    console.log('Loading sprites...');
    const imgSize = img.width;
    const spritesPerImage = imgSize / spriteSize;
    const sprites = {};
    let n = 0;
    for (let i = 0; i < spritesPerImage; i++) {
      for (let j = 0; j < spritesPerImage; j++) {
        const sprite = this.createSprite(
          img,
          j * spriteSize,
          i * spriteSize,
          spriteSize,
          spriteSize
        );
        sprites['spr_' + n] = sprite;
        const fSprite = (sprites['spr_' + n + '_f'] =
          this.createFlippedSprite(sprite));
        sprites['spr_' + n + '_h'] = this.createInvertedSprite(sprite, 50);
        sprites['spr_' + n + '_f_h'] = this.createInvertedSprite(fSprite, 50);
        sprites['spr_' + n + '_f_a'] = this.createInvertedSprite(fSprite, 50);
        sprites['spr_e_' + n + '_h'] = this.createInvertedSprite(sprite, 25);
        sprites['spr_e_' + n] = this.createInvertedSprite(sprite, 100);
        sprites['spr_e_' + n + '_f'] = this.createInvertedSprite(fSprite, 100);
        sprites['spr_e_' + n + '_f_h'] = this.createInvertedSprite(fSprite, 25);
        sprites['spr_e_' + n + '_f_a'] = this.createInvertedSprite(fSprite, 75);
        sprites['spr_e_' + n + '_a'] = this.createInvertedSprite(sprite, 75);
        sprites['spr_e_' + n + '_f_a'] = this.createInvertedSprite(fSprite, 75);
        n++;
      }
    }
    console.log('Sprites loaded.');
    return sprites;
  }

  // loadHitBody(spriteCanvas, spriteCtx) {
  //   const hitBody = [];
  //   const hitSword = [];
  //   const imgData = spriteCtx.getImageData(
  //     0,
  //     0,
  //     spriteCanvas.width,
  //     spriteCanvas.height
  //   );
  //   let x = 0,
  //     y = 0;
  //   for (let i = 0; i < imgData.length; i += 4) {
  //     if (
  //       imgData[i] === SWORD_RED &&
  //       imgData[i + 1] === SWORD_BLUE &&
  //       imgData[i + 2] === SWORD_GREEN
  //     ) {
  //       hitSword.push(x, y);
  //     } else if (imgData[i]) {
  //       hitBody.push(x, y);
  //     }
  //     if (x + 1 === spriteCanvas.width) {
  //       x = 0;
  //       y += 1;
  //     } else {
  //       x += 1;
  //     }
  //   }
  //   return [hitBody, hitSword];
  // }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} w
   * @param {number} h
   * @param {string} color
   * @param {string} [stroke]
   * @param {CanvasRenderingContext2D} [ctx]
   */
  drawRect(x, y, w, h, color, stroke, ctx) {
    ctx = ctx ?? this.getCtx();
    if (stroke) {
      w -= ctx.lineWidth / 2;
      h -= ctx.lineWidth / 2;
    }

    ctx[stroke ? 'strokeStyle' : 'fillStyle'] = color;
    ctx[stroke ? 'strokeRect' : 'fillRect'](x, y, w, h);
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} r
   * @param {string} color
   * @param {number} [pct]
   * @param {CanvasRenderingContext2D} [ctx]
   */
  drawCircle(x, y, r, color, pct, ctx) {
    ctx = ctx ?? this.getCtx();
    ctx.beginPath();
    ctx.arc(x, y, r, 0 - Math.PI / 2, 2 * Math.PI * (pct ?? 1) - Math.PI / 2);
    ctx.fillStyle = color;
    ctx.fill();
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} x2
   * @param {number} y2
   * @param {string} color
   * @param {number} [width]
   * @param {CanvasRenderingContext2D} [ctx]
   */
  drawLine(x, y, x2, y2, color, width, ctx) {
    width = width ?? 1;
    ctx = ctx ?? this.getCtx();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  /**
   * @param {string} text
   * @param {number} x
   * @param {number} y
   * @param {Partial<DrawTextParams>} [textParams]
   * @param {CanvasRenderingContext2D} [ctx]
   */
  drawText(text, x, y, textParams, ctx) {
    const { font, size, color, align, strokeColor } = {
      ...DEFAULT_TEXT_PARAMS,
      ...(textParams ?? {}),
    };
    ctx = ctx ?? this.getCtx();
    ctx.font = `${size}px ${font}`;
    // @ts-ignore
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';
    if (strokeColor) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 4;
      ctx.strokeText(text, x, y);
    }

    // @ts-ignore
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
  }
}

export const draw = new Draw();
