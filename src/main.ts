import './utils.ts';
import { read, write } from './io.ts';
import { algorithm } from './algorithm.ts';

console.log('Google Hash Code 2021 🎉');
const process = Deno.run({ cmd: ['bin/zip'], stdout: 'null' });
await process.status();
process.close();

export const file = 'd_many_pizzas';
export const input = read(file);

export const ingredients = new Map<string, number>();
for (const pizza of input.pizzas) {
    for (const ingredient of pizza.ingredients) {
        ingredients.set(ingredient, (ingredients.get(ingredient) || 0) + 1);
    }
}

for (const pizza of input.pizzas) {
    pizza.uniqueness = Array
        .from(pizza.ingredients)
        .reduce((u, i) => u + ingredients.get(i), 0)
        / ingredients.size;
}

console.table({
    pizza_ingredients: input.pizzas.stats(pizza => pizza.num_ingredients),
    uniqueness: input.pizzas.stats(pizza => pizza.uniqueness),
    ingredients: [...ingredients.values()].stats(i => i),
    ingredients_length: ingredients.size,
});

export let score = 0;
export const iterations = Infinity;
// export const weights = Array(3).fill(0).map(() => Math.random() * 2 - 1);
// export const velocities = new Array(weights.length).fill(2);
// for (let i = 0; i < iterations && !velocities.every(v => v === 0); i++) {
//     for (let j = 0; j < weights.length; j++) {
//         weights[j] += velocities[j];
//         const output = algorithm(weights);
//         if (output.score > score) {
//             velocities[j] *= +2;
//             score = output.score;
//             write(file, output);
//             console.log(`score: ${output.score} weights: ${weights.inspect()} velocities: ${velocities.inspect()}`);
//         } else {
//             weights[j] -= velocities[j];
//             velocities[j] /= -2;
//         }
//     }
// }

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

    // // Normalize
    // if (i % weights.length === 0) {
    //     const max = Math.max(...weights);
    //     for (let j = 0; j < weights.length; j++) {
    //         weights[j] /= max;
    //     }
    // }

    lastPoints = Math.max(right.score, left.score);
    if (lastPoints > score) {
        score = lastPoints;
        const { [score]: output } = { [right.score]: right, [left.score]: left };
        write(file, output);
        console.log(`score: ${output.score} weights: ${weights.inspect()}`);
    }
}
