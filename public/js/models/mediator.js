
var Mediator =  function() {

}

/*
* @returns {object} singleton socket
*/
Mediator.prototype.getSocket = function() {
	if (Mediator.socket == null) {
		Mediator.socket = io.connect();
	}
	return Mediator.socket;
};

/* call backend to retrieve data
* @param {string} endpoint
* @param {object} params parametres
* @param {object} model
* @param {object} transform transformation of loaded data
*/
Mediator.prototype.loadData = function (endpoint, params, model, transform) {
    var self = this;
    this.getSocket().emit(endpoint, params, function (resp) {
        if (resp.error) {
            console.log("error", resp.error);
        } else {
            if (transform != null) {
                resp.data = transform(resp.data);
            }
            model.update(resp.data);
        }
    });

};

Mediator.prototype.fakeLoadData = function(endpoint, params, model, transform) {
    update = model.update.bind(model);
    setTimeout(function() {
        var resp = {
            'roman': {
                'car': 'bmw'
            },
            'marek': {
                'car': 'porsche'
            },
            'mirek': {
                'car': 'skoda'
            }
        }
        update(resp);
    }, 3000);
}




