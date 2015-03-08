'use strict';

var Bacon = require('baconjs');
var R = require('ramda');
var $ = require('../utils/elem');

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

exports.init = (selector, state, world) => {
  var elem = $(selector);
  var clicks = Bacon.fromEventTarget(elem.get(), 'click');
  var renderBox = R.partial(render, world);
  var endTurn = clicks.filter(targetMatches('[action="endTurn"]'));

  endTurn.onValue(() => world.endTurn());

  state.endTurn.plug(endTurn);

  // [TODO] Listen to player or world model changes
  elem.html(renderBox());
  state.activeTile.merge(endTurn).map(renderBox).assign(elem, 'html');
};
