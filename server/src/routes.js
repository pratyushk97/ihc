module.exports = function(app, db) {
  app.post("/signin/newpatient", (req,res) => {
    db.patientExists(req.body.patientInfo, (exists) => {
      if(!exists) {
        db.createPatient(req.body.patientInfo, () => res.send(true));
      } else {
        res.send(false);
      }
    }); 
  });

  app.post("/signin", (req,res) => {
    db.patientExists(req.body.patientInfo, (exists) => {
      if(!exists) {
        res.send(false);
      } else {
        db.patientSignin(req.body.patientInfo, () => res.send(true));
      }
    });
  });

  /*
  app.patch("/status/:patientId", (req,res) => {
    const patientId = req.params.patientId;
  });
  */

  app.get("*", (req,res) => {
    res.send("Error: No path matched");
  });
}
