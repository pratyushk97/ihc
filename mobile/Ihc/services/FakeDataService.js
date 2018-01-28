// This file should hold all the fetch() calls to the Express server

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
    [
      newFakePatientSelectRow('Jose'),
      newFakePatientSelectRow('Bob')
    ];

  const columnOrder = ['name', 'birthday', 'checkin_time', 'triage_completed',
    'doctor_completed', 'pharmacy_completed', 'notes'];
  const toReturn = createMatrix(arr, columnOrder);

  return new Promise((resolve, reject) => {
    setTimeout(resolve, 100, toReturn);
  });
}

function newFakePatientSelectRow(name, triage = false, doctor = false,
    pharm = false, notes = "") {
  return {
    name: name,
    birthday: '20180201',
    checkin_time: new Date().getTime(),
    triage_completed: triage,
    doctor_completed: doctor,
    pharmacy_completed: pharm,
    notes: notes
  }
}

function createMatrix(data, columnOrder) {
  return data.map((obj) => columnOrder.map( (key) => obj[key] ));
}
