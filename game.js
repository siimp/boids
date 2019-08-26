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
      
      let boid = null;
      do {
        boid = new Boid(Math.random() * areaWidth, Math.random() * areaHeight, Math.DOUBLE_PI * Math.random());
      } while(this.intersectsWithOthers(boid.x, boid.y));
      
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
      const newX = boid.x + boid.speed * Math.sin(boid.newAngle);
      const newY = boid.y + boid.speed * -Math.cos(boid.newAngle);
      boid.newX = newX;
      boid.newY = newY;
      
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
      // const angleTowardsClosestMate = this.pointAngleFromBoidPerspective(closestMate, boidMate.boid);
      const oppositeAngle = closestMate.angle + Math.PI;
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
    if (boidMate.mates.length < 2) {
     return;
    }
    
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
    const distanceToStartTurning = config.boid.flyingSpeed * (1 / config.boid.turningSpeed)
    
    if (x <= distanceToStartTurning) {
      this.steerTowardsAngle(boidMate, Math.HALF_PI);
    } else if (x > (this.areaWidth - distanceToStartTurning)) {
      this.steerTowardsAngle(boidMate, -Math.HALF_PI);
    } 
    
    if (y <= distanceToStartTurning) {
      this.steerTowardsAngle(boidMate, Math.PI);
    } else if (y > (this.areaHeight - distanceToStartTurning)) {
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
    const deltaAngle = Math.abs(towardsAngle - boidMate.boid.angle)
    
    let increaseAngle = true;
    if (towardsAngle > boidMate.boid.angle) {
      if (deltaAngle >= Math.PI) {
        increaseAngle = false;
      }
    } else {
      if (deltaAngle <= Math.PI) {
        increaseAngle = false;
      }
    }

    if (increaseAngle) {
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
  
  intersectsWithOthers(x, y, thisBoid) {
    let intersects = false;
    
    for (let boidIndex in this.boids) {
      let otherBoid = this.boids[boidIndex];
      if (thisBoid === otherBoid) {
        continue;
      }
      const minX = otherBoid.x;
      const maxX = otherBoid.x + config.boid.width;
      const minY = otherBoid.y;
      const maxY = otherBoid.y + config.boid.height;
      if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
        intersects = true;
        break;
      }
    }
    return intersects;
  }
  
  getBoids() {
    return this.boids;
  }

}
