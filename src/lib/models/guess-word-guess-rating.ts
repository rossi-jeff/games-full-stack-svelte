import { Model } from 'objection';
import { Rating } from '../enum/rating.enum';
import { mySqlDateFormat } from '../mysql-date-format';

class GuessWordGuessRating extends Model {
	[x: string]: any; // eslint-disable-line
	GuessWordGuessId!: number;
	Rating!: Rating;
	CreatedAt!: string;
	UpdatedAt!: string;

	static tableName = 'GuessWordGuessRating';

	static idColumn = 'Id';

	static jsonSchema = {
		type: 'object',
		properties: {
			Id: { type: 'integer' },
			GuessWordGuessId: { type: 'integer' },
			Rating: { type: 'string', enum: Object.values(Rating) },
			CreatedAt: { type: 'string' },
			UpdatedAt: { type: 'string' }
		}
	};

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

export default GuessWordGuessRating;
