'use strict';

var assign = require('../utils/assign');

var defence = {
  river: 0,
  plains: 1,
  forest: 2,
  hill: 3,
  mountain: '-',
  water: '-',
};

var foraging = {
  river: 2,
  plains: 1,
  forest: 3,
  hill: 1,
  mountain: 0,
  water: 1,
};

var harvest = {
  river: 3,
  plains: 2,
  forest: 1,
  hill: 1,
  mountain: 0,
  water: 1,
};

var movementCost = {
  river: 2,
  plains: 1,
  forest: 2,
  hill: 2,
  mountain: 20,
  water: 20,
};

var renderCity = (city) => {
  return `<h2>City ${''}</h2>
  Population: ${city.population}
  `;
};

exports.init = (selector, activeTile, world) => {
  var elem = document.querySelector(selector);

  assign.assignContent(elem, activeTile.map((tile) => {
    var city = world.getCityOn(world, tile);

    return `<h1>Tile: ${tile.position}</h1>
    Defence bonus: ${defence[tile.terrain]}
    <br>
    Foraging: ${foraging[tile.terrain]}
    <br>
    Harvest: ${harvest[tile.terrain]}
    <br>
    Movement cost: ${movementCost[tile.terrain]}
    ${city && renderCity(city) || ''}
    <h2>Units</h2>
    <ul>
      <li>Placeholder</li>
      <li>Placeholder</li>
    </ul>
    `;
  }));
};
