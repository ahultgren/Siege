'use strict';

require('colors');

var game = require('./game');

var testGame = game.create({
  width: 20,
  height: 20
});

var clGraphics = {
  sea: '~~'.bgBlue.cyan,
  land: '  '.inverse,
  forest: '  '.bgGreen,
  hill: '▴▴'.inverse,
  mountain: '▲▲'.inverse,
  river: '——'.inverse,
  default: '  ',
};

var drawMap = (map) => {
  console.log(map.rows.map((row) => {
    return row.map(({type}) => clGraphics[type] || clGraphics.default).join('');
  })
  .join('\n'));
};

drawMap(testGame.map);
