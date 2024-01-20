const fs = require("fs");
// const input = fs.readFileSync("demoinput.txt", "utf8");
const input = fs.readFileSync("input.txt", "utf8");

const UNIVERSE_EXPANSION = 1000000; // Only thing that actually changed from the part 1. The rest is just refactoring.

const fn = input => {
	const data = parseInput(input);
	const galaxies = findGalaxies(data);
	const galaxiesPerRow = [];
	const galaxiesPerCol = [];
	for (const galaxy of galaxies) {
		galaxiesPerRow[galaxy.y] = true;
		galaxiesPerCol[galaxy.x] = true;
	}
	const galaxyPairs = getPairs(galaxies);
	let sumOfSteps = 0;
	for (const galaxyPair of galaxyPairs) {
		const steps = moveAlongAxis(galaxyPair, "x", galaxiesPerCol) + moveAlongAxis(galaxyPair, "y", galaxiesPerRow);
		sumOfSteps += steps;
	}
	return sumOfSteps;
};

const moveAlongAxis = (galaxyPair, axis, galaxiesOnTheWay) => {
	const galaxy1 = galaxyPair[0];
	const galaxy2 = galaxyPair[1];
	const stepDirection = Math.sign(galaxy2[axis] - galaxy1[axis]);
	let steps = 0;
	for (let i = galaxy1[axis]; i !== galaxy2[axis] ; i += stepDirection) {
		if (!galaxiesOnTheWay[i]) {
			steps += UNIVERSE_EXPANSION;
		} else {
			steps ++;
		}
	}
	return steps;
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

const findGalaxies = data => {
	const galaxies = [];
	for (let y = 0; y < data.length; y++) {
		const line = data[y];
		for (let x = 0; x < line.length; x++) {
			const value = line[x];
			if (value === "#") galaxies.push({x, y});
		}
	}
	return galaxies;
};

const parseInput = input => {
	const data = [];
	for (const line of input.split("\n").filter(l => l !== "")) {
		data.push(line.split(""));
	}
	return data;
};

console.time("Elapsed time");
console.log("Result: ", fn(input));
console.timeEnd("Elapsed time");
