// Realm returns arrays as objects, so convert them before sending to server
export function convertObjectsToArrays(patient) {
  const copy = Object.assign({}, patient);
  copy.medications = Array.from(patient.medications);
  copy.soaps = Array.from(patient.soaps);
  copy.triages = Array.from(patient.triages);
  copy.statuses = Array.from(patient.statuses);
  return copy;
}
