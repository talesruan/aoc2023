const fs = require("fs");

// const input = fs.readFileSync("demoinput.txt", "utf8");
const input = fs.readFileSync("input.txt", "utf8");
console.time("Elapsed time");

const fn = input => {
	const data = parseInput(input);
	const grid = new Grid(data);
	display(grid);

	let sumOfPartNumbers = 0;
	for (let y = 0; y < grid.sizeY; y++) {
		let number = "";
		let isAdjacentToSymbol = false;
		for (let x = 0; x < grid.sizeX; x++) {
			const char = grid.get(x, y);
			if (isNumber(char)) {
				number += char;
				if (grid.getAdjacentValues(x, y).some(value => isSymbol(value))) isAdjacentToSymbol = true;
			} else {
				if (number.length > 0) console.log("got a number: ", number, "adjacent:", isAdjacentToSymbol);
				if (number.length > 0 && isAdjacentToSymbol) {
					sumOfPartNumbers += parseInt(number);
				}
				number = "";
				isAdjacentToSymbol = false;
			}
		}
		if (number.length > 0) console.log("got a number: ", number, "adjacent:", isAdjacentToSymbol);
		if (number.length > 0 && isAdjacentToSymbol) {
			sumOfPartNumbers += parseInt(number);
		}
	}
	return sumOfPartNumbers;
};

const isNumber = (str) => {
	return ["0","1","2","3","4","5","6","7","8","9"].includes(str);
};

const isSymbol = (str) => {
	return str !== "." && !isNumber(str);
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
			{x: x - 1, y: y - 1},
			{x: x + 0, y: y - 1},
			{x: x + 1, y: y - 1},
			{x: x - 1, y: y + 0},
			//{x: x + 0, y: y + 0},
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
