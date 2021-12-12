import { read } from '@lib/read';
import { split } from '@lib/split';
import { sum } from '@lib/operations';
import { Coordinate, Matrix, matrix } from '@lib/matrices';

const getFlashes = (m: Matrix<number>): Coordinate[] => {
    let flashed: Coordinate[] = [];

    let foundAll = false;
    while(!foundAll) {
        const newFlashes: Coordinate[] = [];
        m.toArray().forEach((row, y) => {
            row.forEach((energy, x) => {
                if (energy > 9 && !flashed.find(f => f.y === y && f.x === x)) {
                    newFlashes.push({y, x });
                }
            });
        });
        if (newFlashes.length) {
            newFlashes.forEach(coordinate=> {
                m.getAdjecents(coordinate, true).map(
                    adjecent => m.setValue(
                        adjecent,
                        (m.getValue(adjecent) || 0) + 1,
                    ),
                );
            });
            flashed = [...flashed, ...newFlashes];
        } else {
            foundAll = true;
        }
    }
    flashed.forEach(coordinate => m.setValue(coordinate, 0));
    return flashed;
}

const iterate = (m: Matrix<number>): number => {
    let flashes = 0;
    for(let step = 0; step < 100; step++) {
        m.map(x => x + 1);
        flashes += getFlashes(m).length;
    }
    return flashes;
}

const findBigFlash = (m: Matrix<number>): number => {
    let step = 0;
    while(sum(m.toArray().map(sum)) !== 0) {
        m.map(x => x + 1);
        getFlashes(m);
        step++;
    }
    return step;
}

export const solution11 = async (test: boolean) => {
    const input = split(await read(11, { test }));

    const m = input.map(row => row.split('').map(Number));

    console.log(`2021-11 part one: ${iterate(matrix(m))}`); // 1747
    console.log(`2021-11 part two: ${findBigFlash(matrix(m))}`); // 505
}
