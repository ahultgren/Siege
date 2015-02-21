'use strict';

var assign = require('../utils/assign');

exports.init = (selector, currentTile) => {
  var elem = document.querySelector(selector);

  assign.assignContent(elem, currentTile.map((tile) => {
    return `Position: ${tile.position.toString()}.
      Type: ${tile.type}.
      Terrain: ${tile.terrain || tile.type}
    `;
  }));
};
