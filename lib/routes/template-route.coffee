module.exports = (router, templateRepository) ->
	router.register 'template/insert', (req, next) ->
		templateRepository.insertTemplate req.data, next

	router.register 'template/delete', (req, res) ->
		unless req.data.is_task_template
			templateRepository.deleteTemplate req.data, next
		else
			next 'missing key: id_task_template'

	router.register 'template/get-all', (req, next) ->
		templateRepository.getAllTemplates req.session.passport.user.id_user_role, next

	router.register 'template/update', (req, next) ->
		unless req.data.is_task_template
			templateRepository.updateTemplate req.data, next
		else
			next 'missing key: id_task_template'