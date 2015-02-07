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

var makeWorldPatch = function (origin, size, type, on) {
  // Add a forest
  var patch = makePatch({
    source: world,
    patch: [origin],
    size,
    pushCondition: (tile) => tile.type === on
  });

  patch.forEach(setType(type));

  return patch;
};

// Make land
var landTiles = makeWorldPatch(world.getTile(world, [9, 9]), 200, 'land');

// Add a forest
makeWorldPatch(getRandom(landTiles), 5, 'forest', 'land');
makeWorldPatch(getRandom(landTiles), 5, 'forest', 'land');
makeWorldPatch(getRandom(landTiles), 5, 'forest', 'land');
makeWorldPatch(getRandom(landTiles), 5, 'forest', 'land');
makeWorldPatch(getRandom(landTiles), 10, 'forest', 'land');
makeWorldPatch(getRandom(landTiles), 15, 'forest', 'land');

// Add some mountains
makeWorldPatch(getRandom(landTiles), 3, 'mountain', 'land');
makeWorldPatch(getRandom(landTiles), 4, 'mountain', 'land');
makeWorldPatch(getRandom(landTiles), 5, 'mountain', 'land');

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
