'use strict';

const landmarkSchema = require('../schemas/landmarkSchema');
const {
  generic: { photoWidth, photoHeight, maxPhotoSize },
} = require('../../config');
const { createThumbnail, getFileData, deleteFile } = require('../utils');
const assert = require('assert').strict;
const Promise = require('bluebird');

/**
 * A set of required properties that must be present in a Landmark instance to
 * be valid
 *
 * @type {string[]}
 */
const REQUIRED_PROPERTIES = ['title', 'order', 'short_info'];

class Landmark extends Parse.Object {
  constructor(attrs) {
    super('Landmark', attrs);
  }

  /**
   * Helper method to register cloud hooks for current collection
   */
  static registerCloudHooks() {
    Parse.Cloud.beforeSave('Landmark', (request, { success, error }) =>
      Landmark.beforeSaveHandler(request).then(success).catch(error)
    );
    Parse.Cloud.afterDelete('Landmark', (request, { success, error }) =>
      Landmark.afterDeleteHandler(request).then(success).catch(error)
    );
  }

  /**
   * The Base before save handler for landmark objects
   *
   * @param {Parse.Cloud.TriggerRequest} request - The original hook request
   * @throws {Parse.Error} - In case of validation error
   * @returns {Promise<void>}
   */
  static async beforeSaveHandler(request) {
    const validationError = Landmark.validate(request.object);
    if (validationError) throw validationError;
    await Landmark.photoBeforeSaveHandler(request);
  }

  /**
   * Accept a landmark instance and make sure it is valid. All required
   * properties must be present
   * In case of error Parse.Error.VALIDATION_ERROR is returned
   * Otherwise null
   *
   * @param {Landmark} landmark
   * @returns {?Parse.Error.VALIDATION_ERROR}
   *
   * @see REQUIRED_PROPERTIES
   */
  static validate(landmark) {
    let error = null;
    const { Error: ParseError } = Parse;
    REQUIRED_PROPERTIES.forEach((prop) => {
      if (landmark.get(prop) == null) {
        error = new ParseError(
          ParseError.VALIDATION_ERROR,
          `${prop} missing from Landmark`
        );
      }
    });
    return error;
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
   * Check that a ParseFile Image is of valid size according to provided config
   *
   * @param {Parse.File} photoFile
   * @returns {Promise<boolean>}
   */
  static async checkImageSizeValid(photoFile) {
    const photoData = await getFileData(photoFile);
    return photoData.length < maxPhotoSize;
  }

  /**
   * Handler used when adding a photo to landmark object. Will create a
   * thumbnail version of the photo and save in landmark
   * @param {Landmark} object - The landmark object containing the photo
   * @returns {Promise<void>}
   */
  // eslint-disable-next-line consistent-return
  static async addPhotoHandler(object) {
    const landmarkPhoto = object.get('photo');
    const isPhotoValid = await Landmark.checkImageSizeValid(landmarkPhoto);
    if (!isPhotoValid) {
      // invalid photo, delete file created and unset from object
      console.log(
        `Image with name ${landmarkPhoto.name()} larger than allowed size. Will delete...`
      );
      await Landmark.deletePhotoHandler(object, object);
      return;
    }
    // photo added and valid, so we need to create thumbnail
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
    const photoKeys = ['photo', 'photo_thumb'];
    const photoFiles = photoKeys.map((key) => object.get(key));
    // also remove thumbnail in instanceToUpdate if provided
    return Promise.map(photoFiles, (photo, index) => {
      if (!photo) return null; // no file retrieved
      if (instanceToUpdate) instanceToUpdate.unset(photoKeys[index]); // unset key from object
      return deleteFile(photo);
    });
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
  static async photoBeforeSaveHandler({ object, original }) {
    if (!object.dirtyKeys().includes('photo')) return; // nothing to do if photo didn't change
    // check to see if update was addition or removal of photo
    const landmarkPhoto = object.get('photo');
    const photoAdded = typeof landmarkPhoto !== 'undefined';
    await (photoAdded
      ? Landmark.addPhotoHandler(object)
      : Landmark.deletePhotoHandler(original, object));
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
