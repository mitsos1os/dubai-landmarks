'use strict';

const Promise = require('bluebird');
const landmarkSchema = require('./landmarkSchema');

const schemasArray = [landmarkSchema];

/**
 * Helper function to check what schemas already exist in the database and
 * initialize only the missing ones
 *
 * @returns {Promise<ParseSchema[]>}
 */
const initSchemas = async () => {
  const allSchemas = await Parse.Schema.all();
  const existingSchemaNames = allSchemas.map(({ className }) => className);
  return Promise.map(
    schemasArray.filter(
      (schema) => !existingSchemaNames.includes(schema.className)
    ),
    (schema) => schema.save()
  );
};

module.exports = {
  landmarkSchema,
  initSchemas,
};
