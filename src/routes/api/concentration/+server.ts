import { decodeAuthHeader } from '../../../lib/decode-auth-header';
import Concentration from '../../../lib/models/concentration';
import { json, type RequestHandler } from '@sveltejs/kit';
import { connection } from '$lib/connection';

export const POST: RequestHandler = async ({ request }) => {
    Concentration.knex(connection)
    const { UserId } = decodeAuthHeader(request.headers);
    const concentration = await Concentration.query().insert({
        UserId: UserId ?? undefined,
    })
    return json(concentration)
}
