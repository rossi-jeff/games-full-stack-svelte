import { Model } from 'objection';
import { mySqlDateFormat } from '../mysql-date-format';
import User from './user';
import { GameStatus } from '../enum/game-status.enum';

class Concentration extends Model {
	[x: string]: any; // eslint-disable-line
	UserId?: number;
	Status!: GameStatus;
	Moves!: number;
	Matched!: number;
	Elapsed!: number;
	CreatedAt!: string;
	UpdatedAt!: string;

	static tableName = 'Concentration';

	static idColumn = 'Id';

	static jsonSchema = {
		type: 'object',
		properties: {
			Id: { type: 'integer' },
			UserId: { type: ['integer', 'null'] },
			Status: { type: 'string', enum: Object.values(GameStatus), default: GameStatus.Playing },
			Moves: { type: 'integer' },
			Matched: { type: 'integer' },
			Elapsed: { type: 'integer' },
			CreatedAt: { type: 'string' },
			UpdatedAt: { type: 'string' }
		}
	};

	static relationMappings = () => ({
		user: {
			relation: Model.BelongsToOneRelation,
			modelClass: User,
			join: {
				from: 'Concentration.UserId',
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

export default Concentration;
