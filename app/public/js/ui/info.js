'use strict';

var assign = require('../utils/assign');

var defence = {
  river: 0,
  plains: 1,
  forest: 2,
  hill: 3,
  mountain: '-'
};

var foraging = {
  river: 3,
  plains: 1,
  forest: 3,
  hill: 2,
  mountain: '-'
};

var harvest = {
  river: 4,
  plains: 3,
  forest: 1,
  hill: 1,
  mountain: '-'
};

exports.init = (selector, activeTile) => {
  var elem = document.querySelector(selector);

  assign.assignContent(elem, activeTile.map((tile) => {
    console.log(defence[tile.terrain]);
    return `<h1>Tile: ${tile.position}</h1>
    Defence bonus: ${defence[tile.terrain]}
    <br>
    Foraging: ${foraging[tile.terrain]}
    <br>
    Harvest: ${harvest[tile.terrain]}
    <h2>Units</h2>
    <ul>
      <li>Placeholder</li>
      <li>Placeholder</li>
    </ul>
    `;
  }));
};
