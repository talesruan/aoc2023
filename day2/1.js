const fs = require("fs");

const input = fs.readFileSync("input.txt", "utf8");
console.time("Elapsed time");

const fn = input => {
	const data = parseInput(input);
	const games = parseGames(data);
	const maxCubes = {red: 12, green: 13, blue: 14};
	const possibleGames = games.filter(game => game.sets.every(set => (set.red || 0) <= maxCubes.red && (set.blue || 0) <= maxCubes.blue && (set.green || 0) <= maxCubes.green));
	const sumOfGameNumbers = possibleGames.map(game => game.number).reduce((a,b) => a + b);
	return sumOfGameNumbers;
};

const parseGames = data => {
	const games = [];
	for (const line of data) {
		const number = parseInt(line.split(":")[0].split(" ")[1]);
		const game = {number, sets: []};
		games.push(game);
		const setStrings = line.split(":")[1].split(";");
		for (const setString of setStrings) {
			const set = {};
			game.sets.push(set);
			const cubeCounts = setString.split(",");
			for (const cubeCountStr of cubeCounts) {
				const cubeColor = cubeCountStr.trim().split(" ")[1];
				const cubeCount = parseInt(cubeCountStr.trim().split(" ")[0]);
				set[cubeColor] = cubeCount;
			}
		}
	}
	return games;
};

const parseInput = input => {
	const data = [];
	for (const line of input.split("\n").filter(l => l !== "")) {
		data.push(line);
	}
	return data;
};

console.log("Result: ", fn(input));
console.timeEnd("Elapsed time");
