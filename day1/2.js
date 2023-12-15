const fs = require("fs");

// const input = fs.readFileSync("demoinput2.txt", "utf8");
const input = fs.readFileSync("input.txt", "utf8");
console.time("Elapsed time");

const fn = input => {
	const data = parseInput(input);
	let sum = 0;
	for (const line of data) {
		const firstDigit = parseDigit(line.match(/\d|one|two|three|four|five|six|seven|eight|nine/g)[0]);
		const lastDigit = parseDigit([...line.matchAll(/.*(\d|one|two|three|four|five|six|seven|eight|nine).*/g)][0][1]);
		const number = parseInt(`${firstDigit}${lastDigit}`);
		console.log(`${line} -> ${number}`);
		sum += number;
	}
	return sum;
};

const digits = ["zero","one","two","three","four","five","six","seven","eight","nine"];

const parseDigit = (str) => {
	if (str.length === 1) return parseInt(str);
	return digits.indexOf(str);
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

