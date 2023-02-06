import { Navy } from '$lib/enum/navy.enum';
import { ShipType } from '$lib/enum/ship-type.enum';
import { mySqlDateFormat } from '$lib/mysql-date-format';
import { Model } from 'objection';
import SeaBattleShipGridPoint from './sea-battle-ship-grid-point';
import SeaBattleShipHit from './sea-battle-ship-hit';

class SeaBattleShip extends Model {
	[x: string]: any; // eslint-disable-line
	SeaBattleId!: number;
	Type!: ShipType;
	Navy!: Navy;
	Size?: number;
	Sunk?: boolean;
	CreatedAt!: string;
	UpdatedAt!: string;

	static tableName = 'SeaBattleShip';

	static idColumn = 'Id';

	static jsonSchema = {
		type: 'object',
		properties: {
			Id: { type: 'integer' },
			SeaBattleId: { type: 'integer' },
			Type: { type: 'string', enum: Object.values(ShipType) },
			Navy: { type: 'string', enum: Object.values(Navy) },
			Size: { type: ['integer', 'null'] },
			Sunk: { type: ['boolean', 'null'] },
			CreatedAt: { type: 'string' },
			UpdatedAt: { type: 'string' }
		}
	};

	static relationMappings = () => ({
		gridPoints: {
			relation: Model.HasManyRelation,
			modelClass: SeaBattleShipGridPoint,
			join: {
				from: 'SeaBattleShip.Id',
				to: 'SeaBattleShipGridPoint.SeaBattleShipId'
			}
		},
		hits: {
			relation: Model.HasManyRelation,
			modelClass: SeaBattleShipHit,
			join: {
				from: 'SeaBattleShip.Id',
				to: 'SeaBattleShipHit.SeaBattleShipId'
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

export default SeaBattleShip;
