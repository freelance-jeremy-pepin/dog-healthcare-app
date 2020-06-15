import { BaseModel } from 'src/models/baseModel';

export enum TimeIntervalInternaLabel {
  year = 'year',
  month = 'month',
  day = 'day',
}

export interface TimeInterval extends BaseModel {
  internalLabel: string;
  displayLabel: string;
  format: string;
}
