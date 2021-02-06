import { wait } from 'https://deno.land/x/wait/mod.ts';
import { optimize } from './optimize.ts';
import { scored } from './scored.ts';
import { algorithm } from './algorithm.ts';
import { read, write } from './io.ts';

const spinner = wait('Google Hash Code 2021 🎉').start();
const file = 'a_example.in';
const input = read(file);

optimize({
    file,
    score: 0,
    iterations: 1,
    weights: [1, 1, 1],
    exec(weights: number[]) {
        const output = algorithm(input, weights);
        let score = scored(output);
        if (score > this.score) {
            this.score = score;
            write(file, output);
        }
        spinner.text = `file: ${file}\n weights: ${weights.map(w => w.toPrecision(3)).join(' - ')}\n score: ${score} highest: ${this.score}`;
        return score;
    },
});
