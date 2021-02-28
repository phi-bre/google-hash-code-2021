export interface Intersection {
    id: number;
    from: Array<Street>;
    to: Array<Street>;
    cycle: number;
    sim?: {
        schedule: Schedule;
        streetScheduleIndex: number;
    };
    indexes: Array<StreetSchedule>;
    schedule?: Schedule;
}

export interface Street {
    name: string;
    from: number;
    to: number;
    duration: number;
    cars: Array<Car>;
    indexed: boolean;
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

    const intersections = new Array<Intersection>();
    for (let i = 0; i < intersectionCount; i++) {
        intersections.push({
            id: i,
            from: [],
            to: [],
            cycle: 0,
            indexes: [],
            schedule: undefined,
        });
    }

    const streets = new Array<Street>();
    for (let i = 0; i < streetCount; i++) {
        const [from, to, name, duration] = body[i].split(' ');
        const street = {
            name: name.trim(),
            from: Number(from),
            to: Number(to),
            duration: Number(duration),
            cars: [],
            indexed: false,
        };
        intersections[street.from].from.push(street);
        intersections[street.to].to.push(street);
        streets.push(street);
    }

    const map = new Map<string, Street>(
        streets.map(street => [street.name, street])
    );

    const cars = new Array<Car>();
    for (let i = 0; i < carCount; i++) {
        const route = body[streetCount + i].split(' ').slice(1).map(name => map.get(name.trim())!);
        const car = { route, score: 0 };
        for (const street of route) {
            car.score += street.duration;
            street.cars.push(car);
        }
        cars.push(car);
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
