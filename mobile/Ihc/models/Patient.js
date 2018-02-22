export default class Patient {
  // Insert any class methods here
}

Patient.schema = {
  name: 'Patient',
  properties: {
    firstName: 'string',
    fatherName: 'string', // last name
    motherName: 'string', // last name
    birthday: 'date',
    gender: 'int', // 1 = boy, 2 = girl, 0 = undefined
    phone: 'string?'
  }
};
