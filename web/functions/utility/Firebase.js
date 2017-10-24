'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addUpdates = addUpdates;

var _UserUtil = require('./UserUtil');

// Helper functions ===================================

// Gets a new update key and then adds the update
function addUpdate(update, updatesTimestampRef, groupId, database) {
  console.log('addupdate', update);
  // Get new update key for each update
  var updateKey = updatesTimestampRef.push(true).key;
  update = (0, _UserUtil.extractUpdateToSave)(update, update.user);

  console.log('1');
  console.log('database', database);
  // TODO: Error handling of this set call
  var updateRef = database.ref('/groups/' + groupId + '/updates/' + updateKey);
  console.log('updateref', updateRef);
  updateRef.set(update).catch(function (error) {
    return console.log('Error while calling Firebase set()', error);
  });

  console.log('2');
  var userUpdatesRef = database.ref('/groups/' + groupId + '/user/' + update.user + '/' + updateKey);
  userUpdatesRef.set(true);

  console.log('3');
  var usersRef = database.ref('/groups/' + groupId + '/users/' + update.user);
  usersRef.child('lastupdated').set(new Date().getTime());
  console.log('4');
}

// Returns a promise that resolves when all users are confirmed to be added to
// the database
// Also updates the updates objects to include the user:userKey key/value pair
/* Wrapper class to handle all firebase calls for the MOBILE side */
function addNewUsers(updates, groupId, database) {
  console.log('addnewusers');
  var usersRef = database.ref('/groups/' + groupId + '/users');
  var promises = [];
  var newUpdates = [];

  updates.forEach(function (update) {
    var hash = (0, _UserUtil.userHash)(update);
    var getUserKeyPromise = getUserKey(hash, groupId, database).then(function (userKey) {
      // User doesn't exist yet
      if (!userKey) {
        // Add them
        var pushRef = usersRef.push();
        userKey = pushRef.key;
        var promise = pushRef.child('data').set(hash);
        var promise2 = pushRef.child('lastupdated').set(new Date().getTime());
        promises.push(promise);
        promises.push(promise2);
      }
      var newUpdate = Object.assign({}, update);
      newUpdate.user = userKey;
      newUpdates.push(newUpdate);
      console.log('newupdates', newUpdates);
    });
    promises.push(getUserKeyPromise);
  });
  return Promise.all(promises).then(function () {
    return newUpdates;
  });
}

// Returns a promise of userKey
function getUserKey(hash, groupId, database) {
  console.log('getuserkey', hash);
  var usersRef = database.ref('/groups/' + groupId + '/users');
  return usersRef.orderByChild('data').equalTo(hash).once('value').then(function (snapshot) {
    return snapshot.val();
  }).then(function (keyObj) {
    return keyObj ? Object.keys(keyObj)[0] : null;
  });
}

// public functions ===================================

/*
 * Adds updates for list of users
 * If timestamp is not defined, will create one
 */
function addUpdates(updates, groupId, database, timestamp) {
  if (!Array.isArray(updates)) {
    throw new Error('addUpdates(updates): Non-array type passed in as updates');
  }
  if (!timestamp) timestamp = new Date().getTime();

  var groupRef = database.ref('/groups/' + groupId + '/');

  // Add timestamp and extract its generated key
  var newTimestampRef = groupRef.child('timestamps').push(timestamp);
  var timestampKey = newTimestampRef.key;
  var updatesTimestampRef = database.ref('/groups/' + groupId + '/updates/timestamp/' + timestampKey);

  // Add any new users, returns updates with the userKey
  return addNewUsers(updates, groupId, database).then(function (val) {
    console.log('after addnewusers', val);return val;
  }).catch(function () {
    throw new Error('addNewUsers() failed');
  }).then(function (updates) {
    updates.forEach(function (update) {
      addUpdate(update, updatesTimestampRef, groupId, database);
    });
  });
}