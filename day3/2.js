const fs = require("fs");

// const input = fs.readFileSync("demoinput.txt", "utf8");
const input = fs.readFileSync("input.txt", "utf8");
console.time("Elapsed time");

const fn = input => {
	const data = parseInput(input);
	const grid = new Grid(data);
	const partNumbersAdjacentToStars = {};
	for (let y = 0; y < grid.sizeY; y++) {
		let number = "";
		let adjacentStars = new Set();
		for (let x = 0; x < grid.sizeX; x++) {
			const char = grid.get(x, y);
			if (isNumber(char)) {
				number += char;
				for (const coord of grid.getAdjacentCoords(x, y)) {
					const value = grid.get(coord.x, coord.y);
					if (value !== "*") continue;
					const coordStr = `${coord.x},${coord.y}`
					adjacentStars.add(coordStr);
				}
			} else {
				if (number.length > 0) {
					for (const starCoordinates of adjacentStars.values()) {
						partNumbersAdjacentToStars[starCoordinates] = partNumbersAdjacentToStars[starCoordinates] || [];
						partNumbersAdjacentToStars[starCoordinates].push(parseInt(number));
					}
				}
				number = "";
				adjacentStars = new Set();
			}
		}
		if (number.length > 0) {
			for (const starCoordinates of adjacentStars.values()) {
				partNumbersAdjacentToStars[starCoordinates] = partNumbersAdjacentToStars[starCoordinates] || [];
				partNumbersAdjacentToStars[starCoordinates].push(parseInt(number));
			}
		}
	}

	const gearCoords = Object.keys(partNumbersAdjacentToStars).filter(coord => partNumbersAdjacentToStars[coord].length === 2);
	console.log(`Found ${gearCoords.length} gears.`);
	const gearRatios = gearCoords.map(gc => partNumbersAdjacentToStars[gc].reduce((a, b) => a * b));
	const sumOfGearRatios = gearRatios.reduce((a, b) => a + b);
	return sumOfGearRatios;
};

const isNumber = (str) => {
	return ["0","1","2","3","4","5","6","7","8","9"].includes(str);
};

const parseInput = input => {
	const data = [];
	for (const line of input.split("\n").filter(l => l !== "")) {
		data.push(line.split(""));
	}
	return data;
};

class Grid {
	matrix;
	sizeY;
	sizeX;

	constructor (matrix = []) {
		this.matrix = matrix;
		this.sizeY = matrix.length;
		if (this.matrix.length > 0) this.sizeX = this.matrix[0].length;
	}

	getAdjacentValues (x, y) {
		return this.getAdjacentCoords(x, y).map(coord => this.get(coord.x, coord.y));
	}

	getAdjacentCoords (x, y) {
		return [
			{x: x - 1, y: y - 1},
			{x: x + 0, y: y - 1},
			{x: x + 1, y: y - 1},
			{x: x - 1, y: y + 0},

			{x: x + 1, y: y + 0},
			{x: x - 1, y: y + 1},
			{x: x + 0, y: y + 1},
			{x: x + 1, y: y + 1},
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
			const v = " " + grid.get(x, y);
			line += v;
		}
		console.log(line);
	}
};

console.log("Result: ", fn(input));
console.timeEnd("Elapsed time");
