/* Wrapper class to handle all firebase calls for this application */
import {firebase} from './firebase_config';

const database = firebase.database();

// Helper functions ===================================

// Returns promise of an update
function getUpdate(updateKey, groupId) {
  const updateRef = database.ref(`/groups/${groupId}/updates/${updateKey}`);
  return updateRef.once('value').then(snapshot => snapshot.val());
}

// Gets a new update key and then adds the update
function addUpdate(update, updatesTimestampRef, groupId) {
  // Get new update key for each update
  const updateKey = updatesTimestampRef.push(true).key;

  // TODO: Error handling of this set call
  const updateRef = database.ref(`/groups/${groupId}/updates/${updateKey}`);
  updateRef.set(update)
    .catch(error => console.log('Error while calling Firebase set()', error));

  const hash = userHash(update);
  const userUpdatesRef = database.ref(`/groups/${groupId}/user/${hash}/${updateKey}`);
  userUpdatesRef.set(true);
}

// Returns a promise that resolves when all users are confirmed to be added to
// the database
function addNewUsers(updates, groupId) {
  const usersRef = database.ref(`/groups/${groupId}/users`);
  const newUserPromises = [];

  updates.forEach(update => {
    const hash = userHash(update);
    getUserKey(hash, groupId).then(userKey => {
      // User doesn't exist yet
      if(!userKey) {
        // Add them
        const promise = usersRef.push().set(hash);
        newUserPromises.push(promise);
      }
    });
  });
  return Promise.all(newUserPromises);
}

// Returns a promise of userKey
function getUserKey(hash, groupId) {
  const usersRef = database.ref(`/groups/${groupId}/users`);
  return usersRef.orderByValue().equalTo(hash).once('value')
    .then(snapshot => snapshot.val())
}

/*
 * Takes in an object with birthday, firstname, lastname fields
 */
function userHash(update) {
  return update.birthday + update.firstname + "&" + update.lastname;
}

/**
 * Takes in string hash that matches form from above userHash function, converts back
 * to a user
 */
function extractUserFromHash(hash) {
  const bday = hash.slice(0, 8); // First 8 chars are bday format yyyymmdd
  const firstname = hash.slice(8, hash.indexOf('&'));
  const lastname = hash.slice(hash.indexOf('&') + 1);
  return {
    firstname: firstname,
    lastname: lastname,
    birthday: bday
  };
}

// public functions ===================================

/*
 * Call callback on every update, passing in the list of users
 * Returns the callback function that can be passed in to off()
 *
 * Example:
 *     firebase.setupAllUsersStream(groupId, users => {
 *           this.setState({users: users});
 *     });
 *
 */
export function setupAllUsersStream(groupId, callback) {
  const updatesRef = database.ref(`/groups/${groupId}/users`);
  return updatesRef.on('value', snapshot => {
    let usersObj = snapshot.val();
    usersObj = usersObj ? usersObj : {};
    const hashedUsers = Object.keys(usersObj).map(key => usersObj[key]);
    const users = hashedUsers.map(hashedUser => extractUserFromHash(hashedUser));
    callback(users);
  })
}

/*
 * Call callback on every new update, passing in the user's updates
 * WARNING: Will not fire callback if an old update has been modified
 * Takes in a user object with fields: firstname, lastname, birthday
 * Returns the callback function that can be passed in to off()
 *
 * Example:
 *     firebase.setupUserUpdatesStream(user, groupId, updates => {
 *           this.setState({updates: updates})
 *     });
 *
 */

export function setupUserUpdatesStream(user, groupId, callback) {
  const hash = userHash(user);
  const updateKeysRef = database.ref(`/groups/${groupId}/user/${hash}`);
  return updateKeysRef.on('value', snapshot => {
    const updateKeysObj = snapshot.val();
    const updateKeys = updateKeysObj ? Object.keys(updateKeysObj) : [];
    const updates = [];
    const promises = [];

    updateKeys.forEach(updateKey => {
      const promise = getUpdate(updateKey, groupId)
        .then(update => updates.push(update));
      promises.push(promise);
    });
    // When all updates are added and promises are resolved, then call callback
    Promise.all(promises)
      .then(() => callback(updates));
  });
}

/*
 * Adds updates for list of users
 */
export function addUpdates(updates, groupId) {
  if(!Array.isArray(updates)) {
    throw new Error('addUpdates(updates): Non-array type passed in as updates');
  }
  const timestamp = new Date().getTime();
  const groupRef = database.ref(`/groups/${groupId}/`);

  // Add timestamp and extract its generated key
  const newTimestampRef = groupRef.child('timestamps').push(timestamp);
  const timestampKey = newTimestampRef.key;
  const updatesTimestampRef = database.ref(`/groups/${groupId}/updates/timestamp/${timestampKey}`);

  // Add any new users
  addNewUsers(updates, groupId)
    .then(() => true)
    .catch(() => {throw new Error('addNewUsers() failed');})
    .then(() => {
      updates.forEach(update => {
        addUpdate(update, updatesTimestampRef, groupId);
      });
    });
}

