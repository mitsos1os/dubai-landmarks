'use strict';

const landmarkSchema = require('../schemas/landmarkSchema');
const {
  generic: { photoWidth, photoHeight },
} = require('../../config');
const { createThumbnail, getFileData, deleteFile } = require('../utils');
const assert = require('assert').strict;
const Promise = require('bluebird');

class Landmark extends Parse.Object {
  constructor(attrs) {
    super('Landmark', attrs);
  }

  /**
   * Helper method to register cloud hooks for current collection
   */
  static registerCloudHooks() {
    Parse.Cloud.beforeSave('Landmark', (request, { success, error }) =>
      Landmark.afterSaveHandler(request).then(success).catch(error)
    );
    Parse.Cloud.afterDelete('Landmark', (request, { success, error }) =>
      Landmark.afterDeleteHandler(request).then(success).catch(error)
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
    assert(
      originalImage && typeof originalImage === 'object',
      'Invalid originalImage'
    );
    assert.strictEqual(typeof save, 'boolean', 'Invalid flag for save');
    const photoData = await getFileData(originalImage);
    const resizedImage = await createThumbnail(
      photoData,
      photoWidth,
      photoHeight
    );
    const newImageFile = new Parse.File(
      `thumb_${originalImage.name()}`,
      Array.from(resizedImage)
    );
    return save ? newImageFile.save() : newImageFile;
  }

  /**
   * Handler used when adding a photo to landmark object. Will create a
   * thumbnail version of the photo and save in landmark
   * @param {Landmark} object - The landmark object containing the photo
   * @returns {Promise<void>}
   */
  static async addPhotoHandler(object) {
    const landmarkPhoto = object.get('photo');
    // photo added, so we need to create thumbnail
    console.log(
      `Photo changed for post with title: ${object.get(
        'title'
      )}. Creating thumbnail...`
    );
    const newImageFile = await Landmark.createResizedPhotoFile(landmarkPhoto);
    object.set('photo_thumb', newImageFile); // assign photo thumb
    console.log(`Thumbnail created for post with ID: ${object.id}`);
  }

  /**
   * Handler for removing related photo and photo thumbnail from a landmark
   *
   * @param {Landmark} object - The landmark instance containing the photo to remove
   * @param {Landmark} [instanceToUpdate] - If given instance to update to handle unset logic
   * @returns {Promise<void>}
   */
  static async deletePhotoHandler(object, instanceToUpdate) {
    const photoFiles = ['photo', 'photo_thumb'].map((key) => object.get(key));
    // also remove thumbnail in instanceToUpdate if provided
    if (instanceToUpdate) instanceToUpdate.unset('photo_thumb');
    Promise.map(photoFiles, deleteFile);
  }

  /**
   * Check if photo was changed in landmark and if so, create a thumbnail of
   * the photo uploaded
   *
   * @param {Parse.Cloud.TriggerRequest} request - The original hook request
   * @param {Landmark} request.object - The updated landmark instance
   * @param {Landmark} request.original - The original landmark instance
   * @returns {Promise<void>}
   */
  static async afterSaveHandler({ object, original }) {
    if (!object.dirtyKeys().includes('photo')) return null; // nothing to do if photo didn't change
    // check to see if update was addition or removal of photo
    const landmarkPhoto = object.get('photo');
    const photoAdded = typeof landmarkPhoto !== 'undefined';
    return photoAdded
      ? Landmark.addPhotoHandler(object)
      : Landmark.deletePhotoHandler(original, object);
  }

  /**
   * Handler when landmark is deleted
   *
   * @param {Parse.Cloud.TriggerRequest} request - The original hook request
   * @param {Landmark} request.object
   * @returns {Promise<void>}
   */
  static async afterDeleteHandler({ object }) {
    return Landmark.deletePhotoHandler(object);
  }
}

Landmark.registerCloudHooks();

/**
 * The schema reference for the class to use
 * @type {Parse.Schema}
 */
Landmark.schema = landmarkSchema;

module.exports = Landmark;
