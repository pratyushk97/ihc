import app from '../src/app';
import request from 'supertest';
import sinon from 'sinon';
import 'sinon-mongoose';

import PatientModel from '../src/models/Patient';

let mock = null;
describe('Test the routes involving a patient', () => {
  afterEach(() => {
    // Within this describe() block, we have multiple tests that mock the same
    // method, so we must restore() them to avoid conflicts
    if(mock) {
      mock.restore();
    }
  });

  test('/patient/:key should return patient if they exist', () => {
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

  test('/patient/:key should return error if no patient exists', () => {
    mock = sinon.mock(PatientModel)
      .expects('findOne').withArgs({key: 'keythatdoesntexist'})
      .yields(new Error("Patient with key keythatdoesntexist doesn\'t exist"), null);

    return request(app).get('/patient/keythatdoesntexist')
      .expect({status: false, error: 'Patient with key keythatdoesntexist doesn\'t exist'});
  });
});
