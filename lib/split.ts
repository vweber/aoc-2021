const NEWLINE = /\r?\n/;
export const split = (input: string): string[] => {
	return input.split(NEWLINE);
};
