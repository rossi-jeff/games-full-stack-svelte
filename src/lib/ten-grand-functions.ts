import { TenGrandCategory } from './enum/ten-grand-category.enum';
import type { TenGrandOption } from './types/ten-grand-option.type';
import { countDieFaces } from './yacht-functions';

export const scoreOnes = (dice: number[]) => {
	let score = 0;
	let count = 0;
	for (const die of dice) {
		if (die === 1) count++;
	}
	if (count) score = count * 100;
	return score;
};

export const scoreFives = (dice: number[]) => {
	let score = 0;
	let count = 0;
	for (const die of dice) {
		if (die === 5) count++;
	}
	if (count) score = count * 50;
	return score;
};

export const scoreFullHouse = (dice: number[]) => {
	let score = 0;
	if (dice.length < 5) return score;
	const faces: { [key: number]: number } = countDieFaces(dice);
	const values = Object.values(faces);
	if (values.includes(2) && values.includes(3)) score = 1500;
	return score;
};

export const scoreStraight = (dice: number[]) => {
	let score = 0;
	const sorted = JSON.parse(JSON.stringify(dice));
	sorted.sort();
	if (sorted.join(',') === '1,2,3,4,5,6') score = 2000;
	return score;
};

export const scoreThreePair = (dice: number[]) => {
	let score = 0;
	if (dice.length != 6) return score;
	const faces: { [key: number]: number } = countDieFaces(dice);
	const values = Object.values(faces);
	if (values.join(',') === '2,2,2') score = 1500;
	return score;
};

export const scoreDoubleThreeKind = (dice: number[]) => {
	let score = 0;
	if (dice.length != 6) return score;
	const faces: { [key: number]: number } = countDieFaces(dice);
	const values = Object.values(faces);
	if (values.join(',') === '3,3') {
		const keys = Object.keys(faces);
		for (const key of keys) {
			if (key === '1') {
				score += 1000;
			} else {
				score += parseInt(key) * 100;
			}
		}
		score = score * 2;
	}
	return score;
};

export const scoreThreeKind = (dice: number[]) => {
	let score = 0;
	if (dice.length < 3) return score;
	const faces: { [key: number]: number } = countDieFaces(dice);
	const keys = Object.keys(faces);
	for (const key of keys) {
		if (faces[parseInt(key)] === 3) {
			if (key === '1') {
				score = 1000;
			} else {
				score = parseInt(key) * 100;
			}
		}
	}
	return score;
};

export const scoreFourKind = (dice: number[]) => {
	let score = 0;
	if (dice.length < 4) return score;
	const faces: { [key: number]: number } = countDieFaces(dice);
	const keys = Object.keys(faces);
	for (const key of keys) {
		if (faces[parseInt(key)] === 4) {
			if (key === '1') {
				score = 2000;
			} else {
				score = parseInt(key) * 200;
			}
		}
	}
	return score;
};

export const scoreFiveKind = (dice: number[]) => {
	let score = 0;
	if (dice.length < 5) return score;
	const faces: { [key: number]: number } = countDieFaces(dice);
	const keys = Object.keys(faces);
	for (const key of keys) {
		if (faces[parseInt(key)] === 5) {
			if (key === '1') {
				score = 4000;
			} else {
				score = parseInt(key) * 400;
			}
		}
	}
	return score;
};

export const scoreSixKind = (dice: number[]) => {
	let score = 0;
	if (dice.length != 6) return score;
	const faces: { [key: number]: number } = countDieFaces(dice);
	const keys = Object.keys(faces);
	for (const key of keys) {
		if (faces[parseInt(key)] === 6) {
			if (key === '1') {
				score = 8000;
			} else {
				score = parseInt(key) * 800;
			}
		}
	}
	return score;
};

export const getTenGrandOptions = (dice: number[]) => {
	const keys = Object.keys(TenGrandCategory);
	const options: TenGrandOption[] = [];
	for (const key of keys) {
		const option: TenGrandOption = {
			Score: 0
		};
		switch (key) {
			case 'Ones':
				option.Category = TenGrandCategory.Ones;
				option.Score = scoreOnes(dice);
				break;
			case 'Fives':
				option.Category = TenGrandCategory.Fives;
				option.Score = scoreFives(dice);
				break;
			case 'ThreePairs':
				option.Category = TenGrandCategory.ThreePairs;
				option.Score = scoreThreePair(dice);
				break;
			case 'Straight':
				option.Category = TenGrandCategory.Straight;
				option.Score = scoreStraight(dice);
				break;
			case 'FullHouse':
				option.Category = TenGrandCategory.FullHouse;
				option.Score = scoreFullHouse(dice);
				break;
			case 'DoubleThreeKind':
				option.Category = TenGrandCategory.DoubleThreeKind;
				option.Score = scoreDoubleThreeKind(dice);
				break;
			case 'ThreeKind':
				option.Category = TenGrandCategory.ThreeKind;
				option.Score = scoreThreeKind(dice);
				break;
			case 'FourKind':
				option.Category = TenGrandCategory.FourKind;
				option.Score = scoreFourKind(dice);
				break;
			case 'FiveKind':
				option.Category = TenGrandCategory.FiveKind;
				option.Score = scoreFiveKind(dice);
				break;
			case 'SixKind':
				option.Category = TenGrandCategory.SixKind;
				option.Score = scoreSixKind(dice);
				break;
			case 'CrapOut':
				option.Category = TenGrandCategory.CrapOut;
				break;
		}
		if (
			(option.Score !== undefined && option.Score > 0) ||
			option.Category === TenGrandCategory.CrapOut
		)
			options.push(option);
	}
	return options;
};

export const sortByScore = (a: TenGrandOption, b: TenGrandOption) =>
	(b.Score ?? 0) - (a.Score ?? 0);
