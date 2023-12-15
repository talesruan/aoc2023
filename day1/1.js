const fs = require("fs");

const input = fs.readFileSync("input.txt", "utf8");
console.time("Elapsed time");

const fn = input => {
	const data = parseInput(input);
	let sum = 0;
	for (const line of data) {
		const firstDigit = findFirstNumber(line.split(""));
		const lastDigit = findFirstNumber(line.split("").reverse())
		const number = parseInt(`${firstDigit}${lastDigit}`);
		sum += number;
	}
	return sum;
};

const findFirstNumber = (array) => {
	return array.find(e => !isNaN(parseInt(e)))
}

const parseInput = input => {
	const data = [];
	for (const line of input.split("\n").filter(l => l !== "")) {
		data.push(line);
	}
	return data;
};

console.log("Result: ", fn(input));
console.timeEnd("Elapsed time");
