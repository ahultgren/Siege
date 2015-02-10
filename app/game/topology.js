'use strict';

var R = require('ramda');
var perlin = require('perlin');
var noise = perlin.noise.simplex2;
var seed = perlin.noise.seed;

var transform = R.curry((fMin, fMax, tMin, tMax, value) => {
  return ((value - fMin)/(fMax - fMin)) * (tMax - tMin) + tMin;
});

exports.generate = (tiles, types) => {
  var typeTransform = transform(-1, 1, 0, types.length - 1);

  seed(Math.floor(Math.random() * 0xffff));

  tiles.forEach((tile) => {
    var level = Math.round(typeTransform(noise(...tile.position)));
    tile.type = types[level];
  });
};

/*console.log(transform(-10, 10, 0, 5, 0) === 2.5);
console.log(transform(-10, -9, 5, 50, -9) === 50);
console.log(transform(0, 5, 4, 6, 10) === 8);*/
