import { Output, Schedule } from './io.ts';
import { input, setup } from './main.ts';
import { scored } from './scored.ts';

export function algorithm(weights: number[]): Output {
    const schedules: Array<Schedule> = input.intersections
        .map(intersection => {
            if (!setup) {
                const schedule = { intersection, streetSchedules: intersection.indexes };
                intersection.indexes = [];
                return schedule;
            }

            const streets = intersection.to.filter(street => street.cars.length);
            intersection.cycle = streets.length;
            const schedule = {
                intersection,
                streetSchedules: streets.map(street => ({street, duration: 1})),
            };
            intersection.schedule = schedule;
            return schedule;
        })
        .filter(intersection => intersection.streetSchedules.length);

    console.log('solved')

    return scored({ schedules });
}
