var app = require('./app');
var Router = require('./router/router');
var router;

(function(){



	$.get("/handshake", function (data) {
		if (!data.error) {
			app.bulk = data.data;
			router = new Router();
			router.init();

		}
	});


	if ("onhashchange" in window) { // event supported?
		window.onhashchange = function () {
			router.changeView(window.location.hash);
		}
	}
	else { // event not supported:
		var storedHash = window.location.hash;
		window.setInterval(function () {
			if (window.location.hash != storedHash) {
				router.changeView(window.location.hash);
			}
		}, 100);
	}


})(); 


/*for testing user tasks list  
var socket = io.connect();

socket.emit('tasks/user/list', function (data) {
	window.console.log(data.data)});*/
