export function read(file: string) {
    const text = Deno.readTextFileSync(`in/${file}`);
    const [header, ...body] = text.split('\n');
    const [num_available_pizzas, num_2_person_teams, num_3_person_teams, num_4_person_teams] = header.split(' ').map(Number);
    body.pop(); // Remove empty line
    return {
        num_available_pizzas,
        num_2_person_teams,
        num_3_person_teams,
        num_4_person_teams,
        pizzas: body.map(part => {
            const [num_ingredients, ...ingredients] = part.split(' ');
            return ({
                num_ingredients: Number(num_ingredients),
                ingredients: new Set(ingredients),
            });
        }),
    };
}

export function write(file: string, context: any) {
    Deno.writeTextFile(`out/${file}`, context.score);
    // Deno.writeTextFile(`out/${Date.now()}.json`, JSON.stringify(context));
}
