'use strict';

/**
 * The name of the administartor role in the application
 * @type {string}
 */
const ADMIN_ROLE = 'Administrator';

/**
 * Default Role wildcard
 * @type {string}
 */
const DEFAULT_ROLE = '*';

/**
 * Key for role signature in ACL / CLPs
 * @type {string}
 */
const ROLE_KEY = 'role:';

module.exports = {
  ADMIN_ROLE,
  DEFAULT_ROLE,
  ROLE_KEY,
};
