export function optimize<T extends { weights: number[], iterations: number, score: number, exec: Function }>(context: T) {
    const velocities = new Array(context.weights.length).fill(0);
    for (let i = 0; i < context.iterations; i++) {
        for (let j = 0; j < context.weights.length; j++) {
            context.weights[j] += velocities[j];
            const score = context.exec(context.weights);
            if (score > context.score) {
                velocities[j] *= +2;
            } else {
                velocities[j] /= -2;
            }
        }
    }
}
