nodemailer = require 'nodemailer'
schedule = require 'node-schedule'
debug = require('debug') 'hrtool:mailer'
toCsv = require 'to-csv'
config = require '../lib/config/configuration'
moment = require 'moment'

module.exports = (tasksRepository, userRepository) ->
		rule = config.mailSchedulerRule

		schedule.scheduleJob rule, ->
			tasksRepository.getTasksForCSVExport [], (err, result) =>
				return err if err

				userRepository.getHR (err, emails) =>
					sendTo = emails.map (item) ->
						return item.email
					.join ', '
					if result
						transporter = nodemailer.createTransport
							service: 'Gmail'
							auth: config.mailAuth

						attachments =
							filename: moment(new Date()).format('YYYY-MM-DD') + '.csv'
							content: new Buffer toCsv(result), 'utf-8'

						mailOptions =
							from: 'BuddyTool <buddytoolmail@gmail.com>'
							to: sendTo
							subject: 'Weekly report'
							text: ''
							attachments: attachments

						transporter.sendMail mailOptions, (error, info) ->
							if error then debug 'Weekly report sending error: ' + error
							else debug 'Weekly report successfully sent: ' + info
