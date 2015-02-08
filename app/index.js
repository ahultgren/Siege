'use strict';

var game = require('./game');

var testGame = game.create({
  width: 20,
  height: 20
});

var clGraphics = {
  sea: '~~',
  land: '██',
  forest: '▒▒',
  mountain: '▲▲',
  default: '  ',
};

var drawMap = (map) => {
  console.log(map.rows.map((row) => {
    return row.map(({type}) => {
      return clGraphics[type] || clGraphics.default
    })
    .join('');
  })
  .join('\n'));
};

drawMap(testGame.map);
