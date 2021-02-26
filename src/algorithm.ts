import { Car, Output, Schedule } from './io.ts';
import { input } from './setup.ts';

interface SimulationCar extends Car {
    street: number;
    index: number;
}

export function algorithm(weights: number[]): Output {
    const intersections = input.intersections.map(intersection => ({
        ...intersection,
        schedule: <Schedule>{intersection: intersection, streetSchedules: []},
        green: undefined as undefined | string
    }));
    const cars = new Set(input.cars.map(car => ({...car, street: 0, index: 0})));
    const streets = Object.fromEntries(input.streets.map(street => [street.name, {
        ...street,
        cars: Array.from(cars).filter(car => car.path[0].name === street.name),
        index: 0
    }]));
    let score = 0;

    for (let t = 0; t < input.duration; t++) {
        for (const car of cars) {
            if (car.index > 0) {
                car.index--;
                continue;
            }

            // At the end of the street
            const street = streets[car.path[car.street].name];
            street.cars.push(car);
        }

        for (const intersection of intersections) {
            if (intersection.green) {
                const street = streets[intersection.green];
                if (street.index > 0) {
                    street.index--;

                    // "progress" car
                    if (street.cars.length) {
                        const car = street.cars.shift()!;
                        car.street++;

                        if (car.street >= car.path.length) {
                            cars.delete(car);
                            score += input.carScore + (input.duration - t);
                        } else {
                            car.index = car.path[car.street].duration;
                        }
                    }

                    continue;
                }
            }

            // possibility to change street
            const [nextStreet] = intersection.streets
                .sort((a, b) => streets[b.name].cars.length - streets[a.name].cars.length); // TODO

            if (streets[nextStreet.name].cars.length) {
                intersection.green = nextStreet.name;
                streets[nextStreet.name].index = nextStreet.duration;
                intersection.schedule.streetSchedules.push({duration: 1, street: nextStreet});
            } else {
                intersection.green = undefined;
            }
        }
    }

    const schedules = intersections
        .map(intersection => intersection.schedule)
        .filter(schedule => schedule.streetSchedules.length);

    // const schedules: Array<Schedule> = input.intersections
    //     .map(intersection => {
    //         return {
    //             intersection,
    //             streetSchedules: intersection.streets
    //                 .map(street => {
    //                     return ({
    //                         street,
    //                         duration: Math.min(Math.floor(Math.random() * street.cars.length) + 1, input.duration),
    //                     });
    //                 })
    //                 .filter(schedule => schedule.duration > 0)
    //                 .shuffle()
    //         }
    //     })
    //     .filter(intersection => intersection.streetSchedules.length)
    //     .shuffle()


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

    return {schedules, score};
}
