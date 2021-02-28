import { Output, Schedule } from './io.ts';
import { input } from './main.ts';
import { scored } from './scored.ts';

export function algorithm(weights: number[]): Output {
    const schedules: Array<Schedule> = input.intersections
        .map(intersection => {
            return {
                intersection,
                streetSchedules: intersection.to
                    .map(street => {
                        return {
                            street,
                            duration: Math.floor(input.duration / intersection.to.length),
                        };
                    })
                    .filter(schedule => schedule.duration > 0)
                    .sort((a, b) => a.street.score - b.street.score)
            }
        })
        .filter(intersection => intersection.streetSchedules.length);

    // for (let i = 0; i < input.intersectionCount; i++) {
    //     const streets = input.streets.filter(street => street.to == i);
    //     // const cars = streets.reduce((cars, street) => {
    //     //     cars.push(...street.cars.map(car => car.car));
    //     //     return cars;
    //     // }, Array<Car>());
    //
    //     const total = streets.reduce((score, street) => {
    //         score += street.score;
    //         return score;
    //     }, 0);
    //
    //     const streetSchedules: Array<StreetSchedule> = streets.map(street => {
    //         let duration = 0;
    //         if (total != 0) {
    //             duration = Math.min(Math.ceil((street.cars.length * (street.score / total)) / streets.length), input.duration);
    //         }
    //
    //         return {
    //             name: street.name,
    //             duration: duration,
    //         }
    //     }).filter(schedule => schedule.duration > 0)
    //
    //     if (streetSchedules.length > 0) {
    //         schedules.push({intersection: i, streetSchedules})
    //     }
    //
    //     // intersections[i] = {
    //     //     id: i,
    //     //     trafficLights: streets,
    //     // }
    // }

    return scored({ schedules });
}
