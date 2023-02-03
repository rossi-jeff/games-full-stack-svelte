import { Model } from 'objection';
import { mySqlDateFormat } from '../mysql-date-format';
import GuessWordGuessRating from './guess-word-guess-rating';

class GuessWordGuess extends Model {
	[x: string]: any; // eslint-disable-line
	GuessWordId!: number;
	Guess!: string;
	CreatedAt!: string;
	UpdatedAt!: string;

	static tableName = 'GuessWordGuess';

	static idColumn = 'Id';

	static jsonSchema = {
		type: 'object',
		properties: {
			Id: { type: 'integer' },
			GuessWordId: { type: 'integer' },
			Guess: { type: 'string' },
			CreatedAt: { type: 'string' },
			UpdatedAt: { type: 'string' }
		}
	};

	static relationMappings = () => ({
		ratings: {
			relation: Model.HasManyRelation,
			modelClass: GuessWordGuessRating,
			join: {
				from: 'GuessWordGuess.Id',
				to: 'GuessWordGuessRating.GuessWordGuessId'
			}
		}
	});

	$beforeInsert() {
		const now = new Date(Date.now());
		this.CreatedAt = mySqlDateFormat(now);
		this.UpdatedAt = mySqlDateFormat(now);
	}

	$beforeUpdate() {
		const now = new Date(Date.now());
		this.UpdatedAt = mySqlDateFormat(now);
	}
}

export default GuessWordGuess;
