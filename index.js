var http = require('http');
var url  = require('url');
var express  = require('express');

var gm = require('googlemaps');
var util = require('util');
var fs = require('fs');
var app = express();
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;


var FACEBOOK_APP_ID = '136862019768932';
var FACEBOOK_APP_SECRET = '0946637710c380df58d81760e2a6f248';


app.configure(function() {
  app.use(express.static('public'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({ secret: 'minsakranyckel' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});

var user = {};

passport.serializeUser(function(user, done) {
  console.log(user);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  console.log(user);
  done(null, user);
});

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['read_stream', 'publish_actions'] })
);
app.get('/userdata.js',function(req, res) {
  res.header("Content-Type", "text/javascript");
  res.send('var userdata = '+JSON.stringify(req.user));
});
app.get('/auth/facebook/callback', 

passport.authenticate('facebook', { successRedirect: '/loggedin.htm', failureRedirect: '/login' }));


passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://samak.foo.com/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    
	console.log(arguments);
	done(null,profile);
  }
));

app.listen(80);