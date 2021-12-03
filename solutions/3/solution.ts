import { read } from '@lib/read';
import { split } from '@lib/split';
import { multipli } from '@lib/operations';

const getMostCommon = (input: string[]): boolean[] => {
    const totals = [] as number[];
    const middle = input.length / 2;

    input.forEach(line => {
        Array.from(line).forEach((bite, index) => {
            totals[index] = (totals[index] || 0) + Number(bite);
        });
    });

    return totals.map(total => total >= middle);
}

const alphaGammas = (input: string[]): number[] => {
    let alphaBinary = '';
    let gammaBinary = '';

    getMostCommon(input).forEach(
        isCommon => {
            alphaBinary += isCommon ? '1' : '0';
            gammaBinary += isCommon ? '0' : '1';
        }
    );

    return [
        parseInt(alphaBinary, 2),
        parseInt(gammaBinary, 2),
    ];
}

const ratingCalculator = (
    input: string[],
    position: number,
    inverse: boolean,
): string => {
    if (input.length === 1) {
        return input[0];
    }

    const mostCommonPosition = getMostCommon(input)[position];

    return ratingCalculator(
        input.filter(line => {
            return mostCommonPosition !== inverse // xor
                ? line[position] === '1'
                : line[position] === '0';

        }),
        position + 1,
        inverse,
    );
}

const lifeSupport = (input: string[]) => {
    const oxygenDiagnostic = ratingCalculator(input, 0, false);
    const co2ScrubberDiagnostic = ratingCalculator(input, 0, true);
    return [
        parseInt(oxygenDiagnostic, 2),
        parseInt(co2ScrubberDiagnostic, 2),
    ];
}

export const solution3 = async (test: boolean) => {
    const input = split(await read(3, { test }));

    console.log(`2021-03 part one: ${multipli(alphaGammas(input))}`); // 693486
    console.log(`2021-03 part two: ${multipli(lifeSupport(input))}`); // 3379326
}
