'use strict';

const { initSchemas } = require('./schemas');
require('./models');
const { initDefaultUserRole } = require('./utils');
const Promise = require('bluebird');

/**
 * Initialization function for server logic
 * @returns {Promise<void>}
 */
const main = async () => {
  await Promise.mapSeries(
    [
      initDefaultUserRole,
      initSchemas, // initialize schemas
    ],
    (fn) => fn()
  );
};

// prettier-ignore
main()
  .then('Cloud code initialized successfully')
  .catch((err) => {
    console.error('Error with cloud initialization', err);
    process.exit(err.code ?? 1);
  });
