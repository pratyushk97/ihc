import sinon from 'sinon';
import * as data from '../services/RealDataService';
import Realm, {mockObjects, mockCreate, mockWrite} from '../__mocks__/realm';

jest.mock('realm');
global.fetch = require('jest-fetch-mock')

describe('Download updates', () => {
  beforeEach(() => {
    fetch.resetMocks();
    Realm.mockClear();
    mockObjects.mockClear();
    mockCreate.mockClear();
  });

  it('handles 0 new patients when no prior settings exist', done => {
    fetch.mockResponse({patients: []});
    mockObjects.mockImplementation(() => {
      return undefined;
    });

    const now = new Date().getTime();
    sinon.useFakeTimers(now);

    data.downloadUpdates()
        .then( result => {
          expect(mockCreate).toHaveBeenCalledWith('Settings', {lastSynced: now});
          done();
        })
        .catch( err => {
          done.fail(err);
        });
  });

  it('handles 0 new patients when a prior settings exists', done => {
    fetch.mockResponse({patients: []});

    const settings = { lastSynced: 100 };
    mockObjects.mockImplementation(() => {
      return { '0': settings };
    });

    const now = new Date().getTime();
    sinon.useFakeTimers(now);

    data.downloadUpdates()
        .then( result => {
          expect(mockCreate).not.toHaveBeenCalledWith('Settings', {lastSynced: now});
          expect(settings.lastSynced).toEqual(now);
          done();
        })
        .catch( err => {
          done.fail(err);
        });
  });
});
