class Observer
	constructor: ->
		@subscribers = {}
		@mapOfComponents = {}

	fire: (type, data, src) ->
		parents = @getParents src

		while parents.length > 0
			id = parents.pop()
			@subscribers[type][id] data, src if @subscribers[type] and @subscribers[type][id]

		return

	getParents: (childId) ->
		parents = []
		iter = childId

		while iter
			parents.push iter
			iter = @mapOfComponents[iter]

		parents

	on: (type, fn, owner) ->
		return unless typeof fn is "function"

		@subscribers[type] = {} if @subscribers[type] is undefined

		typeItem = @subscribers[type]

		typeItem[owner.componentId] = {} if typeItem[owner.componentId] is undefined

		typeItem[owner.componentId] = fn

		return

	removeListener: (listenerId) ->
		for itemEvent in @subscribers
			delete @subscribers[itemEvent][listenerId] if listenerId in @subscribers[itemEvent]

		return

module.exports = Observer