var routes = function (pool) {
	this.pool = pool;
	this.tbl = 'routes';
}

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
	this.pool.getConnection(function(err, connection){
		var sql = "insert into "+t.tbl+" (`Start`,`End`,`StartTime`,`Title`) VALUES ('"+routedata.start+"','"+routedata.end+"','"+routedata.time+"','"+routedata.title+"')";
		
		connection.query( sql,  function(err, rows){
			console.log('efter sparning',err,rows);
			
		});
	 	connection.release();
	});		
};
module.exports = routes;