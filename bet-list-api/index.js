var express  = require('express');
var app = express();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var http = require('http');
var request = require('request');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var session = require('express-session');
var cookieParser      =     require('cookie-parser');



var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var pkgcloud = require('pkgcloud');

var configureAPI = require('./rest-api-database');






/*************/
//config
//this serveur internet hostname
var serverHost = process.env.SERVER_HOST || "http://localhost";
//url to allow image + javascript (ihm) (TODO : autorize all url)
var allowUrl = process.env.ALLOW_URL || 'http://localhost:4200';
//serveur open port
var port = process.env.SERVER_PORT || 8080;
var portPublic = process.env.SERVER_PUBLIC_PORT || 8080;


//storage configuration 
//
var storageContainer = process.env.STORAGE_CONTAINER || 'photos';
//storage security
//project id
var storageTenantId = process.env.STORAGE_TENANT_ID;
//username of storage
var storageUsername = process.env.STORAGE_USERNAME;
//password for username
var storagePassword = process.env.STORAGE_PASSWORD;
//authentification url
var storageAutenticationUrl = process.env.STORAGE_AUTHENTICATION_URL;

var storageRegion = process.env.STORAGE_REGION;
var facebook_api_key= process.env.FACEBOOK_API_KEY;
var facebook_api_secret= process.env.FACEBOOK_API_SECRET;
var callback_url= serverHost+":"+portPublic+"/auth/facebook/callback";
//end config
/***********/


// Passport session setup.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


// Use the FacebookStrategy within Passport.

passport.use(new FacebookStrategy({
    clientID: facebook_api_key,
    clientSecret:facebook_api_secret ,
    callbackURL: callback_url
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      //Check whether the User exists or not using profile.id
      console.log(profile);
      return done(null, profile);
    });
  }
));



var storageClient = pkgcloud.storage.createClient({
	provider: 'openstack', 
    username: storageUsername, 
    password: storagePassword, 
    authUrl: storageAutenticationUrl, 
    tenantId: storageTenantId,
    version: "v2.0",
    region: storageRegion
});
var database = {
	url : 'mongodb://mongo:27017'
}
// To be redesigned with a loop and a break on total timeout or number of tries
mongoose.connect(database.url, function(err) {
	if(err) {
		console.log('connection error (first try)', err);
		setTimeout(function() {
			mongoose.connect(database.url, function(err) {
				if(err) {
					console.log('connection error (second try)', err);
					setTimeout(function() {
						mongoose.connect(database.url, function(err) {
							if(err) {
								console.log('connection error (three strikes... you are out)', err);
							} else {
								console.log('successful connection (third try... almost out)');
							}
						});
					},5000);
				} else {
					console.log('successful connection (second try)');
				}
			});
		},1000);
	} else {
		console.log('successful connection (first try)');
	}
});

app.use(morgan('dev'));
app.use(bodyParser.json()); // parse application/json
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(session({ secret: 'keyboard cat', key: 'sid'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', allowUrl);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

var serviceBets = null;
{//config bets
	var config = {
		"baseApi" : "/api/bets/",
		"serverHost": serverHost,
		"port": portPublic,
		"shema": 'bets'

	}
	var model = [
		{
			"name": "title",
			"type": "String"
		},
		{

			"name": "issues",
			"type": "String"
		},
		{
			"name": "files",
			"type" : "Files",
			"container" : storageContainer
		},
		{
			"name": "winneur",
			"type": "String"
		},
		{
			"name": "looser",
			"type": "String"
		},
		{
			"name": "accepted",
			"type": "Boolean"
		}
	]

	serviceBets = configureAPI(config, model, app, storageClient);
}

var serviceUser = null;
{//config bets
	var config = {
		"baseApi" : "/api/users/",
		"serverHost": serverHost,
		"port": portPublic,
		"shema": 'users'

	}
	var model = [
		{
			"name": "facebookId",
			"type": "String"
		},
		{
			"name": "displayName",
			"type": "String"
		}
	]

	serviceUser = configureAPI(config, model, app, storageClient);
}

app.get('/auth/facebook', passport.authenticate('facebook', { authType: 'rerequest', scope: ['user_friends'] }));


app.get('/auth/facebook/callback',
	passport.authenticate('facebook'),
	function(req, res) {
		serviceUser.find({"facebookId": req.user.id}).then(function(users){
			if(!users.length){
				serviceUser.create({
					"facebookId": req.user.id,
					"displayName" : req.user.displayName
				}).then(function(user){
					res.redirect(302, allowUrl);
				});
			}else {				
				res.redirect(302, allowUrl);
			}

		});
		
	});
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



app.listen(port);
console.log("App listening on port " + port);
