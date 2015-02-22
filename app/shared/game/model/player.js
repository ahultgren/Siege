'use strict';

class Player {
  static create ({
    id,
    cities = [], // jshint ignore:line
    units = [] // jshint ignore:line
  }) {
    var player = new Player();

    player.id = id;
    player.cities = cities;
    player.units = units; // jshint ignore:line

    return player;
  }

  addCity (city) {
    this.cities.push(city);
  }
}

module.exports = Player;
