debug = require('debug') 'hrtool:index'
config = require './config.json'
epg = require 'easy-pg'
dbClient = epg config.conString
express = require 'express.io'
passport = require 'passport'
mailer = require './lib/mailer'
GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

bulk = require('./lib/bulk') dbClient
tasksRepository = require('./lib/repositories/tasks-repository') dbClient
templateRepository = require('./lib/repositories/template-repository') dbClient
userRepository = require('./lib/repositories/user-repository') dbClient

# init passport

passport.serializeUser (user, done) -> done null, user

passport.deserializeUser (obj, done) -> done null, obj

passport.use new GoogleStrategy(
	clientID: config.CLIENT_ID
	clientSecret: config.CLIENT_SECRET
	callbackURL: "#{config.host}:#{config.port}/oauth2callback"
, (accessToken, refreshToken, profile, done)  ->
		userRepository.verifyUser email:profile.emails[0].value, picture: profile._json['picture'], done
)

# init app
app = express()
app.http().io()
require('express.io-middleware') app

# socket middlewares

app.io.use (req, next) ->
	return next() if req.session.passport.user
	debug 'not logged in'
	req.io.respond error: 'not logged in'

router = require('./lib/router') app
require('./lib/routes/tasks-route') router, tasksRepository
require('./lib/routes/user-route') router, userRepository
require('./lib/routes/template-route') router, templateRepository

# express middlewares

app.use express.cookieParser()
app.use express.session secret: 'SBKS_hrtool'
app.use passport.initialize()
app.use express.static "#{__dirname}/public"

app.get '/', (req, res) ->
	res.sendfile "#{__dirname}/index.html"

app.get '/handshake', (req, res, next) ->
	return next 'not logged in' unless req.session.passport.user
	bulk.createBulk req.session.passport.user, (err, response) ->
		return next err if err
		res.json data: response


app.get '/auth/google', passport.authenticate 'google',
	 scope: ['https://www.googleapis.com/auth/userinfo.profile',
						'https://www.googleapis.com/auth/userinfo.email']


app.get '/oauth2callback',
	passport.authenticate 'google',
		failureRedirect: '/#home',
		successRedirect: '/'





app.get '/logout', (req, res) ->
	req.logout()
	res.redirect '/'

mailer tasksRepository, userRepository

app.use (error, req, res, next) ->
	return res.json {error} if error


app.listen config.port
console.log "Server listens on port #{config.port}"
