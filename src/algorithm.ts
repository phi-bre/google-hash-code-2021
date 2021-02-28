import { Output, Schedule } from './io.ts';
import { input } from './main.ts';
import { scored } from './scored.ts';

export function algorithm(weights: number[]): Output {
    // for (const car of input.cars) {
    //     car.score += street.duration;
    // }

    for (const street of input.streets) {
        street.throughput = input.intersections[street.from].from.length;
        street.score = 0;
        for (const car of street.cars) {
            street.score += (car.score * weights[1]);
        }
        street.score += (street.cars.length * weights[0]);
        // street.score += input.intersections[street.from].from.length * weights[2];
    }

    // for (const car of input.cars) {
    //     for (const street of car.route) {
    //         street.score += ((car.score) * weights[0])// + (street.throughput * weights[4]) + (car.route.indexOf(street) * weights[5]);
    //     }
    // }

    const schedules: Array<Schedule> = input.intersections
        .map(intersection => {
            // const intersectionCarsCount = intersection.to.reduce((count, street) => street.cars.length + count, 0);
            // const [streetsScoreTotal, streetsCarLengthTotal] = intersection.to.reduce(([t1, t2], street) => {
            //     return [street.score + t1, street.cars.length + t2];
            // }, [0, 0]);
            const total = intersection.to.reduce((score, street) => street.score + score, 0);
            return {
                intersection,
                streetSchedules: intersection.to
                    .map(street => {
                        // const streetPriority = (street.cars.length / streetsScoreTotal * weights[1]) * (street.score / streetsCarLengthTotal * weights[2]);
                        return {
                            street,
                            duration: street.cars.length === 0 ? 0 : Math.max(1, Math.min(input.duration,
                                Math.round(street.score / total) //* (input.duration * weights[3])
                            ))
                            // duration: street.cars.length === 0 ? 0 : Math.max(1, Math.min(input.duration,
                            //     Math.round(streetPriority /* * (input.duration * weights[3])*/)
                            // ))
                            // duration: Math.min(Math.floor((street.score / intersectionCarsCount * weights[1]) * (input.duration * weights[2])), 1)
                        };
                    })
                    .filter(schedule => schedule.duration > 0 && schedule.street.cars.length)
                    // .sort((b, a) => {
                    //     // if ( a.street.name < b.street.name ){
                    //     //     return -1;
                    //     // }
                    //     // if ( a.street.name > b.street.name ){
                    //     //     return 1;
                    //     // }
                    //     // return 0;
                    //     return a.street.score - b.street.score;
                    // })
                    .shuffle()
            }
        })
        .filter(intersection => intersection.streetSchedules.length);

    return scored({ schedules });
}
