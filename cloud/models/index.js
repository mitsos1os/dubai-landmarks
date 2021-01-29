'use strict';

const Landmark = require('./Landmark');

/**
 * Helper method to register all Parse.Object classes that were defined using
 * ES6 `extends` method
 */
const registerParseClasses = () => {
  [Landmark].forEach((model) =>
    Parse.Object.registerSubclass(model.name, model)
  );
};

registerParseClasses();

module.exports = {
  Landmark,
  registerParseClasses,
};
