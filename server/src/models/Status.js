import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const StatusSchema = Schema({
  patientKey: String,
  name: String,
  birthday: String,
  date: String,
  active: Boolean,
  checkinTime: Number,
  triageCompleted: Number,
  doctorCompleted: Number,
  pharmacyCompleted: Number,
  lastUpdated: Number // timestamp
});
const StatusModel = mongoose.model('Status', StatusSchema);
module.exports = StatusModel;
