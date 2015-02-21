'use strict';

module.exports = (selector, width, height) => {
  var canvas = document.querySelector(selector);

  canvas.width = canvas.offsetWidth = width;
  canvas.height = canvas.offsetHeight = height;

  return canvas;
};
