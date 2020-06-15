import { BaseModel } from 'src/models/baseModel';
import { TimeInterval } from 'src/models/timeInterval';

export enum ReminderTableName {
  deworming = 'deworming',
}

export interface Reminder extends BaseModel {
  dog: string;
  timeInterval: TimeInterval;
  numberTimeInterval: number;
  tableName: ReminderTableName;
  nextReminder: string;
}
