'use strict';

var matrix = require('./utils/matrix.js');

exports.create = ({selector, width, height, tileSize}) => {
  var canvas = document.querySelector(selector);

  var widthPx = width * tileSize;
  var heightPx = height * tileSize;

  var skewAngle = Math.PI/4;
  var heightAngle = Math.PI/4;

  var cs = Math.cos(skewAngle);
  var sn = Math.sin(skewAngle);
  var h = Math.cos(heightAngle);

  var a = 1*cs,   c = -1*sn,  e = widthPx / cs / 2;
  var b = 1*h*sn, d = 1*h*cs, f = 0;

  var m = [a, b, c, d, e, f];
  var mI = matrix.inverse3x2(m);

  var ctx = canvas.getContext('2d');

  canvas.width = canvas.offsetWidth = widthPx / Math.cos(skewAngle);
  canvas.height = canvas.offsetHeight = heightPx;
  ctx.setTransform(...m);

  return {
    canvas,
    m,
    mI,
    ctx,
  };
};
