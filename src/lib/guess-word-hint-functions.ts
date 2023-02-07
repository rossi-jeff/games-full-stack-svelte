import type { stringOrNull } from './types/args-guess-word-hint.type';

export const matchGreen = (word: string, green: stringOrNull[]) => {
	if (noGreen(green)) return true;
	for (let i = 0; i < word.length; i++) {
		if (word[i] && green[i] && word[i] !== green[i]) return false;
	}
	return true;
};

export const matchBrown = (word: string, brown: string[][]) => {
	for (let i = 0; i < word.length; i++) {
		if (word[i] && brown[i] && brown[i].includes(word[i])) return true;
	}
	return false;
};

export const matchGray = (word: string, gray: string[]) => {
	for (let i = 0; i < word.length; i++) {
		if (gray.includes(word[i])) return true;
	}
	return false;
};

export const noGreen = (green: stringOrNull[]) => {
	for (const letter of green) {
		if (letter !== null) return false;
	}
	return true;
};
