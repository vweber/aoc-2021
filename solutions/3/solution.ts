import { read } from '../../lib/read';
import { split } from '../../lib/split';
import { multipli } from '../../lib/operations';

const getMostCommonOnes = (input: string[]): boolean[] => {
    const totals = [] as number[];
    input.forEach(entry => {
        Array.from(entry).forEach((letter, index) => {
            totals[index] = (totals[index] || 0) + Number(letter);
        });
    });
    return totals.map(total => (total < (input.length / 2)));
}

const alphaGammas = (input: string[]): number[] => {
    const mostCommonOnes = getMostCommonOnes(input);

    const alphaBinary = mostCommonOnes
        .map(isMostCommon => isMostCommon ? '0' : '1')
        .join('');
    const alpha = parseInt(alphaBinary, 2);

    const gammaBinary = mostCommonOnes
        .map(isMostCommon => isMostCommon ? '1' : '0')
        .join('');
    const gamma = parseInt(gammaBinary, 2);

    return [alpha, gamma];
}

type Filter = (filterSetting: boolean) =>  (entry: string) => boolean;

const createOxygenFilter: Filter = filterSetting => entry =>
    filterSetting ? entry === '0' : entry === '1';

const createCo2Scrubber: Filter = filterSetting => entry =>
    filterSetting ? entry === '1' : entry === '0';

const ratingCalculator = (
    input: string[],
    position: number,
    createFilter: Filter,
): string[] => {
    if (input.length <= 1) {
        return input;
    }
    if (position > input[0].length) {
        throw Error('mayday mayday');
    }

    const mostCommonOnes = getMostCommonOnes(input);
    const filter = createFilter(mostCommonOnes[position])
    const filteredInput = input.filter(
        entry => filter(entry[position]),
    );

    return ratingCalculator(filteredInput, position + 1, createFilter);
}

const verifyLifeSupport = (input: string[]) => {
    const oxygenDiagnostic = ratingCalculator(input, 0, createOxygenFilter)
        .pop()!;
    const oxygenRating = parseInt(oxygenDiagnostic, 2);

    const co2ScrubberDiagnostic = ratingCalculator(input, 0, createCo2Scrubber)
        .pop()!;
    const co2ScubberRating = parseInt(co2ScrubberDiagnostic, 2);

    return [oxygenRating, co2ScubberRating];
}

export const solution3 = async (test: boolean) => {
    const input = split(await read(3, { test }));

    console.log(`2021-03 part one: ${multipli(alphaGammas(input))}`); // 693486
    console.log(`2021-03 part two: ${multipli(verifyLifeSupport(input))}`); // 3379326
}
