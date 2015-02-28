'use strict';

var Bacon = require('baconjs');
var matrix = require('../utils/matrix.js');

var pickCoords = ({pageX, pageY}) => [pageX, pageY];

exports.init = ({world, m, mI, tileSize, canvas}) => {
  var getMapTile = world.map.getTile(world.map);
  var offset = ([x, y]) => [x - canvas.offsetLeft, y - canvas.offsetTop];
  var inverseCoords = coords => matrix.transform(mI, coords);
  var normalizeCoords = ([a, b]) => [Math.floor(a/tileSize), Math.floor(b/tileSize)];

  var mousemoves = Bacon.fromEventTarget(canvas, 'mousemove');
  var pointerCoords = mousemoves.map(pickCoords);
  var pointerCanvasCoords = pointerCoords.map(offset);
  var pointerMapCoords = pointerCanvasCoords.map(inverseCoords);
  var pointerTileCoords = pointerMapCoords.map(normalizeCoords);
  var currentTile = pointerTileCoords.map(getMapTile);

  var mouseclicks = Bacon.fromEventTarget(canvas, 'click');
  var activeTile = mouseclicks
    .map(pickCoords).map(offset).map(inverseCoords).map(normalizeCoords).map(getMapTile);

  return {
    currentTile: currentTile.skipDuplicates().filter(Boolean),
    activeTile: activeTile.skipDuplicates().filter(Boolean)
  };
};
