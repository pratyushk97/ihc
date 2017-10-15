// Eventually make DEV dependent on env variables
let DEV = process.env.NODE_ENV === 'development';
export let api_home = DEV ? 'http://localhost:5001/ihc-database/us-central1/api' : 
                            'https://us-central1-ihc-database.cloudfunctions.net/api';
