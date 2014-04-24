module.exports = {
	generateSql : function(obj)
	{
		var keys = [];
		var values = [];
		var update = [];
		for(var k in obj)
		{
			if (k!="Id") {
				keys.push(k);
				values.push(obj[k]);
				update.push(k+' = '+obj[k]);
			}
		}
		return {keys:'`'+keys.join('`,`')+'`',values:"'"+values.join("','")+"'",update:update};
	}


}