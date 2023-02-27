import { Model } from "objection";
import { mySqlDateFormat } from "../mysql-date-format";
import TenGrandScore from "./ten-grand-score"

class TenGrandTurn extends Model {
    [x: string]: any; // eslint-disable-line
    TenGrandId!: number
    Score!: number;
    CreatedAt!: string;
    UpdatedAt!: string;

    static tableName = 'TenGrandTurn';

    static idColumn = 'Id';

    static jsonSchema = {
        type: 'object',
        properties: {
            Id: { type: 'integer' },
            TenGrandId: { type: 'integer' },
            Score: { type: 'integer', default: 0 },
            CreatedAt: { type: 'string' },
            UpdatedAt: { type: 'string' }
        }
    };

    static relationMappings = () => ({
        scores: {
            relation: Model.HasManyRelation,
            modelClass: TenGrandScore,
            join: {
                from: 'TenGrandTurn.Id',
                to: 'TenGrandScore.TenGrandTurnId'
            }
        }
    });

    beforeInsert() {
        const now = new Date(Date.now());
        this.CreatedAt = mySqlDateFormat(now);
        this.UpdatedAt = mySqlDateFormat(now);
    }

    $beforeUpdate() {
        const now = new Date(Date.now());
        this.UpdatedAt = mySqlDateFormat(now);
    }
}

export default TenGrandTurn;