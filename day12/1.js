const fs = require("fs");
// const input = fs.readFileSync("demoinput.txt", "utf8");
const input = fs.readFileSync("input.txt", "utf8");

const OPERATIONAL = ".";
const DAMAGED = "#";
const statuses = [OPERATIONAL, DAMAGED];
const UNKNOWN = "?";

const fn = input => {
	const data = parseInput(input);
	let sumOfPossibleArrangements = 0;
	for(const line of data) {
		const groupInfo = line.split(" ")[1].split(",").map(x => parseInt(x));
		const record = line.split(" ")[0].split("");
		const arrangements = getNumberOfPossibleArrangements(record, groupInfo);
		sumOfPossibleArrangements += arrangements;
	}
	return sumOfPossibleArrangements;
};

const getNumberOfPossibleArrangements = (record, groupInfo) => {
	if (!record.includes(UNKNOWN)) {
		if (isArrangementPossible(record, groupInfo)) {
			return 1;
		}
		return 0;
	} else {
		let possibleArrangements = 0;
		const indexOfUnknown = record.indexOf(UNKNOWN);
		for (const status of statuses) {
			const possibleRecord = [...record];
			possibleRecord[indexOfUnknown] = status;
			possibleArrangements += getNumberOfPossibleArrangements(possibleRecord, groupInfo);
		}
		return possibleArrangements;
	}
};

const isArrangementPossible = (record, groupInfo) => {
	const groups = record.join("").split(".").filter(x => x);
	if (groups.length !== groupInfo.length) return false;
	for (let i = 0; i < groupInfo.length; i++) {
		if (!groups[i] || groups[i].length !== groupInfo[i]) return false;
	}
	return true;
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
