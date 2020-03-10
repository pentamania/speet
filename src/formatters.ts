import { Sprite, FormatFunc } from "./types"
const defaultFormatters: { [k: string]: FormatFunc } = {}

export const toPixiSpritesheetData: FormatFunc = function(
  spriteList: Sprite[],
  ssWidth?: number,
  ssHeight?: number
): object {
  const frames: { [k: string]: any } = {};
  return {
    frames: spriteList.reduce((acc, sprite)=> {
      acc[sprite.key] = {
        "frame": { "x": sprite.x, "y": sprite.y, "w": sprite.width, "h": sprite.height },
        "rotated": false,
        "trimmed": false,
        "spriteSourceSize": { "x": sprite.x, "y": sprite.y, "w": sprite.width, "h": sprite.height },
        "sourceSize": { "w": sprite.width, "h": sprite.height },
        "pivot": { "x": 0, "y": 0 } // not used ?
      };
      return acc;
    }, frames),
    meta: {
      scale: 1, // pixi上で実際に使われるのはこれだけ？
      size: { w: ssWidth, h: ssHeight },
    }
  };
}
defaultFormatters["pixi"] = toPixiSpritesheetData

export default defaultFormatters