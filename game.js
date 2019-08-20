"use strict";
Math.HALF_PI = Math.PI / 2;
Math.DOUBLE_PI = Math.PI * 2;

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
    this.areaWidth = areaWidth;
    this.areaHeight = areaHeight;
    for (let boidIndex = 0; boidIndex < config.boidCount; boidIndex++) {
      const boid = new Boid(Math.random() * areaWidth, Math.random() * areaHeight, Math.DOUBLE_PI * Math.random());
      //const boid = new Boid(400, 250, this.normalizeAngle(Math.PI/4 + Math.DOUBLE_PI));
      boid.setLocalZoneRadius(config.boid.localZoneRadius);
      boid.setSpeed(config.boid.flyingSpeed);
      this.boids.push(boid);
    }
  }
  
  tick() {
    const boidWithMates = this.calculateBoidMates();
    for (const boidMateIndex in boidWithMates) {
      const boidMate = boidWithMates[boidMateIndex];
      if (boidMate.mates.length > 0) {
        if (config.rules.avoidCrowding) {
          this.steerToAvoidCrowding(boidMate);
        }
        if (config.rules.averageHeading) {
          this.steerTowardsAverageHeading(boidMate);
        }
        if (config.rules.averagePosition) {
          this.steerTowardsAveragePosition(boidMate);
        }
      }
      if (config.rules.avoidBorders) {
        this.steerToAvoidBoarders(boidMate);
      }
    }
    
    for (const boidIndex in this.boids) {
      const boid = this.boids[boidIndex];
      boid.newX = boid.x + boid.speed * Math.sin(boid.newAngle);
      boid.newY = boid.y + boid.speed * -Math.cos(boid.newAngle);
      
      boid.flipToNewValues();
    }
  }
  
  steerToAvoidCrowding(boidMate) {
    // find closest and steer towards opposite direction
    let closestDistance = Number.MAX_VALUE;
    let closestMate = null;
    const mates = boidMate.mates;
    
    for (const mateIndex in mates) {
      const mate = mates[mateIndex];
      let distanceToMate = boidMate.boid.distanceTo(mate);
      if (distanceToMate < closestDistance) {
        closestDistance = distanceToMate;
        closestMate = mate;
      }
    }
    
    if (closestMate) {
      const angleTowardsClosestMate = this.pointAngleFromBoidPerspective(closestMate, boidMate.boid);
      const oppositeAngle = angleTowardsClosestMate + Math.PI;
      this.steerTowardsAngle(boidMate, oppositeAngle);
    }
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
    const angleTowardsCentrePoint = this.pointAngleFromBoidPerspective(matesCentrePoint, boidMate.boid);
    this.steerTowardsAngle(boidMate, angleTowardsCentrePoint);
  }
  
  steerToAvoidBoarders(boidMate) {
    const x = boidMate.boid.x;
    const y = boidMate.boid.y;
    // console.log(x, y, boidMate.boid.angle)
    if (x <= config.boid.localZoneRadius) {
      console.log("right")
      this.steerTowardsAngle(boidMate, Math.HALF_PI);
    }
    if (x >= (this.areaWidth - config.boid.localZoneRadius)) {
      console.log("left")
      this.steerTowardsAngle(boidMate, Math.PI + Math.HALF_PI);
    }
    if (y <= config.boid.localZoneRadius) {
      console.log("down")
      this.steerTowardsAngle(boidMate, Math.PI);
    }
    if (y >= (this.areaHeight - config.boid.localZoneRadius)) {
      console.log("up")
      this.steerTowardsAngle(boidMate, Math.DOUBLE_PI);
    }
  }
  
  pointAngleFromBoidPerspective(point, boid) {
    const x = point.x - boid.x;
    const y = point.y - boid.y;
    return Math.atan2(y, x) + Math.HALF_PI;
  }
  
  steerTowardsAngle(boidMate, angle) {
    const towardsAngle = this.normalizeAngle(angle);
    console.log("current angle: ", boidMate.boid.angle);
    console.log("towards angle: ", towardsAngle);
    
    if (towardsAngle > boidMate.boid.angle) {
      boidMate.boid.newAngle = boidMate.boid.angle + config.boid.turningSpeed;
    } else {
      boidMate.boid.newAngle = boidMate.boid.angle - config.boid.turningSpeed;
    }
    boidMate.boid.newAngle = this.normalizeAngle(boidMate.boid.newAngle);
  }
  
  normalizeAngle(angle) {
    return ((angle % Math.DOUBLE_PI) + Math.DOUBLE_PI) % Math.DOUBLE_PI;
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
        if (newBoidMate.boid.isInLocalZone(boidMate.boid)) {
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
