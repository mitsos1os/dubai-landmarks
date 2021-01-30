'use strict';

// enforce some test environment
const { env } = process;
env.NODE_ENV = 'testing';
env.DB_URI = 'mongodb://localhost:27017/dubai-landmarks-test'; // Should remove environment DB URI wanted

/* eslint-disable import/no-extraneous-dependencies */
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinonChai = require('sinon-chai');
const sinon = require('sinon');
const app = require('../index');
const Promise = require('bluebird');

const startPromise = app.start(); // parse tries to immediately verify the server
chai.use(chaiAsPromised);
chai.use(sinonChai);
const should = chai.should();

before('start application', async () => {
  await Promise.all([
    startPromise,
    Promise.delay(1000), // wait for all schemas and handlers to be created
  ]);
});

after('stop application', async () => {
  await app.stop();
});

module.exports = {
  should,
  sinon,
  app,
};
