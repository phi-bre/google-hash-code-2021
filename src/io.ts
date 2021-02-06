export function read(file: string) {
    const text = Deno.readTextFileSync(`in/${file}`);
    const [header, libraries, ...body] = text.split('\n');
    return {

    };
}

export function write(file: string, context: any) {
    Deno.writeTextFile(`out/${file}`, context.score);
    // Deno.writeTextFile(`out/${Date.now()}.json`, JSON.stringify(context));
}
