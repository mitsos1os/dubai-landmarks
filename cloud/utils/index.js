'use strict';

const init = require('./init');
const loadCLPs = require('./loadCLPs');
const loadFiles = require('./loadFiles');
const photo = require('./photo');
const fileUtils = require('./parseFiles');

module.exports = {
  ...init,
  ...loadCLPs,
  ...loadFiles,
  ...photo,
  ...fileUtils,
};
