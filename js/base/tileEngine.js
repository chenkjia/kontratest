import Emitter from '../libs/tinyemitter';

/**
 * 微信小程序的TileEngine实现
 */
export default class TileEngine extends Emitter {
  constructor(properties) {
    super();
    properties = properties || {};

    this.tileWidth = properties.tileWidth || 32;
    this.tileHeight = properties.tileHeight || 32;
    this.width = properties.width || 0;
    this.height = properties.height || 0;
    this.x = properties.x || 0;
    this.y = properties.y || 0;
    this.sx = properties.sx || 0;
    this.sy = properties.sy || 0;
    this.context = properties.context || adapter.createCanvas().getContext('2d');

    this.tilesets = [];
    this.layers = {};
    this.layerOrder = [];

    this.offscreenCanvas = adapter.createCanvas();
    this.offscreenContext = this.offscreenCanvas.getContext('2d');

    this.ready = false;
  }

  addTilesets(tilesets) {
    if (!Array.isArray(tilesets)) {
      tilesets = [tilesets];
    }

    const promises = tilesets.map(tileset => {
      return new Promise((resolve, reject) => {
        const image = adapter.createImage();
        image.src = tileset.image;
        image.onload = () => {
          const newTileset = {
            firstGrid: tileset.firstGrid,
            image: image,
            lastGrid: tileset.firstGrid + (image.width / this.tileWidth * image.height / this.tileHeight) - 1,
          };
          this.tilesets.push(newTileset);
          this.tilesets.sort((a, b) => a.firstGrid - b.firstGrid);
          resolve();
        };
        image.onerror = (err) => {
          console.error('Failed to load tileset image:', tileset.image);
          reject(err);
        }
      });
    });

    return Promise.all(promises);
  }

  addLayers(layers) {
    if (!Array.isArray(layers)) {
      layers = [layers];
    }

    layers.forEach(layer => {
      this.layers[layer.name] = {
        data: layer.data,
        render: layer.render !== false,
        zIndex: layer.zIndex || 0,
      };

      if (this.layers[layer.name].render) {
        this.layerOrder.push(layer.name);
        this.layerOrder.sort((a, b) => this.layers[a].zIndex - this.layers[b].zIndex);
      }
    });
  }

  preRenderImage() {
    this.offscreenCanvas.width = this.width * this.tileWidth;
    this.offscreenCanvas.height = this.height * this.tileHeight;

    this.layerOrder.forEach(layerName => {
      const layer = this.layers[layerName];
      if (!layer.render) return;

      for (let i = 0; i < layer.data.length; i++) {
        const tile = layer.data[i];
        if (tile === 0) continue;

        const tileset = this.getTileset(tile);
        if (!tileset) continue;

        const x = (i % this.width) * this.tileWidth;
        const y = Math.floor(i / this.width) * this.tileHeight;
        const tileOffset = tile - tileset.firstGrid;
        const tilesetWidthInTiles = tileset.image.width / this.tileWidth;
        const sx = (tileOffset % tilesetWidthInTiles) * this.tileWidth;
        const sy = Math.floor(tileOffset / tilesetWidthInTiles) * this.tileHeight;

        this.offscreenContext.drawImage(
          tileset.image,
          sx, sy, this.tileWidth, this.tileHeight,
          x, y, this.tileWidth, this.tileHeight
        );
      }
    });

    this.ready = true;
  }

  getTileset(tile) {
    return this.tilesets.find(tileset => tile >= tileset.firstGrid && tile <= tileset.lastGrid);
  }

  render(ctx) {
    if (!this.ready) return;

    const context = ctx || this.context;
    context.drawImage(
      this.offscreenCanvas,
      this.sx, this.sy, context.canvas.width, context.canvas.height,
      this.x, this.y, context.canvas.width, context.canvas.height
    );
  }

  getRow(y) {
    return Math.floor((this.sy + y) / this.tileHeight);
  }

  getCol(x) {
    return Math.floor((this.sx + x) / this.tileWidth);
  }

  layerCollidesWith(name, object) {
    const startRow = this.getRow(object.y);
    const startCol = this.getCol(object.x);
    const endRow = this.getRow(object.y + object.height);
    const endCol = this.getCol(object.x + object.width);

    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        if (r < 0 || c < 0 || r >= this.height || c >= this.width) continue;
        const index = c + r * this.width;
        if (this.layers[name].data[index]) {
          return true;
        }
      }
    }
    return false;
  }

  tileAtLayer(name, position) {
    let row, col;
    if (position.x !== undefined && position.y !== undefined) {
      row = this.getRow(position.y);
      col = this.getCol(position.x);
    } else {
      row = position.row;
      col = position.col;
    }

    if (row < 0 || col < 0 || row >= this.height || col >= this.width) {
      return undefined;
    }

    const index = col + row * this.width;
    return this.layers[name].data[index];
  }
}
