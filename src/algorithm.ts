import {Input, Output, Pizza} from './io.ts';

interface PizzaScore {
    pizza: Pizza;
    score: number;
}

export function algorithm(input: Input, weights: number[]): Output {
    const pizzaScores = calculatePizzaScores(input.pizzas)
        .sort((a, b) => b.score - a.score);

    console.log(pizzaScores);

    return {
        num_delivered_pizzas: 0,
        teams: [],
    };
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
