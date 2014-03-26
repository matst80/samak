var http = require('http');
var url  = require('url');
var passport = require('passport');
var express  = require('express');
var gm = require('googlemaps');
var util = require('util');
var fs = require('fs');
var app = express();

var mysql =  require('mysql');
var RestServer =  require('./restserver.js');
var Users = require('./users.js');
var auth = require('./auth.js');
var Routes = require('./routes.js');


var pool =  mysql.createPool({
	host : 'localhost',
  	user : 'root',
  	database:'samak',
  	password: 'bananer'
  });	




app.configure(function() {
  app.use(express.static('public'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({ secret: 'minsakranyckel' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});


app.get('/userdata.js',function(req, res) {
  res.header("Content-Type", "text/javascript");
  res.send('var userdata = '+JSON.stringify(req.user));
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
//console.log('här',auth);
auth(app,user);

var restServer = new RestServer('/api',app);

restServer.generateGet(getList);
restServer.generatePost(postList);

app.get('/',function(req,res) {
	if (req.user)
		res.sendfile('./public/loggedin.htm');
	else
		res.sendfile('./public/index.htm');
});



app.listen(80);