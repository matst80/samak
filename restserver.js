var url  = require('url');

var restServer = function(basepath,app) {
	this.app = app;
	this.basepath = basepath;
	//this.generate(obj);
}

restServer.prototype.generateGet = function(obj)
{
	
	for(var i in obj)
	{
		
		(function(func,t,k){
			console.log(func,k);
			t.app.get(t.basepath+'/'+k,function(req,res) {
				res.header("Content-Type", "text/javascript");
				var url_parts = url.parse(req.url, true);
	    		var query = url_parts.query;
	    		query.user = req.user;
				func(res,query,req);
			});
		})(obj[i],this,i);
	}
}

restServer.prototype.generatePost = function(obj)
{
	for(var i in obj)
	{
		(function(func,t,k){
			t.app.post(t.basepath+'/'+k,function(req,res) {
				res.header("Content-Type", "text/javascript");
				func(res,req.body,req);
			});
		})(obj[i],this,i);
	}
}

module.exports = restServer;