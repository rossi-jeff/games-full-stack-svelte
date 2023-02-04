import { connection } from "$lib/connection";
import HangMan from "$lib/models/hang-man";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ request }) => {
    const id = parseInt(String(request.url.split('/').pop()));
    HangMan.knex(connection)
    const hangMan = await HangMan.query().findById(id)
    return json(hangMan)
}