'use strict';

exports.init = ({state, world}) => {
  require('./status').init('#status', state.currentTile);
  require('./info').init('#info', state.activeTile, world);
  require('./player').init('#player', state.activeTile, world);
};
