import { sum } from '@lib/operations';
import { read } from '@lib/read';
import { split } from '@lib/split';

type ParseResult = { toParse: string[], incomplete: string[] }

const parseTag = (closingTag: string, { toParse, incomplete }: ParseResult): ParseResult => {
    const [nextChar, ...rest] = toParse;
    if (nextChar === closingTag) {
        return { toParse: rest, incomplete };
    }

    const { toParse: newToParse, incomplete: newIncomplete } = next({ toParse, incomplete });
    const [newNextChar, ...newAfterTag] = newToParse;

    if (newNextChar === closingTag) {
        return { toParse: newAfterTag, incomplete };
    }

    if (newAfterTag.length === 0) {
        return { toParse: [], incomplete: [...newIncomplete, closingTag]};
    }

    throw new Error(newNextChar);
}

const next = ({ toParse, incomplete }: ParseResult): ParseResult => {
    if (toParse.length === 0) {
        return { toParse: [], incomplete };
    }

    let [nextChar, ...rest] = toParse;
    switch(nextChar) {
        case '(':
            const a = parseTag(')', { toParse: rest, incomplete });
            return next({ toParse: a.toParse, incomplete: a.incomplete });
        case '[':
            const b = parseTag(']', { toParse: rest, incomplete} );
            return next({ toParse: b.toParse, incomplete: b.incomplete });
        case '{':
            const c = parseTag('}', { toParse: rest, incomplete });
            return next({ toParse: c.toParse, incomplete: c.incomplete });
        case '<':
            const d = parseTag('>', { toParse: rest, incomplete });
            return next({ toParse: d.toParse, incomplete: d.incomplete });
        default:
            return { toParse, incomplete };
    }
}

const syntaxPoints = (input: string) => {
    switch(input) {
        case ')': return 3;
        case ']': return 57;
        case '}': return 1197;
        case '>': return 25137;
        default: return 0;
    }
}

const autoCompletePoints = (input: string) => {
    switch(input) {
        case ')': return 1;
        case ']': return 2;
        case '}': return 3;
        case '>': return 4;
        default: return 0;
    }
}

const autoCompleteScore = (input: string[][]): number => {
    const sorted = input
        .map(toScore => {
            let total = 0;
            toScore.forEach(i => {
                total *= 5;
                total += autoCompletePoints(i);
            })
            return total;
        })
        .sort((a, b) => a - b);
    return sorted[(input.length - 1) / 2];
}


export const solution10 = async (test: boolean) => {
    const input = split(await read(10, { test }));

    const syntaxErrors: string[] = [];
    const incompletes: string[][] = [];

    input.forEach(line => {
        try {
            const parseResult = next({ toParse: line.split(''), incomplete: []});
            incompletes.push(parseResult.incomplete);
        } catch (e: any) {
            syntaxErrors.push(e.message);
        }
    });

    console.log(`2021-10 part one: ${sum(syntaxErrors.map(syntaxPoints))}`); // 216297
    console.log(`2021-10 part two: ${autoCompleteScore(incompletes)}`); // 2165057169
}
