import type { UserSessionData } from './user-session.writable';

export const buildRequestHeaders = (session: UserSessionData) => {
	const headers: Headers = new Headers();
	headers.append('Content-Type', 'application/json');
	headers.append('Accept', 'application/json');
	if (session.Token) {
		headers.append('Authorization', `Bearer ${session.Token}`);
	}
	return headers;
};
