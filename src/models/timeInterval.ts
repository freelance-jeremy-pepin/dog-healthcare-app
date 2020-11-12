import { BaseModel } from 'src/models/baseModel';
import { unitOfTime } from 'moment';
import { Reminder } from 'src/models/reminder';

export enum TimeIntervalInternaLabel {
    year = 'year',
    month = 'month',
    day = 'day',
}

export interface TimeInterval extends BaseModel {
    internalLabel: string;
    displayLabel: string;
    format?: unitOfTime.Base;
    reminders?: Reminder[];
}

export function createDefaultTimeInterval(): TimeInterval {
    return {
        id: undefined,
        internalLabel: '',
        displayLabel: '',
        format: undefined,
        reminders: undefined,
        createdAt: undefined,
        updatedAt: undefined,
    };
}
