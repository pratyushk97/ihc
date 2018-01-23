/*
 * API follows from the README
 */

import express from "express"
import bodyParser from "body-parser"
import * as db from "./Mongo"
//const cors = require('cors')({origin: true});

// Can customize port on CLI by doing `node build/init.js PORT_NUMBER`
const port = process.argv[2] || 8000;

/*
 * Just in case CORS is necesssary
var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// app.use(cors(corsOptions));
app.use(cors);
*/

db.databaseConnect();

const app = express();
// Allow JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// import routes from ./routes.js
require('./routes')(app, db);

// Generic error handling
app.use(catchError);
function catchError(err, req, res, next) {
  res.status(500).send({ error: err.message });
}

// Tablets should fetch from the computer's IP Address, i.e. 192.168.1.100
app.listen(port, () => console.log('Server listening on port ' + port))
