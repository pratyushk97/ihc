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
    phone: 'string?',
    motherHeight: 'double?',
    fatherHeight: 'double?',
    statuses: 'Status[]',
    medications: 'DrugUpdate[]',
    soaps: 'Soap[]',
    triages: 'Triage[]',
    growthchart: 'GrowthChart[]',
    lastUpdated: 'date'
  }
};
