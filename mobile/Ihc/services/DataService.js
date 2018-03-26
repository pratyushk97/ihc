// Returns either FakeData or RealData depending on config file
// Config file:
//   "dataService" : "FakeDataService" | "RealDataService"
import * as fakeData from '../services/FakeDataService';
import * as realData from '../services/RealDataService';
import config from '../config.json';

let dataService = config.dataService === "FakeDataService" ? fakeData : realData;
export default dataService;
