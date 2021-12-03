import { read } from '../../lib/read';
import { split } from '../../lib/split';

const countIncreases = (inputList: number[]): number => {
    return inputList.reduce(
        (count, measurement, index) => {
            if (index === inputList.length - 1) {
                return count;
            }
            return measurement < inputList[index + 1]
                ? count + 1
                : count;
        },
        0,
    );
}

const threeAveraged = (inputList: number[]): number[] => {
    return inputList.reduce(
        (list, measurement, index) => {
            if (index >= inputList.length - 2) {
                return list;
            }
            return [
                ...list,
                measurement +
                inputList[index + 1] +
                inputList[index + 2]
            ];
        },
        [] as number[],
    );
}

export const solution1 = async (test: boolean) => {
    const input = split(await read(1, { test }))
        .map(Number);

    console.log(`2021-01 part one: ${countIncreases(input)}`); // 1529
    console.log(`2021-01 part two: ${countIncreases(threeAveraged(input))}`); // 1567
}
