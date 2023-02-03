import { Model } from 'objection';
import { GameStatus } from '../enum/game-status.enum';
import { mySqlDateFormat } from '../mysql-date-format';
import GuessWordGuess from './guess-word-guess';
import Word from './word';

class GuessWord extends Model {
	[x: string]: any; // eslint-disable-line
	WordId!: number;
	UserId?: number;
	Status!: GameStatus;
	Score!: number;
	CreatedAt!: string;
	UpdatedAt!: string;

	static tableName = 'GuessWord';

	static idColumn = 'Id';

	static jsonSchema = {
		type: 'object',
		properties: {
			Id: { type: 'integer' },
			WordId: { type: 'integer' },
			UserId: { type: ['integer', 'null'] },
			Status: { type: 'string', enum: Object.values(GameStatus), default: GameStatus.Playing },
			Score: { type: ['integer'], default: 0 },
			CreatedAt: { type: 'string' },
			UpdatedAt: { type: 'string' }
		}
	};

	static relationMappings = () => ({
		word: {
			relation: Model.BelongsToOneRelation,
			modelClass: Word,
			join: {
				from: 'GuessWord.WordId',
				to: 'Word.Id'
			}
		},

		guesses: {
			relation: Model.HasManyRelation,
			modelClass: GuessWordGuess,
			join: {
				from: 'GuessWord.Id',
				to: 'GuessWordGuess.GuessWordId'
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

export default GuessWord;
