'use strict';

const userSchema = new Parse.Schema('_User');
const { ADMIN_ROLE, ROLE_KEY } = require('../constants');

// Schema permissions
userSchema.CLP = {
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

module.exports = userSchema;
