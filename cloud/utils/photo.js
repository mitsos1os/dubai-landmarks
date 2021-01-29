'use strict';

const assert = require('assert').strict;
const sharp = require('sharp');

/**
 * The method to use for resizing images
 * @type {string}
 */
const THUMBNAIL_METHOD = 'inside';
/**
 * Resize an image making sure it fits the maximum dimensions provided, while
 * also keeping its aspect ratio
 *
 * @param {Buffer} photoData - Original image data in buffer form
 * @param {number} maxWidth - Positive integer for maximum width allowed
 * @param {number} maxHeight - Positive integer for maximum height allowed
 * @returns {Promise<Buffer>} - The resized photo buffer
 */
const createThumbnail = async (photoData, maxWidth, maxHeight) => {
  assert(Buffer.isBuffer(photoData), 'Invalid photoData. Buffer required');
  assert(Number.isFinite(maxWidth) && maxWidth > 0, 'Invalid maxWidth');
  assert(Number.isFinite(maxHeight) && maxHeight > 0, 'Invalid maxHeight');
  const originalImage = sharp(photoData);
  const { width, height } = await originalImage.metadata();
  console.log(
    `Resizing image of ${width} X ${height} to max ${maxWidth} X ${maxHeight} using method ${THUMBNAIL_METHOD}`
  );
  const result = await originalImage
    .resize({ width: maxWidth, height: maxHeight })
    .toBuffer();
  assert(Buffer.isBuffer(result), 'Resized image buffer could not be produced');
  return result;
};

module.exports = {
  createThumbnail,
};
