export interface Pizza {
    index: number;
    num_ingredients: number;
    ingredients: Set<string>;
    uniqueness: number;
}

export interface Team {
    team_size: number;
    pizzas: Array<number>;
}

export interface Input {
    readonly num_available_pizzas: number;
    readonly num_2_person_teams: number;
    readonly num_3_person_teams: number;
    readonly num_4_person_teams: number;
    readonly pizzas: Array<Pizza>;
}

export interface Output {
    score: number;
    teams: Array<Team>;
}

export function read(file: string): Input {
    const text = Deno.readTextFileSync(`in/${file}.in`);
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
                uniqueness: 0,
                num_ingredients: Number(num_ingredients),
                ingredients: new Set(ingredients),
            });
        }),
    };
}

export function write(file: string, output: Output) {
    let text = `${output.teams.length}\n`;
    output.teams.forEach(({team_size, pizzas}) => {
        text += team_size + ' ' + [...pizzas].join(' ') + '\n';
    });
    Deno.writeTextFileSync(`out/${file}.out`, text);
    // Deno.writeTextFile(`out/${Date.now()}.json`, JSON.stringify(context));
}
