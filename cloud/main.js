'use strict';

const { initSchemas } = require('./schemas');
require('./models');
const { initDefaultUserRole } = require('./utils');

/**
 * Initialization function for server logic
 * @returns {Promise<void>}
 */
const main = async () => {
  await Promise.all([
    initDefaultUserRole(),
    initSchemas(), // initialize schemas
  ]);
};

// prettier-ignore
main()
  .then('Cloud code initialized successfully')
  .catch((err) => {
    console.error('Error with cloud initialization', err);
    process.exit(err.code ?? 1);
  });