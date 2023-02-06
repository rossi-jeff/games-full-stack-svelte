import { GameStatus } from '$lib/enum/game-status.enum';
import { mySqlDateFormat } from '$lib/mysql-date-format';
import { Model } from 'objection';
import SeaBattleShip from './sea-battle-ship';
import SeaBattleTurn from './sea-battle-turn';

class SeaBattle extends Model {
	[x: string]: any; // eslint-disable-line
	Axis!: number;
	UserId?: number;
	Status!: GameStatus;
	Score!: number;
	CreatedAt!: string;
	UpdatedAt!: string;

	static tableName = 'SeaBattle';

	static idColumn = 'Id';

	static jsonSchema = {
		type: 'object',
		properties: {
			Id: { type: 'integer' },
			Axis: { type: 'integer' },
			UserId: { type: ['integer', 'null'] },
			Status: { type: 'string', enum: Object.values(GameStatus), default: GameStatus.Playing },
			Score: { type: ['integer'], default: 0 },
			CreatedAt: { type: 'string' },
			UpdatedAt: { type: 'string' }
		}
	};

	static relationMappings = () => ({
		ships: {
			relation: Model.HasManyRelation,
			modelClass: SeaBattleShip,
			join: {
				from: 'SeaBattle.Id',
				to: 'SeaBattleShip.SeaBattleId'
			}
		},
		turns: {
			relation: Model.HasManyRelation,
			modelClass: SeaBattleTurn,
			join: {
				from: 'SeaBattle.Id',
				to: 'SeaBattleTurn.SeaBattleId'
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

export default SeaBattle;
