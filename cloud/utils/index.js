'use strict';

const init = require('./init');
const loadCLPs = require('./loadCLPs');
const loadFiles = require('./loadFiles');
const photo = require('./photo');

module.exports = {
  ...init,
  ...loadCLPs,
  ...loadFiles,
  ...photo,
};
