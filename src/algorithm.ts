import { Input, Output, Pizza, Team } from './io.ts';
import { input } from './main.ts';
import { scored } from './scored.ts';

export function algorithm(weights: number[]): Output {
    const pizzaScores = input.pizzas
        .map(pizza => ({
            pizza, score: (
                + pizza.num_ingredients * weights[0]
                + pizza.uniqueness * weights[1]
            )
        }))
        .sort((a, b) => a.score - b.score);

    const team_sizes = [
        ...Array(input.num_4_person_teams).fill(4),
        ...Array(input.num_3_person_teams).fill(3),
        ...Array(input.num_2_person_teams).fill(2),
    ].sort((a, b) => (a - b) * weights[2]);

    let delivered_pizzas = 0;
    const teams: Array<Team> = [];
    for (const team_size of team_sizes) {
        const pizzas = pizzaScores
            .slice(delivered_pizzas, delivered_pizzas + team_size)
            .map(s => s.pizza.index);
        const team = { team_size, pizzas };
        if (delivered_pizzas < pizzaScores.length && team.pizzas.length === team.team_size) {
            teams.push(team);
            delivered_pizzas += team_size;
        } else {
            break;
        }
    }

    const score = scored({ teams });
    return { teams, score };
}
