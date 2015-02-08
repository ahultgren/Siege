'use strict';

// 1. generate map
var R = require('ramda');
var map = require('./map');
var makePatch = require('./patch').make;
var world = map.create({
  width: 20,
  height: 20
});
var setType = R.curry((value, target) => target.type = value);
var getRandom = (source) => source[Math.floor(Math.random() * source.length)];
var tileIs = (on) => (tile) => tile.type === on;
var tileIsNear = (near) => (tile) => {
  return world.getAdjacent(world, tile).some((adjacent) => adjacent.type === near);
};

var makeWorldPatch = function (origin, size, type, on, notNear) {
  // Add a forest
  var patch = makePatch({
    source: world,
    patch: [origin],
    size,
    pushCondition: notNear ?
      (tile) => tileIs(on)(tile) && !tileIsNear(notNear)(tile) :
      tileIs(on)
  });

  patch.forEach(setType(type));

  return patch;
};

// Make sea
world.getAllTiles(world).forEach(setType('sea'));

// Make land
var landTiles = makeWorldPatch(world.getTile(world, [9, 9]), 200, 'land', 'sea');

// Add a forest
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

makeWorldPatch(getRandom(landTiles), 15, 'forest', 'land');

// 9. Draw tiles
var drawMap = (map) => {
  console.log(map.rows.map((row) => {
    return row.map(({type}) => {
      switch (type) {
        case 'land': return '██';
        case 'forest': return '▒▒';
        case 'mountain': return '▲▲';
        default: return '~~';
      }
    })
    .join('');
  })
  .join('\n'));
};

drawMap(world);
