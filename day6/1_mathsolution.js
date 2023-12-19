const fs = require("fs");
// const input = fs.readFileSync("demoinput.txt", "utf8");
const input = fs.readFileSync("input.txt", "utf8");

/**
 * A more efficient but less readable mathematical solution
 */
const fn = input => {
	const data = parseInput(input);
	const races = parseRaces(data);
	let result = 1;
	for (const race of races) {
		const m1 = (race.timeLimit - Math.sqrt((-race.timeLimit)**2 - 4 * race.distance))/2
		const m2 = (race.timeLimit + Math.sqrt((-race.timeLimit)**2 - 4 * race.distance))/2
		const waysToWinThisRace = Math.floor(m2) - Math.ceil(m1) + 1;
		result = result * waysToWinThisRace;
	}
	return result;
};

const parseRaces = data => {
	const races = [];
	const times = [...data[0].match(/\d+/g)].map(s => parseInt(s));
	const distances = [...data[1].match(/\d+/g)].map(s => parseInt(s));
	for (let i = 0; i < times.length; i++) {
		races.push({timeLimit: times[i], distance: distances[i]});
	}
	return races;
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
