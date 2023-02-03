export const zeroPad = (n: number, digits = 2) => {
	let str = n.toString();
	while (str.length < digits) {
		str = '0' + str;
	}
	return str;
};

export const mySqlDateFormat = (date: Date = new Date()) => {
	const year: number = date.getFullYear();
	const month: number = date.getMonth() + 1;
	const day: number = date.getDate();
	const hours: number = date.getHours();
	const minutes: number = date.getMinutes();
	const seconds: number = date.getSeconds();
	return `${year}-${zeroPad(month)}-${zeroPad(day)} ${zeroPad(hours)}:${zeroPad(minutes)}:${zeroPad(
		seconds
	)}`;
};
