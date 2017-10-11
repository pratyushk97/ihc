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
  res.send("group/all")
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
