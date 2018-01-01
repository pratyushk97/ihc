# IHC EMR Overview

Shortcuts:

* [Command line](#command-line)
* [How to](#how-to)
* [Overview](#overview-use-cases)
* [API](#local-server-api)
* [Local storage plan](#handling-local-storage)
* [Mobile](#mobile-plantodo)
* [Laptop](#laptop-plantodo)
* [Database](#database-design)

### Directory organization

IHC/
  - mobile
    - Ihc
      - React native code
  - web
    - React code to view admin panel
    - Current directory is very messy, filter out unnecessary stuff
    - Low priority
  - server
    - ExpressJS local server

Moqup:
https://app.moqups.com/mattchinn/ix0mjskH6z/edit/page/aa9df7b72

==========================================

### Command line

##### Run react native:
1. Start emulator
 
  (Setup instructions here: https://facebook.github.io/react-native/docs/getting-started.html
    "Building Projects With Native Code" -> Target OS: Android)

  i.e. In my ~/.bashrc I made this function, so I could just call run_emulator 
  ```
  function run_emulator {
      /Users/Matt/Library/Android/sdk/tools/emulator -avd Nexus_7_API_23
      # Wherever your emulator is stored
  }
  export -f run_emulator
  ```

2. Run ```react-native run-android``` inside IHC/mobile/Ihc directory

##### Run Express server:

*Inside IHC/server directory

1. After making changes, must build the code (transpile from ES6 to JS). Run
   ```npm run make```
2. Run server by calling ```npm run server```
3. To both make and run server, call ```npm start```

4. Start database server with ```npm run db```

==========================================

### How to...
##### 1. make a new screen

  *  First of all, distinguish component vs screen:
      - Component is a reusable piece of small UI, aka a common table
      - Screen is akin to single webpage, and the moqup pages almost all represent a
        new screen. In terms of React, a Screen is a component, but the smaller
        reusable components will go in IHC/mobile/Ihc/components instead.
        
  i. Create the screen component in IHC/mobile/Ihc/screens
  
  ii. Register the component in screens/index.js
  
  iii. Can navigate to a screen by doing
  ```javascript
    this.props.navigator.push({
      screen: 'Ihc.<Component name>'
    });
  ```
  
Other options are available: https://wix.github.io/react-native-navigation/#/screen-api

##### 2. make a new Express API route

  1. Go to server/src/routes.js and add the route

  2. Add any database interactions to src/Mongo.js
      - Generally functions should follow format of
      ```javascript
        export function patientExists(param, callback)
          MongoClient.connect(url, function(err, client) {
            assert.equal(null, err);
            client.db('ihc').collection('patients').find({patientInfo: patientInfo})
              .next( (err,doc) => {
                client.close();
                callback(doc);
              });
          });
        }
      ```
      callback(o) is where the caller handles the return object.

      Example route:
      ```javascript
        app.post("/signin/newpatient", (req,res) => {
          try {
            db.patientExists(req.body.patientInfo, (exists) => {
              if(!exists) {
                db.createPatient(req.body.patientInfo, () => res.send(true));
              } else {
                res.send(false);
              }
            } 
          } catch(err) {
            res.status(500).send({error: error}));
          }
        });
      ```

        
##### 3. test the API

  1. Run a CURL command like this:
    ```
    curl -d '{"patientInfo": {"first_name": "Brandony"}}' \
    -X POST -H "Content-Type: application/json" \
    http://localhost:8000/signin/newpatient
    ```

  2. Or use Postman

==========================================

### Overview Use Cases:
Patient gets a new SOAP and Triage form every visit

Medication and growth chart forms reused

##### High level plan:

Mobile:

- Patients sign in on tablets
- Stations add data for that patient as they go through clinic
- Tablets call API endpoints for local server
  - Store all data received locally in case of router problems
    - Figure out how to update new data efficiently!!!
    - Have a sync button that syncs up all tablets
- Must include Spanish

Laptop:

- Primary need: 
        - Run local server over a local network through router
        - Store all data in local mongo database
- Other use cases:
  (Low priority)
  - View table of all patients and go through data
- Portal for inputting records, probably into Excel and import csv
  
==========================================

### Local server API:

POST /signin/newpatient :white_check_mark:
  - Create record for that patient if didn't already exist
  ```
  body: { patientInfo: MinimizedPatientObject }
  ```
  
POST /signin/ :white_check_mark:
  - Pass patient's signin info in body
  - Ensure name and DOB exists, patient's records exist
  - Add patient to queue (including checkin time)
  - Return true if all goes well
  ```
  body: { patientInfo: MinimizedPatientObject }
  ```
  
PATCH /status/:patientId :white_check_mark:
  - Pass patient's new status, such as if they completed a station
  ```
  body: { status: StatusObject }
  ```

GET /patients?checkin=true/false
  - Return all patients, or just patients checked in 
  - Patient info should include: name, DOB, checkin time, which stations completed, miscellaneous notes
    - maybe include all forms? could then save locally, except for history
    
PATCH /patients/:id/soap/:date
  - Update patient's soap form
  
PATCH /patients/:id/triage/:date
  - Update patient's triage form
  - Also update the growthchart info
  
PATCH /patients/:id/growthchart/

GET /patients/:id/growthchart

PATCH /patients/:id/medications
  - Add update to patient's overall records
  - ```
    Update: {
      type: 'N'/'R'/'C'/'D',
      drugname: "tylenol",
      date: _,
      dose: "30mg",
      frequency: "1/day",
      duration: "1 month"
    }
    ```


##### Low Priority:

GET /patients/:id/history
  - Return list of triages and soaps dates, not the actual forms
  
GET /patients/:id/triage/:date

GET /patients/:id/soap/:date


GET /patients/:id?date=yyyymmdd 

  - May not be necessary if saving data locally from /patients?checkin=val call
  - If date included, return Triage, SOAP, Med list, Growth Chart, History (just
    ids, not actual records)
  - If not included, return Med List, Growth Chart, History (just ids, not
    actual records)

==========================================

### Handling LOCAL STORAGE as backup:
If router goes out...

- Biggest need is viewing old data, they could use paper forms temporarily.
- Needs to be in sync with history and current changes from a previous station

##### Lifecycle:

Beginning:
- Start with all history of previous patients

Signin:
- If new patient, then add to local storage and send to server for others to
grab
- All stuff on patient select page don't store locally
  - including patients that are checked in, which stations they are done with,
    special notes/requests (notes section will not be persistent)

Triage/SOAP:
(Only let one person modify at a time)
- Call server, if it doesn't have a form yet then open blank form
  - If form does exist, render
- On clicking "View Growth Chart", Add weight and height to local storage and
  read local storage to get rest of growth chart data
- If "Save", add to local storage and then send to server

Medication List:
- Display past from local storage
- On "Save", add to local storage and send to server

At end of session:
- Tablets click "Sync and end session" or something
  - Grab all patients with updates later than timestamp
  - (Should base last_updated_timestamps on local device, not the server)
  - Replace patients with new data
 
==========================================

### Mobile Plan/TODO:
React Native

- "Sync" button
  - Locally store updates with AsyncStorage
  - Disable "Sync" if updates exist

PLAN OUT LOCAL STORAGE PLAN

-- Begin N/A --

"Upload Updates" PATCH /groups/:group/all -> Express API:
Send list of local updates
Locally save list of timestamps when "Upload Updates" was clicked
Body:
  {
    timestamp: When "Upload Updates" button is clicked,
    user_updates: list of user updates
        [{ <Match user object in database design section> }]
  }

"Sync" GET /groups/:group/all/:timestamp?exclude=[timestamps] -> Express API:
Pass in 
  :timestamp of when last synced
  [timestamps] 
    - Timestamps when "Upload Updates" was clicked to exclude from results to
      avoid duplicates

Retrieve list of all updates since given timestamp (last synced)
  - Go through list and locally save updates
  - Clear local list of "Upload Updates" timestamps

-- End N/A --


==========================================

### Laptop Plan/TODO:
React and Express local server

TODO
- Form to manually add new information (?)

-- Begin N/A --

Routes:
  ESSENTIAL:
  
  GET   /groups/:group/all/:timestamp   => Return information for updates after
                                           last_synced_timestamp
    1. Grab list of send_update_timestamps from groups/:groupid
    2. For each send_update_timestamp that is later than the last_synced_timestamp
      ("Last synced" is property of the tablet)
      - Ignore timestamps passed in to exclude param 
      - Get list of updates from groups/:timestamp and consolidate into one list

  PATCH /groups/:group/all   => Update information for all people
    - Body contains 
    {
      timestamp: send_update_timestamps,
      user_updates: list of user updates
    }

  NONESSENTIAL:
  GET   /groups/:group/:id   => Return information for that person
  POST  /groups/:group      => Add information for new person
  PATCH /groups/:group/:id   => Update information for person

-- End N/A --

==========================================

### Database design:

/
        
* patients/
    * :id/ (firstname&fathers&mothers&birthday)
        * info/
          * Patient object
        * medications/
          * : drugName/
            * [DrugUpdate object, DrugUpdate object, ...]
        * soaps/
          * : date/
            * Soap object
        * triages/
          * : date/
            * Triage object
        * growthchart/
            * GrowthChart object 
        

*  signedin/
    * [Status object, ...]

Classes:

MinimizedPatient (Everything needed for signin/identification)
```
{
  first_name: string,
  father_name: string,
  mother_name: string,
  birthday: date,
  sex: int?,
}
```

Patient
```
{
  first_name: string,
  father_name: string,
  mother_name: string,
  birthday: date,
  sex: int?,
  phone: string
}
```

DrugUpdate
```
{
    date: date,
    dose: string,
    frequency: string,
    duration: string,
    notes: string
}
```

Soap
```
{
    subjective: string,
    objective: string,
    assessment: string,
    plan: string,
    wishlist: string,
    provider: string (Provider's name)
}
```

Triage
```
{
    has_insurance: boolean,
    location: string (Girasoles/TJP),
    arrival_time: date/string,
    time_in: date/string,
    time_out: date/string,
    triager: string (Triager's name),
    status: int? (EMT/Student/Nurse/Other),
    status_clarification: string (If Other),
    weight: double,
    height: double,
    temp: double,
    rr: double,
    o2: double,
    bp: string,
    hr: double,
    ---IF FEMALE---
    LMP: string,
    Regular: boolean,
    pregnancies: string,
    live_births: string,
    abortions: string,
    miscarriages: string,
    ---END IF---
    history: string (past medical history),
    ---IF LABS DONE---
    bgl: string,
    a1c: string,
    fasting: boolean,
    pregnancy_test: boolean,
    --END IF---
    allergies: string,
    meications: string,
    surgeries: string,
    immunizations: string,
    chief_complaint: string,
    ---IF URINE TEST---
    leukocytes: string,
    blood: string,
    nitrites: string,
    specific_gravity: string,
    urobilirubin: string,
    ketone: string,
    protein: string,
    bilirubin: string,
    ph: string,
    glucose: string,
    pharmacy_section: string (For pharmacy use only section)
}
```

GrowthChart
```
{
    mother_height: double,
    father_height: double,
    rows: [GrowthChartRow object, ...]
}
```

GrowthChartRow
```
{
    date: date,
    age: int,
    weight: double,
    height: double,
    bmi: double (Or don't store if we can calculate)
}
```

Status
```
{
    MinimizedPatientObject, 
    birthday: date,
    checkin_time: date8time,
    triage_completed: boolean,
    doctor_completed: boolean,
    pharmacy_completed: boolean,
    notes: string
}
```
