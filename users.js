var sql  = require('./sqlhelper.js');

function extend() {
    var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false,
        toString = Object.prototype.toString,
        hasOwn = Object.prototype.hasOwnProperty,
        push = Array.prototype.push,
        slice = Array.prototype.slice,
        trim = String.prototype.trim,
        indexOf = Array.prototype.indexOf,
        class2type = {
          "[object Boolean]": "boolean",
          "[object Number]": "number",
          "[object String]": "string",
          "[object Function]": "function",
          "[object Array]": "array",
          "[object Date]": "date",
          "[object RegExp]": "regexp",
          "[object Object]": "object"
        },
        jQuery = {
          isFunction: function (obj) {
            return jQuery.type(obj) === "function"
          },
          isArray: Array.isArray ||
          function (obj) {
            return jQuery.type(obj) === "array"
          },
          isWindow: function (obj) {
            return obj != null && obj == obj.window
          },
          isNumeric: function (obj) {
            return !isNaN(parseFloat(obj)) && isFinite(obj)
          },
          type: function (obj) {
            return obj == null ? String(obj) : class2type[toString.call(obj)] || "object"
          },
          isPlainObject: function (obj) {
            if (!obj || jQuery.type(obj) !== "object" || obj.nodeType) {
              return false
            }
            try {
              if (obj.constructor && !hasOwn.call(obj, "constructor") && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                return false
              }
            } catch (e) {
              return false
            }
            var key;
            for (key in obj) {}
            return key === undefined || hasOwn.call(obj, key)
          }
        };
      if (typeof target === "boolean") {
        deep = target;
        target = arguments[1] || {};
        i = 2;
      }
      if (typeof target !== "object" && !jQuery.isFunction(target)) {
        target = {}
      }
      if (length === i) {
        target = this;
        --i;
      }
      for (i; i < length; i++) {
        if ((options = arguments[i]) != null) {
          for (name in options) {
            src = target[name];
            copy = options[name];
            if (target === copy) {
              continue
            }
            if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
              if (copyIsArray) {
                copyIsArray = false;
                clone = src && jQuery.isArray(src) ? src : []
              } else {
                clone = src && jQuery.isPlainObject(src) ? src : {};
              }
              // WARNING: RECURSION
              target[name] = extend(deep, clone, copy);
            } else if (copy !== undefined) {
              target[name] = copy;
            }
          }
        }
      }
      return target;
    }

var users = function(pool) {
	this.pool = pool;
	this.init();
	this.tbl = 'users';
	
}
users.prototype.loadFromDb = function(cb) {
	var t = this;
	this.pool.getConnection(function(err, connection){
		console.log(err,connection);
		connection.query( 'select * from '+t.tbl,  function(err, rows){
			t.allUsers = rows;
			t.isLoaded = true;
			if (cb)
				cb(rows);
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
users.prototype.profile = function(data,cb) {
	this.update(data,cb);
};
users.prototype.update = function(data) {
	var t = this;
	this.pool.getConnection(function(err, connection){
		var sqlData = sql.generateSql(data);
		connection.query( "update "+t.tbl+" set "+sqlData.update+" where Id="+data.Id,  function(err, rows){
			cb(data);
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