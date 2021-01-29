'use strict';

const landmarkSchema = new Parse.Schema('Landmark');

// define schema properties
landmarkSchema
  .addString('title')
  .addArray('location')
  .addString('url')
  .addString('shot_info')
  .addString('description')
  .addNumber('order');

// add indexes
landmarkSchema.addIndex('orderIndex', { order: 1 });

module.exports = landmarkSchema;
