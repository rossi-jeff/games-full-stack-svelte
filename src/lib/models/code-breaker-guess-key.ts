import { mySqlDateFormat } from '$lib/mysql-date-format';
import { Model } from 'objection';
import { Key } from '../enum/key.enum';

class CodeBreakerGuessKey extends Model {
	[x: string]: any; // eslint-disable-line
	CodeBreakerGuessId!: number;
	Key!: Key;
	CreatedAt!: string;
	UpdatedAt!: string;

	static tableName = 'CodeBreakerGuessKey';

	static idColumn = 'Id';

	static jsonSchema = {
		type: 'object',
		properties: {
			Id: { type: 'integer' },
			CodeBreakerGuessId: { type: ['integer'] },
			Key: { type: 'string', enum: Object.values(Key) },
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

export default CodeBreakerGuessKey;
