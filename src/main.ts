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

import { read, write } from './io.ts';
export const file = 'b.txt';
export const input = read(file);
import { algorithm } from './algorithm.ts';

const output = algorithm([]);
// console.dir(output, { depth: 6 });
console.log(output.score)
write(file, output);

// Trash code ahead...

// export let score = 0;
// export const iterations = Infinity;
// export const weights = Array(3).fill(0).map(() => Math.random() * 2 - 1);
// export const velocities = new Array(weights.length).fill(2);
// for (let i = 0; i < iterations; i++) {
//     if (velocities.every(v => v === 0)) {
//         // stop at minimum
//         break;
//     }
//
//     for (let j = 0; j < weights.length; j++) {
//         weights[j] += velocities[j];
//         const output = algorithm(weights);
//
//         if (output.score > score) {
//             velocities[j] *= 2;
//             score = output.score;
//             write(file, output);
//             console.log(`score: ${output.score} weights: ${weights.inspect()} velocities: ${velocities.inspect()}`);
//         } else if (output.score < score) {
//             weights[j] -= velocities[j];
//             velocities[j] /= -2;
//         }
//     }
// }


// export let score = 0;
// export const iterations = Infinity;
// let weights = new Array(3).fill(0).map(Math.random)//.map(n => n * 10);
// let steps = weights.slice().fill(1).map(Math.random);
// let last = weights.slice().fill(0);
// let weight = 0;
// let lastPoints = 0;
//
// for (let i = 0; i < iterations; i++) {
//     const rightWeights = weights.slice();
//     rightWeights[weight] = rightWeights[weight] + steps[weight];
//     const right = algorithm(rightWeights);
//     const leftWeights = weights.slice();
//     leftWeights[weight] = leftWeights[weight] - steps[weight];
//     const left = algorithm(leftWeights);
//
//     // Overshoots
//     if ((last[weight] === 1 && right.score < left.score) || (last[weight] === -1 && right.score > left.score)) {
//         steps[weight] /= 2;
//     }
//
//     // Stuck
//     if ((last[weight] === 0) && (right.score === left.score)) {
//         steps[weight] *= 1.5;
//     }
//
//     if (right.score > left.score) {
//         weights = rightWeights;
//         last[weight] = 1;
//     } else if (right.score < left.score) {
//         weights = leftWeights;
//         last[weight] = -1;
//     } else {
//         last[weight] = 0;
//     }
//
//     if (Math.max(right.score, left.score) <= lastPoints) {
//         weight = (weight + 1) % weights.length;
//     }
//
//     lastPoints = Math.max(right.score, left.score);
//     if (lastPoints > score) {
//         score = lastPoints;
//         const { [score]: output } = { [right.score]: right, [left.score]: left };
//         write(file, output);
//         console.log(`score: ${output.score} weights: ${weights.inspect()}`);
//     }
// }
