/* Wrapper class to handle all firebase calls for the MOBILE side */
import {userHash, extractUser, extractUpdateToSave} from './UserUtil';

// Helper functions ===================================

// Gets a new update key and then adds the update
function addUpdate(update, updatesTimestampRef, groupId, database) {
  console.log('addupdate', update);
  // Get new update key for each update
  const updateKey = updatesTimestampRef.push(true).key;
  update = extractUpdateToSave(update, update.user);

  console.log('1');
  console.log('database', database);
  // TODO: Error handling of this set call
  const updateRef = database.ref(`/groups/${groupId}/updates/${updateKey}`);
  console.log('updateref', updateRef);
  updateRef.set(update)
    .catch(error => console.log('Error while calling Firebase set()', error));

  console.log('2');
  const userUpdatesRef = database.ref(`/groups/${groupId}/user/${update.user}/${updateKey}`);
  userUpdatesRef.set(true);

  console.log('3');
  const usersRef = database.ref(`/groups/${groupId}/users/${update.user}`);
  usersRef.child('lastupdated').set(new Date().getTime());
  console.log('4');
}

// Returns a promise that resolves when all users are confirmed to be added to
// the database
// Also updates the updates objects to include the user:userKey key/value pair
function addNewUsers(updates, groupId, database) {
  console.log('addnewusers');
  const usersRef = database.ref(`/groups/${groupId}/users`);
  const promises = [];
  const newUpdates = [];

  updates.forEach(update => {
    const hash = userHash(update);
    const getUserKeyPromise = getUserKey(hash, groupId, database).then(userKey => {
      // User doesn't exist yet
      if(!userKey) {
        // Add them
        const pushRef = usersRef.push();
        userKey = pushRef.key;
        const promise = pushRef.child('data').set(hash);
        const promise2 = pushRef.child('lastupdated').set(new Date().getTime());
        promises.push(promise);
        promises.push(promise2);
      }
      const newUpdate = Object.assign({}, update);
      newUpdate.user = userKey;
      newUpdates.push(newUpdate);
      console.log('newupdates', newUpdates);
    });
    promises.push(getUserKeyPromise);
  });
  return Promise.all(promises).then(() => newUpdates);
}

// Returns a promise of userKey
function getUserKey(hash, groupId, database) {
  console.log('getuserkey', hash);
  const usersRef = database.ref(`/groups/${groupId}/users`);
  return usersRef.orderByChild('data').equalTo(hash).once('value')
    .then(snapshot => snapshot.val())
    .then(keyObj => keyObj ? Object.keys(keyObj)[0] : null);
}

// public functions ===================================

/*
 * Adds updates for list of users
 * If timestamp is not defined, will create one
 */
export function addUpdates(updates, groupId, database, timestamp) {
  if(!Array.isArray(updates)) {
    throw new Error('addUpdates(updates): Non-array type passed in as updates');
  }
  if(!timestamp)
    timestamp = new Date().getTime();

  const groupRef = database.ref(`/groups/${groupId}/`);

  // Add timestamp and extract its generated key
  const newTimestampRef = groupRef.child('timestamps').push(timestamp);
  const timestampKey = newTimestampRef.key;
  const updatesTimestampRef = database.ref(`/groups/${groupId}/updates/timestamp/${timestampKey}`);

  // Add any new users, returns updates with the userKey
  return addNewUsers(updates, groupId, database)
    .then(val => { console.log('after addnewusers', val); return val;})
    .catch(() => {throw new Error('addNewUsers() failed');})
    .then(updates => {
      updates.forEach(update => {
        addUpdate(update, updatesTimestampRef, groupId, database);
      });
    });
}

