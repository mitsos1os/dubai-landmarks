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
const path = require('path');

const CLIENT_PATH = path.resolve(__dirname, 'client/dist');

const app = express();

console.log(
  `Initializing Parse Server on databaseURI ${parseConfig.databaseURI} and serverURL: ${parseConfig.serverURL}`
);
const parseAPI = new ParseServer(parseConfig); // init parse server

// Mount express components
app.use(parsePrefix, parseAPI);
if (dashboardEnable) {
  // init parse dashboard
  const parseDashboard = new ParseDashboard({
    apps: [parseConfig],
    users: [{ user: dashboardUserId, pass: dashboardPassword }],
  });
  app.use(parseDashboardPath, parseDashboard);
}

console.log(`Serving client files from ${CLIENT_PATH}...`);
app.use(express.static(CLIENT_PATH)); // mount public files
app.use((req, res) => {
  // default route to send requests to frontend index for our SPA to handle
  res.sendFile('index.html', { root: CLIENT_PATH });
});
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
// setup error handling for uncaught rejections
process.on('unhandledRejection', (reason) => {
  console.error('Error from unhandled rejection... Will close...', reason);
  setTimeout(process.exit, 2000, 1); // exit after 2 second
});

module.exports = app;
