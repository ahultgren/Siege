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
    let direction = randomDir();
    let nextTile = getAdjacent(source, originTile, direction);

    // Add to patch if not already in it
    if(nextTile && patch.indexOf(nextTile) === -1 && pushCondition(nextTile)) {
      patch.push(nextTile);
    }
  }

  return patch;
};

function randomDir () {
  return [(Math.floor(Math.random() * 3)) - 1, (Math.floor(Math.random() * 3)) - 1];
}

function getAdjacent (map, {position}, [dx, dy]) {
  let [sx, sy] = position;
  return map.getTile(map, [sx + dx, sy + dy]);
}
