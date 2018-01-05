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

db.databaseCheck();

const app = express();
// Allow JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Error handling
// TODO: Make sure this actually works properly
app.use(catchError);
function catchError(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: err })
  } else {
    next(err)
  }            
}

// import routes from ./routes.js
require('./routes')(app, db);

// Temporarily work with the localhost to make dev life easier
app.listen(port, () => console.log('Server listening on port ' + port))

// Looks to currently be 192.168.1.147
/*
const host = process.env.HOST || '0.0.0.0';
app.listen(port, host, 500, () => console.log('Server listenin on port ' + port +
    ' and host ' + host));
*/
