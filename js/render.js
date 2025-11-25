globalThis.canvas = adapter.createCanvas();

const windowInfo = adapter.getWindowInfo ? adapter.getWindowInfo() : adapter.getSystemInfoSync();

canvas.width = windowInfo.screenWidth;
canvas.height = windowInfo.screenHeight;

export const SCREEN_WIDTH = windowInfo.screenWidth;
export const SCREEN_HEIGHT = windowInfo.screenHeight;