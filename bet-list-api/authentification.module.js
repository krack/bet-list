
var configureAPI = require('./rest-api-database');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var session = require('express-session');
var cookieParser = require('cookie-parser');

module.exports = function init(configuration, app) {
	// Passport session setup.
	passport.serializeUser(function(user, done) {
	  done(null, user);
	});

	passport.deserializeUser(function(obj, done) {
	  done(null, obj);
	});

	app.use(session({ secret: 'keyboard cat', key: 'sid'}));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(cookieParser());

	var userModel = [
		{
			"name": "displayName",
			"type": "String"
		}
	];

	//update model in fonction of 
	if(configuration.facebook){
		userModel.push({
			"name": "facebookId",
			"type": "String"
		});
	}


	var configApp = {
		"baseApi" : "/api/users/",
		"shema": 'users'
	}
	
	var serviceUser = configureAPI(configApp, userModel, app);



	if(configuration.facebook){

		passport.use(new FacebookStrategy({
				clientID: configuration.facebook.api_key,
				clientSecret:configuration.facebook.api_secret ,
				callbackURL: configuration.facebook.callback_url
			},
			function(accessToken, refreshToken, profile, done) {
				process.nextTick(function () {
					return done(null, profile);
				});
			}
		));

		app.get('/auth/facebook', passport.authenticate('facebook', { authType: 'rerequest', scope: ['user_friends'] }));
		app.get('/auth/facebook/callback', passport.authenticate('facebook'), function(req, res) {
				serviceUser.find({"facebookId": req.user.id}).then(function(users){
					if(!users.length){
						serviceUser.create({
							"facebookId": req.user.id,
							"displayName" : req.user.displayName
						}).then(function(user){
							res.redirect(302, configuration.redirectUrl);
						});
					}else {				
						res.redirect(302, configuration.redirectUrl);
					}

				});
				
			}
		);

	}

	
	app.get('/api/me', function(req, res) {
		console.log("GET /api/me");
		if (req.isAuthenticated()) {
			serviceUser.find({"facebookId": req.user.id}).then(function(users){
				if(users.length){
					res.json(users[0]);
				}else{
					res.sendStatus(401);
				}
			});
		}else{
			res.sendStatus(401);
		}
	});

	function securityFunction (req, res, next) {
		if (req.isAuthenticated()) {
			serviceUser.find({"facebookId": req.user.id}).then(function(users){
				console.log("users "+users)
				if(users.length > 0){
					console.log("principal define : "+users[0]._id);
					req.principal= users[0];
					return next();
				}else{
					res.sendStatus(401);
				}
			});
			
		}else{
			res.sendStatus(401);
		}
	}

	return {
		"securityFunction" :securityFunction
	}

};