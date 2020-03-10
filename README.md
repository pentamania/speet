speet.js: Dynamic Spritesheet Generator for web
===

Minimum module to create spritesheet dynamically.  
Currently, it is mostly for creating [pixi.js spritesheet](https://pixijs.download/dev/docs/PIXI.Spritesheet.html).

# Install
`npm install speet`

# Usage
## Sample

### Basic
#### Traditional browser style

```html
<script src="path/to/speet.js"></script>
<script>
const imageList = {
  player: "./assets/player.png",
  enemy: "./assets/enemy.png",
}

speet.generate(imageList)
.then((ss)=> {
  console.log(ss.data); // json of sprite frame data
  document.body.appendChild(ss.image);
})
</script>
```

#### Modern ES style
```js
import {generate} from "speet";

const imageList = {
  player: "./assets/player.png",
  enemy: "./assets/enemy.png",
};

(async ()=> {
  const { image: ssImage, data: ssData } = await generate(imageList)
  console.log(ssData); // json of sprite frame data
  document.body.appendChild(ssImage);
})();
```

### Combination with pixi.js
```js
import {generate} from "speet";
function createPixiSpriteSheet(image, dataJson) {
  return new Promise((resolve)=> {
    const baseTexture = PIXI.BaseTexture.from(image);
    const ss = new PIXI.Spritesheet(baseTexture, dataJson);
    ss.parse(()=> resolve(ss))
  })
}

const imageList = {
  player: "./assets/player.png",
  enemy: "./assets/enemy.png",
};

(async ()=> {
  // pixi app
  const app = new PIXI.Application();
  document.body.appendChild(app.view);
  const interaction = app.renderer.plugins.interaction;

  // Create pixi spritesheet
  const baseSS = await speet.generate(imageList, { forcePOT: true });
  const pixiSS = await createPixiSpriteSheet(baseSS.image, baseSS.data);

  // Add sprite using spritesheet
  const spr = new PIXI.Sprite(pixiSS.textures["player"]);
  app.stage.addChild(spr);
  interaction.on('pointerdown', (e) => {
    spr.position.set(e.data.global.x, e.data.global.y)
  });
})();
```

## Setting options

```js
(async ()=> {
  const ss = await speet.generate(imageList, {
    padding: 4,
    border: 4,
    forcePOT: true,
    formatter: (sprites) => {
      return sprites.map((s)=> {
        return {
          x: s.x,
          y: s.y,
          w: s.width,
          h: s.height,
        }
      })
    }
  });
  
  console.log(ss.data); // array of objects with x, y, w, h property
})();
```

| Name | Type | Description | Default |
|-----------|----------|----------------------------------------------------------------------------------------------------------------------------------------|---------|
| padding | number | Sets padding between sprites. | 2 |
| border | number | Sets border padding at the edges of spritesheet. | 0 |
| forcePOT | boolean | Force spritesheet size to be power of two (e.g. 512x512). This option is for optimization of GPU-powered graphic system (mostly WebGL). | false |
| formatter | function | Sets your own formatting function for spritesheet data json. | undefined |

## Misc
### Supported types of image
Instead of image path string, you can also pass dataURI string, HTMLImageElement, or HTMLCanvasElement.

```js
function createCanvasRect(w, h) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = w;
  canvas.height = h;
  ctx.fillStyle = "#D93788";
  ctx.fillRect(0, 0, w, h);
  return canvas;
}

const imageList = {
  eggplant: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADcAAAAtCAMAAAA9SAOJAAAAYFBMVEUAAAAiIDRFKDxmOTGPVjvfcSbZoGbuw5r78jaZ5VBqvjA3lG5LaS9SSyQyPDk/P3QwYIJbbuFjm/9fzeTL2/z///+brbeEfodpampZVlJ2QoqsMjLZV2PXe7qPl0qKbzD7Y7zPAAAAIHRSTlMA/////////////////////////////////////////5KarXYAAACqSURBVEiJ7dOxDsMgDEVRZhg8ZXn//6F1qFAqgm2eo3bqDVOUI1tCKeXfs2prv3W15sbpk2LnybBOM+N4V6EEtGutO4XkPOBktMOIu3pcJRnhgITDHPu9JpFbIWW+W6PImUqZBOw49Gj7DrYTx9lLdha5ecPBxF/TdPyaknOPGOvkYowL2cqJxGx28hkcVywUsGKgt/J+2OW88WrL3XOYB11mykgt7R76ei8wAEus0oBkTgAAAABJRU5ErkJggg=="
  canvasRect: createCanvasRect(128, 128),
}

speet.generate(imageList)
```

# Other
Sprite packing algorithm is inspired by [bertrand_a's idea](https://www.gamedev.net/forums/topic/683912-sprite-packing-algorithm-explained-with-example-code/).
