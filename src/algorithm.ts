import { Output, Schedule } from './io.ts';
import { input } from './main.ts';
import { scored } from './scored.ts';

export function algorithm(weights: number[]): Output {
    for (const street of input.streets) {
        street.score = 0;
    }

    for (const car of input.cars) {
        for (const street of car.route) {
            const throughput = input.intersections[street.from].from.length;
            street.score += ((car.score) * weights[0]) + (throughput * weights[4]) + ((car.route.indexOf(street)) * weights[5]);
        }
    }

    const schedules: Array<Schedule> = input.intersections
        .map(intersection => {
            // const intersectionCarsCount = intersection.to.reduce((count, street) => street.cars.length + count, 0);
            const [streetsScoreTotal, streetsCarLengthTotal] = intersection.to.reduce(([t1, t2], street) => {
                return [street.score + t1, street.cars.length + t2];
            }, [0, 0]);
            return {
                intersection,
                streetSchedules: intersection.to
                    .map(street => {
                        // const streetPriority = (street.score / streetsScoreTotal) * weights[1] + (street.cars.length / streetsCarLengthTotal) * weights[2];
                        return {
                            street,
                            // duration: Math.round(streetPriority * input.duration)
                            duration: street.cars.length === 0 ? 0 : Math.max(1, Math.min(input.duration,
                                Math.round((street.cars.length / streetsScoreTotal * weights[1]) * (street.score / streetsCarLengthTotal * weights[2]) * (input.duration * weights[3]))
                            ))
                            // duration: Math.min(Math.floor((street.score / intersectionCarsCount * weights[1]) * (input.duration * weights[2])), 1)
                        };
                    })
                    .filter(schedule => schedule.duration > 0)
                    // .shuffle()
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
