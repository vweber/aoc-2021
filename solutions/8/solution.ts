import { read } from '@lib/read';
import { split } from '@lib/split';
import { sum } from '@lib/operations';

const parseSignal = (signal: string) => signal.split('').sort((a,b) => a < b ? -1 : 1).join('');

const answer1 = (input: string[]) => {
    return input
        .map(line => line.split(' | ')[1]
            .split(' ')
            .map(digit => digit.length)
            .filter(length => length === 2 || length === 3 || length === 4 ||  length === 7)
        )
        .map( l => l.length);
};

const answer2 = (input: string[]) => {
    return input.map(line => {
        const result: string[] = [];

        const [rawSignals, digits] = line.split(' | ');
        let signals = rawSignals.split(' ')
            .map(parseSignal)
            .sort((a, b) => a.length - b.length);

        result[1] = signals.shift() || ''; // length 2
        result[7] = signals.shift() || ''; // length 3
        result[4] = signals.shift() || ''; // length 4
        result[8] = signals.pop() || ''; // length 8

        const includesAll = (a: string, b: string) => b.split('').every(l => a.includes(l));

        signals = signals.sort((a, b) => b.length - a.length);
        signals.forEach(s => {
            if (s.length === 6) {
                if(!includesAll(s, result[1])) {
                    result[6] = s;
                } else if (!includesAll(s, result[4])) {
                    result[0] = s;
                } else {
                    result[9] = s;
                }
            }
            if (s.length === 5) {
                if (includesAll(result[6], s)) {
                    result[5] = s;
                } else if (includesAll(s, result[1])) {
                    result[3] = s;
                } else {
                    result[2] = s;
                }
            }
        });

        return Number(digits.split(' ')
            .map(parseSignal)
            .map(d => result.findIndex(x => x === d)).join(''));
    });

}

export const solution8 = async (test: boolean) => {
    const input = split(await read(8, { test }));

    console.log(`2021-08 part one: ${sum(answer1(input))}`); // 445
    console.log(`2021-08 part two: ${sum(answer2(input))}`); // 1043101
}
