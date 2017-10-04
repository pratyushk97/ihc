/* 
  Express routes
  GET   /api/:group/all   => Return information for everyone
  GET   /api/:group/:id   => Return information for that person
  POST  /api/:group      => Add information for new person
  PATCH /api/:group/:id   => Update information for person
  PATCH /api/:group/all   => Update for all updates
*/
var admin = require('./firebase_config');

module.exports = function(app){
  app.get('/api/:group/all', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.json('Hi');
    console.log(`Sent response`);
  });
}
