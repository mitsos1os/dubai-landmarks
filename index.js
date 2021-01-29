'use strict';

const {
  parse: parseConfig,
  generic: { parsePrefix, parseDashboardPath, dashboardEnable, serverPort },
  dashboard: { dashboardUserId, dashboardPassword },
} = require('./config'); // load application settings
const Promise = require('bluebird');
const express = require('express');
const { ParseServer } = require('parse-server');
const ParseDashboard = require('parse-dashboard');

const app = express();
const parseAPI = new ParseServer(parseConfig); // init parse server

// Mount express components
// TODO: setup public serving of client
app.use(parsePrefix, parseAPI);
if (dashboardEnable) {
  // init parse dashboard
  const parseDashboard = new ParseDashboard({
    apps: [parseConfig],
    users: [{ user: dashboardUserId, pass: dashboardPassword }],
  });
  app.use(parseDashboardPath, parseDashboard);
}

/**
 * Start the application server. Will resolve once server is up
 * @returns {Promise}
 */
app.start = async () =>
  Promise.fromCallback((cb) => {
    // attach the returned server from listen to app for future handling
    app.server = app.listen(serverPort, cb);
  });

/**
 * Stop application server by closing underlying http server
 * @returns {Promise}
 */
app.stop = async () =>
  Promise.fromCallback((cb) => {
    app.server.close(cb);
  });

if (require.main === module) {
  // start the server if directly executing this file
  app
    .start()
    .then(() =>
      console.log(`Server has started listening on port: ${serverPort}`)
    );
}

module.exports = app;