import { zeroPad } from './mysql-date-format';

export const displayElapsed = (allSeconds: number) => {
	const seconds = allSeconds % 60;
	const minutes = Math.floor(allSeconds / 60);
	return minutes > 0 ? `${minutes}:${zeroPad(seconds)}` : seconds;
};
