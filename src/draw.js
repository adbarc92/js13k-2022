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

export const SCREEN_HEIGHT = 512 * 1.5;
export const SCREEN_WIDTH = 683 * 1.5;

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

class Draw {
  /** @type {HTMLCanvasElement | null} */
  constructor() {
    this.canvas = this.createCanvas('canv', SCREEN_WIDTH, SCREEN_HEIGHT);
    this.ctx = this.canvas.getContext('2d');
    this.sprites = {};
  }

  /**
   * @param {string} spriteName
   * @returns {Sprite}
   */
  getSprite = (spriteName) => this.sprites[spriteName];

  createCanvas(id, w, h) {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('id', id);
    canvas.setAttribute('width', w);
    canvas.setAttribute('height', h);
  }

  getCanvas(id) {
    return (
      document.getElementById(id) ||
      this.createCanvas(id, SCREEN_WIDTH, SCREEN_HEIGHT)
    );
  }

  /**
   * @returns {CanvasRenderingContext2D}
   */
  getCtx(id) {
    return this.getCanvas(id).getContext('2d');
  }

  handleResize(w, h) {}

  async init() {}

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
  getSprite(spriteName) {}

  /**
   * @param {string} sprite
   * @param {number} x
   * @param {number} y
   * @param {number} [rotation]
   * @param {number} [scale]
   * @param {CanvasRenderingContext2D} [ctx]
   */
  drawSprite(sprite, x, y, rotation, scale, ctx) {}

  /**
   * @param {HTMLImageElement | HTMLCanvasElement} img
   * @param {number} x
   * @param {number} y
   * @param {number} w
   * @param {number} h
   * @returns {Sprite}
   */
  createSprite(img, x, y, w, h) {}

  /**
   * @param {Sprite} sprite
   * @returns {Sprite}
   */
  createFlippedSprite(sprite) {}

  /**
   * @param {Sprite} sprite
   * @param {number} inversion
   * @returns {Sprite}
   */
  createInvertedSprite(sprite, inversion) {}

  /**
   * @returns Promise<HTMLImageElement>
   */
  loadImage(imageName, imagePath) {}

  /**
   * @returns {Sprite}
   */
  loadSprites(img, spriteSize) {}

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
}

export const draw = new Draw();
