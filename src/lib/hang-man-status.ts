import { GameStatus } from './enum/game-status.enum';

const parts: string[] = ['head', 'body', 'left-arm', 'right-arm', 'left-leg', 'right-leg'];

const allIncluded = (word: string[], correct: string[]) => {
	const missed = word.filter((l) => !correct.includes(l));
	return missed.length === 0 ? true : false;
};

export const hangManStatus = (word: string, correct: string[], wrong: string[]) => {
	const letters: string[] = [...new Set(word.split('').filter((l) => l.length === 1))];
	correct = [...new Set(correct)];
	wrong = [...new Set(wrong)];
	if (allIncluded(letters, correct)) return GameStatus.Won;
	if (wrong.length >= parts.length) return GameStatus.Lost;
	return GameStatus.Playing;
};

export const hangManScore = (word: string, correct: string[], wrong: string[]) => {
	const Status = hangManStatus(word, correct, wrong);
	let Score = 0;
	if (Status === GameStatus.Playing) return Score;
	const letters: string[] = [...new Set(word.split('').filter((l) => l.length === 1))];
	correct = [...new Set(correct)];
	wrong = [...new Set(wrong)];
	const perLetter = 10,
		perCorrect = 5;
	Score = Status === GameStatus.Won ? letters.length * perLetter : 0;
	Score += correct.length * perCorrect;
	Score -= wrong.length * perLetter;
	return Score;
};
