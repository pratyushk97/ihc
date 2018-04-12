import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const DrugUpdateSchema = Schema({
  patientKey: String,
  name: String,
  date: String,
  dose: String,
  frequency: String,
  duration: String,
  notes: String,
  lastUpdated: Number // timestamp
});
const DrugUpdateModel = mongoose.model('DrugUpdate', DrugUpdateSchema);
module.exports = DrugUpdateModel;
