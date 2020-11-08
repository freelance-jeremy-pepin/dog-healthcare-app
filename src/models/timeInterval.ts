import { BaseModel } from 'src/models/baseModel';
import { unitOfTime } from 'moment';

export enum TimeIntervalInternaLabel {
    year = 'year',
    month = 'month',
    day = 'day',
}

export interface TimeInterval extends BaseModel {
    internalLabel: string;
    displayLabel: string;
    format: unitOfTime.Base;
}
