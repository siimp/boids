"use strict";

class Game {

  reset() {
    console.log("reseting game");
  }
  
  getBoids() {
    return [new Boid(200, 200), new Boid(300, 200, Math.PI/4)];
  }

}
