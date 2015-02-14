'use strict';

var R = require('ramda');

/**
 * Naive patch-maker. Returns n random tiles close to a centerpoint
 */
exports.patch = ({source, patch, size, pushCondition}) => {
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

exports.ant = ({source, trail, size, pushCondition}) => {
  let attempts = 0;
  let direction = randomDir();
  size = size || source.length;
  pushCondition = pushCondition || R.always(true);

  if(trail.length === 0) {
    return trail;
  }

  while(trail.length < size && attempts++ < source.width * source.height * 10) {
    // Choose last point in trail
    let originTile = trail[trail.length - 1];

    // Choose a tile in random direction, but favor keeping the current direction
    if(Math.round(Math.random())) {
      direction = randomDir();
    }

    let nextTile = getAdjacent(source, originTile, direction);

    // Add to trail if not already in it and not next to itself
    if(nextTile && trail.indexOf(nextTile) === -1 && pushCondition(nextTile) && !isNextTo(source, nextTile, trail.slice(0, -1))) {
      trail.push(nextTile);
    }
  }

  return trail;
};

/* Helpers
============================================================================= */

function randomDir () {
  return [(Math.floor(Math.random() * 3)) - 1, (Math.floor(Math.random() * 3)) - 1];
}

function getAdjacent (map, {position}, [dx, dy]) {
  let [sx, sy] = position;
  return map.getTile(map, [sx + dx, sy + dy]);
}

function isNextTo (map, tile, source) {
  return map.getAdjacent(map, tile).some((tile) => source.indexOf(tile) !== -1);
}
