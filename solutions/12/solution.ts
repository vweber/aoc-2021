import { read } from '@lib/read';
import { split } from '@lib/split';

function isUpper(toTest: string) {
    return !/[a-z]/.test(toTest) && /[A-Z]/.test(toTest);
}

type Node = {
    name: string;
    edges: string[];
    isBig: boolean;
    addEdge: (name: string) => void;
};

const node: (name: string, big: boolean) => Node = (name: string, big: boolean) => {
    const isBig = big;
    const edges: string[] = [];

    return {
        name,
        edges,
        isBig,
        addEdge: (name: string) => { edges.push(name) },
    }
}

const graph = () => {
    const nodes: Record<string, Node> = {};

    const addEdge = (a: string, b: string) => {
        if (!nodes[a]) {
            nodes[a] = node(a, isUpper(a));
        }
        if (!nodes[b]) {
            nodes[b] = node(b, isUpper(b));
        }
        nodes[a].addEdge(b);
        nodes[b].addEdge(a);
    }

    const findAllPaths = (start: string, end: string, path: string[]): string[][] => {
        if (!nodes[start].isBig && path.includes(start)) {
            return [];
        }

        if (start === end) {
            return [[...path, end]];
        }

        let paths: string[][] = [];
        nodes[start].edges.forEach(next => {
            paths = paths.concat(findAllPaths(next, end, [...path, start]));
        });

        return paths;
    }

    const findAllPathsWithMoreTime = (
        start: string,
        end: string,
        path: string[],
        iHaveTime: boolean,
    ): string[][] => {
        if (
            start === 'start' && path.includes('start') ||
            (
                !iHaveTime &&
                !nodes[start].isBig &&
                path.includes(start)
            )
        ) {
            return [];
        }

        if (start === end) {
            return [[...path, end]];
        }

        let paths: string[][] = [];
        nodes[start].edges.forEach(next => {
            paths = paths.concat(
                findAllPathsWithMoreTime(
                    next,
                    end,
                    [...path, start],
                    iHaveTime && (nodes[start].isBig || !path.includes(start)),
                ),
            );
        });

        return paths;
    }

    return {
        addEdge,
        findAllPaths,
        findAllPathsWithMoreTime,
    }
}

export const solution12 = async (test: boolean) => {
    const input = split(await read(12, { test }));

    const g = graph();
    input.forEach(line => {
        const [a, b] = line.split('-');
        g.addEdge(a,b);
    });

    console.log(`2021-11 part one: ${g.findAllPaths('start', 'end', []).length}`); // 4338
    console.log(`2021-11 part two: ${g.findAllPathsWithMoreTime('start', 'end', [], true).length}`); // 114189
}
