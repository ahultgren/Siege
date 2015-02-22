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

exports.getTile = R.curry((map, [x, y]) => map.rows[y] && map.rows[y][x] || false);

exports.getAllTiles = (map) => [].concat(...map.rows);

exports.getAllAdjacent = (map, {position}) => {
  let [x, y] = position;

  return [
    exports.getTile(map, [x + 1, y]),
    exports.getTile(map, [x + 1, y + 1]),
    exports.getTile(map, [x, y + 1]),
    exports.getTile(map, [x - 1, y + 1]),
    exports.getTile(map, [x - 1, y]),
    exports.getTile(map, [x - 1, y - 1]),
    exports.getTile(map, [x, y - 1]),
    exports.getTile(map, [x + 1, y - 1]),
  ];
};

exports.getAdjacent = (map, {position}) => exports.getAllAdjacent(map, {position}).filter(Boolean);

exports.isNextToEachOther = (map, [a, b]) => {
  var nextToA = map.getAdjacent(map, a);
  var nextToB = map.getAdjacent(map, b);

  return nextToA.indexOf(b) > -1 || nextToB.indexOf(a) > -1;
};
