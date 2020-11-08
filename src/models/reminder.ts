import { BaseModel } from 'src/models/baseModel';
import { TimeInterval } from 'src/models/timeInterval';

export enum ReminderTableName {
    deworming = 'deworming',
    antiParasitic = 'anti_parasitic',
}

export interface Reminder extends BaseModel {
    dog: string;
    timeInterval: string;
    numberTimeInterval: number;
    tableName: ReminderTableName;
    nextReminder: string;
    timeIntervalDetails?: TimeInterval;
}
