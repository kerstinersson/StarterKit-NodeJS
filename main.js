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

	var visitedCities = [];

	var citiesToVisit = getCitiesToVisit(game);

	console.log(citiesToVisit);

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

function getCitiesToVisit(game) {
	citiesToVisit = [];

	for (var o in game.objectives) {
		if (game.objectives[o].type == "visit_city") {
			citiesToVisit.push(game.objectives[o].x);
		}
	}

	return citiesToVisit;
}

function getClosestCity(citiesToVisit, xPos, yPos) {
	var closestCity;
	//closestCity.name = "NONE";
	//closestCity.dist = 0;

	for (var city in citiesToVisit) {

	}

	return 0;
}

api.setApiKey(API_KEY);
main();
