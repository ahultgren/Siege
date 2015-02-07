'use strict';

var R = require('ramda');

/**
 * Naive patch-maker. Returns n random tiles close to a centerpoint
 */
exports.make = ({source, patch, exitCondition, pushCondition}) => {
  exitCondition = exitCondition ||
    (patch) => patch.length >= source.length || patch.length === 0;
  pushCondition = pushCondition || R.always(true);

  while(!exitCondition(patch)) {
    // 3. choose random point from land-array
    let originTile = patch[Math.floor(Math.random() * patch.length)];

    // 4. choose a tile in random direction
    let direction = randomAdjacent();
    let nextTile = source.getAdjacent(source, originTile, direction);

    // 5. add to land-array if not already in it
    if(nextTile && patch.indexOf(nextTile) === -1 && pushCondition(nextTile)) {
      patch.push(nextTile);
    }
  }

  return patch;
};

function randomAdjacent () {
  return [(Math.floor(Math.random() * 3)) - 1, (Math.floor(Math.random() * 3)) - 1];
}
