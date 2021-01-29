'use strict';

const { loadFiles } = require('../utils');

const parseClasses = loadFiles(__dirname);
/**
 * Helper method to register all Parse.Object classes that were defined using
 * ES6 `extends` method
 */
const registerParseClasses = () => {
  parseClasses.forEach((model) =>
    Parse.Object.registerSubclass(model.name, model)
  );
};

registerParseClasses();

const exportObj = parseClasses.reduce((final, parseClass) => {
  // eslint-disable-next-line no-param-reassign
  final[parseClass.name] = parseClass;
  return final;
}, {});
exportObj.registerParseClasses = registerParseClasses;
module.exports = exportObj;
