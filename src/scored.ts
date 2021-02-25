import { Output, Schedule, Street, StreetSchedule } from './io.ts';
import { input } from './setup.ts';

const streetNames = new Map<string, Street>();

// input.streets.each(street => streetNames.set(street.name, street));

export function scored(output: Output): number {
    const cars = input.cars.map(car => ({ ...car, path: car.path.slice() }));

    // for (const schedule of output.schedules) {
    //     for (const streetSchedules of schedule.streetSchedules) {
    //         streetSchedules.duration
    //     }
    // }

    const durations = new Map<Schedule, number>();
    const currentStreetSchedule = new Map<Schedule, StreetSchedule>();
    output.schedules.each(schedule => {
        durations.set(schedule, 0);
        currentStreetSchedule.set(schedule, schedule.streetSchedules[0]);
    });

    for (let t = 0; t < input.duration; t++) {
        for (const schedule of output.schedules) {
            if (schedule.streetSchedules.length === 0) {
                break;
            }

            let streetSchedule = currentStreetSchedule.get(schedule)!;
            let duration = durations.get(schedule)!;

            if (streetSchedule.duration === 0) {
                break;
            }

            if (duration >= streetSchedule.duration) {
                streetSchedule = schedule.streetSchedules[schedule.streetSchedules.indexOf(streetSchedule) + 1];
                currentStreetSchedule.set(schedule, streetSchedule);
                duration = 0;
                durations.set(schedule, 0);
            }

            const [car] = streetSchedule.street.cars;
            car.path.shift();
            const [nextStreet] = car.path;
            streetNames.get(nextStreet)!.cars.push(car);
            durations.set(schedule, duration + 1);
        }
    }

    return cars
        .filter(car => car.path.length === 0)
        .reduce(score => score + input.carScore, 0);
}
