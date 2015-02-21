'use strict';

var game = require('../../shared/game');
var Canvas = require('./canvas');
var State = require('./state');
var map = require('./map');

var width = 16;
var height = 16;
var tileSize = 40;

var world = game.create({
  width,
  height
});

var {canvas, ctx, m, mI} = Canvas.create({
  selector: '#world',
  width,
  height,
  tileSize
});

// Draw tiles

map.render(ctx, world, tileSize);

// Pointer handling

var state = State.init({
  canvas: canvas,
  world,
  m,
  mI,
  tileSize
});
