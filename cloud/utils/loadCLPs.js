'use strict';

/* eslint-disable no-param-reassign */

const {
  parse: { serverURL, appId, masterKey },
} = require('../../config');
const superagent = require('superagent');
const assert = require('assert').strict;

/**
 * Accept a schema with defined CLPs and return appropriate form for saving in
 * server
 *
 * @param {Parse.Schema} schema
 * @param {Object<string: string[]>} schema.CLP
 * @returns {Object<string, Object<string, boolean>>}
 */
const createCLP = (schema) => {
  const { CLP } = schema || {};
  assert.notStrictEqual(
    typeof CLP,
    'undefined',
    `Could not find schema CLP for ${schema.className}`
  );
  return Object.entries(CLP).reduce((final, [role, permissions]) => {
    permissions.forEach((perm) => {
      if (!final.hasOwnProperty(perm)) final[perm] = {};
      final[perm][role] = true;
    });
    return final;
  }, {});
};

/**
 * Accept a schema and set a request to the server adding CLP to the schema
 *
 * @param {Parse.Schema} schema
 * @returns {Promise<void>}
 */
const addCLPToSchema = async (schema) => {
  assert(schema && typeof schema === 'object', 'Invalid schema provided');
  if (typeof schema.CLP !== 'object') return null; // nothing to do if no CLP in schema
  const updateObj = { classLevelPermissions: createCLP(schema) };
  const { className: schemaName } = schema;
  console.log(`Adding CLP to schema: ${schemaName}`);
  return superagent
    .put(`${serverURL}/schemas/${schemaName}`)
    .send(updateObj)
    .set('X-Parse-Application-ID', appId)
    .set('X-Parse-Master-Key', masterKey);
};

module.exports = {
  createCLP,
  addCLPToSchema,
};
