const fs = require("fs");
// const input = fs.readFileSync("demoinput.txt", "utf8");
const input = fs.readFileSync("input.txt", "utf8");


const fn = input => {
	const data = parseInput(input);
	const grid = new Grid(data);
	display(grid);
	const galaxies = findGalaxies(grid);
	const galaxiesPerRow = "0".repeat(grid.sizeY).split("").map(x => parseInt(x));
	const galaxiesPerCol = "0".repeat(grid.sizeX).split("").map(x => parseInt(x));
	for (const galaxy of galaxies) {
		galaxiesPerRow[galaxy.y]++;
		galaxiesPerCol[galaxy.x]++;
	}
	const galaxyPairs = getPairs(galaxies);
	let sumOfSteps = 0;
	for (const galaxyPair of galaxyPairs) {
		const galaxy1 = galaxyPair[0];
		const galaxy2 = galaxyPair[1];
		let steps = 0;
		for (let i = galaxy1.x; i !== galaxy2.x ; i += (Math.sign(galaxy2.x - galaxy1.x))) {
			steps ++;
			if (galaxiesPerCol[i] === 0) steps++;
		}
		for (let i = galaxy1.y; i !== galaxy2.y ; i += (Math.sign(galaxy2.y - galaxy1.y))) {
			steps ++;
			if (galaxiesPerRow[i] === 0) steps++;
		}
		sumOfSteps += steps;
	}
	return sumOfSteps;
};

const getPairs = array => {
	const pairs = []
	for (let i = 0; i < array.length; i++) {
		for (let j = i + 1; j < array.length; j++) {
			pairs.push([array[i], array[j]]);
		}
	}
	return pairs;
}

const findGalaxies = grid => {
	const galaxies = [];
	grid.iterate((x, y, value) => {
		if (value === "#") galaxies.push({x, y});
	});
	return galaxies;
};

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
				const value = this.get(x, y);
				func(x, y, value);
			}
		}
	}

	getAdjacentValues (x, y) {
		return this.getAdjacentCoords(x, y).map(coord => this.get(coord.x, coord.y));
	}

	getAdjacentCoords (x, y) { // TODO: Remove
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

const parseInput = input => {
	const data = [];
	for (const line of input.split("\n").filter(l => l !== "")) {
		data.push(line.split(""));
	}
	return data;
};

const display = (grid) => {
	for (let y = 0; y < grid.matrix.length; y++) {
		let line = "";
		for (let x = 0; x < grid.sizeX; x++) {
			let value = grid.get(x, y);
			if (value === "X") {
				value = getColoredString(value, "red");
			} else if (value === "E") {
				value = getColoredString(value, "green");
			} else if (value === "O") {
				value = getColoredString(value, "green");
			}
			let v = " " + value;
			if (value === undefined) v = "  ";

			line += v;
		}
		console.log(line);
	}
};

console.time("Elapsed time");
console.log("Result: ", fn(input));
console.timeEnd("Elapsed time");
