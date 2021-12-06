import { read } from '@lib/read';
import { split } from '@lib/split';

const fishModel = (input: number[], days: number): number => {
    let total = input.length;
    const spawnPool: number[] = [0,0,0,0,0,0,0];

    input.forEach(num => spawnPool[num] += 1);
    let addInTwoDays = 0;
    let addInOneDay = 0;

    for(let i = 0; i < days; i++) {
        const day = i % 7;

        total += spawnPool[day];

        const addToPool = addInOneDay;
        addInOneDay = addInTwoDays;
        addInTwoDays = spawnPool[day];
        spawnPool[day] += addToPool;
    }

    return total;
}

export const solution6 = async (test: boolean) => {
    const input = split(await read(6, { test }));

    const fish = input[0].split(',').map(Number);



    console.log(`2021-06 part one: ${fishModel(fish, 80)}`); // 362639
    console.log(`2021-06 part two: ${fishModel(fish, 256)}`); // 1639854996917
}
