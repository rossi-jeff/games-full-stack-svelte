import { error, json, type RequestHandler } from '@sveltejs/kit';
import { connection } from '../../../../lib/connection';
import User from '../../../../lib/models/user';
import type { ArgsUserCredential } from '../../../../lib/types/args-user-credential.type';
import bcrypt from 'bcrypt';

export const POST: RequestHandler = async ({ request }) => {
	const data: ArgsUserCredential = await request.json();
	if (!data || !data.UserName || !data.PassWord) throw error(400, 'Bad Request');
	const { UserName, PassWord } = data;
	const HashedPassWord = await bcrypt.hash(PassWord, 10);
	User.knex(connection);
	const user = await User.query().insert({
		UserName,
		HashedPassWord
	});
	return json(user);
};
