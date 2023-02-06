import { mySqlDateFormat } from '$lib/mysql-date-format';
import { Model } from 'objection';

class SeaBattleShipHit extends Model {
	[x: string]: any; // eslint-disable-line
	SeaBattleShipId!: number;
	Horizontal?: string;
	Vertical?: number;
	CreatedAt!: string;
	UpdatedAt!: string;

	static tableName = 'SeaBattleShipHit';

	static idColumn = 'Id';

	static jsonSchema = {
		type: 'object',
		properties: {
			Id: { type: 'integer' },
			SeaBattleShipId: { type: 'integer' },
			Horizontal: { type: ['string', 'null'] },
			Vertical: { type: ['integer', 'null'] },
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

export default SeaBattleShipHit;
