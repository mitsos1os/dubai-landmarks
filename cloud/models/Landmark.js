'use strict';

const landmarkSchema = require('../schemas/landmarkSchema');
const {
  generic: { photoWidth, photoHeight },
} = require('../../config');
const { createThumbnail } = require('../utils');
const assert = require('assert').strict;

class Landmark extends Parse.Object {
  constructor() {
    super('Landmark');
  }

  /**
   * Helper method to register cloud hooks for current collection
   */
  static registerCloudHooks() {
    Parse.Cloud.beforeSave('Landmark', (request, { success, error }) =>
      Landmark.afterSaveHandler(request).then(success).catch(error)
    );
  }

  /**
   * Accept Parse.File containing an image and create a new Parse.File
   * containing the resized image
   *
   * @param {Parse.File} originalImage
   * @param {boolean} [save = true] - Flag whether to also save the new file or simply return
   * @returns {Promise<Parse.File>}
   */
  static async createResizedPhotoFile(originalImage, save = true) {
    const imageUrl = originalImage.url();
    const imageName = originalImage.name();
    assert(
      imageUrl && typeof imageUrl === 'string',
      `Can not retrieve photo url for ${imageName}`
    );
    const { buffer: photoData } = await Parse.Cloud.httpRequest({
      url: imageUrl,
    });
    const resizedImage = await createThumbnail(
      photoData,
      photoWidth,
      photoHeight
    );
    const newImageFile = new Parse.File(
      `${imageName}_thumb`,
      Array.from(resizedImage)
    );
    return save ? newImageFile.save() : newImageFile;
  }

  /**
   * Check if photo was changed in landmark and if so, create a thumbnail of
   * the photo uploaded
   *
   * @param {Parse.Cloud.TriggerRequest} request - The original hook request
   * @param {Parse.Object} request.object
   * @returns {Promise<void>}
   */
  static async afterSaveHandler({ object }) {
    if (!object.dirty('photo')) return; // nothing to do if photo didn't change
    // photo changed, so we need to create thumbnail
    console.log(
      `Photo changed for post with ID: ${object.id}. Creating thumbnail...`
    );
    const landmarkPhoto = object.get('photo');
    const newImageFile = await Landmark.createResizedPhotoFile(landmarkPhoto);
    object.set('photo_thumb', newImageFile); // assign photo thumb
    console.log(`Thumbnail created for post with ID: ${object.id}`);
  }
}

Landmark.registerCloudHooks();

/**
 * The schema reference for the class to use
 * @type {Parse.Schema}
 */
Landmark.schema = landmarkSchema;

module.exports = Landmark;
