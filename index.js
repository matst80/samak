var http = require('http');
var url  = require('url');
var express  = require('express');

var gm = require('googlemaps');
var util = require('util');
var fs = require('fs');
var app = express();
var passport = require('passport');
var mysql =  require('mysql');
var RestServer =  require('./restserver.js');
var Users = require('./users.js');
var Routes = require('./routes.js');
var FacebookStrategy = require('passport-facebook').Strategy;

var pool =  mysql.createPool({
	host : 'localhost',
  	user : 'root',
  	database:'samak',
  	password: 'bananer'
  });	

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

passport.serializeUser(function(user, done) {
  console.log(user);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  console.log(user);
  done(null, user);
});



var postList = {
	'route/add':function(res,data) {
		console.log(data);
		route.saveRoute(data);
		res.send({ok:true});
	}
};

var getList = {
	'routes':function(res,data) {
		route.getRoutes(function(data) {
			res.send(data);
		});
	}
};

var user = new Users(pool);
var route = new Routes(pool);

var restServer = new RestServer('/api',app);

restServer.generateGet(getList);
restServer.generatePost(postList);

app.get('/',function(req,res) {
	if (req.user)
		res.sendfile('./public/loggedin.htm');
	else
		res.sendfile('./public/index.htm');
});

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['read_stream', 'publish_actions'] })
);
app.get('/userdata.js',function(req, res) {
  res.header("Content-Type", "text/javascript");
  res.send('var userdata = '+JSON.stringify(req.user));
});
app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/loggedin.htm', failureRedirect: '/login' }));


passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://samak.foo.com/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
	console.log(arguments);
	user.findOrCreate(profile,function() {
		console.log('saved');
	});
	done(null,profile);
  }
));

app.listen(80);