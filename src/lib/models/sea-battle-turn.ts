import { Navy } from '$lib/enum/navy.enum';
import { ShipType } from '$lib/enum/ship-type.enum';
import { Target } from '$lib/enum/target.enum';
import { mySqlDateFormat } from '$lib/mysql-date-format';
import { Model } from 'objection';
import SeaBattleTurnGridPoint from './sea-battle-turn-grid-point';

class SeaBattleTurn extends Model {
	[x: string]: any; // eslint-disable-line
	SeaBattleId!: number;
	ShipType!: ShipType;
	Navy!: Navy;
	Target!: Target;
	CreatedAt!: string;
	UpdatedAt!: string;

	static tableName = 'SeaBattleTurn';

	static idColumn = 'Id';

	static jsonSchema = {
		type: 'object',
		properties: {
			Id: { type: 'integer' },
			SeaBattleId: { type: 'integer' },
			ShipType: { type: 'string', enum: Object.values(ShipType) },
			Navy: { type: 'string', enum: Object.values(Navy) },
			Target: { type: 'string', enum: Object.values(Target) },
			CreatedAt: { type: 'string' },
			UpdatedAt: { type: 'string' }
		}
	};

	static relationMappings = () => ({
		gridPoint: {
			relation: Model.HasOneRelation,
			modelClass: SeaBattleTurnGridPoint,
			join: {
				from: 'SeaBattleShip.Id',
				to: 'SeaBattleTurnGridPoint.SeaBattleTurnId'
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

export default SeaBattleTurn;
