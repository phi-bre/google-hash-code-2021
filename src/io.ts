import { from } from 'https://deno.land/x/lazy@v1.7.1/mod.ts';

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
