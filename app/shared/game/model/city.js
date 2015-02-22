'use strict';

class City {
  static create ({
    position,
    population = 100 // jshint ignore:line
  }) {
    var city = new City();

    city.position = position;
    city.population = population;

    return city;
  }
}

module.exports = City;
