'use strict';

const Promise = require('bluebird');
const { addCLPToSchema, loadFiles } = require('../utils');

/**
 * System schemas created by default from Parse
 * @type {string[]}
 */
const SYSTEM_SCHEMAS = ['_User', '_Role'];

/**
 * Helper function for retrieving schemas in the system.
 * For consistency reasons, it will retry until all system schemas are created
 * when first boot
 *
 * @returns {Promise<Parse.Schema[]>}
 */
const getSystemSchemas = async () => {
  let allSchemas;
  let systemSchemasCreated = false;
  // define the function out of the loop
  const systemSchemaChecker = (systemSchemaName) =>
    allSchemas.some(({ className }) => systemSchemaName === className);
  while (!systemSchemasCreated) {
    try {
      // eslint-disable-next-line no-await-in-loop
      allSchemas = await Parse.Schema.all();
    } catch (err) {
      if (err.message === 'Schema not found.') {
        // no way to get db initialization for first app run. Query will throw for
        // no data in response
        allSchemas = [];
      } else {
        // other error
        throw err; // propagate
      }
    }
    systemSchemasCreated = SYSTEM_SCHEMAS.every(systemSchemaChecker);
    if (!systemSchemasCreated) {
      console.log('System schemas not yet initialized... will retry');
      // eslint-disable-next-line no-await-in-loop
      await Promise.delay(500); // wait 500 ms before retrying
    }
  }
  return allSchemas;
};

/**
 * Helper function to check what schemas already exist in the database and
 * initialize only the missing ones
 *
 * @returns {Promise<Parse.Schema[]>}
 */
const initSchemas = async () => {
  const schemasArray = loadFiles(__dirname);
  const allSchemas = await getSystemSchemas();
  const existingSchemaNames = allSchemas.map(({ className }) => className);
  await Promise.mapSeries(
    [
      // run in series to make sure schemas first created
      () =>
        Promise.map(
          schemasArray.filter(
            (schema) => !existingSchemaNames.includes(schema.className)
          ),
          (schema) => {
            console.log(`Initializing schema ${schema.className}`);
            return schema.save();
          }
        ),
      // add Class level permissions to all schemas
      () => Promise.map(schemasArray, (schema) => addCLPToSchema(schema)),
    ],
    (fn) => fn()
  );
  return schemasArray;
};

module.exports = {
  initSchemas,
};
