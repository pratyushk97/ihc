import * as data from '../services/RealDataService';
global.fetch = require('jest-fetch-mock')


jest.mock('realm', () => {
    return require('../testMocks/Realm');
});

describe('Download updates', () => {
  it('loads', () => {
    data.downloadUpdates();
  });
});
