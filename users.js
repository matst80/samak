var users = function(pool) {
	this.pool = pool;
	this.init();
	
}
users.prototype.loadFromDb = function(cb) {
	var t = this;
	this.pool.getConnection(function(err, connection){
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
	this.pool.getConnection(function(err, connection){
		connection.query( "insert into users (`Key`,`Name`) VALUES ('"+profile.id+"','"+profile.username+"')",  function(err, rows){
			cb(rows);
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
		cb(foundUser);
	}
	if (!foundUser)
	{
		this.createUser(profile,cb);
	}
	
};
module.exports = users;