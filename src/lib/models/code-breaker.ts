import { Model } from 'objection';
import { GameStatus } from '../enum/game-status.enum';
import CodeBreakerCode from './code-breaker-code';
import CodeBreakerGuess from './code-breaker-guess';

class CodeBreaker extends Model {
	[x: string]: any; // eslint-disable-line
	UserId?: number;
	Status!: GameStatus;
	Columns!: number;
	Colors!: number;
	Score!: number;
	CreatedAt!: string;
	UpdatedAt!: string;

	codes?: CodeBreakerCode[];
	guesses?: CodeBreakerGuess[];

	static tableName = 'CodeBreaker';

	static idColumn = 'Id';

	static jsonSchema = {
		type: 'object',
		properties: {
			Id: { type: 'integer' },
			UserId: { type: ['integer', 'null'] },
			Status: { type: 'string', enum: Object.values(GameStatus), default: GameStatus.Playing },
			Columns: { type: ['integer'] },
			Colors: { type: ['integer'] },
			Score: { type: ['integer'] },
			CreatedAt: { type: 'string' },
			UpdatedAt: { type: 'string' }
		}
	};

	static relationMappings = () => ({
		codes: {
			relation: Model.HasManyRelation,
			modelClass: CodeBreakerCode,
			join: {
				from: 'CodeBreaker.Id',
				to: 'CodeBreakerCode.CodeBreakerId'
			}
		},

		guesses: {
			relation: Model.HasManyRelation,
			modelClass: CodeBreakerGuess,
			join: {
				from: 'CodeBreaker.Id',
				to: 'CodeBreakerGuess.CodeBreakerId'
			}
		}
	});

	$beforeInsert() {
		const now = new Date().toISOString();
		this.CreatedAt = now;
		this.UpdatedAt = now;
	}

	$beforeUpdate() {
		this.UpdatedAt = new Date().toISOString();
	}
}

export default CodeBreaker;
