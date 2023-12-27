const fs = require("fs");
// const input = fs.readFileSync("demoinput.txt", "utf8");
const input = fs.readFileSync("input.txt", "utf8");

const fn = input => {
	const data = parseInput(input);
	let sumOfNextValues = 0;
	for (const line of data) {
		const nextValue = predictNextValue(line);
		sumOfNextValues += nextValue;
	}
	return sumOfNextValues;
};

const predictNextValue = array => {
	const lastValues = [];
	let workArray = [...array];
	while (!isAllZeroes(workArray)) {
		workArray = getDifferences(workArray);
		lastValues.push(workArray[workArray.length - 1]);
	}
	const increment = lastValues.reduce((a, b) => a + b);
	return array[array.length - 1] + increment;
};

const isAllZeroes = array => {
	return array.every(n => n === 0);
};

const getDifferences = array => {
	const diffs = [];
	for (let i = 0; i < array.length - 1; i++) {
		diffs.push(array[i + 1] - array[i]);
	}
	return diffs;
};

const parseInput = input => {
	const data = [];
	for (const line of input.split("\n").filter(l => l !== "")) {
		data.push(line.split(" ").map(n => parseInt(n)));
	}
	return data;
};

console.time("Elapsed time");
console.log("Result: ", fn(input));
console.timeEnd("Elapsed time");
