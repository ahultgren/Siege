'use strict';

var isRiver = (tile) => tile.terrain === 'river';

/**
 * Find "holes" in a river, where a land or forest tile is adjacent to two river
 * tiles, which are themselves not adjacent to two other rivers nor to each other.
 */
exports.connect = (map) => {
  let tiles = map.getAllTiles(map);

  tiles.forEach(tile => {
    if(tile.type === 'land') {
      var adjacentTiles = tile.adjacent;
      var adjacentRivers = adjacentTiles.filter(isRiver);

      // If and only if adjacent to two river tiles
      if(adjacentRivers.length === 2) {
        // They're not next to each other
        if(!map.isNextToEachOther(map, adjacentRivers)) {
          let adjacentAreBusy = adjacentRivers
            .map((tile) => tile.adjacent.filter(isRiver).length >= 2)
            .some(Boolean);

          // Neither is already next to two rivers
          if(!adjacentAreBusy) {
            tile.terrain = 'river';
          }
        }
      }
    }
  });

  tiles.forEach(tile => {
    // Remove lonely river tiles
    if(isRiver(tile) && !tile.adjacent.filter(isRiver).length) {
      tile.terrain = 'plains';
    }
  });
};
