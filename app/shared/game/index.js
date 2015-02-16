'use strict';

var R = require('ramda');
var map = require('./map');
var patchmaker = require('./area').patch;
var topology = require('./topology');
var river = require('./river');

/* Helpers
============================================================================= */

var range0 = R.times(R.identity);
var setType = R.curry((value, target) => target.type = value);
var setTerrain = R.curry((value, target) => target.terrain = value);

var randomInt = (n = 1) => Math.floor(Math.random() * n);
var getRandom = (source) => source[randomInt(source.length)];
var tileIs = (on) => (tile) => tile.type === on;

var makePatch = R.curryN(4, (world, origin, size, setter, on) => {
  var patch = patchmaker({
    source: world,
    patch: [origin],
    size,
    pushCondition: tileIs(on)
  });

  patch.forEach(setter());

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
  var landTiles = makeWorldPatch(centerTile, noOfTiles/2, R.lPartial(setType, 'land'), 'sea');

  // Default to plains
  landTiles.forEach(setTerrain('plains'));

  // Make topology
  topology.generate(landTiles, ['river', 'river', 'river', 'river', 'plains', 'plains', 'plains', 'plains', 'plains', 'plains', 'hill', 'mountain', 'mountain', 'mountain']);

  // Add forests
  range0(randomInt(3) + 4).forEach(() => {
    makeWorldPatch(getRandom(landTiles), randomInt(10) + 10, R.lPartial(setTerrain, 'forest'), 'land');
  });

  // Connect rivers
  river.connect(world);

  return game;
};
