'use strict';

var game = require('../../shared/game');
var Canvas = require('./canvas');
var State = require('./state');
var map = require('./map');
var ui = require('./ui');

var width = 16;
var height = 16;
var tileSize = 40;

// World
var world = game.create({
  width,
  height
});

// Canvas
var {canvas, ctx, m, mI} = Canvas.create({
  selector: '#world',
  width,
  height,
  tileSize
});

// State
var state = State.init();

// Map
map.init({state, canvas, ctx, world, tileSize, m, mI});

// UI
ui.init({
  state,
  world
});
