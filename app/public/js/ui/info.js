'use strict';

var assign = require('../utils/assign');

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
    Defence bonus: ${tile.defence}
    <br>
    Foraging: ${tile.foraging}
    <br>
    Harvest: ${tile.harvest}
    <br>
    Movement cost: ${tile.movementCost}
    ${city && renderCity(city) || ''}
    <h2>Units</h2>
    <ul>
      <li>Placeholder</li>
      <li>Placeholder</li>
    </ul>
    `;
  }));
};
