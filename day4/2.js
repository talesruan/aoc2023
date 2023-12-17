const fs = require("fs");

// const input = fs.readFileSync("demoinput.txt", "utf8");
const input = fs.readFileSync("input.txt", "utf8");
console.time("Elapsed time");

const fn = input => {
	const data = parseInput(input);
	const numberOfCards = "1".repeat(data.length).split("").map(n => parseInt(n));
	for (let cardIndex = 0; cardIndex < data.length; cardIndex++){
		const card = data[cardIndex];
		const hits = getNumberOfHits(card);
		if (hits === 0) continue;
		const numberOfCopiesOfThisCard = numberOfCards[cardIndex];
		for (let i = 0; i < hits; i++) {
			const newCardCopyIndex = cardIndex + i + 1;
			numberOfCards[newCardCopyIndex] += numberOfCopiesOfThisCard;
		}
	}
	const cardCount = numberOfCards.reduce((a, b) => a + b);
	return cardCount;
};

const getNumberOfHits = card => {
	const numbersPart = card.split(":");
	const winningNumbers = new Set(numbersPart[1].split("|")[0].trim().split(/ +/));
	const cardNumbers = numbersPart[1].split("|")[1].trim().split(/ +/);
	return cardNumbers.filter(n => winningNumbers.has(n)).length;
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
