import StatusModel from '../models/Status';

//function params for all calls are generally the same function(req,res)
const SyncController = {
  GetUpdates: function(req, res){
    PatientModel.find({},function(err, patientList){
      if(!patientList || patientList.length == 0){
        err = new Error("No Patients Exist");
      }
      if(err){
        res.json({status:false, error:err.message});
        return;
      }
      res.json({status: true, patients: patientList});
    });
  },
  PostUpdates: function(req, res){
    // Check that no patient with that key exists
    PatientModel.findOne({key: req.body.patient.key}, function(err, patient) {
      if (patient) {
        // Hopefully shouldn't happen, but would be rare enough to not worry
        // about
        err = new Error("Patient already exists with that name and birthday. Use a different name");
      }
      if(err) {
        res.json({status: false, error: err.message});
        return;
      }
    });

    const patient = PatientModel.create(req.body.patient, function (err) {
      if(err) {
        res.json({status: false, error: err.message});
        return;
      }
      res.json({status: true});
    })
  }
};

module.exports = SyncController;
