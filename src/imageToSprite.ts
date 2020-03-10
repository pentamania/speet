import { Sprite, VariousImage } from "./types";
import { loadImage, isCanvas, isImage } from "./utils";

/**
 * Initialize sprite
 * @param key
 * @param img
 */
function _initSprite(
  key: string,
  img: HTMLImageElement | HTMLCanvasElement
): Sprite {
  return {
    key: key,
    image: img,
    x: 0,
    y: 0,
    get width() { return this.image.width },
    get height() { return this.image.height },
  }
}

/**
 * Load image and create sprite data object.
 * Invalid image and images failed to load are skipped.
 *
 * @param key
 * @param imgSrc
 */
export default function convertImageToSprite(
  key: string,
  imgSrc: VariousImage
): Promise<Sprite> {
  return new Promise(async (resolve) => {
    if (typeof imgSrc === 'string') {
      // is file path
      try {
        const img = await loadImage(imgSrc);
        resolve(_initSprite(key, img));
      }
      catch (e) {
        // console.warn(`[speet.js]: Failed loading image "${key}". It will be replaced with dummy image.`);
        // resolve(_initSprite(key, createDummyImage()));
        if (process.env.NODE_ENV !== 'production') {
          console.warn(`Failed loading image "${key}".`);
        }
        resolve(undefined);
      }
    } else if (isCanvas(imgSrc) || isImage(imgSrc)) {
      // is canvas or image
      resolve(_initSprite(key, imgSrc));
    } else {
      // is other
      // console.warn(`[speet.js]: Image "${key}" is not imageURL, ImageElement, nor canvas. It will be replaced with dummy image.`)
      // resolve(_initSprite(key, createDummyImage()));
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`"${key}" was not an image URL, ImageElement, nor Canvas.`)
      }
      resolve(undefined);
    }
  });
}
