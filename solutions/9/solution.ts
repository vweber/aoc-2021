import { read } from '@lib/read';
import { split } from '@lib/split';
import { multipli, sum } from '@lib/operations';
import { Coordinate, Matrix, matrix } from '@lib/matrices';

const isLowPoint = (heightMap: number[][], basin: Matrix<number>, {y, x}: Coordinate): boolean => {
    const current = heightMap[y][x];

    if (current === 9) {
        return false;
    }

    let lowest = true;
    basin.getAdjecents({y, x}, false)
        .filter((c) => !basin.getValue(c))
        .forEach(c => {
            lowest = lowest && current <= heightMap[c.y][c.x];
        });
    return lowest;
}

const getLowPoints = (heightMap: number[][]): Coordinate[] => {
    const lowPoints: Coordinate[] = [];
    const emptyBasin = matrix<number>(heightMap.map(row => row.map(_ => 0)));

    heightMap.forEach((row, y) => {
        row.forEach((_, x) => {
            if (isLowPoint(heightMap, emptyBasin, { y, x })) {
                lowPoints.push({y, x});
            }
        })
    });
    return lowPoints;
}

const calc = (heightMap: number[][], basin: Matrix<number>, { y, x }: Coordinate): Matrix<number> => {
    let next: Coordinate = {y: y - 1, x};
    if (
        y > 0 &&
        !basin.getValue(next) &&
        isLowPoint(heightMap, basin, next)
    ) {
        basin.setValue(next, 1);
        calc(heightMap, basin, next);
    }

    next = {y: y + 1, x};
    if (
        y < heightMap.length - 1 &&
        !basin.getValue(next) &&
        isLowPoint(heightMap, basin, next)

    ) {
        basin.setValue(next, 1);
        calc(heightMap, basin, next);
    }

    next = {y, x: x - 1};
    if (
        x > 0 &&
        !basin.getValue(next) &&
        isLowPoint(heightMap, basin, next)
    ) {
        basin.setValue(next, 1);
        calc(heightMap, basin, next);
    }

    next = {y, x: x + 1};
    if (
        x < heightMap[y].length - 1 &&
        !basin.getValue(next) &&
        isLowPoint(heightMap, basin, next)
    ) {
        basin.setValue(next, 1);
        calc(heightMap, basin, next);
    }

    return basin;
}

const getBasins = (heightMap: number[][], lowPoints: Coordinate[]): Matrix<number>[] => {
    const basins: Matrix<number>[] = [];

    lowPoints.forEach(c => {
        const basin = matrix<number>(heightMap.map(row => row.map(_ => 0)));
        basin.setValue(c, 1);
        basins.push(calc(heightMap, basin, c));
    });

    return basins;
}

export const solution9 = async (test: boolean) => {
    const input = split(await read(9, { test }));

    const heightMap = input.map(row => row.split('').map(Number));
    const lowPoints = getLowPoints(heightMap);

    const sums = getBasins(heightMap, lowPoints)
        .map(b => sum(b.toArray().map(sum)))
        .sort((a, b) => b - a);

    console.log(`2021-09 part one: ${sum(lowPoints.map(({y, x}) => heightMap[y][x] + 1))}`); // 528
    console.log(`2021-09 part two: ${multipli([sums[0], sums[1], sums[2]])}`); // 920448
}
