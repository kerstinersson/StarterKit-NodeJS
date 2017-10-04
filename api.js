var http = require('http');

//http://localhost:34083
const HOST = 'localhost';
const PORT = 34083;

var _apikey;
var _silent = false;

function log(message) {
	if (!_silent) {
		console.log("API: " + message);
	}
}

function handleResponseError(e) {
	log(e.message);
	process.exit(1);
}

function handleResponse(response) {
	if (response.statusCode !== 200) {
		log(response.statusCode + ': ' + response.statusMessage);
		process.exit(1);
	}
}

function handleResponseData(data) {
	if (data.type === 'Error') {
		var message = 'An API error occured: ' + data.message;
		log(message);
		process.exit(1);
	}
	else if (data.type === 'GameError') {
		var message = 'Your solution gave an error: ' + data.error;
		log(message);
		process.exit(1);
	}
}

function get(path, callback) {
	var options = {
		host: HOST,
		port: PORT,
		path: '/' + path,
		method: 'GET',
		headers: {
			'X-ApiKey': _apikey
		}
	};
	var request = http.request(options, function(response) {
		response.on('error', handleResponseError);
		
		var content = '';
		response.on('data', function(chunk) {
			content += chunk;
		});
		response.on('end', function() {
			handleResponse(response);
			var data = JSON.parse(content);
			handleResponseData(data);
			callback(data);
		});
	});
	request.end();
}

function post(path, data, callback) {
	var options = {
		host: HOST,
		port: PORT,
		path: '/' + path,
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'X-ApiKey': _apikey
		}
	}
	var request = http.request(options, function(response) {
		response.on('error', handleResponseError);
		
		var content = '';
		response.on('data', function(chunk) {
			content += chunk;
		});
		response.on('end', function() {
			handleResponse(response);
			var received = JSON.parse(content);
			handleResponseData(received);
			callback(received);
		});
	});
	request.write(JSON.stringify(data));
	request.end();
}

module.exports = {
	silence: function() {
		_silent = true;
	},
	
	unsilence: function() {
		_silent = false;
	},

	setApiKey: function(apiKey) {
		_apikey = apiKey;
	},

	initGame: function(callback) {
		get('considition/initgame', function(result) {
			log('Created new game with ID ' + result.gameId);
			callback(result.gameId);
		});
	},
	
	getMyLastGame: function(callback) {
		get('considition/getgame', function(result) {
			log('Retrieved game with ID ' + result.gameState.id);
			callback(result.gameState);
		});
	},
	
	getGame: function(gameStateId, callback) {
		get('considition/getgame', function(result) {
			log('Retrieved game with ID ' + result.gameState.id);
			callback(result.gameState);
		});
	},
	
	submitSolution: function(solution, gameId, callback) {
		post('considition/submit?gameStateId=' + gameId, solution, function(result) {
			log('Your solution gave ' + result.points + ' points.');
			callback(result.points);
		});
	}
};
