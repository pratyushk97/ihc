module.exports = function(app, db) {
  app.post("/signin/newpatient", (req,res) => {
    try {
      db.patientExists(req.body.patientInfo, (exists) => {
        if(!exists) {
          db.createPatient(req.body.patientInfo, () => res.send(true));
        } else {
          res.send(false);
        }
      }); 
    } catch(err) {
      res.status(500).send({error: error});
    }
  });

  app.post("/signin", (req,res) => {
    try {
      db.patientExists(req.body.patientInfo, (exists) => {
        if(!exists) {
          res.send(false);
        } else {
          db.patientSignin(req.body.patientInfo, () => res.send(true));
        }
      });
    } catch(err) {
      res.status(500).send({error: error});
    }
  });

  app.get("*", (req,res) => {
    res.send("Error: No path matched");
  });
}
