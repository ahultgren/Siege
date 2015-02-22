'use strict';

exports.init = ({state, world}) => {
  require('./status.js').init('#status', state.currentTile);
  require('./info.js').init('#info', state.activeTile, world);
};
