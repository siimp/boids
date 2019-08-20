"use strict";

class Boid {

  constructor(x, y, angle, speedX, speedY) {
    this.x = x || 0;
    this.y = y || 0;
    this.angle = angle || 0;
    this.speedX = speedX || 0;
    this.speedY = speedY || 0;
    
    this.newX = this.x;
    this.newY = this.y;
    this.newAngle = this.angle;
    this.newSpeedX = this.speedX;
    this.newSpeedY = this.speedY;
  }
  
  setLocalZoneRadius(localZoneRadius) {
    this.localZoneRadius = localZoneRadius || 0;
  }
  
  distanceTo(other) {
    return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
  }
  
  isLocalMateTo(other) {
    return this.distanceTo(other) <= this.localZoneRadius;
  }
  
  update() {
    this.x = this.newX;
    this.y = this.newY;
    this.angle = this.newAngle;
    this.speedX = this.newSpeedX;
    this.speedY = this.newSpeedY;
  }

}
