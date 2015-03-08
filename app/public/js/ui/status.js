'use strict';

var $ = require('../utils/elem');

exports.init = (selector, currentTile) => {
  var elem = $(selector);

  currentTile.map((tile) => {
    return `Position: ${tile.position.toString()}.
      Type: ${tile.type}.
      Terrain: ${tile.terrain || tile.type}
    `;
  }).assign(elem, 'html');
};
