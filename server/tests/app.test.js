import app from '../src/app';
import request from 'supertest';
import sinon from 'sinon';
import 'sinon-mongoose';

import PatientModel from '../src/models/Patient';

describe('Test GetPatient routes', () => {
  let mock = null;
  afterEach(() => {
    // Within this describe() block, we have multiple tests that mock the same
    // method, so we must restore() them to avoid conflicts
    if(mock) {
      mock.restore();
    }
  });

  test('should return patient if they exist', () => {
    const model = { firstName: "Test" };

    // Mocking prevents us from having to use the real database. We can
    // simulate the database and return fake, but relatively realistic, values
    // Here, the PatientModel.findOne() method normally passes (error, data)
    // to a callback function, so in this case we pass null for error, and our
    // fake model as the data.
    mock = sinon.mock(PatientModel)
      .expects('findOne').withArgs({key: 'keythatexists'})
      .yields(null, model);

    // Test the API route with the correct route, and expect whatever object
    // should be returned
    return request(app).get('/patient/keythatexists')
      .expect({status: true, patient: model});
  });

  test('should return error if no patient exists', () => {
    mock = sinon.mock(PatientModel)
      .expects('findOne').withArgs({key: 'keythatdoesntexist'})
      .yields(new Error("Patient with key keythatdoesntexist doesn\'t exist"), null);

    return request(app).get('/patient/keythatdoesntexist')
      .expect({status: false, error: 'Patient with key keythatdoesntexist doesn\'t exist'});
  });
});

//Alex
//testing getPatients
describe('Test GetPatients routes', ()=>{
  let mocks = [];
  afterEach(() => {
    // Within this describe() block, we have multiple tests that mock the same
    // method, so we must restore() them to avoid conflicts
    for(let i in mocks) {
      mocks[i].restore();
    }
  });

  test('should return success if get Patient List is successful', ()=>{
    //create fake patient
    const patient1 = {key: "THISISAFAKEKEY1", firstName: "Test1", lastName: "Test1", birthday: "20050621"};
    const patient2 = {key: "THISISAFAKEKEY2", firstName: "Test2", lastName: "Test2", birthday: "20050622"};
    const patient3 = {key: "THISISAFAKEKEY3", firstName: "Test3", lastName: "Test3", birthday: "20050623"};
    var patientList = [patient1, patient2, patient3];
    const mock1 = sinon.mock(PatientModel)
      .expects('find').withArgs({})
      .yields(null, patientList);

    return request(app).get('/patients')
      .expect({status: true});
  });

});

describe('Test CreatePatient routes', () => {
  let mocks = [];
  afterEach(() => {
    // Within this describe() block, we have multiple tests that mock the same
    // method, so we must restore() them to avoid conflicts
    for(let i in mocks) {
      mocks[i].restore();
    }
  });

  test('should return success if add is successful', () => {
    const patient = { key: "Test&Last&20110101", firstName: "Test", lastName: "Last", birthday: "20110101" };

    const mock1 = sinon.mock(PatientModel)
      .expects('findOne').withArgs({key: patient.key})
      .yields(null, null);
    mocks.push(mock1);

    const mock2 = sinon.mock(PatientModel)
      .expects('create').withArgs(patient)
      .yields(null);
    mocks.push(mock2);

    return request(app).post('/patient')
      .send({patient: patient})
      .expect({status: true});
  });

  test('should return error if patient with that key already exists', () => {
    const patient = { key: "Test&Last&20110101", firstName: "Test", lastName: "Last", birthday: "20110101" };

    const mock1 = sinon.mock(PatientModel)
      .expects('findOne').withArgs({key: patient.key})
      .yields(null, patient);
    mocks.push(mock1);

    return request(app).post('/patient')
      .send({patient: patient})
      .expect({status: false, error: "Patient already exists with that name and birthday. Use a different name"});
  });

  test('should return error if save fails', () => {
    const patient = { key: "Test&Last&20110101", firstName: "Test", lastName: "Last", birthday: "20110101" };

    const mock1 = sinon.mock(PatientModel)
      .expects('findOne').withArgs({key: patient.key})
      .yields(null, null);
    mocks.push(mock1);

    const mock2 = sinon.mock(PatientModel)
      .expects('create').withArgs(patient)
      .yields(new Error('Problems saving'));
    mocks.push(mock2);

    return request(app).post('/patient')
      .send({patient: patient})
      .expect({status: false, error: "Problems saving"});
  });
});
