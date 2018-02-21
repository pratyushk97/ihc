// This file should hold all the fetch() calls to the Express server
// and the local database calls to the Realm DB

export function getPatients(param) {
  return []; // Return whatever sample data you want
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
