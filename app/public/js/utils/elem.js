'use strict';

/**
 * Micro jquery
 */

class Elem {
  constructor (selector, parent) {
    this.elems = Array.prototype.slice.call(parent.querySelectorAll(selector));
  }

  get (i = 0) {
    return this.elems[i];
  }

  html (html) {
    this.elems.forEach(elem => elem.innerHTML = html);

    return this;
  }
}

module.exports = function (selector, parent = document) {
  return new Elem(selector, parent);
};
