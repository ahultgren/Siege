'use strict';

var POPULATION_INCREASE_FACTOR = 0.1;

class City {
  static create ({
    position,
    population = 100, // jshint ignore:line
    food = 0, // jshint ignore:line
    maxFood = 300, // jshint ignore:line
    productionLevel = 2, // jshint ignore:line
    focus = 'gold', // jshint ignore:line
    production = undefined, // jshint ignore:line
    productionFinishedIn = 0, // jshint ignore:line
    turnHasBegun = false // jshint ignore:line
  }) {
    var city = new City();

    city.position = position;
    city.population = population;
    city.food = food;
    city.maxFood = maxFood;
    city.productionLevel = productionLevel;
    city.focus = focus;
    city.production = production;
    city.productionFinishedIn = productionFinishedIn;
    city.turnHasBegun = turnHasBegun;

    return city;
  }

  get foodOutput () {
    if(this.focus === 'food') {
      // [TODO] Get surrounding tile-values
      return this.population * this.productionLevel - this.population;
    }
    else {
      // [TODO] min(max possible ouput, minimum required output)
      return this.population;
    }
  }

  get goldOutput () {
    if(this.focus === 'gold') {
      // [TODO] Need some factor for gold vs food production
      return (this.population * this.productionLevel - this.foodOutput) / 2;
    }
    else {
      return 0;
    }
  }

  beginTurn () {
    if(!this.turnHasBegun) {
      this.population *= POPULATION_INCREASE_FACTOR;
      this.food += this.foodOutput;
      this.food -= this.population;
      this.turnHasBegun = true;

      if(this.productionFinishedIn > 0) {
        this.productionFinishedIn--;
      }

      if(this.production && !this.productionFinishedIn) {
        // [TODO] Deploy stuff
      }
    }
  }

  endTurn () {
    this.turnHasBegun = false;
  }

  produce (stuff) {
    //## Needs some atomic references and shit
    this.production = stuff;
    this.productionFinishedIn = 1;
  }
}

module.exports = City;
