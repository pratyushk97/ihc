import * as data from '../services/RealDataService';
import sinon from 'sinon';

global.fetch = require('jest-fetch-mock')

describe('Download updates', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  let mockRealm = require('../testMocks/Realm');
  jest.mock('realm', () => {
    return mockRealm;
  });

  it('handles 0 new patients', done => {
    // Stubs are similar to mocks, but they aren't used for checking
    // expectations like mocks are. You'd use mocks to test things like if a
    // function were called with specific arguments, but stubs don't bother with
    // that.
    // Return an empty Settings object so we don't get error
    fetch.mockResponse({patients: []});
    data.downloadUpdates()
        .then( result => {
          expect(result).toEqual([true]);
          done();
        })
        .catch( err => {
          done.fail(err);
        });
  });
});
