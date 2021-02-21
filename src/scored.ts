import { Output } from './io.ts';
import { input } from './main.ts';

export function scored(output: Partial<Output>): number {
    let delivered = new Set<number>();
    let score = 0;

    for (const team of output.teams) {
        const used_ingredients = new Set<string>();
        let team_score = 0;

        if (!team.pizzas.length) {
            continue;
        }

        if ((team.team_size > team.pizzas.length) && (team.pizzas.length !== 0)) {
            console.warn('for all N-person teams, either nobody or everybody receives a pizza');
        }

        for (let i = 0; i < team.team_size; i++) {
            const pizza = team.pizzas[i];
            if (pizza !== undefined && !delivered.has(pizza)) {
                input.pizzas[pizza].ingredients.forEach(ingredient => {
                    if (!used_ingredients.has(ingredient)) {
                        team_score++;
                        used_ingredients.add(ingredient);
                    }
                });
                delivered.add(pizza);
            }
        }

        score += team_score ** 2;
    }

    if (delivered.size > input.pizzas.length) {
        console.warn('each pizza must be part of at most one order');
    }

    if (delivered.size > (input.num_2_person_teams * 2 + input.num_3_person_teams * 3 + input.num_4_person_teams * 4)) {
        console.warn('there are TN or less deliveries to teams of N people');
    }

    return score;
}
