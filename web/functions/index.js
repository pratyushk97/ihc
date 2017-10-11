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
 * GET   /:group/all   => Return information for everyone
 * GET   /:group/:id   => Return information for that person
 * POST  /:group       => Add information for new person
 * PATCH /:group/:id   => Update information for person
 * PATCH /:group/all   => Update for all updates
 */
var app = (0, _express2.default)();
admin.initializeApp(functions.config().firebase);
var db = admin.database();
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use(_bodyParser2.default.json());

app.get("/:group/all", function (req, res) {
  res.send("group/all");
});

app.get("/:group/:id", function (req, res) {
  res.send("group/:id");
});

app.post("/:group", function (req, res) {
  var groupId = req.params.group;
  var personId = "" + req.body.firstname + req.body.lastname + req.body.birthday;
  console.log("post /group to person " + personId);

  var ref = db.ref("/" + groupId + "/" + personId);
  ref.push(extractData(req.body));
  res.send(true);
});

app.patch("/:group/:id", function (req, res) {
  res.send("patch /group/:id");
});

app.patch("/:group/all", function (req, res) {
  res.send("patch /group/all");
});

function extractData(body) {
  return { firstname: body.firstname, lastname: body.lastname, birthday: body.birthday };
}

var api = exports.api = functions.https.onRequest(app);