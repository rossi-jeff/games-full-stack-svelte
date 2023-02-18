import { Model } from "objection";
import { mySqlDateFormat } from "../mysql-date-format";
import User from "./user";
import { GameStatus } from '../enum/game-status.enum';

class FreeCell extends Model {
    [x: string]: any; // eslint-disable-line
    UserId?: number;
    Status!: GameStatus;
    Moves!: number;
    Elapsed!: number;
    CreatedAt!: string;
    UpdatedAt!: string;

    static tableName = 'FreeCell';

    static idColumn = 'Id';

    static jsonSchema = {
        type: 'object',
        properties: {
            Id: { type: 'integer' },
            UserId: { type: ['integer', 'null'] },
            Status: { type: 'string', enum: Object.values(GameStatus), default: GameStatus.Playing },
            Moves: { type: 'integer' },
            Elapsed: { type: 'integer' },
            CreatedAt: { type: 'string' },
            UpdatedAt: { type: 'string' }
        }
    }

    static relationMappings = () => ({
        user: {
            relation: Model.BelongsToOneRelation,
            modelClass: User,
            join: {
                from: 'FreeCell.UserId',
                to: 'User.Id'
            }
        }
    })

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