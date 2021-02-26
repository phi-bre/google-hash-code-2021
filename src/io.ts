export interface Intersection {
    id: number;
    streets: Array<Street>;
    sim?: {
        green?: Street;
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
        greenTicks: number;
        cars: Array<Car>;
    };
}

export interface Car {
    path: Array<Street>;
    score: number;
    sim?: {
        pathIndex: number;
        streetTicks: number;
        finished?: true;
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
    const text = Deno.readTextFileSync(`in/${file}`);
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
            streets: streets.filter(street => street.to === i),
        });
    }

    const map = new Map<string, Street>(
        streets.map(street => [street.name, street])
    );

    const cars = new Array<Car>();
    for (let i = 0; i < carCount; i++) {
        const car: Partial<Car> = { score: 0 };
        car.path = body[streetCount + i].split(' ').slice(1).map(name => {
            const street = map.get(name.trim())!;
            street.cars.push(car as Car);
            return street;
        });
        cars.push(car as Car);
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
    Deno.writeTextFileSync(`out/${file}`, text);
    // Deno.writeTextFile(`out/${Date.now()}.json`, JSON.stringify(context));
}
