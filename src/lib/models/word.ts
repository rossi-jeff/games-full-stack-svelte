import { mySqlDateFormat } from '$lib/mysql-date-format';
import { Model } from 'objection';

class Word extends Model {
	[x: string]: any; // eslint-disable-line
	Word!: string;
	Length!: number;
	CreatedAt!: string;
	UpdatedAt!: string;

	static tableName = 'Word';

	static idColumn = 'Id';

	static jsonSchema = {
		type: 'object',
		properties: {
			Id: { type: 'integer' },
			Word: { type: 'string' },
			Length: { type: 'integer' },
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

export default Word;
