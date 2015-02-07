'use strict';

exports = module.exports = function Tile (){
  throw new Error('This is not a constructor');
};

exports.create = function (x, y) {
  var tile = Object.create(exports);

  tile.position = [x, y];

  return tile;
};

exports.getPosition = (tile) => [...tile.position];
