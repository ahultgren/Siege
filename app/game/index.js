'use strict';

var R = require('ramda');
var map = require('./map');
var patchmaker = require('./area').patch;
var topology = require('./topology');

/* Helpers
============================================================================= */

var range0 = R.times(R.identity);
var setType = R.curry((value, target) => target.type = value);
var randomInt = (n = 1) => Math.floor(Math.random() * n);
var getRandom = (source) => source[randomInt(source.length)];
var tileIs = (on) => (tile) => tile.type === on;
var tileIsNear = (world, near) => (tile) => {
  return world.getAdjacent(world, tile).some((adjacent) => adjacent.type === near);
};

var makePatch = R.curryN(4, (world, origin, size, type, on, notNear) => {
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

/* API
============================================================================= */

exports.create = ({width, height}) => {
  var game = Object.create(exports);

  var world = game.map = map.create({ width, height });
  var makeWorldPatch = makePatch(world);
  var noOfTiles = width * height;
  var centerTile = world.getTile(world, [Math.floor(width/2), Math.floor(height/2)]);

  // Turn world into sea
  world.getAllTiles(world).forEach(setType('sea'));

  // Make land
  var landTiles = makeWorldPatch(centerTile, noOfTiles/2, 'land', 'sea');

  // Make topology
  topology.generate(landTiles, ['river', 'river', 'river', 'river', 'land', 'land', 'land', 'land', 'land', 'land', 'hill', 'mountain', 'mountain', 'mountain']);

  // Add forests
  range0(randomInt(3) + 3).forEach(() => {
    makeWorldPatch(getRandom(landTiles), randomInt(10) + 10, 'forest', 'land');
  });

  // More forests after mountains, which do not prevent mountains from growing
  makeWorldPatch(getRandom(landTiles), 15, 'forest', 'land');

  return game;
};
