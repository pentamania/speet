import SpriteSheetGenerator from "./Generator";
import { SpriteSheetGeneratorOption, LooseImageHashMap } from "./types";

export { SpriteSheetGenerator as Generator };

/**
 * Util static method for easy usage.
 *
 * @param  imageList Array of image string path, HTMLImage, or HTMLCanvas.
 * @param  [options] Generator initializing option
 * @return The created spritesheet object
 */
export function generate(
  imageList: LooseImageHashMap,
  options: SpriteSheetGeneratorOption = {}
) {
  const ssg = new SpriteSheetGenerator(options);
  return ssg.create(imageList);
}
