import { mySqlDateFormat } from '$lib/mysql-date-format';
import { Model } from 'objection';
import { Color } from '../enum/color.enum';

class CodeBreakerCode extends Model {
	[x: string]: any; // eslint-disable-line
	CodeBreakerId!: number;
	Color!: Color;
	CreatedAt!: string;
	UpdatedAt!: string;

	static tableName = 'CodeBreakerCode';

	static idColumn = 'Id';

	static jsonSchema = {
		type: 'object',
		properties: {
			Id: { type: 'integer' },
			CodeBreakerId: { type: ['integer'] },
			Color: { type: 'string', enum: Object.values(Color) },
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

	// static relationMappings = () => ({});
}

export default CodeBreakerCode;
