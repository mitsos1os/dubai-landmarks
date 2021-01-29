'use strict';

const Promise = require('bluebird');
const landmarkSchema = require('./landmarkSchema');
const { addCLPToSchema } = require('../utils/loadCLPs');

const schemasArray = [landmarkSchema];

/**
 * Helper function to check what schemas already exist in the database and
 * initialize only the missing ones
 *
 * @returns {Promise<ParseSchema[]>}
 */
const initSchemas = async () => {
  let allSchemas;
  try {
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
  const existingSchemaNames = allSchemas.map(({ className }) => className);
  return Promise.map(
    schemasArray.filter(
      (schema) => !existingSchemaNames.includes(schema.className)
    ),
    (schema) => {
      console.log(`Initializing schema ${schema.className}`);
      return schema.save().then(() => addCLPToSchema(schema));
    }
  );
};

module.exports = {
  landmarkSchema,
  initSchemas,
};
