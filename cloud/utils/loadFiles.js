'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert').strict;

/**
 * Accept a path and a regexp and return all files loaded that match that
 * expression
 * @param {string} dirPath
 * @param {RegExp} [matchExpr] - Default to an expression matching not `index` files
 * @returns {Array<*>}
 */
const loadFiles = (dirPath, matchExpr = /^((?!index).)*$/) => {
  assert(dirPath && typeof dirPath === 'string', 'Invalid dirPath');
  assert(matchExpr instanceof RegExp, 'Invalid matchExpr');
  const files = fs.readdirSync(dirPath);
  const matchingFields = files.filter((file) => matchExpr.test(file));
  return matchingFields.map((file) => {
    const fullFilePath = path.resolve(dirPath, file);
    // eslint-disable-next-line global-require,import/no-dynamic-require
    return require(fullFilePath);
  });
};

exports.loadFiles = loadFiles;
