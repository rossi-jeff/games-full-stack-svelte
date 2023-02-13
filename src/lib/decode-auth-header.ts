import * as jwt from 'jsonwebtoken';
import { SECRET_JWT_SECRET } from '$env/static/private';

const secret = SECRET_JWT_SECRET ?? 'S3cr3t!!';

interface UserPayload {
	UserId?: number;
	UserName?: string;
}

export const decodeAuthHeader = (headers: Headers) => {
	const header = headers.get('Authorization')
	const results: UserPayload = {};
	if (header && header.length) {
		try {
			const token = header.split(' ')[1];
			const decoded = jwt.verify(token, secret);
			if (typeof decoded === 'object') {
				const { UserId, UserName } = decoded;
				results.UserId = UserId;
				results.UserName = UserName;
			}
		} catch (error) {
			console.log(error);
		}
	}
	return results;
};
