import { connection } from "$lib/connection";
import User from "$lib/models/user";
import type { ArgsUserCredential } from "$lib/types/args-user-credential.type";
import { error, json, type RequestHandler } from "@sveltejs/kit";
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken'

const secret = 'S3cr3t!!'

export const POST: RequestHandler = async ({ request }) => {
    const data: ArgsUserCredential = await request.json();
    if (!data || !data.UserName || !data.PassWord) throw error(400, 'Bad Request');
    const { UserName, PassWord } = data;
    User.knex(connection);
    const user = await User.query().findOne({ UserName })
    if (!user) throw error(401, 'Unauthorized')
    const valid = await bcrypt.compare(PassWord, user.HashedPassWord)
    if (valid) {
        const Token = jwt.sign({ UserId: user.Id, UserName }, secret, {
            expiresIn: '1h',
        })
        return json({ UserName, Token })
    } else {
        throw error(401, 'Unauthorized')
    }

}