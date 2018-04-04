import {stringDate} from '../util/Date';

export default class Soap {
  // Insert any class methods here

  static extractFromForm(form, patientKey) {
    const soap = Object.assign({}, form);
    soap.patientKey = patientKey;
    return soap;
  }
}

Soap.schema = {
  name: 'Soap',
  properties: {
    patientKey: 'string',
    date: 'string',
    subjective: 'string?',
    objective: 'string?',
    assessment: 'string?',
    plan: 'string?',
    wishlist: 'string?',
    provider: 'string' // Doctor's name
  }
};
