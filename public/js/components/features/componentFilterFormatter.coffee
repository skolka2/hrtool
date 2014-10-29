ComponentFilterFormatter =

	transform: (data, idKey, valueKey, dependencyKeys) ->
		id = ''
		res = {}
		for key, item of data
			obj =
				id: item[idKey]
				value: item[valueKey]
			if dependencyKeys?
				for depKey, j in dependencyKeys
					id += item[depKey] || 'global'
					id += '-' if j isnt dependencyKeys.length - 1
			res[id] ?= []
			res[id].push obj
			id = ''
		return res

	format: (data) ->
		allowedIds = new Array data.length
		processed = [data.length - 1]
		allowedIds[i] = {} for i in [0...allowedIds.length] by 1

		for dataItem, i in data by -1
			if i isnt data.length - 1 and allowedIds[i] and processed[i]
				for key, dropItems of dataItem
					dropItems.splice(k, 1) for dropItem, k in dropItems by -1 when !allowedIds[i][dropItem.id]
					delete data[i][key] if dropItems.length is 0

			for key of dataItem
				keyArr = key.split '-'
				added = no
				for keyPart, k in keyArr
					if keyPart is 'global' and k - 1 >= 0
						allowedIds[k - 1][keyArr[k - 1]] = yes
						added = yes
						break
				if added is no
					allowedIds[k - 1][keyArr[k - 1]] = yes
					processed[k - 1] = yes
		return data




	factory:
		createTemplateDropdownsData: (departments, teams, templates) ->
			return ComponentFilterFormatter.format [
				ComponentFilterFormatter.transform(departments, 'id_department', 'title'),
				ComponentFilterFormatter.transform(teams, 'id_team', 'title', ['id_department']),
				ComponentFilterFormatter.transform(templates, 'id_task_template', 'title', ['id_department', 'id_team'])
			]
		,
		createTeamDropdownsData : (departments, teams) ->
			return ComponentFilterFormatter.format [
				ComponentFilterFormatter.transform(departments, 'id_department', 'title'),
				ComponentFilterFormatter.transform(teams, 'id_team', 'title', ['id_department'])
			]
		,
		createUsersDropdownsData : (departments, teams, users) ->
			return ComponentFilterFormatter.format [
				ComponentFilterFormatter.transform(departments, 'id_department', 'title'),
				ComponentFilterFormatter.transform(teams, 'id_team', 'title', ['id_department']),
				ComponentFilterFormatter.transform(users, 'id_user', 'full_name', ['id_department', 'id_team'])
			]
		,
		createTeamRoleDropdownsData : (departments, role, teams) ->
			return ComponentFilterFormatter.format [
				ComponentFilterFormatter.transform(departments, 'id_department', 'title'),
				ComponentFilterFormatter.transform(role, 'id_department_role', 'title', ['id_department']),
				ComponentFilterFormatter.transform(teams, 'id_team', 'title', ['id_department'])
			]
		,





module.exports = ComponentFilterFormatter