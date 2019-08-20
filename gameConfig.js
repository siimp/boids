"use strict";

{
  let defaultConfig = {
      boidCount: 20,
      boid: {
        width: 10,
        height: 30,
        localZoneRadius: 100,
        turningSpeed: 0.05
      }
  }
  
  let handler = {
      set: function(obj, prop, value) {
        obj[prop] = value;
        fireConfigChangedEvent();
        return true;
      },
      deleteProperty: function (oTarget, sKey) {
        if (sKey in oTarget) { return false; }
        fireConfigChangedEvent();
        return oTarget.removeItem(sKey);
      },
  };

  window.config = new Proxy(defaultConfig, handler);
}

function fireConfigChangedEvent() {
  window.dispatchEvent(new Event('config-changed'));
}
