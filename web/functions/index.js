"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.api = undefined;

var _firebaseFunctions = require("firebase-functions");

var functions = _interopRequireWildcard(_firebaseFunctions);

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _firebase_config = require("firebase_config");

var _firebase_config2 = _interopRequireDefault(_firebase_config);

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
_firebase_config2.default.initializeApp(functions.config().firebase);

app.get("/:group/all", function (req, res) {
  res.send("group/all");
});

app.get("/:group/:id", function (req, res) {
  res.send("group/:id");
});

app.post("/:group", function (req, res) {
  res.send("post /group");
});

app.patch("/:group/:id", function (req, res) {
  res.send("patch /group/:id");
});

app.patch("/:group/all", function (req, res) {
  res.send("patch /group/all");
});

var api = exports.api = functions.https.onRequest(app);