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

var drawGrid = R.curry((ctx, tileSize, activeUnit, tile) => {
  var [x, y] = tile.position;
  var topLeft = [x * tileSize, y * tileSize];

  ctx.beginPath();
  ctx.strokeStyle = tile.hovered ? (activeUnit ? '#0ff' : 'rgba(0,0,0,1)') :
    tile.active ? 'rgba(255,0,0,1)' : 'rgba(0,0,0,0.2)';
  ctx.strokeRect(...topLeft, tileSize, tileSize);
});

var drawCity = R.curry((ctx, tileSize, city) => {
  var [x, y] = city.position;
  var center = [x * tileSize + tileSize/2, y * tileSize + tileSize/2];

  ctx.beginPath();
  ctx.strokeStyle = '#000';
  ctx.arc(...center, 15, 0, Math.PI * 2);
  ctx.stroke();
});

var drawUnit = R.curry((ctx, tileSize, city) => {
  var [x, y] = city.position;
  var cX = x * tileSize + tileSize / 2;
  var cY = y * tileSize + tileSize / 2;
  var offset = tileSize / 4;

  ctx.beginPath();
  ctx.strokeStyle = '#f00';
  ctx.moveTo(cX - offset, cY - offset);
  ctx.lineTo(cX + offset, cY + offset);
  ctx.moveTo(cX + offset, cY - offset);
  ctx.lineTo(cX - offset, cY + offset);
  ctx.stroke();
});

var drawPath = (ctx, start, ...points) => {
  ctx.beginPath();
  ctx.moveTo(...start);
  points.forEach(point => ctx.lineTo(...point));
  ctx.fill();
};

module.exports = function (ctx, world, tileSize, activeUnit) {
  var generateTileBitmask = (map, tile, condition = (type) => type !== tile.type) => {
    return tile.allAdjacent
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

  allTiles.filter(R.has('terrain')).forEach(terrain.render(ctx, tileSize));

  allTiles.forEach(drawGrid(ctx, tileSize, activeUnit));

  landTiles.forEach((tile) => {
    var [x, y] = tile.position;
    var topLeft = [x * tileSize, y * tileSize];
    var adjacentMask = generateTileBitmask(world.map, tile);
    var adjacentSeaTiles = tile.allAdjacent.filter(tile => !tile || tile.type !== 'land');

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
    var [x, y] = tile.position;
    var topLeft = [x * tileSize, y * tileSize];
    var adjacentMask = generateTileBitmask(world.map, tile, (type) => type === 'land');
    var adjacentLandTiles = tile.adjacent.filter(tile => tile.type !== 'sea');

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

  // Render cities
  world.getAllCities().forEach(drawCity(ctx, tileSize));

  // Render units
  world.getAllUnits().forEach(drawUnit(ctx, tileSize));
};
