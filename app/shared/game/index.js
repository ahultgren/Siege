'use strict';

var R = require('ramda');
var map = require('./model/map');
var patchmaker = require('./area').patch;
var topology = require('./topology');
var river = require('./river');
var Player = require('./model/player');
var City = require('./model/city');

/* Helpers
============================================================================= */

var range0 = R.times(R.identity);
var setType = R.curry((value, target) => target.type = value);
var setTerrain = R.curry((value, target) => target.terrain = value);

var randomInt = (n = 1) => Math.floor(Math.random() * n);
var getRandom = (source) => source[randomInt(source.length)];
var tileIs = (on) => (tile) => tile.type === on;

var makePatch = R.curryN(4, (world, origin, size, setter, on) => {
  var patch = patchmaker({
    source: world,
    patch: [origin],
    size,
    pushCondition: tileIs(on)
  });

  patch.forEach(setter());

  return patch;
});

/* API
============================================================================= */

exports.create = ({width, height, players = 2}) => { // jshint ignore:line
  var game = Object.create(exports);

  var world = game.map = map.create({ width, height });
  var makeWorldPatch = makePatch(world);
  var noOfTiles = width * height;
  var centerTile = world.getTile(world, [Math.floor(width/2), Math.floor(height/2)]);

  // Turn world into sea
  world.getAllTiles(world).forEach(setType('sea'));

  // Make land
  var landTiles = makeWorldPatch(centerTile, noOfTiles/2, R.lPartial(setType, 'land'), 'sea');

  // Default to plains
  landTiles.forEach(setTerrain('plains'));

  // Make topology
  topology.generate(landTiles, ['river', 'river', 'river', 'river', 'plains', 'plains', 'plains', 'plains', 'plains', 'hill', 'mountain', 'mountain', 'mountain', 'mountain']);

  // Add forests
  range0(randomInt(3) + 4).forEach(() => {
    makeWorldPatch(getRandom(landTiles), randomInt(10) + 10, R.lPartial(setTerrain, 'forest'), 'land');
  });

  // Connect rivers
  river.connect(world);

  // Create players, give them a city each
  game.players = R.range(0, players).map((id) => Player.create({id}));
  game.currentPlayer = 0;

  game.players.forEach((player) => {
    var tile = getRandom(landTiles.filter(R.not(R.propEq('terrain', 'mountain'))));
    var city = City.create(tile);

    player.addCity(city);
  });

  return game;
};

exports.getCurrentPlayer = (game) => {
  return game.players[game.currentPlayer];
};

exports.getAllCities = (game) => {
  return [].concat(...game.players.map(player => player.cities));
};

exports.getCityOn = (game, {position}) => {
  //## Figure out which tiles are visible
  return exports.getAllCities(game)
    .filter(city => city.position[0] === position[0] && city.position[1] === position[1])[0];
};
