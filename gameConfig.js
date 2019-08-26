"use strict";

{
  let defaultConfig = {
      boidCount: 50,
      rules: {
        avoidCrowding: true,
        averageHeading: true,
        averagePosition: true,
        avoidBorders: true
      },
      boid: {
        width: 8,
        height: 20,
        localZoneRadius: 40,
        turningSpeed: 0.04,
        flyingSpeed: 2,
        color: "green"
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

  const globalConfig = {};
  Object.keys(defaultConfig).forEach(function(key, index) {
    if (typeof defaultConfig[key] === 'object') {
      globalConfig[key] = new Proxy(defaultConfig[key], handler);
    } else {
      globalConfig[key] = defaultConfig[key];
    }
  });
  window.config = new Proxy(globalConfig, handler);
}

function fireConfigChangedEvent() {
  window.dispatchEvent(new Event('config-changed'));
}
