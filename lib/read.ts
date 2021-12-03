import { promises } from 'fs';
import path from 'path';

export const read = (day: number, { test }: { test: boolean }): Promise<string> => {
    return promises.readFile(
        path.normalize(__dirname + `/../solutions/${day}/input${test ? '.test' : ''}.txt`),
        {
            encoding: 'utf-8',
        }
    );
}
