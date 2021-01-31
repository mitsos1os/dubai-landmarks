'use strict';

const roleSchema = new Parse.Schema('_Role');
const { ADMIN_ROLE, ROLE_KEY } = require('../constants');

// Schema permissions
roleSchema.CLP = {
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

module.exports = roleSchema;
