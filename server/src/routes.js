import express from 'express';

import PatientController from './controllers/Patient';
import MedicationController from './controllers/MedicationController';
import ApplicationController from './controllers/ApplicationController';

const router = express.Router();

router.get('/patient/:key', PatientController.GetPatient);

//returns an array of patients that have been updated since the lastUpdated
//timestamp. If all patients are wanted, then pass a timestamp of 0
router.get('/patients/:lastUpdated', PatientController.GetPatients);

router.post('/patient', PatientController.CreatePatient);
// router.delete('/patient/:key', PatientController.DeletePatient);

//updates patient's personal info
//everything except doctors assessment, ie: name, phone number, age
router.put('/patient/:key', PatientController.UpdatePatient);

// receive patients from the tablet and save them to the server, or update the
// existing server-side objects if they already exist
// Differently than UpdatePatient, this route DOES modify doctors assessments
router.put('/patients', PatientController.UpdatePatients);

//Kenny
//get soap info
router.get('/patient/:key/soap/:date', PatientController.GetSoap);

//Kenny
//get status info
router.get('/patient/:key/status/:date', PatientController.GetStatus);

//Brent
//get triage info
router.get('/patient/:key/triage/:date', PatientController.GetTriage);

//ayush
//get drug info
router.get('/patient/:key/drugUpdates', PatientController.GetDrugUpdates);

//Kenny
//updates the soap of the patient
router.put('/patient/:key/soap/:date', PatientController.UpdateSoap);

//Kenny
//updates the status of the patient
router.put('/patient/:key/status/:date', PatientController.UpdateStatus);

//updates the triage of the patient
router.put('/patient/:key/triage/:date', PatientController.UpdateTriage);

//updates the Medicine of the patient
router.put('/patient/:key/drugUpdate/:date', PatientController.UpdateDrugUpdate);

// return all the statuses for the given date
router.get('/patients/statuses/:date', PatientController.GetStatuses);

//returns an array of medications that have been updated since the lastUpdated
//timestamp. If all medications are wanted, then pass a timestamp of 0
router.get('/medications/:lastUpdated', MedicationController.GetUpdatedMedications);

// receive medications from the tablet and save them to the server, or update the
// existing server-side objects if they already exist
router.put('/medications', MedicationController.UpdateMedications);

//adds a new medication to the inventory
router.post('/medication-inventory', MedicationController.CreateMedication);

//return all the medications for the given drug name
router.get('/medication-inventory/:name', MedicationController.GetMedications);

//updates the information for an existing medication
router.put('/medication-inventory/:key/update', MedicationController.UpdateMedication);

//deletes the information for an existing medication
router.put('/medication-inventory/:key/delete', MedicationController.DeleteMedication);

// checks the credentials to see if user is authorized access
router.put('/credentials/check', ApplicationController.AuthorizationCheck);

// create new login credentials
router.put('/credentials/add', ApplicationController.AddCredentials);

module.exports = router;
