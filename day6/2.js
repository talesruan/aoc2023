const fs = require("fs");
// const input = fs.readFileSync("demoinput.txt", "utf8");
const input = fs.readFileSync("input.txt", "utf8");

const fn = input => {
	const data = parseInput(input);
	const race = parseRace(data);
	let waysToWinThisRace = 0;
	for (let ms = 1; ms < race.timeLimit; ms++) {
		const timeLeft = race.timeLimit - ms;
		const speed = ms;
		const distanceTravelled = timeLeft * speed;
		if (distanceTravelled > race.distance) waysToWinThisRace++;
	}
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
