"use strict";
function getGameCanvasCtx() {
  const canvas = document.getElementById("canvas");
  return canvas.getContext('2d');
}
window.getGameCanvasCtx = getGameCanvasCtx;

(function() {
  const ctx = getGameCanvasCtx();
  const configDiv = document.getElementById("config");


  function updateConfigDiv() {
      configDiv.innerHTML = JSON.stringify(config, null, 2);
  }

  window.addEventListener('config-changed', () => {
    updateConfigDiv();
  }, false);

  updateConfigDiv();

  let resizeTimeoutId;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeoutId);
    resizeTimeoutId = setTimeout(initializeCanvas, 100);
  }, false);

  function initializeCanvas() {
    ctx.canvas.width = window.innerWidth - 40;
    ctx.canvas.height = window.innerHeight/1.5;
    if (util.isDesktop()) {
      ctx.canvas.width = window.innerWidth/1.5;
    }
    window.dispatchEvent(new Event('canvas-size-changed'));
  }

  initializeCanvas();
})();
