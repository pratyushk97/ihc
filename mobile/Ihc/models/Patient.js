export default class Patient {
  // Insert any class methods here
  get drugUpdates() {
    const drugToUpdates = {};
    for (var update of this.medications) {
      if (update.name in drugToUpdates) {
        drugToUpdates[update.name].push(update);
      } else{
        drugToUpdates[update.name] = [update];
      }
    }
    return drugToUpdates;
  }

  // To be used as primary key
  static makeKey(patient) {
    const str = `${patient.firstName}&${patient.fatherName}&${patient.motherName}` +
      `&${patient.birthday.getFullYear()}&${patient.birthday.getMonth()}` +
      `&${patient.birthday.getDate()}`;
    return str;
  }

  static extractFromForm(form) {
    const patient = Object.assign({}, form);
    patient.key = Patient.makeKey(patient);
    if(form.newPatient) {
      // 1 is male, 2 is female
      patient.gender = form.gender === 'Male' ? 1 : 2;
      patient.lastUpdated = new Date();
    }
    return patient;
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
    phone: 'string?',
    motherHeight: 'double?',
    fatherHeight: 'double?',
    statuses: 'Status[]',
    medications: 'DrugUpdate[]',
    soaps: 'Soap[]',
    triages: 'Triage[]',
    growthchart: 'GrowthChartUpdate[]',
    lastUpdated: 'date'
  }
};
