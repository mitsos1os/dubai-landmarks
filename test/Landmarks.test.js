'use strict';

require('./testSetup');
const Promise = require('bluebird');
const { Landmark } = require('../cloud/models');

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
      it('should ALLOW READ access for Administrator', async () => {});
      it('should ALLOW WRITE access for Administrator', async () => {});
    });
  });
});
