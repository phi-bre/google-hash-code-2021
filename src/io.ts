export interface Input {
}

export interface Output {
    score: number;
}

export function read(file: string): Input {
    const text = Deno.readTextFileSync(`in/${file}.in`);
    // TODO
    return {};
}

export function write(file: string, output: Output) {
    let text = `\n`;
    // TODO
    Deno.writeTextFileSync(`out/${file}.out`, text);
    // Deno.writeTextFile(`out/${Date.now()}.json`, JSON.stringify(context));
}
