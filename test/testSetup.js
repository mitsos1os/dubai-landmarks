'use strict';

// enforce some test environment
const { env } = process;
env.NODE_ENV = 'testing';

/* eslint-disable import/no-extraneous-dependencies */
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const app = require('../index');
const Promise = require('bluebird');

const startPromise = app.start(); // parse tries to immediately verify the server
chai.use(chaiAsPromised);
const should = chai.should();

before('start application', async () => {
  await Promise.all([startPromise, Promise.delay(1000)]);
});

after('stop application', async () => {
  await app.stop();
});

module.exports = {
  should,
  sinon,
  app,
};
