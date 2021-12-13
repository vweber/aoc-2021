export type Coordinate = { y: number, x: number };

export type CoordinateValuesList<T> = {coordinate: Coordinate, value: T}[];

export type Matrix<T> = {
    setValue(c: Coordinate, value: T): void;
    getValue(c: Coordinate): T;
    getRow(y: number): T[];
    getColumn(x: number): T[];
    getCoordinatedValues: () => CoordinateValuesList<T>;
    replace: (old: T, replacement: T) => void;
    map: (func: (t: T) => T) => void;
    getAdjecents: (c: Coordinate, diagonals: boolean) => Coordinate[];
    transpose: () => Matrix<T>;
    print: () => void;
    toArray: () => T[][];
}

export const matrix: <T>(input: T[][]) => Matrix<T> = <T>(input: T[][]) => {
    let values = input.map(row => [...row]);

    const setValue = ({ y, x }: Coordinate, value: T): void => {
        if (!values[y]) {
            values[y] = [];
        }
        values[y][x] = value;
    }

    const getValue = ({ y, x }: Coordinate) => {
        return values[y][x];
    }

    const getRow: (y: number) => T[] = y => values[y];

    const getColumn: (x: number) => T[] = x => values.map(y => y[x]);

    const getCoordinatedValues: () => CoordinateValuesList<T> = () => {
        const list: CoordinateValuesList<T> = [];
        for(let y = 0; y < values.length; y++) {
            for(let x = 0; x < (values[y] || []).length; x++) {
                list.push({ coordinate: {y, x}, value: getValue({y, x})})
            }
        }

        return list;
    }

    const replace: (old: T, replacement: T) => void = (old, replacement) => {
        getCoordinatedValues().forEach(({coordinate, value}) => {
            if (value === old) {
                setValue(coordinate, replacement)
            }
        });
    }

    const map: (func: (t: T) => T) => void = func => {
        getCoordinatedValues().forEach(({coordinate, value}) => {
            value && setValue(coordinate, func(value));
        });
    }

    const getAdjecents: ({y, x}: Coordinate, diagonals: boolean) => Coordinate[] = ({y, x}, diagonals) => {
        const adjecents: Coordinate[] = [];
        if (y > 0) {
            adjecents.push({ y: y - 1 , x});
        }
        if (y < values.length - 1) {
            adjecents.push({ y: y + 1, x});
        }
        if (x > 0) {
            adjecents.push({ y, x: x - 1});
        }
        if (x < values[y].length - 1) {
            adjecents.push({ y, x: x +1 });
        }
        if (diagonals) {
            if (y > 0 && x > 0) {
                adjecents.push({ y: y - 1 , x: x - 1});
            }
            if (y < values.length - 1 && x < values[y].length - 1) {
                adjecents.push({ y: y + 1, x: x + 1 });
            }
            if (y < values.length - 1 && x > 0) {
                adjecents.push({ y: y + 1, x: x - 1});
            }
            if (y > 0 && x < values[y].length - 1) {
                adjecents.push({ y: y - 1, x: x +1 });
            }
        }
        return adjecents;
    }

    const transpose: () => Matrix<T> = () => {
        const transposed: Matrix<T> = matrix([]);
        getCoordinatedValues().forEach(({ coordinate: { x, y }, value }) => {
            transposed.setValue({ y: x, x: y}, value);
        });
        return transposed;
    }

    const print: () => void = () => {
        values.forEach(row => console.log(row.join("")));
    }

    const toArray: () => T[][] = () => values;

    return {
        setValue,
        getValue,
        getRow,
        getColumn,
        getCoordinatedValues,
        replace,
        map,
        getAdjecents,
        transpose,
        print,
        toArray,
    };
}
