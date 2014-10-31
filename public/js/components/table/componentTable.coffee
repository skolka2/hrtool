ComponentBase = require '../componentBase'
helper = require '../../helpers/helpers'
Model = require '../../models/model'
hrtool = require '../../models/actions'


class ComponentTable extends ComponentBase
	constructor: (tableFormat, tableSettings)->
		super()
		@_action = tableSettings.actionFunc
		@_endpoint = tableSettings.endpoint
		@reqData =	# clone tableSetting without endpoint and actionFunc
			limit: tableSettings.limit + 1,
			offset: tableSettings.offset,
			sortBy: tableSettings.sortBy,	 #order by 'column_name' for first onLoad
			sort_way: tableSettings.sort_way,
			filterData: null
		@previousTarget = null
		@headerTitles = tableFormat()
		@getElement()
		@divLoadMore = null


	setFilterData : (filterParams) ->
		@reqData.filterData = filterParams
		return

	getFilterData :()->
		return @reqData.filterData

	deleteFilterData :()->
		@reqData.filterData = null

	handleOnFilter : (ev) =>
		@divTable.innerHTML = ''
		@reqData.offset = 0
		@reloadData()



	createDom : () ->
		wrapper = document.createElement("div")
		wrapper.className = 'table-wrapper'
		header = helper.tpl.create "components/table/componentTable", {array: @headerTitles}
		header.addEventListener ComponentBase.EventType.CLICK, @handleOnClick
		wrapper.appendChild header
		@element = wrapper



	onLoad : (data) ->
		@data = data
		# decide if there is another data to loadMore
		dataLimit = if @reqData.limit is @data.length then @data.length - 1 else @data.length
		divTable = @getDivTable()
		for i in [0...dataLimit] by +1
				@addRow(@data[i], divTable)

		@reqData.offset += dataLimit

		if @data.length is @reqData.limit
				@getDivLoadMore()
		else
				@getElement().removeChild @getDivLoadMore()
				@divLoadMore = null
		return

#	div with data
	getDivTable :() ->
		if @divTable is undefined
			@divTable = document.createElement("div")
			@divTable.className = 'table'
			@getElement().appendChild(@divTable)
		return @divTable


# div for loadmore functionality
	getDivLoadMore :() ->
		if @divLoadMore is null
			@divLoadMore = document.createElement('div')
			@divLoadMore.className = 'load-more'
			@divLoadMore.innerHTML = "load more.."
			@divLoadMore.addEventListener ComponentBase.EventType.CLICK, @handleLoadMore
			@getElement().appendChild @divLoadMore


		return @divLoadMore



	addRow :(data, divTable) ->
		row = document.createElement("div")
		row.className = 'table-row'
		divTable.appendChild(row)
		for i in [0...@headerTitles.length] by +1
			tableStruct = @headerTitles[i]
			divCol = document.createElement("div")
			divCol.className = 'table-column'
			params = []
			for j in [0...tableStruct.keys.length] by +1
				params.push(data[tableStruct.keys[j]])
			innerCol = helper.dom.createElement(tableStruct.formatter(params))
			divCol.appendChild innerCol
			row.appendChild divCol




	handleOnClick :(ev) =>
		target = ev.target
		sortBy = target.getAttribute("sort-by")
		if (sortBy isnt null)
			if (@reqData.sortBy isnt sortBy)
				target.className = "header-column sortable active-sort " + ComponentTable.SORT_ASC
				if (target isnt @previousTarget and @previousTarget != null)
					@previousTarget.className = 'header-column sortable ' + ComponentTable.SORT_ASC

			else
				sort_way = if ComponentTable.SORT_DESC is @reqData.sort_way then ComponentTable.SORT_ASC else ComponentTable.SORT_DESC
				target.className = "header-column sortable active-sort " + sort_way

			@sortData(sortBy)
			@previousTarget = target




	handleLoadMore :() =>
		@reloadData()



	sortData :(sortBy) ->
		inTable = @getElement().getElementsByClassName('table')[0]
		inTable.innerHTML = ""
		@reqData.offset = 0

		if @reqData.sort_way is ComponentTable.SORT_DESC or @reqData.sortBy isnt sortBy
			@reqData.sort_way = ComponentTable.SORT_ASC
		else
			@reqData.sort_way = ComponentTable.SORT_DESC

		@reqData.sortBy = sortBy
		#@reqData.SORT_WAY =	'DESC' is= @reqData.SORT_WAY ? 'ASC' : 'DESC'
		#console.log(@reqData.sortBy	+ ' ' + @reqData.sort_way)

		@reloadData()
		return

	reloadData :() ->
		reloadModel = new Model(@_endpoint)
		@listen(@_endpoint, reloadModel, @onLoad)
		@_action(reloadModel, @reqData)


ComponentTable.SORT_DESC = 'DESC'
ComponentTable.SORT_ASC = 'ASC'

module.exports = ComponentTable