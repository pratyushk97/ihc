/*
 * This file contains helper functions involved with the User class
 */

/*
 *  * Takes in an object with birthday, firstname, lastname fields
 *   */
export function userHash(update) {
  return update.birthday + update.firstname + "&" + update.lastname;
}

/**
 *  * Takes in string hash that matches form from above userHash function,
 *  converts back
 *   * to a user
 *    */
export function extractUserFromHash(hash) {
  const bday = hash.slice(0, 8); // First 8 chars are bday format yyyymmdd
  const firstname = hash.slice(8, hash.indexOf('&'));
  const lastname = hash.slice(hash.indexOf('&') + 1);
  return {
    firstname: firstname,
    lastname: lastname,
    birthday: bday
  };
}

/*
 * Take out firstname, lastname, and birthday fields and replace with user key
 */
export function extractUpdateToSave(update, userKey) {
  const copy = Object.assign({}, update);
  copy.user = userKey;
  delete copy.firstname;
  delete copy.lastname;
  delete copy.birthday;
  return copy;
}
