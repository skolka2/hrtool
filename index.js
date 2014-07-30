express = require('express.io');
// server = require('./server/server.js');

app = express().http().io();
app.use(express.static('client'));

app.io.route('sum', function(req){
	numbers = req.data;
	sum = 0;
	for(i = 0; i < numbers.length; i++) {
		sum += numbers[i];
	}
	req.io.emit('resp-sum', sum);
});

console.log('server running at port 5566')

app.listen(5566);