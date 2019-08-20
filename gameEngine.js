"use strict";
(function() {
const ctx = window.getGameCanvasCtx();
const game = new Game(ctx.canvas.width, ctx.canvas.height);

window.addEventListener('config-changed', () => {
  game.reset(ctx.canvas.width, ctx.canvas.height);
}, false);

window.addEventListener('canvas-size-changed', () => {
  game.reset(ctx.canvas.width, ctx.canvas.height);
}, false);


function tick(timestamp) {	
	draw();
	game.tick();
	window.requestAnimationFrame(tick)
}
window.requestAnimationFrame(tick);


const boids = [];
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let boidIndex = 0; boidIndex < game.getBoids().length; boidIndex++) {
      const boidVisual = getBoidVisualFromPool(boidIndex);
      const boid = game.getBoids()[boidIndex];
      drawBoid(boid, boidVisual);
    }
}

function drawBoid(boid, boidVisual) {
    ctx.translate(boid.x, boid.y);
    ctx.rotate(boid.angle);
    ctx.fill(boidVisual);
    ctx.setTransform(1, 0, 0, 1, 0, 0);  
}

const boidVisualPool = [];
function getBoidVisualFromPool(boidIndex) {
  let boidVisual = boidVisualPool[boidIndex];
  
  if (!boidVisual) {
    boidVisualPool[boidIndex] = getBoidVisual();
    boidVisual = boidVisualPool[boidIndex];
  }
  
  return boidVisual;
}

function getBoidVisual() {
    let a = new Point(0, -config.boid.height * 2/3);
    let b = new Point(config.boid.width, config.boid.height * 1/3);
    let c = new Point(-config.boid.width, config.boid.height * 1/3);

    let triangle = new Path2D();
    triangle.moveTo(a.x, a.y);
    triangle.lineTo(b.x, b.y);
    triangle.lineTo(c.x, c.y);
    
    return triangle;
}
})();

