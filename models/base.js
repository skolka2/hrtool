(function() {


	var modelBase =  function( ) {


		function modelBase(){
			this.componentId = null;
			this.mediator = new mediator();

		}

		modelBase.prototype.loadData = function(callee, endpoint, params, type, transform) {
			if (transform == null) {
				transform = null;
			}
			this.mediator.loadData(callee, endpoint, params, type, transform);
		};

		return modelBase;


	}




}).call(this);