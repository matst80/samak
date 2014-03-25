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

app.use(express.static('./public'));
app.use(express.logger());

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['read_stream', 'publish_actions'] })
);

app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { successRedirect: '/index.htm',
                                      failureRedirect: '/login' }));

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://samak.foo.com/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    
	console.log(arguments);
	done(null,{test:1});
  }
));

app.use(function(req, res){
	//console.log(req);
	res.end(200,'hej');
});
app.listen(80);