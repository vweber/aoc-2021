import { Coordinate, Matrix, matrix } from '@lib/matrices';
import { sum } from '@lib/operations';
import { read } from '@lib/read';
import { split } from '@lib/split';

const fold = (m: Matrix<number>, foldLine: number): Matrix<number> => {
    const folded = matrix<number>([]);
    m.getCoordinatedValues().forEach(({ coordinate: { x, y }, value }) => {
        if (y > foldLine) {
            if (value) {
                folded.setValue({x, y: 2 * foldLine - y}, value);
            }
        } else {
            folded.setValue({x,y}, value);
        }
    });
    return folded;
}

const processInput = (input: string[], maxFolds: number = 99): Matrix<number> => {
    let m = matrix<number>([]);
    let folds = 0;
    input.forEach(line => {
        const cs = line.split(',');
        if (cs.length === 2) {
            if (!m.getRow(Number(cs[1]))) {

            }
            m.setValue({y: Number(cs[1]), x: Number(cs[0]) }, 1)
        }

        const foldY = line.split('fold along y=');
        if (foldY.length === 2 && folds < maxFolds) {
            m = fold(m, Number(foldY[1]));
            folds++;
        }

        const foldX = line.split('fold along x=');
        if (foldX.length === 2 && folds < maxFolds) {
            m = m.transpose();
            m = fold(m, Number(foldX[1]));
            m = m.transpose();
            folds++;
        }
    });
    return m;
}

export const solution13 = async (test: boolean) => {
    const input = split(await read(13, { test }));

    const answer1 = processInput(input, 1);
    answer1.replace(undefined as any, 0);

    console.log(`2021-13 part one: ${sum(answer1.toArray().map(sum))}`); // 708

    const answer2 = processInput(input);
    answer2.replace(undefined as any, '.' as any);
    answer2.replace(1, '#' as any);
    console.log(`2021-13 part two:`); // EBLUBRFH
    answer2.print();
}
