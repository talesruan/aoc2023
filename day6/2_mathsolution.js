const fs = require("fs");
// const input = fs.readFileSync("demoinput.txt", "utf8");
const input = fs.readFileSync("input.txt", "utf8");

/**
 * A more efficient but less readable mathematical solution
 */
const fn = input => {
	const data = parseInput(input);
	const race = parseRace(data);
	const m1 = (race.timeLimit - Math.sqrt((-race.timeLimit)**2 - 4 * race.distance))/2
	const m2 = (race.timeLimit + Math.sqrt((-race.timeLimit)**2 - 4 * race.distance))/2
	const waysToWinThisRace = Math.floor(m2) - Math.ceil(m1) + 1;
	return waysToWinThisRace;
};

const parseRace = data => {
	const timeLimit = parseInt([...data[0].match(/\d+/g)].join(""));
	const distance = parseInt([...data[1].match(/\d+/g)].join(""));
	return {timeLimit, distance};
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
