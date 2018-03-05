export default class Soap {
  // Insert any class methods here

}

Soap.schema = {
  name: 'Soap',
  properties: {
    patientKey: 'string',
    date: 'date',
    subjective: 'string',
    objective: 'string',
    assessment: 'string',
    plan: 'string',
    wishlist: 'string',
    provider: 'string' // Doctor's name
  }
};
