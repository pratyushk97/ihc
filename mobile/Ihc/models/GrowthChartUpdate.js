export default class GrowthChartUpdate {
  // Insert any class methods here

}

GrowthChartUpdate.schema = {
  name: 'GrowthChartUpdate',
  properties: {
    patientKey: 'string',
    date: 'string',
    height: 'double',
    weight: 'double'
  }
};
