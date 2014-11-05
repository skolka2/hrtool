debug = require('debug') 'hrtool:index'
config = require './config.json'
epg = require 'easy-pg'
dbClient = epg config.conString
express = require 'express.io'
passport = require 'passport'
mailer = require './lib/mailer'
{Strategy} = require 'passport-google'

bulk = require('./lib/bulk') dbClient
tasksRepository = require('./lib/repositories/tasks-repository') dbClient
templateRepository = require('./lib/repositories/template-repository') dbClient
userRepository = require('./lib/repositories/user-repository') dbClient

# init passport

passport.serializeUser (user, done) -> done null, user

passport.deserializeUser (obj, done) -> done null, obj

passport.use new Strategy
	returnURL: "#{config.host}:#{config.port}/auth/google/return"
	realm: "#{config.host}:#{config.port}/"
, (identifier, profile, done) ->
	userRepository.verifyUser profile.emails[0].value, done

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


app.get '/auth/google', passport.authenticate 'google'

app.get '/auth/google/return',
	passport.authenticate 'google', {
		successRedirect: '/',
		failureRedirect: '/'
	}

app.get '/logout', (req, res) ->
	req.logout()
	res.redirect '/'

mailer.scheduleMailReport tasksRepository, userRepository

app.use (error, req, res, next) ->
	return res.json {error} if error


app.listen config.port
console.log "Server listens on port #{config.port}"
