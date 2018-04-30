import {stringDate} from '../util/Date';
export default class DrugUpdate {
  // Insert any class methods here

  static extractFromForm(form, patientKey) {
    const update = Object.assign({}, form);
    update.patientKey = patientKey;
    update.date = stringDate(new Date());
    return update;
  }
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
    lastUpdated: 'int',
  }
};
