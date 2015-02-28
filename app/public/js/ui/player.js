'use strict';

var Bacon = require('baconjs');
var R = require('ramda');
var assign = require('../utils/assign');

var targetMatches = R.curry((selector, {target}) => target.matches(selector));

var render = (world) => {
  var player = world.getCurrentPlayer();

  return `${/*thanks jshint*/''}
    Current player: ${player.id}
    <div class="player-box player-actions">
      <button action="endTurn">End turn</button>
    </div>
    <br>
    Gold: ${player.gold}
  `;
};

exports.init = (selector, activeTile, world) => {
  var elem = document.querySelector(selector);
  var clicks = Bacon.fromEventTarget(elem, 'click');
  var renderBox = R.partial(render, world);
  var endTurn = clicks.filter(targetMatches('[action="endTurn"]'));

  endTurn.onValue(() => world.endTurn());

  // [TODO] Listen to player or world model changes
  elem.innerHTML = renderBox();
  assign.assignContent(elem, activeTile.merge(endTurn).map(renderBox));
};
