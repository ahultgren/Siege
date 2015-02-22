'use strict';

var R = require('ramda');
var colors = require('./colors');
var terrain = require('./terrain');

var drawTile = R.curry((ctx, tileSize, tile) => {
  var [x, y] = tile.position;
  var topLeft = [x * tileSize, y * tileSize];

  ctx.fillStyle = colors[tile.type];
  ctx.beginPath();
  ctx.fillRect(...topLeft, tileSize, tileSize);
});

var drawGrid = R.curry((ctx, tileSize, tile) => {
  var [x, y] = tile.position;
  var topLeft = [x * tileSize, y * tileSize];

  ctx.beginPath();
  ctx.strokeStyle = tile.hovered ? 'rgba(0,0,0,1)' :
    tile.active ? 'rgba(255,0,0,1)' : 'rgba(0,0,0,0.2)';
  ctx.strokeRect(...topLeft, tileSize, tileSize);
});

var drawPath = (ctx, start, ...points) => {
  ctx.beginPath();
  ctx.moveTo(...start);
  points.forEach(point => ctx.lineTo(...point));
  ctx.fill();
};

exports.render = function (ctx, world, tileSize) {

  var generateTileBitmask = (map, tile, condition = (type) => type !== tile.type) => {
    return map.getAllAdjacent(map, tile)
    .map((adjacentTile, i) => {
      return +(condition(adjacentTile && adjacentTile.type || 'edge')) * 1<<i;
    })
    .reduce(R.add);
  };

  var allTiles = [].concat(...world.map.rows);
  var landTiles = allTiles.filter(({type}) => type === 'land');
  var seaTiles = allTiles.filter(({type}) => type === 'sea');

  // Draw tiles

  allTiles.forEach(drawTile(ctx, tileSize));
  allTiles.forEach(drawGrid(ctx, tileSize));

  allTiles.filter(R.has('terrain')).forEach(terrain.render(ctx, tileSize));

  landTiles.forEach((tile) => {
    let [x, y] = tile.position;
    let topLeft = [x * tileSize, y * tileSize];
    let adjacentMask = generateTileBitmask(world.map, tile);
    let adjacentSeaTiles = world.map.getAllAdjacent(world.map, tile).filter(tile => !tile || tile.type !== 'land');

    ctx.fillStyle = colors.sea;

    // [TODO] Automate this?

    if(adjacentSeaTiles.length === 7) {
      return;
    }

    // Bottom right
    if((adjacentMask & (1|2|4)) === (1|2|4)) {
      drawPath(ctx,
        [topLeft[0] + tileSize, topLeft[1] + tileSize/2],
        [topLeft[0] + tileSize, topLeft[1] + tileSize],
        [topLeft[0] + tileSize/2, topLeft[1] + tileSize]
      );
    }

    // Bottom left
    if((adjacentMask & (4|8|16)) === (4|8|16)) {
      drawPath(ctx,
        [topLeft[0] + tileSize/2, topLeft[1] + tileSize],
        [topLeft[0], topLeft[1] + tileSize],
        [topLeft[0], topLeft[1] + tileSize/2]
      );
    }

    // Top left
    if((adjacentMask & (16|32|64)) === (16|32|64)) {
      drawPath(ctx,
        [topLeft[0], topLeft[1] + tileSize/2],
        [topLeft[0], topLeft[1]],
        [topLeft[0] + tileSize/2, topLeft[1]]
      );
    }

    // Top right
    if((adjacentMask & (64|128|1)) === (64|128|1)) {
      drawPath(ctx,
        [topLeft[0] + tileSize/2, topLeft[1]],
        [topLeft[0] + tileSize, topLeft[1]],
        [topLeft[0] + tileSize, topLeft[1] + tileSize/2]
      );
    }

  });

  seaTiles.forEach((tile) => {
    let [x, y] = tile.position;
    let topLeft = [x * tileSize, y * tileSize];
    let adjacentMask = generateTileBitmask(world.map, tile, (type) => type === 'land');
    let adjacentLandTiles = world.map.getAdjacent(world.map, tile).filter(tile => tile.type !== 'sea');

    ctx.fillStyle = colors.plains;

    // [TODO] Automate this?

    if(adjacentLandTiles.length >= 7) {
      return;
    }

    // Bottom right
    if((adjacentMask & (1|4)) === (1|4)) {
      drawPath(ctx,
        [topLeft[0] + tileSize, topLeft[1] + tileSize/2],
        [topLeft[0] + tileSize, topLeft[1] + tileSize],
        [topLeft[0] + tileSize/2, topLeft[1] + tileSize]
      );
    }

    // Bottom left
    if((adjacentMask & (4|16)) === (4|16)) {
      drawPath(ctx,
        [topLeft[0] + tileSize/2, topLeft[1] + tileSize],
        [topLeft[0], topLeft[1] + tileSize],
        [topLeft[0], topLeft[1] + tileSize/2]
      );
    }

    // Top left
    if((adjacentMask & (16|64)) === (16|64)) {
      drawPath(ctx,
        [topLeft[0], topLeft[1] + tileSize/2],
        [topLeft[0], topLeft[1]],
        [topLeft[0] + tileSize/2, topLeft[1]]
      );
    }

    // Top right
    if((adjacentMask & (64|1)) === (64|1)) {
      drawPath(ctx,
        [topLeft[0] + tileSize/2, topLeft[1]],
        [topLeft[0] + tileSize, topLeft[1]],
        [topLeft[0] + tileSize, topLeft[1] + tileSize/2]
      );
    }
  });
};
