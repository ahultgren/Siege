'use strict';

class Army {
  static create ({position}) {
    var army = new Army();

    army.type = 'army';
    army.position = position;

    return army;
  }

  move ([x, y]) {
    this.position = [x, y];
  }
}

module.exports = Army;
