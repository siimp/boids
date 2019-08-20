"use strict";

class Game {

  constructor(areaWidth, areaHeight) {
    this.boids = [];
    this.init(areaWidth, areaHeight);
  }

  reset(areaWidth, areaHeight) {
    this.boids = [];
    this.init(areaWidth, areaHeight);
  }
  
  init(areaWidth, areaHeight) {
    for (let boidIndex = 0; boidIndex < config.boidCount; boidIndex++) {
      const boid = new Boid(Math.random() * areaWidth, Math.random() * areaHeight, 2 * Math.PI * Math.random());
      boid.setLocalZoneRadius(config.boid.localZoneRadius);
      this.boids.push(boid);
    }
  }
  
  tick() {
    const boidWithMates = this.calculateBoidMates();
    for (const boidMateIndex in boidWithMates) {
      const boidMate = boidWithMates[boidMateIndex];
      if (boidMate.mates.length > 0) {
        this.steerToAvoidCrowding(boidMate);
        this.steerTowardsAverageHeading(boidMate);
        this.steerTowardsAveragePosition(boidMate);
      }
    }
    
    for (const boidIndex in this.boids) {
      const boid = this.boids[boidIndex];
      boid.update();
    }
  }
  
  steerToAvoidCrowding(boidMates) {
  
  }
  
  steerTowardsAverageHeading(boidMate) {
    // https://en.wikipedia.org/wiki/Mean_of_circular_quantities - mean of angles
    let sinSum = 0;
    let cosSum = 0;
    const mates = boidMate.mates;
    
    for (const mateIndex in mates) {
      const mate = mates[mateIndex];
      sinSum += Math.sin(mate.angle);
      cosSum += Math.cos(mate.angle);
    }
    
    const averageAngle =  Math.atan2(sinSum/mates.length, cosSum/mates.length);
    this.steerTowardsAngle(boidMate, averageAngle);
  }
  
  steerTowardsAveragePosition(boidMate) {
    let xSum = 0;
    let ySum = 0;
    const mates = boidMate.mates;
    
    for (const mateIndex in mates) {
      const mate = mates[mateIndex];
      xSum += mate.x
      ySum += mate.y;
    }
    
    const matesCentrePoint = new Point(xSum/mates.length, ySum/mates.length);
    const x = matesCentrePoint.x - boidMate.boid.x;
    const y = matesCentrePoint.y - boidMate.boid.y;
    const matesCentrePointAngle = Math.atan2(y, x) + Math.PI/2;
    this.steerTowardsAngle(boidMate, matesCentrePointAngle);
    
    // const ctx = window.getGameCanvasCtx();
    // ctx.fillStyle = 'red';
    // ctx.fillRect(matesCentrePoint.x-2, matesCentrePoint.y-2, 4, 4);
  }
  
  steerTowardsAngle(boidMate, angle) {
    if (angle > boidMate.boid.angle) {
      boidMate.boid.newAngle = boidMate.boid.angle + config.boid.turningSpeed;
    } else {
      boidMate.boid.newAngle = boidMate.boid.angle - config.boid.turningSpeed;
    }
  }
  
  calculateBoidMates() {
    const boidWithMates = [];
    for (const boidIndex in this.boids) {
      const boid = this.boids[boidIndex];
      const newBoidMate = {
        "boid": boid,
        "mates": []
      };
      for (const boidMateIndex in boidWithMates) {
      const boidMate = boidWithMates[boidMateIndex];
        if (newBoidMate.boid.isLocalMateTo(boidMate.boid)) {
          boidMate.mates.push(newBoidMate.boid);
          newBoidMate.mates.push(boidMate.boid);
        }
      }
      boidWithMates.push(newBoidMate);
    }
    return boidWithMates;
  }
  
  
  getBoids() {
    return this.boids;
  }

}
