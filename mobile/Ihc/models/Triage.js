export default class Triage {
  // Insert any class methods here

}

Triage.schema = {
  name: 'Triage',
  properties: {
    patientKey: 'string',
    date: 'date',
    hasInsurance: 'bool',
    location: 'string', // Girasoles or TJP or somewhere else
    arrivalTime: 'date', // Should match the arrival time 
    timeIn: 'date',
    timeOut: 'date',
    triager: 'string', // Name of triager
    status: 'int', // 1 = EMT, 2 = Student, 3 = Nurse, 4 = Other
    statusClarification: 'string?', // If Other status, explain
    weight: 'double',
    height: 'double',
    temp: 'double',
    rr: 'double',
    o2: 'double',
    bp: 'string',
    hr: 'double',
    //---IF FEMALE---
    LMP: 'string?',
    Regular: 'bool?',
    pregnancies: 'string?',
    liveBirths: 'string?',
    abortions: 'string?',
    miscarriages: 'string?',
    //---END IF---
    history: 'string',
    //---IF LABS DONE---
    bgl: 'string?',
    a1c: 'string?',
    fasting: 'bool?',
    pregnancyTest: 'bool?',
    //--END IF---
    allergies: 'string',
    medications: 'string',
    surgeries: 'string',
    immunizations: 'string',
    chiefComplaint: 'string',
    //---IF URINE TEST---
    leukocytes: 'string?',
    blood: 'string?',
    nitrites: 'string?',
    specificGravity: 'string?',
    urobilirubin: 'string?',
    ketone: 'string?',
    protein: 'string?',
    bilirubin: 'string?',
    ph: 'string?',
    glucose: 'string?',
    //---END IF---
    pharmacySection: 'string'

  }
};
