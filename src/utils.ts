
/**
 * check whether the object is <canvas>
 * @param {any} obj
 */
export function isCanvas(obj: any) {
  return obj instanceof HTMLCanvasElement;
}

/**
 * check whether the object is <image>
 * @param {any} obj
 */
export function isImage(obj: any) {
  return obj instanceof HTMLImageElement;
}

/**
 * Image loading util function
 *
 * @param  {string} src image src
 * @return {Promise<HTMLImageElement>}
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject)=> {
    var img = new Image();

    // For some reason, onload is not fired in old iOS safari when crossOrigin is set
    // img.crossOrigin = "Anonymous";

    img.onload = function() {
      resolve(img);
    };
    img.src = src;
    img.onerror = reject;
  });
}

/**
 * Returns the POT number next to specified value.
 * When the specifed value is equal to border POT number, it will return the value itself
 *
 * @example
 * console.log(nextPow2(3)); // => 4
 * console.log(nextPow2(4)); // => 4
 * console.log(nextPow2(5)); // => 8
 *
 * @param n
 * @return POT number
 */
export function nextPow2(n: number) {
  const binaryDigit = Math.round(Math.max(0, n)).toString(2).length;
  if (n === Math.pow(2, binaryDigit-1)) {
    return n;
  } else {
    return Math.pow(2, binaryDigit);
  }
}

// /**
//  * Prints a warning in the console if it exists.
//  *
//  * @param message
//  */
// export function warning(message: string): void {
//   if (typeof console !== 'undefined' && typeof console.error === 'function') {
//     console.warn(message)
//   }
// }