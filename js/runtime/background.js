import TileEngine from '../base/tileEngine';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../render';

const TILESET_IMAGE_SRC = 'images/output_tileset.png';
const TILE_WIDTH = 20;
const TILE_HEIGHT = 20;

// 计算地图的尺寸（以图块为单位）
const MAP_WIDTH_IN_TILES = Math.ceil(SCREEN_WIDTH / TILE_WIDTH);
const MAP_HEIGHT_IN_TILES = Math.ceil(SCREEN_HEIGHT / TILE_HEIGHT);

const randomTile = (tiles, num) => new Array(num).fill(0).map(() => tiles[Math.floor(Math.random() * tiles.length)])

// 使用前4个图块创建一个简单的随机图案
const mapData = randomTile([67,198],MAP_WIDTH_IN_TILES*MAP_HEIGHT_IN_TILES);
/**
 * 游戏背景类
 * 继承自 TileEngine，用于渲染静态背景
 */
export default class BackGround extends TileEngine {
  constructor() {
    super({
      tileWidth: TILE_WIDTH,
      tileHeight: TILE_HEIGHT,
      width: MAP_WIDTH_IN_TILES,
      height: MAP_HEIGHT_IN_TILES,
    });

    this.addLayers({
      name: 'background',
      data: mapData,
    });

    this.addTilesets({
      firstGrid: 1,
      image: TILESET_IMAGE_SRC,
    }).then(() => {
      this.preRenderImage();
    });
  }

  // 背景是静态的，所以 update 方法为空
  update() {}
}
