import * as functions from "firebase-functions"
import express from "express"
import admin from "firebase_config"

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

app.get("/:group/all", (req, res) => {
  res.send("group/all")
});

app.get("/:group/:id", (req, res) => {
  res.send("group/:id")
});

app.post("/:group", (req, res) => {
  res.send("post /group")
});

app.patch("/:group/:id", (req, res) => {
  res.send("patch /group/:id")
});

app.patch("/:group/all", (req, res) => {
  res.send("patch /group/all")
});

export let api = functions.https.onRequest(app);
