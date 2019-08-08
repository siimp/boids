"use strict";


const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
const game = new Game();

window.addEventListener('config-changed', function (e) {
  game.reset();
}, false);

function tick(timestamp) {	
	draw();
	window.requestAnimationFrame(tick)
}
window.requestAnimationFrame(tick);

function draw() {

}


