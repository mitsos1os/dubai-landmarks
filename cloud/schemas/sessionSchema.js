'use strict';

const sessionSchema = new Parse.Schema('_Session');
const { ADMIN_ROLE, ROLE_KEY } = require('../constants');

// Schema permissions
sessionSchema.CLP = {
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

module.exports = sessionSchema;
