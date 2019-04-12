// This file should handle all the local database calls to the Realm DB
// Handles things syncronously, so no need for Promises

// IMPORTANT:
// If the function throws Errors, then the calling code should wrap the function
// in try/catch blocks

import Patient from '../models/Patient';
import Status from '../models/Status';
import Soap from '../models/Soap';
import Triage from '../models/Triage';
import Medication from '../models/Medication';
import DrugUpdate from '../models/DrugUpdate';
import Settings from '../models/Settings';
import MedicationCheckmarks from '../models/MedicationCheckmarks';

import Realm from 'realm';

const realm = new Realm({
  schema: [Patient, Status, Soap, Triage, Medication, DrugUpdate, Settings, MedicationCheckmarks],
  deleteRealmIfMigrationNeeded: true, // TODO: delete when done with dev
});

export function deleteLocalDatabase() {
  realm.write(() => {
    realm.deleteAll();
  });
}

export function createPatient(patient) {
  const timestamp = new Date().getTime();
  const patientObjs = realm.objects('Patient').filtered('key = "' + patient.key + '"');
  const existingPatient = patientObjs['0'];

  // Also sign them in
  const statusObj = Status.newStatus(patient);

  statusObj.lastUpdated = timestamp;
  patient.lastUpdated = timestamp;

  if(existingPatient) {
    throw new Error('Patient already exists');
  }

  realm.write(() => {
    patient.statuses = [statusObj];
    realm.create('Patient', patient);
  });
}

// Check that patient exists locally, and if so then create a status object for them
// Returns the new StatusObj created
export function signinPatient(patientForm) {
  const key = Patient.makeKey(patientForm);
  const patientObjs = realm.objects('Patient').filtered('key = "' + key + '"');
  const patient = patientObjs['0'];

  if(!patient) {
    throw new Error('Patient doesn\'t exist');
  }

  if(Object.keys(patientObjs).length > 1) {
    throw new Error('More than one patient with key' + patientForm.key);
  }

  const timestamp = new Date().getTime();
  const statusObj = Status.newStatus(patientForm);
  statusObj.lastUpdated = timestamp;

  for ( let k in patient.statuses ){
    if(patient.statuses[k].date === statusObj.date) {
      throw new Error('This patient already checked in');
    }
  }

  realm.write(() => {
    patient.statuses.push(statusObj);
  });

  return statusObj;
}

export function getStatus(patientKey, strDate) {
  const statusObj = realm.objects('Status').filtered(`patientKey="${patientKey}" AND date="${strDate}"`)[0];
  if(!statusObj) {
    throw new Error('Status doesn\'t exist');
  }
  return statusObj;
}

// Update a single field for a Status object, particularly the _Completed fields
// with timestamps
// field: Any of fields from Status.schema
// value: should match the type that the Status.schema says
export function updateStatus(patientKey, strDate, field, value) {
  const statusObjs = realm.objects('Status').filtered('patientKey = "'
    + patientKey + '" AND date = "' + strDate + '"');
  const statusObj = statusObjs['0'];
  if(!statusObj) {
    throw new Error('Status doesn\'t exist');
  }

  const patient = realm.objects('Patient').filtered('key = "' + patientKey + '"')['0'];
  if(!patient) {
    throw new Error('Patient does not exist');
  }

  const timestamp = new Date().getTime();

  realm.write(() => {
    statusObj[field] = value;
    statusObj.lastUpdated = timestamp;
    patient.lastUpdated = timestamp;
  });
  return statusObj;
}

export function updateDrugUpdate(update) {
  const patientObjs = realm.objects('Patient').filtered('key = "' + update.patientKey + '"');
  const patient = patientObjs['0'];
  if(!patient) {
    throw new Error('Patient doesn\'t exist');
  }

  const timestamp = new Date().getTime();
  update.lastUpdated = timestamp;

  realm.write(() => {
    patient.lastUpdated = timestamp;
    // If an object for that drug and date already exists, update it
    for (let m in patient.drugUpdates) {
      const old = patient.drugUpdates[m];
      if(old.date === update.date && old.name === update.name) {
        old.dose = update.dose;
        old.frequency = update.frequency;
        old.duration = update.duration;
        old.notes = update.notes;
        old.lastUpdated = update.lastUpdated;
      }
    }

    // If doesn't exist, then add it
    patient.drugUpdates.push(update);
  });
}

export function updateSoap(update) {
  const patientObjs = realm.objects('Patient').filtered('key = "' + update.patientKey + '"');
  const patient = patientObjs['0'];

  if(!patient) {
    throw new Error('Patient doesn\'t exist');
  }

  const timestamp = new Date().getTime();
  update.lastUpdated = timestamp;

  const soap = realm.objects('Soap').filtered('date = "' +
    update.date + '" AND patientKey = "' + update.patientKey +
    '"')['0'];

  realm.write(() => {
    patient.lastUpdated = timestamp;
    // If an object for that date already exists, update it
    if(soap) {
      const properties = Object.keys(Soap.schema.properties);
      properties.forEach( p => {
        soap[p] = update[p];
      });
      patient.lastUpdated = timestamp;
      return;
    }

    // If doesn't exist, then add it
    patient.soaps.push(update);
    patient.lastUpdated = timestamp;
  });
}

// Returns SOAP object if it exists, or undefined if not
export function getSoap(patientKey, strDate) {
  const soap = realm.objects('Soap').filtered('date = "' +
      strDate + '" AND patientKey = "' + patientKey + '"')['0'];
  return soap;
}

export function updateTriage(update) {
  const patientObjs = realm.objects('Patient').filtered('key = "' + update.patientKey + '"');
  const patient = patientObjs['0'];

  if(!patient) {
    throw new Error('Patient doesn\'t exist');
  }

  const triage = realm.objects('Triage').filtered('date = "' +
      update.date + '" AND patientKey = "' + update.patientKey +
      '"')['0'];

  const timestamp = new Date().getTime();
  update.lastUpdated = timestamp;

  realm.write(() => {
    patient.lastUpdated = timestamp;
    // If an object for that date already exists, update it
    if(triage) {
      const properties = Object.keys(Triage.schema.properties);
      properties.forEach( p => {
        triage[p] = update[p];
      });
      patient.lastUpdated = timestamp;
      return;
    }

    // If doesn't exist, then add it
    patient.triages.push(update);
    patient.lastUpdated = timestamp;
  });
}

// Returns Triage object if it exists, or undefined if not
export function getTriage(patientKey, strDate) {
  const triage = realm.objects('Triage').filtered('date = "' +
      strDate + '" AND patientKey = "' + patientKey + '"')['0'];
  return triage;
}

// Create a medication
export function createMedication(medication) {
  const timestamp = new Date().getTime();
  // just incase object passed in does not already have key initialized
  medication.key = Medication.makeKey(medication);
  const existingMedication = realm.objects('Medication')
    .filtered('key = "' + medication.key + '"')['0'];

  medication.lastUpdated = timestamp;

  if (existingMedication) {
    throw new Error('Medication already exists');
  }

  realm.write( () => {
    realm.create('Medication', medication);
  });
}

// Update a medication
export function updateMedication(key, update) {
  const existingMedication = realm.objects('Medication')
    .filtered('key = "' + key + '"')['0'];

  if (!existingMedication) {
    throw new Error('Medication does not exist');
  }

  realm.write( () => {
    const properties = Object.keys(Medication.schema.properties);
    properties.forEach( p => {
      if (p !== 'drugName' && p !== 'dosage' && p !== 'units' && p !== 'key') {
        existingMedication[p] = update[p];
      }
    });
    return existingMedication;
  });
}

export function deleteMedication(key) {
  const medication = realm.objects('Medication')
    .filtered('key = "' + key + '"')['0'];

  if (!medication) {
    throw new Error('Medication does not exist');
  }

  realm.write( () => {
    realm.delete(medication);
  });
}

// Returns the medication with the given name, dosage, and units; undefined if none found
export function getMedication(drugName, dosage, units) {
  const medication = realm.objects('Medication').filtered('drugName = "' + drugName +
    '" AND dosage = "' + dosage + '" AND units = "' + units + '"');
  return medication;
}

// Returns an array of all medications with the given name; undefined if none found
export function getMedications(drugName) {
  const medications = Object.values(realm.objects('Medication').filtered('drugName = "' + drugName + '"'));
  return medications;
}

export function getAllMedications() {
  const medications = Object.values(realm.objects('Medication'));
  return medications;
}

export function getPatient(patientKey) {
  const patient = realm.objects('Patient').filtered('key = "' + patientKey + '"');
  if(!patient) {
    throw new Error('Patient does not exist');
  }
  return patient['0'];
}

export function getMedicationUpdates(patientKey) {
  const updates = Object.values(realm.objects('DrugUpdate').filtered('patientKey = "' +
      patientKey + '"'));
  return updates;
}

// Return the statuses of the patients for this date
export function getStatuses(strDate) {
  const statuses = Object.values(realm.objects('Status').filtered(`date = "${strDate}"`));
  return statuses;
}

// Parameter 'all' should be true if want to upload all patients
// i.e. if the server has been cleared somehow, and want to upload this tablet's
// patients
export function getPatientsToUpload(all = false) {
  if(all) {
    return Object.values(realm.objects('Patient'));
  }
  return Object.values(realm.objects('Patient').filtered('needToUpload = true'));
}

export function getMedicationsToUpload(all = false) {
  if(all) {
    return Object.values(realm.objects('Medication'));
  }
  return Object.values(realm.objects('Medication').filtered('needToUpload = true'));
}

export function patientsLastSynced() {
  let settings = realm.objects('Settings')['0'];
  if (settings) {
    if (settings.patientsLastSynced)
      return settings.patientsLastSynced;
    else
      return 0;
  } else {
    return 0;
  }
}

export function medicationsLastSynced() {
  let settings = realm.objects('Settings')['0'];
  if (settings) {
    if (settings.medicationsLastSynced)
      return settings.medicationsLastSynced;
    else
      return 0;
  } else {
    return 0;
  }
}

// When updates or creates fail to propogate to the server-side, then mark the
// patient so they can be uploaded in the future
export function markPatientNeedToUpload(patientKey) {
  const patient = realm.objects('Patient').filtered(`key="${patientKey}"`)[0];
  if(!patient) {
    throw new Error('Patient does not exist with key ' + patientKey);
  }

  realm.write(() => {
    patient.needToUpload = true;
  });
}

export function markMedicationNeedToUpload(key) {
  const medication = realm.objects('Medication').filtered(`key="${key}"`)[0];
  if(!medication) {
    throw new Error('Medication does not exist with key ' + key);
  }

  realm.write(() => {
    medication.needToUpload = true;
  });
}

// After uploading, then these patients don't have to be marked as needing to
// upload
export function markPatientsUploaded() {
  const patients = Object.values(realm.objects('Patient').filtered('needToUpload = true'));
  realm.write(() => {
    patients.forEach(patient => {
      patient.needToUpload = false;
    });
  });
}

export function markMedicationsUploaded() {
  const medications = Object.values(realm.objects('Medication').filtered('needToUpload = true'));
  realm.write(() => {
    medications.forEach(medication => {
      medication.needToUpload = false;
    });
  });
}

export function handleDownloadedMedications(medications) {
  const fails = new Set();

  medications.forEach( incomingMedication => {
    const existingMedication = realm.objects('Medication')
      .filtered('key = "' + incomingMedication.key + '"')['0'];

    // Medication received does not exist yet
    if(!existingMedication) {
      realm.write(() => {
        realm.create('Medication', incomingMedication);
      });
    }
    else {
      if (incomingMedication.lastUpdated < existingMedication.lastUpdated) {
        fails.add(existingMedication.key);
        throw new Error('Received a medication that is out-of-date. Did you upload updates yet?');
      }

      // Should not occur but just in case
      if (incomingMedication.lastUpdated === existingMedication.lastUpdated) {
        return;
      }

      // Actually update the medication
      if (!updateMedication(existingMedication.key, incomingMedication)) {
        fails.add(existingMedication.key);
      }

      // Update that medication's updated timestamp
      realm.write(() => {
        // If medication finished updating successfully
        if(!fails.has(incomingMedication.key)) {
          existingMedication.lastUpdated = incomingMedication.lastUpdated;
        }
      });
    }
  });

  if(fails.size) {
    return Array.from(fails);
  }

  // If finished updating everything successfully, then update synced info
  const settings = realm.objects('Settings')['0'];
  realm.write(() => {
    if(!settings) {
      realm.create('Settings', {medicationsLastSynced: new Date().getTime(), patientsLastSynced: 0});
      return;
    }
    settings.medicationsLastSynced = new Date().getTime();
  });
  return [];
}

// TODO UPDATE RETURN VAL maybe be object?
/* {
    ignoredPatientKeys: [],
    <something else to be returned for failed individual forms?>: []
    countSuccessfullPatients: int
   }
 */

/**
 * Returns array of patientKeys that failed to download.
 * No key is added if incomingPatient is ignored because it is older
 * than existingPatient
 * Also updates the Settings.lastSynced object field
 */
export function handleDownloadedPatients(patients) {
  const fails = new Set();

  patients.forEach( incomingPatient => {
    const existingPatient = realm.objects('Patient')
      .filtered('key = "' + incomingPatient.key + '"')['0'];

    if(!existingPatient) {
      realm.write(() => {
        realm.create('Patient', incomingPatient);
      });
      return;
    }

    if (incomingPatient.lastUpdated < existingPatient.lastUpdated) {
      throw new Error('Received a patient that is out-of-date. Did you upload updates yet?');
    }

    // TODO update existing Patient object itself in case changes were made
    // there

    incomingPatient.soaps.forEach(incomingSoap => {
      if(!updateObject(existingPatient, 'soaps', incomingSoap))
        fails.add(existingPatient.key);
    });
    incomingPatient.triages.forEach(incomingTriage => {
      if(!updateObject(existingPatient, 'triages', incomingTriage))
        fails.add(existingPatient.key);
    });
    incomingPatient.drugUpdates.forEach(incomingDrugUpdate => {
      if(!updateObject(existingPatient, 'drugUpdates', incomingDrugUpdate))
        fails.add(existingPatient.key);
    });
    incomingPatient.statuses.forEach(incomingStatus => {
      if(!updateObject(existingPatient, 'statuses', incomingStatus))
        fails.add(existingPatient.key);
    });

    // Update that patient's updated timestamp
    realm.write(() => {
      // If patient finished updating successfully
      if(!fails.has(incomingPatient.key)) {
        existingPatient.lastUpdated = incomingPatient.lastUpdated;
      }
    });
  });

  // TODO: Maybe throw an error asking if they upladed updates yet?
  if(fails.size) {
    return Array.from(fails);
  }

  // If finished updating everything successfully, then update synced info
  const settings = realm.objects('Settings')['0'];
  realm.write(() => {
    if(!settings) {
      realm.create('Settings', {patientsLastSynced: new Date().getTime(), medicationsLastSynced: 0});
      return;
    }
    settings.patientsLastSynced = new Date().getTime();
  });
  return [];
}

// Wrap realm's write
export function write(fn) {
  realm.write(fn);
}

/**
 * Type: string of either 'soaps', 'triages', 'drugUpdates', or 'statuses'
 * Returns true if updated successfully, false if wasn't updated
 */
function updateObject(existingPatient, type, incomingObject) {
  // Find existing form/object that corresponds to the incoming one
  let existingObject = {};

  if (type === 'drugUpdates') {
    existingObject = existingPatient.drugUpdates.find( med => {
      return incomingObject.date === med.date && incomingObject.name === med.name;
    });
  } else {
    existingObject = existingPatient[type].find( obj => {
      return incomingObject.date === obj.date;
    });
  }

  // If old object doesn't exist, then just add the new object to the patient
  if(!existingObject) {
    realm.write(() => {
      existingPatient[type].push(incomingObject);
    });
    return true;
  }

  if(incomingObject.lastUpdated > existingObject.lastUpdated) {
    realm.write(() => {
      const properties = Object.keys(incomingObject);
      properties.forEach( p => {
        existingObject[p] = incomingObject[p];
      });
    });
    return true;
  }

  // Don't need to update, but shouldn't return failure
  if(incomingObject.lastUpdated === existingObject.lastUpdated) {
    return true;
  }

  return false;
}
