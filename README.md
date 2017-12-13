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

GET /signin/newpatient/unique (SHOULD BE HANDLED LOCALLY)
  - Ensure name and DOB is unique
  
POST /signin/newpatient
  - Create record for that patient if didn't already exist
  
POST /signin/:id
  - Ensure name and DOB exists, patient's records exist
  - Add patient to queue (including checkin time)
  - Return true if all goes well
  
POST /signout/:id

GET /patients?checkin=true/false
  - Return all patients, or just patients checked in 
  - Patient info should include: name, DOB, checkin time, which stations completed, miscellaneous notes
    - maybe include all forms? could then save locally, except for history
    
PATCH /patients/:id/soap/:date
  - Update patient's soap form
  
PATCH /patients/:id/triage/:date
  - Update patient's triage form
  - Also update the growthchart info
  
PATCH /patients/:id/growthchart/:date

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

REDO WITH LOCAL MONGODB

-- Begin N/A --
ihc-database.firebaseio.com/
  groups/
    :groupid/
      timestamps/
        List of auto generated timestamp keys pointing to the times "Upload
        updates" was clicked
        [{
          timestampKey: number 
        }, ...]
      updates/
        timestamp/
          :timestampKey/
            List of auto generated update keys, don't care about value
            [{
              updateKey: true
            }, ...]
      updates/
        :updateKey/
          Object of update, contains all data entered for a patient
          {
            user: string (userKey)
            date: number (yyyymmdd)
            weight: string
            height: string
            blood pressure: string
            current meds: string
            symptoms: string
            notes: string
          }
      users/
        :userKey/
          Unique user info (Is it guaranteed unique?)
          {
            data: string (birthday (yyyymmdd) + && + firstname + &&  + lastname)
            lastupdated: number
          }
      user/
        :userKey/
          List of updateKeys for that user
          [{
            updateKey: true
          }]

-- End N/A --



