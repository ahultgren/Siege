'use strict';

var Bacon = require('baconjs');
var game = require('../../shared/game');
var Canvas = require('./canvas');

var width = 16;
var height = 16;
var tileSize = 40;
var widthPx = width * tileSize;
var heightPx = height * tileSize;

var world = game.create({
  width,
  height
});

var skewAngle = Math.PI/4;
var heightAngle = Math.PI/4;

var canvas = Canvas('#world', widthPx / Math.cos(skewAngle), heightPx);
var ctx = canvas.getContext('2d');

// Isometric canvas

var cs = Math.cos(skewAngle);
var sn = Math.sin(skewAngle);
var h = Math.cos(heightAngle);

var a = 1*cs,   c = -1*sn,  e = canvas.width/2;
var b = h*1*sn, d = h*1*cs, f = 0;

var matrix = require('./utils/matrix.js');

var m = [a, b, c, d, e, f];
var mI = matrix.inverse3x2(m);

ctx.setTransform(...m);

// Draw tiles

var map = require('./map');

map.render(ctx, world, tileSize);

// Pointer handling

var getMapTile = world.map.getTile(world.map);
var mousemoves = Bacon.fromEventTarget(canvas, 'mousemove');
var pointerCanvasCoords = mousemoves.map(({pageX, pageY}) => [pageX, pageY]);
var pointerMapCoords = pointerCanvasCoords.map(coords => matrix.transform(mI, coords));
var pointerTileCoords = pointerMapCoords.map(([a, b]) => [Math.floor(a/tileSize), Math.floor(b/tileSize)]);
var currentTile = pointerTileCoords.map(coords => getMapTile(coords));

currentTile.skipDuplicates().filter(Boolean).onValue(function (tile) {
  tile.hovered = true;
  map.render(ctx, world, tileSize);
  tile.hovered = false;
});
