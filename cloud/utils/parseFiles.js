'use strict';

const assert = require('assert').strict;
const {
  parse: { appId, masterKey, serverURL },
} = require('../../config');

/**
 * Accept a ParseFile and retrieve its content
 *
 * @param {Parse.File} parseFile - The File to retrieve data
 * @returns {Promise<Buffer>} - File data in buffer form
 */
const getFileData = async (parseFile) => {
  assert.strictEqual(parseFile.constructor, Parse.File);
  const fileUrl = parseFile.url();
  const fileName = parseFile.name();
  console.log(`Retrieving data for file ${fileName}`);
  assert(
    fileUrl && typeof fileUrl === 'string',
    `Can not retrieve url for file ${fileName}`
  );
  const { buffer: fileData } = await Parse.Cloud.httpRequest({
    url: fileUrl,
    headers: {
      'X-Parse-Application-ID': appId,
      'X-Parse-Master-Key': masterKey,
    },
  });
  return fileData;
};

/**
 * Delete a Parse File. Make sure that delete operation was successful by
 * verifying returned status code
 *
 * @param {Parse.File} parseFile
 * @returns {Promise<void>}
 */
const deleteFile = async (parseFile) => {
  assert.strictEqual(parseFile.constructor, Parse.File);
  const fileName = parseFile.name();
  const fileUrl = parseFile.url();
  console.log(`Deleting file ${fileName}`);
  assert(
    fileUrl && typeof fileUrl === 'string',
    `Can not retrieve url for file ${fileName}`
  );
  const { status } = await Parse.Cloud.httpRequest({
    url: `${serverURL}/files/${fileName}`,
    method: 'DELETE',
    headers: {
      'X-Parse-Application-ID': appId,
      'X-Parse-Master-Key': masterKey,
    },
  });
  assert.strictEqual(status, 200, `DELETE request for file ${fileName} failed`);
};

module.exports = {
  getFileData,
  deleteFile,
};
