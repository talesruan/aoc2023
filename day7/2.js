const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8");

const FIVE_OF_A_KIND = 7;
const FOUR_OF_A_KIND = 6;
const FULL_HOUSE = 5;
const THREE_OF_A_KIND = 4;
const TWO_PAIR = 3;
const ONE_PAIR = 2;
const HIGH_CARD = 1;

const labels = ["J", "2", "3", "4", "5", "6", "7", "8", "9", "T", "Q", "K", "A"];
const jokerLabel = "J";

const fn = input => {
	const data = parseInput(input);
	for (const run of data) {
		run.type = getHandType(run.hand);
	}
	const sortedRuns = data.sort((runA, runB) => {
		if (runA.type !== runB.type) return runA.type - runB.type;
		return compareHandsCardByCard(runA.hand, runB.hand);
	});
	let totalWinnings = 0;
	for (let i = 0; i < sortedRuns.length; i++) {
		const run = sortedRuns[i];
		totalWinnings += run.bid * (i+1);
	}
	return totalWinnings;
};

const compareHandsCardByCard = (hand1, hand2) => {
	for (let i = 0; i < 5; i++) {
		const delta = cardLabelToNumber(hand1[i]) - cardLabelToNumber(hand2[i]);
		if (delta !== 0) return delta;
	}
	return 0;
};

const cardLabelToNumber = (label) => {
	return labels.indexOf(label);
};

const getHandType = hand => {
	const countByLabel = {};
	for (const card of hand) {
		if (!countByLabel[card]) countByLabel[card] = 0;
		countByLabel[card]++;
	}
	let numberOfJokers = countByLabel[jokerLabel] || 0;
	delete countByLabel[jokerLabel];
	if (numberOfJokers === 5) return FIVE_OF_A_KIND;
	const sortedLabelCounts = Object.values(countByLabel).sort((a, b) => b-a);
	sortedLabelCounts[0] += numberOfJokers;
	if (sortedLabelCounts[0] === 5) return FIVE_OF_A_KIND;
	if (sortedLabelCounts[0] === 4) return FOUR_OF_A_KIND;
	if (sortedLabelCounts[0] === 3) {
		if (sortedLabelCounts[1] === 2) return FULL_HOUSE;
		return THREE_OF_A_KIND;
	}
	if (sortedLabelCounts[0] === 2) {
		if (sortedLabelCounts[1] === 2) return TWO_PAIR;
		return ONE_PAIR
	}
	return HIGH_CARD;
};

const parseInput = input => {
	const data = [];
	for (const line of input.split("\n").filter(l => l !== "")) {
		const parts = line.split(" ");
		data.push({
			hand: parts[0].split(""),
			bid: parseInt(parts[1])
		});
	}
	return data;
};

console.time("Elapsed time");
console.log("Result: ", fn(input));
console.timeEnd("Elapsed time");
