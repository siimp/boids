"use strict";

class Boid {

  constructor(x, y, angle) {
    this.x = x || 0;
    this.y = y || 0;
    this.angle = angle || 0;
    this.speed = 0;
    
    this.newX = this.x;
    this.newY = this.y;
    this.newAngle = this.angle;
  }
  
  setLocalZoneRadius(localZoneRadius) {
    this.localZoneRadius = localZoneRadius || 0;
  }
  
  setSpeed(speed) {
    this.speed = speed;
  }
  
  distanceTo(other) {
    return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
  }
  
  isInLocalZone(other) {
    return this.distanceTo(other) <= this.localZoneRadius;
  }
  
  flipToNewValues() {
    this.x = this.newX;
    this.y = this.newY;
    this.angle = this.newAngle;
  }

}
