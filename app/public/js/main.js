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

var a = 1*cs, b = -1*sn, c = canvas.width/2;
var d = h*1*sn, e = h*1*cs, f = 0;

ctx.setTransform(a, d, b, e, c, f);

// Draw tiles

var map = require('./map');

map.render(ctx, world, tileSize);
