import * as functions from "firebase-functions"
import express from "express"
import * as admin from "firebase-admin"
import bodyParser from "body-parser";

/*
 * API:
 * ESSENTIAL:
 * GET   /groups/:group/all/:timestamp   => Return information for updates after
 *                                          last_synced_timestamp
 * PATCH /groups/:group/all              => Update information
 *                                          for all people
 * - Body should contain list of people objects
 *
 * NONESSENTIAL:
 * GET   /:group/:id   => Return information
 *                        for that person
 * POST  /:group       => Add information for
 *                        new person
 * PATCH /:group/:id   => Update information
 *                        for person
 */
const app = express();
admin.initializeApp(functions.config().firebase);
const db = admin.database();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/groups/:group/all/:timestamp", (req, res) => {
  const groupId = req.params.group;
  const timestampParam = parseInt(req.params.timestamp);
  // :timestamp should be a number, but wasn't
  if(Number.isNaN(timestampParam)) {
    res.status(400).send({error: 'Invalid "' + req.params.timestamp + ' passed as timestamp'});
  }

  // Grab list of timestamps from groups/:groupid/timestamps
  const timestampRef = db.ref(`/groups/${groupId}/timestamps`);

  timestampRef.once("value")
    .then(snapshot => snapshot.val())
    // Map to actual timestamps instead of firebase generated keys
    .then(keysObj => Object.keys(keysObj).map(key => keysObj[key]))
    // Only care about timestamps after the passed in time
    .then(timestamps => timestamps.filter(curr => curr > timestampParam),
        error => [])
    // Build list of promises to resolve
    .then(timestamps => {
        let promises = [];
        const updateRef = db.ref(`/groups/${groupId}/updates`);
        timestamps.forEach(elem => {
          const currRef = updateRef.child(`/${elem}`);
          promises.push(currRef.once("value"));
        });
        return Promise.all(promises);
    })
    .then(snapshots => snapshots.map(snapshot => snapshot.val()))
    .then(updatesList => {
      let list = [];
      updatesList.forEach(updates => list = list.concat(updates) );
      return list;
    })
    .then(list => {
        res.status(200).send({updates: list});
    }, error => { res.status(500).send({error: 'Error: ' + error}); });
});

app.patch("/groups/:group/all", (req, res) => {
  const groupId = req.params.group;

  // When the "Send updates" button was clicked
  const timestamp = req.body.timestamp;
  // List of user updates
  const userUpdates = req.body.user_updates;

  const timestampRef = db.ref(`/groups/${groupId}/timestamps/`);
  timestampRef.push(timestamp);

  // If they send updates at exact same timestamp, may overwrite the first
  // updates... for now, very unlikely so don't bother
  const updateRef = db.ref(`/groups/${groupId}/updates/${timestamp}`);
  updateRef.set(userUpdates);
  res.send(true);
  // Send false if error?
});

/*
app.post("/groups/:group/newpatient", (req, res) => {
  const groupId = req.params.group;
  const personId = `${req.body.firstname}${req.body.lastname}${req.body.birthday}`;
  console.log("post /group/newpatient to person " + personId);

  const ref = db.ref(`/${groupId}/${personId}`);
  ref.push(extractData(req.body));
  res.send(true);
});
*/

app.get("/groups/:group/:id", (req, res) => {
  res.send("patch /groups/:group/:id")
});

app.post("/groups/:group", (req, res) => {
  res.send("patch /groups/:group/all")
});

app.patch("/groups/:group/:id", (req, res) => {
  res.send("patch /groups/:group/:id")
});

app.get("*", (req,res) => {
  res.send("Error: No path matched");
});

function extractData(body) {
  return {firstname: body.firstname, lastname: body.lastname, birthday: body.birthday};
}

export let api = functions.https.onRequest(app);
