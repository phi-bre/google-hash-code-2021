import {Intersection, Schedule, read, Car, StreetSchedule} from './io.ts';

export const file = 'a.txt';
export const input = read(file);

export const intersections = new Array<Intersection>();

for (let i = 0; i < input.intersectionCount; i++) {
    intersections.push({
        id: i,
        streets: input.streets.filter(street => street.to === i),
    });
}


// for (const car of input.cars) {
//     let score = 0;
//
//     for (const name of car.path) {
//         const street = input.streets.find(street => street.name == name)!;
//         score -= street.duration;
//         street.cars.push({car, score});
//     }
// }
//
// input.streets.each(street => {
//     street.score = street.cars.reduce((score, car) => {
//         score += car.score
//         return score;
//     }, 0);
// });

// console.table({});
