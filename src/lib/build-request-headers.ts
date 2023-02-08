import { get } from 'svelte/store';
import { userSession, type UserSessionData } from './user-session.writable';

const session: UserSessionData = get(userSession);

export const buildRequestHeaders = () => {
	const headers: { [key: string]: string } = {
		'Content-Type': 'application/json',
		Accept: 'application/json'
	};
	if (session.Token && session.Token.length) {
		headers.Authorization = `Bearer ${session.Token}`;
	}
	return headers;
};
