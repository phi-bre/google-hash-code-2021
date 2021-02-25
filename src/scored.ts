import { Output } from './io.ts';
import {input} from './setup.ts';

export function scored(output: Output): number {
    const cars = input.cars.map(car => ({...car, path: car.path.slice() }));

    for (const schedule of output.schedules) {
        for (const trafficLight of schedule.streetSchedules) {

        }
    }

    const score = cars
        .filter(car => car.path.length === 0)
        .reduce(score => score + input.carScore, 0)

    return score;
}
