import { mySqlDateFormat } from '$lib/mysql-date-format';
import { Model } from 'objection';
import CodeBreakerGuessColor from './code-breaker-guess-color';
import CodeBreakerGuessKey from './code-breaker-guess-key';

class CodeBreakerGuess extends Model {
	[x: string]: any; // eslint-disable-line
	CodeBreakerId!: number;
	CreatedAt!: string;
	UpdatedAt!: string;

	colors?: CodeBreakerGuessColor[];
	keys?: CodeBreakerGuessKey[];

	static tableName = 'CodeBreakerGuess';

	static idColumn = 'Id';

	static jsonSchema = {
		type: 'object',
		properties: {
			Id: { type: 'integer' },
			CodeBreakerId: { type: ['integer'] },
			CreatedAt: { type: 'string' },
			UpdatedAt: { type: 'string' }
		}
	};

	static relationMappings = () => ({
		colors: {
			relation: Model.HasManyRelation,
			modelClass: CodeBreakerGuessColor,
			join: {
				from: 'CodeBreakerGuess.Id',
				to: 'CodeBreakerGuessColor.CodeBreakerGuessId'
			}
		},

		keys: {
			relation: Model.HasManyRelation,
			modelClass: CodeBreakerGuessKey,
			join: {
				from: 'CodeBreakerGuess.Id',
				to: 'CodeBreakerGuessKey.CodeBreakerGuessId'
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

export default CodeBreakerGuess;
