// const adapter = require("libs/adapter.js")
require("libs/tt-adapter.js")

const { init, setImagePath, TileEngine, GameLoop, Sprite, load, SpriteSheet, Scene, Animation, initPointer } = require("./libs/kontra.js");

const { canvas, context } = init();

context.fillStyle = '#aaa';
context.fillRect(0, 0, 100, 100);

const sprite = Sprite({
  x: 100,
  y: 200,
  width: 20,
  height: 40,
  color: 'red'
});

const scene = Scene({
  id: 'game',
  objects: [sprite]
});

scene.render();