
var url  = require('url');
var passport = require('passport');
var express  = require('express');
var gm = require('googlemaps');
var util = require('util');
var fs = require('fs');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

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
  'user':function(res,data) {
    res.send(data);
  },
	'route/add':function(res,data) {
		console.log(data);
		route.saveRoute(data);
		res.send({ok:true});
	}
};

var getList = {
  'user':function(res,data,req) {
    res.send(req.user);
  },
  'users':function(res) {
    res.send(user.allUsers);
  },
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

var usernames = {};

io.sockets.on('connection', function (socket) {
  
    
    
  socket.on('pos', function (data) {
    console.log(data);
  });

    // when the client emits 'sendchat', this listens and executes
  socket.on('sendchat', function (data) {
    // we tell the client to execute 'updatechat' with 2 parameters
    io.sockets.emit('updatechat', socket.username, data);
  });

    // when the client emits 'adduser', this listens and executes
  socket.on('adduser', function(username){
    // we store the username in the socket session for this client
    console.log('adduser',username);
    socket.username = username;
    // add the client's username to the global list
    usernames[username] = username;
    // echo to client they've connected
    socket.emit('updatechat', 'SERVER', 'you have connected');
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
    // update the list of users in chat, client-side
    io.sockets.emit('updateusers', usernames);
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function(){
    // remove the username from global usernames list
    delete usernames[socket.username];
    // update list of users in chat, client-side
    io.sockets.emit('updateusers', usernames);
    // echo globally that this client has left
    socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');

  });
});

var restServer = new RestServer('/api',app);

restServer.generateGet(getList);
restServer.generatePost(postList);

app.get('/',function(req,res) {
	if (req.user)
		res.sendfile('./public/loggedin.htm');
	else
		res.sendfile('./public/index.htm');
});



server.listen(80);

