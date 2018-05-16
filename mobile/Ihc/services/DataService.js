/* global global */
// Returns either fakeLocalData or RealData depending on config file
// Config file:
// "FakeDataServices": "true" or "false"
import * as fakeLocalData from '../services/FakeLocalDataService';
import * as localData from '../services/LocalDataService';

import * as fakeServerData from '../services/FakeServerDataService';
import * as serverData from '../services/ServerDataService';

import config from '../config.json';

// Use the Fakes in tests, but should probably use stubs for the tests instead
// anyway
export let localService = (config.fakeDataServices === 'true' || global.__TEST__) ? fakeLocalData : localData;
export let serverService = (config.fakeDataServices === 'true' || global.__TEST__) ? fakeServerData : serverData;
