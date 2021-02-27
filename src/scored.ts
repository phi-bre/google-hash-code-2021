import { Car, Output } from './io.ts';
import { input } from './main.ts';

export function scored(output: Omit<Output, 'score'>): Output {
    output.schedules.forEach(schedule => schedule.sim = { streetScheduleIndex: 0, streetScheduleTicks: 0 });
    input.streets.forEach(street => street.sim = { greenTicks: 0, cars: new Array<Car>() });
    input.cars.forEach(car => car.sim = { pathIndex: 0, streetTicks: car.path[0].duration });

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

            // if (car.sim!.pathIndex >= car.path.length) {
            //     car.sim!.finished = true;
            //     score += input.carScore + (input.duration - t);
            //     continue;
            // }

            car.path[car.sim!.pathIndex].sim!.cars.push(car);
        }

        for (const schedule of output.schedules) {
            if (schedule.sim!.streetScheduleTicks > 0) {
                schedule.sim!.streetScheduleTicks--;
                const { street } = schedule.streetSchedules[schedule.sim!.streetScheduleIndex];

                if (street.sim!.cars.length) {
                    const car = street.sim!.cars.shift()!;
                    if (car.sim!.pathIndex === (car.path.length - 1)) {
                        car.sim!.finished = true;
                        score += input.carScore + (input.duration - t);
                        continue;
                    }
                    car.sim!.pathIndex++;
                    car.sim!.streetTicks = car.path[car.sim!.pathIndex].duration;
                }

                continue;
            }


            schedule.sim!.streetScheduleIndex = (schedule.sim!.streetScheduleIndex + 1) % schedule.streetSchedules.length;
            schedule.sim!.streetScheduleTicks = schedule.streetSchedules[schedule.sim!.streetScheduleIndex].duration;
        }
    }

    return {...output, score};
}
