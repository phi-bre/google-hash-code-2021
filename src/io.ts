export interface Intersection {
    id: number;
    streets: Array<Street>;
}

export interface Street {
    name: string;
    from: number;
    to: number;
    duration: number;

    cars: Array<Car>;
    score: number;
}

export interface Car {
    streetCount: number;
    path: Array<string>;
    score: number;
}

export interface Input {
    duration: number;
    intersectionCount: number;
    streetCount: number;
    carCount: number;
    carScore: number;

    streets: Array<Street>;
    cars: Array<Car>;
}

export interface Schedule {
    intersection: Intersection;
    streetSchedules: Array<StreetSchedule>;
}

export interface StreetSchedule {
    name: string;
    duration: number;
}

export interface Output {
    schedules: Array<Schedule>;
    score: number;
}

export function read(file: string): Input {
    const text = Deno.readTextFileSync(`in/${file}`);
    const [head, ...body] = text.split('\n');
    const [duration, intersectionCount, streetCount, carCount, carScore] = head.split(' ').map(Number);

    const streets = new Array<Street>();
    for (let i = 0; i < streetCount; i++) {
        const [from, to, name, duration] = body[i].split(' ');
        streets.push({
            name,
            from: Number(from),
            to: Number(to),
            duration: Number(duration),
            cars: Array(),
            score: 0,
        });
    }

    const cars = new Array<Car>();
    for (let i = 0; i < carCount; i++) {
        const car = body[streetCount + i].split(' ');
        cars.push({
            streetCount: Number(car[0]),
            path: car.slice(1),
            score: 0,
        });
    }

    return {
        duration,
        intersectionCount,
        streetCount,
        carCount,
        carScore,
        streets,
        cars
    };
}

export function write(file: string, output: Output) {
    let text = `${output.schedules.length}\n`;
    for (const schedule of output.schedules) {
        text += `${schedule.intersection.id}\n${schedule.streetSchedules.length}\n${
            schedule.streetSchedules.map(({ name, duration }) => `${name} ${duration}`).join('\n')
        }\n`;
    }
    Deno.writeTextFileSync(`out/${file}`, text);
    // Deno.writeTextFile(`out/${Date.now()}.json`, JSON.stringify(context));
}
