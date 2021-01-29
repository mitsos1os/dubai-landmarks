'use strict';

const init = require('./init');
const loadCLPs = require('./loadCLPs');
const loadFiles = require('./loadFiles');

module.exports = {
  ...init,
  ...loadCLPs,
  ...loadFiles,
};
