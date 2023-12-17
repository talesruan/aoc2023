const fs = require("fs");

const input = fs.readFileSync("input.txt", "utf8");
console.time("Elapsed time");

const fn = input => {
	const data = parseInput(input);
	let sumOfPoints = 0;
	for (const card of data) {
		const numbersPart = card.split(":");
		const winningNumbers = new Set(numbersPart[1].split("|")[0].trim().split(/ +/));
		const cardNumbers = numbersPart[1].split("|")[1].trim().split(/ +/);
		const hits = cardNumbers.filter(n => winningNumbers.has(n)).length;
		if (hits === 0) continue;
		const cardPoints = 2 ** (hits - 1);
		sumOfPoints += cardPoints
	}
	return sumOfPoints;
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
