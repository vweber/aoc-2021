import { read } from '@lib/read';
import { split } from '@lib/split';

const mapVents = (input: number[][]) => {
    const ventMap: number[][] = [];
    input.forEach(vector => {
        for(let i = 0; i <= vector[4]; i++) {
            const corX = vector[0] + i * vector[2];
            const corY = vector[1] + i * vector[3];
            if (!ventMap[corY]) {
                ventMap[corY] = [];
            }
            ventMap[corY][corX] = (ventMap[corY][corX] || 0)+ 1;
        }
    });

    let total = 0;
    ventMap.forEach(line => line.forEach(point => {
        if (point >= 2) {
            total += 1;
        }
    }))
    return total;
}

const parseInputToVectors = (input: string[], allowDiagonal: boolean): number[][] => {
    const vectors: number[][] = [];
    input.forEach(line => {
        const edges = line.split(' ');
        const [x1, y1] = edges[0].split(',').map(Number);
        const [x2, y2] = edges[2].split(',').map(Number);
        const dX = x2 - x1;
        const dY = y2 - y1;

        const isDiagonal = !!(dX && dY) || dX !== Math.floor(dX) && dY !== Math.floor(dY);
        if (!allowDiagonal && isDiagonal) {
            return;
        }

        const length = (Math.abs(dX) + Math.abs(dY)) / (isDiagonal ? 2 : 1);
        vectors.push([x1, y1, dX / length, dY / length, length]);
    });

    return vectors;
}


export const solution5 = async (test: boolean) => {
    const input = split(await read(5, { test }));

    console.log(`2021-05 part one: ${mapVents(parseInputToVectors(input, false))}`); // 5585
    console.log(`2021-05 part two: ${mapVents(parseInputToVectors(input, true))}`); // 17193
}
