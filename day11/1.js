const fs = require("fs");
// const input = fs.readFileSync("demoinput.txt", "utf8");
const input = fs.readFileSync("input.txt", "utf8");

const UNIVERSE_EXPANSION = 2;

const fn = input => {
	const data = parseInput(input);
	const numberOfLines = data.length;
	const galaxies = findGalaxies(data);
	const galaxiesPerRow = "0".repeat(numberOfLines).split("").map(x => parseInt(x));
	const galaxiesPerCol = "0".repeat(data[0].length).split("").map(x => parseInt(x));
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
			if (galaxiesPerCol[i] === 0) {
				steps += UNIVERSE_EXPANSION;
			} else {
				steps ++;
			}
		}
		for (let i = galaxy1.y; i !== galaxy2.y ; i += (Math.sign(galaxy2.y - galaxy1.y))) {
			if (galaxiesPerRow[i] === 0) {
				steps += UNIVERSE_EXPANSION;
			} else {
				steps ++;
			}
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
