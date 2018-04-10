export default class DrugUpdate {
  // Insert any class methods here

}

DrugUpdate.schema = {
  name: 'DrugUpdate',
  properties: {
    patientKey: 'string',
    name: 'string', // drug name
    date: 'string',
    dose: 'string',
    frequency: 'string',
    duration: 'string',
    notes: 'string?',
    last_updated: 'int',
  }
};
