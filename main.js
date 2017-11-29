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

	var trainTask = false;

	var citiesToVisit = getCitiesToVisit(game);

	// nearby_land
    while (true) {
        if (game.map[x][y] == "W") {
            printArea(game, x, y);
            break;
        }
        solution.push("TRAVEL EAST");
        x++;
    }
    var waterSteps = 0;
    while (true) {
        if (waterSteps > 200) { // BYT UT 200 MOT KRAV (x) FÖR nearby_land!
            break;
        }
        solution.push("TRAVEL EAST");
        x++;
        solution.push("TRAVEL NORTH");
        y--;
        solution.push("TRAVEL WEST");
        x--;
        solution.push("TRAVEL SOUTH");
        y++;
        waterSteps += 4;
    }

    var destX = 1, destY = 1;
    
    solution = moveToXY(solution, x, y, destX, destY);
    x = destX;
    y = destY;

	// Visit all Consid cities
	while (citiesToVisit.length > 0) {
		var nextCity = getClosestCity(game, citiesToVisit, x, y);
		nextX = getCityX(game, nextCity);
		nextY = getCityY(game, nextCity);

		solution = moveToXY(solution, x, y, nextX, nextY); 
		x = nextX;
		y = nextY;

		var remove = citiesToVisit.indexOf(nextCity);
		visitedCities.push(citiesToVisit[remove]);
		citiesToVisit.splice(remove, 1);

		if (!trainTask) {

			for (var i in citiesToVisit) {
				var conn = checkTRTrain(game, nextCity, citiesToVisit[i]);

				if (conn) { // CHANGE TO CONDITION FOR TRAIN BOTH WAYS
	            	var trainOrigin = "TRAIN " + nextCity;
	            	var trainDest = "TRAIN " + citiesToVisit[i]; // CHANGE ACCORDING TO CONDITION
	            	trainTask = true;
	            	solution.push(trainDest);
	            	solution.push(trainOrigin);

	            	break;
        		}
			}

		}
	}

	// Return to city
	citiesToVisit = getCitiesToVisit(game);
	nextCity = getClosestCity(game, citiesToVisit, x, y);
	nextX = getCityX(game, nextCity);
	nextY = getCityY(game, nextCity);

	solution = moveToXY(solution, x, y, nextX, nextY); 

	x = nextX;
	y = nextY;

	// Travel far from nearest city
	var km = getKMsToTravel(game);
	nextX = x + km;
	solution = moveToXY(solution, x, y, nextX, y);
	x = nextX;

	// Visit many cities
	citiesToVisit = getAllCities(game);

	// remove visited cities
	var goalNum = getNumCities(game);

	if (citiesToVisit.length < goalNum) {
		console.log("Visit more cities!");
		console.log(goalNum);
	}

	for (var i = 0; i < visitedCities.length; i++) {
		var remove = citiesToVisit.indexOf(visitedCities[i]);
		citiesToVisit.splice(remove, 1);
	}

	while (visitedCities.length < goalNum && citiesToVisit.length > 0) {
		var nextCity = getClosestCity(game, citiesToVisit, x, y);
		nextX = getCityX(game, nextCity);
		nextY = getCityY(game, nextCity);

		solution = moveToXY(solution, x, y, nextX, nextY); 
		x = nextX;
		y = nextY;

		var remove = citiesToVisit.indexOf(nextCity);
		visitedCities.push(citiesToVisit[remove]);
		citiesToVisit.splice(remove, 1);
	}

	// Go to goal
	solution = moveToXY(solution, x, y, game.end.x, game.end.y);

	/*
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
	*/

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

function getAllCities(game) {
	all = [];

	for (var i in game.cities) {
		all.push(game.cities[i].name);
	}

	return all;
}

function getNumCities(game) {
	for (var o in game.objectives) {
		if (game.objectives[o].type == "visit_many_cities") {
			return game.objectives[o].x;
		}
	}
}

function getKMsToTravel(game) {
	for (var o in game.objectives) {
		if (game.objectives[o].type == "far_from_city") {
			return game.objectives[o].x;
		}
	}

	return -1;
}

function printArea(game, x, y) {
    console.log(game.map[x-1][y-1], game.map[x][y-1], game.map[x+1][y]);
    console.log(game.map[x-1][y], game.map[x][y], game.map[x+1][y]);
    console.log(game.map[x-1][y+1], game.map[x][y+1], game.map[x+1][y+1]);
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

function checkTRTrain(game, cityFrom, cityTo) {
	var to = false;
	var from = false;

	var dest = [];
	for (var c in game.cities) {
        if (game.cities[c].name == cityFrom) {
            var index = game.cities[c].hasTrainTo.indexOf(cityTo);
        }
    }

    if (index != -1) {
    	to = true;
    }

    for (var c in game.cities) {
        if (game.cities[c].name == cityTo) {
            var index = game.cities[c].hasTrainTo.indexOf(cityFrom);
        }
    }

    if (index != -1) {
    	from = true;
    }

    return (to && from);

}

// Move to coordinates
function moveToXY(solution, x, y, destX, destY) {
    console.log("entered moveToXY");
    while (x != destX || y != destY) {
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
    console.log(x, y);
    return solution;
}

api.setApiKey(API_KEY);
main();
