const fs = require("fs");
const input = fs.readFileSync("demoinput.txt", "utf8");
// const input = fs.readFileSync("input.txt", "utf8");

const OPERATIONAL = ".";
const DAMAGED = "#";
const statuses = [OPERATIONAL, DAMAGED];
const UNKNOWN = "?";

const fn = input => {
	const data = parseInput(input);
	let sumOfPossibleArrangements = 0;
	for(const line of data) {
		console.log("line", line);
		const record = unfoldRecord(line.split(" ")[0].split(""));
		const groupInfo = line.split(" ")[1].split(",").map(x => parseInt(x));
		const arrangements = getNumberOfPossibleArrangements(record, groupInfo);
		console.log("arrangements", arrangements);
		console.log("--------------------");
		sumOfPossibleArrangements += arrangements;
	}
	return sumOfPossibleArrangements;
};

const unfoldRecord = record => {
	const unfoldedRecord = [];
	console.log("record", record.join(""));
	for (let i = 0; i < 5; i++) {
		console.log("A");
		unfoldedRecord.push(...record);
		if (i < 4) unfoldedRecord.push(UNKNOWN);
	}
	console.log("unfoldedRecord", unfoldedRecord.join(""));
	return unfoldedRecord;
};

const getNumberOfPossibleArrangements = (record, groupInfo) => {
	if (!record.includes(UNKNOWN)) {
		// all tested
		if (isArrangementPossible(record, groupInfo)) {
			console.log(`\tPossible arrangement ${record.join("")}`);
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
