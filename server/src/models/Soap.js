import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const SoapSchema = Schema({
  patientKey: String,
  date: String,
  subjective: String,
  objective: String,
  assessment: String,
  plan: String,
  wishlist: String,
  provider: String,
  lastUpdated: Number // timestamp
});
const SoapModel = mongoose.model('Soap', SoapSchema);
module.exports = SoapModel;
