const adapter = require("libs/adapter.js")
const { init, TileEngine, GameLoop, Sprite, load, SpriteSheet, Scene } = require("./libs/kontra.js");
// const canvas = adapter.createCanvas(); 
// const ctx = canvas.getContext('2d');
const randomTile = (tiles, num) => new Array(num).fill(0).map(() => tiles[Math.floor(Math.random() * tiles.length)])
console.log(adapter)



adapter.getSystemInfo({
  success: (res) => {
    const windowWidth = res.windowWidth;
    const windowHeight = res.windowHeight;

    // 2. 创建与屏幕同尺寸的 Canvas
    const canvas = adapter.createCanvas({ type: '2d' });
    canvas.width = windowWidth;
    canvas.height = windowHeight;
    const ctx = canvas.getContext('2d');
    init(canvas);

    // 3. 加载图片后，按屏幕尺寸缩放绘制（示例：图片缩放到全屏）
    const img = new Image();
    img.src = './assets/images/mapPack_tilesheet.png';
    img.onload = () => {
        let tileEngine = TileEngine({
          canvas,
          ctx,
          // tile size
          tilewidth: 64,
          tileheight: 64,
      
          // map size in tiles
          width: 9,
          height: 9,
      
          // tileset object
          tilesets: [{
            firstgid: 1,
            image: img
          }],
      
          // layer object
          layers: [{
            name: 'ground',
            data: [ 0,  0,  0,  0,  0,  0,  0,  0,  0,
                    0,  0,  6,  7,  7,  8,  0,  0,  0,
                    0,  6,  27, 24, 24, 25, 0,  0,  0,
                    0,  23, 24, 24, 24, 26, 8,  0,  0,
                    0,  23, 24, 24, 24, 24, 26, 8,  0,
                    0,  23, 24, 24, 24, 24, 24, 25, 0,
                    0,  40, 41, 41, 10, 24, 24, 25, 0,
                    0,  0,  0,  0,  40, 41, 41, 42, 0,
                    0,  0,  0,  0,  0,  0,  0,  0,  0 ]
          }]
        });
      
        tileEngine.render();
    };
  }
});


// let img = new Image();
// img.src = './assets/images/mapPack_tilesheet.png';
// img.onload = function() {

//   let tileEngine = TileEngine({
//     adapter,
//     // tile size
//     tilewidth: 64,
//     tileheight: 64,

//     // map size in tiles
//     width: 9,
//     height: 9,

//     // tileset object
//     tilesets: [{
//       firstgid: 1,
//       image: img
//     }],

//     // layer object
//     layers: [{
//       name: 'ground',
//       data: [ 0,  0,  0,  0,  0,  0,  0,  0,  0,
//               0,  0,  6,  7,  7,  8,  0,  0,  0,
//               0,  6,  27, 24, 24, 25, 0,  0,  0,
//               0,  23, 24, 24, 24, 26, 8,  0,  0,
//               0,  23, 24, 24, 24, 24, 26, 8,  0,
//               0,  23, 24, 24, 24, 24, 24, 25, 0,
//               0,  40, 41, 41, 10, 24, 24, 25, 0,
//               0,  0,  0,  0,  40, 41, 41, 42, 0,
//               0,  0,  0,  0,  0,  0,  0,  0,  0 ]
//     }]
//   });

//   tileEngine.render();
// }





// let image = new Image();
// image.src = './assets/images/mapPack_tilesheet.png';
// image.onload = function() {
//   let spriteSheet = SpriteSheet({
//     image: image,
//     frameWidth: 72,
//     frameHeight: 97,
//     animations: {
//       // create a named animation: walk
//       walk: {
//         frames: '0..9',  // frames 0 through 9
//         frameRate: 30
//       }
//     }
//   });

//   let sprite = Sprite({
//     x: 200,
//     y: 100,

//     // use the sprite sheet animations for the sprite
//     animations: spriteSheet.animations
//   });
//   sprite.render();
// };