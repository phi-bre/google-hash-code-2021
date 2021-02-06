import { Input, Output, Pizza, Team } from './io.ts';

interface PizzaScore {
    pizza: Pizza;
    score: number;
}

export function algorithm(input: Input, weights: number[]): Output {
    const pizzaScores = calculatePizzaScores(input.pizzas)
        .sort((a, b) => b.score - a.score);

    const teams = distributePizzas(input, pizzaScores);

    return { teams };
}

function distributePizzas(input: Input, pizzaScores: Array<PizzaScore>): Array<Team> {
    const team_sizes = [
        ...Array(input.num_2_person_teams).fill(2),
        ...Array(input.num_3_person_teams).fill(3),
        ...Array(input.num_4_person_teams).fill(4),
    ];

    let num_delivered_pizzas = 0;
    const teams: Array<Team> = [];
    for (const team_size of team_sizes) {
        const pizzas = pizzaScores
            .slice(num_delivered_pizzas, num_delivered_pizzas + team_size)
            .map(s => s.pizza.index);
        const team = { team_size, pizzas };
        if (num_delivered_pizzas < pizzaScores.length && team.pizzas.length === team.team_size) {
            teams.push(team);
            num_delivered_pizzas += team_size;
        } else {
            break;
        }
    }

    return teams;
}

function calculatePizzaScores(pizzas: Array<Pizza>): Array<PizzaScore> {
    const ingredientScores = calculateIngredientScores(pizzas);

    return pizzas.map(pizza => {
        let score = 0;
        for (const ingredient of pizza.ingredients) {
            score += ingredientScores.get(ingredient) || 0;
        }

        return {pizza, score}
    });
}

function calculateIngredientScores(pizzas: Array<Pizza>): Map<string, number> {
    const ingredients = new Map<string, number>();
    let total = 0;

    for (const pizza of pizzas) {
        for (const ingredient of pizza.ingredients) {
            const count = ingredients.get(ingredient) || 0;
            ingredients.set(ingredient, count + 1);
            total++;
        }
    }

    for (const ingredient of ingredients.keys()) {
        const count = ingredients.get(ingredient) || 0;
        ingredients.set(ingredient, count / total);
    }

    return ingredients;
}
