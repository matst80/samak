var sql  = require('./sqlhelper.js');

var routes = function (pool) {
	this.pool = pool;
	this.tbl = 'routes';
}
routes.prototype.find = function(start,end)
{
	
};
routes.prototype.init = function() {};
routes.prototype.getRoutes = function(cb) {
	var t = this;
	t.pool.getConnection(function(err, connection){
		
		connection.query( 'select * from '+t.tbl,  function(err, rows){
		  	if(err)	{
		  		throw err;
		  	}else{
		  		cb(rows);
		  	}
		  });
		  
		  connection.release();
	});
};
routes.prototype.saveRoute = function(routedata) {
	var t = this;
	var sqldata = sql.generateSql(routedata);
	console.log(sqldata);
	this.pool.getConnection(function(err, connection){
		var sql = "insert into "+t.tbl+" ("+sqldata.keys+") VALUES ("+sqldata.values+")";
		console.log(sql);
		connection.query( sql,  function(err, rows){
			console.log('efter sparning',err,rows);
			
		});
	 	connection.release();
	});		
};
module.exports = routes;