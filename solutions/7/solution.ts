import { read } from '@lib/read';
import { split } from '@lib/split';
import { sum } from '@lib/operations';

type FuelCalculator = (toPosition: number) => (crabPosition: number) => number;
const calcConstant: FuelCalculator = toPosition => crabPosition =>
    Math.abs(crabPosition - toPosition);

const calcLiniear: FuelCalculator = toPosition => crabPosition => {
    const distance = Math.abs(crabPosition - toPosition);
    return ((distance + 1) / 2) * distance ;
};

const crabFuel = (crabs: number[], fuelCalculator: FuelCalculator) => {
    const sortedCrab = crabs.sort((a, b) => a - b);

    const totals: number[] = [];
    for(let i = sortedCrab[0]; i <= sortedCrab[sortedCrab.length - 1]; i++) {
        totals.push(sum(crabs.map(fuelCalculator(i))));
    }

    const sortedTotals = totals.sort((a, b) => a - b);
    return sortedTotals[0];
}

export const solution7 = async (test: boolean) => {
    const input = split(await read(7, { test }));

    const crabs = input[0].split(',').map(Number);

    console.log(`2021-07 part one: ${crabFuel(crabs, calcConstant)}`); // 344605
    console.log(`2021-07 part two: ${crabFuel(crabs, calcLiniear)}`); // 93699985
}
