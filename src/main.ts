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

export let score = 0;
export const iterations = Infinity;
export const weights = Array(3).fill(0).map(() => Math.random() * 2 - 1);
export const velocities = new Array(weights.length).fill(2);
for (let i = 0; i < iterations && !velocities.every(v => v === 0); i++) {
    for (let j = 0; j < weights.length; j++) {
        weights[j] += velocities[j];
        const output = algorithm(weights);
        if (output.score > score) {
            velocities[j] *= +2;
            score = output.score;
            write(file, output);
            console.log(`score: ${output.score} weights: ${weights.inspect()} velocities: ${velocities.inspect()}`);
        } else {
            weights[j] -= velocities[j];
            velocities[j] /= -2;
        }
    }
}
