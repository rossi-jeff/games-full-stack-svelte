import { GameStatus } from "$lib/enum/game-status.enum";
import { mySqlDateFormat } from "$lib/mysql-date-format";
import { Model } from "objection";
import User from "./user";
import TenGrandTurn from "./ten-grand-turn"

class TenGrand extends Model {
    [x: string]: any; // eslint-disable-line
    UserId?: number;
    Status!: GameStatus;
    Score!: number;
    CreatedAt!: string;
    UpdatedAt!: string;

    static tableName = 'TenGrand';

    static idColumn = 'Id';

    static jsonSchema = {
        type: 'object',
        properties: {
            Id: { type: 'integer' },
            UserId: { type: ['integer', 'null'] },
            Status: { type: 'string', enum: Object.values(GameStatus), default: GameStatus.Playing },
            Score: { type: 'integer', default: 0 },
            CreatedAt: { type: 'string' },
            UpdatedAt: { type: 'string' }
        }
    };

    static relationMappings = () => ({
        user: {
            relation: Model.BelongsToOneRelation,
            modelClass: User,
            join: {
                from: 'TenGrand.UserId',
                to: 'User.Id'
            }
        },
        turns: {
            relation: Model.HasManyRelation,
            modelClass: TenGrandTurn,
            join: {
                from: 'TenGrand.Id',
                to: 'TenGrandTurn.TenGrandId'
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

export default TenGrand;