export default class MedicationCheckmarks {
  // Insert any class methods here

  static newMedicationCheckmarks(patientKey, drugName) {
    const obj = {
      patientKey: patientKey,
      drugName: drugName,
      date: stringDate(new Date()),
      taking: true,
      notTaking: false,
      notAsInstructed: false,
      lastUpdated: new Date().getTime(),
    };
    return obj;
  }
}

MedicationCheckmarks.schema = {
  name: 'MedicationCheckmarks',
  properties: {
    patientKey: 'string',
    drugName: 'string',
    date: 'string',
    taking: 'bool?',
    notTaking: 'bool?',
    notAsInstructed: 'bool?',
    lastUpdated: 'int',
  }
};
