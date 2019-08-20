"use strict";

{
  let defaultConfig = {
      boidCount: 8,
      boid: {
        width: 10,
        height: 30,
        localZoneRadius: 100,
        turningSpeed: 0.05,
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
