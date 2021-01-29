'use strict';

const assert = require('assert').strict;
const {
  generic: { adminUsername, adminPassword },
} = require('../../config');
const { ADMIN_ROLE } = require('../constants');

/**
 * Function to keep up to date / create default admin user according to
 * credentials provided in environment variables ADMIN_USER and ADMIN_PASSWORD
 *
 * @returns {Promise<Parse.User>}
 */
const initDefaultUser = async () => {
  assert(
    adminUsername && typeof adminUsername === 'string',
    'Admin user not set, please provide env var ADMIN_USER'
  );
  assert(
    adminPassword && typeof adminPassword === 'string',
    'Admin password not set, please provide env var ADMIN_PASSWORD'
  );
  const userQuery = new Parse.Query(Parse.User);
  userQuery.equalTo('username', adminUsername);
  let adminUser = await userQuery.first({ useMasterKey: true });
  const userExists = !!adminUser;
  if (!userExists) {
    // user needs initialization
    adminUser = new Parse.User();
    adminUser.setUsername(adminUsername);
  }
  adminUser.setPassword(adminPassword); // make sure password matches given
  return userExists
    ? adminUser.save(null, { useMasterKey: true })
    : adminUser.signUp();
};

/**
 * Function that checks / initializes default administrator role
 * @returns {Promise<Parse.Role>}
 */
const initDefaultRole = async () => {
  const roleQuery = new Parse.Query(Parse.Role);
  roleQuery.equalTo('name', ADMIN_ROLE);
  let adminRole = await roleQuery.first({ useMasterKey: true });
  if (adminRole) return adminRole; // admin role already exists
  // admin role does not exist, needs creation
  const roleACL = new Parse.ACL();
  roleACL.setPublicReadAccess(false);
  roleACL.setPublicWriteAccess(false);
  adminRole = new Parse.Role(ADMIN_ROLE, roleACL);
  return adminRole.save(null, { useMasterKey: true });
};

const initDefaultUserRole = async () => {
  const [defaultAdminUser, defaultAdminRole] = await Promise.all([
    initDefaultUser(),
    initDefaultRole(),
  ]);
  defaultAdminRole.getUsers().add(defaultAdminUser);
  return defaultAdminRole.save(null, { useMasterKey: true });
};

module.exports = {
  initDefaultRole,
  initDefaultUser,
  initDefaultUserRole,
};
