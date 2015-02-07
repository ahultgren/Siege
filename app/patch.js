'use strict';

var R = require('ramda');

/**
 * Naive patch-maker. Returns n random tiles close to a centerpoint
 */
exports.make = ({source, patch, size, pushCondition}) => {
  let attempts = 0;
  size = size || source.length;
  pushCondition = pushCondition || R.always(true);

  if(patch.length === 0) {
    return patch;
  }

  while(patch.length < size && attempts++ < source.width * source.height * 10) {
    // Choose random point from patch
    let originTile = patch[Math.floor(Math.random() * patch.length)];

    // Choose a tile in random direction
    let direction = randomAdjacent();
    let nextTile = source.getAdjacent(source, originTile, direction);

    // Add to patch if not already in it
    if(nextTile && patch.indexOf(nextTile) === -1 && pushCondition(nextTile)) {
      patch.push(nextTile);
    }
  }

  return patch;
};

function randomAdjacent () {
  return [(Math.floor(Math.random() * 3)) - 1, (Math.floor(Math.random() * 3)) - 1];
}
