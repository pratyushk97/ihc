/*
 * A patient's status as they go through their appointment
 */
export default class Status {
  // Insert any class methods here

  static newStatus(patientKey) {
    const obj = {
      patientKey: patientKey,
      date: new Date(),
      active: true,
    }
    return obj;
  }
}

Status.schema = {
  name: 'Status',
  properties: {
    patientKey: 'string',
    date: 'string',
    active: 'bool',
    checkinTime: 'int', // Timestamp, milliseconds
    triageCompleted: 'int?', // timestamp for when completed
    doctorCompleted: 'int?',
    pharmacyCompleted: 'int?',
    notes: 'string?'
  }
};
