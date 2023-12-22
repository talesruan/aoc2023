const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8");

const startNodeName = "AAA";
const finishNodeName = "ZZZ";
const fn = input => {
	const data = parseInput(input);
	const instructions = data.instructions
	let steps = 0
	let currentNode = data.nodes.find(n => n.name === startNodeName);
	while (currentNode.name !== finishNodeName) {
		const command = instructions[steps % instructions.length];
		steps++;
		currentNode = currentNode[command];
	}

	return steps;
};

const getOrCreateNode = (nodes, name) => {
	let node = nodes.find(n => n.name === name);
	if (!node) {
		node = {name};
		nodes.push(node);
	}
	return node;
}

const parseInput = input => {
	const data = {nodes: []};
	const lines = input.split("\n").filter(l => l !== "");
	data.instructions = lines.shift();
	for (const line of lines) {
		const matches = [...line.matchAll(/(\w+) = \((\w+), (\w+)\)/g)][0];
		const name = matches[1];
		const left = matches[2];
		const right = matches[3];
		const node = getOrCreateNode(data.nodes, name);
		node.L = getOrCreateNode(data.nodes, left);
		node.R = getOrCreateNode(data.nodes, right)
	}
	return data;
};

console.time("Elapsed time");
console.log("Result: ", fn(input));
console.timeEnd("Elapsed time");
