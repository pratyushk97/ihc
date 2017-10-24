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

var _Firebase = require("./utility/Firebase");

var firebase = _interopRequireWildcard(_Firebase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

//const cors = require('cors')({origin: true});

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

/* Web frontend will talk directly to firebase and not through here. Only mobile
 * will request through Express and CORS isn't required for mobile
 *
var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// app.use(cors(corsOptions));
app.use(cors);
*/

app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use(_bodyParser2.default.json());

app.get("/groups/:group/all/:timestamp", function (req, res) {
  var groupId = req.params.group;
  var timestampParam = parseInt(req.params.timestamp);
  var excludeTimestamps = req.query.exclude;

  // :timestamp should be a number, but wasn't
  if (Number.isNaN(timestampParam)) {
    res.status(400).send({
      error: 'Invalid "' + req.params.timestamp + ' passed as timestamp'
    });
  }

  // Grab list of timestamps from groups/:groupid/timestamps
  var timestampRef = db.ref("/groups/" + groupId + "/timestamps");

  timestampRef.once("value").then(function (snapshot) {
    return snapshot.val();
  })
  // Only care about timestamps after the passed in time
  // and filter out keys that are labeled as exclude
  .then(function (keysObj) {
    return Object.keys(keysObj).filter(function (key) {
      var currTimestamp = keysObj[key];
      if (currTimestamp < timestampParam) return false;

      if (Array.isArray(excludeTimestamps)) {
        return excludeTimestamps.indexOf(currTimestamp.toString()) === -1;
      } else {
        return excludeTimestamps !== currTimestamp;
      }
    });
  }, function (error) {
    return [];
  })
  // Build list of promises of updateKey to resolve
  .then(function (timestampKeys) {
    var promises = [];
    var updateRef = db.ref("/groups/" + groupId + "/updates/timestamp");
    timestampKeys.forEach(function (timestampKey) {
      var currRef = updateRef.child("/" + timestampKey);
      promises.push(currRef.once("value"));
    });
    return Promise.all(promises);
  }).then(function (snapshots) {
    return snapshots.map(function (snapshot) {
      return snapshot.val();
    });
  })
  // Have updateKeyObjs, extract updateKey and combine into one list
  .then(function (objs) {
    return objs.reduce(function (total, curr) {
      return total.concat(Object.keys(curr));
    }, []);
  })
  // For each updateKey, get the actual update promise
  .then(function (updateKeys) {
    var promises = [];
    var updateRef = db.ref("/groups/" + groupId + "/updates/");
    updateKeys.forEach(function (updateKey) {
      var currRef = updateRef.child("/" + updateKey);
      promises.push(currRef.once("value"));
    });
    return Promise.all(promises);
  }).then(function (updates) {
    res.status(200).send({ updates: updates });
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

  firebase.addUpdates(userUpdates, groupId, db, timestamp).then(function () {
    return res.send(true);
  }, function (error) {
    return res.status(500).send({ error: error });
  });
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