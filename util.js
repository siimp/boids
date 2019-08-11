"use strict";

const util = (function(){
  function isDesktop() {
    return window.innerWidth > 600;
  }
  
  return {
    isDesktop: isDesktop
  };

}());
