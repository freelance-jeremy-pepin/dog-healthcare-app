import { BaseModel } from 'src/models/baseModel';
import { TimeInterval } from 'src/models/timeInterval';
import { Dog } from 'src/models/dog';

export enum ReminderTableName {
    deworming = 'deworming',
    antiParasitic = 'anti-parasitic',
}

export interface Reminder extends BaseModel {
    timeIntervalId: number;
    dogId: number;
    numberTimeInterval: number;
    tableName?: ReminderTableName;
    nextReminder: string;
    timeInterval?: TimeInterval;
    dog?: Dog;
}

export function createDefaultReminder(): Reminder {
    return {
        id: undefined,
        timeIntervalId: 0,
        dogId: 0,
        numberTimeInterval: 0,
        tableName: undefined,
        nextReminder: '',
        timeInterval: undefined,
        dog: undefined,
        createdAt: undefined,
        updatedAt: undefined,
    };
}
