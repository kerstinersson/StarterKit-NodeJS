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

	//console.log(citiesToVisit);

	var nextCity = getClosestCity(game, citiesToVisit, x, y);

	console.log(nextCity);

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

function getClosestCity(game, citiesToVisit, xPos, yPos) {
	var closestCity = [];
	closestCity.name = "NONE";
	closestCity.dist = 1500;
	var currentPos = [];

	currentPos.x = xPos;
	currentPos.y = yPos;

	for (var city in citiesToVisit) {	
		//console.log(citiesToVisit[city]);
		var dist = getDistanceToCity(game, currentPos, citiesToVisit[city])

		//console.log(dist);

		if (dist < closestCity.dist) {
			closestCity.name = citiesToVisit[city];
			closestCity.dist = dist; 
		}

	}

	return closestCity.name;
}

function getDistanceToCity(game, currentPos, city) {
	//console.log(city);
	cX = getCityX(game, city);
	cY = getCityY(game, city);

	return Math.abs(cX - currentPos.x) + Math.abs(cY - currentPos.y);;
}

// Get x coordinate of city
function getCityX(game, cityname) {
	//console.log(cityname);

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

// Move to coordinates
function moveToXY(solution, x, y, destX, destY) {
    console.log("entered moveToXY");
    while (x != destX, y != destY) {
        if (x < destX) {
            x++;
            solution.push("TRAVEL EAST");
        } else if (x > destX) {
            x--;
            solution.push("TRAVEL WEST");
        }
        if  (y < destY) {
            y++;
            solution.push("TRAVEL SOUTH");
        } else if (y > destY) {
            y--;
            solution.push("TRAVEL NORTH");
        }
    }
    return solution;
}

api.setApiKey(API_KEY);
main();
