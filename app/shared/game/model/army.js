'use strict';

class Army {
  static create ({
    position,
    movesLeft = 3 // jshint ignore:line
  }) {
    var army = new Army();

    army.type = 'army';
    army.position = position;
    army.movesLeft = movesLeft;

    return army;
  }

  move ([x, y]) {
    //## Make sure it's within reach?
    this.position = [x, y];
  }
}

module.exports = Army;
