export interface Intersection {
    id: number;
    from: Array<Street>;
    to: Array<Street>;
    sim?: {
        schedule: Schedule;
        streetScheduleIndex: number;
    };
}

export interface Street {
    name: string;
    from: number;
    to: number;
    duration: number;
    cars: Array<Car>;
    score: number;
    sim?: {
        cars: Array<Car>;
    };
}

export interface Car {
    route: Array<Street>;
    score: number;
    sim?: {
        routeIndex: number;
        streetDuration: number;
    };
}

export interface Input {
    duration: number;
    intersectionCount: number;
    streetCount: number;
    carCount: number;
    carScore: number;
    intersections: Array<Intersection>;
    streets: Array<Street>;
    cars: Array<Car>;
}

export interface Schedule {
    intersection: Intersection;
    streetSchedules: Array<StreetSchedule>;
    sim?: {
        streetScheduleIndex: number;
        streetScheduleTicks: number;
    };
}

export interface StreetSchedule {
    street: Street;
    duration: number;
}

export interface Output {
    schedules: Array<Schedule>;
    score: number;
}

export function read(file: string): Input {
    const text = Deno.readTextFileSync(`in/${file}.txt`);
    const [head, ...body] = text.split('\n');
    const [duration, intersectionCount, streetCount, carCount, carScore] = head.split(' ').map(Number);

    const streets = new Array<Street>();
    for (let i = 0; i < streetCount; i++) {
        const [from, to, name, duration] = body[i].split(' ');
        streets.push({
            name: name.trim(),
            from: Number(from),
            to: Number(to),
            duration: Number(duration),
            cars: [],
            score: 0,
        });
    }

    const intersections = new Array<Intersection>();
    for (let i = 0; i < intersectionCount; i++) {
        intersections.push({
            id: i,
            from: streets.filter(street => street.from == i),
            to: streets.filter(street => street.to == i),
        });
    }

    const map = new Map<string, Street>(
        streets.map(street => [street.name, street])
    );

    const cars = new Array<Car>();
    for (let i = 0; i < carCount; i++) {
        const route = body[streetCount + i].split(' ').slice(1).map(name => map.get(name.trim())!);
        const score = route.length;
        cars.push({ route, score });
    }

    for (const car of cars) {
        for (const street of car.route) {
            street.score += car.score;
        }
    }

    return {
        intersections,
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
            schedule.streetSchedules.map(({ street, duration }) => `${street.name} ${duration}`).join('\n')
        }\n`;
    }
    Deno.writeTextFileSync(`out/${file}.out`, text);
    // Deno.writeTextFile(`out/${Date.now()}.json`, JSON.stringify(context));
}
