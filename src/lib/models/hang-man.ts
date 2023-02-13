import { GameStatus } from '$lib/enum/game-status.enum';
import { mySqlDateFormat } from '$lib/mysql-date-format';
import { Model } from 'objection';
import User from './user';
import Word from './word';

class HangMan extends Model {
	[x: string]: any; // eslint-disable-line
	WordId!: number;
	UserId?: number;
	Correct!: string;
	Wrong!: string;
	Status!: GameStatus;
	Score!: number;
	CreatedAt!: string;
	UpdatedAt!: string;

	static tableName = 'HangMan';

	static idColumn = 'Id';

	static jsonSchema = {
		type: 'object',
		properties: {
			Id: { type: 'integer' },
			WordId: { type: 'integer' },
			UserId: { type: ['integer', 'null'] },
			Correct: { type: 'string' },
			Wrong: { type: 'string' },
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
				from: 'HangMan.WordId',
				to: 'Word.Id'
			}
		},

		user: {
			relation: Model.BelongsToOneRelation,
			modelClass: User,
			join: {
				from: 'HangMan.UserId',
				to: 'User.Id'
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

export default HangMan;
