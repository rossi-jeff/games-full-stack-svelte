import { decodeAuthHeader } from '../../../lib/decode-auth-header';
import Concentration from '../../../lib/models/concentration';
import { json, type RequestHandler } from '@sveltejs/kit';
import { connection } from '$lib/connection';
import { defaultLimit, defaultOffset } from '$lib/constants';
import { GameStatus } from '$lib/enum/game-status.enum';
import User from '$lib/models/user';

Concentration.knex(connection)

export const GET: RequestHandler = async ({ url }) => {
    const Limit = url.searchParams.get('Limit');
    const Offset = url.searchParams.get('Offset');
    const limit = Limit ? parseInt(Limit) : defaultLimit;
    const offset = Offset ? parseInt(Offset) : defaultOffset;
    const Items = await Concentration.query()
        .whereNot('Status', GameStatus.Playing)
        .orderBy('Status', 'DESC')
        .orderBy('Elapsed', 'ASC')
        .limit(limit)
        .offset(offset);
    const countResult = await Concentration.query()
        .whereNot('Status', GameStatus.Playing)
        .count('* as count');
    const Count: number = countResult[0].count ?? 0;
    if (Items && Items.length) {
        User.knex(connection);
        for (const item of Items) {
            item.user = item.UserId ? await User.query().findById(item.UserId) : null;
        }
    }
    return json({ Items, Count, Limit: limit, Offset: offset });
}

export const POST: RequestHandler = async ({ request }) => {
    const { UserId } = decodeAuthHeader(request.headers);
    const concentration = await Concentration.query().insert({
        UserId: UserId ?? undefined,
    })
    return json(concentration)
}
