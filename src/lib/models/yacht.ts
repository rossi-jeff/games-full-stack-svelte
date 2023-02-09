import { mySqlDateFormat } from '$lib/mysql-date-format';
import { Model } from 'objection';
import YachtTurn from './yacht-turn';

class Yacht extends Model {
	[x: string]: any; // eslint-disable-line
	UserId?: number;
	Total?: number;
	NumTurns?: number;
	CreatedAt!: string;
	UpdatedAt!: string;

	static tableName = 'Yacht';

	static idColumn = 'Id';

	static jsonSchema = {
		type: 'object',
		properties: {
			Id: { type: 'integer' },
			UserId: { type: ['integer', 'null'] },
			Total: { type: ['integer', 'null'], default: 0 },
			NumTurns: { type: ['integer', 'null'], default: 0 },
			CreatedAt: { type: 'string' },
			UpdatedAt: { type: 'string' }
		}
	};

	static relationMappings = () => ({
		turns: {
			relation: Model.HasManyRelation,
			modelClass: YachtTurn,
			join: {
				from: 'Yacht.Id',
				to: 'YachtTurn.YachtId'
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

export default Yacht;
