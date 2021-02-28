import { Car, Output } from './io.ts';
import { input } from './main.ts';

export function scored(output: Omit<Output, 'score'>): Output {
    output.schedules.forEach(schedule => schedule.sim = { streetScheduleIndex: 0, streetScheduleTicks: schedule.streetSchedules[0].duration });
    input.streets.forEach(street => street.sim = { cars: new Array<Car>() });
    input.cars.forEach(car => car.sim = { routeIndex: 0, streetDuration: 0 });
    const cars = new Set(input.cars);

    let score = 0;
    for (let time = 0; time <= input.duration; time++) {
        for (const car of cars) {
            if (car.sim!.streetDuration > 0) {
                car.sim!.streetDuration--;
            }
            if (car.sim!.streetDuration === 0) {
                if (car.sim!.routeIndex === (car.route.length - 1)) {
                    cars.delete(car);
                    score += input.carScore + (input.duration - time);
                    continue;
                }

                const street = car.route[car.sim!.routeIndex];
                if (!street.sim!.cars.includes(car)) {
                    street.sim!.cars.push(car);
                }
            }
        }

        for (const schedule of output.schedules) {
            if (schedule.sim!.streetScheduleTicks > 0) {
                schedule.sim!.streetScheduleTicks--;
                const { street } = schedule.streetSchedules[schedule.sim!.streetScheduleIndex];
                const car = street.sim!.cars.shift();
                if (car) {
                    car.sim!.routeIndex++;
                    car.sim!.streetDuration = car.route[car.sim!.routeIndex].duration;
                }
            }
            if (schedule.sim!.streetScheduleTicks === 0) {
                schedule.sim!.streetScheduleIndex = (schedule.sim!.streetScheduleIndex + 1) % schedule.streetSchedules.length;
                schedule.sim!.streetScheduleTicks = schedule.streetSchedules[schedule.sim!.streetScheduleIndex].duration;
            }
        }
    }

    return {...output, score};
}
