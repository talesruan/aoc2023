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

const Directions = Object.values(Direction);

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
	let grid = new Grid(data);
	const animalCoords = findAnimal(grid);
	const mainLoop = getMainLoop(grid, animalCoords.x, animalCoords.y);
	grid.iterate((x, y) => {
		if (mainLoop.some(xy => xy.x === x && xy.y === y)) {
			grid.set(x, y, grid.get(x, y));
		} else {
			grid.set(x, y, GROUND);
		}
	})
	const expandedGrid = getHighResolutionGrid(grid);
	console.log("Finding external tiles...");

	const externalTiles = bfs(expandedGrid, 0, 0);
	let tilesEnclosedByLoop = 0;
	grid.iterate((x,y) => {
		const value = grid.get(x, y);
		if (value !== GROUND) return;
		const coordInExpandedGrid = {x: x * 3 + 1, y: y * 3 + 1};
		if (!inArray(externalTiles, coordInExpandedGrid)) tilesEnclosedByLoop++;
	});
	return tilesEnclosedByLoop;
};

const getHighResolutionGrid = grid => {
	const highResGrid = new Grid();
	grid.iterate((x, y) => {
		const value = grid.get(x, y);
		if (value === GROUND || value === ANIMAL) {
			for (let x1 = 0; x1 < 3; x1++) {
				for (let y1 = 0; y1 < 3; y1++) {
					highResGrid.set(x * 3 + x1, y * 3 + y1, value);
				}
			}
		} else {
			const pipe = new Pipe(value);
			const highResPipe = pipe.getHighResRepresentation();
			for (let y1 = 0; y1 < 3; y1++) {
				for (let x1 = 0; x1 < 3; x1++) {
					let value3x3 = highResPipe[y1].split("")[x1];
					// if (value3x3 === "0") value3x3 = " "
					highResGrid.set(x * 3 + x1, y * 3 + y1, value3x3);
				}
			}
		}
	});
	return highResGrid;
};

const getAdjacent = (grid, xy) => {
	const valueAtPos = grid.get(xy.x, xy.y);
	if (valueAtPos === ANIMAL) {
		return getAttachedPipes(grid, xy);
	} else {
		const pipe = new Pipe(valueAtPos);
		return pipe.getExits().map(exit => ({x: xy.x + exit.x, y: xy.y + exit.y}));
	}
};

const getMainLoop = (grid, originX, originY) => {
	const visited = [];
	const frontier = [{x: originX, y: originY}];
	while (frontier.length > 0) {
		const xy = frontier.shift();
		visited.push(xy);
		for (const adjacent of getAdjacent(grid, xy)) {
			if (inArray(visited, adjacent) || inArray(frontier, adjacent)) continue;
			if (grid.isOutside(adjacent.x, adjacent.y)) continue;
			const adjacentValue = grid.get(adjacent.x, adjacent.y);
			if (adjacentValue === ANIMAL) continue;
			if (adjacentValue === GROUND) continue;
			frontier.push(adjacent);
		}
	}
	return visited;
};

const bfs = (grid, originX, originY) => {
	const visited = [];
	const visitData = new Grid();
	const frontier = [{x: originX, y: originY}];
	while (frontier.length > 0) {
		const xy = frontier.shift();
		visited.push(xy);
		const valueAtPos = grid.get(xy.x, xy.y);
		for (const direction of Directions) {
			const adjacent = {x: xy.x + direction.x, y: xy.y + direction.y};
			if (inArray(visited, adjacent) || inArray(frontier, adjacent)) continue;
			if (grid.isOutside(adjacent.x, adjacent.y)) continue;
			const adjacentValue = grid.get(adjacent.x, adjacent.y);
			if (adjacentValue === ANIMAL) continue;
			if (adjacentValue !== GROUND) continue;
			frontier.push(adjacent);
		}
	}
	return visited;
};

const inArray = (array, xy) => {
	return array.some(element => element.x === xy.x && element.y === xy.y);
};

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

const getAttachedPipes = (grid, xy) => {
	const attachedPipes = [];
	for (const direction of Directions) {
		const scanCoord = {x: xy.x + direction.x, y: xy.y + direction.y};
		const valueAtPos = grid.get(scanCoord.x, scanCoord.y);
		if (!valueAtPos || valueAtPos === GROUND) continue;
		const pipe = new Pipe(valueAtPos);
		const isConnectedToThisTile = pipe.exitsTo(reverseDirection(direction));
		if (isConnectedToThisTile) attachedPipes.push(scanCoord);
	}
	return attachedPipes;
}

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

	getHighResRepresentation() {
		if (this.symbol === "|") {
			return [".X.",
					".X.",
					".X."];
		}
		if (this.symbol === "-") {
			return ["...",
					"XXX",
					"..."];
		}
		if (this.symbol === "J") {
			return [".X.",
					"XX.",
					"..."];
		}
		if (this.symbol === "F") {
			return ["...",
					".XX",
					".X."];
		}
		if (this.symbol === "7") {
			return ["...",
					"XX.",
					".X."];
		}
		if (this.symbol === "L") {
			return [".X.",
					".XX",
					"..."];
		}
		throw new Error("Missing setting")
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

	isOutside (x, y) {
		return x < 0 || y < 0 || x >= this.sizeX || y >= this.sizeY;
	}
}

console.time("Elapsed time");
console.log("Result: ", fn(input));
console.timeEnd("Elapsed time");
