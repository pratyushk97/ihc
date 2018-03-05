/*
 * A patient's status as they go through their appointment
 */
export default class Status {
  // Insert any class methods here

}

Status.schema = {
  name: 'Status',
  properties: {
    patientKey: 'string',
    date: 'date',
    active: 'bool',
    checkinTime: 'date',
    triageCompleted: 'date?', // timestamp for when completed
    doctorCompleted: 'date?',
    pharmacyCompleted: 'date?',
    notes: 'string?'
  }
};
