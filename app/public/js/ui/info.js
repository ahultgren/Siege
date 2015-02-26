'use strict';

var Bacon = require('baconjs');
var R = require('ramda');
var assign = require('../utils/assign');

var targetMatches = R.curry((selector, {target}) => target.matches(selector));

var renderCity = (city) => {
  var producing = '';

  if(city.production) {
    producing = `<br>Producing: ${city.production}`;
  }

  return `<h2>City ${''}</h2>
  Population: ${city.population}
  ${producing}
  <br><button action="build-army">Build army</button>
  `;
};

exports.init = (selector, activeTile, world) => {
  var elem = document.querySelector(selector);
  var clicks = Bacon.fromEventTarget(elem, 'click');

  activeTile.sampledBy(clicks.filter(targetMatches('[action="build-army"]')))
  .map(tile => world.getCityOn(tile))
  .filter(city => !city.production)
  .onValue((city) => {
    city.produce('army');
  });

  // [TODO] Listen on model changes of active tile somehow?
  var reRenderEvents = activeTile.sampledBy(activeTile.merge(clicks));

  assign.assignContent(elem, reRenderEvents.map((tile) => {
    var city = world.getCityOn(tile);

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
