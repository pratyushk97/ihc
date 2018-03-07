// This file should hold all the fetch() calls to the Express server
// and the local database calls to the Realm DB
// TODO: Keep realm in sync with mongo
import Patient from '../models/Patient';
import Status from '../models/Status';
import GrowthChartUpdate from '../models/GrowthChartUpdate';
import Soap from '../models/Soap';
import Triage from '../models/Triage';
import DrugUpdate from '../models/DrugUpdate';

import Realm from 'realm';
import {stringDate} from '../util/Date';

const realm = new Realm({
  schema: [Patient, Status, GrowthChartUpdate, Soap, Triage, DrugUpdate],
  deleteRealmIfMigrationNeeded: true, // TODO: delete when done with dev
});

export function createPatient(patientInfo) {
  try {
    // check doesnt already exist, also sign them in
    realm.write(() => {
      realm.create('Patient', patientInfo);
    });
    return Promise.resolve(true);
  } catch (e) {
    return Promise.reject(e);
  }
}

// Check that patient exists, and if so then create a status object for them
export function signinPatient(patientForm) {
  try {
    const key = Patient.makeKey(patientForm);
    const patientObjs = realm.objects('Patient').filtered('key = "' + key + '"');
    const patient = patientObjs['0'];
    if(!patient) {
      throw new Error("Patient doesn't exist");
    }
    if(Object.keys(patientObjs).length > 1) {
      throw new Error("More than one patient with key" + patientForm.key);
    }

    const statusObj = Status.newStatus(patientForm);

    for ( var k in patient.statuses ){
      if(patient.statuses[k].date === statusObj.date) {
        throw new Error("This patient already checked in");
      }
    }

    realm.write(() => {
      patient.statuses.push(statusObj);
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
 * Return the statuses of the patients that are active and for this date
 */
export function getPatientSelectRows() {
  const statuses = Object.values(realm.objects('Status').filtered('date = "' +
      stringDate(new Date) + '" AND active = true').sorted('checkinTime'));
  console.log(statuses);

  const columnOrder = ['name', 'birthday', 'checkinTime', 'triageCompleted',
    'doctorCompleted', 'pharmacyCompleted', 'notes'];
  const toReturn = createMatrix(statuses, columnOrder);
  console.log(toReturn);

  return Promise.resolve(toReturn);
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
