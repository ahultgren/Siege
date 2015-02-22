'use strict';

exports.init = ({state}) => {
  require('./status.js').init('#status', state.currentTile);
  require('./info.js').init('#info', state.activeTile);
};
