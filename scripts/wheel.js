
export const scrollSheet = () => {

  // 定义一个函数来模拟 wheel 事件
  function simulateWheelEvent(element, deltaY, deltaX) {
    var event = new WheelEvent('wheel', {
      bubbles: true,
      cancelable: true,
      deltaY: deltaY,
      deltaX: deltaX,
      clientX: 580,
      clientY: 580,
    });
    element.dispatchEvent(event);
  }

  // 持续模拟 wheel 事件
  function continuousWheelSimulation(element, interval, deltaY, deltaX) {
    setInterval(function () {
      simulateWheelEvent(element, deltaY, deltaX);
    }, interval);
  }

  // 获取 document.body 作为事件的目标元素
  // 选择所有带有 'univer-render-canvas' 类的 canvas 元素
  const canvasElements = document.querySelectorAll('canvas.univer-render-canvas');

  // 过滤出高度大于 500 的节点
  const filteredCanvasElements = Array.from(canvasElements).filter(canvas => canvas.offsetHeight > 500);

  // 设置模拟的间隔时间（毫秒）、垂直滚动量和水平滚动量
  var interval = 100; // 每1秒触发一次
  var deltaY = 100;    // 每次滚动100像素
  var deltaX = 0;      // 不进行水平滚动

  // 开始持续模拟 wheel 事件
  continuousWheelSimulation(filteredCanvasElements[0], interval, deltaY, deltaX);


}