// server.js

// set up ======================================================================
// get all the tools we need
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const MongoClient = require('mongodb').MongoClient
// mongoose is just another way of talking to our mongo database (supports schemas), maintains flexibility of mongo but makes sure the data we're sending to t
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');

// morgan - a package that logs all request so we can see what's working and not working
const morgan = require('morgan');

// cookieparser is now built into express 
// cookie-parser: allows us to stay logged in
const cookieParser = require('cookie-parser');

// bodyParser allows us to look at post request and grab data from form (this is now built into express)
const bodyParser = require('body-parser');
const session = require('express-session');

const configDB = require('./config/database.js');

let db

// configuration ===============================================================

// configDB is the object, go the the config folder and go tot the database JS file -- allows us to put our database link 
// configDB.url - is the url inside of the object

mongoose.connect(configDB.url, (err, database) => {
  if (err) return console.log(err)
  db = database
  require('./app/routes.js')(app, passport, db);
}); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))


app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'rcbootcamp2021b', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
// connect-flash handles push messages for errors


// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
