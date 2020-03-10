import { Sprite, SpriteSheetGeneratorOption, GeneratedSpriteSheet, Rect, FormatFunc, Vector2, LooseImageHashMap } from "./types";
import { nextPow2 } from "./utils";
import Formatter from "./formatters";
import convertImageToSprite from "./imageToSprite";

const DEFAULT_PADDING = 2;
const DEFAULT_BORDER = 0;
const DEFAULT_FORCE_POT = false;

export default class SpriteSheetGenerator {

  _padding: number
  _border: number
  _formatter: FormatFunc = Formatter["pixi"];
  _forcePOT: boolean
  _placedSprites: Sprite[] = [];

  /**
   * @param options
   */
  constructor(
    options: SpriteSheetGeneratorOption
  ) {
    this._padding = (options.padding != null) ? options.padding : DEFAULT_PADDING;
    this._border = options.border || DEFAULT_BORDER;
    if (options.formatter) this.formatter = options.formatter;
    this._forcePOT = (options.forcePOT === true) || DEFAULT_FORCE_POT;
  }

  /**
   * Generate and return spritesheet.
   *
   * @param imageList
   * @returns spritesheet data
   */
  async create(
    imageList: LooseImageHashMap
  ): Promise<GeneratedSpriteSheet> {
    let sprites = await Promise.all(Object.keys(imageList).map((imgKey) => {
      return convertImageToSprite(imgKey, imageList[imgKey]);
    }));
    sprites = sprites.filter(s => (s != null));

    const ssData = this.arrangeSprites(sprites);
    return Promise.resolve({
      image: this.drawSpritesheet(...ssData),
      data: this._formatter(...ssData),
    });
  }

  /**
   * Arrange sprite positions.
   *
   * @param  sprites List of sprites to rearrange
   * @returns Array of ss data: [SpriteList, widthOfSheet, heightOfSheet]
   */
  arrangeSprites(
    sprites: Sprite[]
  ): [Sprite[], number, number] {
    const innerPadding = this._padding;
    const borderPadding = this._border;

    let fullWidth = borderPadding;
    let fullHeight = borderPadding;
    let nextX = borderPadding;
    let nextY = borderPadding;

    this._placedSprites.length = 0;

    // Sort by height (descending order)
    sprites.sort((a, b) => b.height - a.height);

    sprites.forEach((sprite, i) => {
      if (i === 0) {
        // First sprite
        sprite.x = nextX;
        sprite.y = nextY;
        nextX += sprite.width + innerPadding;
      } else {
        const placeablePosition = this._placable(sprite, fullWidth, fullHeight);
        if (placeablePosition) {
          let pp = placeablePosition as Vector2
          sprite.x = pp.x;
          sprite.y = pp.y;
        } else {
          if (fullHeight < nextX + sprite.width) {
            // Go to next row
            nextY = fullHeight;
            nextX = borderPadding;
          }
          sprite.x = nextX;
          sprite.y = nextY;
          nextX += sprite.width + innerPadding;
        }
      }

      fullWidth = Math.max(fullWidth, sprite.x + sprite.width + innerPadding);
      fullHeight = Math.max(fullHeight, sprite.y + sprite.height + innerPadding);
      this._placedSprites.push(sprite)
    });

    const tempWidth = fullWidth - innerPadding + borderPadding;
    const tempHeight = fullHeight - innerPadding + borderPadding;
    return [
      this._placedSprites.slice(0),
      (this._forcePOT) ? nextPow2(tempWidth) : tempWidth,
      (this._forcePOT) ? nextPow2(tempHeight) : tempHeight
    ];
  }

  /**
   * Create and draw spritesheet into canvas and return it.
   * TODO: use cached canvas if necessary
   *
   * @param sprites
   * @param width
   * @param height
   * @returns Newly created canvas element
   */
  drawSpritesheet(
    sprites: Sprite[],
    width: number,
    height: number
  ): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    canvas.width = width;
    canvas.height = height;

    sprites.forEach((s) => {
      ctx.drawImage(s.image, s.x, s.y, s.width, s.height);
    });

    return canvas;
  }

  /**
   * Check whether specified rect is able to mount within the specified range.
   *
   * @private
   * @param  rect
   * @param  maxWidth Max width of the testing area
   * @param  maxHeight Max height of the testing area
   * @returns Vec2 if placable, unless false
   */
  _placable(
    rect: Rect,
    maxWidth: number,
    maxHeight: number
  ): false | Vector2 {
    const padding = this._padding;
    for (let x = 0; x < maxWidth; x += padding) {
      for (let y = 0; y < maxHeight; y += padding) {
        if (!this._checkCollision(rect, x, y)) {
          return {
            x: x,
            y: y,
          }
        }
      }
    }
    return false;
  }

  /**
   *
   * @param rect
   * @param x
   * @param y
   */
  _checkCollision(
    rect: Rect,
    x: number,
    y: number
  ): boolean {
    const padding = this._padding;
    const placedSprites = this._placedSprites;
    for (let i = 0, len = placedSprites.length; i < len; i++) {
      const s = placedSprites[i];

      if (!(s.x + s.width + padding < x
        || s.x > x + rect.width + padding
        || s.y + s.height + padding < y
        || s.y > y + rect.height + padding
      )) {
        return true;
      }
    }

    // Collides with all sprites...
    return false;
  }

  /**
   * @property formatter
   * Sets your own ss-data formatter.
   * Only "pixi" is available for string option currently.
   */
  set formatter(f: string | FormatFunc) {
    if (typeof f === 'string') {
      f = Formatter[f];
      if (!f) {
        // error
        return;
      }
      this._formatter = f as FormatFunc;
    } else if (typeof f === 'function') {
      this._formatter = f;
    } else {
      // not string nor function
      return;
    }
  }
}