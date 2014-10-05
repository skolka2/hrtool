debug = require('debug')('hrtool:user-route')

module.exports = (router, userRepository) ->

	router.register 'user/insert', (req, next) ->
		userRepository.insertUser req.data, next

	router.register 'user/insert-from-csv', (req, next) ->
		userRepository.insertUsersFromCSV req.data, next

	router.register 'user/get-all', (req, next) ->
		userRepository.getAllUsers req.session.passport.user.id_user_role, next

	router.register 'user/get/HR', (req, next) ->
		userRepository.getHR req.data, next

	router.register 'user/get-table-data', (req, next)->
		userRepository.getAllUsersForTable req.data, req.session.passport.user.id_user_role, next

	router.register 'user/get-teams', (req, next)->
		return next('missing key: id_user') unless req.data.id_user?
		userRepository.getAllUserTeams req.data.id_user, next

	router.register 'user/get-basic-info', (req, next)->
		return next('missing key: id_user') unless req.data.id_user?
		userRepository.getBasicUserInfo req.data.id_user, next
