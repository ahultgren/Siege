'use strict';

var defence = {
  river: 0,
  plains: 1,
  forest: 2,
  hill: 3,
  mountain: '-',
  water: '-',
};

var foraging = {
  river: 2,
  plains: 1,
  forest: 3,
  hill: 1,
  mountain: 0,
  water: 1,
};

var harvest = {
  river: 3,
  plains: 2,
  forest: 1,
  hill: 1,
  mountain: 0,
  water: 1,
};

var movementCost = {
  river: 2,
  plains: 1,
  forest: 2,
  hill: 2,
  mountain: 20,
  water: 20,
};

class Tile {
  static create ({
    map,
    position
  }) {
    var tile = new Tile();

    tile.map = map;
    tile.position = [...position];

    return tile;
  }

  get allAdjacent () {
    return this.map.getAllAdjacent(this.map, this);
  }

  get adjacent () {
    return this.map.getAdjacent(this.map, this);
  }

  get defence () {
    return defence[this.terrain];
  }

  get foraging () {
    return foraging[this.terrain];
  }

  get harvest () {
    return harvest[this.terrain];
  }

  get movementCost () {
    return movementCost[this.terrain];
  }
}

module.exports = Tile;
