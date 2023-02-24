import { Model } from "objection";
import { mySqlDateFormat } from "../mysql-date-format";
import { TenGrandCategory } from '../enum/ten-grand-category.enum'

class TenGrandScore extends Model {
    [x: string]: any; // eslint-disable-line
    TenGrandTurnId!: number;
    Dice?: number;
    Category!: TenGrandCategory;
    Score!: number;
    CreatedAt!: string;
    UpdatedAt!: string;

    static tableName = 'TenGrandScore';

    static idColumn = 'Id';

    static jsonSchema = {
        type: 'object',
        properties: {
            Id: { type: 'integer' },
            TenGrandTurnId: { type: 'integer' },
            Dice: { type: ['string', 'null'] },
            Category: { type: ['string', 'null'], enum: Object.values(TenGrandCategory) },
            Score: { type: 'integer', default: 0 },
            CreatedAt: { type: 'string' },
            UpdatedAt: { type: 'string' }
        }
    };

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

export default TenGrandScore;