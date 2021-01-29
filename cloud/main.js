'use strict';

const { initSchemas } = require('./schemas');
const { Landmark } = require('./models');

/**
 * Initialization function for server logic
 * @returns {Promise<void>}
 */
const main = async () => {
  await initSchemas(); // initialize schemas
};

// prettier-ignore
main()
  .then('Cloud code initialized successfully')
  .catch((err) => {
    console.error('Error with cloud initialization', err);
    process.exit(err.code ?? 1);
  });
