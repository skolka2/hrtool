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
		header.addEventListener ComponentBase.eventType.CLICK, @handleOnClick
		wrapper.appendChild header
		@element = wrapper



	onLoad : (data) ->
		divTable = @getDivTable()
		@getDivLoadMore()
		# decide if there is another data to loadMore
		if @reqData.limit is data.length
			dataLimit = data.length - 1
			@divLoadMore.style.display = 'block'
		else
			dataLimit = data.length
			@divLoadMore.style.display = 'none'

		for i in [0...dataLimit] by +1
			@addRow(data[i], divTable)

		@reqData.offset += dataLimit
		return

#	div with data
	getDivTable :() ->
		if not @divTable?
			@divTable = document.createElement("div")
			@divTable.className = 'table'
			@getElement().appendChild(@divTable)
		return @divTable


# div for loadmore functionality
	getDivLoadMore :() ->
		if not @divLoadMore?
			@divLoadMore = document.createElement('div')
			@divLoadMore.className = 'load-more'
			@divLoadMore.innerHTML = "load more.."
			@divLoadMore.addEventListener ComponentBase.eventType.CLICK, @handleLoadMore
			@getElement().appendChild @divLoadMore


		return @divLoadMore



	addRow :(data, divTable) ->
		row = document.createElement("div")
		row.className = 'table-row'
		divTable.appendChild(row)
		for tableStruct in @headerTitles
			divCol = document.createElement("div")
			divCol.className = 'table-column'
			params = []
			for item in tableStruct.keys
				params.push(data[item])
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