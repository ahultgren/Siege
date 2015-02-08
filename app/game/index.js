'use strict';

// 1. generate map
var R = require('ramda');
var map = require('./map');
var patchmaker = require('./patch').make;

var setType = R.curry((value, target) => target.type = value);
var getRandom = (source) => source[Math.floor(Math.random() * source.length)];
var tileIs = (on) => (tile) => tile.type === on;
var tileIsNear = (world, near) => (tile) => {
  return world.getAdjacent(world, tile).some((adjacent) => adjacent.type === near);
};

var makePatch = R.curryN(4, (world, origin, size, type, on, notNear) => {
  // Add a forest
  var patch = patchmaker({
    source: world,
    patch: [origin],
    size,
    pushCondition: notNear ?
      (tile) => tileIs(on)(tile) && !tileIsNear(world, notNear)(tile) :
      tileIs(on)
  });

  patch.forEach(setType(type));

  return patch;
});

exports.create = function ({width, height}) {
  var game = Object.create(exports);

  var world = game.map = map.create({ width, height });
  var makeWorldPatch = makePatch(world);

  // Turn world into sea
  world.getAllTiles(world).forEach(setType('sea'));

  // Make land
  var landTiles = makeWorldPatch(world.getTile(world, [9, 9]), 200, 'land', 'sea');

  // Add forests
  makeWorldPatch(getRandom(landTiles), 5, 'forest', 'land');
  makeWorldPatch(getRandom(landTiles), 5, 'forest', 'land');
  makeWorldPatch(getRandom(landTiles), 5, 'forest', 'land');
  makeWorldPatch(getRandom(landTiles), 5, 'forest', 'land');
  makeWorldPatch(getRandom(landTiles), 10, 'forest', 'land');
  makeWorldPatch(getRandom(landTiles), 15, 'forest', 'land');

  // Add some mountains
  makeWorldPatch(getRandom(landTiles), 5, 'mountain', 'land', 'sea');
  makeWorldPatch(getRandom(landTiles), 5, 'mountain', 'land', 'sea');
  makeWorldPatch(getRandom(landTiles), 5, 'mountain', 'land', 'sea');

  // More forests after mountains, to not prevent mountains from growing
  makeWorldPatch(getRandom(landTiles), 15, 'forest', 'land');

  return game;
};
