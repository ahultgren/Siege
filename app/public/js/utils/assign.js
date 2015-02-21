'use strict';

/**
 * Utilities for bind streams to dom elements
 */

exports.assignContent = (target, stream) => {
  if(target) {
    stream.onValue((value) => target.innerHTML = value);
  }
};
