"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.api = undefined;

var _firebaseFunctions = require("firebase-functions");

var functions = _interopRequireWildcard(_firebaseFunctions);

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _firebaseAdmin = require("firebase-admin");

var admin = _interopRequireWildcard(_firebaseAdmin);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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
var app = (0, _express2.default)();
admin.initializeApp(functions.config().firebase);
var db = admin.database();
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use(_bodyParser2.default.json());

app.get("/groups/:group/all/:timestamp", function (req, res) {
  var groupId = req.params.group;
  var timestampParam = parseInt(req.params.timestamp);
  // :timestamp should be a number, but wasn't
  if (Number.isNaN(timestampParam)) {
    res.status(400).send({ error: 'Invalid "' + req.params.timestamp + ' passed as timestamp' });
  }

  // Grab list of timestamps from groups/:groupid
  var timestampRef = db.ref("/groups/" + groupId + "/timestamps");

  // Only care about timestamps after the passed in time
  timestampRef.once("value").then(function (snapshot) {
    return snapshot.val();
  })
  // Map to actual timestamps instead of firebase generated keys
  .then(function (keysObj) {
    return Object.keys(keysObj).map(function (key) {
      return keysObj[key];
    });
  }).then(function (timestamps) {
    return timestamps.filter(function (curr) {
      return curr > timestampParam;
    });
  }, function (error) {
    return [];
  }).then(function (timestamps) {
    // Build list of promises to resolve
    var promises = [];
    var updateRef = db.ref("/groups/" + groupId + "/updates");
    timestamps.forEach(function (elem) {
      var currRef = updateRef.child("/" + elem);
      promises.push(currRef.once("value"));
    });
    return Promise.all(promises);
  }).then(function (snapshots) {
    return snapshots.map(function (snapshot) {
      return snapshot.val();
    });
  }).then(function (updatesList) {
    var list = [];
    updatesList.forEach(function (updates) {
      return list = list.concat(updates);
    });
    return list;
  }).then(function (list) {
    res.status(200).send({ updates: list });
  }, function (error) {
    res.status(500).send({ error: 'Error: ' + error });
  });
});

app.patch("/groups/:group/all", function (req, res) {
  var groupId = req.params.group;

  // When the "Send updates" button was clicked
  var timestamp = req.body.timestamp;
  // List of user updates
  var userUpdates = req.body.user_updates;

  var timestampRef = db.ref("/groups/" + groupId + "/timestamps/");
  timestampRef.push(timestamp);

  // If they send updates at exact same timestamp, may overwrite the first
  // updates... for now, very unlikely so don't bother
  var updateRef = db.ref("/groups/" + groupId + "/updates/" + timestamp);
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

app.get("/groups/:group/:id", function (req, res) {
  res.send("patch /groups/:group/:id");
});

app.post("/groups/:group", function (req, res) {
  res.send("patch /groups/:group/all");
});

app.patch("/groups/:group/:id", function (req, res) {
  res.send("patch /groups/:group/:id");
});

app.get("*", function (req, res) {
  res.send("Error: No path matched");
});

function extractData(body) {
  return { firstname: body.firstname, lastname: body.lastname, birthday: body.birthday };
}

var api = exports.api = functions.https.onRequest(app);