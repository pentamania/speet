export type VariousImage = string | HTMLImageElement | HTMLCanvasElement
export type FormatFunc = ((sprites: Sprite[], ssWidth?: number, ssHeight?: number) => any)
export type Vector2 = { x: number, y: number }
export type LooseImageHashMap = {
  [k: string]: VariousImage
  // [k in string | number]: VariousImage
}

export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

export interface Sprite extends Rect {
  key: string
  image: HTMLImageElement | HTMLCanvasElement
}

export interface SpriteSheetGeneratorOption {
  padding?: number
  border?: number
  forcePOT?: boolean
  formatter?: string | FormatFunc
}

// REVIEW：キー名変えるかも？
export interface GeneratedSpriteSheet {
  image: HTMLCanvasElement
  data: any
}