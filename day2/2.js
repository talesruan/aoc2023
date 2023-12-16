const fs = require("fs");

const input = fs.readFileSync("input.txt", "utf8");
console.time("Elapsed time");

const fn = input => {
	const data = parseInput(input);
	const games = parseGames(data);
	const colors = ["red", "green", "blue"];
	const sum = games.map(game =>
		colors.map(color =>
			game.sets.map(set =>
				set[color] || 0)
			.reduce((a, b) => Math.max(a, b)))
		.reduce((a, b) => a * b)
	).reduce((a, b) => a + b);
	return sum;
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
