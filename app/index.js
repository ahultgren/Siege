'use strict';

// 1. generate map
var R = require('ramda');
var map = require('./map');
var makePatch = require('./patch').make;
var world = map.create({
  width: 20,
  height: 20
});

// 2. add centerpoint to list of land

var landTiles = makePatch({
  source: world,
  patch: [world.getTile(world, [10, 10])],
  exitCondition: (patch) => patch.length >= 100,
  pushCondition: R.always(true)
});

// 8. turn tiles in land-array into land
landTiles.forEach((tile) => {
  tile.type = 'land';
});

// 9. Draw tiles
var drawMap = (map) => {
  console.log(map.rows.map((row) => {
    return row.map(({type}) => {
      return type === 'land' ? '██' : '~~';
    })
    .join('');
  })
  .join('\n'));
};

drawMap(world);
