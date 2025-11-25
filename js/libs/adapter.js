globalThis.adapter = typeof wx !== 'undefined' ? wx : tt;
if (!globalThis.Image) {
  globalThis.Image = () => adapter.createImage();
}

// 封装捏合（缩小）手势：两指距离减小触发
adapter.onTouchPinch = function(callback) {
  let startDist = 0; // 初始两指距离
  let isPinching = false; // 防止重复触发

  adapter.onTouchStart((e) => {
    // 仅监听两指触控
    if (e.touches.length === 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      // 计算初始距离（勾股定理简化，无需开根号，比较平方更高效）
      startDist = (t1.clientX - t2.clientX) ** 2 + (t1.clientY - t2.clientY) ** 2;
      isPinching = false;
    }
  });

  adapter.onTouchMove((e) => {
    if (e.touches.length === 2 && !isPinching) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const currDist = (t1.clientX - t2.clientX) ** 2 + (t1.clientY - t2.clientY) ** 2;
      // 距离减小超过阈值（100像素平方，避免误触）判定为捏合
      if (startDist - currDist > 100) {
        isPinching = true;
        callback && callback(e); // 触发回调并传递触摸事件对象
      }
    }
  });
};

// 封装展开（放大）手势：两指距离增大触发
adapter.onTouchExpand = function(callback) {
  let startDist = 0;
  let isExpanding = false;

  adapter.onTouchStart((e) => {
    if (e.touches.length === 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      startDist = (t1.clientX - t2.clientX) ** 2 + (t1.clientY - t2.clientY) ** 2;
      isExpanding = false;
    }
  });

  adapter.onTouchMove((e) => {
    if (e.touches.length === 2 && !isExpanding) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const currDist = (t1.clientX - t2.clientX) ** 2 + (t1.clientY - t2.clientY) ** 2;
      // 距离增大超过阈值判定为展开
      if (currDist - startDist > 100) {
        isExpanding = true;
        callback && callback(e);
      }
    }
  });
};

module.exports = adapter;