'use strict';

var game = require('../../shared/game');

var width = 16;
var height = 16;
var tileSize = 40;
var widthPx = width * tileSize;
var heightPx = height * tileSize;

var world = game.create({
  width,
  height
});

var canvas = document.getElementById('world');
var ctx = canvas.getContext('2d');

var skewAngle = Math.PI/4;
var heightAngle = Math.PI/4;

canvas.width = canvas.offsetWidth = widthPx / Math.cos(skewAngle);
canvas.height = canvas.offsetHeight = heightPx;

// Isometric canvas

var cs = Math.cos(skewAngle);
var sn = Math.sin(skewAngle);
var h = Math.cos(heightAngle);

var a = 1*cs,   c = -1*sn,  e = canvas.width/2;
var b = h*1*sn, d = h*1*cs, f = 0;

var matrix = require('./utils/matrix.js');

var m = [a, b, c, d, e, f];
var mI = matrix.inverse3x2(m);

ctx.setTransform(...m);

// Draw tiles

var map = require('./map');

map.render(ctx, world, tileSize);

// Pointer handling

ctx.fillStyle = '#a00';
canvas.addEventListener('mousemove', ({pageX, pageY}) => {
  var mapCoords = matrix.transform(mI, [pageX, pageY]);

  ctx.beginPath();
  ctx.arc(...mapCoords, 2, 0, Math.PI*2);
  ctx.fill();
});
