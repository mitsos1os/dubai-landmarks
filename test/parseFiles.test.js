'use strict';

require('./testSetup');
const fs = require('fs');
const { getFileData, deleteFile } = require('../cloud/utils');
const path = require('path');

describe('Testing Parse Files utils', () => {
  describe('Testing deleteFile', () => {
    let parseFile;
    const fileBuffer = Buffer.from([10, 20, 30]);
    before('create parse File', async () => {
      parseFile = new Parse.File('testFile.bin', Array.from(fileBuffer));
      await parseFile.save();
    });
    it('should properly delete Parse File', async () => {
      await deleteFile(parseFile);
      await getFileData(parseFile).should.be.rejected;
    });
  });
  describe('Testing getFileData', () => {
    // read synchronously in test
    const photoBuffer = fs.readFileSync(
      path.resolve(__dirname, 'data/tower.jpg'),
      {
        encoding: null,
      }
    );
    let parseFile;
    before('create Parse File', async () => {
      parseFile = new Parse.File('tower.jpg', Array.from(photoBuffer));
      await parseFile.save();
    });
    after('delete parse File', async () => {
      await deleteFile(parseFile);
    });
    it('should properly retrieve proper content of file', async () => {
      const result = await getFileData(parseFile);
      Buffer.from(result).should.deep.equal(photoBuffer);
    });
  });
});
