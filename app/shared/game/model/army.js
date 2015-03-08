'use strict';

var generateId = () => {
  return Math.random().toString(16).substring(2);
};

class Army {
  static create ({
    id,
    position,
    movesLeft = 3 // jshint ignore:line
  }) {
    var army = new Army();

    army.id = id || generateId();
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
