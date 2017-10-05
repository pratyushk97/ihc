import * as functions from "firebase-functions"
import express from "express"
import * as admin from "firebase-admin"
import bodyParser from "body-parser";
import multer from "multer";

/*
 * API:
 * GET   /:group/all   => Return information for everyone
 * GET   /:group/:id   => Return information for that person
 * POST  /:group       => Add information for new person
 * PATCH /:group/:id   => Update information for person
 * PATCH /:group/all   => Update for all updates
 */
const app = express();
admin.initializeApp(functions.config().firebase);
const db = admin.database();
app.use(bodyParser.json());

app.get("/:group/all", (req, res) => {
  res.send("group/all")
});

app.get("/:group/:id", (req, res) => {
  res.send("group/:id")
});

app.post("/:group", multer().array(), (req, res) => {
  // TODO this isnt working
  const groupId = req.params.group;
  const personId = `${req.body.firstname}${req.body.lastname}${req.body.birthday}`;

  res.send(req.body);
  //res.send("post /group to ID " + personId);
  const ref = db.ref(`/${groupId}/${personId}`);
  ref.push(req.body);
});

app.patch("/:group/:id", (req, res) => {
  res.send("patch /group/:id")
});

app.patch("/:group/all", (req, res) => {
  res.send("patch /group/all")
});

export let api = functions.https.onRequest(app);
