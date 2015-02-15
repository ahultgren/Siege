'use strict';

var R = require('ramda');
var game = require('../../shared/game');

var width = 32;
var height = 32;
var tileSize = 40;
var widthPx = width * tileSize;
var heightPx = height * tileSize;

var colors = {
  sea: '#039',
  land: '#6f3',
  forest: '#390',
  hill: '#463',
  mountain: '#333',
  river: '#03f',
  default: '#000',
};

var world = game.create({
  width,
  height
});

var canvas = document.getElementById('world');
var ctx = canvas.getContext('2d');

var skewAngle = Math.PI/4;
var heightAngle = Math.PI/4;

canvas.width = canvas.offsetWidth = widthPx / Math.cos(skewAngle);
canvas.height = canvas.offsetHeight = heightPx;

// Isometric canvas

var cs = Math.cos(skewAngle);
var sn = Math.sin(skewAngle);
var h = Math.cos(heightAngle);

var a = 1*cs, b = -1*sn, c = canvas.width/2;
var d = h*1*sn, e = h*1*cs, f = 0;

ctx.setTransform(a, d, b, e, c, f);

// Draw tiles

var generateTileBitmask = (map, tile, adjacentType) => {
  return map.getAdjacent(map, tile)
  .map(({type}, i) => +(type === adjacentType) * 1<<i)
  .reduce(R.add);
};

var allTiles = [].concat(...world.map.rows);
var landTiles = allTiles.filter(({type}) => type === 'land');

allTiles.forEach((tile) => {
  let [x, y] = tile.position;
  let topLeft = [x * tileSize, y * tileSize];

  ctx.fillStyle = colors[tile.type];
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(0,0,0,0.2)';
  ctx.fillRect(...topLeft, tileSize, tileSize);
  ctx.strokeRect(...topLeft, tileSize, tileSize);
});

var drawPath = (ctx, ...[start, ...points]) => {
  ctx.beginPath();
  ctx.moveTo(...start);
  points.forEach(point => ctx.lineTo(...point));
  ctx.fill();
};

landTiles.forEach((tile) => {
  let [x, y] = tile.position;
  let topLeft = [x * tileSize, y * tileSize];
  let adjacentMask = generateTileBitmask(world.map, tile, 'sea');

  ctx.fillStyle = colors.sea;

  // [TODO] Automate this?

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
