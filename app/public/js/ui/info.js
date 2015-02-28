'use strict';

var Bacon = require('baconjs');
var R = require('ramda');
var assign = require('../utils/assign');
var noop = x=>x;

var targetMatches = R.curry((selector, {target}) => target.matches(selector));

var renderCity = (city) => {
  var producing = '';

  if(city.production) {
    producing = `<div>Producing: ${city.production}</div>`;
  }

  return `${/*thanks jshint*/''}
    <div class="info-box info-city">
      <h2>City ${''}</h2>
      <div>Population: ${city.population}</div>
      <div>Focus: ${city.focus}</div>
      ${producing}
      <div><button action="build-army" ${city.production && 'disabled' || ''}>Build army</button></div>
      <div><button
        action="setFocus(${city.focus !== 'gold' ? 'gold' : 'food'})"
        >Focus on: ${city.focus !== 'gold' ? 'Gold' : 'Food'}</button></div>
    </div>
  `;
};

exports.init = (selector, activeTile, world) => {
  var elem = document.querySelector(selector);
  var clicks = Bacon.fromEventTarget(elem, 'click');

  activeTile.sampledBy(clicks.filter(targetMatches('[action="build-army"]')))
  .onValue((tile) => {
    world.setCityProduction(tile, 'army');
  });

  var makeGold = clicks.filter(targetMatches('[action="setFocus(gold)"]')).map('gold');
  var makeFood = clicks.filter(targetMatches('[action="setFocus(food)"]')).map('food');

  Bacon.when(
    [activeTile.toProperty(), makeFood.merge(makeGold)],
    (tile, whatToMake) => world.setCityFocus(tile, whatToMake)
  ).onValue(noop);

  // [TODO] Listen on model changes of active tile somehow?
  var reRenderEvents = activeTile.sampledBy(activeTile.merge(clicks));

  assign.assignContent(elem, reRenderEvents.map((tile) => {
    var city = world.getCityOn(tile);

    return `${/*thanks jshint*/''}
      <div class="info-box info-tile">
        <h1>Tile: ${tile.position}</h1>
        Defence bonus: ${tile.defence}
        <br>
        Foraging: ${tile.foraging}
        <br>
        Harvest: ${tile.harvest}
        <br>
        Movement cost: ${tile.movementCost}
      </div>
      ${city && renderCity(city) || ''}
      <div class="info-box info-units">
        <h2>Units</h2>
        <ul>
          <li>Placeholder</li>
          <li>Placeholder</li>
        </ul>
      </div>
    `;
  }));
};
