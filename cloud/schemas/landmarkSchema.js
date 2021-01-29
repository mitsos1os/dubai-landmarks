'use strict';

const landmarkSchema = new Parse.Schema('Landmark');
const { ADMIN_ROLE, DEFAULT_ROLE, ROLE_KEY } = require('../constants');

// define schema properties
landmarkSchema
  .addString('title')
  .addArray('location')
  .addString('url')
  .addString('shot_info')
  .addString('description')
  .addNumber('order')
  .addFile('photo')
  .addFile('photo_thumb');

// Schema permissions
landmarkSchema.CLP = {
  [DEFAULT_ROLE]: ['get', 'find', 'count'],
  [ROLE_KEY + ADMIN_ROLE]: [
    'get',
    'find',
    'count',
    'create',
    'update',
    'delete',
    'addField',
  ],
};

// add indexes
landmarkSchema.addIndex('orderIndex', { order: 1 });

module.exports = landmarkSchema;
