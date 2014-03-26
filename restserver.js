var restServer = function(basepath,app) {
	this.rest = obj;
	this.app = app;
	this.basepath = basepath;
	//this.generate(obj);
}

restServer.prototype.generateGet = function(obj)
{
	for(var k in obj)
	{
		var func = obj[k];
		app.get(basepath+'/'+k,function(req,res) {
			res.header("Content-Type", "text/javascript");
			var url_parts = url.parse(req.url, true);
    		var query = url_parts.query;
    		query.user = req.user;
			func(res,query,req);
		});
	}
}

restServer.prototype.generatePost = function(obj)
{
	for(var k in obj)
	{
		var func = obj[k];
		app.post(basepath+'/'+k,function(req,res) {
			res.header("Content-Type", "text/javascript");
			func(res,req.body,req);
		});
	}
}

module.exports = restServer;