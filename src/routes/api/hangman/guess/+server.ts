import { connection } from "$lib/connection";
import { hangManStatus } from "$lib/hang-man-status";
import HangMan from "$lib/models/hang-man";
import type { ArgsHangManGuess } from "$lib/types/args-hang-man-guess.type";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
    const data: ArgsHangManGuess = await request.json()
    if (!data || !data.Word || !data.Letter || !data.Id)
        throw error(400, 'Bad Request');
    const { Id, Word, Letter } = data
    HangMan.knex(connection)
    const result = await HangMan.query().findById(Id)
    if (!result) throw error(404, 'Hang Man not Found')
    const { Correct, Wrong } = result
    let Found = false
    const correct: string[] = Correct.split(',').filter(l => l.length > 0)
    const wrong: string[] = Wrong.split(',').filter(l => l.length > 0)
    if (Word.includes(Letter)) {
        correct.push(Letter)
        Found = true
    } else {
        wrong.push(Letter)
    }
    const Status = hangManStatus(Word, correct, wrong)
    await HangMan.query().findById(Id).patch({
        Correct: [...new Set(correct)].join(','),
        Wrong: [...new Set(wrong)].join(','),
        Status
    })
    return json({ Letter, Found })
}