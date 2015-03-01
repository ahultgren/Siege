'use strict';

var R = require('ramda');

class Player {
  static create ({
    id,
    cities = [], // jshint ignore:line
    units = [], // jshint ignore:line
    gold = 0, // jshint ignore:line
    turnHasBegun = false  // jshint ignore:line
  }) {
    var player = new Player();

    player.id = id;
    player.cities = cities;
    player.units = units; // jshint ignore:line
    player.gold = gold;
    player.turnHasBegun = turnHasBegun;

    return player;
  }

  addCity (city) {
    this.cities.push(city);
  }

  addUnit (unit) {
    this.units.push(unit);
  }

  beginTurn (game) {
    if(!this.turnHasBegun) {
      this.cities.forEach(city => city.beginTurn(game));
      this.gold += this.cities.map(R.prop('goldOutput')).reduce(R.add, 0);
      this.turnHasBegun = true;
    }
  }

  endTurn () {
    this.cities.forEach(city => city.endTurn());
    this.turnHasBegun = false;
  }
}

module.exports = Player;
