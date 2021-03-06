'use strict';

var Bacon = require('baconjs');
var R = require('ramda');
var $ = require('../utils/elem');
var noop = x=>x;

var targetMatches = R.curry((selector, {target}) => target.matches(selector));

var renderCity = (city, world) => {
  if(!city) {
    return '';
  }

  var producing = '';
  var player = world.players.filter((player) => player.cities.indexOf(city) > -1)[0];

  if(city.production) {
    producing = `<div>Producing: ${city.production}</div>`;
  }

  return `${/*thanks jshint*/''}
    <div class="info-box info-city">
      <h2>City ${''}</h2>
      <div>Player: ${player.id}</div>
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

var renderUnits = (units) => {
  if(!units.length) {
    return '';
  }

  var unitString = units.map((unit) => {
    return `${/*thanks jshint*/''}
      <li
        id="${unit.id}"
        class="info-unit ${unit.active ? 'info-unit--active' : ''}"
        action="moveUnit"
      >${unit.type} (${unit.movesLeft})</li>
    `;
  }).join('');

  return `${/*thanks jshint*/''}
    <div class="info-box info-units">
      <h2>Units</h2>
      <ul>
        ${unitString}
      </ul>
    </div>
  `;
};

exports.init = (selector, {activeTile, activeUnit, endTurn}, world) => {
  var elem = $(selector);
  var clicks = Bacon.fromEventTarget(elem.get(), 'click');

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

  activeUnit.plug(
    clicks.filter(targetMatches('[action="moveUnit"]'))
    .map(R.path('target.id'))
    .map(world.getUnitById.bind(world))
    .merge(clicks.filter(targetMatches(':not([action="moveUnit"])'))
      .merge(activeTile).map(R.always(false)))
  );

  var activeChanged = activeUnit.scan({}, (lastActive, unit) => {
    lastActive.active = false;

    if(unit) {
      unit.active = true;
      return unit;
    }
    else {
      return {};
    }
  });

  // [TODO] Listen on model changes of active tile somehow?
  var reRenderEvents = activeTile.sampledBy(activeTile.merge(clicks).merge(endTurn).merge(activeChanged.changes()));

  reRenderEvents.map((tile) => {
    var city = world.getCityOn(tile);
    var units = world.getUnitsOn(tile);

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
      ${renderCity(city, world)}
      ${renderUnits(units)}
    `;
  }).assign(elem, 'html');
};
