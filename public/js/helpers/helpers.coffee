Const = require './constants'
app = require '../app'

helper =
	format:
		getPercentage: (num) ->
			if not isNaN num then result = (num * 100).toFixed(2)+"%"
			else "Can't get the percentage, input is not a number!"

		getDate: (date) ->
			dateFormated = date.getDate()+'.'+(date.getMonth()+1)+'.'+date.getFullYear()

		getDiffDate: (date1, date2) ->
			oneDay = 24*60*60*1000
			firstDate = new Date date1
			secondDate = new Date date2
			diffDays = Math.round Math.abs (firstDate.getTime() - secondDate.getTime())/oneDay

		dateValidate: ->
			helper.format.getDateNow()
			event.currentTarget.value = time.toString if event.currentTarget.value < time.toString or event.currentTarget.value > time.toString
			return

		getDateNow: ->
			time = new Date().toLocaleDateString().split "."
			time[1] = "0" + time[1] if time[1].length is 1
			time[0] = "0" + time[0] if time[0].length is 1

			{
			"year": time[2]
			"month": time[1]
			"day": time[0]
			"toString": time[2] + "-" + time[1] + "-" + time[0]
			}

		getUniversalString: (str) ->
			specChars = "áäčďéěíĺľňóô öŕšťúů üýřžÁÄČĎÉĚÍĹĽŇÓÔ ÖŔŠŤÚŮ ÜÝŘŽ"
			univChars = "aacdeeillnoo orstuu uyrzAACDEEILLNOO ORSTUU UYRZ"
			output = ""

			for ch in [0..str.length]
				if specChars.indexOf ch isnt -1 then output += univChars.charAt specChars.indexOf ch
				else output += ch

			output

		getDateInputFormat: (date) ->
			getMonth = date.getMonth()
			getDate = date.getDate()
			month = if getMonth < 9 then '0' + (getMonth+1) else getMonth+1
			day = if getDate < 10 then '0' + getDate else getDate
			date.getFullYear() + '-' + month + '-' + day

	dom:
		createElement: (str) ->
			myElement = $(str)
			myElement[0]

		getParentByClass: (el, className) ->
			while el and el.className isnt className
				el = el.parentNode
			if el
				el
			else
				null

	tpl:
		create: (name, params) ->
			template = require "jade!../../js/"+name+".jade"
			helper.dom.createElement template params

	bulk:
		getData: (keys) ->
			helper.obj.getData app.bulk, keys

		getDepartmentData: ->
			if (@getData ['user', 'id_user_role']) isnt Const.ADMINISTRATOR
				@getData ['userDepartments']
			else
				@getData ['departments']

		getTeamData: ->
			if (@getData ['user', 'id_user_role']) isnt Const.ADMINISTRATOR
				@getData ['userTeams']
			else
				@getData ['teams']

	obj:
		getData: (obj, keys) ->
			tmpBulk = obj

			for k in keys
				if tmpBulk[k]?
					tmpBulk = tmpBulk[k]
				else
					helper.debugger 'Error: parameter ' + k + ' in bulk is null'
					return null

			tmpBulk

	debugger: (eventName, data) ->
		if Const.DEVELOP
			if data then console.log eventName, data
			else console.log eventName, "No data"
			return

	number:
		isNumber: (num, min, max) ->
			out = parseInt num

			if not out then return no
			if min is "" then min = Number.MIN_VALUE
			if max is "" then max = Number.MAX_VALUE
			if out > min or out < max then return yes
			no

module.exports = helper