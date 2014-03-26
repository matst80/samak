var sql  = require('./sqlhelper.js');

var users = function(pool) {
	this.pool = pool;
	this.init();
	this.tbl = 'users';
	
}
users.prototype.loadFromDb = function(cb) {
	var t = this;
	this.pool.getConnection(function(err, connection){
		connection.query( 'select * from '+t.tbl,  function(err, rows){
			t.allUsers = rows;
			t.isLoaded = true;
		});
	 	connection.release();
	});
};
users.prototype.init = function() {
	this.loadFromDb();
};
users.prototype.parseProfile = function(profile) {
	if (profile.Key)
		return profile;
	else {
		var ret = {
			Name:profile.displayName,
			Key:profile.id,
			Consumption:0.7,
			Emmission:150
		};
		return ret;
	}
};
users.prototype.createUser = function(profile,cb) {
	var t = this;
	this.pool.getConnection(function(err, connection){
		var sqlData = sql.generateSql(profile);
		connection.query( "insert into "+t.tbl+" ("+sqlData.keys+") VALUES ("+sqlData.values+")",  function(err, rows){
			cb(profile);
			t.loadFromDb();
		});
	 	connection.release();
	});	
}
users.prototype.update = function(data) {
	var t = this;
	this.pool.getConnection(function(err, connection){
		var sqlData = sql.generateSql(data);
		connection.query( "update "+t.tbl+" set "+sqlData.update+" where Id="+data.Id,  function(err, rows){
			cb(profile);
			t.loadFromDb();
		});
	 	connection.release();
	});	
};
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