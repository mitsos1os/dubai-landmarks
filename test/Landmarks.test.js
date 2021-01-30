'use strict';

const { sinon, should } = require('./testSetup');
const Promise = require('bluebird');
const { Landmark } = require('../cloud/models');
const {
  generic: { adminUsername, adminPassword, photoWidth, photoHeight },
} = require('../config');
const { getFileData } = require('../cloud/utils');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

describe('Testing Landmarks', () => {
  describe('Testing Access restriction', () => {
    let createdLandmarks;
    before('create test resources', async () => {
      const landmarkData = [
        {
          title: 'dummy_land_1',
          short_info: 'Best landmark that exists',
          description: 'Very very long description',
          order: 1,
        },
        {
          title: 'dummy_land_2',
          short_info: 'Best landmark that exists (with previous)',
          description: 'Very very long description again',
          order: 2,
        },
      ];
      createdLandmarks = await Promise.map(landmarkData, (elem) => {
        const landmarkModel = new Landmark();
        Object.entries(elem).forEach(([key, value]) => {
          landmarkModel.set(key, value);
        });
        return landmarkModel.save(null, { useMasterKey: true });
      });
    });
    after('clear test resources', async () => {
      await Landmark.schema.purge(); // remove all instances of Landmarks
    });
    describe('For guests', () => {
      it('should ALLOW READ access on landmarks for guests', async () => {
        const readQuery = new Parse.Query(Landmark);
        const results = await readQuery.find();
        const expectedObjects = createdLandmarks.map((e) => e.attributes);
        results
          .map((e) => e.attributes)
          .should.deep.have.members(expectedObjects);
      });
      it('should DENY WRITE access on landmarks for guests', async () => {
        const landmarkToUpdate = new Landmark();
        landmarkToUpdate.id = createdLandmarks[0].id; // get first of created landmarks
        landmarkToUpdate.set('title', 'some other title');
        await landmarkToUpdate.save().should.be.rejectedWith(/denied/); // try to update
      });
    });
    describe('for Administrator', () => {
      let sessionToken;
      before('login as Administrator', async () => {
        const loggedInUser = await Parse.User.logIn(
          adminUsername,
          adminPassword
        );
        sessionToken = loggedInUser.get('sessionToken');
      });
      it('should ALLOW READ access for Administrator', async () => {
        const readQuery = new Parse.Query(Landmark);
        const results = await readQuery.find({ sessionToken });
        const expectedObjects = createdLandmarks.map((e) => e.attributes);
        results
          .map((e) => e.attributes)
          .should.deep.have.members(expectedObjects);
      });
      it('should ALLOW WRITE access for Administrator', async () => {
        const landmarkToUpdate = new Landmark();
        landmarkToUpdate.id = createdLandmarks[0].id; // get first of created landmarks
        landmarkToUpdate.set('title', 'some updated title');
        await landmarkToUpdate.save(null, { sessionToken });
        const updatedLandmark = await new Parse.Query(Landmark).get(
          landmarkToUpdate.id
        );
        updatedLandmark.get('title').should.equal('some updated title');
      });
    });
  });
  describe('Automatic thumbnail creation on landmark photo', () => {
    let landmark;
    const defaultLandmarkData = {
      title: 'Greatest landmark with photo',
      short_info: 'short info about greatest landmark',
      order: 1,
    };
    // read synchronously in test
    const photoBuffer = fs.readFileSync(
      path.resolve(__dirname, 'data/tower.jpg'),
      {
        encoding: null,
      }
    );
    const createLandmark = (data = {}) =>
      new Landmark({
        ...defaultLandmarkData,
        ...data,
      }).save(null, { useMasterKey: true });
    const sandbox = sinon.createSandbox();
    // helper function to check photo and thumbnail to avoid repeating in tests
    const checkThumbnailPhoto = async (landmarkObj) => {
      const photoFile = landmarkObj.get('photo');
      const thumbnailPhoto = landmarkObj.get('photo_thumb');
      const imageData = await getFileData(thumbnailPhoto);
      thumbnailPhoto.name().should.include(photoFile.name()); // check names
      const thumbnailImage = sharp(imageData);
      const {
        width: thumbnailWidth,
        height: thumbnailHeight,
      } = await thumbnailImage.metadata();
      thumbnailWidth.should.be.at.most(photoWidth);
      thumbnailHeight.should.be.at.most(photoHeight);
    };
    before('creates spies', () => {
      sandbox.spy(Landmark, 'createResizedPhotoFile');
    });
    beforeEach('reset spies', () => {
      sandbox.resetHistory();
    });
    afterEach('clear resources', async () => {
      await landmark.destroy({ useMasterKey: true });
      console.log();
    });
    after('restore spies', () => {
      sandbox.restore();
    });
    it('should not create a thumbnail when not updating photo field', async () => {
      landmark = await createLandmark(); // no photo data
      Landmark.createResizedPhotoFile.should.have.not.been.called;
      should.not.exist(landmark.get('photo_thumb'));
      landmark.set('title', 'Updated landmark title');
      await landmark.save(null, { useMasterKey: true });
      Landmark.createResizedPhotoFile.should.have.not.been.called; // not called either
      should.not.exist(landmark.get('photo_thumb'));
    });
    it('should not accept landmark photo bigger than 5MB', async () => {
      // create bigger than 5MB file buffer
      const limit = 5000001; // make sure we are more than the limit
      const currentSize = photoBuffer.length;
      const multiplier = Math.ceil(limit / currentSize);
      const newBufferArray = [...new Array(multiplier)].map(() => photoBuffer);
      const newPhotoBuffer = Buffer.concat(newBufferArray);
      const photoFile = new Parse.File(
        'Big_Photo.jpg',
        Array.from(newPhotoBuffer),
        'image/jpg'
      );
      landmark = await createLandmark({ photo: photoFile });
      // check that photos not created
      should.not.exist(landmark.get('photo'));
      should.not.exist(landmark.get('photo_thumb'));
    });
    it('should create a thumbnail of smaller size when creating landmark with photo field', async () => {
      const photoFile = new Parse.File(
        'landmarkPhoto',
        Array.from(photoBuffer),
        'image/jpg'
      );
      landmark = await createLandmark({ photo: photoFile });
      await checkThumbnailPhoto(landmark);
    });
    it('should create photo thumbnail when updating landmark with photo', async () => {
      landmark = await createLandmark(); // landmark with default data
      const photoFile = new Parse.File(
        'landmarkPhoto',
        Array.from(photoBuffer),
        'image/jpg'
      );
      landmark.set('photo', photoFile); // update the landmark with photo
      await landmark.save(null, { useMasterKey: true });
      await checkThumbnailPhoto(landmark);
    });
    it('should not re-create thumbnail when not updating existing photo', async () => {
      const photoFile = new Parse.File(
        'landmarkPhoto',
        Array.from(photoBuffer),
        'image/jpg'
      );
      landmark = await createLandmark({ photo: photoFile }); // create the landmark with photo
      Landmark.createResizedPhotoFile.should.have.been.calledOnce; // original thumbnail creation
      landmark.set('title', 'updated title of landmark');
      await landmark.save(null, { useMasterKey: true });
      Landmark.createResizedPhotoFile.should.have.been.calledOnce; // still one
      should.exist(landmark.get('photo'));
      should.exist(landmark.get('photo_thumb'));
    });
    it('should delete photo and thumbnail when unsetting it from landmark', async () => {
      let photoFile = new Parse.File(
        'landmarkPhoto',
        Array.from(photoBuffer),
        'image/jpg'
      );
      landmark = await createLandmark({ photo: photoFile }); // create the landmark with photo
      photoFile = landmark.get('photo'); // get persisted version
      landmark.unset('photo');
      await landmark.save(null, { useMasterKey: true });
      await getFileData(photoFile).should.be.rejected; // no file to get
    });
    it('should also delete the photo and thumbnail when deleting landmark', async () => {
      let photoFile = new Parse.File(
        'landmarkPhoto',
        Array.from(photoBuffer),
        'image/jpg'
      );
      landmark = await createLandmark({ photo: photoFile }); // create the landmark with photo
      photoFile = landmark.get('photo'); // get persisted version
      const thumbnailFile = landmark.get('photo_thumb');
      landmark.unset('photo');
      await landmark.save(null, { useMasterKey: true });
      await getFileData(photoFile).should.be.rejected; // no photo to get
      await getFileData(thumbnailFile).should.be.rejected; // no thumbnail to get
    });
  });
});
