import { Car, Output, Schedule, Street } from './io.ts';
import { input } from './setup.ts';


export function scored(output: Omit<Output, 'score'>): Output {
    input.intersections.forEach(intersection => intersection.sim = { green: undefined, schedule: output.schedules.find(s => s.intersection === intersection)!, streetScheduleIndex: 0 });
    input.streets.forEach(street => street.sim = { greenTicks: 0, cars: new Array<Car>() });
    input.cars.forEach(car => car.sim = { pathIndex: 0, streetTicks: car.path[0].duration });

    output.schedules.forEach(schedule => schedule.streetSchedules.forEach(s => console.log(s.street.name + ': ' + s.duration)))
    console.log('')

    let score = 0;
    for (let t = 0; t < input.duration; t++) {
        for (const car of input.cars) {
            if (car.sim!.finished) {
                continue;
            }

            if (car.sim!.streetTicks > 0) {
                car.sim!.streetTicks--;
                continue;
            }

            car.path[car.sim!.pathIndex].sim!.cars.push(car);
            console.log('pushed car');
        }

        for (const intersection of input.intersections) {
            const street = intersection.sim!.green;
            if (street && street.sim!.greenTicks > 0) {
                street.sim!.greenTicks--;

                if (street.sim!.cars.length) {
                    const car = street.sim!.cars.shift()!;
                    car.sim!.pathIndex++;

                    if (car.sim!.pathIndex === car.path.length) {
                        car.sim!.finished = true;
                        score += input.carScore + (input.duration - t);
                        console.log('car ended');
                        continue;
                    }

                    car.sim!.streetTicks = car.path[car.sim!.pathIndex].duration;
                    console.log('car moved');
                }

                continue;
            }

            // console.log(intersection.sim!.schedule.streetSchedules[intersection.sim!.streetScheduleIndex].street.name + ': ' + intersection.sim!.streetScheduleIndex, intersection.sim!.schedule.streetSchedules[intersection.sim!.streetScheduleIndex].street.sim!.greenTicks)

            intersection.sim!.streetScheduleIndex++;
            intersection.sim!.streetScheduleIndex %= intersection.sim!.schedule.streetSchedules.length;
            intersection.sim!.green = intersection.sim!.schedule.streetSchedules[intersection.sim!.streetScheduleIndex].street;
            intersection.sim!.green.sim!.greenTicks = intersection.sim!.green.duration;
            console.log('switched green')
        }
    }

    return {...output, score};
}
