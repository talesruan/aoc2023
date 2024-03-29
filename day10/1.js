const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8");

const ANIMAL = "S";
const GROUND = ".";

const Direction = {
	NORTH: {x: 0, y: -1},
	SOUTH: {x: 0, y: 1},
	WEST: {x: -1, y: 0}, // <-
	EAST: {x: 1, y: 0} // ->
};

const pipeConnections = {
	"|": [Direction.NORTH, Direction.SOUTH],
	"-": [Direction.WEST, Direction.EAST],
	"L": [Direction.NORTH, Direction.EAST],
	"J": [Direction.NORTH, Direction.WEST],
	"7": [Direction.SOUTH, Direction.WEST],
	"F": [Direction.SOUTH, Direction.EAST],
};

const fn = input => {
	const data = parseInput(input);
	const grid = new Grid(data);
	const animalCoords = findAnimal(grid);
	const distanceMap = buildDistanceMap(grid, animalCoords.x, animalCoords.y);
	let maxDistance = 0;
	distanceMap.iterate((x,y) => {
		const value = distanceMap.get(x, y);
		if (value > maxDistance) maxDistance = value;
	});
	return maxDistance;
};

const getNextSteps = (grid, x, y) => {
	const valueAtPos = grid.get(x, y);
	if (valueAtPos === GROUND) throw new Error("Is at ground.");
	if (valueAtPos === ANIMAL) {
		// Any pipe attached to this tile
		const attachedPipes = [];
		for (const direction of Object.values(Direction)) {
			const scanCoord = {x: x + direction.x, y: y + direction.y};
			const valueAtPos = grid.get(scanCoord.x, scanCoord.y);
			if (!valueAtPos || valueAtPos === GROUND) continue;
			const pipe = new Pipe(valueAtPos);
			const isConnectedToAnimal = pipe.exitsTo(reverseDirection(direction));
			if (!isConnectedToAnimal) continue;
			attachedPipes.push(scanCoord);
		}
		return attachedPipes;
	} else {
		const pipe = new Pipe(valueAtPos);
		return pipe.getExits().map(exit => ({x: x + exit.x, y: y + exit.y}))
	}
}

const buildDistanceMap = (grid, originX, originY) => {
	const distanceMap = new Grid();
	distanceMap.set(originX, originY, 0);
	const visited = [];
	const frontier = [{x: originX, y: originY}];
	while (frontier.length > 0) {
		const xy = frontier.shift();
		visited.push(xy);
		for (const adjacent of getNextSteps(grid, xy.x, xy.y)) {
			if (inArray(visited, adjacent) || inArray(frontier, adjacent)) continue;
			frontier.push(adjacent);
			const currentDistance = distanceMap.get(xy.x, xy.y) || 0;
			distanceMap.set(adjacent.x, adjacent.y, currentDistance + 1);
		}
	}
	return distanceMap;
};

const inArray = (array, xy) => {
	return array.some(element => element.x === xy.x && element.y === xy.y);
};
const getDirectionName = direction => {
	if (direction === Direction.NORTH) return "NORTH";
	if (direction === Direction.SOUTH) return "SOUTH";
	if (direction === Direction.WEST) return "WEST";
	if (direction === Direction.EAST) return "EAST";
}

const reverseDirection = direction => {
	if (direction === Direction.NORTH) return Direction.SOUTH;
	if (direction === Direction.SOUTH) return Direction.NORTH;
	if (direction === Direction.WEST) return Direction.EAST;
	if (direction === Direction.EAST) return Direction.WEST;
};

const findAnimal = grid => {
	for (let x = 0; x < grid.sizeX; x++) {
		for (let y = 0; y < grid.sizeY; y++) {
			if (grid.get(x, y) === ANIMAL) return {x, y};
		}
	}
}

const parseInput = input => {
	const data = [];
	for (const line of input.split("\n").filter(l => l !== "")) {
		data.push(line.split(""));
	}
	return data;
};

class Pipe {
	symbol;

	constructor(symbol) {
		if (!pipeConnections[symbol]) throw new Error(`Invalid pipe: "${symbol}"`);
		this.symbol = symbol;
	}

	exitsTo(direction) {
		return pipeConnections[this.symbol].includes(direction);
	}

	getExits() {
		return pipeConnections[this.symbol];
	}

	toString() {
		return `Pipe ${this.symbol} exits to ${pipeConnections[this.symbol].map(dir => getDirectionName(dir)).join(", ")}`;
	}
}

class Grid {
	matrix;
	sizeY = 0;
	sizeX = 0;

	constructor (matrix = []) {
		this.matrix = matrix;
		this.sizeY = matrix.length;
		if (this.matrix.length > 0) this.sizeX = this.matrix[0].length;
	}

	iterate (func) {
		for (let y = 0; y < this.sizeY; y++) {
			for (let x = 0; x < this.sizeX; x++) {
				func(x, y);
			}
		}
	}

	getAdjacentValues (x, y) {
		return this.getAdjacentCoords(x, y).map(coord => this.get(coord.x, coord.y));
	}

	getAdjacentCoords (x, y) {
		return [
			// {x: x - 1, y: y - 1},
			{x: x + 0, y: y - 1},
			// {x: x + 1, y: y - 1},
			{x: x - 1, y: y + 0},
			//{x: x + 0, y: y + 0},
			{x: x + 1, y: y + 0},
			// {x: x - 1, y: y + 1},
			{x: x + 0, y: y + 1},
			// {x: x + 1, y: y + 1},
		].filter(coord => this.get(coord.x, coord.y) !== undefined);
	}

	get (x, y) {
		if (!this.matrix[y]) return;
		return this.matrix[y][x];
	}

	set (x, y, value) {
		if (x > this.sizeX - 1) this.sizeX = x + 1;
		if (y > this.sizeY - 1) this.sizeY = y + 1;
		if (!this.matrix[y]) this.matrix[y] = [];
		this.matrix[y][x] = value;
	}
};

const display = (grid) => {
	for (let y = 0; y < grid.matrix.length; y++) {
		let line = "";
		for (let x = 0; x < grid.sizeX; x++) {
			let v = " " + grid.get(x, y);
			if (grid.get(x, y) === undefined) v = "  ";
			line += v;
		}
		console.log(line);
	}
};


console.time("Elapsed time");
console.log("Result: ", fn(input));
console.timeEnd("Elapsed time");
