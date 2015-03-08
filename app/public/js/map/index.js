'use strict';

var Bacon = require('baconjs');
var matrix = require('../utils/matrix.js');
var render = require('./render');

var pickCoords = ({pageX, pageY}) => [pageX, pageY];

exports.init = ({state, canvas, ctx, world, tileSize, m, mI}) => {
  var getMapTile = world.map.getTile(world.map);
  var offset = ([x, y]) => [x - canvas.offsetLeft, y - canvas.offsetTop];
  var inverseCoords = coords => matrix.transform(mI, coords);
  var normalizeCoords = ([a, b]) => [Math.floor(a/tileSize), Math.floor(b/tileSize)];

  var mousemoves = Bacon.fromEventTarget(canvas, 'mousemove');
  var currentTile = mousemoves
    .map(pickCoords).map(offset).map(inverseCoords).map(normalizeCoords).map(getMapTile);

  var mouseclicks = Bacon.fromEventTarget(canvas, 'click');
  var activeTile = mouseclicks
    .map(pickCoords).map(offset).map(inverseCoords).map(normalizeCoords).map(getMapTile);

  state.currentTile.plug(currentTile.skipDuplicates().filter(Boolean));
  state.activeTile.plug(activeTile.skipDuplicates().filter(Boolean));

  var hoveredChanged = state.currentTile.scan({}, (lastTile, tile) => {
    lastTile.hovered = false;
    tile.hovered = true;
    return tile;
  });

  var activeChanged = state.activeTile.scan({}, (lastActive, tile) => {
    lastActive.active = false;
    tile.active = true;
    return tile;
  });

  Bacon.combineAsArray(
    state.activeUnit.toProperty(false),
    hoveredChanged,
    activeChanged,
    state.endTurn.toProperty(0)
  ).onValue(([activeUnit]) => {
    render(ctx, world, tileSize, activeUnit);
  });
};
