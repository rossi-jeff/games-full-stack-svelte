import { YachtCategory } from '$lib/enum/yacht-category.enum';
import { mySqlDateFormat } from '$lib/mysql-date-format';
import { Model } from 'objection';

class YachtTurn extends Model {
	[x: string]: any; // eslint-disable-line
	YachtId!: number;
	RollOne?: string;
	RollTwo?: string;
	RollThree?: string;
	Category?: YachtCategory;
	Score?: number;
	CreatedAt!: string;
	UpdatedAt!: string;

	static tableName = 'YachtTurn';

	static idColumn = 'Id';

	static jsonSchema = {
		type: 'object',
		properties: {
			Id: { type: 'integer' },
			YachtId: { type: 'integer' },
			RollOne: { type: ['string', 'null'] },
			RollTwo: { type: ['string', 'null'] },
			RollThree: { type: ['string', 'null'] },
			Category: { type: ['string', 'null'], enum: Object.values(YachtCategory) },
			Score: { type: ['integer', 'null'], default: 0 },
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

export default YachtTurn;
