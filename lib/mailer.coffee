nodemailer = require 'nodemailer'
schedule = require 'node-schedule'
debug = require('debug') 'hrtool:mailer'
toCsv = require 'to-csv'

module.exports =
	scheduleMailReport: (tasksRepository, userRepository) ->
		rule =
			dayOfWeek: 0
			hour: 17
			minute: 0

		schedule.scheduleJob rule, ->
			tasksRepository.getTasksForCSVExport [], (err, result) =>
				return err if err

				userRepository.getHR (err, emails) =>
					sendTo = emails.map (item) ->
						return item.email
					.join ', '
					console.log sendTo
					if result
						transporter = nodemailer.createTransport
							service: 'Gmail'
							auth:
								user: 'buddytoolmail@gmail.com'
								pass: 'Bakers123'

						date = new Date()
						attachments =
							filename: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + '.csv'
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
