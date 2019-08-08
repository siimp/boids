"use strict";

const configDiv = document.getElementById("config");
function updateConfigDiv() {
    configDiv.innerHTML = JSON.stringify(config, null, 2);
}

window.addEventListener('config-changed', function (e) {
  updateConfigDiv();
}, false);

updateConfigDiv();

