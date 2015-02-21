'use strict';

var Bacon = require('baconjs');
var matrix = require('../utils/matrix.js');

exports.init = ({world, m, mI, tileSize, canvas}) => {
  var getMapTile = world.map.getTile(world.map);

  var mousemoves = Bacon.fromEventTarget(canvas, 'mousemove');
  var pointerCanvasCoords = mousemoves.map(({pageX, pageY}) => [pageX, pageY]);
  var pointerMapCoords = pointerCanvasCoords.map(coords => matrix.transform(mI, coords));
  var pointerTileCoords = pointerMapCoords.map(([a, b]) => [Math.floor(a/tileSize), Math.floor(b/tileSize)]);
  var currentTile = pointerTileCoords.map(coords => getMapTile(coords));

  return {
    currentTile: currentTile.skipDuplicates().filter(Boolean)
  };
};
