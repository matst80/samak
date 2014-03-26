var passport = require('passport'),
	FacebookStrategy = require('passport-facebook').Strategy,
	TwitterStrategy = require('passport-twitter').Strategy,
	GoogleStrategy = require('passport-google').Strategy;

var FACEBOOK_APP_ID = '136862019768932';
var FACEBOOK_APP_SECRET = '0946637710c380df58d81760e2a6f248';

var TWITTER_CONSUMER_KEY = 'mo3HA1FoyEIvkzZEprzOw';
var TWITTER_CONSUMER_SECRET = 'tE4jTDhtggfioFx8TTtDctEWZ5B9YsECkvrkDjnw';

var baseUrl = 'http://samak.foo.com';

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});


module.exports = function(app,user) {
	
	app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['read_stream', 'publish_actions'] }));

	app.get('/auth/twitter', passport.authenticate('twitter'));

	app.get('/auth/google', passport.authenticate('google'));

	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});

	var authOptions = { successRedirect: '/', failureRedirect: '/' };

	app.get('/auth/twitter/callback', passport.authenticate('twitter', authOptions));

	app.get('/auth/facebook/callback', passport.authenticate('facebook', authOptions));

	app.get('/auth/google/return', passport.authenticate('google', authOptions));

	function parseLoginResult(accessToken, refreshToken, profile, done) {
		console.log(arguments);
		user.findOrCreate(profile,function() {
			console.log('saved');
		});
		done(null,profile);
	};
	

	passport.use(new FacebookStrategy({
	    clientID: FACEBOOK_APP_ID,
	    clientSecret: FACEBOOK_APP_SECRET,
	    callbackURL: baseUrl+"/auth/facebook/callback"
	  }, parseLoginResult));

	passport.use(new TwitterStrategy({
		consumerKey: TWITTER_CONSUMER_KEY,
		consumerSecret: TWITTER_CONSUMER_SECRET,
		callbackURL: baseUrl+"/auth/twitter/callback"
	}, parseLoginResult ));

	passport.use(new GoogleStrategy({
		returnURL: baseUrl+'/auth/google/return',
		realm: baseUrl+'/'
	},
	  function(identifier, profile, done) {
	    console.log(profile);
	    user.findOrCreate(profile,function() {
			console.log('saved');
		});
		done(null,profile);
	  }
	));
};