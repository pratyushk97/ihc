export default class DrugUpdate {
  // Insert any class methods here

}

DrugUpdate.schema = {
  name: 'DrugUpdate',
  properties: {
    patientKey: 'string',
    name: 'string',
    date: 'string',
    dose: 'string',
    frequency: 'string',
    duration: 'string',
    notes: 'string'
  }
};
