module.exports = function(app, db) {
  app.post("/signin/newpatient", (req,res) => {
    // try req.body
    db.createPatient(req.body.patientInfo, () => res.send(true),
        (error) => res.status(500).send({error: error}));
  });

  app.get("*", (req,res) => {
    res.send("Error: No path matched");
  });
}
