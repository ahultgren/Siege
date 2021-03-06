'use strict';

var R = require('ramda');

var Map = require('./map');
var Player = require('./player');
var City = require('./city');

var patchmaker = require('../area').patch;
var topography = require('../topography');
var river = require('../river');
var types = require('./types');

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

class Game {
  static create ({
    width,
    height,
    players = 2 // jshint ignore:line
  }) {
    var game = new Game();

    game.width = width;
    game.height = height;
    game.noOfPlayers = players;
    game.map = Map.create({ width, height });

    game.init();

    return game;
  }

  init () {
    this.makeSea_();
    this.makeLand_();
    this.makeTopography_();
    this.makeForests_();
    this.makeRivers_();
    this.makePlayers_();
    this.beginTurn();
  }

  getCurrentPlayer () {
    return this.players[this.currentPlayer];
  }

  getAllCities () {
    return [].concat(...this.players.map(player => player.cities));
  }

  getAllUnits () {
    return [].concat(...this.players.map(player => player.units));
  }

  getCityOn ({position}) {
    //## Figure out which tiles are visible
    return this.getAllCities()
      .filter(city => city.position[0] === position[0] && city.position[1] === position[1])[0];
  }

  getUnitsOn ({position}) {
    //## Figure out which tiles are visible
    return this.getAllUnits()
      .filter(unit => unit.position[0] === position[0] && unit.position[1] === position[1]);
  }

  getUnitById (id) {
    //## Figure out which tiles are visible
    return this.getAllUnits().filter(unit => unit.id === id)[0];
  }

  beginTurn () {
    this.getCurrentPlayer().beginTurn(this);
  }

  endTurn () {
    this.getCurrentPlayer().endTurn();

    this.currentPlayer++;
    if(this.currentPlayer === this.noOfPlayers) {
      this.currentPlayer = 0;
    }

    this.beginTurn();
  }

  setCityProduction ({position}, stuff) {
    var city = this.getCityOn({position});
    city.produce(stuff);
  }

  setCityFocus ({position}, whatToMake) {
    var city = this.getCityOn({position});
    city.focus = whatToMake;
  }

  deploy ({position}, type) {
    var unit = types[type].create({position});

    switch (type) {
      case 'city':
        this.getCurrentPlayer().addCity(unit);
        break;
      case 'army':
        this.getCurrentPlayer().addUnit(unit);
        break;
    }
  }

  /* Private
  ============================================================================= */

  makeSea_ () {
    var seaTiles = this.map.getAllTiles(this.map);

    seaTiles.forEach(setType('sea'));
    seaTiles.forEach(setTerrain('water'));
  }

  makeLand_ () {
    var {width, height} = this.map;
    var noOfTiles = width * height;
    var centerTile = this.map.getTile(this.map, [Math.floor(width/2), Math.floor(height/2)]);

    makePatch(this.map, centerTile, noOfTiles/2, R.partial(setType, 'land'), 'sea')
    .forEach(setTerrain('plains'));
  }

  makeTopography_ () {
    var landTiles = this.map.getAllTiles(this.map).filter(R.propEq('type', 'land'));

    topography.generate(landTiles, [
      'river',
      'river',
      'river',
      'river',
      'river',
      'plains',
      'plains',
      'plains',
      'plains',
      'plains',
      'hill',
      'mountain',
      'mountain',
      'mountain',
      'mountain'
    ]);
  }

  makeForests_ () {
    var landTiles = this.map.getAllTiles(this.map).filter(R.propEq('type', 'land'));
    var variation = this.map.width/2;
    var min = this.map.height/2;

    range0(randomInt(3) + 3).forEach(() => {
      makePatch(this.map, getRandom(landTiles), randomInt(variation) + min, R.partial(setTerrain, 'forest'), 'land');
    });
  }

  makeRivers_ () {
    river.connect(this.map);
  }

  makePlayers_ () {
    var landTiles = this.map.getAllTiles(this.map).filter(R.propEq('type', 'land'));

    this.players = R.range(0, this.noOfPlayers).map((id) => Player.create({id}));
    this.currentPlayer = 0;

    this.players.forEach((player) => {
      var tile = getRandom(landTiles.filter(R.not(R.propEq('terrain', 'mountain'))));
      var city = City.create(tile);

      player.addCity(city);
    });
  }
}

module.exports = Game;
