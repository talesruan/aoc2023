const fs = require("fs");
// const input = fs.readFileSync("demoinput2.txt", "utf8");
const input = fs.readFileSync("input.txt", "utf8");

const fn = input => {
	const data = parseInput(input);
	const instructions = data.instructions
	let steps = 0
	let currentNodes = data.nodes.filter(n => n.name.endsWith("A"));
	const periods = [];
	let periodsFound = 0;
	while (periodsFound < currentNodes.length) {
		const command = instructions[steps % instructions.length];
		steps++;
		currentNodes = currentNodes.map(node => node[command]);
		for (let i = 0; i < currentNodes.length; i++) {
			if (periods[i]) continue;
			if (!currentNodes[i].name.endsWith("Z")) continue;
			periods[i] = steps;
			periodsFound++
		}
	}
	const result = calculateLCM(periods);
	return result;
};

/** Calculate Greatest common divisor */
const calculateGCD = (a, b) => {
	if (b === 0) return a;
	return calculateGCD(b, a % b);
};

/** Least common multiple */
const calculateLCM = params => {
	let lcm = params[0];
	for (let i = 1; i < params.length; i++) {
		lcm = params[i] * lcm / calculateGCD(params[i], lcm);
	}
	return lcm;
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
