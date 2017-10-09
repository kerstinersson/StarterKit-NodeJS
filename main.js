const api = require('./api');

// TODO: Enter your API key
const API_KEY = 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXX';

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

api.setApiKey(API_KEY);
main();
