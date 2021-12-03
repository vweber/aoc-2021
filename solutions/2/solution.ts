import { read } from '@lib/read';
import { split } from '@lib/split';
import { multipli } from '@lib/operations';

enum Op {
    FORWARD = 'forward',
    DOWN = 'down',
    UP = 'up',
}

function getCoordinates(log: string[], aimed: boolean): number[] {
    let horizontal = 0;
    let vertical = 0;
    let aim = 0;
    log.forEach(entry => {
        const [operation, amount] = entry.split(" ");
        const parsedAmount = Number(amount);
        switch(operation) {
            case Op.FORWARD:
                horizontal += parsedAmount;
                if (aimed) {
                    vertical += aim * parsedAmount;
                }
                break;
            case Op.DOWN:
                if (aimed) {
                    aim += parsedAmount;
                } else {
                    vertical += parsedAmount;
                }
                break;
            case Op.UP:
                if (aimed) {
                    aim -= parsedAmount;
                } else {
                    vertical -= parsedAmount;
                }
                break
            default:
        }
    });

    return [horizontal, vertical];
}

export const solution2 = async (test: boolean) => {
    const input = split(await read(2, { test }));

    console.log(`2021-02 part one: ${multipli(getCoordinates(input, false))}`); // 1654760
    console.log(`2021-02 part two: ${multipli(getCoordinates(input, true))}`); // 1956047400
}