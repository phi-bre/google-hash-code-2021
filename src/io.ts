export interface Input {
    num_available_pizzas: number;
    num_2_person_teams: number;
    num_3_person_teams: number;
    num_4_person_teams: number;
    pizzas: Array<{
        index: number;
        num_ingredients: number;
        ingredients: Set<string>;
    }>;
}

export interface Output {
    num_delivered_pizzas: number;
    teams: Array<{
        team_size: number;
        pizzas: Array<number>;
    }>;
}

export function read(file: string): Input {
    const text = Deno.readTextFileSync(`in/${file}`);
    const [header, ...body] = text.split('\n');
    const [num_available_pizzas, num_2_person_teams, num_3_person_teams, num_4_person_teams] = header.split(' ').map(Number);
    body.pop(); // Remove empty line
    return {
        num_available_pizzas,
        num_2_person_teams,
        num_3_person_teams,
        num_4_person_teams,
        pizzas: body.map((part, index) => {
            const [num_ingredients, ...ingredients] = part.split(' ');
            return ({
                index,
                num_ingredients: Number(num_ingredients),
                ingredients: new Set(ingredients),
            });
        }),
    };
}

export function write(file: string, output: Output) {
    let text = `${output.num_delivered_pizzas}\n`;
    output.teams.forEach(({ team_size, pizzas }) => {
        text += team_size + ' ' + [...pizzas].join(' ') + '\n';
    });
    Deno.writeTextFile(`out/${file}`, text);
    // Deno.writeTextFile(`out/${Date.now()}.json`, JSON.stringify(context));
}
