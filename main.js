const api = require('./api');

// TODO: Enter your API key
const API_KEY = 'a075f264-6dbc-4504-a730-23632f9fa0f8';

function solve(game) {
	/*
	 * --- Available commands ---
	 * TRAVEL [NORTH|SOUTH|WEST|EAST]
	 * [BUS|TRAIN|FLIGHT] {CityName}
	 * SET_PRIMARY_TRANSPORTATION [CAR|BIKE]
	 */
	
	// TODO: Implement your solution
	
	// Example solution
	var solution = [];
	var x = game.start.x;
	var y = game.start.y;

	solution.push("SET_PRIMARY_TRANSPORTATION BIKE")

	while (x < game.end.x)
	{
		x++;
		solution.push("TRAVEL EAST");
	}
	while (y < game.end.y)
	{
		y++;
		solution.push("TRAVEL SOUTH");
	}

	return solution;
}

function main() {
	api.initGame(getGame);
	//Or get by gameId
	//api.getGame(936, afterGetGame);
}

function getGame() {
	api.getMyLastGame(afterGetGame);
}

function afterGetGame(game) {
	var solution = solve(game);
	api.submitSolution(solution, game.id, afterSubmitSolution);
}

function afterSubmitSolution(points) {
}

// Get x coordinate of city
function getCityX(game, cityname) {
    for (var c in game.cities) {
        if (game.cities[c].name == cityname) {
            return game.cities[c].x;
        }
    }
    return -1;
}

// Get y coordinate of city
function getCityY(game, cityname) {
    for (var c in game.cities) {
        if (game.cities[c].name == cityname) {
            return game.cities[c].y;
        }
    }
    return -1;
}

api.setApiKey(API_KEY);
main();
