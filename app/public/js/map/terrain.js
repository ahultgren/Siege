'use strict';

var R = require('ramda');
var colors = require('./colors');

exports.render = R.curry((ctx, tileSize, tile) => {
  let [x, y] = tile.position;
  let center = [x * tileSize + tileSize/2, y * tileSize + tileSize/2];

  ctx.fillStyle = colors[tile.terrain];
  ctx.beginPath();
  ctx.arc(...center, 5, 0, Math.PI*2);
  ctx.fill();
});
