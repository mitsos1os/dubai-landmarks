'use strict';

const landmarkSchema = require('../schemas/landmarkSchema');

class Landmark extends Parse.Object {
  constructor() {
    super('Landmark');
  }
}

/**
 * The schema reference for the class to use
 * @type {Parse.Schema}
 */
Landmark.schema = landmarkSchema;

module.exports = Landmark;
