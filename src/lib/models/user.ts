import { Model } from 'objection';
import { mySqlDateFormat } from '../mysql-date-format';

class User extends Model {
	[x: string]: any; // eslint-disable-line
	UserName!: string;
	CreatedAt!: string;
	UpdatedAt!: string;
	static tableName = 'User';

	static idColumn = 'Id';

	static jsonSchema = {
		type: 'object',
		properties: {
			Id: { type: 'integer' },
			UserName: { type: 'string' },
			HashedPassWord: { type: 'string' },
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

export default User;
