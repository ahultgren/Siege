'use strict';

var Bacon = require('baconjs');

exports.init = () => {
  return {
    currentTile: new Bacon.Bus(),
    activeTile: new Bacon.Bus(),
    activeUnit: new Bacon.Bus(),
    endTurn: new Bacon.Bus(),
  };
};
