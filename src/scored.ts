import { Output, Schedule } from './io.ts';
import { input } from './setup.ts';

export function scored(output: Omit<Output, 'score'>): Output {
    const schedules = new Set(output.schedules.map(schedule => ({ ...schedule, index: 0 })));
    const streets = Object.fromEntries(input.streets.map(street => [street.name, {...street, index: 0}]));
    const cars = new Set(input.cars.map(car => ({
        ...car,
        path: car.path.map(street => streets[street.name]),
        street: 0,
        index: 0,
    })));
    let score = 0;

    for (let t = 0; t < input.duration; t++) {
        for (const schedule of schedules) {
            const street = streets[schedule.streetSchedules[schedule.index].street.name];

            // console.log(street.name, schedule.intersection.id);

            if (street.index > 0) {
                street.index--;
            } else if (street.index === 0) {
                schedule.index++;
                // console.log(schedule.index, schedule.streetSchedules.length)
                if (schedule.index === schedule.streetSchedules.length) {
                    schedules.delete(schedule);
                    break;
                }
                street.index = schedule.streetSchedules[schedule.index].duration;
            }
        }

        const taken: Record<string, boolean> = {};
        for (const car of cars) {
            const street = car.path[car.street];

            if (car.index < street.duration) {
                car.index++;
            } else if (car.index === street.duration) {
                car.street++;

                if (car.street === car.path.length) {
                    cars.delete(car);
                    score += input.carScore + (input.duration - t);
                    break;
                }

                if (street.index !== 0 && !taken[car.street]) { // is green
                    car.index = 0;
                    taken[car.street] = true;
                }
            }
        }
    }

    return {...output, score};
}
