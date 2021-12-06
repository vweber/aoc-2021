type Matrix<T> = {
    setValue(x: number, y: number, value: T): void;
    getValue(x: number, y: number): T;
    getRow(y: number): T[];
    getColumn(x: number): T[];
    replace: (old: T, replacement: T) => void;
    transpose: () => Matrix<T>;
    print: () => void;
}

export const matrix: <T>(input: T[][]) => Matrix<T> = <T>(input: T[][]) => {
    let values = input;

    const setValue = (x: number, y: number, value: T): void => {
        values[x][y] = value;
    }

    const getValue = (x: number, y: number) => {
        if (y < values.length && x < values[y].length) {
            return values[y][x];
        }
        throw Error('Invalid coordinate');
    }

    const getRow: (y: number) => T[] = y => values[y];

    const getColumn: (x: number) => T[] = x => values.map(y => y[x]);

    const replace: (old: T, replacement: T) => void = (old, replacement) => {
        for(let i = 0; i < values.length; i++) {
            for(let j = 0; j < (values[0] || []).length; j++) {
                if (values[i][j] === old) {
                    values[i][j] = replacement;
                }
            }
        }
    }

    const transpose: () => Matrix<T> = () => {
        const transposedValues: T[][] = [];
        values.forEach(
            (line, y) => line.forEach(
                (value, x) => transposedValues[x][y] = value,
            ),
        );
        return matrix(transposedValues);
    }

    const print: () => void = () => {
        values.forEach(row => console.log(row.join(" ")));
    }

    return {
        setValue,
        getValue,
        getRow,
        getColumn,
        replace,
        transpose,
        print,
    };
}
