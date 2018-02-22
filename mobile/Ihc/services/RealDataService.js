// This file should hold all the fetch() calls to the Express server
// and the local database calls to the Realm DB
// TODO: Keep realm in sync with mongo
import Patient from '../models/Patient';
import Realm from 'realm';

const realm = new Realm({
  schema: [Patient],
  deleteRealmIfMigrationNeeded: true, // TODO: delete when done with dev
});
export function createPatient(patientInfo) {
  patientInfo.key = Patient.makeKey(patientInfo);
  try {
    realm.write(() => {
      realm.create('Patient', patientInfo);
    });
    return Promise.resolve(true);
  } catch (e) {
    return Promise.reject(e);
  }
}

export function getPatients(param) {
  return realm.objects('Patient');
}

export function getUpdates(param) {
  return []; // Return whatever sample data you want
}

/*
 * active_only is true if we only want the statuses of patients that are
 * currently checked in
 */
export function getPatientSelectRows() {
  const arr =
    [ ];

  const columnOrder = ['name', 'birthday', 'checkin_time', 'triage_completed',
    'doctor_completed', 'pharmacy_completed', 'notes'];
  const toReturn = createMatrix(arr, columnOrder);

  return new Promise((resolve, reject) => {
    setTimeout(resolve, 100, toReturn);
  });
}

export function getMedicationUpdates() {
  const arr = [];

  return new Promise((resolve, reject) => {
    setTimeout(resolve, 100, arr);
  });
}

function createMatrix(data, columnOrder) {
  return data.map((obj) => columnOrder.map( (key) => obj[key] ));
}
