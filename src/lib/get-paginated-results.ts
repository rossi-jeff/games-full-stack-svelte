import { railsRoot } from './constants';

export const getPaginatedResults = async (
	path: string,
	params: { [key: string]: number } = {},
	rails = false
) => {
	try {
		const baseUrl = rails ? railsRoot : window.location.origin;
		const url = new URL(path, baseUrl);
		for (const key in params) {
			url.searchParams.append(key, params[key].toString());
		}
		const result = await fetch(url);
		if (result.ok) {
			return await result.json();
		}
	} catch (error) {
		console.log(error);
	}
};
