import { json, type RequestHandler } from '@sveltejs/kit';
import { decodeAuthHeader } from '../../../lib/decode-auth-header';
import Klondike from '../../../lib/models/klondike'
import { connection } from '../../../lib/connection';

export const POST: RequestHandler = async ({ request }) => {
    const { UserId } = decodeAuthHeader(request.headers);
    Klondike.knex(connection)
    const klondike = await Klondike.query().insert({
        UserId: UserId ?? undefined,
    })
    return json(klondike)
}