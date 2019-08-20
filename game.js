"use strict";

class Game {

  constructor(width, height) {
    this.boids = [];
    this.init(width, height);
  }

  reset(width, height) {
    this.boids = [];
    this.init(width, height);
  }
  
  init(width, height) {
    for (let boidIndex = 0; boidIndex < config.boidCount; boidIndex++) {
      const boid = new Boid(Math.random() * width, Math.random() * height, 2 * Math.PI * Math.random());
      this.boids.push(boid);
    }
  }
  
  getBoids() {
    return this.boids;
  }

}
