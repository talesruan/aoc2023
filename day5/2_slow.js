const fs = require("fs");
// const input = fs.readFileSync("demoinput.txt", "utf8");
const input = fs.readFileSync("input.txt", "utf8");

/**
 * This works but is too slow to run against the full puzzle input (13mins)
 */
const fn = input => {
	const data = parseInput(input);
	const seeds = [...data[0].match(/\d+/g)].map(s => parseInt(s));
	const maps = parseMaps(data);
	const mapsSequence = [
		"seed-to-soil",
		"soil-to-fertilizer",
		"fertilizer-to-water",
		"water-to-light",
		"light-to-temperature",
		"temperature-to-humidity",
		"humidity-to-location"
	];
	let lowestNumber = Infinity;
	for (let i = 0; i < seeds.length; i += 2) {
		const seedRangeStart = seeds[i];
		const seedRangeLength = seeds[i + 1];
		console.log(`Running seeds from ${seedRangeStart} to ${seedRangeStart + seedRangeLength -1}`);
		for (let j = 0; j < seedRangeLength; j++) {
			const seed = seedRangeStart + j;
			let number = seed;
			for (const mapName of mapsSequence) {
				const map = maps[mapName];
				number = mapNumber(map, number);
			}
			if (number < lowestNumber) lowestNumber = number;
		}
	}
	return lowestNumber; // 10834440
};

const mapNumber = (map, number) => {
	const range = map.find(m => number >= m.sourceStart && number <= (m.sourceStart + m.range - 1));
	if (!range) return number;
	return range.destinationStart + (number - range.sourceStart);
};

const parseMaps = data => {
	const maps = {};
	let mapName;
	for (const line of data) {
		if (line.startsWith("seeds:")) continue;
		if (line.endsWith("map:")) {
			mapName = line.split(" ")[0];
			continue;
		}
		maps[mapName] = maps[mapName] || [];
		const numbers = line.split(" ").map(n => parseInt(n));
		maps[mapName].push({
			destinationStart: numbers[0],
			sourceStart: numbers[1],
			range: numbers[2]
		});
	}
	return maps;
};

const parseInput = input => {
	const data = [];
	for (const line of input.split("\n").filter(l => l !== "")) {
		data.push(line);
	}
	return data;
};

console.time("Elapsed time");
console.log("Result: ", fn(input));
console.timeEnd("Elapsed time");
