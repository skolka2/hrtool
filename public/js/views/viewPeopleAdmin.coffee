ViewBase =  require './viewBase'
ComponentFormAddUser = require '../components/forms/componentFormAddUser'

class ViewPeopleAdmin extends ViewBase
	constructor: () ->
		super()



	render: () ->
		super arguments
		mainWrapper = document.getElementById ViewBase.mainWrapper
		viewWrapper = document.createElement 'div'
		viewWrapper.className = "view-wraper"
		viewWrapper.innerTHTML = "People Admin View"

		divForm = document.createElement 'div'
		divForm.innerHTML = "<br/><br/><br/><br/>ComponentFormAddUser...<br><br>"
		viewWrapper.appendChild divForm

		form = new ComponentFormAddUser()
		form.renderdivForm

		mainWrapper.appendChild viewWrapper
		return


module.exports = ViewPeopleAdmin