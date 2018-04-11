// This file should hold all the fetch() calls to the Express server
// and the local database calls to the Realm DB
// TODO: Keep realm in sync with mongo
import Patient from '../models/Patient';
import Status from '../models/Status';
import Soap from '../models/Soap';
import Triage from '../models/Triage';
import DrugUpdate from '../models/DrugUpdate';

import Realm from 'realm';
import {stringDate} from '../util/Date';

const realm = new Realm({
  schema: [Patient, Status, Soap, Triage, DrugUpdate],
  deleteRealmIfMigrationNeeded: true, // TODO: delete when done with dev
});

export function createPatient(patient) {
  try {
    const patientObjs = realm.objects('Patient').filtered('key = "' + patient.key + '"');
    const existingPatient = patientObjs['0'];

    if(existingPatient) {
      throw new Error("Patient already exists");
    }

    // Also sign them in
    const statusObj = Status.newStatus(patient);

    realm.write(() => {
      patient.statuses = [statusObj];
      realm.create('Patient', patient);
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

// field: Any of fields from Status.schema
// value: should match the type that the Status.schema says
export function updateStatus(patientKey, strDate, field, value) {
  try {
    const statusObjs = realm.objects('Status').filtered('patientKey = "'
      + patientKey + '" AND date = "' + strDate + '"');
    const statusObj = statusObjs['0'];
    if(!statusObj) {
      throw new Error("Status doesn't exist");
    }

    realm.write(() => {
      statusObj[field] = value;
      statusObj.last_updated = new Date().getTime();
    });
    return Promise.resolve(true);
  } catch (e) {
    return Promise.reject(e);
  }
}

export function createDrugUpdate(update) {
  try {
    const patientObjs = realm.objects('Patient').filtered('key = "' + update.patientKey + '"');
    const patient = patientObjs['0'];
    if(!patient) {
      throw new Error("Patient doesn't exist");
    }

    realm.write(() => {
      // If an object for that drug and date already exists, update it
      for (var m in patient.medications) {
        const old = patient.medications[m];
        if(old.date === update.date && old.name === update.name) {
          old.dose = update.dose;
          old.frequency = update.frequency;
          old.duration = update.duration;
          old.notes = update.notes;
          old.last_updated = update.last_updated;
          return Promise.resolve(true);
        }
      }

      // If doesn't exist, then add it
      patient.medications.push(update);
    });
    return Promise.resolve(true);
  } catch(e) {
    return Promise.reject(e);
  }
}

export function updateSoap(update) {
  try {
    const patientObjs = realm.objects('Patient').filtered('key = "' + update.patientKey + '"');
    const patient = patientObjs['0'];

    if(!patient) {
      throw new Error("Patient doesn't exist");
    }

    const soap = realm.objects('Soap').filtered('date = "' +
        stringDate(new Date) + '" AND patientKey = "' + update.patientKey +
        '"')['0'];

    realm.write(() => {
      // If an object for that date already exists, update it
      if(soap) {
        const properties = Object.keys(Soap.schema.properties);
        properties.forEach( p => {
          soap[p] = update[p];
        });
        soap.last_updated = new Date().getTime();
        return Promise.resolve(true);
      }

      // If doesn't exist, then add it
      patient.soaps.push(update);
    });
    return Promise.resolve(true);
  } catch(e) {
    return Promise.reject(e);
  }
}

// Returns SOAP object if it exists, or undefined if not
export function getSoap(patientKey, strDate) {
  const soap = realm.objects('Soap').filtered('date = "' +
      stringDate(new Date) + '" AND patientKey = "' + patientKey + '"')['0'];
  return Promise.resolve(soap);
}

export function updateTriage(update) {
  try {
    const patientObjs = realm.objects('Patient').filtered('key = "' + update.patientKey + '"');
    const patient = patientObjs['0'];

    if(!patient) {
      throw new Error("Patient doesn't exist");
    }

    const triage = realm.objects('Triage').filtered('date = "' +
        stringDate(new Date) + '" AND patientKey = "' + update.patientKey +
        '"')['0'];

    realm.write(() => {
      // If an object for that date already exists, update it
      if(triage) {
        const properties = Object.keys(Triage.schema.properties);
        properties.forEach( p => {
          triage[p] = update[p];
        });
        triage.last_updated = new Date().getTime();
        return Promise.resolve(true);
      }

      // If doesn't exist, then add it
      patient.triages.push(update);
    });
    return Promise.resolve(true);
  } catch(e) {
    return Promise.reject(e);
  }
}

// Returns Triage object if it exists, or undefined if not
export function getTriage(patientKey, strDate) {
  const triage = realm.objects('Triage').filtered('date = "' +
      stringDate(new Date) + '" AND patientKey = "' + patientKey + '"')['0'];
  return Promise.resolve(triage);
}

export function getPatient(patientKey) {
  const patient = realm.objects('Patient').filtered('key = "' + patientKey + '"');
  if(!patient) {
    return Promise.reject(new Error('Patient does not exist'));
  }
  return Promise.resolve(patient['0']);
}

export function getPatients() {
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

  const columnOrder = ['name', 'birthday', 'checkinTime', 'triageCompleted',
    'doctorCompleted', 'pharmacyCompleted', 'notes', 'patientKey'];
  const toReturn = createMatrix(statuses, columnOrder);

  return Promise.resolve(toReturn);
}

export function getMedicationUpdates(patientKey) {
  const updates = Object.values(realm.objects('DrugUpdate').filtered('patientKey = "' +
      patientKey + '"'));
  return Promise.resolve(updates);
}

function createMatrix(data, columnOrder) {
  return data.map((obj) => columnOrder.map( (key) => obj[key] ));
}
