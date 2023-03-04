import { clone } from './clone';
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

export const matchGray = (word: string, gray: string[], green: stringOrNull[]) => {
	const grayCopy = clone(gray);
	for (const letter of green) {
		if (letter === null) continue;
		const idx = grayCopy.indexOf(letter);
		if (idx != -1) grayCopy.splice(idx, 1);
	}
	for (let i = 0; i < word.length; i++) {
		if (grayCopy.includes(word[i])) return true;
	}
	return false;
};

export const noGreen = (green: stringOrNull[]) => {
	for (const letter of green) {
		if (letter !== null) return false;
	}
	return true;
};

export const includeAllBrown = (word: string, brown: string[][]) => {
	let allBrown: string[] = [];
	allBrown = allBrown.concat.apply([], brown);
	allBrown = [...new Set(allBrown)];
	if (!allBrown.length) return true;
	for (const letter of allBrown) {
		if (!word.includes(letter)) return false;
	}
	return true;
};
