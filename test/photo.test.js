'use strict';

require('./testSetup');
const fs = require('fs');
const { createThumbnail } = require('../cloud/utils');
const sharp = require('sharp');
const path = require('path');

describe('Testing createThumbnail', () => {
  let originalPhotoBuffer;
  const photoPath = path.resolve(__dirname, 'data/tower.jpg');
  const maxWidth = 200;
  const maxHeight = 250;
  before('read demo image file', () => {
    originalPhotoBuffer = fs.readFileSync(photoPath, { encoding: null });
  });
  it('should properly create an image buffer with respect to given dimensions', async () => {
    const { width: originalWidth, height: originalHeight } = await sharp(
      originalPhotoBuffer
    ).metadata();
    const resizedPhotoBuffer = await createThumbnail(
      originalPhotoBuffer,
      maxWidth,
      maxHeight
    );
    const { width: resizedWidth, height: resizedHeight } = await sharp(
      resizedPhotoBuffer
    ).metadata();
    resizedWidth.should.not.equal(originalWidth);
    resizedWidth.should.be.at.most(maxWidth);
    resizedHeight.should.not.equal(originalHeight);
    resizedHeight.should.be.at.most(maxHeight);
  });
});
