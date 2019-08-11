"use strict";

const game = new Game();

window.addEventListener('config-changed', () => {
  game.reset();
}, false);

window.addEventListener('canvas-size-changed', () => {
  game.reset();
}, false);


function tick(timestamp) {	
	draw();
	window.requestAnimationFrame(tick)
}
window.requestAnimationFrame(tick);

function draw() {

}


