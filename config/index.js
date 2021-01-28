'use strict';

require('dotenv').config(); // load values from .env file
const assert = require('assert').strict;

/* ------- Default values ------ */
/**
 * The default port number for server to listen on
 * @type {number}
 */
const DEFAULT_PORT = 1337;

/**
 * The default photo width value used for resizing photos
 * @type {number}
 */
const DEFAULT_PHOTO_WIDTH = 250;

/**
 * The default photo height value used for resizing photos
 * @type {number}
 */
const DEFAULT_PHOTO_HEIGHT = 250;

/**
 * Default database URI
 * @type {string}
 */
const DEFAULT_DB_URI = 'mongodb://localhost:27017/dubai-landmarks';
/**
 * Default host where parse server will run
 * @type {string}
 */
const DEFAULT_SERVER_HOST = 'localhost';
/**
 * Default protocol used by parse server
 * @type {string}
 */
const DEFAULT_PROTOCOL = 'http';
/**
 * Default API Prefix for serving Parse API
 * @type {string}
 */
const DEFAULT_PARSE_PREFIX = 'parse';
const DEFAULT_APP_NAME = 'Dubai Landmarks';

/* ------- Environment variables ----------- */
const {
  env: {
    APP_ID: appId,
    MASTER_KEY: masterKey,
    DB_URI: databaseURI = DEFAULT_DB_URI,
    SERVER_URL: serverUrl,
    PUBLIC_SERVER_URL: publicServerURL,
    SERVER_PORT,
    FILE_KEY: fileKey,
    PHOTO_WIDTH,
    PHOTO_HEIGHT,
    APP_NAME: appName = DEFAULT_APP_NAME,
    SERVER_HOST: serverHost = DEFAULT_SERVER_HOST,
    SERVER_PROTOCOL: serverProtocol = DEFAULT_PROTOCOL,
    PARSE_PREFIX: parsePrefix = DEFAULT_PARSE_PREFIX,
  },
} = process;

/**
 * Helper util to parse environment values which are strings as numbers
 *
 * @param {string} envVar
 * @param {number} defaultValue
 * @returns {number}
 */
const parseIntEnvironment = (envVar, defaultValue) => {
  assert(
    envVar && typeof envVar === 'string',
    'Invalid environment variable to parse as int'
  );
  assert(
    Number.isFinite(defaultValue),
    'Invalid default value for integer environment variable'
  );
  const result = (envVar && parseInt(envVar, 10)) || defaultValue;
  assert(!Number.isNaN(result), `${envVar} cannot be converted to integer`);
  return result;
};

const genericConfig = {
  serverHost,
  serverPort: parseIntEnvironment(SERVER_PORT, DEFAULT_PORT),
  serverProtocol,
  parsePrefix,
  photoWidth: parseIntEnvironment(PHOTO_WIDTH, DEFAULT_PHOTO_WIDTH),
  photoHeight: parseIntEnvironment(PHOTO_HEIGHT, DEFAULT_PHOTO_HEIGHT),
};

/* ------ Config value generation ------ */
const finalServerUrl = `${serverProtocol}://${serverHost}:${genericConfig.serverPort}/${parsePrefix}`;

const config = {
  parse: {
    appId,
    masterKey,
    databaseURI,
    serverUrl: serverUrl || finalServerUrl,
    publicServerURL: publicServerURL || finalServerUrl,
    fileKey,
    appName,
  },
  generic: genericConfig,
};
/* ------- Validation/conversion of values ---------*/
// required values for parse config
['appId', 'masterKey', 'databaseURI', 'serverUrl', 'appName'].forEach(
  (prop) => {
    const configValue = config.parse[prop];
    assert(
      configValue && typeof configValue === 'string',
      `Missing value for property ${prop} in configuration. Please make sure to provide all required values for app initialization.`
    );
  }
);

// All Ok!

module.exports = config;
