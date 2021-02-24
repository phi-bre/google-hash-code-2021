import './utils.ts';

declare global {
    interface Array<T> {
        each(callback: (value: T, index: number, array: T[]) => any): this;
        shuffle(): this;
        inspect(): string;
        stats(reducer: (item: T) => number): Statistic;
    }

    interface Statistic {
        max: number;
        min: number;
        average: number;
        spread: number;
    }
}

console.log('Google Hash Code 2021 🎉');
const process = Deno.run({ cmd: ['bin/zip'], stdout: 'null' });
await process.status();
process.close();

import { file } from './setup.ts';
import { write } from './io.ts';
import { algorithm } from './algorithm.ts';

// Trash code ahead...

export let score = 0;
export const iterations = Infinity;
let weights = new Array(3).fill(0).map(Math.random)//.map(n => n * 10);
let steps = weights.slice().fill(1).map(Math.random);
let last = weights.slice().fill(0);
let weight = 0;
let lastPoints = 0;

for (let i = 0; i < iterations; i++) {
    const rightWeights = weights.slice();
    rightWeights[weight] = rightWeights[weight] + steps[weight];
    const right = algorithm(rightWeights);
    const leftWeights = weights.slice();
    leftWeights[weight] = leftWeights[weight] - steps[weight];
    const left = algorithm(leftWeights);

    // Overshoots
    if ((last[weight] === 1 && right.score < left.score) || (last[weight] === -1 && right.score > left.score)) {
        steps[weight] /= 2;
    }

    // Stuck
    if ((last[weight] === 0) && (right.score === left.score)) {
        steps[weight] *= 1.5;
    }

    if (right.score > left.score) {
        weights = rightWeights;
        last[weight] = 1;
    } else if (right.score < left.score) {
        weights = leftWeights;
        last[weight] = -1;
    } else {
        last[weight] = 0;
    }

    if (Math.max(right.score, left.score) <= lastPoints) {
        weight = (weight + 1) % weights.length;
    }

    lastPoints = Math.max(right.score, left.score);
    if (lastPoints > score) {
        score = lastPoints;
        const { [score]: output } = { [right.score]: right, [left.score]: left };
        write(file, output);
        console.log(`score: ${output.score} weights: ${weights.inspect()}`);
    }
}
