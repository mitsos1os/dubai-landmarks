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
const DEFAULT_PARSE_PREFIX = '/parse';
/**
 * Default mount path for Parse Dashboard
 * @type {string}
 */
const DEFAULT_PARSE_DASHBOARD_PATH = '/dashboard';
const DEFAULT_APP_NAME = 'Dubai Landmarks';
const DEFAULT_DASHBOARD_USER_ID = '';
const DEFAULT_DASHBOARD_USER_PASS = 'password_pou_den_spaei';

/* ------- Environment variables ----------- */
const {
  env: {
    APP_ID: appId,
    MASTER_KEY: masterKey,
    DB_URI: databaseURI = DEFAULT_DB_URI,
    SERVER_URL: serverURL,
    PUBLIC_SERVER_URL: publicServerURL,
    SERVER_PORT,
    FILE_KEY: fileKey,
    PHOTO_WIDTH,
    PHOTO_HEIGHT,
    APP_NAME: appName = DEFAULT_APP_NAME,
    SERVER_HOST: serverHost = DEFAULT_SERVER_HOST,
    SERVER_PROTOCOL: serverProtocol = DEFAULT_PROTOCOL,
    PARSE_PREFIX: parsePrefix = DEFAULT_PARSE_PREFIX,
    PARSE_DASHBOARD_PATH: parseDashboardPath = DEFAULT_PARSE_DASHBOARD_PATH,
    DASHBOARD_ENABLE: dashboardEnable,
    PARSE_DASHBOARD_USER_ID: dashboardUserId = DEFAULT_DASHBOARD_USER_ID,
    PARSE_DASHBOARD_USER_PASSWORD: dashboardPassword = DEFAULT_DASHBOARD_USER_PASS,
  },
} = process;

/**
 * Helper util to parse environment values which are strings as numbers
 *
 * @param {string} envVar
 * @param {number} defaultValue
 * @param {string} varName
 * @returns {?number}
 */
const parseIntEnvironment = (envVar, defaultValue, varName) => {
  assert(
    Number.isFinite(defaultValue),
    'Invalid default value for integer environment variable'
  );
  const result = (envVar && parseInt(envVar, 10)) || defaultValue;
  assert(
    !Number.isNaN(result),
    `Env variable ${varName} cannot be converted to integer`
  );
  return result;
};

/**
 * Accept an environment variable and parse it to its boolean equivalent. True
 * can be produced from either `true` or `TRUE` as values
 *
 * @param {string} [envVar]
 * @param {boolean} [defaultValue = false] - The default value to return
 * @returns {boolean}
 */
const parseBooleanEnvironment = (envVar, defaultValue = false) => {
  assert.strictEqual(
    typeof defaultValue,
    'boolean',
    'Invalid default boolean value'
  );
  return typeof envVar === 'string' && envVar.toLowerCase() === 'true'
    ? true
    : defaultValue;
};

const genericConfig = {
  serverHost,
  serverPort: parseIntEnvironment(SERVER_PORT, DEFAULT_PORT, 'SERVER_PORT'),
  serverProtocol,
  parsePrefix,
  parseDashboardPath,
  dashboardEnable: parseBooleanEnvironment(dashboardEnable, true),
  photoWidth: parseIntEnvironment(
    PHOTO_WIDTH,
    DEFAULT_PHOTO_WIDTH,
    'PHOTO_WIDTH'
  ),
  photoHeight: parseIntEnvironment(
    PHOTO_HEIGHT,
    DEFAULT_PHOTO_HEIGHT,
    'PHOTO_HEIGHT'
  ),
};

/* ------ Config value generation ------ */
const finalServerUrl = `${serverProtocol}://${serverHost}:${genericConfig.serverPort}${parsePrefix}`;

const config = {
  parse: {
    appId,
    masterKey,
    databaseURI,
    serverURL: serverURL || finalServerUrl,
    publicServerURL: publicServerURL || finalServerUrl,
    fileKey,
    appName,
    allowClientClassCreation: false, // disable client creating classes
    cloud: './cloud/main.js', // the main entrypoint for our cloud code
  },
  generic: genericConfig,
  dashboard: {
    dashboardUserId,
    dashboardPassword,
  },
};
/* ------- Validation/conversion of values ---------*/
// required values for parse config
['appId', 'masterKey', 'databaseURI', 'serverURL', 'appName'].forEach(
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
