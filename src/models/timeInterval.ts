import { BaseModel } from 'src/models/baseModel';

export interface TimeInterval extends BaseModel {
  internalLabel: string;
  displayLabel: string;
  format: string;
}
