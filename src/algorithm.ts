import {Input, Intersection, Schedule, Output, Car, StreetSchedule} from './io.ts';
import {scored} from './scored.ts';
import {input, intersections} from './setup.ts';



export function algorithm(weights: number[]): Output {
    const schedules = intersections
        .map(intersection => {
            return {
                intersection,
                streetSchedules: intersection.streets
                    .map(street => ({
                        name: street.name,
                        duration: street.cars.length,
                    }))
                    .sort((a, b) => a.duration - b.duration)
            }
        })

    console.log(schedules)

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

    return {schedules, score: 0};
}
