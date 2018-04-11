export default class History {
  // Insert any class methods here
/*
  static extractFromForm(form, patientKey) {
    const history = Object.assign({}, form);
    history.patientKey = patientKey;
    return history;
  }
*/
/*
  loadPreviousVisits = () => {
    this.setState({ loading: true });
    data.getSoap(patientKey, ) 
      .then( data => {
        this.setState({ rows: data, loading: false });
      })
      .catch( err => {
        this.setState({ error: err, loading: false });
      });
  }
*/

History.schema = {
  name: 'History',
  properties: {
    patientKey: 'string',
    date: 'string',

  }
};
