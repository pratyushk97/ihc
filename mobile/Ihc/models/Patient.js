export class Patient {
  // Insert any class methods here
}

Patient.schema = {
  name: 'Patient',
  properties: {
    first_name: 'string',
    father_name: 'string', // last name
    mother_name: 'string', // last name
    birthday: 'date',
    sex: 'int', // 1 = boy, 2 = girl, 0 = undefined
    phone: 'string?'
  }
};
