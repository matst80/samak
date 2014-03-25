var http = require('http');
var url  = require('url');
var express  = require('express');

var gm = require('googlemaps');
var util = require('util');
var fs = require('fs');
var app = express();
var passport = require('passport');
var mysql =  require('mysql');
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

var user = {};

passport.serializeUser(function(user, done) {
  console.log(user);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  console.log(user);
  done(null, user);
});


var users = function() {
	this.init();
}
users.prototype.loadFromDb = function(cb) {
	var t = this;
	pool.getConnection(function(err, connection){
		connection.query( 'select * from users',  function(err, rows){
			t.allUsers = rows;
			t.isLoaded = true;
		});
	 	connection.release();
	});
};
users.prototype.init = function() {
	
	this.loadFromDb();
};
users.prototype.createUser = function(profile,cb) {
	var t = this;
	pool.getConnection(function(err, connection){
		var sql = "insert into users (`Key`,`Name`) VALUES ('"+profile.id+"','"+profile.username+"')";
		console.log(sql);
		connection.query( sql,  function(err, rows){
			console.log('efter sparning',err,rows);
			t.loadFromDb();
		});
	 	connection.release();
	});	
}
users.prototype.findOrCreate = function (profile,cb,err) {
	var foundUser;
	for(var i=0;i<this.allUsers.length;i++)
	{
		var cuser = this.allUsers[i];
		if (profile.id==cuser.Key)
			foundUser = cuser;
	}
	if (!foundUser)
	{
		this.createUser(profile,cb);
	}
	cb();
};

var User = new users();

app.get('/api/routes',function(req,res) {
	pool.getConnection(function(err, connection){
		res.header("Content-Type", "text/javascript");
		connection.query( 'select * from routes',  function(err, rows){
		  	if(err)	{
		  		throw err;
		  	}else{
		  		console.log( rows );
				res.send(JSON.stringify(rows));		  		
		  	}
		  });
		  
		  connection.release();
	});
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
	User.findOrCreate(profile,function() {
		console.log('saved');
	});
	done(null,profile);
  }
));

app.listen(80);