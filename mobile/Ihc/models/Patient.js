export default class Patient {
  // Insert any class methods here

  // To be used as primary key
  static makeKey(patient) {
    const str = patient.firstName + patient.fatherName + patient.motherName +
      patient.birthday;
    return str;
  }
}

Patient.schema = {
  name: 'Patient',
  primaryKey: 'key',
  properties: {
    key: 'string',
    firstName: 'string',
    fatherName: 'string', // last name
    motherName: 'string', // last name
    birthday: 'date',
    gender: 'int', // 1 = boy, 2 = girl, 0 = undefined
    phone: 'string?'
  }
};
