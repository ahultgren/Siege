'use strict';

var R = require('ramda');
var tile = require('./tile');
var range0 = R.times(R.identity);

exports = module.exports = function Map (){
  throw new Error('This is not a constructor');
};

exports.create = function (settings = {width: 0, height: 0}) {
  var map = Object.create(exports);

  Object.keys(settings).forEach((key) => {
    map[key] = settings[key];
  });

  map.rows = range0(map.height).map((y) => {
    return range0(map.width).map((x) => {
      return tile.create(x, y);
    });
  });

  return map;
};

exports.getTile = (map, [x, y]) => map.rows[y][x];

exports.getAdjacent = (map, {position}, [dx, dy]) => {
  let [sx, sy] = position;
  return map.getTile(map, [sx + dx, sy + dy]);
};
