import { read } from '@lib/read';
import { split } from '@lib/split';
import { multipli, sum } from '@lib/operations';
import { matrix } from '@lib/matrices';

type BingoCard = {
    hasBingo: () => boolean;
    isScored: () => boolean;
    crossOut: (input: number) => void;
    score: () => number;
}

const CARD_DIMENSION = 5;

const bingoCard = (input: number[][]): BingoCard => {
    const numbers = matrix<number>(input);
    let scored = false;

    const hasBingo = () => {
        let bingoFound = false;
        for(let i = 0; !bingoFound && i < CARD_DIMENSION; i++) {
            bingoFound = bingoFound
                || sum(numbers.getRow(i)) === -CARD_DIMENSION
                || sum(numbers.getColumn(i)) === -CARD_DIMENSION;
        }
        return bingoFound;
    }

    const isScored: () => boolean = () => {
        return scored;
    }

    const crossOut = (input: number) => {
        numbers.replace(input, -1);
    }

    const score = () => {
        numbers.replace(-1, 0);

        let points = 0;
        for(let i = 0; i < CARD_DIMENSION; i++) {
            points += sum(numbers.getRow(i));
        }

        scored = true;
        return points;
    }

    return {
        hasBingo,
        isScored,
        crossOut,
        score,
    };
}


const playBingo = (drawn: number[], input: number[][][]): number[] => {
    const cards = input.map(c => bingoCard(c));
    const scores: number[] = [];

    drawn.forEach(draw => {
        cards.map(c => c.crossOut(draw));
        cards.forEach(c => {
            if (c.hasBingo() && !c.isScored()) {
                scores.push(multipli([draw, c.score()]));
            }
        });
    });

    return scores;
}

const parseInputToBingCard = (input: string[]): {
    drawn: number[],
    cards: number[][][],
} => {
    const drawn = input.shift()
        ?.split(",")
        .filter(v => v)
        .map(v => Number(v)) || [];

    const cardsInput = input.filter(line => line); // remove empty lines

    const cards = [] as number[][][];
    for(let i = 0; i < (cardsInput.length - 1) / CARD_DIMENSION; i++) {
        if (!cards[i]) {
            cards[i] = [];
        }
        for(let j = 0; j < CARD_DIMENSION; j++) {
            if (!cards[i][j]) {
                cards[i][j] = [];
            }
            cardsInput[i * CARD_DIMENSION + j].split(" ").forEach(
                num => {
                    if (num) {
                        cards[i][j].push(Number(num));
                    }
                }
            );
        }
    }

    return {
        drawn,
        cards,
    };
}


export const solution4 = async (test: boolean) => {
    const input = split(await read(4, { test }));

    const { drawn, cards } = parseInputToBingCard(input);

    const scores = playBingo(drawn, cards);

    console.log(`2021-04 part one: ${scores[0]}`); // 65325
    console.log(`2021-04 part two: ${scores[scores.length - 1]}`); // 4624
}
